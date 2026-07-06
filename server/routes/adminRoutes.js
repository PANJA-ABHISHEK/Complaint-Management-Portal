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
  toggleUserStatus,
  deleteUser,
  getAdminStats,
  generateReport,
  getReports,
  getDepartments,
  createDepartment,
  updateDepartment,
  getActivityLogs,
} from '../controllers/adminController.js';

const router = Router();

// All admin routes require auth + admin role
router.use(protect, authorize('admin'));

// ─── Dashboard ───
router.get('/stats', getAdminStats);

// ─── Complaints ───
router.get('/complaints', getAllComplaints);

router.put(
  '/complaints/:id/status',
  [
    body('status')
      .notEmpty()
      .isIn(['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Rejected'])
      .withMessage('Invalid status value'),
    body('note').optional().trim(),
  ],
  validate,
  updateComplaintStatus
);

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
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/toggle', toggleUserStatus);
router.delete('/users/:id', deleteUser);

// ─── Reports ───
router.get('/reports', getReports);
router.post(
  '/reports',
  [
    body('type')
      .notEmpty()
      .isIn(['daily', 'weekly', 'monthly', 'quarterly', 'annual', 'custom'])
      .withMessage('Invalid report type'),
    body('from').notEmpty().isISO8601().withMessage('Valid from date required'),
    body('to').notEmpty().isISO8601().withMessage('Valid to date required'),
  ],
  validate,
  generateReport
);

// ─── Departments ───
router.get('/departments', getDepartments);
router.post(
  '/departments',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('code').trim().notEmpty().withMessage('Code is required'),
  ],
  validate,
  createDepartment
);
router.put('/departments/:id', updateDepartment);

// ─── Activity Logs ───
router.get('/activity', getActivityLogs);

export default router;
