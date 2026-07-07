const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getUserComplaints,
  getAllComplaints,
  getComplaintById,
  assignComplaint,
  updateComplaintStatus,
} = require('../controllers/complaintController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// User & Admin shared/protected routes
router.post('/', protect, upload.array('attachments', 5), createComplaint);
router.get('/', protect, getUserComplaints);
router.get('/all', protect, admin, getAllComplaints);
router.get('/:id', protect, getComplaintById);

// Admin / Authority specific routes
router.put('/:id/assign', protect, admin, assignComplaint);
router.put('/:id/status', protect, updateComplaintStatus);

module.exports = router;
