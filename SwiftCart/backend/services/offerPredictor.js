/**
 * SwiftCart AI Offer Prediction Engine
 * ─────────────────────────────────────────────────────────────────
 * Uses a multi-factor scoring model combining:
 *   1. Association Rules      — "people buying X also want Y"
 *   2. Time-of-Day Patterns   — morning/lunch/evening/night deals
 *   3. Day-of-Week Signals    — weekday vs weekend behaviour
 *   4. Seasonal Factors       — month-based offers
 *   5. Confidence Scoring     — ranks offers by relevance (0-100%)
 */

const OFFERS = {
  ration: [
    {
      id: 'R001', title: 'Rice & Dal Combo Pack',
      originalPrice: 850,  offerPrice: 649,
      discount: 24, brand: 'India Gate', qty: '5kg Rice + 1kg Dal',
      img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
      tags: ['staples', 'combo', 'bulk'],
      timeBoost:   { morning: 1.3, afternoon: 1.0, evening: 1.2, night: 0.8 },
      dayBoost:    { weekday: 1.2, weekend: 1.0 },
      monthBoost:  [1.0, 1.0, 1.0, 1.2, 1.1, 1.0, 1.3, 1.3, 1.1, 1.2, 1.0, 1.4],
      description: 'Premium basmati rice with toor dal. Best-seller grocery bundle.',
    },
    {
      id: 'R002', title: 'Cooking Oil Bonanza',
      originalPrice: 320,  offerPrice: 229,
      discount: 28, brand: 'Fortune', qty: '1L Sunflower Oil',
      img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80',
      tags: ['oil', 'cooking', 'daily'],
      timeBoost:   { morning: 1.2, afternoon: 1.0, evening: 1.3, night: 0.9 },
      dayBoost:    { weekday: 1.1, weekend: 1.2 },
      monthBoost:  [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.1, 1.1, 1.0, 1.0, 1.0, 1.2],
      description: 'Light and healthy sunflower oil, perfect for everyday cooking.',
    },
    {
      id: 'R003', title: 'Breakfast Super Saver',
      originalPrice: 480,  offerPrice: 349,
      discount: 27, brand: 'Aashirvaad', qty: 'Atta 5kg + Poha 1kg',
      img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80',
      tags: ['breakfast', 'wheat', 'morning', 'staples'],
      timeBoost:   { morning: 1.5, afternoon: 0.9, evening: 1.0, night: 0.7 },
      dayBoost:    { weekday: 1.3, weekend: 1.1 },
      monthBoost:  [1.1, 1.1, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.1, 1.1, 1.0, 1.2],
      description: 'Start your day right. Whole wheat atta with light poha combo.',
    },
    {
      id: 'R004', title: 'Dairy Daily Pack',
      originalPrice: 210,  offerPrice: 159,
      discount: 24, brand: 'Amul', qty: 'Milk 2L + Butter 200g',
      img: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&q=80',
      tags: ['dairy', 'milk', 'daily', 'breakfast'],
      timeBoost:   { morning: 1.6, afternoon: 0.9, evening: 1.1, night: 0.8 },
      dayBoost:    { weekday: 1.2, weekend: 1.1 },
      monthBoost:  [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
      description: 'Fresh Amul full cream milk + golden butter — morning essentials.',
    },
    {
      id: 'R005', title: 'Ferrero Rocher Festive Box',
      originalPrice: 899,  offerPrice: 699,
      discount: 22, brand: 'Ferrero Rocher', qty: 'Box of 24 Chocolates',
      img: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&q=80',
      tags: ['snacks', 'luxury', 'chocolates'],
      timeBoost:   { morning: 0.9, afternoon: 1.2, evening: 1.5, night: 1.4 },
      dayBoost:    { weekday: 1.0, weekend: 1.5 },
      monthBoost:  [1.2, 1.2, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.3, 1.5, 1.5, 1.8],
      description: 'Amazon Bestseller: Whole hazelnut pralines in luxury gold foil gift box.',
    },
    {
      id: 'R006', title: 'Cadbury Dairy Milk Silk Hamper',
      originalPrice: 500,  offerPrice: 379,
      discount: 24, brand: 'Cadbury', qty: 'Pack of 3 Bars (Roasted Almond + Fruit & Nut)',
      img: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400&q=80',
      tags: ['snacks', 'sweet', 'chocolates'],
      timeBoost:   { morning: 0.8, afternoon: 1.2, evening: 1.4, night: 1.6 },
      dayBoost:    { weekday: 1.1, weekend: 1.4 },
      monthBoost:  [1.1, 1.1, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.2, 1.4, 1.4, 1.6],
      description: 'Silky smooth indulgence with roasted almond chunks. Super saver 3-pack.',
    },
    {
      id: 'R007', title: 'Instant Noodles Party Pack',
      originalPrice: 180,  offerPrice: 129,
      discount: 28, brand: 'Maggi', qty: '12-Pack Maggi Noodles',
      img: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400&q=80',
      tags: ['snacks', 'instant', 'kids'],
      timeBoost:   { morning: 0.8, afternoon: 1.2, evening: 1.3, night: 1.7 },
      dayBoost:    { weekday: 1.0, weekend: 1.4 },
      monthBoost:  [1.0, 1.0, 1.0, 1.0, 1.1, 1.2, 1.2, 1.1, 1.0, 1.0, 1.0, 1.1],
      description: 'Stock up on India favourite instant noodles — family pack at a steal deal.',
    },
    {
      id: 'R008', title: 'Premium Whole Wheat Atta 10kg',
      originalPrice: 520, offerPrice: 449,
      discount: 14, brand: 'Aashirvaad', qty: '10kg Bag',
      img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80',
      tags: ['staples', 'cooking', 'wheat'],
      timeBoost:   { morning: 1.3, afternoon: 1.0, evening: 1.2, night: 0.8 },
      dayBoost:    { weekday: 1.2, weekend: 1.1 },
      monthBoost:  [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
      description: '100% whole wheat chakki atta for soft, fluffy rotis every day.',
    },
  ],

  clothing: [
    {
      id: 'C001', title: 'Nike Air Jordan 1 Retro Flash Sale',
      originalPrice: 16995, offerPrice: 12995,
      discount: 24, brand: 'Nike', qty: '1 Pair High Tops',
      img: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&q=80',
      tags: ['sports', 'casual', 'footwear', 'sneakers'],
      timeBoost:   { morning: 1.0, afternoon: 1.3, evening: 1.6, night: 1.4 },
      dayBoost:    { weekday: 1.0, weekend: 1.6 },
      monthBoost:  [1.2, 1.2, 1.1, 1.0, 1.0, 1.0, 1.1, 1.1, 1.2, 1.3, 1.3, 1.4],
      description: 'Flipkart Sneakerhead Drop: Iconic Royal Blue Air Jordans with encapsulated Air-Sole.',
    },
    {
      id: 'C002', title: "Levi's 511 Slim Fit Stretch Denim",
      originalPrice: 2899, offerPrice: 1799,
      discount: 38, brand: "Levi's", qty: 'Dark Wash Slim Jeans',
      img: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=400&q=80',
      tags: ['casual', 'denim', 'formal'],
      timeBoost:   { morning: 0.9, afternoon: 1.2, evening: 1.4, night: 1.1 },
      dayBoost:    { weekday: 1.1, weekend: 1.5 },
      monthBoost:  [1.2, 1.0, 1.0, 1.0, 1.0, 1.0, 1.2, 1.2, 1.3, 1.3, 1.1, 1.1],
      description: 'Amazon Bestseller: Signature 511 Slim Jeans with all-day flexible stretch comfort.',
    },
    {
      id: 'C003', title: 'Puma Smash V2 Leather Sneakers',
      originalPrice: 3499, offerPrice: 1999,
      discount: 43, brand: 'Puma', qty: 'Classic White & Black',
      img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80',
      tags: ['casual', 'sports', 'footwear'],
      timeBoost:   { morning: 1.2, afternoon: 1.2, evening: 1.4, night: 1.1 },
      dayBoost:    { weekday: 1.1, weekend: 1.5 },
      monthBoost:  [1.1, 1.1, 1.1, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
      description: 'Clean court-inspired white leather sneakers with cushioned SoftFoam+ sockliner.',
    },
    {
      id: 'C004', title: 'Ray-Ban Polarized Aviator Sunglasses',
      originalPrice: 9290, offerPrice: 6499,
      discount: 30, brand: 'Ray-Ban', qty: 'Gold Frame / Green Lens',
      img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80',
      tags: ['casual', 'formal', 'accessories'],
      timeBoost:   { morning: 1.4, afternoon: 1.5, evening: 1.1, night: 0.7 },
      dayBoost:    { weekday: 1.0, weekend: 1.5 },
      monthBoost:  [1.0, 1.0, 1.4, 1.6, 1.6, 1.4, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
      description: 'Timeless luxury aviators with 100% UV polarized crystal lenses.',
    },
    {
      id: 'C005', title: 'Summer Cotton Kurta Set',
      originalPrice: 1499, offerPrice: 899,
      discount: 40, brand: 'Fabindia', qty: 'Set of 2 Breathable Kurtas',
      img: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400&q=80',
      tags: ['ethnic', 'cotton', 'summer'],
      timeBoost:   { morning: 1.1, afternoon: 1.3, evening: 1.2, night: 0.9 },
      dayBoost:    { weekday: 1.0, weekend: 1.5 },
      monthBoost:  [1.0, 1.0, 1.2, 1.5, 1.5, 1.1, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
      description: 'Lightweight handloom cotton kurtas designed for comfort & festive elegance.',
    },
    {
      id: 'C006', title: 'Allen Solly Slim Formal Shirt Pack',
      originalPrice: 2199, offerPrice: 1299,
      discount: 41, brand: 'Allen Solly', qty: 'Pack of 2 (Blue & White)',
      img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80',
      tags: ['formal', 'office', 'cotton'],
      timeBoost:   { morning: 1.5, afternoon: 1.1, evening: 1.0, night: 0.8 },
      dayBoost:    { weekday: 1.6, weekend: 0.9 },
      monthBoost:  [1.2, 1.2, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.2, 1.3, 1.1, 1.0],
      description: 'Wrinkle-resistant pinpoint oxford cotton shirts for executive workwear.',
    },
  ],

  electronics: [
    {
      id: 'E001', title: 'Apple iPhone 15 Pro Festival Deal',
      originalPrice: 129900, offerPrice: 114999,
      discount: 11, brand: 'Apple', qty: '128GB Natural Titanium',
      img: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80',
      tags: ['mobiles', 'flagship', 'wireless'],
      timeBoost:   { morning: 1.1, afternoon: 1.3, evening: 1.6, night: 1.5 },
      dayBoost:    { weekday: 1.1, weekend: 1.5 },
      monthBoost:  [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.2, 1.2, 1.5, 1.6, 1.6, 1.8],
      description: 'Flipkart Big Billion Deal: A17 Pro chip, aerospace titanium, 48MP Pro camera + No Cost EMI.',
    },
    {
      id: 'E002', title: 'Samsung Galaxy S24 Ultra 5G AI Offer',
      originalPrice: 129999, offerPrice: 112999,
      discount: 13, brand: 'Samsung', qty: '256GB Titanium Gray',
      img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80',
      tags: ['mobiles', 'gaming', 'flagship'],
      timeBoost:   { morning: 1.1, afternoon: 1.2, evening: 1.5, night: 1.4 },
      dayBoost:    { weekday: 1.1, weekend: 1.4 },
      monthBoost:  [1.1, 1.1, 1.1, 1.0, 1.0, 1.0, 1.1, 1.1, 1.3, 1.4, 1.4, 1.5],
      description: 'Amazon Great Indian Deal: 200MP camera with Galaxy AI & S-Pen included free.',
    },
    {
      id: 'E003', title: 'Apple MacBook Air M2 Mega Sale',
      originalPrice: 89900, offerPrice: 76990,
      discount: 14, brand: 'Apple', qty: '13.6-inch Starlight (256GB)',
      img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
      tags: ['laptops', 'work', 'audio'],
      timeBoost:   { morning: 1.3, afternoon: 1.4, evening: 1.3, night: 1.0 },
      dayBoost:    { weekday: 1.4, weekend: 1.1 },
      monthBoost:  [1.2, 1.1, 1.0, 1.0, 1.0, 1.4, 1.5, 1.3, 1.1, 1.1, 1.2, 1.3],
      description: 'Liquid Retina display, 18H battery life, thin & lightweight design for creators.',
    },
    {
      id: 'E004', title: 'Sony WH-1000XM5 Lightning Deal',
      originalPrice: 29990, offerPrice: 23990,
      discount: 20, brand: 'Sony', qty: 'Industry Leading ANC Headphones',
      img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
      tags: ['audio', 'wireless', 'gaming'],
      timeBoost:   { morning: 1.1, afternoon: 1.2, evening: 1.5, night: 1.6 },
      dayBoost:    { weekday: 1.1, weekend: 1.5 },
      monthBoost:  [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.1, 1.1, 1.3, 1.4, 1.4, 1.5],
      description: 'Dual-processor noise cancellation, 30H battery, speak-to-chat smart technology.',
    },
    {
      id: 'E005', title: 'Apple AirPods Pro (2nd Gen) USB-C',
      originalPrice: 24900, offerPrice: 19999,
      discount: 20, brand: 'Apple', qty: 'With MagSafe USB-C Case',
      img: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&q=80',
      tags: ['audio', 'wireless', 'mobiles'],
      timeBoost:   { morning: 1.2, afternoon: 1.3, evening: 1.5, night: 1.4 },
      dayBoost:    { weekday: 1.1, weekend: 1.5 },
      monthBoost:  [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.1, 1.2, 1.4, 1.5, 1.5, 1.6],
      description: '2x more Active Noise Cancellation + Adaptive Audio and Personalized Spatial Audio.',
    },
    {
      id: 'E006', title: 'boAt Airdopes 141 Flash Deal',
      originalPrice: 2999, offerPrice: 999,
      discount: 67, brand: 'boAt', qty: 'Airdopes 141 TWS Earbuds',
      img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80',
      tags: ['audio', 'wireless', 'gaming'],
      timeBoost:   { morning: 1.0, afternoon: 1.3, evening: 1.5, night: 1.4 },
      dayBoost:    { weekday: 1.1, weekend: 1.5 },
      monthBoost:  [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.5, 1.5, 1.0, 1.0, 1.5, 1.5],
      description: '42H battery life, Beast Mode low latency, ENx noise cancellation for calls.',
    },
    {
      id: 'E007', title: 'Apple Watch Series 9 GPS 45mm',
      originalPrice: 44900, offerPrice: 36999,
      discount: 18, brand: 'Apple', qty: 'Midnight Aluminium Case',
      img: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&q=80',
      tags: ['wireless', 'sports', 'audio'],
      timeBoost:   { morning: 1.5, afternoon: 1.1, evening: 1.3, night: 1.0 },
      dayBoost:    { weekday: 1.2, weekend: 1.4 },
      monthBoost:  [1.3, 1.2, 1.1, 1.0, 1.0, 1.0, 1.1, 1.1, 1.2, 1.3, 1.3, 1.5],
      description: 'S9 chip, innovative Double Tap gesture, brighter display and health sensor tracking.',
    },
  ],

  all: [],
};

// Populate "all" dynamically
OFFERS.all = [...OFFERS.ration, ...OFFERS.clothing, ...OFFERS.electronics];

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 21) return 'evening';
  return 'night';
}

function getDayType() {
  const d = new Date().getDay();
  return (d === 0 || d === 6) ? 'weekend' : 'weekday';
}

function getMonth() {
  return new Date().getMonth();
}

const ASSOCIATIONS = {
  'staples':    ['cooking', 'dairy', 'spices', 'breakfast'],
  'breakfast':  ['dairy', 'morning', 'staples'],
  'ethnic':     ['festive', 'cotton', 'summer'],
  'sports':     ['active', 'footwear', 'sneakers'],
  'formal':     ['office', 'cotton'],
  'casual':     ['denim', 'sneakers', 'footwear'],
  'audio':      ['wireless', 'gaming', 'mobiles'],
  'mobiles':    ['wireless', 'audio', 'flagship'],
};

function associationBoost(offer, inputTags = []) {
  let boost = 0;
  for (const tag of inputTags) {
    const assocs = ASSOCIATIONS[tag] || [];
    for (const a of assocs) {
      if (offer.tags && offer.tags.includes(a)) boost += 0.15;
    }
    if (offer.tags && offer.tags.includes(tag)) boost += 0.3;
  }
  return Math.min(boost, 0.6);
}

function predictOffers(category = 'all', preferences = [], limit = 6) {
  const time    = getTimeOfDay();
  const dayType = getDayType();
  const month   = getMonth();

  const pool = OFFERS[category] || OFFERS.all;

  const scored = pool.map(offer => {
    let score = (offer.discount || 20) / 100;

    if (offer.timeBoost && offer.timeBoost[time]) {
      score *= offer.timeBoost[time];
    }
    if (offer.dayBoost && offer.dayBoost[dayType]) {
      score *= offer.dayBoost[dayType];
    }
    if (offer.monthBoost && offer.monthBoost[month]) {
      score *= offer.monthBoost[month];
    }

    score += associationBoost(offer, preferences);

    return {
      ...offer,
      score:      +score.toFixed(4),
      confidence: Math.min(Math.round(score * 100), 99),
      timeOfDay:  time,
      dayType,
      savingsAmt: offer.originalPrice - offer.offerPrice,
      aiReason:   buildReason(offer, time, dayType, preferences),
    };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function buildReason(offer, time, dayType, prefs = []) {
  const reasons = [];
  if (offer.timeBoost && offer.timeBoost[time] > 1.1) {
    reasons.push(`🕐 Peak ${time} deal`);
  }
  if (offer.dayBoost && offer.dayBoost[dayType] > 1.2) {
    reasons.push(`📅 ${dayType === 'weekend' ? 'Weekend' : 'Weekday'} special`);
  }
  if (offer.discount >= 30) {
    reasons.push(`🔥 Mega ${offer.discount}% off`);
  }
  if (prefs.some(p => offer.tags && offer.tags.includes(p))) {
    reasons.push('⭐ Matches your preference');
  }
  if (reasons.length === 0) {
    reasons.push('💡 AI recommended for you');
  }
  return reasons.join(' · ');
}

function addOffer(category, offer) {
  if (!OFFERS[category]) {
    throw new Error('Invalid category. Must be ration, clothing, or electronics');
  }
  if (!offer.id) {
    offer.id = `A${Date.now().toString().slice(-4)}${Math.random().toString(36).substring(2, 5)}`;
  }
  OFFERS[category].unshift(offer);
  OFFERS.all = [...OFFERS.ration, ...OFFERS.clothing, ...OFFERS.electronics];
  return offer;
}

module.exports = { predictOffers, getTimeOfDay, getDayType, addOffer, OFFERS };
