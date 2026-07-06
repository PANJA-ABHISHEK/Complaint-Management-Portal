import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config/env.js';
import errorHandler from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// ES Module __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ─── Security Middleware ───
app.use(helmet());
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body Parsers ───
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Logging ───
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ─── Static Files (uploads) ───
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Health Check ───
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Complaint Portal API is running',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// ─── API Documentation ───
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Complaint Management Portal API v1.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register a new user',
        'POST /api/auth/login': 'Login and get JWT token',
        'GET  /api/auth/me': 'Get current user (requires auth)',
        'PUT  /api/auth/profile': 'Update profile (requires auth)',
        'PUT  /api/auth/change-password': 'Change password (requires auth)',
      },
      complaints: {
        'GET    /api/complaints': 'Get user complaints (requires auth)',
        'POST   /api/complaints': 'Create complaint with file upload (requires auth)',
        'GET    /api/complaints/stats': 'Get user complaint stats (requires auth)',
        'GET    /api/complaints/:id': 'Get complaint by ID (requires auth)',
        'PUT    /api/complaints/:id': 'Update own complaint (requires auth)',
        'DELETE /api/complaints/:id': 'Delete own complaint (requires auth)',
      },
      admin: {
        'GET    /api/admin/stats': 'Get admin dashboard stats (admin only)',
        'GET    /api/admin/complaints': 'Get all complaints (admin only)',
        'PUT    /api/admin/complaints/:id/status': 'Update complaint status (admin only)',
        'PUT    /api/admin/complaints/:id/assign': 'Assign complaint (admin only)',
        'GET    /api/admin/users': 'Get all users (admin only)',
        'GET    /api/admin/users/:id': 'Get user by ID (admin only)',
        'DELETE /api/admin/users/:id': 'Delete user (admin only)',
      },
      notifications: {
        'GET /api/notifications': 'Get user notifications (requires auth)',
        'PUT /api/notifications/:id/read': 'Mark notification read (requires auth)',
        'PUT /api/notifications/read-all': 'Mark all as read (requires auth)',
      },
    },
    demoCredentials: {
      user: { email: 'user@example.com', password: 'password123' },
      admin: { email: 'admin@example.com', password: 'password123' },
    },
  });
});

// ─── 404 Handler ───
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ─── Error Handler ───
app.use(errorHandler);

// ─── Start Server ───
const PORT = config.port;
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   🛡️  Complaint Portal API Server            ║');
  console.log(`║   Environment: ${config.nodeEnv.padEnd(29)}║`);
  console.log(`║   Port: ${String(PORT).padEnd(36)}║`);
  console.log(`║   API Docs: http://localhost:${PORT}/api${' '.repeat(10)}║`);
  console.log(`║   Health: http://localhost:${PORT}/api/health${' '.repeat(5)}║`);
  console.log('╚══════════════════════════════════════════════╝');
  console.log('');
});

export default app;
