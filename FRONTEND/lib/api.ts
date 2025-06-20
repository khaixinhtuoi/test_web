import axios from 'axios';

// Types và interfaces
export interface Product {
  _id: string;
  product_name: string;
  category_id: {
    _id: string;
    category_name: string;
  };
  brand?: string;
  price: number;
  stock_quantity: number;
  description?: string;
  image_url?: string;
  specifications?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  _id: string;
  category_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface CreateProductData {
  product_name: string;
  category_id: string;
  brand?: string;
  price: number;
  stock_quantity: number;
  description?: string;
  image_url?: string;
  specifications?: Record<string, any>;
}

export interface UpdateProductData {
  product_name?: string;
  category_id?: string;
  brand?: string;
  price?: number;
  stock_quantity?: number;
  description?: string;
  image_url?: string;
  specifications?: Record<string, any>;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  min_price?: number;
  max_price?: number;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest';
  brands?: string[];
}

export interface CartItem {
  _id: string;
  user_id: string;
  product_id: Product;
  quantity: number;
  added_at: string;
}

export interface CartResponse {
  cartItems: CartItem[];
  totalItems: number;
  totalAmount: number;
}

export interface AddToCartData {
  product_id: string;
  quantity: number;
}

export interface UpdateCartItemData {
  quantity: number;
}

export interface Order {
  _id: string;
  user_id: string;
  order_number: string;
  order_status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed';
  subtotal: number;
  shipping_fee: number;
  total_amount: number;
  shipping_recipient_name: string;
  shipping_address: string;
  payment_method: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderData {
  shipping_recipient_name: string;
  shipping_address: string;
  payment_method: string;
  notes?: string;
}

export interface OrderItem {
  _id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  total_price: number;
}

export interface AdminOrder {
  _id: string;
  user_id: {
    _id: string;
    email: string;
    first_name?: string;
    last_name?: string;
  };
  order_number: string;
  order_status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed';
  subtotal: number;
  shipping_fee: number;
  total_amount: number;
  shipping_recipient_name: string;
  shipping_address: string;
  payment_method: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminOrdersResponse {
  orders: AdminOrder[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface AdminOrderFilters {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface UpdateOrderStatusData {
  order_status?: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled';
  payment_status?: 'pending' | 'paid' | 'failed';
  notes?: string;
}

export interface DashboardStats {
  totalStats: {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    revenueChange: string;
    ordersChange: string;
  };
  ordersByStatus: Array<{
    _id: string;
    count: number;
  }>;
  monthlyRevenue: Array<{
    _id: {
      year: number;
      month: number;
    };
    revenue: number;
    orders: number;
  }>;
  recentOrders: AdminOrder[];
}

// Cấu hình axios instance
const API_URL = 'http://localhost:5000/api';

// Tạo axios instance mặc định
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Cho phép gửi cookies
});

// Xử lý gửi token trong request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    console.log('Token:', token ? `${token.substring(0, 20)}...` : 'No token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Xử lý refresh token khi token hết hạn
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error('API Error:', error.response?.status, error.response?.data);
    const originalRequest = error.config;

    // Nếu lỗi 401 (Unauthorized) và chưa thử refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi API refresh token
        const response = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        // Lưu token mới
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        // Cập nhật token trong header và thử lại request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (error) {
        // Nếu refresh token thất bại, đăng xuất người dùng
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
        window.location.href = '/auth';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  refreshToken: async () => {
    const response = await api.post('/auth/refresh-token');
    return response.data;
  },
};

// User API
export const userAPI = {
  register: async (userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    address?: string;
  }) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  
  updateProfile: async (userData: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    address?: string;
  }) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },
  
  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await api.put('/users/change-password', passwordData);
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  // Quản lý người dùng
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  
  updateUserStatus: async (userId: string, isActive: boolean) => {
    const response = await api.put(`/users/${userId}/status`, { is_active: isActive });
    return response.data;
  },
  
  createUser: async (userData: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
    address?: string;
    role: 'customer' | 'admin';
  }) => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },
  
  updateUser: async (userId: string, userData: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    address?: string;
    role?: 'customer' | 'admin';
  }) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },
  
  deleteUser: async (userId: string) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
  
  // Quản lý danh mục
  getAllCategories: async (): Promise<{ categories: Category[] }> => {
    const response = await api.get('/categories/admin/all');
    return response.data;
  },
  
  getCategoryById: async (categoryId: string) => {
    const response = await api.get(`/categories/${categoryId}`);
    return response.data;
  },
  
  createCategory: async (categoryData: {
    category_name: string;
  }) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },
  
  updateCategory: async (categoryId: string, categoryData: {
    category_name: string;
  }) => {
    const response = await api.put(`/categories/${categoryId}`, categoryData);
    return response.data;
  },
  
  updateCategoryStatus: async (categoryId: string, isActive: boolean) => {
    const response = await api.put(`/categories/${categoryId}/status`, { is_active: isActive });
    return response.data;
  },
  
  // Quản lý sản phẩm
  getAllProducts: async (params?: ProductFilters): Promise<ProductsResponse> => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getProductById: async (productId: string): Promise<{ product: Product }> => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },

  createProduct: async (productData: CreateProductData): Promise<{ message: string; product: Product }> => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  updateProduct: async (productId: string, productData: UpdateProductData): Promise<{ message: string; product: Product }> => {
    const response = await api.put(`/products/${productId}`, productData);
    return response.data;
  },
  
  updateProductStatus: async (productId: string, isActive: boolean): Promise<{ message: string; product: Product }> => {
    const response = await api.put(`/products/${productId}/status`, { is_active: isActive });
    return response.data;
  },

  updateProductStock: async (productId: string, stockQuantity: number): Promise<{ message: string; product: Product }> => {
    const response = await api.put(`/products/${productId}/stock`, { stock_quantity: stockQuantity });
    return response.data;
  },

  deleteProduct: async (productId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  },
};

