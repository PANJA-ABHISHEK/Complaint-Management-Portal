const express = require('express');
const router = express.Router();
const {
  getAdminDashboardStats,
  getUserDashboardStats,
  exportComplaintsCSV,
} = require('../controllers/reportController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/admin-dashboard', protect, admin, getAdminDashboardStats);
router.get('/user-dashboard', protect, getUserDashboardStats);
router.get('/export-csv', protect, admin, exportComplaintsCSV);

module.exports = router;
