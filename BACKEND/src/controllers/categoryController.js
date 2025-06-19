const { Category } = require('../models');

/**
 * Lấy danh sách tất cả danh mục
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Danh sách danh mục
 */
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ is_active: true });
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Lấy danh sách tất cả danh mục (bao gồm cả không hoạt động)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Danh sách danh mục
 */
exports.getAllCategoriesAdmin = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Lấy thông tin một danh mục theo ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Thông tin danh mục
 */
exports.getCategoryById = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    
    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }
    
    res.status(200).json({ category });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Tạo danh mục mới
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Thông tin danh mục đã tạo
 */
exports.createCategory = async (req, res) => {
  try {
    const { category_name } = req.body;
    
    // Kiểm tra tên danh mục đã tồn tại chưa
    const existingCategory = await Category.findOne({ category_name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Tên danh mục đã tồn tại' });
    }
    
    // Tạo danh mục mới
    const category = new Category({ category_name });
    await category.save();
    
    res.status(201).json({
      message: 'Tạo danh mục thành công',
      category
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Cập nhật thông tin danh mục
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Thông tin danh mục đã cập nhật
 */
exports.updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { category_name } = req.body;
    
    // Kiểm tra tên danh mục đã tồn tại chưa (trừ danh mục hiện tại)
    const existingCategory = await Category.findOne({ 
      category_name, 
      _id: { $ne: categoryId } 
    });
    
    if (existingCategory) {
      return res.status(400).json({ message: 'Tên danh mục đã tồn tại' });
    }
    
    // Tìm và cập nhật danh mục
    const category = await Category.findByIdAndUpdate(
      categoryId,
      { category_name },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }
    
    res.status(200).json({
      message: 'Cập nhật danh mục thành công',
      category
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Cập nhật trạng thái danh mục
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Thông tin danh mục đã cập nhật
 */
exports.updateCategoryStatus = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { is_active } = req.body;
    
    // Tìm và cập nhật trạng thái danh mục
    const category = await Category.findByIdAndUpdate(
      categoryId,
      { is_active },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }
    
    res.status(200).json({
      message: 'Cập nhật trạng thái danh mục thành công',
      category
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}; 