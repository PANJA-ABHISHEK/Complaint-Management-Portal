import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import Department from '../models/Department.js';
import Notification from '../models/Notification.js';
import ActivityLog from '../models/ActivityLog.js';
import Report from '../models/Report.js';
import { ApiError, asyncHandler, apiResponse } from '../utils/helpers.js';
import { sendEmail, emailTemplates } from '../utils/email.js';

// ─────────────────────────────────────────────
//  COMPLAINT MANAGEMENT
// ─────────────────────────────────────────────

/**
 * @desc    Get all complaints (admin view, full filter/search/pagination)
 * @route   GET /api/admin/complaints
 * @access  Private (Admin)
 */
export const getAllComplaints = asyncHandler(async (req, res) => {
  const {
    status, priority, category, department,
    search, page = 1, limit = 20, sort = '-createdAt',
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (category) filter.category = category;
  if (department) filter.departmentName = new RegExp(department, 'i');
  if (search) filter.$text = { $search: search };

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [complaints, total] = await Promise.all([
    Complaint.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email phone')
      .populate('assignedTo', 'name email')
      .populate('department', 'name code')
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
 * @desc    Update complaint status
 * @route   PUT /api/admin/complaints/:id/status
 * @access  Private (Admin)
 */
export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;

  const complaint = await Complaint.findById(req.params.id).populate('userId', 'name email');
  if (!complaint) throw new ApiError(404, 'Complaint not found');

  const oldStatus = complaint.status;
  complaint.status = status;
  complaint.timeline.push({
    status,
    note: note || `Status updated to ${status}.`,
    updatedBy: req.user._id,
  });

  // If resolved, set resolution timestamp
  if (['Resolved', 'Closed'].includes(status) && !complaint.resolution.resolvedAt) {
    complaint.resolution.resolvedAt = new Date();
    complaint.resolution.resolvedBy = req.user._id;
    if (note) complaint.resolution.note = note;
  }

  await complaint.save();

  // Notify owner
  await Notification.create({
    userId: complaint.userId._id,
    type: 'status_update',
    title: 'Complaint Status Updated',
    message: `Your complaint "${complaint.title}" status changed to "${status}".`,
    complaintId: complaint._id,
    actionUrl: `/user/complaints/${complaint._id}`,
  });

  // Email
  sendEmail({
    to: complaint.userId.email,
    ...emailTemplates.statusUpdated(complaint, status),
  }).catch(console.error);

  // Activity log
  ActivityLog.log({
    userId: req.user._id,
    action: 'STATUS_CHANGED',
    resource: 'Complaint',
    resourceId: complaint._id,
    description: `Status: ${oldStatus} → ${status} (${complaint.complaintId})`,
    metadata: { from: oldStatus, to: status },
  }).catch(console.error);

  apiResponse(res, 200, complaint, `Status updated to ${status}`);
});

/**
 * @desc    Assign complaint to officer/user
 * @route   PUT /api/admin/complaints/:id/assign
 * @access  Private (Admin)
 */
export const assignComplaint = asyncHandler(async (req, res) => {
  const { assignedTo, note } = req.body;

  const [complaint, assignee] = await Promise.all([
    Complaint.findById(req.params.id).populate('userId', 'name email'),
    User.findById(assignedTo),
  ]);

  if (!complaint) throw new ApiError(404, 'Complaint not found');
  if (!assignee) throw new ApiError(404, 'Assignee user not found');

  complaint.assignedTo = assignedTo;
  complaint.status = 'Assigned';
  complaint.timeline.push({
    status: 'Assigned',
    note: note || `Assigned to ${assignee.name}.`,
    updatedBy: req.user._id,
  });

  await complaint.save();

  // Notify complaint owner
  await Notification.create({
    userId: complaint.userId._id,
    type: 'assignment',
    title: 'Complaint Assigned',
    message: `Your complaint "${complaint.title}" has been assigned to ${assignee.name}.`,
    complaintId: complaint._id,
    actionUrl: `/user/complaints/${complaint._id}`,
  });

  ActivityLog.log({
    userId: req.user._id,
    action: 'COMPLAINT_ASSIGNED',
    resource: 'Complaint',
    resourceId: complaint._id,
    description: `Assigned ${complaint.complaintId} to ${assignee.name}`,
  }).catch(console.error);

  apiResponse(res, 200, complaint, `Assigned to ${assignee.name}`);
});

// ─────────────────────────────────────────────
//  USER MANAGEMENT
// ─────────────────────────────────────────────

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 20 } = req.query;

  const filter = {};
  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { name: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .populate('department', 'name code')
      .lean(),
    User.countDocuments(filter),
  ]);

  // Attach complaint counts
  const userIds = users.map((u) => u._id);
  const complaintCounts = await Complaint.aggregate([
    { $match: { userId: { $in: userIds } } },
    { $group: { _id: '$userId', count: { $sum: 1 } } },
  ]);
  const countMap = complaintCounts.reduce((acc, c) => {
    acc[c._id.toString()] = c.count;
    return acc;
  }, {});

  const enrichedUsers = users.map((u) => ({
    ...u,
    complaintCount: countMap[u._id.toString()] || 0,
  }));

  apiResponse(res, 200, {
    users: enrichedUsers,
    pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
  });
});

