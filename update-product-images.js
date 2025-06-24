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

// Danh sách ảnh sản phẩm từ Unsplash (chất lượng cao, miễn phí)
const productImages = {
  // iPhone
  'iphone': [
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop&crop=center'
  ],
  
  // Samsung
  'samsung': [
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500&h=500&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&h=500&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&h=500&fit=crop&crop=center'
  ],
  
  // MacBook / Laptop
  'macbook': [
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop&crop=center'
  ],
  
  'laptop': [
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=500&h=500&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&h=500&fit=crop&crop=center'
  ],
  
  // AirPods / Tai nghe
  'airpods': [
    'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=500&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&h=500&fit=crop&crop=center'
  ],
  
  'tai nghe': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop&crop=center'
  ],
  
  // iPad / Tablet
  'ipad': [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&h=500&fit=crop&crop=center'
  ],
  
  'tablet': [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&h=500&fit=crop&crop=center'
  ],
  
  // Apple Watch / Smartwatch
  'apple watch': [
    'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&h=500&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500&h=500&fit=crop&crop=center'
  ],
  
  'smartwatch': [
    'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&h=500&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500&h=500&fit=crop&crop=center'
  ],
  
  // Phụ kiện
  'sạc': [
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1609592806787-3d9c5b1e8b8d?w=500&h=500&fit=crop&crop=center'
  ],
  
  'cáp': [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1609592806787-3d9c5b1e8b8d?w=500&h=500&fit=crop&crop=center'
  ],
  
  'ốp lưng': [
    'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&h=500&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop&crop=center'
  ],
  
  // Default fallback images
  'default': [
    'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=500&h=500&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=500&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&h=500&fit=crop&crop=center'
  ]
};

// Hàm tìm ảnh phù hợp cho sản phẩm
function findImageForProduct(productName, brand) {
  const name = productName.toLowerCase();
  const brandLower = brand ? brand.toLowerCase() : '';
  
  // Kiểm tra theo thương hiệu và tên sản phẩm
  for (const [key, images] of Object.entries(productImages)) {
    if (name.includes(key) || brandLower.includes(key)) {
      return images[Math.floor(Math.random() * images.length)];
    }
  }
  
  // Fallback to default
  const defaultImages = productImages.default;
  return defaultImages[Math.floor(Math.random() * defaultImages.length)];
}

async function updateProductImages() {
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
    let skippedCount = 0;

    for (const product of products) {
      // Kiểm tra nếu sản phẩm đã có ảnh
      if (product.image_url && product.image_url.trim() !== '') {
        console.log(`⏭️  Skipping "${product.product_name}" - already has image`);
        skippedCount++;
        continue;
      }

      // Tìm ảnh phù hợp
      const imageUrl = findImageForProduct(product.product_name, product.brand);
      
      // Cập nhật ảnh cho sản phẩm
      await Product.findByIdAndUpdate(product._id, { image_url: imageUrl });
      
      console.log(`✅ Updated "${product.product_name}" with image: ${imageUrl}`);
      updatedCount++;
    }

    console.log('\n🎉 Update completed!');
    console.log(`📊 Statistics:`);
    console.log(`   - Total products: ${products.length}`);
    console.log(`   - Updated: ${updatedCount}`);
    console.log(`   - Skipped (already had images): ${skippedCount}`);

    // Hiển thị một số sản phẩm đã cập nhật
    console.log('\n📋 Sample updated products:');
    const updatedProducts = await Product.find({ image_url: { $exists: true, $ne: '' } }).limit(5);
    updatedProducts.forEach(product => {
      console.log(`   - ${product.product_name}: ${product.image_url}`);
    });

  } catch (error) {
    console.error('❌ Error updating product images:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Chạy script
updateProductImages();
