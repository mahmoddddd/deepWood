const express = require('express');
const router = express.Router();
const { getContactRequests, getContactRequest, createContactRequest, updateContactRequest, respondToRequest, deleteContactRequest, getContactStats } = require('../controllers/contactController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { uploadMixed } = require('../middlewares/uploadMiddleware');
const { validate, validationRules } = require('../middlewares/validateMiddleware');

router.route('/').get(protect, authorize('admin', 'superadmin'), getContactRequests).post(uploadMixed, validationRules.contact, validate, createContactRequest);
router.get('/stats', protect, authorize('admin', 'superadmin'), getContactStats);
router.route('/:id').get(protect, authorize('admin', 'superadmin'), getContactRequest).put(protect, authorize('admin', 'superadmin'), updateContactRequest).delete(protect, authorize('admin', 'superadmin'), deleteContactRequest);
router.post('/:id/respond', protect, authorize('admin', 'superadmin'), respondToRequest);

module.exports = router;
