const express = require('express');
const router = express.Router();
const { getProducts, getProduct, getProductBySlug, getFeaturedProducts, createProduct, updateProduct, deleteProduct, deleteGalleryImage } = require('../controllers/productController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { uploadMixed } = require('../middlewares/uploadMiddleware');
const { validate, validationRules } = require('../middlewares/validateMiddleware');

router.route('/').get(getProducts).post(protect, authorize('admin', 'superadmin'), uploadMixed, validationRules.product, validate, createProduct);
router.get('/featured', getFeaturedProducts);
router.get('/slug/:slug', getProductBySlug);
router.route('/:id').get(getProduct).put(protect, authorize('admin', 'superadmin'), uploadMixed, updateProduct).delete(protect, authorize('admin', 'superadmin'), deleteProduct);
router.delete('/:id/gallery/:imageId', protect, authorize('admin', 'superadmin'), deleteGalleryImage);

module.exports = router;
