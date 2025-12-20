const express = require('express');
const router = express.Router();
const { getCategories, getCategory, getCategoryBySlug, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { uploadSingle } = require('../middlewares/uploadMiddleware');
const { validate, validationRules } = require('../middlewares/validateMiddleware');

router.route('/').get(getCategories).post(protect, authorize('admin', 'superadmin'), uploadSingle, validationRules.category, validate, createCategory);
router.get('/slug/:slug', getCategoryBySlug);
router.route('/:id').get(getCategory).put(protect, authorize('admin', 'superadmin'), uploadSingle, updateCategory).delete(protect, authorize('admin', 'superadmin'), deleteCategory);

module.exports = router;
