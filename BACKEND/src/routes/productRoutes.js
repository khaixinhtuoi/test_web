const express = require('express');
const { productController } = require('../controllers');
const { authMiddleware } = require('../middlewares');

const router = express.Router();

// Routes công khai
router.get('/', productController.getAllProducts);
router.get('/:productId', productController.getProductById);

// Routes chỉ dành cho admin
router.use(authMiddleware.protect, authMiddleware.admin);
router.post('/', productController.createProduct);
router.put('/:productId', productController.updateProduct);
router.put('/:productId/status', productController.updateProductStatus);
router.put('/:productId/stock', productController.updateProductStock);

module.exports = router; 