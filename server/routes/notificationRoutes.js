import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notificationController.js';

const router = Router();
router.use(protect);

router.get('/', getNotifications);
router.put('/read-all', markAllAsRead);        // must come before /:id
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;
