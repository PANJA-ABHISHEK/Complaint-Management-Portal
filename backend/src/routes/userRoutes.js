const express = require('express');
const router = express.Router();
const { getUsers, updateUserStatus } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, admin, getUsers);
router.put('/:id/status', protect, admin, updateUserStatus);

module.exports = router;
