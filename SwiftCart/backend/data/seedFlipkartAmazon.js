/**
 * seedFlipkartAmazon.js — Seeds rich, realistic Flipkart & Amazon style products into MySQL swiftcart DB.
 */
const pool = require('../db');
const dotenv = require('dotenv');
dotenv.config();

const PRODUCTS = [
  // ── MOBILES & TABLETS ──
  {
    name: 'Apple iPhone 15 Pro (128 GB) - Natural Titanium',
    description: 'Forged in titanium with A17 Pro chip, customizable Action button, and 48MP main camera system with 3x Telephoto.',
    price: 129900,
    category: 'Mobiles',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80',
    stockCount: 45,
    qrCode: 'QR-IPHONE15PRO-01',
    aisle: 'E-01'
  },
  {
    name: 'Apple iPhone 15 (128 GB) - Midnight Black',
    description: 'Dynamic Island, 48MP Main Camera, durable color-infused glass and aluminum design with USB-C.',
    price: 69999,
    category: 'Mobiles',
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&q=80',
    stockCount: 80,
    qrCode: 'QR-IPHONE15-02',
    aisle: 'E-01'
  },
  {
    name: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)',
    description: 'Galaxy AI with Circle to Search, 200MP Camera with ProVisual Engine, Snapdragon 8 Gen 3 with Built-in S-Pen.',
    price: 129999,
    category: 'Mobiles',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80',
    stockCount: 35,
    qrCode: 'QR-S24ULTRA-03',
    aisle: 'E-02'
  },
  {
    name: 'Samsung Galaxy S23 FE 5G (Mint, 128 GB)',
    description: 'Dynamic AMOLED 2X 120Hz display, 50MP pro-grade camera, long-lasting 4500mAh battery with super fast charging.',
    price: 37999,
    category: 'Mobiles',
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80',
    stockCount: 60,
    qrCode: 'QR-S23FE-04',
    aisle: 'E-02'
  },
  {
    name: 'OnePlus 12 5G (Flowy Emerald, 16GB RAM, 512GB)',
    description: 'Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera System, 5400 mAh Battery with 100W SUPERVOOC charging.',
    price: 69999,
    category: 'Mobiles',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80',
    stockCount: 50,
    qrCode: 'QR-OP12-05',
    aisle: 'E-03'
  },
  {
    name: 'OnePlus Nord CE 4 5G (Celadon Marble, 8GB RAM, 128GB)',
    description: 'Snapdragon 7 Gen 3, 100W SUPERVOOC, 50MP Sony LYT-600 with OIS, 120Hz Fluid AMOLED display.',
    price: 24999,
    category: 'Mobiles',
    image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80',
    stockCount: 90,
    qrCode: 'QR-OPCE4-06',
    aisle: 'E-03'
  },
  {
    name: 'Redmi Note 13 Pro+ 5G (Fusion Purple, 256 GB)',
    description: 'World 1st 200MP Camera with OIS, 3D Curved AMOLED 120Hz Display, 120W HyperCharge, IP68 rated.',
    price: 29999,
    category: 'Mobiles',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
    stockCount: 75,
    qrCode: 'QR-REDMI13PRO-07',
    aisle: 'E-04'
  },
  {
    name: 'Apple iPad Air 11-inch M2 chip (Wi-Fi, 128GB) - Space Grey',
    description: 'Liquid Retina display with P3 wide color, blazing fast Apple M2 chip, Landscape 12MP Ultra Wide front camera.',
    price: 59900,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
    stockCount: 30,
    qrCode: 'QR-IPADAIR-08',
    aisle: 'E-05'
  },

  // ── LAPTOPS & COMPUTERS ──
  {
    name: 'Apple MacBook Air M2 (13.6-inch, 8GB RAM, 256GB SSD) - Starlight',
    description: 'Liquid Retina Display, 18 hours battery life, 1080p FaceTime HD camera, Backlit Magic Keyboard with Touch ID.',
    price: 89900,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
    stockCount: 25,
    qrCode: 'QR-MACBOOKAIR-09',
    aisle: 'L-01'
  },
  {
    name: 'Apple MacBook Pro 14-inch M3 Pro (18GB, 512GB SSD) - Space Black',
    description: 'Liquid Retina XDR display, up to 22 hours of battery life, pro connectivity with HDMI and SDXC card slot.',
    price: 189900,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&q=80',
    stockCount: 15,
    qrCode: 'QR-MACBOOKPRO-10',
    aisle: 'L-01'
  },
  {
    name: 'HP Pavilion 15 (13th Gen Intel Core i5, 16GB RAM, 512GB SSD) - Natural Silver',
    description: 'FHD IPS Micro-Edge display, Audio by B&O, Backlit Keyboard, Fast Charging (50% in 45 mins), Windows 11 Home.',
    price: 62990,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80',
    stockCount: 40,
    qrCode: 'QR-HPPAV-11',
    aisle: 'L-02'
  },
  {
    name: 'ASUS TUF Gaming F15 (Core i7 12th Gen, RTX 4060, 16GB, 512GB SSD)',
    description: '144Hz FHD Gaming Display, MUX Switch + NVIDIA Advanced Optimus, Military-Grade Durability standard.',
    price: 87990,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80',
    stockCount: 20,
    qrCode: 'QR-ASUSTUF-12',
    aisle: 'L-03'
  },

  // ── AUDIO & WEARABLES ──
  {
    name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones - Black',
    description: 'Two processors and 8 microphones for unprecedented noise cancellation, 30-hour battery life with ultra-comfort fit.',
    price: 29990,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    stockCount: 50,
    qrCode: 'QR-SONYXM5-13',
    aisle: 'A-01'
  },
  {
    name: 'Apple AirPods Pro (2nd Gen) with MagSafe Case (USB-C)',
    description: 'Up to 2x more Active Noise Cancellation, Transparency mode, Adaptive Audio and Personalized Spatial Audio.',
    price: 20999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&q=80',
    stockCount: 65,
    qrCode: 'QR-AIRPODSPRO-14',
    aisle: 'A-02'
  },
  {
    name: 'boAt Airdopes 141 True Wireless Earbuds - Bold Black',
    description: '42H Playtime, Beast Mode for Low Latency Gaming, ENx Tech for clear calls, ASAP Charge 5 mins = 75 mins.',
    price: 1299,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
    stockCount: 150,
    qrCode: 'QR-BOATAIR-15',
    aisle: 'A-03'
  },
  {
    name: 'Apple Watch Series 9 GPS 45mm - Midnight Aluminium',
    description: 'S9 SiP chip, magical new Double Tap gesture, brighter display, and powerful health and fitness tracking.',
    price: 41900,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80',
    stockCount: 30,
    qrCode: 'QR-AWATCH9-16',
    aisle: 'A-04'
  },
  {
    name: 'Noise ColorFit Pulse 4 Max 1.96" AMOLED Smart Watch - Jet Black',
    description: 'Curved AMOLED Display with 600 nits brightness, Bluetooth Calling, 100+ Sports Modes, 7-Day Battery.',
    price: 2499,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    stockCount: 110,
    qrCode: 'QR-NOISEP4-17',
    aisle: 'A-05'
  },

  // ── FASHION & FOOTWEAR ──
  {
    name: 'Nike Air Jordan 1 Retro High OG - Royal Blue & White',
    description: 'Legendary basketball heritage with premium leather upper, encapsulated Air-Sole unit and iconic Wings logo.',
    price: 16995,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80',
    stockCount: 25,
    qrCode: 'QR-JORDAN1-18',
    aisle: 'F-01'
  },
  {
    name: 'Puma Smash V2 Leather Sneakers - White & Black',
    description: 'Clean court-inspired silhouette, soft synthetic leather upper, padded collar and durable rubber outsole.',
    price: 2799,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
    stockCount: 80,
    qrCode: 'QR-PUMASMASH-19',
    aisle: 'F-02'
  },
  {
    name: "Levi's Men's 511 Slim Fit Stretchable Jeans - Dark Indigo",
    description: 'Modern slim fit with room to move, crafted from premium stretch denim with signature arcuate stitch pockets.',
    price: 2399,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=600&q=80',
    stockCount: 70,
    qrCode: 'QR-LEVIS511-20',
    aisle: 'F-03'
  },
  {
    name: "Allen Solly Men's Slim Fit Formal Cotton Shirt - Sky Blue",
    description: '100% Breathable cotton, semi-cutaway collar, button cuffs, wrinkle-resistant weave for sharp workwear.',
    price: 1499,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80',
    stockCount: 95,
    qrCode: 'QR-ALLENSHIRT-21',
    aisle: 'F-04'
  },
  {
    name: 'Ray-Ban Polarized Classic Aviator Sunglasses - Gold Frame / Green Lens',
    description: 'Timeless tear-drop shape, crystal polarized lenses with 100% UV protection and lightweight metal frame.',
    price: 9290,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80',
    stockCount: 40,
    qrCode: 'QR-RAYBANAV-22',
    aisle: 'F-05'
  },

  // ── HOME & KITCHEN APPLIANCES ──
  {
    name: 'Philips Digital Air Fryer HD9252/90 (4.1L, 1400W)',
    description: 'Rapid Air Technology for 90% less fat, touch screen with 7 presets, Keep Warm function, easy clean basket.',
    price: 7999,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&q=80',
    stockCount: 45,
    qrCode: 'QR-PHILIPSAIR-23',
    aisle: 'H-01'
  },
  {
    name: 'Prestige Iris 750W Mixer Grinder with 3 Stainless Steel Jars',
    description: 'Heavy duty 750W motor, 3 multi-purpose jars with transparent polycarbonate juicer jar and overload protector.',
    price: 2999,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80',
    stockCount: 65,
    qrCode: 'QR-PRESTIGEIRIS-24',
    aisle: 'H-02'
  },
  {
    name: 'Dyson V12 Detect Slim Total Clean Cordless Vacuum',
    description: 'Laser reveals invisible dust on hard floors, piezo sensor measures dust particles, up to 60 minutes run time.',
    price: 49900,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&q=80',
    stockCount: 18,
    qrCode: 'QR-DYSONV12-25',
    aisle: 'H-03'
  },
  {
    name: 'Kent Grand Plus RO + UV + UF Water Purifier (9 Litres)',
    description: 'In-tank UV disinfection, Mineral RO Technology retains essential minerals, high purification capacity 20L/hr.',
    price: 14999,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&q=80',
    stockCount: 30,
    qrCode: 'QR-KENTGRAND-26',
    aisle: 'H-04'
  },

  // ── GROCERIES & DAILY ESSENTIALS ──
  {
    name: 'Cadbury Dairy Milk Silk Roasted Almond 143g - Pack of 2',
    description: 'Velvety smooth milk chocolate loaded with whole roasted crunchy almonds. Irresistibly rich taste.',
    price: 350,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600&q=80',
    stockCount: 150,
    qrCode: 'QR-DAIRYMILKSILK-27',
    aisle: 'G-01'
  },
  {
    name: 'Ferrero Rocher Premium Hazelnut Chocolates - Box of 24 Pcs',
    description: 'Whole crunchy hazelnut in a delicious creamy filling, smooth milk chocolate coating and hazelnut pieces.',
    price: 899,
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&q=80',
    stockCount: 85,
    qrCode: 'QR-FERRERO24-28',
    aisle: 'G-01'
  },
  {
    name: 'Maggi 2-Minute Masala Instant Noodles (12-Pack Family Saver)',
    description: 'India favourite instant noodles made with quality spices and fortified with iron for the whole family.',
    price: 168,
    category: 'Grocery',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&q=80',
    stockCount: 200,
    qrCode: 'QR-MAGGI12-29',
    aisle: 'G-02'
  },
  {
    name: 'Nescafe Classic Pure Instant Coffee Powder 200g Glass Jar',
    description: '100% Pure natural coffee beans roasted to perfection, delivering rich aroma and signature bold flavor.',
    price: 540,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80',
    stockCount: 120,
    qrCode: 'QR-NESCAFE200-30',
    aisle: 'G-03'
  },
  {
    name: 'Tata Tea Gold Rich Assam Tea 1kg',
    description: 'Exquisite blend of strong CTC tea leaves with 15% gently rolled long leaves for rich aroma and golden color.',
    price: 490,
    category: 'Beverages',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=80',
    stockCount: 130,
    qrCode: 'QR-TATATEA-31',
    aisle: 'G-03'
  },
  {
    name: 'Nutella Hazelnut & Cocoa Spread 350g Jar',
    description: 'Creamy hazelnut spread with a hint of cocoa. Perfect companion for pancakes, waffles, and warm toast.',
    price: 340,
    category: 'Grocery',
    image: 'https://images.unsplash.com/photo-1570560258879-af7f8e1447ac?w=600&q=80',
    stockCount: 95,
    qrCode: 'QR-NUTELLA350-32',
    aisle: 'G-04'
  },
  {
    name: 'Fortune Sunlite Refined Sunflower Cooking Oil 5 Liter Can',
    description: 'Light, healthy and easy to digest edible cooking oil, enriched with Vitamin A and Vitamin D.',
    price: 699,
    category: 'Grocery',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80',
    stockCount: 70,
    qrCode: 'QR-FORTUNE5L-33',
    aisle: 'G-05'
  },
  {
    name: 'Aashirvaad Shudh Chakki Whole Wheat Atta 10kg Bag',
    description: '100% Whole wheat flour processed in traditional stone chakki to retain high dietary fiber and nutrient density.',
    price: 475,
    category: 'Grocery',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80',
    stockCount: 85,
    qrCode: 'QR-AASHIRVAAD10-34',
    aisle: 'G-05'
  },

  // ── BEAUTY & GROOMING ──
  {
    name: 'Philips Series 3000 Cordless Beard Trimmer (Lift & Trim)',
    description: 'DuraPower technology for 6x longer battery life, self-sharpening titanium blades, 20 lock-in length settings.',
    price: 1599,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=600&q=80',
    stockCount: 75,
    qrCode: 'QR-PHILIPSTRIM-35',
    aisle: 'B-01'
  },
  {
    name: 'The Ordinary Niacinamide 10% + Zinc 1% Face Serum 30ml',
    description: 'High-strength vitamin and mineral blemish formula that visibly targets blemishes and minimizes enlarged pores.',
    price: 600,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80',
    stockCount: 110,
    qrCode: 'QR-ORDINARYSERUM-36',
    aisle: 'B-02'
  },
  {
    name: 'Maybelline New York Super Stay Matte Ink Lipstick - Pioneer Red',
    description: 'Up to 16 hours of saturated liquid matte color with unique arrow applicator for precise application.',
    price: 549,
    category: 'Beauty',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&q=80',
    stockCount: 90,
    qrCode: 'QR-MAYBELLINELIP-37',
    aisle: 'B-03'
  }
];

async function seed() {
  console.log('Connecting to MySQL to insert Flipkart/Amazon curated products...');
  const conn = await pool.getConnection();
  console.log('✅ MySQL Connected');
  conn.release();

  // Insert or update each product by qr_code
  for (const p of PRODUCTS) {
    await pool.query(
      `INSERT INTO products (name, description, price, category, image, in_stock, stock_count, qr_code, aisle)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         description = VALUES(description),
         price = VALUES(price),
         category = VALUES(category),
         image = VALUES(image),
         in_stock = VALUES(in_stock),
         stock_count = VALUES(stock_count),
         aisle = VALUES(aisle)`,
      [
        p.name,
        p.description,
        p.price,
        p.category,
        p.image,
        p.stockCount > 0 ? 1 : 0,
        p.stockCount,
        p.qrCode,
        p.aisle
      ]
    );
  }

  const [rows] = await pool.query('SELECT COUNT(*) as total FROM products');
  console.log(`✅ Successfully seeded! Total products in database: ${rows[0].total}`);
  return rows[0].total;
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('❌ Seeding failed:', err.message);
      process.exit(1);
    });
}

module.exports = { PRODUCTS, seed };
