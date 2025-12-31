const express = require('express');
const router = express.Router();
const {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  applyCoupon,
} = require('../controllers/couponController');

// Public routes
router.post('/validate', validateCoupon);

// Admin routes (temporarily without auth)
router.route('/')
  .get(getCoupons)
  .post(createCoupon);

router.route('/:id')
  .get(getCoupon)
  .put(updateCoupon)
  .delete(deleteCoupon);

router.post('/apply', applyCoupon);

module.exports = router;
