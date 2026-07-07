const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50); // limit to recent 50

    res.json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!notification) {
      res.statusCode = 404;
      throw new Error('Notification not found or access denied');
    }

    notification.isRead = true;
    await notification.save();

    res.json({
      success: true,
      notification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });

    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Broadcast a notification to all users (Admin only)
// @route   POST /api/notifications/broadcast
// @access  Private (Admin)
const broadcastNotification = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message) {
      res.statusCode = 400;
      throw new Error('Please enter an announcement message');
    }

    const User = require('../models/User');
    const users = await User.find({ role: 'user' });

    const notificationsToCreate = users.map((u) => ({
      userId: u._id,
      message,
      type: 'broadcast',
    }));

    await Notification.insertMany(notificationsToCreate);

    res.status(201).json({
      success: true,
      message: `Broadcast message sent to ${users.length} active citizens.`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  broadcastNotification,
};

