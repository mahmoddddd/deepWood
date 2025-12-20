const ContactRequest = require('../models/ContactRequest');
const { asyncHandler, AppError } = require('../middlewares/errorMiddleware');
const ApiFeatures = require('../utils/apiFeatures');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

exports.getContactRequests = asyncHandler(async (req, res, next) => {
  const features = new ApiFeatures(ContactRequest.find(), req.query).filter().sort().limitFields().paginate();
  const requests = await features.query.populate('product project service assignedTo', 'title_en title_ar name');
  const total = await ContactRequest.countDocuments();
  res.status(200).json({ success: true, count: requests.length, total, pagination: features.pagination, data: requests });
});

exports.getContactRequest = asyncHandler(async (req, res, next) => {
  const request = await ContactRequest.findById(req.params.id).populate('product project service assignedTo response.respondedBy');
  if (!request) return next(new AppError('Contact request not found', 404));
  res.status(200).json({ success: true, data: request });
});

exports.createContactRequest = asyncHandler(async (req, res, next) => {
  req.body.ipAddress = req.ip;
  req.body.userAgent = req.headers['user-agent'];
  if (req.files?.attachment) {
    const result = await uploadToCloudinary(`data:${req.files.attachment[0].mimetype};base64,${req.files.attachment[0].buffer.toString('base64')}`, 'deepwood/attachments');
    req.body.attachments = [{ url: result.url, publicId: result.publicId, filename: req.files.attachment[0].originalname, type: req.files.attachment[0].mimetype }];
  }
  const request = await ContactRequest.create(req.body);
  res.status(201).json({ success: true, data: request });
});

exports.updateContactRequest = asyncHandler(async (req, res, next) => {
  let request = await ContactRequest.findById(req.params.id);
  if (!request) return next(new AppError('Contact request not found', 404));
  request = await ContactRequest.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: request });
});

exports.respondToRequest = asyncHandler(async (req, res, next) => {
  const request = await ContactRequest.findById(req.params.id);
  if (!request) return next(new AppError('Contact request not found', 404));
  request.response = { content: req.body.content, respondedBy: req.user.id, respondedAt: new Date() };
  request.status = 'replied';
  await request.save();
  res.status(200).json({ success: true, data: request });
});

exports.deleteContactRequest = asyncHandler(async (req, res, next) => {
  const request = await ContactRequest.findById(req.params.id);
  if (!request) return next(new AppError('Contact request not found', 404));
  if (request.attachments?.length) {
    await Promise.all(request.attachments.map(att => deleteFromCloudinary(att.publicId)));
  }
  await request.deleteOne();
  res.status(200).json({ success: true, data: {} });
});

exports.getContactStats = asyncHandler(async (req, res, next) => {
  const stats = await ContactRequest.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
  res.status(200).json({ success: true, data: stats });
});
