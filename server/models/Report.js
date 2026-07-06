import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Report title is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'quarterly', 'annual', 'custom'],
      required: true,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dateRange: {
      from: { type: Date, required: true },
      to: { type: Date, required: true },
    },
    data: {
      summary: {
        totalComplaints: { type: Number, default: 0 },
        resolved: { type: Number, default: 0 },
        pending: { type: Number, default: 0 },
        avgResolutionHours: { type: Number, default: 0 },
      },
      statusBreakdown: [
        {
          status: String,
          count: Number,
        },
      ],
      categoryBreakdown: [
        {
          category: String,
          count: Number,
        },
      ],
      priorityBreakdown: [
        {
          priority: String,
          count: Number,
        },
      ],
      departmentPerformance: [
        {
          department: String,
          total: Number,
          resolved: Number,
          resolutionRate: Number,
        },
      ],
      monthlyTrend: [
        {
          month: Number,
          year: Number,
          total: Number,
          resolved: Number,
        },
      ],
    },
    format: {
      type: String,
      enum: ['json', 'pdf', 'csv'],
      default: 'json',
    },
    filePath: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ───
reportSchema.index({ generatedBy: 1, createdAt: -1 });
reportSchema.index({ type: 1 });
reportSchema.index({ createdAt: -1 });

const Report = mongoose.model('Report', reportSchema);
export default Report;
