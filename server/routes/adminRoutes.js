import express from 'express';
import {
  getDashboardStats, getUsers, toggleBlockUser, changeUserRole,
  getDepartments, createDepartment, updateDepartment, deleteDepartment,
  getReports, getAllFeedback,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateDepartment } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/block', toggleBlockUser);
router.put('/users/:id/role', changeUserRole);

router.get('/departments', getDepartments);
router.post('/departments', validateDepartment, createDepartment);
router.put('/departments/:id', updateDepartment);
router.delete('/departments/:id', deleteDepartment);

router.get('/reports', getReports);
router.get('/feedback', getAllFeedback);

export default router;
