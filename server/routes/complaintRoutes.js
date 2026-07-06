import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';
import upload from '../config/multer.js';
import {
  createComplaint,
  getMyComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  submitFeedback,
  getMyStats,
} from '../controllers/complaintController.js';

const router = Router();

// All complaint routes require auth
router.use(protect);

// @route GET /api/complaints/stats  (must be before /:id)
router.get('/stats', getMyStats);

// @route GET /api/complaints
router.get('/', getMyComplaints);

// @route POST /api/complaints
router.post(
  '/',
  upload.array('attachments', 5),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('category')
      .trim()
      .notEmpty()
      .isIn(['Infrastructure', 'Utilities', 'Sanitation', 'Safety', 'Transportation', 'Environment', 'Health', 'Education', 'Other'])
      .withMessage('Valid category is required'),
    body('department').trim().notEmpty().withMessage('Department is required'),
    body('description')
      .trim()
      .isLength({ min: 20 })
      .withMessage('Description must be at least 20 characters'),
    body('priority')
      .optional()
      .isIn(['Low', 'Medium', 'High', 'Critical'])
      .withMessage('Priority must be Low, Medium, High, or Critical'),
    body('location').optional().trim(),
  ],
  validate,
  createComplaint
);

// @route GET /api/complaints/:id
router.get('/:id', getComplaintById);

// @route PUT /api/complaints/:id
router.put(
  '/:id',
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().trim().isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
    body('priority').optional().isIn(['Low', 'Medium', 'High', 'Critical']),
  ],
  validate,
  updateComplaint
);

// @route DELETE /api/complaints/:id
router.delete('/:id', deleteComplaint);

// @route POST /api/complaints/:id/feedback
router.post(
  '/:id/feedback',
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1–5'),
    body('comment').optional().trim(),
  ],
  validate,
  submitFeedback
);

export default router;
