import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import { ApiError, asyncHandler, apiResponse } from '../utils/helpers.js';
import { sendEmail, emailTemplates } from '../utils/email.js';

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists');
  }

  // Create user (password hashed by pre-save hook)
  const user = await User.create({ name, email, password, phone });

  // Generate token
  const token = user.generateToken();

  // Log activity
  ActivityLog.log({
    userId: user._id,
    action: 'REGISTER',
    resource: 'User',
    resourceId: user._id,
    description: `New user registered: ${name}`,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
  }).catch(console.error);

  // Send welcome email (non-blocking)
  sendEmail({
    to: email,
    ...emailTemplates.welcome(user),
  }).catch(console.error);

  apiResponse(res, 201, { token, user: user.toSafeObject() }, 'Registration successful');
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user with password field
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Account is deactivated. Contact support.');
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Generate token
  const token = user.generateToken();

  // Log activity
  ActivityLog.log({
    userId: user._id,
    action: 'LOGIN',
    resource: 'User',
    description: `User logged in: ${user.email}`,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
  }).catch(console.error);

  apiResponse(res, 200, { token, user: user.toSafeObject() }, 'Login successful');
});

/**
 * @desc    Get current logged-in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('department', 'name code')
    .populate('complaints');

  apiResponse(res, 200, { user: user.toSafeObject() });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'User not found');

  if (name) user.name = name;
  if (phone) user.phone = phone;
  await user.save({ validateBeforeSave: false });

  ActivityLog.log({
    userId: user._id,
    action: 'PROFILE_UPDATED',
    resource: 'User',
    resourceId: user._id,
    description: 'Profile updated',
  }).catch(console.error);

  apiResponse(res, 200, { user: user.toSafeObject() }, 'Profile updated');
});

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!user) throw new ApiError(404, 'User not found');

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) throw new ApiError(400, 'Current password is incorrect');

  user.password = newPassword; // hashed by pre-save hook
  await user.save();

  ActivityLog.log({
    userId: user._id,
    action: 'PASSWORD_CHANGED',
    resource: 'User',
    resourceId: user._id,
    description: 'Password changed',
  }).catch(console.error);

  apiResponse(res, 200, null, 'Password changed successfully');
});
