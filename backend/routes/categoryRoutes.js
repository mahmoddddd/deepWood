const express = require('express');
const router = express.Router();
const { getCategories, getCategory, getCategoryBySlug, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { uploadSingle } = require('../middlewares/uploadMiddleware');
const { validate, validationRules } = require('../middlewares/validateMiddleware');

router.route('/').get(getCategories).post(uploadSingle, validationRules.category, validate, createCategory);
router.get('/slug/:slug', getCategoryBySlug);
router.route('/:id').get(getCategory).put(uploadSingle, updateCategory).delete(deleteCategory);

module.exports = router;
