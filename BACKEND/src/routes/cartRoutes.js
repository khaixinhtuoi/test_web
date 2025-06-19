const express = require('express');
const { cartController } = require('../controllers');
const { authMiddleware } = require('../middlewares');

const router = express.Router();

// Tất cả routes yêu cầu đăng nhập
router.use(authMiddleware.protect);

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/:cartItemId', cartController.updateCartItem);
router.delete('/:cartItemId', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

module.exports = router; 