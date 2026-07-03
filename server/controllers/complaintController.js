import Complaint from '../models/Complaint.js';
import Feedback from '../models/Feedback.js';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import { notifyComplaintSubmitted, notifyStatusUpdate, notifyComplaintResolved, notifyComplaintClosed } from '../services/notificationService.js';
import { sendStatusUpdateEmail } from '../services/emailService.js';

// @desc    Create complaint
// @route   POST /api/complaints
export const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, priority, location } = req.body;

    const complaintData = {
      title,
      description,
      category,
      priority,
      location: location ? JSON.parse(location) : {},
      user: req.user._id,
    };

    if (req.files) {
      if (req.files.images) {
        complaintData.images = req.files.images.map((f) => `/uploads/${f.filename}`);
      }
      if (req.files.documents) {
        complaintData.documents = req.files.documents.map((f) => `/uploads/${f.filename}`);
      }
    }

    const complaint = await Complaint.create(complaintData);
    await complaint.populate('user', 'name email');

    notifyComplaintSubmitted(req.user._id, complaint).catch(() => {});

    res.status(201).json({ success: true, complaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints (with filters & pagination)
// @route   GET /api/complaints
export const getComplaints = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      priority,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      startDate,
      endDate,
    } = req.query;

    const query = {};

    // Role-based filtering
    if (req.user.role === 'user') {
      query.user = req.user._id;
    } else if (req.user.role === 'officer') {
      query.assignedTo = req.user._id;
    }

    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { complaintId: { $regex: search, $options: 'i' } },
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const total = await Complaint.countDocuments(query);
    const complaints = await Complaint.find(query)
      .populate('user', 'name email avatar')
      .populate('assignedTo', 'name email')
      .populate('department', 'name')
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      complaints,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
export const getComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('user', 'name email avatar phone')
      .populate('assignedTo', 'name email avatar')
      .populate('department', 'name code')
      .populate('feedback')
      .populate('timeline.updatedBy', 'name role')
      .populate('internalNotes.addedBy', 'name role');

    if (!complaint) {
      return next(new AppError('Complaint not found', 404));
    }

    // Users can only view their own complaints
    if (req.user.role === 'user' && complaint.user._id.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized to view this complaint', 403));
    }

    res.status(200).json({ success: true, complaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
export const updateStatus = async (req, res, next) => {
  try {
    const { status, message } = req.body;
    const complaint = await Complaint.findById(req.params.id).populate('user', 'name email');

    if (!complaint) {
      return next(new AppError('Complaint not found', 404));
    }

    complaint.status = status;
    complaint.timeline.push({
      status,
      message: message || `Status updated to ${status}`,
      updatedBy: req.user._id,
    });

    if (status === 'Resolved') {
      complaint.resolvedAt = new Date();
    }
    if (status === 'Closed') {
      complaint.closedAt = new Date();
    }

    await complaint.save();

    // Notify user
    notifyStatusUpdate(complaint.user._id, complaint, status).catch(() => {});
    sendStatusUpdateEmail(complaint.user, complaint, status).catch(() => {});

    res.status(200).json({ success: true, complaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign complaint to officer
// @route   PUT /api/complaints/:id/assign
export const assignComplaint = async (req, res, next) => {
  try {
    const { officerId, departmentId } = req.body;

    const officer = await User.findById(officerId);
    if (!officer || officer.role !== 'officer') {
      return next(new AppError('Invalid officer', 400));
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return next(new AppError('Complaint not found', 404));
    }

    complaint.assignedTo = officerId;
    complaint.department = departmentId;
    complaint.status = 'Assigned';
    complaint.timeline.push({
      status: 'Assigned',
      message: `Complaint assigned to ${officer.name}`,
      updatedBy: req.user._id,
    });

    await complaint.save();

    const { notifyComplaintAssigned } = await import('../services/notificationService.js');
    notifyComplaintAssigned(officerId, complaint).catch(() => {});
    notifyStatusUpdate(complaint.user, complaint, 'Assigned').catch(() => {});

    res.status(200).json({ success: true, complaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Add internal note
// @route   PUT /api/complaints/:id/notes
export const addInternalNote = async (req, res, next) => {
  try {
    const { note } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return next(new AppError('Complaint not found', 404));
    }

    complaint.internalNotes.push({
      note,
      addedBy: req.user._id,
    });

    await complaint.save();
    await complaint.populate('internalNotes.addedBy', 'name role');

    res.status(200).json({ success: true, complaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Resolve complaint
// @route   PUT /api/complaints/:id/resolve
export const resolveComplaint = async (req, res, next) => {
  try {
    const { text } = req.body;
    const complaint = await Complaint.findById(req.params.id).populate('user', 'name email');

    if (!complaint) {
      return next(new AppError('Complaint not found', 404));
    }

    complaint.status = 'Resolved';
    complaint.resolvedAt = new Date();
    complaint.resolution = {
      text,
      images: req.files ? req.files.map((f) => `/uploads/${f.filename}`) : [],
      resolvedAt: new Date(),
    };
    complaint.timeline.push({
      status: 'Resolved',
      message: 'Complaint has been resolved',
      updatedBy: req.user._id,
    });

    await complaint.save();

    notifyComplaintResolved(complaint.user._id, complaint).catch(() => {});
    sendStatusUpdateEmail(complaint.user, complaint, 'Resolved').catch(() => {});

    res.status(200).json({ success: true, complaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Close complaint
// @route   PUT /api/complaints/:id/close
export const closeComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('user', 'name email');

    if (!complaint) {
      return next(new AppError('Complaint not found', 404));
    }

    complaint.status = 'Closed';
    complaint.closedAt = new Date();
    complaint.timeline.push({
      status: 'Closed',
      message: 'Complaint has been closed',
      updatedBy: req.user._id,
    });

    await complaint.save();

    notifyComplaintClosed(complaint.user._id, complaint).catch(() => {});

    res.status(200).json({ success: true, complaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
export const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return next(new AppError('Complaint not found', 404));
    }

    await complaint.deleteOne();
    res.status(200).json({ success: true, message: 'Complaint deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit feedback
// @route   POST /api/complaints/:id/feedback
export const submitFeedback = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return next(new AppError('Complaint not found', 404));
    }

    if (complaint.user.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized', 403));
    }

    if (complaint.status !== 'Resolved' && complaint.status !== 'Closed') {
      return next(new AppError('Complaint must be resolved before giving feedback', 400));
    }

    const feedback = await Feedback.create({
      complaint: complaint._id,
      user: req.user._id,
      rating,
      comment,
    });

    complaint.feedback = feedback._id;
    complaint.rating = rating;
    await complaint.save();

    res.status(201).json({ success: true, feedback });
  } catch (error) {
    next(error);
  }
};
