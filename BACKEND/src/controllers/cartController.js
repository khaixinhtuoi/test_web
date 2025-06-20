const { CartItem, Product } = require('../models');

/**
 * Lấy giỏ hàng của người dùng
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Danh sách sản phẩm trong giỏ hàng
 */
exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Lấy danh sách sản phẩm trong giỏ hàng và populate thông tin sản phẩm
    const cartItems = await CartItem.find({ user_id: userId })
      .populate({
        path: 'product_id',
        select: 'product_name price image_url stock_quantity is_active'
      })
      .sort({ added_at: -1 });
    
    // Lọc bỏ các sản phẩm không hoạt động hoặc đã hết hàng
    const validCartItems = cartItems.filter(item => 
      item.product_id && item.product_id.is_active && item.product_id.stock_quantity > 0
    );
    
    // Tính tổng tiền
    let totalAmount = 0;
    validCartItems.forEach(item => {
      totalAmount += item.product_id.price * item.quantity;
    });
    
    // Tính tổng số lượng sản phẩm
    let totalItems = 0;
    validCartItems.forEach(item => {
      totalItems += item.quantity;
    });

    res.status(200).json({
      cartItems: validCartItems,
      totalAmount,
      totalItems,
      itemCount: validCartItems.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Thêm sản phẩm vào giỏ hàng
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Thông tin sản phẩm đã thêm vào giỏ hàng
 */
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { product_id, quantity = 1 } = req.body;
    
    // Kiểm tra sản phẩm tồn tại và còn hàng
    const product = await Product.findById(product_id);
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
    
    if (!product.is_active) {
      return res.status(400).json({ message: 'Sản phẩm không còn kinh doanh' });
    }
    
    if (product.stock_quantity < 1) {
      return res.status(400).json({ message: 'Sản phẩm đã hết hàng' });
    }
    
    // Kiểm tra số lượng yêu cầu không vượt quá số lượng tồn kho
    if (quantity > product.stock_quantity) {
      return res.status(400).json({ 
        message: `Chỉ còn ${product.stock_quantity} sản phẩm trong kho` 
      });
    }
    
    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    let cartItem = await CartItem.findOne({ user_id: userId, product_id });
    
    if (cartItem) {
      // Nếu đã có, cập nhật số lượng
      const newQuantity = cartItem.quantity + quantity;
      
      // Kiểm tra số lượng mới không vượt quá tồn kho
      if (newQuantity > product.stock_quantity) {
        return res.status(400).json({ 
          message: `Chỉ còn ${product.stock_quantity} sản phẩm trong kho` 
        });
      }
      
      cartItem.quantity = newQuantity;
      cartItem.added_at = Date.now();
      await cartItem.save();
    } else {
      // Nếu chưa có, tạo mới
      cartItem = new CartItem({
        user_id: userId,
        product_id,
        quantity
      });
      await cartItem.save();
    }
    
    // Trả về thông tin sản phẩm đã thêm vào giỏ hàng
    const populatedCartItem = await CartItem.findById(cartItem._id)
      .populate({
        path: 'product_id',
        select: 'product_name price image_url stock_quantity'
      });
    
    res.status(200).json({
      message: 'Thêm vào giỏ hàng thành công',
      cartItem: populatedCartItem
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Cập nhật số lượng sản phẩm trong giỏ hàng
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Thông tin sản phẩm đã cập nhật
 */
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    
    // Tìm sản phẩm trong giỏ hàng
    const cartItem = await CartItem.findOne({
      _id: cartItemId,
      user_id: userId
    });
    
    if (!cartItem) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
    }
    
    // Kiểm tra sản phẩm còn tồn tại và còn hàng
    const product = await Product.findById(cartItem.product_id);
    if (!product) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }
    
    if (!product.is_active) {
      return res.status(400).json({ message: 'Sản phẩm không còn kinh doanh' });
    }
    
    // Kiểm tra số lượng yêu cầu không vượt quá số lượng tồn kho
    if (quantity > product.stock_quantity) {
      return res.status(400).json({ 
        message: `Chỉ còn ${product.stock_quantity} sản phẩm trong kho` 
      });
    }
    
    // Cập nhật số lượng
    cartItem.quantity = quantity;
    await cartItem.save();
    
    // Trả về thông tin sản phẩm đã cập nhật
    const updatedCartItem = await CartItem.findById(cartItem._id)
      .populate({
        path: 'product_id',
        select: 'product_name price image_url stock_quantity'
      });
    
    res.status(200).json({
      message: 'Cập nhật giỏ hàng thành công',
      cartItem: updatedCartItem
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Xóa sản phẩm khỏi giỏ hàng
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Thông báo kết quả
 */
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { cartItemId } = req.params;
    
    // Tìm và xóa sản phẩm trong giỏ hàng
    const result = await CartItem.findOneAndDelete({
      _id: cartItemId,
      user_id: userId
    });
    
    if (!result) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
    }
    
    res.status(200).json({ message: 'Đã xóa sản phẩm khỏi giỏ hàng' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Xóa toàn bộ giỏ hàng
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Thông báo kết quả
 */
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Xóa tất cả sản phẩm trong giỏ hàng của người dùng
    await CartItem.deleteMany({ user_id: userId });
    
    res.status(200).json({ message: 'Đã xóa toàn bộ giỏ hàng' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}; 