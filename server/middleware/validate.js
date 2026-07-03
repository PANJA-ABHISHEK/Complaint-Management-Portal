import { body, query, param } from 'express-validator';
import { validationResult } from 'express-validator';

// Handle validation results
export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// Auth validations
export const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
  body('email').trim().isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidation,
];

export const validateLogin = [
  body('email').trim().isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation,
];

export const validateForgotPassword = [
  body('email').trim().isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  handleValidation,
];

export const validateResetPassword = [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidation,
];

// Complaint validations
export const validateComplaint = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('description').trim().notEmpty().withMessage('Description is required').isLength({ max: 5000 }),
  body('category').notEmpty().withMessage('Category is required').isIn([
    'Electricity', 'Water Supply', 'Road Damage', 'Street Lights',
    'Garbage Collection', 'Internet', 'College', 'Hostel',
    'Transport', 'Health', 'Security', 'Others',
  ]).withMessage('Invalid category'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Invalid priority'),
  handleValidation,
];

export const validateStatusUpdate = [
  body('status').notEmpty().withMessage('Status is required').isIn([
    'Submitted', 'Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Rejected',
  ]).withMessage('Invalid status'),
  body('message').optional().trim(),
  handleValidation,
];

// Department validations
export const validateDepartment = [
  body('name').trim().notEmpty().withMessage('Department name is required'),
  body('code').trim().notEmpty().withMessage('Department code is required'),
  handleValidation,
];

// Feedback validations
export const validateFeedback = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ max: 1000 }),
  handleValidation,
];
