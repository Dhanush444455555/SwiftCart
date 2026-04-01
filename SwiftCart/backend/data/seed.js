const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/swiftcart');
    console.log('MongoDB Connected to seed data');

    await Product.deleteMany();
    console.log('Cleared existing products');

    console.log('Fetching massive dataset from DummyJSON API...');
    
    // Fetch 100 products from DummyJSON
    const response = await fetch('https://dummyjson.com/products?limit=100');
    const data = await response.json();
    
    // Map DummyJSON products to match our Product schema
    const formattedProducts = data.products.map(p => ({
      name: p.title,
      description: p.description,
      price: p.price,
      // Map basic DummyJSON categories, capitalize first letter
      category: p.category.charAt(0).toUpperCase() + p.category.slice(1).replace('-', ' '),
      // DummyJSON provides multiple images, grab the thumbnail or first string
      image: p.thumbnail || p.images[0] || 'https://via.placeholder.com/300',
      stockCount: p.stock,
      // Randomly assign a mock store aisle for navigation feature
      aisle: `${String.fromCharCode(65 + Math.floor(Math.random() * 8))}-${Math.floor(Math.random() * 20) + 1}`,
    }));

    await Product.insertMany(formattedProducts);
    console.log(`Successfully seeded ${formattedProducts.length} rich products!`);

    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
