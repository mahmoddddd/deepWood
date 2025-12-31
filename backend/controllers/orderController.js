const Order = require('../models/Order');
const { asyncHandler, AppError } = require('../middlewares/errorMiddleware');
const ApiFeatures = require('../utils/apiFeatures');
const sendEmail = require('../utils/sendEmail');

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

  // Send email to customer
  if (order.customerEmail) {
    const message = `
      <h1>Thanks for your order, ${order.customerName}!</h1>
      <p>We received your order <strong>#${order.orderNumber || order._id}</strong>.</p>
      <p>Total Amount: <strong>${order.total} EGP</strong></p>
      <p>We will contact you shortly to confirm the details.</p>
      <a href="${process.env.FRONTEND_URL}/orders/${order.orderNumber || order._id}">View Order</a>
    `;

    try {
      await sendEmail({
        email: order.customerEmail,
        subject: 'Order Confirmation - Deep Wood',
        message,
      });
    } catch (err) {
      console.error('Email sending failed:', err);
      // Don't fail the order creation if email fails
    }
  }

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

  const oldStatus = order.status;
  order.status = req.body.status;

  if (req.body.status === 'shipped') order.shippedAt = new Date();
  if (req.body.status === 'delivered') order.deliveredAt = new Date();

  await order.save();

  // Send email update to customer
  if (order.customerEmail && oldStatus !== req.body.status) {
    const message = `
      <h1>Order Update</h1>
      <p>Hello ${order.customerName},</p>
      <p>Your order <strong>#${order.orderNumber || order._id}</strong> status has been updated to: <strong>${req.body.status.toUpperCase()}</strong>.</p>
      <p>Thank you for shopping with Deep Wood!</p>
    `;

    try {
      await sendEmail({
        email: order.customerEmail,
        subject: `Order Update: ${req.body.status.toUpperCase()} - Deep Wood`,
        message,
      });
    } catch (err) {
       console.error('Email sending failed:', err);
    }
  }

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
