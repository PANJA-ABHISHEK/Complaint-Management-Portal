import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import db from '../config/db.js';
import { ApiError, asyncHandler, apiResponse } from '../utils/helpers.js';
import { sendEmail, emailTemplates } from '../utils/email.js';

/**
 * Generate JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwt.secret, { expiresIn: config.jwt.expire });
};

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Check if user exists
  const existingUser = db.users.find((u) => u.email === email);
  if (existingUser) {
    throw new ApiError(400, 'User with this email already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const newUser = {
    _id: db.generateId(),
    name,
    email,
    password: hashedPassword,
    phone: phone || null,
    role: 'user',
    avatar: null,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);

  // Generate token
  const token = generateToken(newUser._id);

  // Send welcome email (non-blocking)
  sendEmail({
    to: email,
    ...emailTemplates.welcome(newUser),
  }).catch(console.error);

  // Response without password
  const { password: _, ...userResponse } = newUser;

  apiResponse(res, 201, { token, user: userResponse }, 'Registration successful');
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user
  const user = db.users.find((u) => u.email === email);
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Generate token
  const token = generateToken(user._id);

  const { password: _, ...userResponse } = user;

  apiResponse(res, 200, { token, user: userResponse }, 'Login successful');
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  apiResponse(res, 200, { user: req.user });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const userIndex = db.users.findIndex((u) => u._id === req.user._id);

  if (userIndex === -1) {
    throw new ApiError(404, 'User not found');
  }

  if (name) db.users[userIndex].name = name;
  if (phone) db.users[userIndex].phone = phone;

  const { password: _, ...userResponse } = db.users[userIndex];

  apiResponse(res, 200, { user: userResponse }, 'Profile updated');
});

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = db.users.find((u) => u._id === req.user._id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new ApiError(400, 'Current password is incorrect');
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  apiResponse(res, 200, null, 'Password changed successfully');
});
