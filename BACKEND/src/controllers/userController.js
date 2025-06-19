const { User } = require('../models');
const { generateToken } = require('../utils');

/**
 * Đăng ký người dùng mới
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Thông tin người dùng đã đăng ký
 */
exports.register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone, address } = req.body;
    
    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }
    
    // Tạo người dùng mới
    const user = new User({
      email,
      password,
      first_name,
      last_name,
      phone,
      address
    });
    
    await user.save();
    
    // Trả về thông tin người dùng (không bao gồm mật khẩu)
    const userObject = user.toObject();
    delete userObject.password;
    
    res.status(201).json({
      message: 'Đăng ký thành công',
      user: userObject
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Đăng nhập người dùng
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Token JWT và thông tin người dùng
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
    
    // Kiểm tra trạng thái người dùng
    if (!user.is_active) {
      return res.status(401).json({ message: 'Tài khoản đã bị khóa' });
    }
    
    // Kiểm tra mật khẩu
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
    
    // Tạo JWT token
    const token = generateToken(user);
    
    // Trả về thông tin người dùng (không bao gồm mật khẩu)
    const userObject = user.toObject();
    delete userObject.password;
    
    res.status(200).json({
      message: 'Đăng nhập thành công',
      token,
      user: userObject
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Lấy thông tin người dùng hiện tại
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Thông tin người dùng
 */
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Cập nhật thông tin người dùng
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Thông tin người dùng đã cập nhật
 */
exports.updateUser = async (req, res) => {
  try {
    const { first_name, last_name, phone, address } = req.body;
    
    // Tìm và cập nhật người dùng
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { first_name, last_name, phone, address },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    res.status(200).json({
      message: 'Cập nhật thông tin thành công',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Đổi mật khẩu
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Thông báo kết quả
 */
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Tìm người dùng
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    // Kiểm tra mật khẩu hiện tại
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng' });
    }
    
    // Cập nhật mật khẩu mới
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Lấy danh sách người dùng (chỉ dành cho admin)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Danh sách người dùng
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

/**
 * Cập nhật trạng thái người dùng (chỉ dành cho admin)
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - Thông tin người dùng đã cập nhật
 */
exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { is_active } = req.body;
    
    // Tìm và cập nhật trạng thái người dùng
    const user = await User.findByIdAndUpdate(
      userId,
      { is_active },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    
    res.status(200).json({
      message: 'Cập nhật trạng thái người dùng thành công',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}; 