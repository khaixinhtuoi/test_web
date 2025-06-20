const express = require('express');
const { orderController } = require('../controllers');
const { authMiddleware } = require('../middlewares');

const router = express.Router();

// Tất cả routes yêu cầu đăng nhập
router.use(authMiddleware.protect);

// Routes cho người dùng thường
router.post('/', orderController.createOrder);
router.get('/my-orders', orderController.getUserOrders);
router.get('/my-orders/:orderId', orderController.getOrderDetails);
router.put('/my-orders/:orderId/cancel', orderController.cancelOrder);

// Routes chỉ dành cho admin
router.use(authMiddleware.admin);
router.get('/dashboard/stats', orderController.getDashboardStats);
router.get('/', orderController.getAllOrders);
router.get('/:orderId', orderController.getAdminOrderDetails);
router.put('/:orderId/status', orderController.updateOrderStatus);

module.exports = router; 