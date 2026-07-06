import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      unique: true,
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    code: {
      type: String,
      required: [true, 'Department code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: [10, 'Code cannot exceed 10 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    head: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    contactPhone: {
      type: String,
      trim: true,
      default: '',
    },
    categories: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ───
departmentSchema.index({ name: 1 }, { unique: true });
departmentSchema.index({ code: 1 }, { unique: true });
departmentSchema.index({ isActive: 1 });

// ─── Virtual: assigned complaint count ───
departmentSchema.virtual('complaintCount', {
  ref: 'Complaint',
  localField: '_id',
  foreignField: 'department',
  count: true,
});

const Department = mongoose.model('Department', departmentSchema);
export default Department;
