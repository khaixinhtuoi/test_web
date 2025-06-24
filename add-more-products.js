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

// Category schema
const categorySchema = new mongoose.Schema({
  category_name: {
    type: String,
    required: true,
    trim: true,
    unique: true
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

const Category = mongoose.model('Category', categorySchema);

// Sản phẩm mới để thêm vào
const newProducts = [
  {
    product_name: "iPhone 15 Pro 128GB",
    brand: "Apple",
    price: 28990000,
    stock_quantity: 25,
    description: "iPhone 15 Pro với chip A17 Pro, camera 48MP và thiết kế titanium. Màn hình Super Retina XDR 6.1 inch với Dynamic Island.",
    image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop&crop=center",
    specifications: {
      "Màn hình": "6.1 inch Super Retina XDR",
      "Chip": "A17 Pro",
      "Camera": "48MP + 12MP + 12MP",
      "Bộ nhớ": "128GB",
      "Pin": "Lên đến 23 giờ"
    }
  },
  {
    product_name: "Samsung Galaxy S23 FE",
    brand: "Samsung",
    price: 14990000,
    stock_quantity: 30,
    description: "Galaxy S23 FE với camera 50MP, màn hình Dynamic AMOLED 2X 6.4 inch và chip Exynos 2200 mạnh mẽ.",
    image_url: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500&h=500&fit=crop&crop=center",
    specifications: {
      "Màn hình": "6.4 inch Dynamic AMOLED 2X",
      "Chip": "Exynos 2200",
      "Camera": "50MP + 12MP + 8MP",
      "RAM": "8GB",
      "Bộ nhớ": "256GB"
    }
  },
  {
    product_name: "MacBook Air M2 13 inch",
    brand: "Apple",
    price: 27990000,
    stock_quantity: 12,
    description: "MacBook Air M2 siêu mỏng nhẹ với chip M2 8-core, màn hình Liquid Retina 13.6 inch và thời lượng pin lên đến 18 giờ.",
    image_url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop&crop=center",
    specifications: {
      "Màn hình": "13.6 inch Liquid Retina",
      "Chip": "Apple M2 8-core",
      "RAM": "8GB",
      "SSD": "256GB",
      "Pin": "Lên đến 18 giờ"
    }
  },
  {
    product_name: "AirPods 3rd Generation",
    brand: "Apple",
    price: 4990000,
    stock_quantity: 40,
    description: "AirPods thế hệ 3 với Spatial Audio, chống nước IPX4 và thời lượng pin lên đến 30 giờ với case sạc.",
    image_url: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&h=500&fit=crop&crop=center",
    specifications: {
      "Chip": "H1",
      "Chống nước": "IPX4",
      "Pin": "6 giờ + 24 giờ với case",
      "Kết nối": "Bluetooth 5.0",
      "Tính năng": "Spatial Audio"
    }
  },
  {
    product_name: "Samsung Galaxy Buds2 Pro",
    brand: "Samsung",
    price: 3990000,
    stock_quantity: 35,
    description: "Galaxy Buds2 Pro với chống ồn chủ động thông minh, âm thanh Hi-Fi 24bit và thiết kế thoải mái.",
    image_url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop&crop=center",
    specifications: {
      "Driver": "10mm + 5.3mm",
      "Chống ồn": "Active Noise Cancelling",
      "Pin": "5 giờ + 13 giờ với case",
      "Chống nước": "IPX7",
      "Codec": "Samsung Seamless Codec"
    }
  },
  {
    product_name: "iPad Air M1 64GB",
    brand: "Apple",
    price: 16990000,
    stock_quantity: 18,
    description: "iPad Air với chip M1 mạnh mẽ, màn hình Liquid Retina 10.9 inch và hỗ trợ Apple Pencil thế hệ 2.",
    image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop&crop=center",
    specifications: {
      "Màn hình": "10.9 inch Liquid Retina",
      "Chip": "Apple M1",
      "Bộ nhớ": "64GB",
      "Camera": "12MP Wide",
      "Kết nối": "Wi-Fi 6, USB-C"
    }
  },
  {
    product_name: "Apple Watch SE 2022",
    brand: "Apple",
    price: 7990000,
    stock_quantity: 28,
    description: "Apple Watch SE với GPS, màn hình Retina Always-On và các tính năng sức khỏe tiên tiến.",
    image_url: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500&h=500&fit=crop&crop=center",
    specifications: {
      "Màn hình": "Retina Always-On",
      "Chip": "S8 SiP",
      "Kết nối": "GPS + Cellular",
      "Chống nước": "50m",
      "Tính năng": "Heart Rate, ECG, Blood Oxygen"
    }
  },
  {
    product_name: "Sạc nhanh Apple 20W USB-C",
    brand: "Apple",
    price: 590000,
    stock_quantity: 100,
    description: "Adapter sạc nhanh 20W USB-C chính hãng Apple, tương thích với iPhone, iPad và các thiết bị USB-C.",
    image_url: "https://images.unsplash.com/photo-1609592806787-3d9c5b1e8b8d?w=500&h=500&fit=crop&crop=center",
    specifications: {
      "Công suất": "20W",
      "Cổng": "USB-C",
      "Tương thích": "iPhone 8 trở lên, iPad",
      "Công nghệ": "Power Delivery",
      "Kích thước": "Nhỏ gọn"
    }
  }
];

async function addMoreProducts() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    // Kết nối database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://truong2004ko:Truong2k4@cluster0daotruongdev.uu48g23.mongodb.net/khaicute?retryWrites=true&w=majority&appName=Cluster0DaoTruongDev');
    
    console.log('✅ Connected to MongoDB successfully');

    // Lấy categories
    console.log('\n📂 Fetching categories...');
    const categories = await Category.find({});
    console.log(`Found ${categories.length} categories`);
    
    if (categories.length === 0) {
      console.log('❌ No categories found. Please create categories first.');
      return;
    }

    // Tìm category phù hợp cho từng sản phẩm
    const getCategory = (productName) => {
      const name = productName.toLowerCase();
      
      // Tìm category phù hợp
      for (const category of categories) {
        const categoryName = category.category_name.toLowerCase();
        if (name.includes('iphone') && categoryName.includes('điện thoại')) return category._id;
        if (name.includes('samsung') && categoryName.includes('điện thoại')) return category._id;
        if (name.includes('macbook') && categoryName.includes('laptop')) return category._id;
        if (name.includes('ipad') && categoryName.includes('tablet')) return category._id;
        if (name.includes('airpods') && categoryName.includes('tai nghe')) return category._id;
        if (name.includes('buds') && categoryName.includes('tai nghe')) return category._id;
        if (name.includes('watch') && categoryName.includes('đồng hồ')) return category._id;
        if (name.includes('sạc') && categoryName.includes('phụ kiện')) return category._id;
      }
      
      // Fallback to first category
      return categories[0]._id;
    };

    console.log('\n📦 Adding new products...');
    let addedCount = 0;

    for (const productData of newProducts) {
      // Kiểm tra xem sản phẩm đã tồn tại chưa
      const existingProduct = await Product.findOne({ product_name: productData.product_name });
      
      if (existingProduct) {
        console.log(`⏭️  Skipping "${productData.product_name}" - already exists`);
        continue;
      }

      // Thêm category_id
      const categoryId = getCategory(productData.product_name);
      productData.category_id = categoryId;

      // Tạo sản phẩm mới
      const product = new Product(productData);
      await product.save();
      
      console.log(`✅ Added "${productData.product_name}" - ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(productData.price)}`);
      addedCount++;
    }

    console.log('\n🎉 Products added successfully!');
    console.log(`📊 Statistics:`);
    console.log(`   - New products added: ${addedCount}`);
    console.log(`   - Skipped (already exist): ${newProducts.length - addedCount}`);

    // Hiển thị tổng số sản phẩm
    const totalProducts = await Product.countDocuments({});
    console.log(`   - Total products in database: ${totalProducts}`);

  } catch (error) {
    console.error('❌ Error adding products:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Chạy script
addMoreProducts();
