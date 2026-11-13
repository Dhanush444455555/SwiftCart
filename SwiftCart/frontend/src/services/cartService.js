import apiClient from './apiClient';

export const cartService = {
  /** Get the authenticated user's cart (token from apiClient interceptor) */
  getCart: () => apiClient.get('/cart'),

  /** Replace cart contents on the server */
  syncCart: (items, totalPrice) => apiClient.post('/cart/sync', { items, totalPrice }),
};
