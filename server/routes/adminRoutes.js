import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validate.js';
import { protect, authorize } from '../middleware/auth.js';
import {
  getAllComplaints,
  updateComplaintStatus,
  assignComplaint,
  getAllUsers,
  getUserById,
  deleteUser,
  getAdminStats,
} from '../controllers/adminController.js';

const router = Router();

// All admin routes are protected + admin only
router.use(protect, authorize('admin'));

// @route GET /api/admin/stats
router.get('/stats', getAdminStats);

// ─── Complaints ───
// @route GET /api/admin/complaints
router.get('/complaints', getAllComplaints);

// @route PUT /api/admin/complaints/:id/status
router.put(
  '/complaints/:id/status',
  [
    body('status')
      .notEmpty()
      .isIn(['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'])
      .withMessage('Invalid status value'),
    body('note').optional().trim(),
  ],
  validate,
  updateComplaintStatus
);

// @route PUT /api/admin/complaints/:id/assign
router.put(
  '/complaints/:id/assign',
  [
    body('assignedTo').notEmpty().withMessage('assignedTo user ID is required'),
    body('note').optional().trim(),
  ],
  validate,
  assignComplaint
);

// ─── Users ───
// @route GET /api/admin/users
router.get('/users', getAllUsers);

// @route GET /api/admin/users/:id
router.get('/users/:id', getUserById);

// @route DELETE /api/admin/users/:id
router.delete('/users/:id', deleteUser);

export default router;
