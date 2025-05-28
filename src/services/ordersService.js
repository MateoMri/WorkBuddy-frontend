import api from './api';

export const ordersService = {
  // Obtener todas las órdenes
  getAllOrders: async () => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      console.error('Error al obtener órdenes:', error);
      throw error.response?.data || { message: 'Error al obtener órdenes' };
    }
  },

  // Obtener órdenes del usuario actual
  getUserOrders: async (filters = {}) => {
    try {
      // Construir query string para filtros
      const queryParams = new URLSearchParams();
      
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.page) queryParams.append('page', filters.page);
      
      const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await api.get(`/orders/user${query}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener órdenes del usuario:', error);
      throw error.response?.data || { message: 'Error al obtener órdenes del usuario' };
    }
  },

  // Obtener una orden por ID
  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener orden ${orderId}:`, error);
      throw error.response?.data || { message: 'Error al obtener la orden' };
    }
  },

  // Crear una nueva orden
  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Error al crear orden:', error);
      throw error.response?.data || { message: 'Error al crear la orden' };
    }
  },

  // Actualizar el estado de una orden
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await api.put(`/orders/${orderId}`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar estado de orden ${orderId}:`, error);
      throw error.response?.data || { message: 'Error al actualizar el estado de la orden' };
    }
  },

  // Eliminar una orden
  deleteOrder: async (orderId) => {
    try {
      const response = await api.delete(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar orden ${orderId}:`, error);
      throw error.response?.data || { message: 'Error al eliminar la orden' };
    }
  }
};
