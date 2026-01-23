const express = require('express');
const router = express.Router();
const {
  getSiteImages,
  getSiteImageByKey,
  getSiteImage,
  createSiteImage,
  updateSiteImage,
  deleteSiteImage,
  seedSiteImages,
} = require('../controllers/siteImageController');
const { uploadSingle } = require('../middlewares/uploadMiddleware');

// Public routes
router.get('/', getSiteImages);
router.get('/key/:key', getSiteImageByKey);
router.get('/:id', getSiteImage);

// Admin routes
router.post('/', uploadSingle, createSiteImage);
router.post('/seed', seedSiteImages);
router.put('/:id', uploadSingle, updateSiteImage);
router.delete('/:id', deleteSiteImage);

module.exports = router;
