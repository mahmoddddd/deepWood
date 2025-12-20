const express = require('express');
const router = express.Router();
const { getTestimonials, getTestimonial, getFeaturedTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } = require('../controllers/testimonialController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { uploadSingle } = require('../middlewares/uploadMiddleware');
const { validate, validationRules } = require('../middlewares/validateMiddleware');

router.route('/').get(getTestimonials).post(protect, authorize('admin', 'superadmin'), uploadSingle, validationRules.testimonial, validate, createTestimonial);
router.get('/featured', getFeaturedTestimonials);
router.route('/:id').get(getTestimonial).put(protect, authorize('admin', 'superadmin'), uploadSingle, updateTestimonial).delete(protect, authorize('admin', 'superadmin'), deleteTestimonial);

module.exports = router;
