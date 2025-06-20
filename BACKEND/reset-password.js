const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb+srv://vugiakhai2004:Khai2004@cluster0.ixqhj.mongodb.net/techstore?retryWrites=true&w=majority&appName=Cluster0');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  phone: String,
  address: String,
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function resetPassword() {
  try {
    const email = 'vugiakhai2004@gmail.com';
    const newPassword = 'password123';
    
    // Hash password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update user
    const result = await User.updateOne(
      { email },
      { password: hashedPassword }
    );
    
    console.log('Reset password result:', result);
    
    // Verify user exists
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'YES' : 'NO');
    if (user) {
      console.log('User role:', user.role);
      console.log('User active:', user.is_active);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

resetPassword();
