import apiClient from './apiClient';

export const orderService = {
  createOrder: (orderData) => apiClient.post('/orders', orderData),
  getUserOrders: (userId) => apiClient.get(`/orders/${userId}`),
};
