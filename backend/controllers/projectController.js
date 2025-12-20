const Project = require('../models/Project');
const { asyncHandler, AppError } = require('../middlewares/errorMiddleware');
const ApiFeatures = require('../utils/apiFeatures');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

/**
 * @desc    Get all projects
 * @route   GET /api/projects
 * @access  Public
 */
exports.getProjects = asyncHandler(async (req, res, next) => {
  const features = new ApiFeatures(Project.find(), req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate();

  const projects = await features.query
    .populate('category', 'name_en name_ar slug')
    .populate('client', 'name_en name_ar logo');
  const total = await Project.countDocuments(req.query.status ? { status: req.query.status } : {});

  res.status(200).json({
    success: true,
    count: projects.length,
    total,
    pagination: features.pagination,
    data: projects,
  });
});

/**
 * @desc    Get featured projects
 * @route   GET /api/projects/featured
 * @access  Public
 */
exports.getFeaturedProjects = asyncHandler(async (req, res, next) => {
  const limit = parseInt(req.query.limit, 10) || 6;

  const projects = await Project.find({ featured: true, status: 'active' })
    .sort('-createdAt')
    .limit(limit)
    .populate('category', 'name_en name_ar slug')
    .populate('client', 'name_en name_ar logo');

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects,
  });
});

/**
 * @desc    Get corporate projects
 * @route   GET /api/projects/corporate
 * @access  Public
 */
exports.getCorporateProjects = asyncHandler(async (req, res, next) => {
  const projects = await Project.find({ isCorporate: true, status: 'active' })
    .sort('order -createdAt')
    .populate('category', 'name_en name_ar slug')
    .populate('client', 'name_en name_ar logo');

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects,
  });
});

/**
 * @desc    Get single project
 * @route   GET /api/projects/:id
 * @access  Public
 */
exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id)
    .populate('category', 'name_en name_ar slug')
    .populate('client', 'name_en name_ar logo');

  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  // Increment views
  project.views += 1;
  await project.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: project,
  });
});

/**
 * @desc    Get project by slug
 * @route   GET /api/projects/slug/:slug
 * @access  Public
 */
exports.getProjectBySlug = asyncHandler(async (req, res, next) => {
  const project = await Project.findOne({ slug: req.params.slug })
    .populate('category', 'name_en name_ar slug')
    .populate('client', 'name_en name_ar logo');

  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  // Increment views
  project.views += 1;
  await project.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: project,
  });
});

/**
 * @desc    Create project
 * @route   POST /api/projects
 * @access  Private/Admin
 */
exports.createProject = asyncHandler(async (req, res, next) => {
  // Handle main image upload
  if (req.files && req.files.image) {
    const result = await uploadToCloudinary(
      `data:${req.files.image[0].mimetype};base64,${req.files.image[0].buffer.toString('base64')}`,
      'deepwood/projects'
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
        'deepwood/projects/gallery'
      ).then(result => ({
        url: result.url,
        publicId: result.publicId,
        order: index,
      }))
    );
    req.body.gallery = await Promise.all(galleryPromises);
  }

  // Handle before image
  if (req.files && req.files.beforeImage) {
    const result = await uploadToCloudinary(
      `data:${req.files.beforeImage[0].mimetype};base64,${req.files.beforeImage[0].buffer.toString('base64')}`,
      'deepwood/projects/before-after'
    );
    req.body.beforeImage = {
      url: result.url,
      publicId: result.publicId,
    };
  }

  // Handle after image
  if (req.files && req.files.afterImage) {
    const result = await uploadToCloudinary(
      `data:${req.files.afterImage[0].mimetype};base64,${req.files.afterImage[0].buffer.toString('base64')}`,
      'deepwood/projects/before-after'
    );
    req.body.afterImage = {
      url: result.url,
      publicId: result.publicId,
    };
  }

  // Handle video upload
  if (req.files && req.files.video) {
    const result = await uploadToCloudinary(
      `data:${req.files.video[0].mimetype};base64,${req.files.video[0].buffer.toString('base64')}`,
      'deepwood/projects/videos',
      'video'
    );
    req.body.video = {
      url: result.url,
      publicId: result.publicId,
    };
  }

  // Parse JSON fields
  if (typeof req.body.scope_en === 'string') {
    req.body.scope_en = JSON.parse(req.body.scope_en);
  }
  if (typeof req.body.scope_ar === 'string') {
    req.body.scope_ar = JSON.parse(req.body.scope_ar);
  }
  if (typeof req.body.seo === 'string') {
    req.body.seo = JSON.parse(req.body.seo);
  }

  const project = await Project.create(req.body);

  res.status(201).json({
    success: true,
    data: project,
  });
});

