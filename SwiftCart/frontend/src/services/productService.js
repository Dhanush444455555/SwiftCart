import apiClient from './apiClient';

export const productService = {
  /** Fetch all products from MySQL backend */
  getAllProducts: () => apiClient.get('/products'),

  /** Search products by name via backend */
  searchProducts: (query) => apiClient.get('/products/search', { params: { query } }),

  /** Get single product by ID */
  getProductById: (id) => apiClient.get(`/products/${id}`),

  /** Get product by QR code */
  getProductByQrCode: (qrCode) => apiClient.get(`/products/qr/${qrCode}`),

  // ── Admin CRUD ──────────────────────────────────────────────────
  /** [Admin] Create a new product */
  createProduct: (data) => apiClient.post('/admin/products', data),

  /** [Admin] Update a product */
  updateProduct: (id, data) => apiClient.put(`/admin/products/${id}`, data),

  /** [Admin] Delete a product */
  deleteProduct: (id) => apiClient.delete(`/admin/products/${id}`),

  /** [Admin] Get dashboard stats */
  getStats: () => apiClient.get('/admin/stats'),
};
