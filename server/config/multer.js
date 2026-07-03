import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import config from './env.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const allowedDocTypes = ['application/pdf'];
  const allowedTypes = [...allowedImageTypes, ...allowedDocTypes];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WebP, and PDF files are allowed.'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.maxFileSize,
  },
});

export const uploadImages = upload.array('images', 5);
export const uploadDocuments = upload.array('documents', 3);
export const uploadAvatar = upload.single('avatar');
export const uploadResolution = upload.array('resolutionImages', 3);

export const uploadComplaintFiles = upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'documents', maxCount: 3 },
]);
