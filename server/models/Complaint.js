import mongoose from 'mongoose';

// ─── Counter schema for auto-incrementing complaint IDs ───
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model('Counter', counterSchema);

// ─── Timeline Entry Sub-Schema ───
const timelineEntrySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      default: '',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: { createdAt: 'date', updatedAt: false } }
);

// ─── Attachment Sub-Schema ───
const attachmentSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number },
    mimetype: { type: String },
  },
  { _id: true, timestamps: true }
);

// ─── Main Complaint Schema ───
const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [5, 'Title must be at least 5 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'Infrastructure',
          'Utilities',
          'Sanitation',
          'Safety',
          'Transportation',
          'Environment',
          'Health',
          'Education',
          'Other',
        ],
        message: '{VALUE} is not a valid category',
      },
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
    },
    departmentName: {
      type: String,
      required: [true, 'Department name is required'],
      trim: true,
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High', 'Critical'],
        message: '{VALUE} is not a valid priority',
      },
      default: 'Medium',
    },
    status: {
      type: String,
      enum: {
        values: [
          'Submitted',
          'Under Review',
          'Assigned',
          'In Progress',
          'Resolved',
          'Closed',
          'Rejected',
        ],
        message: '{VALUE} is not a valid status',
      },
      default: 'Submitted',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    attachments: [attachmentSchema],
    timeline: [timelineEntrySchema],
    resolution: {
      note: { type: String, default: '' },
      resolvedAt: { type: Date, default: null },
      resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    },
    feedback: {
      rating: { type: Number, min: 1, max: 5, default: null },
      comment: { type: String, default: '' },
      submittedAt: { type: Date, default: null },
    },
    isEscalated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ───
complaintSchema.index({ userId: 1, createdAt: -1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ priority: 1 });
complaintSchema.index({ category: 1 });
complaintSchema.index({ department: 1 });
complaintSchema.index({ assignedTo: 1 });
complaintSchema.index({ createdAt: -1 });
complaintSchema.index({ title: 'text', description: 'text' }); // text search index
complaintSchema.index({ 'coordinates': '2dsphere' }); // geospatial index

// ─── Virtual: days since created ───
complaintSchema.virtual('daysSinceCreated').get(function () {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// ─── Virtual: is overdue (>7 days unresolved) ───
complaintSchema.virtual('isOverdue').get(function () {
  if (['Resolved', 'Closed'].includes(this.status)) return false;
  return this.daysSinceCreated > 7;
});

// ─── Pre-save: generate complaint ID (CMP-00001) ───
complaintSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        'complaintId',
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.complaintId = `CMP-${String(counter.seq).padStart(5, '0')}`;
    } catch (err) {
      return next(err);
    }

    // Add initial timeline entry
    if (this.timeline.length === 0) {
      this.timeline.push({
        status: 'Submitted',
        note: 'Complaint registered successfully.',
      });
    }
  }
  next();
});

// ─── Static: aggregation pipelines ───

/**
 * Get status distribution
 */
complaintSchema.statics.getStatusDistribution = function () {
  return this.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { status: '$_id', count: 1, _id: 0 } },
  ]);
};

/**
 * Get category distribution
 */
complaintSchema.statics.getCategoryDistribution = function () {
  return this.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { category: '$_id', count: 1, _id: 0 } },
  ]);
};

/**
 * Get priority distribution
 */
complaintSchema.statics.getPriorityDistribution = function () {
  return this.aggregate([
    { $group: { _id: '$priority', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { priority: '$_id', count: 1, _id: 0 } },
  ]);
};

/**
 * Get monthly complaint trend (last 12 months)
 */
complaintSchema.statics.getMonthlyTrend = function () {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  return this.aggregate([
    { $match: { createdAt: { $gte: twelveMonthsAgo } } },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        total: { $sum: 1 },
        resolved: {
          $sum: { $cond: [{ $in: ['$status', ['Resolved', 'Closed']] }, 1, 0] },
        },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    {
      $project: {
        _id: 0,
        year: '$_id.year',
        month: '$_id.month',
        total: 1,
        resolved: 1,
      },
    },
  ]);
};

/**
 * Get department performance (resolution rate)
 */
complaintSchema.statics.getDepartmentPerformance = function () {
  return this.aggregate([
    { $match: { departmentName: { $exists: true, $ne: '' } } },
    {
      $group: {
        _id: '$departmentName',
        total: { $sum: 1 },
        resolved: {
          $sum: { $cond: [{ $in: ['$status', ['Resolved', 'Closed']] }, 1, 0] },
        },
        avgResolutionDays: {
          $avg: {
            $cond: [
              { $ne: ['$resolution.resolvedAt', null] },
              {
                $divide: [
                  { $subtract: ['$resolution.resolvedAt', '$createdAt'] },
                  86400000, // ms in a day
                ],
              },
              null,
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        department: '$_id',
        total: 1,
        resolved: 1,
        resolutionRate: {
          $round: [{ $multiply: [{ $divide: ['$resolved', '$total'] }, 100] }, 1],
        },
        avgResolutionDays: { $round: ['$avgResolutionDays', 1] },
      },
    },
    { $sort: { total: -1 } },
  ]);
};

/**
 * Get average resolution time by priority
 */
complaintSchema.statics.getResolutionTimeByPriority = function () {
  return this.aggregate([
    { $match: { 'resolution.resolvedAt': { $ne: null } } },
    {
      $group: {
        _id: '$priority',
        avgHours: {
          $avg: {
            $divide: [
              { $subtract: ['$resolution.resolvedAt', '$createdAt'] },
              3600000,
            ],
          },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        priority: '$_id',
        avgHours: { $round: ['$avgHours', 1] },
        count: 1,
      },
    },
    { $sort: { avgHours: -1 } },
  ]);
};

const Complaint = mongoose.model('Complaint', complaintSchema);
export { Counter };
export default Complaint;