// Public API (không cần authentication)
export const publicAPI = {
  // Lấy danh sách sản phẩm công khai
  getProducts: async (params?: ProductFilters): Promise<ProductsResponse> => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Lấy sản phẩm theo ID
  getProductById: async (productId: string): Promise<{ product: Product }> => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },

  // Lấy danh sách categories công khai
  getCategories: async (): Promise<{ categories: Category[] }> => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Lấy category theo ID
  getCategoryById: async (categoryId: string): Promise<{ category: Category }> => {
    const response = await api.get(`/categories/${categoryId}`);
    return response.data;
  },
};

// Cart API
export const cartAPI = {
  // Lấy giỏ hàng của người dùng
  getCart: async (): Promise<CartResponse> => {
    const response = await api.get('/cart');
    return response.data;
  },

  // Thêm sản phẩm vào giỏ hàng
  addToCart: async (data: AddToCartData): Promise<{ message: string; cartItem: CartItem }> => {
    const response = await api.post('/cart', data);
    return response.data;
  },

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateCartItem: async (cartItemId: string, data: UpdateCartItemData): Promise<{ message: string; cartItem: CartItem }> => {
    const response = await api.put(`/cart/${cartItemId}`, data);
    return response.data;
  },

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart: async (cartItemId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/cart/${cartItemId}`);
    return response.data;
  },

  // Xóa toàn bộ giỏ hàng
  clearCart: async (): Promise<{ message: string }> => {
    const response = await api.delete('/cart');
    return response.data;
  },
};

// Order API
export const orderAPI = {
  // Tạo đơn hàng mới từ giỏ hàng
  createOrder: async (data: CreateOrderData): Promise<{ message: string; order: Order }> => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  // Lấy danh sách đơn hàng của người dùng
  getUserOrders: async (): Promise<{ orders: Order[] }> => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  // Lấy thông tin chi tiết đơn hàng
  getOrderDetails: async (orderId: string): Promise<{ order: Order }> => {
    const response = await api.get(`/orders/my-orders/${orderId}`);
    return response.data;
  },

  // Hủy đơn hàng
  cancelOrder: async (orderId: string): Promise<{ message: string; order: Order }> => {
    const response = await api.put(`/orders/my-orders/${orderId}/cancel`);
    return response.data;
  },
};

// Admin Order API
export const adminOrderAPI = {
  // Lấy danh sách tất cả đơn hàng (admin)
  getAllOrders: async (filters: AdminOrderFilters = {}): Promise<AdminOrdersResponse> => {
    const params = new URLSearchParams();

    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.status && filters.status !== 'all') params.append('status', filters.status);

    const response = await api.get(`/admin/orders?${params.toString()}`);
    return response.data;
  },

  // Lấy chi tiết đơn hàng (admin)
  getOrderDetails: async (orderId: string): Promise<{ order: AdminOrder; orderItems: OrderItem[] }> => {
    const response = await api.get(`/admin/orders/${orderId}`);
    return response.data;
  },

  // Cập nhật trạng thái đơn hàng (admin)
  updateOrderStatus: async (orderId: string, data: UpdateOrderStatusData): Promise<{ message: string; order: AdminOrder }> => {
    const response = await api.put(`/admin/orders/${orderId}/status`, data);
    return response.data;
  },

  // Xóa đơn hàng (admin)
  deleteOrder: async (orderId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/admin/orders/${orderId}`);
    return response.data;
  },

  // Lấy thống kê dashboard (admin)
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/admin/orders/dashboard/stats');
    return response.data;
  },
};

// Upload API
export const uploadAPI = {
  // Upload single image
  uploadImage: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      url: response.data.data.url,
      filename: response.data.data.filename
    };
  },

  // Upload multiple images
  uploadImages: async (files: File[]): Promise<Array<{ url: string; filename: string }>> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const response = await api.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data.map((item: any) => ({
      url: item.url,
      filename: item.filename
    }));
  },

  // Delete image
  deleteImage: async (filename: string): Promise<void> => {
    await api.delete(`/upload/image/${filename}`);
  },
};