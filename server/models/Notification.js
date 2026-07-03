import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['complaint_submitted', 'complaint_assigned', 'status_update', 'complaint_resolved', 'complaint_closed', 'complaint_rejected', 'general'],
      default: 'general',
    },
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
