import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Upload qovluğunu yoxla/yarat
const ensureUploadDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Excel faylları üçün storage
const excelStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/excel';
    ensureUploadDir(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `assets-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// PDF faylları üçün storage
const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads/pdf';
    ensureUploadDir(uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `report-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Fayl filterləri
const fileFilter = (req, file, cb) => {
  const allowedTypes = {
    'application/vnd.ms-excel': true,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': true,
    'application/pdf': true,
    'text/csv': true
  };
  
  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error('Yalnız Excel, PDF və CSV faylları yükləyə bilərsiniz'), false);
  }
};

// Multer instances
export const uploadExcel = multer({
  storage: excelStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

export const uploadPdf = multer({
  storage: pdfStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Yalnız PDF faylları yükləyə bilərsiniz'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Error handling middleware
export const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'Fayl həcmi çox böyükdür'
      });
    }
  }
  res.status(400).json({
    success: false,
    error: error.message
  });
};