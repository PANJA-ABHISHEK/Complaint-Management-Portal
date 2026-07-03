import User from '../models/User.js';
import Complaint from '../models/Complaint.js';
import Department from '../models/Department.js';
import Feedback from '../models/Feedback.js';
import Notification from '../models/Notification.js';
import { AppError } from '../middleware/errorHandler.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalComplaints,
      pendingComplaints,
      assignedComplaints,
      inProgressComplaints,
      resolvedComplaints,
      closedComplaints,
      totalDepartments,
      recentComplaints,
      categoryStats,
      monthlyStats,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: { $in: ['Submitted', 'Pending'] } }),
      Complaint.countDocuments({ status: 'Assigned' }),
      Complaint.countDocuments({ status: 'In Progress' }),
      Complaint.countDocuments({ status: 'Resolved' }),
      Complaint.countDocuments({ status: 'Closed' }),
      Department.countDocuments({ isActive: true }),
      Complaint.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email avatar')
        .populate('assignedTo', 'name'),
      Complaint.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Complaint.aggregate([
        {
          $group: {
            _id: {
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' },
            },
            count: { $sum: 1 },
            resolved: {
              $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] },
            },
          },
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 },
      ]),
    ]);

    // Average resolution time
    const resolvedWithTime = await Complaint.aggregate([
      { $match: { resolvedAt: { $exists: true } } },
      {
        $project: {
          resolutionTime: { $subtract: ['$resolvedAt', '$createdAt'] },
        },
      },
      {
        $group: {
          _id: null,
          avgTime: { $avg: '$resolutionTime' },
        },
      },
    ]);

    const avgResolutionTime = resolvedWithTime.length
      ? Math.round(resolvedWithTime[0].avgTime / (1000 * 60 * 60 * 24))
      : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalComplaints,
        pendingComplaints,
        assignedComplaints,
        inProgressComplaints,
        resolvedComplaints,
        closedComplaints,
        totalDepartments,
        avgResolutionTime,
        recentComplaints,
        categoryStats,
        monthlyStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) query.role = role;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .populate('department', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      users,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Block/unblock user
// @route   PUT /api/admin/users/:id/block
export const toggleBlockUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('User not found', 404));
    if (user.role === 'admin') return next(new AppError('Cannot block an admin', 400));

    user.isBlocked = !user.isBlocked;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user role
// @route   PUT /api/admin/users/:id/role
export const changeUserRole = async (req, res, next) => {
  try {
    const { role, department } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError('User not found', 404));

    user.role = role;
    if (department) user.department = department;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get departments
// @route   GET /api/admin/departments
export const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find()
      .populate('head', 'name email')
      .populate('officers', 'name email');
    res.status(200).json({ success: true, departments });
  } catch (error) {
    next(error);
  }
};

// @desc    Create department
// @route   POST /api/admin/departments
export const createDepartment = async (req, res, next) => {
  try {
    const department = await Department.create(req.body);
    res.status(201).json({ success: true, department });
  } catch (error) {
    next(error);
  }
};

// @desc    Update department
// @route   PUT /api/admin/departments/:id
export const updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!department) return next(new AppError('Department not found', 404));
    res.status(200).json({ success: true, department });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete department
// @route   DELETE /api/admin/departments/:id
export const deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) return next(new AppError('Department not found', 404));
    res.status(200).json({ success: true, message: 'Department deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate reports
// @route   GET /api/admin/reports
export const getReports = async (req, res, next) => {
  try {
    const { startDate, endDate, type = 'monthly' } = req.query;
    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const matchStage = {};
    if (startDate || endDate) matchStage.createdAt = dateFilter;

    const [statusDistribution, categoryDistribution, priorityDistribution, departmentPerformance, trendData] = await Promise.all([
      Complaint.aggregate([
        { $match: matchStage },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Complaint.aggregate([
        { $match: matchStage },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      Complaint.aggregate([
        { $match: matchStage },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
      Complaint.aggregate([
        { $match: { ...matchStage, department: { $exists: true } } },
        {
          $group: {
            _id: '$department',
            total: { $sum: 1 },
            resolved: { $sum: { $cond: [{ $in: ['$status', ['Resolved', 'Closed']] }, 1, 0] } },
            avgResolutionTime: {
              $avg: {
                $cond: [
                  { $and: [{ $ne: ['$resolvedAt', null] }] },
                  { $subtract: ['$resolvedAt', '$createdAt'] },
                  null,
                ],
              },
            },
          },
        },
        {
          $lookup: {
            from: 'departments',
            localField: '_id',
            foreignField: '_id',
            as: 'department',
          },
        },
        { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
      ]),
      Complaint.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' },
            },
            submitted: { $sum: 1 },
            resolved: { $sum: { $cond: [{ $in: ['$status', ['Resolved', 'Closed']] }, 1, 0] } },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      reports: {
        statusDistribution,
        categoryDistribution,
        priorityDistribution,
        departmentPerformance,
        trendData,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all feedback
// @route   GET /api/admin/feedback
export const getAllFeedback = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const total = await Feedback.countDocuments();
    const feedback = await Feedback.find()
      .populate('user', 'name email avatar')
      .populate('complaint', 'complaintId title')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      feedback,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
};
