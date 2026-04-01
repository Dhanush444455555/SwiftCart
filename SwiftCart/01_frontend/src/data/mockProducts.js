const adjectives = ['Premium', 'Wireless', 'Smart', 'Ergonomic', 'Minimalist', 'Eco-friendly', 'Heavy-duty', 'Portable', 'Luxury', 'Classic'];
const nouns = ['Headphones', 'Speaker', 'Monitor', 'Keyboard', 'Watch', 'Backpack', 'Jacket', 'Sunglasses', 'Coffee Maker', 'Desk Lamp'];
const categories = ['Electronics', 'Accessories', 'Apparel', 'Home', 'Office'];
const imagePool = [
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
  'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80',
  'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80',
  'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=500&q=80',
  'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80',
  'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&q=80'
];

export const generateMassiveMockData = () => {
  const products = [];
  for (let i = 1; i <= 100; i++) {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    products.push({
      _id: `mock-fp-${i}`,
      name: `${adj} ${noun}`,
      description: `High quality, best in class ${noun.toLowerCase()} designed for modern lifestyles.`,
      price: Math.floor(Math.random() * 5000) + 99,
      category: categories[Math.floor(Math.random() * categories.length)],
      image: imagePool[Math.floor(Math.random() * imagePool.length)],
      stockCount: Math.floor(Math.random() * 200) + 10,
      aisle: `${String.fromCharCode(65 + Math.floor(Math.random() * 8))}-${Math.floor(Math.random() * 20) + 1}`,
    });
  }
  return products;
};
