const { Order, OrderItem, CartItem, Product } = require('../models');

/**
 * Tạo đơn hàng mới từ giỏ hàng
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Thông tin đơn hàng đã tạo
 */
exports.createOrder = async (req, res) => {
  try {
    console.log('=== CREATE ORDER REQUEST ===');
    console.log('User:', req.user);
    console.log('Body:', req.body);
    console.log('=== STARTING ORDER CREATION PROCESS ===');

    const userId = req.user._id;
    const {
      shipping_recipient_name,
      shipping_address,
      payment_method,
      notes
    } = req.body;
    
    // Lấy danh sách sản phẩm trong giỏ hàng
    console.log('Tìm cart items cho user:', userId);
    const cartItems = await CartItem.find({ user_id: userId })
      .populate('product_id');

    console.log('Cart items found:', cartItems.length);
    console.log('Cart items:', cartItems);

    if (cartItems.length === 0) {
      console.log('Giỏ hàng trống!');
      return res.status(400).json({ message: 'Giỏ hàng trống' });
    }
    
    // Lọc bỏ các sản phẩm không hoạt động hoặc đã hết hàng
    const validCartItems = cartItems.filter(item => 
      item.product_id && 
      item.product_id.is_active && 
      item.product_id.stock_quantity >= item.quantity
    );
    
    if (validCartItems.length === 0) {
      return res.status(400).json({ message: 'Không có sản phẩm hợp lệ trong giỏ hàng' });
    }
    
    // Tính tổng tiền
    let subtotal = 0;
    validCartItems.forEach(item => {
      subtotal += item.product_id.price * item.quantity;
    });
    
    // Tính phí vận chuyển (ví dụ: 30,000 VNĐ cố định)
    const shipping_fee = 30000;
    
    // Tạo order_number
    const count = await Order.countDocuments();
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const order_number = `ORD-${year}${month}${day}-${(count + 1).toString().padStart(4, '0')}`;

    console.log('Generated order_number:', order_number);

    // Tạo đơn hàng mới
    console.log('Creating order with data:', {
      user_id: userId,
      order_number,
      subtotal,
      shipping_fee,
      total_amount: subtotal + shipping_fee,
      shipping_recipient_name,
      shipping_address,
      payment_method,
      notes
    });

    const order = new Order({
      user_id: userId,
      order_number,
      subtotal,
      shipping_fee,
      total_amount: subtotal + shipping_fee,
      shipping_recipient_name,
      shipping_address,
      payment_method,
      notes
    });

    console.log('Saving order...');
    await order.save();
    console.log('Order saved successfully:', order._id);
    
    // Tạo chi tiết đơn hàng
    const orderItems = [];
    for (const item of validCartItems) {
      const orderItem = new OrderItem({
        order_id: order._id,
        product_id: item.product_id._id,
        product_name: item.product_id.product_name,
        unit_price: item.product_id.price,
        quantity: item.quantity,
        total_price: item.product_id.price * item.quantity
      });
      
      await orderItem.save();
      orderItems.push(orderItem);
      
      // Cập nhật số lượng tồn kho
      await Product.findByIdAndUpdate(
        item.product_id._id,
        { $inc: { stock_quantity: -item.quantity } }
      );
    }
    
    // Xóa giỏ hàng sau khi tạo đơn hàng
    await CartItem.deleteMany({ user_id: userId });
    
    // Trả về thông tin đơn hàng đã tạo
    res.status(201).json({
      message: 'Đặt hàng thành công',
      order: {
        ...order.toObject(),
        items: orderItems
      }
    });
  } catch (error) {
    console.error('=== CREATE ORDER ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error details:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Lấy danh sách đơn hàng của người dùng
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Danh sách đơn hàng
 */
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Đếm tổng số đơn hàng
    const total = await Order.countDocuments({ user_id: userId });
    
    // Lấy danh sách đơn hàng
    const orders = await Order.find({ user_id: userId })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);
    
    res.status(200).json({
      orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Lấy thông tin chi tiết đơn hàng
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Thông tin đơn hàng và chi tiết đơn hàng
 */
exports.getOrderDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;
    
    // Tìm đơn hàng
    const order = await Order.findOne({ _id: orderId, user_id: userId });
    
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
    
    // Lấy chi tiết đơn hàng
    const orderItems = await OrderItem.find({ order_id: orderId })
      .populate('product_id', 'product_name brand image_url price description');
    
    res.status(200).json({
      order,
      orderItems
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Hủy đơn hàng (chỉ cho đơn hàng đang ở trạng thái pending)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Thông tin đơn hàng đã hủy
 */
exports.cancelOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;
    
    // Tìm đơn hàng
    const order = await Order.findOne({ _id: orderId, user_id: userId });
    
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }
    
    // Kiểm tra trạng thái đơn hàng
    if (order.order_status !== 'pending') {
      return res.status(400).json({ message: 'Chỉ có thể hủy đơn hàng đang chờ xử lý' });
    }
    
    // Cập nhật trạng thái đơn hàng
    order.order_status = 'cancelled';
    await order.save();
    
    // Hoàn trả số lượng sản phẩm vào kho
    const orderItems = await OrderItem.find({ order_id: orderId });
    
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product_id,
        { $inc: { stock_quantity: item.quantity } }
      );
    }
    
    res.status(200).json({
      message: 'Hủy đơn hàng thành công',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Lấy danh sách tất cả đơn hàng (dành cho admin)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Danh sách đơn hàng
 */
exports.getAllOrders = async (req, res) => {
  try {
    console.log('=== GET ALL ORDERS REQUEST ===');
    console.log('User:', req.user);
    console.log('Query:', req.query);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Lọc theo trạng thái nếu có
    const filter = {};
    if (req.query.status) {
      filter.order_status = req.query.status;
    }
    
    // Đếm tổng số đơn hàng
    const total = await Order.countDocuments(filter);
    
    // Lấy danh sách đơn hàng
    const orders = await Order.find(filter)
      .populate('user_id', 'email first_name last_name')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);
    
    res.status(200).json({
      orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Lấy thông tin chi tiết đơn hàng (dành cho admin)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Thông tin đơn hàng và chi tiết đơn hàng
 */
exports.getAdminOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Tìm đơn hàng với thông tin user
    const order = await Order.findById(orderId)
      .populate('user_id', 'email first_name last_name');

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    // Lấy chi tiết đơn hàng
    const orderItems = await OrderItem.find({ order_id: orderId })
      .populate('product_id', 'product_name brand image_url price description');

    res.status(200).json({
      order,
      orderItems
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Cập nhật trạng thái đơn hàng (dành cho admin)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Thông tin đơn hàng đã cập nhật
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { order_status, payment_status } = req.body;

    // Tìm đơn hàng
    const order = await Order.findById(orderId)
      .populate('user_id', 'email first_name last_name');

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    // Cập nhật trạng thái
    if (order_status) {
      order.order_status = order_status;
    }

    if (payment_status) {
      order.payment_status = payment_status;
    }

    await order.save();

    res.status(200).json({
      message: 'Cập nhật trạng thái đơn hàng thành công',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Lấy thống kê dashboard (dành cho admin)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Thống kê dashboard
 */
exports.getDashboardStats = async (req, res) => {
  try {
    console.log('=== GET DASHBOARD STATS REQUEST ===');
    console.log('User:', req.user);

    const { User } = require('../models');

    // Lấy thống kê tổng quan
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();

    // Tính tổng doanh thu (chỉ từ đơn hàng đã thanh toán)
    // Điều kiện: order_status != 'cancelled' AND payment_status = 'paid'
    const revenueResult = await Order.aggregate([
      {
        $match: {
          order_status: { $ne: 'cancelled' },
          payment_status: 'paid' // Chỉ tính đơn hàng đã thanh toán
        }
      },
      { $group: { _id: null, totalRevenue: { $sum: '$total_amount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Thống kê đơn hàng theo trạng thái
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$order_status', count: { $sum: 1 } } }
    ]);

    // Doanh thu theo tháng (6 tháng gần nhất)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          created_at: { $gte: sixMonthsAgo },
          order_status: { $ne: 'cancelled' },
          payment_status: 'paid'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$created_at' },
            month: { $month: '$created_at' }
          },
          revenue: { $sum: '$total_amount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Đơn hàng gần đây (5 đơn hàng mới nhất)
    const recentOrders = await Order.find()
      .populate('user_id', 'email first_name last_name')
      .sort({ created_at: -1 })
      .limit(5);

    // Tính phần trăm thay đổi so với tháng trước
    const currentMonth = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const currentMonthRevenue = await Order.aggregate([
      {
        $match: {
          created_at: {
            $gte: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
            $lt: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
          },
          order_status: { $ne: 'cancelled' },
          payment_status: 'paid'
        }
      },
      { $group: { _id: null, revenue: { $sum: '$total_amount' }, orders: { $sum: 1 } } }
    ]);

    const lastMonthRevenue = await Order.aggregate([
      {
        $match: {
          created_at: {
            $gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
            $lt: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 1)
          },
          order_status: { $ne: 'cancelled' },
          payment_status: 'paid'
        }
      },
      { $group: { _id: null, revenue: { $sum: '$total_amount' }, orders: { $sum: 1 } } }
    ]);

    const currentRevenue = currentMonthRevenue.length > 0 ? currentMonthRevenue[0].revenue : 0;
    const lastRevenue = lastMonthRevenue.length > 0 ? lastMonthRevenue[0].revenue : 0;
    const currentOrdersCount = currentMonthRevenue.length > 0 ? currentMonthRevenue[0].orders : 0;
    const lastOrdersCount = lastMonthRevenue.length > 0 ? lastMonthRevenue[0].orders : 0;

    const revenueChange = lastRevenue > 0 ? ((currentRevenue - lastRevenue) / lastRevenue * 100).toFixed(1) : 0;
    const ordersChange = lastOrdersCount > 0 ? ((currentOrdersCount - lastOrdersCount) / lastOrdersCount * 100).toFixed(1) : 0;

    res.status(200).json({
      totalStats: {
        totalRevenue,
        totalOrders,
        totalUsers,
        totalProducts,
        revenueChange: `${revenueChange >= 0 ? '+' : ''}${revenueChange}%`,
        ordersChange: `${ordersChange >= 0 ? '+' : ''}${ordersChange}%`
      },
      ordersByStatus,
      monthlyRevenue,
      recentOrders
    });
  } catch (error) {
    console.error('=== DASHBOARD STATS ERROR ===');
    console.error('Error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};