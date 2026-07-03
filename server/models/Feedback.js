import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    complaint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Complaint',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, 'Feedback comment cannot exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

feedbackSchema.index({ complaint: 1 });
feedbackSchema.index({ user: 1 });

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
