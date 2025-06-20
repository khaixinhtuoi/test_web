const { Product, Category } = require('../models');

/**
 * Lấy danh sách tất cả sản phẩm (có phân trang và lọc)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Danh sách sản phẩm
 */
exports.getAllProducts = async (req, res) => {
  try {
    console.log('=== GET ALL PRODUCTS REQUEST ===');
    console.log('Query params:', req.query);
    console.log('Headers:', req.headers);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const filter = { is_active: true };
    
    // Lọc theo danh mục nếu có
    if (req.query.category) {
      filter.category_id = req.query.category;
    }
    
    // Lọc theo giá nếu có
    if (req.query.min_price) {
      filter.price = { $gte: parseFloat(req.query.min_price) };
    }
    
    if (req.query.max_price) {
      filter.price = { ...filter.price, $lte: parseFloat(req.query.max_price) };
    }
    
    // Tìm kiếm theo tên sản phẩm nếu có
    if (req.query.search) {
      filter.product_name = { $regex: req.query.search, $options: 'i' };
    }

    // Lọc theo thương hiệu nếu có
    if (req.query.brands) {
      const brands = Array.isArray(req.query.brands) ? req.query.brands : [req.query.brands];
      filter.brand = { $in: brands };
    }
    
    // Sắp xếp
    let sort = {};
    if (req.query.sort) {
      if (req.query.sort === 'price_asc') {
        sort = { price: 1 };
      } else if (req.query.sort === 'price_desc') {
        sort = { price: -1 };
      } else if (req.query.sort === 'newest') {
        sort = { created_at: -1 };
      }
    } else {
      sort = { created_at: -1 }; // Mặc định sắp xếp theo thời gian tạo mới nhất
    }
    
    // Đếm tổng số sản phẩm thỏa mãn điều kiện
    const total = await Product.countDocuments(filter);
    
    // Lấy danh sách sản phẩm
    const products = await Product.find(filter)
      .populate('category_id', 'category_name')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    res.status(200).json({
      products,
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
 * Lấy thông tin một sản phẩm theo ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Thông tin sản phẩm
 */
exports.getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const product = await Product.findById(productId)
      .populate('category_id', 'category_name');
    
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Tạo sản phẩm mới
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Thông tin sản phẩm đã tạo
 */
exports.createProduct = async (req, res) => {
  try {
    const {
      product_name,
      category_id,
      brand,
      price,
      stock_quantity,
      description,
      image_url,
      specifications
    } = req.body;
    
    // Kiểm tra danh mục tồn tại
    const category = await Category.findById(category_id);
    if (!category) {
      return res.status(404).json({ message: 'Danh mục không tồn tại' });
    }
    
    // Tạo sản phẩm mới
    const product = new Product({
      product_name,
      category_id,
      brand,
      price,
      stock_quantity,
      description,
      image_url,
      specifications: specifications || {}
    });
    
    await product.save();
    
    res.status(201).json({
      message: 'Tạo sản phẩm thành công',
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Cập nhật thông tin sản phẩm
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Thông tin sản phẩm đã cập nhật
 */
exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const {
      product_name,
      category_id,
      brand,
      price,
      stock_quantity,
      description,
      image_url,
      specifications
    } = req.body;
    
    // Kiểm tra danh mục tồn tại nếu có cập nhật danh mục
    if (category_id) {
      const category = await Category.findById(category_id);
      if (!category) {
        return res.status(404).json({ message: 'Danh mục không tồn tại' });
      }
    }
    
    // Tìm và cập nhật sản phẩm
    const product = await Product.findByIdAndUpdate(
      productId,
      {
        product_name,
        category_id,
        brand,
        price,
        stock_quantity,
        description,
        image_url,
        specifications
      },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    
    res.status(200).json({
      message: 'Cập nhật sản phẩm thành công',
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Cập nhật trạng thái sản phẩm
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Thông tin sản phẩm đã cập nhật
 */
exports.updateProductStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    const { is_active } = req.body;
    
    // Tìm và cập nhật trạng thái sản phẩm
    const product = await Product.findByIdAndUpdate(
      productId,
      { is_active },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    
    res.status(200).json({
      message: 'Cập nhật trạng thái sản phẩm thành công',
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Cập nhật số lượng tồn kho sản phẩm
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Thông tin sản phẩm đã cập nhật
 */
exports.updateProductStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { stock_quantity } = req.body;
    
    // Tìm và cập nhật số lượng tồn kho
    const product = await Product.findByIdAndUpdate(
      productId,
      { stock_quantity },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    
    res.status(200).json({
      message: 'Cập nhật số lượng tồn kho thành công',
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Xóa sản phẩm
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Thông báo kết quả
 */
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Tìm và xóa sản phẩm
    const product = await Product.findByIdAndDelete(productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
    
    res.status(200).json({
      message: 'Xóa sản phẩm thành công'
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}; 