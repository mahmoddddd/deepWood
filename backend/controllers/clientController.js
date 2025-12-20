const Client = require('../models/Client');
const { asyncHandler, AppError } = require('../middlewares/errorMiddleware');
const ApiFeatures = require('../utils/apiFeatures');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

/**
 * @desc    Get all clients
 * @route   GET /api/clients
 * @access  Public
 */
exports.getClients = asyncHandler(async (req, res, next) => {
  const features = new ApiFeatures(Client.find(), req.query)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate();

  const clients = await features.query.populate('projectCount');
  const total = await Client.countDocuments();

  res.status(200).json({
    success: true,
    count: clients.length,
    total,
    pagination: features.pagination,
    data: clients,
  });
});

/**
 * @desc    Get featured/corporate clients
 * @route   GET /api/clients/featured
 * @access  Public
 */
exports.getFeaturedClients = asyncHandler(async (req, res, next) => {
  const clients = await Client.find({
    $or: [{ featured: true }, { isCorporate: true }],
    status: 'active'
  }).sort('order');

  res.status(200).json({
    success: true,
    count: clients.length,
    data: clients,
  });
});

/**
 * @desc    Get single client
 * @route   GET /api/clients/:id
 * @access  Public
 */
exports.getClient = asyncHandler(async (req, res, next) => {
  const client = await Client.findById(req.params.id).populate('projectCount');

  if (!client) {
    return next(new AppError('Client not found', 404));
  }

  res.status(200).json({
    success: true,
    data: client,
  });
});

/**
 * @desc    Create client
 * @route   POST /api/clients
 * @access  Private/Admin
 */
exports.createClient = asyncHandler(async (req, res, next) => {
  // Handle logo upload
  if (req.file) {
    const result = await uploadToCloudinary(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      'deepwood/clients'
    );
    req.body.logo = {
      url: result.url,
      publicId: result.publicId,
    };
  }

  const client = await Client.create(req.body);

  res.status(201).json({
    success: true,
    data: client,
  });
});

/**
 * @desc    Update client
 * @route   PUT /api/clients/:id
 * @access  Private/Admin
 */
exports.updateClient = asyncHandler(async (req, res, next) => {
  let client = await Client.findById(req.params.id);

  if (!client) {
    return next(new AppError('Client not found', 404));
  }

  // Handle logo upload
  if (req.file) {
    if (client.logo && client.logo.publicId) {
      await deleteFromCloudinary(client.logo.publicId);
    }

    const result = await uploadToCloudinary(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      'deepwood/clients'
    );
    req.body.logo = {
      url: result.url,
      publicId: result.publicId,
    };
  }

  client = await Client.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: client,
  });
});

/**
 * @desc    Delete client
 * @route   DELETE /api/clients/:id
 * @access  Private/Admin
 */
exports.deleteClient = asyncHandler(async (req, res, next) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    return next(new AppError('Client not found', 404));
  }

  // Delete logo from Cloudinary
  if (client.logo && client.logo.publicId) {
    await deleteFromCloudinary(client.logo.publicId);
  }

  await client.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
