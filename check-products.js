const mongoose = require('mongoose');
require('dotenv').config();

const productSchema = new mongoose.Schema({
  product_name: String,
  image_url: String,
  brand: String,
  price: Number
});

const Product = mongoose.model('Product', productSchema);

async function checkProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const products = await Product.find({}).limit(5);
    console.log('Sample products:');
    products.forEach(p => {
      console.log(`- ${p.product_name}: ${p.image_url}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkProducts();
