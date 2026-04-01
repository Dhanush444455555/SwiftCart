import apiClient from './apiClient';
import { generateMassiveMockData } from '../data/mockProducts';

export const productService = {
  getAllProducts: async () => {
    let localData = [];
    try {
      localData = await apiClient.get('/products');
      if (!Array.isArray(localData)) localData = [];
    } catch (e) {
      console.warn("Local DB unreachable, relying on external APIs only.");
    }
    
    try {
      // Unconditionally fetch external massive datasets
      const dummyRes = await fetch('https://dummyjson.com/products?limit=194');
      const dummyData = await dummyRes.json();
      
      const fakeStoreRes = await fetch('https://fakestoreapi.com/products');
      const fakeStoreData = await fakeStoreRes.json();
      
      const dummyProducts = dummyData.products.map(p => ({
        _id: `dj-${p.id}`,
        name: p.title,
        description: p.description,
        price: p.price,
        category: p.category.charAt(0).toUpperCase() + p.category.slice(1).replace('-', ' '),
        image: p.thumbnail || p.images[0] || 'https://via.placeholder.com/300',
        stockCount: p.stock,
        aisle: `${String.fromCharCode(65 + Math.floor(Math.random() * 8))}-${Math.floor(Math.random() * 20) + 1}`,
      }));

      const fakeStoreProducts = fakeStoreData.map(p => ({
        _id: `fs-${p.id}`,
        name: p.title,
        description: p.description,
        price: p.price,
        category: p.category.charAt(0).toUpperCase() + p.category.slice(1),
        image: p.image,
        stockCount: p.rating ? p.rating.count : 50,
        aisle: `${String.fromCharCode(65 + Math.floor(Math.random() * 8))}-${Math.floor(Math.random() * 20) + 1}`,
      }));

      // Combine local DB items + the 200+ external items
      const combined = [...localData, ...fakeStoreProducts, ...dummyProducts];
      return combined.sort(() => Math.random() - 0.5);
    } catch {
      // API BLOCKED BY NETWORK: Generating massive dataset locally to bypass firewall!
      const generatedMocks = generateMassiveMockData();
      return [...localData, ...generatedMocks].sort(() => Math.random() - 0.5);
    }
  },
  searchProducts: (query) => apiClient.get(`/products/search?query=${encodeURIComponent(query)}`),
  getProductById: (id) => apiClient.get(`/products/${id}`),
};
