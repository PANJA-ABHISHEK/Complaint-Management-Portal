import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        'LOGIN',
        'LOGOUT',
        'REGISTER',
        'COMPLAINT_CREATED',
        'COMPLAINT_UPDATED',
        'COMPLAINT_DELETED',
        'STATUS_CHANGED',
        'COMPLAINT_ASSIGNED',
        'COMMENT_ADDED',
        'FILE_UPLOADED',
        'PROFILE_UPDATED',
        'PASSWORD_CHANGED',
        'USER_DELETED',
        'SETTINGS_UPDATED',
      ],
    },
    resource: {
      type: String,
      enum: ['User', 'Complaint', 'Department', 'Settings', 'System'],
      default: 'System',
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: '',
    },
    userAgent: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ───
activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ action: 1 });
activityLogSchema.index({ resource: 1, resourceId: 1 });
activityLogSchema.index({ createdAt: -1 });
// TTL: auto-delete logs older than 1 year
activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 31536000 });

// ─── Static: log activity ───
activityLogSchema.statics.log = function (data) {
  return this.create(data);
};

// ─── Static: get recent activity ───
activityLogSchema.statics.getRecent = function (limit = 20) {
  return this.find()
    .populate('userId', 'name email role')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
