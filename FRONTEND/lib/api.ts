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
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Xử lý refresh token khi token hết hạn
api.interceptors.response.use(
  (response) => response,
  async (error) => {
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