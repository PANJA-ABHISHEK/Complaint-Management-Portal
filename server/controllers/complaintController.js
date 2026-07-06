import Complaint from '../models/Complaint.js';
import Department from '../models/Department.js';
import Notification from '../models/Notification.js';
import ActivityLog from '../models/ActivityLog.js';
import User from '../models/User.js';
import { ApiError, asyncHandler, apiResponse } from '../utils/helpers.js';
import { sendEmail, emailTemplates } from '../utils/email.js';

/**
 * @desc    Create new complaint
 * @route   POST /api/complaints
 * @access  Private (User)
 */
export const createComplaint = asyncHandler(async (req, res) => {
  const { title, category, department: deptName, priority, description, location } = req.body;

  // Lookup department
  const dept = await Department.findOne({ name: deptName });

  const complaint = await Complaint.create({
    title,
    category,
    departmentName: deptName,
    department: dept ? dept._id : null,
    priority: priority || 'Medium',
    description,
    location: location || '',
    userId: req.user._id,
    attachments: req.files
      ? req.files.map((f) => ({
          filename: f.filename,
          originalName: f.originalname,
          path: f.path,
          size: f.size,
          mimetype: f.mimetype,
        }))
      : [],
  });

  // Notification
  await Notification.create({
    userId: req.user._id,
    type: 'complaint_created',
    title: 'Complaint Registered',
    message: `Your complaint "${title}" (${complaint.complaintId}) has been submitted.`,
    complaintId: complaint._id,
    actionUrl: `/user/complaints/${complaint._id}`,
  });

  // Email (non-blocking)
  const user = await User.findById(req.user._id);
  if (user) {
    sendEmail({ to: user.email, ...emailTemplates.complaintRegistered(complaint) }).catch(console.error);
  }

  // Activity log
  ActivityLog.log({
    userId: req.user._id,
    action: 'COMPLAINT_CREATED',
    resource: 'Complaint',
    resourceId: complaint._id,
    description: `Created complaint: ${title} (${complaint.complaintId})`,
    ipAddress: req.ip,
  }).catch(console.error);

  apiResponse(res, 201, complaint, 'Complaint created successfully');
});

/**
 * @desc    Get my complaints (with filter, search, pagination)
 * @route   GET /api/complaints
 * @access  Private (User)
 */
export const getMyComplaints = asyncHandler(async (req, res) => {
  const { status, priority, category, search, page = 1, limit = 10, sort = '-createdAt' } = req.query;

  const filter = { userId: req.user._id };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (category) filter.category = category;
  if (search) filter.$text = { $search: search };

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [complaints, total] = await Promise.all([
    Complaint.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('assignedTo', 'name email')
      .lean(),
    Complaint.countDocuments(filter),
  ]);

  apiResponse(res, 200, {
    complaints,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

/**
 * @desc    Get complaint by ID
 * @route   GET /api/complaints/:id
 * @access  Private
 */
export const getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate('userId', 'name email phone')
    .populate('assignedTo', 'name email')
    .populate('department', 'name code contactEmail')
    .populate('timeline.updatedBy', 'name role')
    .populate('resolution.resolvedBy', 'name');

  if (!complaint) throw new ApiError(404, 'Complaint not found');

  // Only owner or admin can view
  if (req.user.role === 'user' && complaint.userId._id.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to view this complaint');
  }

  apiResponse(res, 200, complaint);
});

/**
 * @desc    Update own complaint (only Submitted/Under Review)
 * @route   PUT /api/complaints/:id
 * @access  Private (User - owner only)
 */
export const updateComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) throw new ApiError(404, 'Complaint not found');

  if (complaint.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to update this complaint');
  }

  if (!['Submitted', 'Under Review'].includes(complaint.status)) {
    throw new ApiError(400, 'Cannot modify a complaint that is already being processed');
  }

  const { title, category, departmentName, priority, description, location } = req.body;
  if (title) complaint.title = title;
  if (category) complaint.category = category;
  if (departmentName) complaint.departmentName = departmentName;
  if (priority) complaint.priority = priority;
  if (description) complaint.description = description;
  if (location) complaint.location = location;

  await complaint.save();

  ActivityLog.log({
    userId: req.user._id,
    action: 'COMPLAINT_UPDATED',
    resource: 'Complaint',
    resourceId: complaint._id,
    description: `Updated complaint: ${complaint.complaintId}`,
  }).catch(console.error);

  apiResponse(res, 200, complaint, 'Complaint updated');
});

/**
 * @desc    Delete complaint (Submitted only, owner or admin)
 * @route   DELETE /api/complaints/:id
 * @access  Private
 */
export const deleteComplaint = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) throw new ApiError(404, 'Complaint not found');

  if (req.user.role !== 'admin' && complaint.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to delete this complaint');
  }

  if (req.user.role !== 'admin' && complaint.status !== 'Submitted') {
    throw new ApiError(400, 'Can only delete Submitted complaints');
  }

  await complaint.deleteOne();

  ActivityLog.log({
    userId: req.user._id,
    action: 'COMPLAINT_DELETED',
    resource: 'Complaint',
    resourceId: complaint._id,
    description: `Deleted complaint: ${complaint.complaintId}`,
  }).catch(console.error);

  apiResponse(res, 200, null, 'Complaint deleted');
});

/**
 * @desc    Submit feedback for resolved complaint
 * @route   POST /api/complaints/:id/feedback
 * @access  Private (User - owner only)
 */
export const submitFeedback = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) throw new ApiError(404, 'Complaint not found');

  if (complaint.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized');
  }

  if (!['Resolved', 'Closed'].includes(complaint.status)) {
    throw new ApiError(400, 'Feedback can only be submitted for resolved complaints');
  }

  if (complaint.feedback.rating) {
    throw new ApiError(400, 'Feedback already submitted');
  }

  complaint.feedback = { rating, comment: comment || '', submittedAt: new Date() };
  await complaint.save();

  apiResponse(res, 200, complaint, 'Thank you for your feedback!');
});

/**
 * @desc    Get my complaint stats
 * @route   GET /api/complaints/stats
 * @access  Private
 */
export const getMyStats = asyncHandler(async (req, res) => {
  const stats = await Complaint.aggregate([
    { $match: { userId: req.user._id } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const total = await Complaint.countDocuments({ userId: req.user._id });

  const breakdown = stats.reduce((acc, s) => {
    acc[s._id] = s.count;
    return acc;
  }, {});

  apiResponse(res, 200, {
    total,
    submitted: breakdown['Submitted'] || 0,
    underReview: breakdown['Under Review'] || 0,
    assigned: breakdown['Assigned'] || 0,
    inProgress: breakdown['In Progress'] || 0,
    resolved: breakdown['Resolved'] || 0,
    closed: breakdown['Closed'] || 0,
  });
});
