const Category = require('../models/Category');
const { asyncHandler, AppError } = require('../middlewares/errorMiddleware');
const ApiFeatures = require('../utils/apiFeatures');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
exports.getCategories = asyncHandler(async (req, res, next) => {
  const features = new ApiFeatures(Category.find(), req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate();

  const categories = await features.query.populate('productCount projectCount');
  const total = await Category.countDocuments();

  res.status(200).json({
    success: true,
    count: categories.length,
    total,
    pagination: features.pagination,
    data: categories,
  });
});

/**
 * @desc    Get single category
 * @route   GET /api/categories/:id
 * @access  Public
 */
exports.getCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).populate('productCount projectCount');

  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

/**
 * @desc    Get category by slug
 * @route   GET /api/categories/slug/:slug
 * @access  Public
 */
exports.getCategoryBySlug = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({ slug: req.params.slug }).populate('productCount projectCount');

  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

/**
 * @desc    Create category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
exports.createCategory = asyncHandler(async (req, res, next) => {
  // Handle image upload
  if (req.file) {
    const result = await uploadToCloudinary(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      'deepwood/categories'
    );
    req.body.image = {
      url: result.url,
      publicId: result.publicId,
    };
  }

  const category = await Category.create(req.body);

  res.status(201).json({
    success: true,
    data: category,
  });
});

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
exports.updateCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  // Handle image upload
  if (req.file) {
    // Delete old image
    if (category.image && category.image.publicId) {
      await deleteFromCloudinary(category.image.publicId);
    }

    const result = await uploadToCloudinary(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      'deepwood/categories'
    );
    req.body.image = {
      url: result.url,
      publicId: result.publicId,
    };
  }

  category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: category,
  });
});

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new AppError('Category not found', 404));
  }

  // Delete image from Cloudinary
  if (category.image && category.image.publicId) {
    await deleteFromCloudinary(category.image.publicId);
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
