import apiClient from './apiClient';

export const orderService = {
  createRazorpayOrder: (data) => apiClient.post('/orders/create-order', data),
  verifyPayment: (data) => apiClient.post('/orders/verify-payment', data),
  getMyOrders: () => apiClient.get('/orders/my-orders'),
};
