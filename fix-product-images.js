const mongoose = require('mongoose');
require('dotenv').config();

// Product schema
const productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
    trim: true
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  brand: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock_quantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  description: {
    type: String,
    trim: true
  },
  image_url: {
    type: String,
    trim: true
  },
  specifications: {
    type: Object,
    default: {}
  },
  is_active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Product = mongoose.model('Product', productSchema);

// Mapping sản phẩm cụ thể với ảnh chất lượng cao
const specificProductImages = {
  'iPhone 16 Pro Max 256GB': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&crop=center',
  'iPhone 16': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center',
  'Samsung Galaxy S24 Ultra': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop&crop=center',
  'MacBook Pro M3 14 inch': 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop&crop=center',
  'Dell XPS 13 Plus': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop&crop=center',
  'iPad Pro M2 11 inch': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&crop=center',
  'Samsung Galaxy Tab S9': 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&h=500&fit=crop&crop=center',
  'Apple Watch Series 9': 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&h=500&fit=crop&crop=center',
  'Sony WH-1000XM5': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&crop=center',
  'AirPods Pro 2': 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=500&fit=crop&crop=center',
  'Ốp lưng iPhone 16 Pro Max': 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop&crop=center'
};

// Ảnh fallback theo category
const categoryImages = {
  'iphone': 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&crop=center',
  'samsung': 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop&crop=center',
  'macbook': 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop&crop=center',
  'laptop': 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop&crop=center',
  'ipad': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&crop=center',
  'tablet': 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&h=500&fit=crop&crop=center',
  'watch': 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&h=500&fit=crop&crop=center',
  'headphone': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&crop=center',
  'airpods': 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=500&fit=crop&crop=center',
  'case': 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop&crop=center',
  'default': 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=500&h=500&fit=crop&crop=center'
};

function getImageForProduct(productName) {
  // Kiểm tra mapping cụ thể trước
  if (specificProductImages[productName]) {
    return specificProductImages[productName];
  }
  
  // Kiểm tra theo từ khóa
  const name = productName.toLowerCase();
  for (const [key, image] of Object.entries(categoryImages)) {
    if (name.includes(key)) {
      return image;
    }
  }
  
  // Fallback
  return categoryImages.default;
}

async function fixProductImages() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    // Kết nối database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://truong2004ko:Truong2k4@cluster0daotruongdev.uu48g23.mongodb.net/khaicute?retryWrites=true&w=majority&appName=Cluster0DaoTruongDev');
    
    console.log('✅ Connected to MongoDB successfully');

    // Lấy tất cả sản phẩm
    console.log('\n📦 Fetching all products...');
    const products = await Product.find({});
    
    console.log(`📊 Found ${products.length} products`);
    
    let updatedCount = 0;

    for (const product of products) {
      // Kiểm tra nếu ảnh hiện tại là local path hoặc không hợp lệ
      const currentImage = product.image_url;
      const needsUpdate = !currentImage || 
                         currentImage.startsWith('/images/') || 
                         currentImage.startsWith('/uploads/') ||
                         !currentImage.startsWith('http');

      if (needsUpdate) {
        // Lấy ảnh mới
        const newImageUrl = getImageForProduct(product.product_name);
        
        // Cập nhật ảnh cho sản phẩm
        await Product.findByIdAndUpdate(product._id, { image_url: newImageUrl });
        
        console.log(`✅ Updated "${product.product_name}"`);
        console.log(`   Old: ${currentImage || 'No image'}`);
        console.log(`   New: ${newImageUrl}`);
        updatedCount++;
      } else {
        console.log(`⏭️  Skipping "${product.product_name}" - already has valid URL`);
      }
    }

    console.log('\n🎉 Fix completed!');
    console.log(`📊 Statistics:`);
    console.log(`   - Total products: ${products.length}`);
    console.log(`   - Updated: ${updatedCount}`);
    console.log(`   - Skipped: ${products.length - updatedCount}`);

    // Hiển thị tất cả sản phẩm sau khi cập nhật
    console.log('\n📋 All products with images:');
    const allProducts = await Product.find({}).select('product_name image_url');
    allProducts.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.product_name}`);
      console.log(`      Image: ${product.image_url}`);
    });

  } catch (error) {
    console.error('❌ Error fixing product images:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Chạy script
fixProductImages();
