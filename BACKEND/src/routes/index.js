const express = require('express');
const userRoutes = require('./userRoutes');
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const cartRoutes = require('./cartRoutes');
const orderRoutes = require('./orderRoutes');
const authRoutes = require('./authRoutes');
const uploadRoutes = require('./uploadRoutes');

const router = express.Router();

// Định nghĩa các routes
router.use('/api/auth', authRoutes);
router.use('/api/users', userRoutes);
router.use('/api/categories', categoryRoutes);
router.use('/api/products', productRoutes);
router.use('/api/cart', cartRoutes);
router.use('/api/orders', orderRoutes);
router.use('/api/admin/orders', orderRoutes);
router.use('/api/upload', uploadRoutes);

module.exports = router; 