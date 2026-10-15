import multer from 'multer';
import { BadRequestError } from '../errors/index.js';

const uploader = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1, fields: 12 },
  fileFilter: (req, file, callback) => {
    if (file.mimetype !== 'application/pdf' || !file.originalname.toLowerCase().endsWith('.pdf')) {
      callback(new BadRequestError('Please upload a PDF resume.'));
      return;
    }
    callback(null, true);
  },
}).single('resume');

const uploadResume = (req, res, next) => {
  uploader(req, res, (error) => {
    if (!error) return next();
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return next(new BadRequestError('Resume PDF must be 5 MB or smaller.'));
      }
      return next(new BadRequestError('Please upload one PDF resume.'));
    }
    return next(error);
  });
};

export default uploadResume;
