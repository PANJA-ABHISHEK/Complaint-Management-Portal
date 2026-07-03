import mongoose from 'mongoose';

const timelineEntrySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const internalNoteSchema = new mongoose.Schema({
  note: {
    type: String,
    required: true,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Complaint description is required'],
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Electricity',
        'Water Supply',
        'Road Damage',
        'Street Lights',
        'Garbage Collection',
        'Internet',
        'College',
        'Hostel',
        'Transport',
        'Health',
        'Security',
        'Others',
      ],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['Submitted', 'Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Rejected'],
      default: 'Submitted',
    },
    location: {
      address: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      pincode: { type: String, trim: true },
    },
    images: [{ type: String }],
    documents: [{ type: String }],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    timeline: [timelineEntrySchema],
    internalNotes: [internalNoteSchema],
    resolution: {
      text: { type: String },
      images: [{ type: String }],
      resolvedAt: { type: Date },
    },
    feedback: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Feedback',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    resolvedAt: Date,
    closedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
complaintSchema.index({ complaintId: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ category: 1 });
complaintSchema.index({ user: 1 });
complaintSchema.index({ assignedTo: 1 });
complaintSchema.index({ createdAt: -1 });
complaintSchema.index({ title: 'text', description: 'text' });

// Auto-generate complaint ID
complaintSchema.pre('save', async function (next) {
  if (this.isNew) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('Complaint').countDocuments();
    this.complaintId = `CMP-${year}-${String(count + 1).padStart(5, '0')}`;

    // Add initial timeline entry
    this.timeline.push({
      status: 'Submitted',
      message: 'Complaint has been submitted successfully',
    });
  }
  next();
});

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
