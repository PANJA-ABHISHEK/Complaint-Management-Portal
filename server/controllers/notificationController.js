import db from '../config/db.js';
import { asyncHandler, apiResponse } from '../utils/helpers.js';

/**
 * @desc    Get user notifications
 * @route   GET /api/notifications
 * @access  Private
 */
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = db.notifications
    .filter((n) => n.userId === req.user._id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const unreadCount = notifications.filter((n) => !n.read).length;

  apiResponse(res, 200, { notifications, unreadCount });
});

/**
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = db.notifications.find(
    (n) => n._id === req.params.id && n.userId === req.user._id
  );

  if (!notification) {
    return res.status(404).json({ success: false, message: 'Notification not found' });
  }

  notification.read = true;

  apiResponse(res, 200, notification, 'Notification marked as read');
});

/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
export const markAllAsRead = asyncHandler(async (req, res) => {
  db.notifications
    .filter((n) => n.userId === req.user._id && !n.read)
    .forEach((n) => (n.read = true));

  apiResponse(res, 200, null, 'All notifications marked as read');
});
