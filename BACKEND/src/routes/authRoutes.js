const express = require('express');
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares');

const router = express.Router();

// Routes công khai
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

// Routes yêu cầu đăng nhập
router.use(authMiddleware.protect);
router.get('/sessions', authController.getSessions);
router.delete('/sessions/:sessionId', authController.revokeSession);
router.delete('/sessions', authController.revokeAllSessions);

module.exports = router; 