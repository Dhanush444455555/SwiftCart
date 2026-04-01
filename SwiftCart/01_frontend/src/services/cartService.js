import apiClient from './apiClient';

export const cartService = {
  getCart: (userId) => apiClient.get(`/cart/${userId}`),
  syncCart: (userId, items, totalPrice) => apiClient.post('/cart/sync', { userId, items, totalPrice }),
};
