import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from '../controllers/notificationController.js';

const router = Router();

router.use(protect);

// @route GET /api/notifications
router.get('/', getNotifications);

// @route PUT /api/notifications/read-all
router.put('/read-all', markAllAsRead);

// @route PUT /api/notifications/:id/read
router.put('/:id/read', markAsRead);

export default router;
