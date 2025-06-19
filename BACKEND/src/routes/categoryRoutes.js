const express = require('express');
const { categoryController } = require('../controllers');
const { authMiddleware } = require('../middlewares');

const router = express.Router();

// Routes công khai
router.get('/', categoryController.getAllCategories);
router.get('/:categoryId', categoryController.getCategoryById);

// Routes chỉ dành cho admin
router.use(authMiddleware.protect, authMiddleware.admin);
router.get('/admin/all', categoryController.getAllCategoriesAdmin);
router.post('/', categoryController.createCategory);
router.put('/:categoryId', categoryController.updateCategory);
router.put('/:categoryId/status', categoryController.updateCategoryStatus);

module.exports = router; 