import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import config from './config/env.js';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ─── Security ───
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
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));

// ─── Static Files ───
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Health Check ───
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Complaint Portal API is running',
    environment: config.nodeEnv,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// ─── API Docs ───
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Complaint Management Portal API v2.0 — MongoDB Atlas',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'Login (returns JWT)',
        'GET  /api/auth/me': 'Current user [auth]',
        'PUT  /api/auth/profile': 'Update profile [auth]',
        'PUT  /api/auth/change-password': 'Change password [auth]',
      },
      complaints: {
        'GET    /api/complaints': 'My complaints [auth]',
        'POST   /api/complaints': 'Create complaint (+file upload) [auth]',
        'GET    /api/complaints/stats': 'My stats [auth]',
        'GET    /api/complaints/:id': 'Get complaint [auth]',
        'PUT    /api/complaints/:id': 'Update complaint [auth]',
        'DELETE /api/complaints/:id': 'Delete complaint [auth]',
        'POST   /api/complaints/:id/feedback': 'Submit feedback [auth]',
      },
      admin: {
        'GET    /api/admin/stats': 'Dashboard stats [admin]',
        'GET    /api/admin/complaints': 'All complaints [admin]',
        'PUT    /api/admin/complaints/:id/status': 'Update status [admin]',
        'PUT    /api/admin/complaints/:id/assign': 'Assign complaint [admin]',
        'GET    /api/admin/users': 'All users [admin]',
        'GET    /api/admin/users/:id': 'User detail [admin]',
        'PUT    /api/admin/users/:id/toggle': 'Toggle user active [admin]',
        'DELETE /api/admin/users/:id': 'Delete user [admin]',
        'GET    /api/admin/departments': 'All departments [admin]',
        'POST   /api/admin/departments': 'Create department [admin]',
        'PUT    /api/admin/departments/:id': 'Update department [admin]',
        'GET    /api/admin/reports': 'All reports [admin]',
        'POST   /api/admin/reports': 'Generate report [admin]',
        'GET    /api/admin/activity': 'Activity logs [admin]',
      },
      notifications: {
        'GET    /api/notifications': 'Get notifications [auth]',
        'PUT    /api/notifications/read-all': 'Mark all read [auth]',
        'PUT    /api/notifications/:id/read': 'Mark one read [auth]',
        'DELETE /api/notifications/:id': 'Delete notification [auth]',
      },
    },
    demoCredentials: {
      admin: { email: 'admin@example.com', password: 'password123' },
      user: { email: 'user@example.com', password: 'password123' },
    },
  });
});

// ─── 404 ───
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ─── Error Handler ───
app.use(errorHandler);

// ─── Bootstrap ───
const startServer = async () => {
  // Connect to MongoDB Atlas first
  await connectDB();

  const PORT = config.port;
  app.listen(PORT, () => {
    console.log('');
    console.log('╔══════════════════════════════════════════════════╗');
    console.log('║   🛡️  Complaint Portal API — MongoDB Atlas       ║');
    console.log(`║   Env:    ${config.nodeEnv.padEnd(39)}║`);
    console.log(`║   Port:   ${String(PORT).padEnd(39)}║`);
    console.log(`║   Docs:   http://localhost:${PORT}/api${' '.repeat(14)}║`);
    console.log(`║   Health: http://localhost:${PORT}/api/health${' '.repeat(7)}║`);
    console.log('╚══════════════════════════════════════════════════╝');
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err.message);
  process.exit(1);
});

export default app;
