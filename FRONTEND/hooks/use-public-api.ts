import { useQuery } from '@tanstack/react-query';
import { publicAPI, type ProductFilters } from '@/lib/api';

// Hook để lấy danh sách products công khai
export const usePublicProducts = (params?: ProductFilters) => {
  return useQuery({
    queryKey: ['public-products', params],
    queryFn: () => publicAPI.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 phút
  });
};

// Hook để lấy product theo ID (công khai)
export const usePublicProduct = (productId: string) => {
  return useQuery({
    queryKey: ['public-product', productId],
    queryFn: () => publicAPI.getProductById(productId),
    enabled: !!productId,
    staleTime: 10 * 60 * 1000, // 10 phút
  });
};

// Hook để lấy danh sách categories công khai
export const usePublicCategories = () => {
  return useQuery({
    queryKey: ['public-categories'],
    queryFn: () => publicAPI.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 phút
  });
};

// Hook để lấy category theo ID (công khai)
export const usePublicCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ['public-category', categoryId],
    queryFn: () => publicAPI.getCategoryById(categoryId),
    enabled: !!categoryId,
    staleTime: 30 * 60 * 1000, // 30 phút
  });
};
