import db from '../config/db.js';
import { ApiError, asyncHandler, apiResponse } from '../utils/helpers.js';
import { sendEmail, emailTemplates } from '../utils/email.js';

/**
 * @desc    Create new complaint
 * @route   POST /api/complaints
 * @access  Private (User)
 */
export const createComplaint = asyncHandler(async (req, res) => {
  const { title, category, department, priority, description, location } = req.body;

  const newComplaint = {
    _id: db.generateId(),
    title,
    category,
    department,
    priority: priority || 'Medium',
    description,
    location: location || '',
    status: 'Submitted',
    userId: req.user._id,
    assignedTo: null,
    attachments: req.files ? req.files.map((f) => ({
      filename: f.filename,
      originalName: f.originalname,
      path: f.path,
      size: f.size,
      mimetype: f.mimetype,
    })) : [],
    timeline: [
      {
        status: 'Submitted',
        date: new Date().toISOString(),
        note: 'Complaint registered successfully.',
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.complaints.push(newComplaint);

  // Send notification email
  const user = db.users.find((u) => u._id === req.user._id);
  if (user) {
    sendEmail({
      to: user.email,
      ...emailTemplates.complaintRegistered(newComplaint),
    }).catch(console.error);
  }

  // Create in-app notification
  db.notifications.push({
    _id: db.generateId(),
    userId: req.user._id,
    type: 'complaint_created',
    title: 'Complaint Registered',
    message: `Your complaint "${title}" has been submitted successfully.`,
    read: false,
    complaintId: newComplaint._id,
    createdAt: new Date().toISOString(),
  });

  apiResponse(res, 201, newComplaint, 'Complaint created successfully');
});

/**
 * @desc    Get all complaints for current user
 * @route   GET /api/complaints
 * @access  Private (User)
 */
export const getMyComplaints = asyncHandler(async (req, res) => {
  const { status, priority, category, search, sort, page = 1, limit = 10 } = req.query;

  let complaints = db.complaints.filter((c) => c.userId === req.user._id);

  // Filters
  if (status) complaints = complaints.filter((c) => c.status === status);
  if (priority) complaints = complaints.filter((c) => c.priority === priority);
  if (category) complaints = complaints.filter((c) => c.category === category);
  if (search) {
    const s = search.toLowerCase();
    complaints = complaints.filter(
      (c) => c.title.toLowerCase().includes(s) || c.description.toLowerCase().includes(s)
    );
  }

  // Sort
  complaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Pagination
  const total = complaints.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginated = complaints.slice(startIndex, endIndex);

  apiResponse(res, 200, {
    complaints: paginated,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * @desc    Get complaint by ID
 * @route   GET /api/complaints/:id
 * @access  Private
 */
export const getComplaintById = asyncHandler(async (req, res) => {
  const complaint = db.complaints.find((c) => c._id === req.params.id);

  if (!complaint) {
    throw new ApiError(404, 'Complaint not found');
  }

  // Users can only see their own complaints
  if (req.user.role !== 'admin' && complaint.userId !== req.user._id) {
    throw new ApiError(403, 'Not authorized to view this complaint');
  }

  // Attach user info
  const user = db.users.find((u) => u._id === complaint.userId);
  const complaintWithUser = {
    ...complaint,
    user: user ? { _id: user._id, name: user.name, email: user.email } : null,
  };

  apiResponse(res, 200, complaintWithUser);
});

/**
 * @desc    Update own complaint (before it's assigned)
 * @route   PUT /api/complaints/:id
 * @access  Private (User - owner only)
 */
export const updateComplaint = asyncHandler(async (req, res) => {
  const complaintIndex = db.complaints.findIndex((c) => c._id === req.params.id);

  if (complaintIndex === -1) {
    throw new ApiError(404, 'Complaint not found');
  }

  const complaint = db.complaints[complaintIndex];

  if (complaint.userId !== req.user._id) {
    throw new ApiError(403, 'Not authorized to update this complaint');
  }

  if (!['Submitted', 'Under Review'].includes(complaint.status)) {
    throw new ApiError(400, 'Cannot modify complaint once it is assigned or in progress');
  }

  const { title, category, department, priority, description, location } = req.body;

  if (title) complaint.title = title;
  if (category) complaint.category = category;
  if (department) complaint.department = department;
  if (priority) complaint.priority = priority;
  if (description) complaint.description = description;
  if (location) complaint.location = location;
  complaint.updatedAt = new Date().toISOString();

  db.complaints[complaintIndex] = complaint;

  apiResponse(res, 200, complaint, 'Complaint updated');
});

/**
 * @desc    Delete own complaint (only if still Submitted)
 * @route   DELETE /api/complaints/:id
 * @access  Private (User - owner only)
 */
export const deleteComplaint = asyncHandler(async (req, res) => {
  const complaintIndex = db.complaints.findIndex((c) => c._id === req.params.id);

  if (complaintIndex === -1) {
    throw new ApiError(404, 'Complaint not found');
  }

  const complaint = db.complaints[complaintIndex];

  if (complaint.userId !== req.user._id && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to delete this complaint');
  }

  if (complaint.status !== 'Submitted' && req.user.role !== 'admin') {
    throw new ApiError(400, 'Can only delete complaints with Submitted status');
  }

  db.complaints.splice(complaintIndex, 1);

  apiResponse(res, 200, null, 'Complaint deleted');
});

/**
 * @desc    Get user stats
 * @route   GET /api/complaints/stats
 * @access  Private
 */
export const getMyStats = asyncHandler(async (req, res) => {
  const complaints = db.complaints.filter((c) => c.userId === req.user._id);

  const stats = {
    total: complaints.length,
    submitted: complaints.filter((c) => c.status === 'Submitted').length,
    underReview: complaints.filter((c) => c.status === 'Under Review').length,
    assigned: complaints.filter((c) => c.status === 'Assigned').length,
    inProgress: complaints.filter((c) => c.status === 'In Progress').length,
    resolved: complaints.filter((c) => c.status === 'Resolved').length,
    closed: complaints.filter((c) => c.status === 'Closed').length,
  };

  apiResponse(res, 200, stats);
});
