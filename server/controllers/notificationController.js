import Notification from '../models/Notification.js';
import { asyncHandler, apiResponse } from '../utils/helpers.js';
import { ApiError } from '../utils/helpers.js';

/**
 * @desc    Get user notifications
 * @route   GET /api/notifications
 * @access  Private
 */
export const getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = { userId: req.user._id };
  if (unreadOnly === 'true') filter.read = false;

  const [notifications, unreadCount, total] = await Promise.all([
    Notification.find(filter)
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .populate('complaintId', 'complaintId title status')
      .lean(),
    Notification.getUnreadCount(req.user._id),
    Notification.countDocuments(filter),
  ]);

  apiResponse(res, 200, {
    notifications,
    unreadCount,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

/**
 * @desc    Mark one notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { read: true, readAt: new Date() },
    { new: true }
  );

  if (!notification) throw new ApiError(404, 'Notification not found');

  apiResponse(res, 200, notification, 'Notification marked as read');
});

/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */
export const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await Notification.markAllRead(req.user._id);
  apiResponse(res, 200, { updated: result.modifiedCount }, 'All notifications marked as read');
});

/**
 * @desc    Delete a notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!notification) throw new ApiError(404, 'Notification not found');

  apiResponse(res, 200, null, 'Notification deleted');
});
