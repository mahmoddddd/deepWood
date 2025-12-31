const express = require('express');
const router = express.Router();
const { getOrders, getOrder, getOrderByNumber, createOrder, updateOrder, updateOrderStatus, deleteOrder, getOrderStats } = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const { validate, validationRules } = require('../middlewares/validateMiddleware');

router.route('/').get(getOrders).post(validationRules.order, validate, createOrder);
router.get('/stats', getOrderStats);
router.get('/number/:orderNumber', getOrderByNumber);
router.route('/:id').get(getOrder).put(updateOrder).delete(deleteOrder);
router.put('/:id/status', updateOrderStatus);

module.exports = router;