/**
 * @desc    Get user by ID with complaints
 * @route   GET /api/admin/users/:id
 * @access  Private (Admin)
 */
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).populate('department', 'name code');
  if (!user) throw new ApiError(404, 'User not found');

  const complaints = await Complaint.find({ userId: user._id })
    .sort('-createdAt')
    .limit(10)
    .lean();

  apiResponse(res, 200, { user: user.toSafeObject(), complaints });
});

/**
 * @desc    Toggle user active status
 * @route   PUT /api/admin/users/:id/toggle
 * @access  Private (Admin)
 */
export const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  if (user.role === 'admin') throw new ApiError(400, 'Cannot deactivate an admin');

  user.isActive = !user.isActive;
  await user.save({ validateBeforeSave: false });

  ActivityLog.log({
    userId: req.user._id,
    action: 'USER_DELETED',
    resource: 'User',
    resourceId: user._id,
    description: `User ${user.name} ${user.isActive ? 'activated' : 'deactivated'}`,
  }).catch(console.error);

  apiResponse(res, 200, { isActive: user.isActive }, `User ${user.isActive ? 'activated' : 'deactivated'}`);
});

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin)
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  if (user.role === 'admin') throw new ApiError(400, 'Cannot delete an admin account');

  await user.deleteOne();

  ActivityLog.log({
    userId: req.user._id,
    action: 'USER_DELETED',
    resource: 'User',
    resourceId: user._id,
    description: `Deleted user: ${user.email}`,
  }).catch(console.error);

  apiResponse(res, 200, null, 'User deleted');
});

// ─────────────────────────────────────────────
//  STATS & ANALYTICS
// ─────────────────────────────────────────────

/**
 * @desc    Get admin dashboard stats
 * @route   GET /api/admin/stats
 * @access  Private (Admin)
 */
export const getAdminStats = asyncHandler(async (req, res) => {
  const [
    totalComplaints,
    totalUsers,
    statusDist,
    priorityDist,
    categoryDist,
    monthlyTrend,
    deptPerformance,
    recentComplaints,
    recentLogs,
  ] = await Promise.all([
    Complaint.countDocuments(),
    User.countDocuments({ role: 'user' }),
    Complaint.getStatusDistribution(),
    Complaint.getPriorityDistribution(),
    Complaint.getCategoryDistribution(),
    Complaint.getMonthlyTrend(),
    Complaint.getDepartmentPerformance(),
    Complaint.find().sort('-createdAt').limit(5).populate('userId', 'name').lean(),
    ActivityLog.getRecent(10),
  ]);

  apiResponse(res, 200, {
    totalComplaints,
    totalUsers,
    statusDistribution: statusDist,
    priorityDistribution: priorityDist,
    categoryDistribution: categoryDist,
    monthlyTrend,
    departmentPerformance: deptPerformance,
    recentComplaints,
    recentActivity: recentLogs,
  });
});

/**
 * @desc    Generate analytics report
 * @route   POST /api/admin/reports
 * @access  Private (Admin)
 */
