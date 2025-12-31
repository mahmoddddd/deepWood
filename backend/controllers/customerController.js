const Order = require('../models/Order');
const { asyncHandler } = require('../middlewares/errorMiddleware');

// @desc    Get all customers (aggregated from orders)
// @route   GET /api/customers
exports.getCustomers = asyncHandler(async (req, res) => {
  const customers = await Order.aggregate([
    {
      $group: {
        _id: '$customerEmail', // Group by email (or phone if email not mandatory)
        name: { $first: '$customerName' },
        phone: { $first: '$customerPhone' },
        email: { $first: '$customerEmail' },
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$total' },
        lastOrderDate: { $max: '$createdAt' },
        firstOrderDate: { $min: '$createdAt' },
      }
    },
    { $sort: { lastOrderDate: -1 } }
  ]);

  // Filter out null emails if any (or handle guests without email)
  // For guests without email, grouping by phone might be better as secondary

  res.status(200).json({
    success: true,
    count: customers.length,
    data: customers
  });
});

// @desc    Get single customer details (all orders)
// @route   GET /api/customers/:email
exports.getCustomerDetails = asyncHandler(async (req, res) => {
    const email = req.params.email;
    const orders = await Order.find({ customerEmail: email }).sort('-createdAt');

    if (!orders.length) {
        return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const customerInfo = {
        name: orders[0].customerName,
        email: orders[0].customerEmail,
        phone: orders[0].customerPhone,
        totalOrders: orders.length,
        totalSpent: orders.reduce((acc, order) => acc + order.total, 0),
        orders: orders
    };

    res.status(200).json({ success: true, data: customerInfo });
});
