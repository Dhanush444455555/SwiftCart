import apiClient from './apiClient';

export const productService = {
  // Directly intercepting and pulling 100 realistic dummy products for the frontend prototype
  getAllProducts: async () => {
    try {
      // First try your local backend (if MongoDB is running)
      return await apiClient.get('/products');
    } catch {
      // Fallback: Fetch massive Flipkart-style mock dataset
      const res = await fetch('https://dummyjson.com/products?limit=100');
      const data = await res.json();
      return data.products.map(p => ({
        _id: String(p.id),
        name: p.title,
        description: p.description,
        price: p.price,
        category: p.category.charAt(0).toUpperCase() + p.category.slice(1).replace('-', ' '),
        image: p.thumbnail || p.images[0] || 'https://via.placeholder.com/300',
        stockCount: p.stock,
        aisle: `${String.fromCharCode(65 + Math.floor(Math.random() * 8))}-${Math.floor(Math.random() * 20) + 1}`,
      }));
    }
  },
  searchProducts: (query) => apiClient.get(`/products/search?query=${encodeURIComponent(query)}`),
  getProductById: (id) => apiClient.get(`/products/${id}`),
};
