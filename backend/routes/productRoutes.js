const express = require('express');
const router = express.Router();
const { getProducts, getProduct, getProductBySlug, getFeaturedProducts, createProduct, updateProduct, deleteProduct, deleteGalleryImage } = require('../controllers/productController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { uploadMixed } = require('../middlewares/uploadMiddleware');
const { validate, validationRules } = require('../middlewares/validateMiddleware');

router.route('/').get(getProducts).post(uploadMixed, validationRules.product, validate, createProduct);
router.get('/featured', getFeaturedProducts);
router.get('/slug/:slug', getProductBySlug);
router.route('/:id').get(getProduct).put(uploadMixed, updateProduct).delete(deleteProduct);
router.delete('/:id/gallery/:imageId', deleteGalleryImage);

module.exports = router;
