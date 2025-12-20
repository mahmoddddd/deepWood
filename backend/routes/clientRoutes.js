const express = require('express');
const router = express.Router();
const { getClients, getClient, getFeaturedClients, createClient, updateClient, deleteClient } = require('../controllers/clientController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { uploadSingle } = require('../middlewares/uploadMiddleware');
const { validate, validationRules } = require('../middlewares/validateMiddleware');

router.route('/').get(getClients).post(protect, authorize('admin', 'superadmin'), uploadSingle, validationRules.client, validate, createClient);
router.get('/featured', getFeaturedClients);
router.route('/:id').get(getClient).put(protect, authorize('admin', 'superadmin'), uploadSingle, updateClient).delete(protect, authorize('admin', 'superadmin'), deleteClient);

module.exports = router;
