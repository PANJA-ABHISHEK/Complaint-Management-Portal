import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/complaint_portal',
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_change_me',
    expire: process.env.JWT_EXPIRE || '7d',
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  email: {
    from: process.env.FROM_EMAIL || 'noreply@complaintportal.com',
    fromName: process.env.FROM_NAME || 'ComplaintPortal',
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880,
    dir: process.env.UPLOAD_DIR || 'uploads',
  },
};

export default config;
