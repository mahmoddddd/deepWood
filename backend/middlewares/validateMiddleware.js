const { validationResult, body, param, query } = require('express-validator');
const { AppError } = require('./errorMiddleware');

/**
 * Validation result handler
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return next(new AppError(errorMessages, 400));
  }
  next();
};

/**
 * Common validation rules
 */
const validationRules = {
  // MongoDB ObjectId validation
  mongoId: (field = 'id') => [
    param(field)
      .isMongoId()
      .withMessage(`Invalid ${field} format`),
  ],

  // Pagination
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
  ],

  // Auth validation
  login: [
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],

  register: [
    body('name')
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],

  // Product validation
  product: [
    body('title_en')
      .notEmpty()
      .withMessage('English title is required'),
    body('title_ar')
      .notEmpty()
      .withMessage('Arabic title is required'),
    body('price')
      .isNumeric()
      .withMessage('Price must be a number')
      .custom(value => value >= 0)
      .withMessage('Price cannot be negative'),
  ],

  // Project validation
  project: [
    body('title_en')
      .notEmpty()
      .withMessage('English title is required'),
    body('title_ar')
      .notEmpty()
      .withMessage('Arabic title is required'),
  ],

  // Category validation
  category: [
    body('name_en')
      .notEmpty()
      .withMessage('English name is required'),
    body('name_ar')
      .notEmpty()
      .withMessage('Arabic name is required'),
  ],

  // Service validation
  service: [
    body('title_en')
      .notEmpty()
      .withMessage('English title is required'),
    body('title_ar')
      .notEmpty()
      .withMessage('Arabic title is required'),
  ],

  // Client validation
  client: [
    body('name_en')
      .notEmpty()
      .withMessage('English name is required'),
    body('name_ar')
      .notEmpty()
      .withMessage('Arabic name is required'),
  ],

  // Testimonial validation
  testimonial: [
    body('name_en')
      .notEmpty()
      .withMessage('English name is required'),
    body('name_ar')
      .notEmpty()
      .withMessage('Arabic name is required'),
    body('content_en')
      .notEmpty()
      .withMessage('English content is required'),
    body('content_ar')
      .notEmpty()
      .withMessage('Arabic content is required'),
  ],

  // Contact request validation
  contact: [
    body('name')
      .notEmpty()
      .withMessage('Name is required'),
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('message')
      .notEmpty()
      .withMessage('Message is required'),
  ],

  // Order validation
  order: [
    body('customerName')
      .notEmpty()
      .withMessage('Customer name is required'),
    body('customerPhone')
      .notEmpty()
      .withMessage('Customer phone is required'),
    body('items')
      .isArray({ min: 1 })
      .withMessage('Order must have at least one item'),
  ],
};

module.exports = {
  validate,
  validationRules,
  body,
  param,
  query,
};
