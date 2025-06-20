import { useQuery } from '@tanstack/react-query';
import { adminAPI, type Category } from '@/lib/api';

// Hook để lấy danh sách categories cho admin
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => adminAPI.getAllCategories(),
    staleTime: 10 * 60 * 1000, // 10 phút
  });
};

// Hook để lấy category theo ID
export const useCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ['category', categoryId],
    queryFn: () => adminAPI.getCategoryById(categoryId),
    enabled: !!categoryId,
  });
};
