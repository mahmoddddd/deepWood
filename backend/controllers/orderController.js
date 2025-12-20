const Order = require('../models/Order');
const { asyncHandler, AppError } = require('../middlewares/errorMiddleware');
const ApiFeatures = require('../utils/apiFeatures');

exports.getOrders = asyncHandler(async (req, res, next) => {
  const features = new ApiFeatures(Order.find(), req.query).filter().sort().limitFields().paginate();
  const orders = await features.query.populate('items.product', 'title_en title_ar slug image');
  const total = await Order.countDocuments();
  res.status(200).json({ success: true, count: orders.length, total, pagination: features.pagination, data: orders });
});

exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('items.product', 'title_en title_ar slug image');
  if (!order) return next(new AppError('Order not found', 404));
  res.status(200).json({ success: true, data: order });
});

exports.getOrderByNumber = asyncHandler(async (req, res, next) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber }).populate('items.product');
  if (!order) return next(new AppError('Order not found', 404));
  res.status(200).json({ success: true, data: order });
});

exports.createOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.create(req.body);
  res.status(201).json({ success: true, data: order });
});

exports.updateOrder = asyncHandler(async (req, res, next) => {
  let order = await Order.findById(req.params.id);
  if (!order) return next(new AppError('Order not found', 404));
  order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: order });
});

exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError('Order not found', 404));
  order.status = req.body.status;
  if (req.body.status === 'shipped') order.shippedAt = new Date();
  if (req.body.status === 'delivered') order.deliveredAt = new Date();
  await order.save();
  res.status(200).json({ success: true, data: order });
});

exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError('Order not found', 404));
  await order.deleteOne();
  res.status(200).json({ success: true, data: {} });
});

exports.getOrderStats = asyncHandler(async (req, res, next) => {
  const stats = await Order.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 }, totalAmount: { $sum: '$total' } } }
  ]);
  res.status(200).json({ success: true, data: stats });
});
