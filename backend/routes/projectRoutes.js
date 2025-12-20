const express = require('express');
const router = express.Router();
const { getProjects, getProject, getProjectBySlug, getFeaturedProjects, getCorporateProjects, createProject, updateProject, deleteProject } = require('../controllers/projectController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { uploadMixed } = require('../middlewares/uploadMiddleware');
const { validate, validationRules } = require('../middlewares/validateMiddleware');

router.route('/').get(getProjects).post(protect, authorize('admin', 'superadmin'), uploadMixed, validationRules.project, validate, createProject);
router.get('/featured', getFeaturedProjects);
router.get('/corporate', getCorporateProjects);
router.get('/slug/:slug', getProjectBySlug);
router.route('/:id').get(getProject).put(protect, authorize('admin', 'superadmin'), uploadMixed, updateProject).delete(protect, authorize('admin', 'superadmin'), deleteProject);

module.exports = router;
