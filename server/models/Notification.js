import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    type: {
      type: String,
      enum: [
        'complaint_created',
        'status_update',
        'assignment',
        'comment',
        'escalation',
        'resolution',
        'feedback_request',
        'system',
      ],
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      default: null,
    },
    actionUrl: {
      type: String,
      default: '',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ───
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ createdAt: -1 });
// TTL: auto-delete notifications older than 90 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

// ─── Static: get unread count ───
notificationSchema.statics.getUnreadCount = function (userId) {
  return this.countDocuments({ userId, read: false });
};

// ─── Static: mark all read ───
notificationSchema.statics.markAllRead = function (userId) {
  return this.updateMany(
    { userId, read: false },
    { $set: { read: true, readAt: new Date() } }
  );
};

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
