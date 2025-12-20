const express = require('express');
const router = express.Router();
const { register, login, logout, getMe, updateDetails, updatePassword } = require('../controllers/authController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { validate, validationRules } = require('../middlewares/validateMiddleware');

router.post('/register', protect, authorize('superadmin'), validationRules.register, validate, register);
router.post('/login', validationRules.login, validate, login);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;
