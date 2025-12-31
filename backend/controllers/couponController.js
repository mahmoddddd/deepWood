const Coupon = require('../models/Coupon');
const asyncHandler = require('express-async-handler');

// @desc    Get all coupons
// @route   GET /api/coupons
exports.getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort('-createdAt');
  res.status(200).json({
    success: true,
    count: coupons.length,
    data: coupons,
  });
});

// @desc    Get single coupon
// @route   GET /api/coupons/:id
exports.getCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    return res.status(404).json({ success: false, error: 'Coupon not found' });
  }
  res.status(200).json({ success: true, data: coupon });
});

// @desc    Validate coupon code
// @route   POST /api/coupons/validate
exports.validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderTotal } = req.body;

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });
  if (!coupon) {
    return res.status(404).json({ success: false, error: 'Invalid coupon code' });
  }

  const validity = coupon.isValid();
  if (!validity.valid) {
    return res.status(400).json({ success: false, error: validity.message });
  }

  const { discount, message } = coupon.calculateDiscount(orderTotal || 0);
  if (message) {
    return res.status(400).json({ success: false, error: message });
  }

  res.status(200).json({
    success: true,
    data: {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      calculatedDiscount: discount,
    },
  });
});

// @desc    Create coupon
// @route   POST /api/coupons
exports.createCoupon = asyncHandler(async (req, res) => {
  // Convert code to uppercase
  if (req.body.code) {
    req.body.code = req.body.code.toUpperCase();
  }

  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, data: coupon });
});

// @desc    Update coupon
// @route   PUT /api/coupons/:id
exports.updateCoupon = asyncHandler(async (req, res) => {
  if (req.body.code) {
    req.body.code = req.body.code.toUpperCase();
  }

  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!coupon) {
    return res.status(404).json({ success: false, error: 'Coupon not found' });
  }

  res.status(200).json({ success: true, data: coupon });
});

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
exports.deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) {
    return res.status(404).json({ success: false, error: 'Coupon not found' });
  }
  res.status(200).json({ success: true, data: {} });
});

// @desc    Apply coupon to order (increment usage)
// @route   POST /api/coupons/apply
exports.applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;

  const coupon = await Coupon.findOneAndUpdate(
    { code: code.toUpperCase() },
    { $inc: { usedCount: 1 } },
    { new: true }
  );

  if (!coupon) {
    return res.status(404).json({ success: false, error: 'Coupon not found' });
  }

  res.status(200).json({ success: true, data: coupon });
});
