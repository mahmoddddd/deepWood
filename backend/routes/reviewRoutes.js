const express = require('express');
const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
} = require('../controllers/reviewController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), createReview);

router
  .route('/:id')
  .patch(protect, restrictTo('user', 'admin'), updateReview)
  .delete(protect, restrictTo('user', 'admin'), deleteReview);

module.exports = router;
