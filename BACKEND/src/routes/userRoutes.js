const express = require('express');
const { userController } = require('../controllers');
const { authMiddleware } = require('../middlewares');

const router = express.Router();

// Routes công khai
router.post('/register', userController.register);
router.post('/login', userController.login);

// Routes yêu cầu đăng nhập
router.use(authMiddleware.protect);
router.get('/profile', userController.getCurrentUser);
router.put('/profile', userController.updateUser);
router.put('/change-password', userController.changePassword);

// Routes chỉ dành cho admin
router.use(authMiddleware.admin);
router.get('/', userController.getAllUsers);
router.put('/:userId/status', userController.updateUserStatus);

module.exports = router; 