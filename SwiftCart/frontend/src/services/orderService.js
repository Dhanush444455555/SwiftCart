import apiClient from './apiClient';

export const orderService = {
  /** Create a Razorpay order on the server */
  createRazorpayOrder: (data) => apiClient.post('/orders/create-order', data),

  /** Verify Razorpay payment signature */
  verifyPayment: (data) => apiClient.post('/orders/verify-payment', data),

  /** Get current user's past orders */
  getMyOrders: () => apiClient.get('/orders/my-orders'),

  /** Update stock after successful payment */
  updateStock: (items) => apiClient.post('/orders/update-stock', { items }),
};
