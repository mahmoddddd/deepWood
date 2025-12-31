const Product = require('../models/Product');
const { asyncHandler, AppError } = require('../middlewares/errorMiddleware');
const ApiFeatures = require('../utils/apiFeatures');
const { uploadToCloudinary, deleteFromCloudinary, uploadMultipleToCloudinary } = require('../utils/cloudinary');

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
exports.getProducts = asyncHandler(async (req, res, next) => {
  const features = new ApiFeatures(Product.find(), req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query.populate('category', 'name_en name_ar slug');
  const total = await Product.countDocuments(req.query.status ? { status: req.query.status } : {});

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    pagination: features.pagination,
    data: products,
  });
});

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
exports.getFeaturedProducts = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 8;

  const products = await Product.find({ featured: true, status: 'active' })
    .sort('-createdAt')
    .limit(limit)
    .populate('category', 'name_en name_ar slug');

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Public
 */
exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate('category', 'name_en name_ar slug');

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  // Increment views
  product.views += 1;
  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: product,
  });
});

/**
 * @desc    Get product by slug
 * @route   GET /api/products/slug/:slug
 * @access  Public
 */
exports.getProductBySlug = asyncHandler(async (req, res, next) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name_en name_ar slug');

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  // Increment views
  product.views += 1;
  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: product,
  });
});

/**
 * @desc    Create product
 * @route   POST /api/products
 * @access  Private/Admin
 */
exports.createProduct = asyncHandler(async (req, res, next) => {
  // Handle main image upload
  if (req.files && req.files.image) {
    const result = await uploadToCloudinary(
      `data:${req.files.image[0].mimetype};base64,${req.files.image[0].buffer.toString('base64')}`,
      'deepwood/products'
    );
    req.body.image = {
      url: result.url,
      publicId: result.publicId,
    };
  }

  // Handle gallery images
  if (req.files && req.files.images) {
    const galleryPromises = req.files.images.map((file, index) =>
      uploadToCloudinary(
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        'deepwood/products/gallery'
      ).then(result => ({
        url: result.url,
        publicId: result.publicId,
        order: index,
      }))
    );
    req.body.gallery = await Promise.all(galleryPromises);
  }

  // Handle video upload
  if (req.files && req.files.video) {
    const result = await uploadToCloudinary(
      `data:${req.files.video[0].mimetype};base64,${req.files.video[0].buffer.toString('base64')}`,
      'deepwood/products/videos',
      'video'
    );
    req.body.video = {
      url: result.url,
      publicId: result.publicId,
    };
  }

  // Parse JSON fields if sent as strings
  if (typeof req.body.specifications === 'string') {
    req.body.specifications = JSON.parse(req.body.specifications);
  }
  if (typeof req.body.dimensions === 'string') {
    req.body.dimensions = JSON.parse(req.body.dimensions);
  }
  if (typeof req.body.materials_en === 'string') {
    req.body.materials_en = JSON.parse(req.body.materials_en);
  }
  if (typeof req.body.materials_ar === 'string') {
    req.body.materials_ar = JSON.parse(req.body.materials_ar);
  }
  if (typeof req.body.seo === 'string') {
    req.body.seo = JSON.parse(req.body.seo);
  }
  if (typeof req.body.colors === 'string') {
    req.body.colors = JSON.parse(req.body.colors);
  }
  if (typeof req.body.sizes === 'string') {
    req.body.sizes = JSON.parse(req.body.sizes);
  }

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product,
  });
});

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  // Handle main image upload
  if (req.files && req.files.image) {
    // Delete old image
    if (product.image && product.image.publicId) {
      await deleteFromCloudinary(product.image.publicId);
    }

    const result = await uploadToCloudinary(
      `data:${req.files.image[0].mimetype};base64,${req.files.image[0].buffer.toString('base64')}`,
      'deepwood/products'
    );
    req.body.image = {
      url: result.url,
      publicId: result.publicId,
    };
  }

  // Handle gallery images (append to existing)
  if (req.files && req.files.images) {
    const galleryPromises = req.files.images.map((file, index) =>
      uploadToCloudinary(
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        'deepwood/products/gallery'
      ).then(result => ({
        url: result.url,
        publicId: result.publicId,
        order: (product.gallery?.length || 0) + index,
      }))
    );
    const newImages = await Promise.all(galleryPromises);
    req.body.gallery = [...(product.gallery || []), ...newImages];
  }

  // Handle video upload
  if (req.files && req.files.video) {
    // Delete old video
    if (product.video && product.video.publicId) {
      await deleteFromCloudinary(product.video.publicId, 'video');
    }

    const result = await uploadToCloudinary(
      `data:${req.files.video[0].mimetype};base64,${req.files.video[0].buffer.toString('base64')}`,
      'deepwood/products/videos',
      'video'
    );
    req.body.video = {
      url: result.url,
      publicId: result.publicId,
    };
  }

  // Parse JSON fields
  if (typeof req.body.specifications === 'string') {
    req.body.specifications = JSON.parse(req.body.specifications);
  }
  if (typeof req.body.dimensions === 'string') {
    req.body.dimensions = JSON.parse(req.body.dimensions);
  }
  if (typeof req.body.materials_en === 'string') {
    req.body.materials_en = JSON.parse(req.body.materials_en);
  }
  if (typeof req.body.materials_ar === 'string') {
    req.body.materials_ar = JSON.parse(req.body.materials_ar);
  }
  if (typeof req.body.seo === 'string') {
    req.body.seo = JSON.parse(req.body.seo);
  }
  if (typeof req.body.colors === 'string') {
    req.body.colors = JSON.parse(req.body.colors);
  }
  if (typeof req.body.sizes === 'string') {
    req.body.sizes = JSON.parse(req.body.sizes);
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: product,
  });
});

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  // Delete main image
  if (product.image && product.image.publicId) {
    await deleteFromCloudinary(product.image.publicId);
  }

  // Delete gallery images
  if (product.gallery && product.gallery.length > 0) {
    const deletePromises = product.gallery.map(img =>
      deleteFromCloudinary(img.publicId)
    );
    await Promise.all(deletePromises);
  }

  // Delete video
  if (product.video && product.video.publicId) {
    await deleteFromCloudinary(product.video.publicId, 'video');
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

/**
 * @desc    Delete gallery image
 * @route   DELETE /api/products/:id/gallery/:imageId
 * @access  Private/Admin
 */
exports.deleteGalleryImage = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  const imageIndex = product.gallery.findIndex(
    img => img._id.toString() === req.params.imageId
  );

  if (imageIndex === -1) {
    return next(new AppError('Image not found', 404));
  }

  // Delete from Cloudinary
  await deleteFromCloudinary(product.gallery[imageIndex].publicId);

  // Remove from gallery array
  product.gallery.splice(imageIndex, 1);
  await product.save();

  res.status(200).json({
    success: true,
    data: product,
  });
});