export const generateReport = asyncHandler(async (req, res) => {
  const { title, type, from, to } = req.body;

  const dateFrom = new Date(from);
  const dateTo = new Date(to);
  const dateFilter = { createdAt: { $gte: dateFrom, $lte: dateTo } };

  const [
    totalComplaints,
    resolved,
    statusDist,
    categoryDist,
    priorityDist,
    deptPerf,
    monthlyTrend,
  ] = await Promise.all([
    Complaint.countDocuments(dateFilter),
    Complaint.countDocuments({ ...dateFilter, status: { $in: ['Resolved', 'Closed'] } }),
    Complaint.aggregate([{ $match: dateFilter }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
    Complaint.aggregate([{ $match: dateFilter }, { $group: { _id: '$category', count: { $sum: 1 } } }]),
    Complaint.aggregate([{ $match: dateFilter }, { $group: { _id: '$priority', count: { $sum: 1 } } }]),
    Complaint.getDepartmentPerformance(),
    Complaint.getMonthlyTrend(),
  ]);

  const pending = totalComplaints - resolved;

  const report = await Report.create({
    title: title || `${type} Report`,
    type,
    generatedBy: req.user._id,
    dateRange: { from: dateFrom, to: dateTo },
    data: {
      summary: { totalComplaints, resolved, pending, avgResolutionHours: 0 },
      statusBreakdown: statusDist.map((s) => ({ status: s._id, count: s.count })),
      categoryBreakdown: categoryDist.map((c) => ({ category: c._id, count: c.count })),
      priorityBreakdown: priorityDist.map((p) => ({ priority: p._id, count: p.count })),
      departmentPerformance: deptPerf,
      monthlyTrend,
    },
  });

  apiResponse(res, 201, report, 'Report generated');
});

/**
 * @desc    Get all reports
 * @route   GET /api/admin/reports
 * @access  Private (Admin)
 */
export const getReports = asyncHandler(async (req, res) => {
  const reports = await Report.find()
    .populate('generatedBy', 'name email')
    .sort('-createdAt')
    .limit(20)
    .lean();

  apiResponse(res, 200, { reports });
});

// ─────────────────────────────────────────────
//  DEPARTMENT MANAGEMENT
// ─────────────────────────────────────────────

/**
 * @desc    Get all departments
 * @route   GET /api/admin/departments
 * @access  Private (Admin)
 */
export const getDepartments = asyncHandler(async (req, res) => {
  const departments = await Department.find({ isActive: true })
    .populate('head', 'name email')
    .sort('name')
    .lean();

  // Attach complaint counts per department
  const complaintCounts = await Complaint.aggregate([
    { $group: { _id: '$departmentName', count: { $sum: 1 } } },
  ]);
  const countMap = complaintCounts.reduce((a, c) => { a[c._id] = c.count; return a; }, {});

  const enriched = departments.map((d) => ({ ...d, complaintCount: countMap[d.name] || 0 }));

  apiResponse(res, 200, { departments: enriched });
});

/**
 * @desc    Create department
 * @route   POST /api/admin/departments
 * @access  Private (Admin)
 */
export const createDepartment = asyncHandler(async (req, res) => {
  const dept = await Department.create(req.body);
  apiResponse(res, 201, dept, 'Department created');
});

/**
 * @desc    Update department
 * @route   PUT /api/admin/departments/:id
 * @access  Private (Admin)
 */
export const updateDepartment = asyncHandler(async (req, res) => {
  const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!dept) throw new ApiError(404, 'Department not found');
  apiResponse(res, 200, dept, 'Department updated');
});

/**
 * @desc    Get activity logs
 * @route   GET /api/admin/activity
 * @access  Private (Admin)
 */
export const getActivityLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 30, action } = req.query;
  const filter = {};
  if (action) filter.action = action;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [logs, total] = await Promise.all([
    ActivityLog.find(filter)
      .populate('userId', 'name email role')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    ActivityLog.countDocuments(filter),
  ]);

  apiResponse(res, 200, {
    logs,
    pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / parseInt(limit)) },
  });
});
