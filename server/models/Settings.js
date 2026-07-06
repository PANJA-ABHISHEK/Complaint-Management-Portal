import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    category: {
      type: String,
      enum: ['general', 'email', 'complaint', 'notification', 'security'],
      default: 'general',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ───
settingsSchema.index({ key: 1 }, { unique: true });
settingsSchema.index({ category: 1 });

// ─── Static: get by key ───
settingsSchema.statics.getByKey = async function (key) {
  const setting = await this.findOne({ key });
  return setting ? setting.value : null;
};

// ─── Static: set value ───
settingsSchema.statics.setByKey = async function (key, value, userId = null) {
  return this.findOneAndUpdate(
    { key },
    { value, updatedBy: userId },
    { new: true, upsert: true }
  );
};

// ─── Static: get by category ───
settingsSchema.statics.getByCategory = function (category) {
  return this.find({ category }).lean();
};

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;
