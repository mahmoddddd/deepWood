const Testimonial = require('../models/Testimonial');
const { asyncHandler, AppError } = require('../middlewares/errorMiddleware');
const ApiFeatures = require('../utils/apiFeatures');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

exports.getTestimonials = asyncHandler(async (req, res, next) => {
  const features = new ApiFeatures(Testimonial.find(), req.query)
    .filter().search().sort().limitFields().paginate();
  const testimonials = await features.query.populate('project', 'title_en title_ar slug');
  const total = await Testimonial.countDocuments();
  res.status(200).json({ success: true, count: testimonials.length, total, pagination: features.pagination, data: testimonials });
});

exports.getFeaturedTestimonials = asyncHandler(async (req, res, next) => {
  const testimonials = await Testimonial.find({ featured: true, status: 'active' }).sort('order').populate('project', 'title_en title_ar slug');
  res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
});

exports.getTestimonial = asyncHandler(async (req, res, next) => {
  const testimonial = await Testimonial.findById(req.params.id).populate('project', 'title_en title_ar slug');
  if (!testimonial) return next(new AppError('Testimonial not found', 404));
  res.status(200).json({ success: true, data: testimonial });
});

exports.createTestimonial = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const result = await uploadToCloudinary(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, 'deepwood/testimonials');
    req.body.avatar = { url: result.url, publicId: result.publicId };
  }
  const testimonial = await Testimonial.create(req.body);
  res.status(201).json({ success: true, data: testimonial });
});

exports.updateTestimonial = asyncHandler(async (req, res, next) => {
  let testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) return next(new AppError('Testimonial not found', 404));
  if (req.file) {
    if (testimonial.avatar?.publicId) await deleteFromCloudinary(testimonial.avatar.publicId);
    const result = await uploadToCloudinary(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, 'deepwood/testimonials');
    req.body.avatar = { url: result.url, publicId: result.publicId };
  }
  testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: testimonial });
});

exports.deleteTestimonial = asyncHandler(async (req, res, next) => {
  const testimonial = await Testimonial.findById(req.params.id);
  if (!testimonial) return next(new AppError('Testimonial not found', 404));
  if (testimonial.avatar?.publicId) await deleteFromCloudinary(testimonial.avatar.publicId);
  await testimonial.deleteOne();
  res.status(200).json({ success: true, data: {} });
});
