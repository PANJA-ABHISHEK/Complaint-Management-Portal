import db from '../config/db.js';
import { ApiError, asyncHandler, apiResponse } from '../utils/helpers.js';
import { sendEmail, emailTemplates } from '../utils/email.js';

/**
 * @desc    Get all complaints (admin view)
 * @route   GET /api/admin/complaints
 * @access  Private (Admin)
 */
export const getAllComplaints = asyncHandler(async (req, res) => {
  const { status, priority, category, department, search, page = 1, limit = 20 } = req.query;

  let complaints = [...db.complaints];

  if (status) complaints = complaints.filter((c) => c.status === status);
  if (priority) complaints = complaints.filter((c) => c.priority === priority);
  if (category) complaints = complaints.filter((c) => c.category === category);
  if (department) complaints = complaints.filter((c) => c.department === department);
  if (search) {
    const s = search.toLowerCase();
    complaints = complaints.filter(
      (c) => c.title.toLowerCase().includes(s) || c.description.toLowerCase().includes(s)
    );
  }

  complaints.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Attach user info
  complaints = complaints.map((c) => {
    const user = db.users.find((u) => u._id === c.userId);
    return {
      ...c,
      user: user ? { _id: user._id, name: user.name, email: user.email } : null,
    };
  });

  const total = complaints.length;
  const startIndex = (page - 1) * limit;
  const paginated = complaints.slice(startIndex, startIndex + parseInt(limit));

  apiResponse(res, 200, {
    complaints: paginated,
    pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) },
  });
});

/**
 * @desc    Update complaint status
 * @route   PUT /api/admin/complaints/:id/status
 * @access  Private (Admin)
 */
export const updateComplaintStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const validStatuses = ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'];

  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const complaintIndex = db.complaints.findIndex((c) => c._id === req.params.id);
  if (complaintIndex === -1) {
    throw new ApiError(404, 'Complaint not found');
  }

  const complaint = db.complaints[complaintIndex];
  complaint.status = status;
  complaint.updatedAt = new Date().toISOString();
  complaint.timeline.push({
    status,
    date: new Date().toISOString(),
    note: note || `Status updated to ${status}.`,
    updatedBy: req.user._id,
  });

  db.complaints[complaintIndex] = complaint;

  // Email notification to complaint owner
  const owner = db.users.find((u) => u._id === complaint.userId);
  if (owner) {
    sendEmail({
      to: owner.email,
      ...emailTemplates.statusUpdated(complaint, status),
    }).catch(console.error);
  }

  // In-app notification
  db.notifications.push({
    _id: db.generateId(),
    userId: complaint.userId,
    type: 'status_update',
    title: 'Status Updated',
    message: `Your complaint "${complaint.title}" status changed to ${status}.`,
    read: false,
    complaintId: complaint._id,
    createdAt: new Date().toISOString(),
  });

  apiResponse(res, 200, complaint, `Status updated to ${status}`);
});

/**
 * @desc    Assign complaint to an officer/user
 * @route   PUT /api/admin/complaints/:id/assign
 * @access  Private (Admin)
 */
export const assignComplaint = asyncHandler(async (req, res) => {
  const { assignedTo, note } = req.body;

  const complaintIndex = db.complaints.findIndex((c) => c._id === req.params.id);
  if (complaintIndex === -1) {
    throw new ApiError(404, 'Complaint not found');
  }

  const assignee = db.users.find((u) => u._id === assignedTo);
  if (!assignee) {
    throw new ApiError(404, 'Assigned user not found');
  }

  const complaint = db.complaints[complaintIndex];
  complaint.assignedTo = assignedTo;
  complaint.status = 'Assigned';
  complaint.updatedAt = new Date().toISOString();
  complaint.timeline.push({
    status: 'Assigned',
    date: new Date().toISOString(),
    note: note || `Assigned to ${assignee.name}.`,
    updatedBy: req.user._id,
  });

  db.complaints[complaintIndex] = complaint;

  // Notify complaint owner
  db.notifications.push({
    _id: db.generateId(),
    userId: complaint.userId,
    type: 'assignment',
    title: 'Complaint Assigned',
    message: `Your complaint "${complaint.title}" has been assigned to ${assignee.name}.`,
    read: false,
    complaintId: complaint._id,
    createdAt: new Date().toISOString(),
  });

  apiResponse(res, 200, complaint, `Complaint assigned to ${assignee.name}`);
});

/**
 * @desc    Get all users (admin)
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, search } = req.query;

  let users = db.users.map(({ password, ...u }) => u);

  if (role) users = users.filter((u) => u.role === role);
  if (search) {
    const s = search.toLowerCase();
    users = users.filter((u) => u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
  }

  // Attach complaint count
  users = users.map((u) => ({
    ...u,
    complaintCount: db.complaints.filter((c) => c.userId === u._id).length,
  }));

  apiResponse(res, 200, { users, total: users.length });
});

/**
 * @desc    Get user by ID (admin)
 * @route   GET /api/admin/users/:id
 * @access  Private (Admin)
 */
export const getUserById = asyncHandler(async (req, res) => {
  const user = db.users.find((u) => u._id === req.params.id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const { password, ...userResponse } = user;
  const complaints = db.complaints.filter((c) => c.userId === user._id);

  apiResponse(res, 200, { user: userResponse, complaints });
});

/**
 * @desc    Delete user (admin)
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin)
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const userIndex = db.users.findIndex((u) => u._id === req.params.id);
  if (userIndex === -1) {
    throw new ApiError(404, 'User not found');
  }

  if (db.users[userIndex].role === 'admin') {
    throw new ApiError(400, 'Cannot delete an admin account');
  }

  db.users.splice(userIndex, 1);

  apiResponse(res, 200, null, 'User deleted');
});

/**
 * @desc    Get admin dashboard stats
 * @route   GET /api/admin/stats
 * @access  Private (Admin)
 */
export const getAdminStats = asyncHandler(async (req, res) => {
  const complaints = db.complaints;
  const users = db.users;

  const stats = {
    totalComplaints: complaints.length,
    totalUsers: users.filter((u) => u.role === 'user').length,
    statusBreakdown: {
      submitted: complaints.filter((c) => c.status === 'Submitted').length,
      underReview: complaints.filter((c) => c.status === 'Under Review').length,
      assigned: complaints.filter((c) => c.status === 'Assigned').length,
      inProgress: complaints.filter((c) => c.status === 'In Progress').length,
      resolved: complaints.filter((c) => c.status === 'Resolved').length,
      closed: complaints.filter((c) => c.status === 'Closed').length,
    },
    priorityBreakdown: {
      high: complaints.filter((c) => c.priority === 'High').length,
      medium: complaints.filter((c) => c.priority === 'Medium').length,
      low: complaints.filter((c) => c.priority === 'Low').length,
    },
    categoryBreakdown: complaints.reduce((acc, c) => {
      acc[c.category] = (acc[c.category] || 0) + 1;
      return acc;
    }, {}),
    recentComplaints: [...complaints].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
  };

  apiResponse(res, 200, stats);
});
