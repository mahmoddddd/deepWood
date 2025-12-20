const multer = require('multer');
const path = require('path');
const { AppError } = require('./errorMiddleware');

// Configure storage - using memory storage for Cloudinary
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed image types
  const imageTypes = /jpeg|jpg|png|gif|webp/;
  // Allowed video types
  const videoTypes = /mp4|webm|mov|avi/;

  const extname = path.extname(file.originalname).toLowerCase().slice(1);
  const mimetype = file.mimetype;

  // Check if it's an image
  if (imageTypes.test(extname) && mimetype.startsWith('image/')) {
    return cb(null, true);
  }

  // Check if it's a video
  if (videoTypes.test(extname) && mimetype.startsWith('video/')) {
    return cb(null, true);
  }

  // Check if it's a document (for quotation attachments)
  const docTypes = /pdf|doc|docx/;
  if (docTypes.test(extname)) {
    return cb(null, true);
  }

  cb(new AppError('File type not supported. Allowed: images (jpg, png, gif, webp), videos (mp4, webm, mov), documents (pdf, doc, docx)', 400), false);
};

// Single image upload
const uploadSingle = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB for images
  },
}).single('image');

// Single video upload
const uploadVideo = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB for videos
  },
}).single('video');

// Multiple images upload (for galleries)
const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
}).array('images', 10); // Max 10 images

// Mixed upload (images and video)
const uploadMixed = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 10 },
  { name: 'video', maxCount: 1 },
  { name: 'beforeImage', maxCount: 1 },
  { name: 'afterImage', maxCount: 1 },
  { name: 'attachment', maxCount: 1 },
]);

// Wrapper to handle multer errors
const handleUpload = (uploadFn) => (req, res, next) => {
  uploadFn(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(new AppError('File too large', 400));
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return next(new AppError('Too many files', 400));
      }
      return next(new AppError(err.message, 400));
    } else if (err) {
      return next(err);
    }
    next();
  });
};

module.exports = {
  uploadSingle: handleUpload(uploadSingle),
  uploadVideo: handleUpload(uploadVideo),
  uploadMultiple: handleUpload(uploadMultiple),
  uploadMixed: handleUpload(uploadMixed),
};
