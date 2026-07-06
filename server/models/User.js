import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/env.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // never return password by default
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin', 'officer'],
        message: '{VALUE} is not a valid role',
      },
      default: 'user',
    },
    avatar: {
      type: String,
      default: null,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ───
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ department: 1 });
userSchema.index({ createdAt: -1 });

// ─── Virtual: complaint count ───
userSchema.virtual('complaints', {
  ref: 'Complaint',
  localField: '_id',
  foreignField: 'userId',
  count: true,
});

// ─── Virtual: full avatar URL ───
userSchema.virtual('avatarUrl').get(function () {
  if (this.avatar) return this.avatar;
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(this.name || 'U')}`;
});

// ─── Pre-save: hash password ───
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ─── Instance Method: compare password ───
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// ─── Instance Method: generate JWT ───
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, config.jwt.secret, {
    expiresIn: config.jwt.expire,
  });
};

// ─── Instance Method: safe JSON (no password) ───
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpire;
  delete obj.__v;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
