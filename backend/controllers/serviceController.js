const Service = require('../models/Service');
const { asyncHandler, AppError } = require('../middlewares/errorMiddleware');
const ApiFeatures = require('../utils/apiFeatures');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

/**
 * @desc    Get all services
 * @route   GET /api/services
 * @access  Public
 */
exports.getServices = asyncHandler(async (req, res, next) => {
  const features = new ApiFeatures(Service.find(), req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate();

  const services = await features.query;
  const total = await Service.countDocuments();

  res.status(200).json({
    success: true,
    count: services.length,
    total,
    pagination: features.pagination,
    data: services,
  });
});

/**
 * @desc    Get featured services
 * @route   GET /api/services/featured
 * @access  Public
 */
exports.getFeaturedServices = asyncHandler(async (req, res, next) => {
  const services = await Service.find({ featured: true, status: 'active' })
    .sort('order');

  res.status(200).json({
    success: true,
    count: services.length,
    data: services,
  });
});

/**
 * @desc    Get single service
 * @route   GET /api/services/:id
 * @access  Public
 */
exports.getService = asyncHandler(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new AppError('Service not found', 404));
  }

  res.status(200).json({
    success: true,
    data: service,
  });
});

/**
 * @desc    Get service by slug
 * @route   GET /api/services/slug/:slug
 * @access  Public
 */
exports.getServiceBySlug = asyncHandler(async (req, res, next) => {
  const service = await Service.findOne({ slug: req.params.slug });

  if (!service) {
    return next(new AppError('Service not found', 404));
  }

  res.status(200).json({
    success: true,
    data: service,
  });
});

/**
 * @desc    Create service
 * @route   POST /api/services
 * @access  Private/Admin
 */
exports.createService = asyncHandler(async (req, res, next) => {
  // Handle image upload
  if (req.files && req.files.image) {
    const result = await uploadToCloudinary(
      `data:${req.files.image[0].mimetype};base64,${req.files.image[0].buffer.toString('base64')}`,
      'deepwood/services'
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
        'deepwood/services/gallery'
      ).then(result => ({
        url: result.url,
        publicId: result.publicId,
        order: index,
      }))
    );
    req.body.gallery = await Promise.all(galleryPromises);
  }

  // Parse JSON fields
  if (typeof req.body.features_en === 'string') {
    req.body.features_en = JSON.parse(req.body.features_en);
  }
  if (typeof req.body.features_ar === 'string') {
    req.body.features_ar = JSON.parse(req.body.features_ar);
  }
  if (typeof req.body.process === 'string') {
    req.body.process = JSON.parse(req.body.process);
  }
  if (typeof req.body.seo === 'string') {
    req.body.seo = JSON.parse(req.body.seo);
  }

  const service = await Service.create(req.body);

  res.status(201).json({
    success: true,
    data: service,
  });
});

/**
 * @desc    Update service
 * @route   PUT /api/services/:id
 * @access  Private/Admin
 */
exports.updateService = asyncHandler(async (req, res, next) => {
  let service = await Service.findById(req.params.id);

  if (!service) {
    return next(new AppError('Service not found', 404));
  }

  // Handle image upload
  if (req.files && req.files.image) {
    if (service.image && service.image.publicId) {
      await deleteFromCloudinary(service.image.publicId);
    }

    const result = await uploadToCloudinary(
      `data:${req.files.image[0].mimetype};base64,${req.files.image[0].buffer.toString('base64')}`,
      'deepwood/services'
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
        'deepwood/services/gallery'
      ).then(result => ({
        url: result.url,
        publicId: result.publicId,
        order: (service.gallery?.length || 0) + index,
      }))
    );
    const newImages = await Promise.all(galleryPromises);
    req.body.gallery = [...(service.gallery || []), ...newImages];
  }

  // Parse JSON fields
  if (typeof req.body.features_en === 'string') {
    req.body.features_en = JSON.parse(req.body.features_en);
  }
  if (typeof req.body.features_ar === 'string') {
    req.body.features_ar = JSON.parse(req.body.features_ar);
  }
  if (typeof req.body.process === 'string') {
    req.body.process = JSON.parse(req.body.process);
  }
  if (typeof req.body.seo === 'string') {
    req.body.seo = JSON.parse(req.body.seo);
  }

  service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: service,
  });
});

/**
 * @desc    Delete service
 * @route   DELETE /api/services/:id
 * @access  Private/Admin
 */
exports.deleteService = asyncHandler(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new AppError('Service not found', 404));
  }

  // Delete images
  if (service.image && service.image.publicId) {
    await deleteFromCloudinary(service.image.publicId);
  }

  if (service.gallery && service.gallery.length > 0) {
    const deletePromises = service.gallery.map(img =>
      deleteFromCloudinary(img.publicId)
    );
    await Promise.all(deletePromises);
  }

  await service.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
