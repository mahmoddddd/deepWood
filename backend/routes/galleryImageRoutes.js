const express = require('express');
const router = express.Router();
const {
  getGalleryImages,
  getGalleryImage,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  bulkCreateGalleryImages,
} = require('../controllers/galleryImageController');
const { uploadSingle } = require('../middlewares/uploadMiddleware');

// Public routes
router.get('/', getGalleryImages);
router.get('/:id', getGalleryImage);

// Admin routes (should add auth middleware in production)
router.post('/', uploadSingle, createGalleryImage);
router.post('/bulk', bulkCreateGalleryImages);
router.put('/:id', uploadSingle, updateGalleryImage);
router.delete('/:id', deleteGalleryImage);

module.exports = router;
