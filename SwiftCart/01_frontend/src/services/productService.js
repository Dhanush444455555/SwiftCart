import { getMockProducts } from '../data/mockProducts';

export const productService = {
  // Primary: use local curated mock products (always works, no network needed)
  getAllProducts: async () => {
    return getMockProducts();
  },
  searchProducts: (query) => {
    const q = query.toLowerCase();
    return getMockProducts().filter(
      p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  },
  getProductById: (id) => getMockProducts().find(p => p._id === id) || null,
  getProductByQrCode: (qrCode) => getMockProducts().find(p => p.qrCode === qrCode) || null,
};
