import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminOrderAPI, type AdminOrderFilters, type UpdateOrderStatusData } from '@/lib/api';
import { toast } from 'sonner';

// Hook để lấy danh sách tất cả đơn hàng (admin)
export const useAdminOrders = (filters: AdminOrderFilters = {}) => {
  return useQuery({
    queryKey: ['admin-orders', filters],
    queryFn: () => adminOrderAPI.getAllOrders(filters),
    staleTime: 2 * 60 * 1000, // 2 phút
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Hook để lấy chi tiết đơn hàng (admin)
export const useAdminOrderDetails = (orderId: string) => {
  return useQuery({
    queryKey: ['admin-order', orderId],
    queryFn: () => adminOrderAPI.getOrderDetails(orderId),
    enabled: !!orderId && typeof window !== 'undefined' && !!localStorage.getItem('accessToken'),
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

// Hook để cập nhật trạng thái đơn hàng (admin)
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: UpdateOrderStatusData }) =>
      adminOrderAPI.updateOrderStatus(orderId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin-order'] });
      toast.success(data.message || 'Cập nhật trạng thái đơn hàng thành công!');
    },
    onError: (error: any) => {
      let message = 'Có lỗi xảy ra khi cập nhật trạng thái đơn hàng';
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        message = 'Bạn không có quyền thực hiện thao tác này';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      toast.error(message);
    },
  });
};

// Hook để xóa đơn hàng (admin)
export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => adminOrderAPI.deleteOrder(orderId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success(data.message || 'Xóa đơn hàng thành công!');
    },
    onError: (error: any) => {
      let message = 'Có lỗi xảy ra khi xóa đơn hàng';
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        message = 'Bạn không có quyền thực hiện thao tác này';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      }
      
      toast.error(message);
    },
  });
};

// Hook để lấy thống kê đơn hàng
export const useOrderStats = () => {
  const { data: ordersData } = useAdminOrders({ limit: 1000 }); // Lấy nhiều để tính stats
  
  if (!ordersData?.orders) {
    return {
      total: 0,
      pending: 0,
      confirmed: 0,
      shipping: 0,
      delivered: 0,
      cancelled: 0,
      totalRevenue: 0,
    };
  }

  const orders = ordersData.orders;
  
  return {
    total: orders.length,
    pending: orders.filter(o => o.order_status === 'pending').length,
    confirmed: orders.filter(o => o.order_status === 'confirmed').length,
    shipping: orders.filter(o => o.order_status === 'shipping').length,
    delivered: orders.filter(o => o.order_status === 'delivered').length,
    cancelled: orders.filter(o => o.order_status === 'cancelled').length,
    totalRevenue: orders
      .filter(o => o.payment_status === 'paid')
      .reduce((sum, o) => sum + o.total_amount, 0),
  };
};
