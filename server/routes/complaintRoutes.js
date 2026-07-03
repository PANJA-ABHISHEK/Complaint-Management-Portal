import express from 'express';
import {
  createComplaint, getComplaints, getComplaint, updateStatus,
  assignComplaint, addInternalNote, resolveComplaint, closeComplaint,
  deleteComplaint, submitFeedback,
} from '../controllers/complaintController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateComplaint, validateStatusUpdate, validateFeedback } from '../middleware/validate.js';
import { uploadComplaintFiles, uploadResolution } from '../config/multer.js';

const router = express.Router();

router.use(protect);

router.post('/', uploadComplaintFiles, validateComplaint, createComplaint);
router.get('/', getComplaints);
router.get('/:id', getComplaint);

// Officer & Admin actions
router.put('/:id/status', authorize('officer', 'admin'), validateStatusUpdate, updateStatus);
router.put('/:id/assign', authorize('admin'), assignComplaint);
router.put('/:id/notes', authorize('officer', 'admin'), addInternalNote);
router.put('/:id/resolve', authorize('officer', 'admin'), uploadResolution, resolveComplaint);
router.put('/:id/close', authorize('officer', 'admin'), closeComplaint);
router.delete('/:id', authorize('admin'), deleteComplaint);

// User feedback
router.post('/:id/feedback', authorize('user'), validateFeedback, submitFeedback);

export default router;
