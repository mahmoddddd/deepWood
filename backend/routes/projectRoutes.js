const express = require('express');
const router = express.Router();
const { getProjects, getProject, getProjectBySlug, getFeaturedProjects, getCorporateProjects, createProject, updateProject, deleteProject, seedProjects } = require('../controllers/projectController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { uploadMixed } = require('../middlewares/uploadMiddleware');
const { validate, validationRules } = require('../middlewares/validateMiddleware');

router.post('/seed', seedProjects);
router.route('/').get(getProjects).post(uploadMixed, validationRules.project, validate, createProject);
router.get('/featured', getFeaturedProjects);
router.get('/corporate', getCorporateProjects);
router.get('/slug/:slug', getProjectBySlug);
router.route('/:id').get(getProject).put(uploadMixed, updateProject).delete(deleteProject);

module.exports = router;
