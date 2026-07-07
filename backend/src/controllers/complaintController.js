const Complaint = require('../models/Complaint');
const StatusHistory = require('../models/StatusHistory');
const Notification = require('../models/Notification');
const Feedback = require('../models/Feedback');
const User = require('../models/User');
const Department = require('../models/Department');

// Calculate SLA deadline date
const calculateSlaDeadline = (priority) => {
  const date = new Date();
  switch (priority) {
    case 'critical':
      date.setDate(date.getDate() + 1); // 24 hours
      break;
    case 'high':
      date.setDate(date.getDate() + 3); // 3 days
      break;
    case 'medium':
      date.setDate(date.getDate() + 7); // 7 days
      break;
    case 'low':
      date.setDate(date.getDate() + 14); // 14 days
      break;
    default:
      date.setDate(date.getDate() + 7);
  }
  return date;
};

// @desc    Register a new complaint
// @route   POST /api/complaints
// @access  Private
const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, priority, location } = req.body;

    if (!title || !description || !category) {
      res.statusCode = 400;
      throw new Error('Please fill in title, description and category');
    }

    // Verify category exists
    const deptExists = await Department.findById(category);
    if (!deptExists) {
      res.statusCode = 400;
      throw new Error('Invalid Category Selected');
    }

    // Generate unique complaint ID: CMP-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const complaintId = `CMP-${dateStr}-${randomNum}`;

    // Get attachment paths
    let attachments = [];
    if (req.files && req.files.length > 0) {
      attachments = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const slaDeadline = calculateSlaDeadline(priority || 'medium');

    const complaint = await Complaint.create({
      complaintId,
      userId: req.user._id,
      title,
      description,
      category,
      priority: priority || 'medium',
      location,
      attachments,
      slaDeadline,
      assignedDepartment: category, // Auto route initially to the chosen category
    });

    // Write initial status history log
    await StatusHistory.create({
      complaintId: complaint._id,
      status: 'Submitted',
      remarks: 'Complaint registered successfully',
      updatedBy: req.user._id,
    });

    // Notify user
    await Notification.create({
      userId: req.user._id,
      message: `Your complaint "${title}" has been registered successfully. Tracking ID: ${complaintId}`,
      type: 'status_change',
    });

    res.status(201).json({
      success: true,
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complaints for current user
// @route   GET /api/complaints
// @access  Private
const getUserComplaints = async (req, res, next) => {
  try {
    const { status, priority, search } = req.query;
    const query = { userId: req.user._id };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { complaintId: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const complaints = await Complaint.find(query)
      .populate('category', 'name')
      .populate('assignedDepartment', 'name')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints (Admin/Authority only)
// @route   GET /api/complaints/all
// @access  Private (Admin)
const getAllComplaints = async (req, res, next) => {
  try {
    const { status, priority, category, department, search, assignedTo } = req.query;
    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category || department) query.category = category || department;
    if (assignedTo) query.assignedTo = assignedTo;

    if (search) {
      query.$or = [
        { complaintId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const complaints = await Complaint.find(query)
      .populate('userId', 'name email phone')
      .populate('category', 'name')
      .populate('assignedDepartment', 'name')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complaint by ID
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('category', 'name')
      .populate('assignedDepartment', 'name')
      .populate('assignedTo', 'name');

    if (!complaint) {
      res.statusCode = 404;
      throw new Error('Complaint not found');
    }

    // Role check: Normal users can only see their own complaints
    if (req.user.role !== 'admin' && complaint.userId._id.toString() !== req.user._id.toString()) {
      res.statusCode = 403;
      throw new Error('Not authorized to access this complaint details');
    }

    // Fetch status logs
    const timeline = await StatusHistory.find({ complaintId: complaint._id })
      .populate('updatedBy', 'name role')
      .sort({ timestamp: 1 });

    // Fetch feedback if any
    const feedback = await Feedback.findOne({ complaintId: complaint._id });

    res.json({
      success: true,
      complaint,
      timeline,
      feedback,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign complaint to department and officer
// @route   PUT /api/complaints/:id/assign
// @access  Private (Admin)
const assignComplaint = async (req, res, next) => {
  try {
    const { departmentId, officerId } = req.body;

    if (!departmentId) {
      res.statusCode = 400;
      throw new Error('Please select a department to assign');
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      res.statusCode = 404;
      throw new Error('Complaint not found');
    }

    const department = await Department.findById(departmentId);
    if (!department) {
      res.statusCode = 404;
      throw new Error('Department not found');
    }

    let officerName = 'Unassigned';
    if (officerId) {
      const officer = await User.findById(officerId);
      if (!officer) {
        res.statusCode = 404;
        throw new Error('Officer not found');
      }
      complaint.assignedTo = officerId;
      officerName = officer.name;
    }

    complaint.assignedDepartment = departmentId;
    
    // Auto advance status to 'Assigned' if current status is 'Submitted'
    if (complaint.status === 'Submitted') {
      complaint.status = 'Assigned';
    }

    await complaint.save();

    // Create history
    await StatusHistory.create({
      complaintId: complaint._id,
      status: complaint.status,
      remarks: `Assigned to department: ${department.name}. Officer: ${officerName}`,
      updatedBy: req.user._id,
    });

    // Notify user
    await Notification.create({
      userId: complaint.userId,
      message: `Your complaint ${complaint.complaintId} has been assigned to department "${department.name}"`,
      type: 'assignment',
    });

    // Notify officer if assigned
    if (officerId) {
      await Notification.create({
        userId: officerId,
        message: `New complaint ${complaint.complaintId} assigned to you: "${complaint.title}"`,
        type: 'assignment',
      });
    }

    res.json({
      success: true,
      message: 'Complaint assigned successfully',
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private
const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, remarks, resolutionNotes } = req.body;

    if (!status) {
      res.statusCode = 400;
      throw new Error('Please specify a status');
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      res.statusCode = 404;
      throw new Error('Complaint not found');
    }

    // Auth validation: must be admin or the assigned officer
    if (req.user.role !== 'admin' && (!complaint.assignedTo || complaint.assignedTo.toString() !== req.user._id.toString())) {
      res.statusCode = 403;
      throw new Error('Not authorized to update status of this complaint');
    }

    complaint.status = status;

    if (status === 'Resolved') {
      complaint.resolutionNotes = resolutionNotes || 'No specific resolution notes provided.';
      complaint.resolvedAt = Date.now();
    }

    await complaint.save();

    // Add status history entry
    await StatusHistory.create({
      complaintId: complaint._id,
      status,
      remarks: remarks || `Status updated to ${status}`,
      updatedBy: req.user._id,
    });

    // Notify user
    await Notification.create({
      userId: complaint.userId,
      message: `Your complaint ${complaint.complaintId} status is updated to "${status}"`,
      type: 'status_change',
    });

    res.json({
      success: true,
      message: 'Complaint status updated successfully',
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getUserComplaints,
  getAllComplaints,
  getComplaintById,
  assignComplaint,
  updateComplaintStatus,
};