/**
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Private/Admin
 */
exports.updateProject = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  // Handle main image upload
  if (req.files && req.files.image) {
    if (project.image && project.image.publicId) {
      await deleteFromCloudinary(project.image.publicId);
    }

    const result = await uploadToCloudinary(
      `data:${req.files.image[0].mimetype};base64,${req.files.image[0].buffer.toString('base64')}`,
      'deepwood/projects'
    );
    req.body.image = {
      url: result.url,
      publicId: result.publicId,
    };
  }

  // Handle gallery images (append)
  if (req.files && req.files.images) {
    const galleryPromises = req.files.images.map((file, index) =>
      uploadToCloudinary(
        `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
        'deepwood/projects/gallery'
      ).then(result => ({
        url: result.url,
        publicId: result.publicId,
        order: (project.gallery?.length || 0) + index,
      }))
    );
    const newImages = await Promise.all(galleryPromises);
    req.body.gallery = [...(project.gallery || []), ...newImages];
  }

  // Handle before image
  if (req.files && req.files.beforeImage) {
    if (project.beforeImage && project.beforeImage.publicId) {
      await deleteFromCloudinary(project.beforeImage.publicId);
    }

    const result = await uploadToCloudinary(
      `data:${req.files.beforeImage[0].mimetype};base64,${req.files.beforeImage[0].buffer.toString('base64')}`,
      'deepwood/projects/before-after'
    );
    req.body.beforeImage = {
      url: result.url,
      publicId: result.publicId,
    };
  }

  // Handle after image
  if (req.files && req.files.afterImage) {
    if (project.afterImage && project.afterImage.publicId) {
      await deleteFromCloudinary(project.afterImage.publicId);
    }

    const result = await uploadToCloudinary(
      `data:${req.files.afterImage[0].mimetype};base64,${req.files.afterImage[0].buffer.toString('base64')}`,
      'deepwood/projects/before-after'
    );
    req.body.afterImage = {
      url: result.url,
      publicId: result.publicId,
    };
  }

  // Handle video upload
  if (req.files && req.files.video) {
    if (project.video && project.video.publicId) {
      await deleteFromCloudinary(project.video.publicId, 'video');
    }

    const result = await uploadToCloudinary(
      `data:${req.files.video[0].mimetype};base64,${req.files.video[0].buffer.toString('base64')}`,
      'deepwood/projects/videos',
      'video'
    );
    req.body.video = {
      url: result.url,
      publicId: result.publicId,
    };
  }

  // Parse JSON fields
  if (typeof req.body.scope_en === 'string') {
    req.body.scope_en = JSON.parse(req.body.scope_en);
  }
  if (typeof req.body.scope_ar === 'string') {
    req.body.scope_ar = JSON.parse(req.body.scope_ar);
  }
  if (typeof req.body.seo === 'string') {
    req.body.seo = JSON.parse(req.body.seo);
  }

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: project,
  });
});

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 * @access  Private/Admin
 */
exports.deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(new AppError('Project not found', 404));
  }

  // Delete all images and videos
  const deletePromises = [];

  if (project.image && project.image.publicId) {
    deletePromises.push(deleteFromCloudinary(project.image.publicId));
  }

  if (project.gallery && project.gallery.length > 0) {
    project.gallery.forEach(img => {
      if (img.publicId) deletePromises.push(deleteFromCloudinary(img.publicId));
    });
  }

  if (project.beforeImage && project.beforeImage.publicId) {
    deletePromises.push(deleteFromCloudinary(project.beforeImage.publicId));
  }

  if (project.afterImage && project.afterImage.publicId) {
    deletePromises.push(deleteFromCloudinary(project.afterImage.publicId));
  }

  if (project.video && project.video.publicId) {
    deletePromises.push(deleteFromCloudinary(project.video.publicId, 'video'));
  }

  await Promise.all(deletePromises);
  await project.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
