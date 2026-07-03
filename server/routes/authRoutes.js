import express from 'express';
import {
  register, login, logout, getMe, updateProfile, updateAvatar, forgotPassword, resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateRegister, validateLogin, validateForgotPassword, validateResetPassword } from '../middleware/validate.js';
import { uploadAvatar } from '../config/multer.js';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.put('/reset-password/:token', validateResetPassword, resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/update-avatar', protect, uploadAvatar, updateAvatar);

export default router;
