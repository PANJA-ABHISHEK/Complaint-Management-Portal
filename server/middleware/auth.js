import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/env.js';
import { AppError } from './errorHandler.js';

// Protect routes - verify JWT
export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new AppError('Not authorized. Please log in.', 401));
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError('User no longer exists.', 401));
    }

    if (user.isBlocked) {
      return next(new AppError('Your account has been blocked. Contact admin.', 403));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Not authorized. Please log in.', 401));
  }
};

// Authorize by role
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(`Role '${req.user.role}' is not authorized to access this resource`, 403));
    }
    next();
  };
};
