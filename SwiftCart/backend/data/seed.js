/**
 * seed.js — Seed the MySQL swiftcart database with products from DummyJSON.
 *
 * Run: node backend/data/seed.js
 *
 * Make sure to run initDb.js FIRST to create all tables.
 */
const dotenv  = require('dotenv');
dotenv.config({ path: require('path').join(__dirname, '..', '.env') });

const pool    = require('../db');
const Product = require('../models/Product');

const getAppCategory = (p) => {
  const cat   = p.category.toLowerCase();
  const title = p.title.toLowerCase();

  if (['laptops', 'smartphones', 'tablets', 'mobile-accessories'].includes(cat)) return 'Electronics';
  if (['beauty', 'fragrances', 'skin-care'].includes(cat))                        return 'Beauty';
  if (['home-decoration', 'furniture', 'kitchen-accessories'].includes(cat))      return 'Home';
  if (cat.includes('mens') || cat.includes('womens') || ['tops', 'sunglasses'].includes(cat)) return 'Clothing';
  if (['sports-accessories', 'motorcycle', 'vehicle'].includes(cat))              return 'Sports';

  if (cat === 'groceries') {
    if (/milk|cheese|butter|egg/i.test(title))                          return 'Dairy';
    if (/apple|banana|meat|fish|chicken|veg|fruit|lemon|kiwi|strawberry/i.test(title)) return 'Fresh';
    if (/water|juice|coffee|tea|soda/i.test(title))                     return 'Beverages';
    if (/chip|cookie|snack|chocolate|biscuit/i.test(title))             return 'Snacks';
    return 'Grocery';
  }
  return 'Health';
};

const hardcodedSnacks = [
  { name: 'Lays Classic Potato Chips',  description: 'Crispy and salty original flavor.',                                   price: 2.50, category: 'Snacks', image: 'https://images.unsplash.com/photo-1566478989037-e92383be31af?w=500&q=80', stockCount: 200, qrCode: `QR-S1-${Math.random().toString(36).substring(2, 9)}`, aisle: 'S-1' },
  { name: 'Doritos Nacho Cheese',       description: 'Bold cheese flavored tortilla chips.',                                price: 3.00, category: 'Snacks', image: 'https://images.unsplash.com/photo-1600952841320-1c62e56bfdc1?w=500&q=80', stockCount: 150, qrCode: `QR-S2-${Math.random().toString(36).substring(2, 9)}`, aisle: 'S-1' },
  { name: 'Oreo Original Cookies',      description: "Milk's favorite cookie.",                                             price: 4.20, category: 'Snacks', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&q=80', stockCount: 100, qrCode: `QR-S3-${Math.random().toString(36).substring(2, 9)}`, aisle: 'S-2' },
  { name: 'Snickers Candy Bar',         description: 'Packed with roasted peanuts, nougat, caramel, and milk chocolate.',  price: 1.50, category: 'Snacks', image: 'https://images.unsplash.com/photo-1621345484897-40f46c6595ee?w=500&q=80', stockCount: 300, qrCode: `QR-S4-${Math.random().toString(36).substring(2, 9)}`, aisle: 'S-3' },
];

const seedDB = async () => {
  try {
    // Test connection
    const conn = await pool.getConnection();
    console.log('✅ MySQL Connected');
    conn.release();

    console.log('🗑  Clearing existing products…');
    await Product.deleteAll();

    console.log('🌐 Fetching products from DummyJSON API…');
    const response = await fetch('https://dummyjson.com/products?limit=0');
    const data     = await response.json();

    const formatted = data.products.map(p => ({
      name:        p.title,
      description: p.description,
      price:       p.price,
      category:    getAppCategory(p),
      image:       p.thumbnail || p.images[0] || 'https://via.placeholder.com/300',
      stockCount:  p.stock,
      qrCode:      `QR-${p.id}-${Math.random().toString(36).substring(2, 9)}`,
      aisle:       `${String.fromCharCode(65 + Math.floor(Math.random() * 8))}-${Math.floor(Math.random() * 20) + 1}`,
    }));

    const finalProducts = [...formatted, ...hardcodedSnacks];

    console.log(`⬆️  Inserting ${finalProducts.length} products…`);
    await Product.insertMany(finalProducts);
    console.log(`✅ Seeded ${finalProducts.length} products successfully!`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seedDB();
