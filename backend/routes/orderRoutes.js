const express = require('express');
const router = express.Router();
const { getOrders, getOrder, getOrderByNumber, createOrder, updateOrder, updateOrderStatus, deleteOrder, getOrderStats } = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { validate, validationRules } = require('../middlewares/validateMiddleware');

router.route('/').get(protect, authorize('admin', 'superadmin'), getOrders).post(validationRules.order, validate, createOrder);
router.get('/stats', protect, authorize('admin', 'superadmin'), getOrderStats);
router.get('/number/:orderNumber', getOrderByNumber);
router.route('/:id').get(protect, authorize('admin', 'superadmin'), getOrder).put(protect, authorize('admin', 'superadmin'), updateOrder).delete(protect, authorize('admin', 'superadmin'), deleteOrder);
router.put('/:id/status', protect, authorize('admin', 'superadmin'), updateOrderStatus);

module.exports = router;
