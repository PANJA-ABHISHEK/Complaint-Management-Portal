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
  getMyStats,
} from '../controllers/complaintController.js';

const router = Router();

// All complaint routes are protected
router.use(protect);

// @route GET /api/complaints/stats
router.get('/stats', getMyStats);

// @route GET /api/complaints
router.get('/', getMyComplaints);

// @route POST /api/complaints
router.post(
  '/',
  upload.array('attachments', 5),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('department').trim().notEmpty().withMessage('Department is required'),
    body('description')
      .trim()
      .isLength({ min: 20 })
      .withMessage('Description must be at least 20 characters'),
    body('priority')
      .optional()
      .isIn(['Low', 'Medium', 'High'])
      .withMessage('Priority must be Low, Medium, or High'),
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
    body('description')
      .optional()
      .trim()
      .isLength({ min: 20 })
      .withMessage('Description must be at least 20 characters'),
  ],
  validate,
  updateComplaint
);

// @route DELETE /api/complaints/:id
router.delete('/:id', deleteComplaint);

export default router;
