const Review = require('../models/Review');
const { asyncHandler, AppError } = require('../middlewares/errorMiddleware');

// @desc    Get all reviews
// @route   GET /api/reviews
// @route   GET /api/products/:productId/reviews
exports.getAllReviews = asyncHandler(async (req, res, next) => {
  let filter = {};
  if (req.params.productId) filter = { product: req.params.productId };

  const reviews = await Review.find(filter);

  res.status(200).json({
    success: true,
    results: reviews.length,
    data: reviews,
  });
});

// @desc    Create new review
// @route   POST /api/products/:productId/reviews
// @route   POST /api/reviews
exports.createReview = asyncHandler(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);

  res.status(201).json({
    success: true,
    data: newReview,
  });
});

// @desc    Update review
// @route   PATCH /api/reviews/:id
exports.updateReview = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id);

    if (!review) {
        return next(new AppError('No review found with that ID', 404));
    }

    if (req.user.role !== 'admin' && review.user.id !== req.user.id) {
        return next(new AppError('You update own reviews only', 403));
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: review
    });
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
exports.deleteReview = asyncHandler(async (req, res, next) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        return next(new AppError('No review found with that ID', 404));
    }

    if (req.user.role !== 'admin' && review.user.id !== req.user.id) {
        return next(new AppError('You perform this action', 403));
    }

    await Review.findByIdAndDelete(req.params.id);

    res.status(204).json({
        success: true,
        data: null
    });
});
