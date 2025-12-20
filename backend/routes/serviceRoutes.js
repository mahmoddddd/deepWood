const express = require('express');
const router = express.Router();
const { getServices, getService, getServiceBySlug, getFeaturedServices, createService, updateService, deleteService } = require('../controllers/serviceController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { uploadMixed } = require('../middlewares/uploadMiddleware');
const { validate, validationRules } = require('../middlewares/validateMiddleware');

router.route('/').get(getServices).post(protect, authorize('admin', 'superadmin'), uploadMixed, validationRules.service, validate, createService);
router.get('/featured', getFeaturedServices);
router.get('/slug/:slug', getServiceBySlug);
router.route('/:id').get(getService).put(protect, authorize('admin', 'superadmin'), uploadMixed, updateService).delete(protect, authorize('admin', 'superadmin'), deleteService);

module.exports = router;
