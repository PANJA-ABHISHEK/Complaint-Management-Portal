const Complaint = require('../models/Complaint');
const Department = require('../models/Department');
const User = require('../models/User');

// @desc    Get Admin Dashboard Stats & Analytics
// @route   GET /api/reports/admin-dashboard
// @access  Private (Admin)
const getAdminDashboardStats = async (req, res, next) => {
  try {
    const totalCount = await Complaint.countDocuments();
    const pendingCount = await Complaint.countDocuments({ status: { $in: ['Submitted', 'Assigned', 'In Progress'] } });
    const resolvedCount = await Complaint.countDocuments({ status: 'Resolved' });
    const closedCount = await Complaint.countDocuments({ status: 'Closed' });

    // SLA Breaches: Active complaints where deadline has passed
    const now = new Date();
    const slaBreachCount = await Complaint.countDocuments({
      status: { $in: ['Submitted', 'Assigned', 'In Progress'] },
      slaDeadline: { $lt: now },
    });

    // 1. Priority Breakdown
    const priorityAggregation = await Complaint.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    const prioritySplit = { low: 0, medium: 0, high: 0, critical: 0 };
    priorityAggregation.forEach((item) => {
      if (item._id in prioritySplit) {
        prioritySplit[item._id] = item.count;
      }
    });

    // 2. Status Breakdown
    const statusAggregation = await Complaint.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const statusSplit = { Submitted: 0, Assigned: 0, 'In Progress': 0, Resolved: 0, Closed: 0 };
    statusAggregation.forEach((item) => {
      if (item._id in statusSplit) {
        statusSplit[item._id] = item.count;
      }
    });

    // 3. Category Breakdown (Complaints per Department)
    const categoryAggregation = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'departments',
          localField: '_id',
          foreignField: '_id',
          as: 'deptInfo',
        },
      },
      {
        $unwind: '$deptInfo',
      },
      {
        $project: {
          name: '$deptInfo.name',
          count: 1,
        },
      },
    ]);

    // 4. Monthly Trend (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyAggregation = await Complaint.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const month = d.getMonth() + 1; // 1-indexed for matching aggregation

      const match = monthlyAggregation.find((m) => m._id.year === year && m._id.month === month);
      monthlyTrend.push({
        monthName: `${monthNames[month - 1]} ${year}`,
        count: match ? match.count : 0,
      });
    }

    // 5. Avg Resolution Time (for resolved/closed complaints, in hours)
    const avgResTimeAgg = await Complaint.aggregate([
      {
        $match: {
          status: { $in: ['Resolved', 'Closed'] },
          resolvedAt: { $exists: true },
        },
      },
      {
        $project: {
          durationHrs: {
            $divide: [{ $subtract: ['$resolvedAt', '$createdAt'] }, 1000 * 60 * 60],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgHrs: { $avg: '$durationHrs' },
        },
      },
    ]);
    const avgResolutionTimeHours = avgResTimeAgg.length > 0 ? Math.round(avgResTimeAgg[0].avgHrs * 10) / 10 : 0;

    res.json({
      success: true,
      stats: {
        total: totalCount,
        pending: pendingCount,
        resolved: resolvedCount,
        closed: closedCount,
        slaBreach: slaBreachCount,
        avgResolutionTimeHours,
      },
      prioritySplit,
      statusSplit,
      categorySplit: categoryAggregation,
      monthlyTrend,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user-specific dashboard statistics
// @route   GET /api/reports/user-dashboard
// @access  Private
const getUserDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const totalCount = await Complaint.countDocuments({ userId });
    const pendingCount = await Complaint.countDocuments({ userId, status: { $in: ['Submitted', 'Assigned', 'In Progress'] } });
    const resolvedCount = await Complaint.countDocuments({ userId, status: 'Resolved' });
    const closedCount = await Complaint.countDocuments({ userId, status: 'Closed' });

    // Latest 5 complaints
    const recentComplaints = await Complaint.find({ userId })
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        total: totalCount,
        pending: pendingCount,
        resolved: resolvedCount,
        closed: closedCount,
      },
      recentComplaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export Complaints as CSV
// @route   GET /api/reports/export-csv
// @access  Private (Admin)
const exportComplaintsCSV = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({})
      .populate('userId', 'name email phone')
      .populate('category', 'name')
      .populate('assignedTo', 'name');

    let csv = 'Complaint ID,Title,Category,Priority,Status,Created At,Resolved At,Submitted By,Email,Assigned Officer\n';

    complaints.forEach((c) => {
      const cId = c.complaintId;
      const title = `"${c.title.replace(/"/g, '""')}"`;
      const category = c.category ? c.category.name : 'Unknown';
      const priority = c.priority;
      const status = c.status;
      const createdAt = c.createdAt.toISOString();
      const resolvedAt = c.resolvedAt ? c.resolvedAt.toISOString() : 'N/A';
      const username = c.userId ? c.userId.name : 'Deleted User';
      const email = c.userId ? c.userId.email : 'Deleted User';
      const assignedOfficer = c.assignedTo ? c.assignedTo.name : 'Unassigned';

      csv += `${cId},${title},${category},${priority},${status},${createdAt},${resolvedAt},${username},${email},${assignedOfficer}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=complaints-export.csv');
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboardStats,
  getUserDashboardStats,
  exportComplaintsCSV,
};
