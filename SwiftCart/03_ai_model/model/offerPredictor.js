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

// ── Offer Database ──────────────────────────────────────────────
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
      tags: ['breakfast', 'wheat', 'morning'],
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
      tags: ['dairy', 'milk', 'daily'],
      timeBoost:   { morning: 1.6, afternoon: 0.9, evening: 1.1, night: 0.8 },
      dayBoost:    { weekday: 1.2, weekend: 1.1 },
      monthBoost:  [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
      description: 'Fresh Amul full cream milk + golden butter — morning essentials.',
    },
    {
      id: 'R005', title: 'Spice Masala Megapack',
      originalPrice: 390,  offerPrice: 279,
      discount: 29, brand: 'MDH', qty: 'Assorted Spices 8-pack',
      img: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=400&q=80',
      tags: ['spices', 'masala', 'cooking'],
      timeBoost:   { morning: 1.0, afternoon: 1.2, evening: 1.4, night: 1.0 },
      dayBoost:    { weekday: 1.0, weekend: 1.3 },
      monthBoost:  [1.1, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.1, 1.1, 1.2],
      description: 'Complete spice set for rich Indian cooking. 8 essential masalas.',
    },
    {
      id: 'R006', title: 'Instant Noodles Party Pack',
      originalPrice: 180,  offerPrice: 119,
      discount: 34, brand: 'Maggi', qty: '12-pack Maggi Noodles',
      img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&q=80',
      tags: ['snacks', 'instant', 'kids'],
      timeBoost:   { morning: 0.8, afternoon: 1.2, evening: 1.1, night: 1.5 },
      dayBoost:    { weekday: 1.0, weekend: 1.4 },
      monthBoost:  [1.0, 1.0, 1.0, 1.0, 1.1, 1.2, 1.2, 1.1, 1.0, 1.0, 1.0, 1.1],
      description: 'Stock up on Maggi noodles — family pack at a steal price.',
    },
    {
      id: 'R007', title: 'Premium Wheat Atta',
      originalPrice: 450, offerPrice: 380,
      discount: 15, brand: 'Aashirvaad', qty: '10kg',
      img: 'https://images.unsplash.com/photo-1596647952909-17bf929bdca5?w=400&q=80',
      tags: ['staples', 'wheat', 'cooking'],
      timeBoost:   { morning: 1.2, afternoon: 1.0, evening: 1.1, night: 0.9 },
      dayBoost:    { weekday: 1.1, weekend: 1.3 },
      monthBoost:  [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
      description: 'High-quality whole wheat atta for soft, fluffy rotis.',
    },
    {
      id: 'R008', title: 'Mixed Nuts Combo',
      originalPrice: 900, offerPrice: 650,
      discount: 27, brand: 'Nutty Gritties', qty: '500g',
      img: 'https://images.unsplash.com/photo-1599933560731-bf393664d6fb?w=400&q=80',
      tags: ['snacks', 'breakfast', 'staples'],
      timeBoost:   { morning: 1.5, afternoon: 1.1, evening: 1.2, night: 0.8 },
      dayBoost:    { weekday: 1.0, weekend: 1.4 },
      monthBoost:  [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.5, 1.5, 1.5, 1.5],
      description: 'Healthy mix of almonds, cashews, and walnuts.',
    },
  ],

  clothing: [
    {
      id: 'C001', title: 'Summer Kurta Collection',
      originalPrice: 1299, offerPrice: 799,
      discount: 38, brand: 'Fabindia', qty: 'Set of 2 Cotton Kurtas',
      img: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400&q=80',
      tags: ['summer', 'ethnic', 'cotton'],
      timeBoost:   { morning: 1.1, afternoon: 1.3, evening: 1.2, night: 0.9 },
      dayBoost:    { weekday: 1.0, weekend: 1.5 },
      monthBoost:  [1.0, 1.0, 1.2, 1.5, 1.5, 1.1, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
      description: 'Breathable cotton kurtas for the Indian summer. Pack of 2.',
    },
    {
      id: 'C002', title: 'Denim Jeans Rush Sale',
      originalPrice: 2499, offerPrice: 1299,
      discount: 48, brand: "Levi's", qty: 'Slim Fit Stretch Jeans',
      img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80',
      tags: ['denim', 'casual', 'western'],
      timeBoost:   { morning: 0.9, afternoon: 1.2, evening: 1.4, night: 1.1 },
      dayBoost:    { weekday: 1.0, weekend: 1.6 },
      monthBoost:  [1.2, 1.0, 1.0, 1.0, 1.0, 1.0, 1.2, 1.2, 1.3, 1.3, 1.1, 1.1],
      description: 'Premium stretch denim in classic blue. Slim fit, all-day comfort.',
    },
    {
      id: 'C003', title: 'Formal Shirt Fiesta',
      originalPrice: 1799, offerPrice: 999,
      discount: 44, brand: 'Van Heusen', qty: 'Pack of 2 Shirts',
      img: 'https://images.unsplash.com/photo-1598961942613-ba897716405b?w=400&q=80',
      tags: ['formal', 'office', 'men'],
      timeBoost:   { morning: 1.4, afternoon: 1.1, evening: 1.0, night: 0.8 },
      dayBoost:    { weekday: 1.5, weekend: 0.9 },
      monthBoost:  [1.3, 1.3, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.3, 1.3, 1.1, 1.0],
      description: 'Office-ready formal shirts. Non-iron, wrinkle-free, Pack of 2.',
    },
    {
      id: 'C004', title: 'Women Ethnic Wear Bonanza',
      originalPrice: 2999, offerPrice: 1699,
      discount: 43, brand: 'BIBA', qty: 'Anarkali Suit Set',
      img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80',
      tags: ['ethnic', 'women', 'festive'],
      timeBoost:   { morning: 1.0, afternoon: 1.3, evening: 1.5, night: 1.2 },
      dayBoost:    { weekday: 1.0, weekend: 1.7 },
      monthBoost:  [1.0, 1.0, 1.0, 1.2, 1.0, 1.0, 1.0, 1.0, 1.0, 1.5, 1.5, 1.3],
      description: 'Elegant Anarkali suit with dupatta. Perfect for festivals and family occasions.',
    },
    {
      id: 'C005', title: 'Sports Activewear Combo',
      originalPrice: 3499, offerPrice: 1999,
      discount: 43, brand: 'Puma', qty: 'T-Shirt + Track Pants',
      img: 'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=400&q=80',
      tags: ['sports', 'gym', 'active'],
      timeBoost:   { morning: 1.6, afternoon: 1.1, evening: 1.3, night: 0.8 },
      dayBoost:    { weekday: 1.2, weekend: 1.4 },
      monthBoost:  [1.3, 1.3, 1.2, 1.1, 1.0, 1.0, 1.0, 1.0, 1.1, 1.1, 1.1, 1.0],
      description: 'Moisture-wicking activewear for your workout sessions.',
    },
    {
      id: 'C006', title: 'Kids School Uniform Set',
      originalPrice: 1199, offerPrice: 699,
      discount: 42, brand: 'Raymond', qty: 'Shirt + Trousers + Belt',
      img: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&q=80',
      tags: ['kids', 'school', 'uniform'],
      timeBoost:   { morning: 1.3, afternoon: 1.0, evening: 1.1, night: 0.7 },
      dayBoost:    { weekday: 1.4, weekend: 0.8 },
      monthBoost:  [1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.5, 1.0, 1.0, 1.0, 1.0, 1.0],
      description: 'Complete school uniform set — shirt, trousers, and belt. Durable fabric.',
    },
    {
      id: 'C007', title: 'Classic Polo T-Shirt',
      originalPrice: 1599, offerPrice: 899,
      discount: 43, brand: 'US Polo Assn', qty: '1 T-Shirt',
      img: 'https://images.unsplash.com/photo-1522026132410-b986cc08d88e?w=400&q=80',
      tags: ['casual', 'men', 'western'],
      timeBoost:   { morning: 1.0, afternoon: 1.2, evening: 1.3, night: 1.0 },
      dayBoost:    { weekday: 1.0, weekend: 1.5 },
      monthBoost:  [1.0, 1.0, 1.2, 1.2, 1.2, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
      description: 'Comfortable and stylish polo t-shirt for casual outings.',
    },
    {
      id: 'C008', title: 'Running Shoes',
      originalPrice: 4999, offerPrice: 2499,
      discount: 50, brand: 'Nike', qty: '1 Pair',
      img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
      tags: ['sports', 'active', 'men'],
      timeBoost:   { morning: 1.8, afternoon: 1.0, evening: 1.5, night: 0.8 },
      dayBoost:    { weekday: 1.2, weekend: 1.6 },
      monthBoost:  [1.1, 1.1, 1.1, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0],
      description: 'Lightweight running shoes with responsive cushioning.',
    },
  ],

  electronics: [
    {
      id: 'E001', title: 'Earbuds Flash Deal',
      originalPrice: 2999, offerPrice: 999,
      discount: 67, brand: 'boAt', qty: 'Airdopes 141 TWS',
      img: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400&q=80',
      tags: ['audio', 'wireless', 'earbuds'],
      timeBoost:   { morning: 1.0, afternoon: 1.3, evening: 1.5, night: 1.4 },
      dayBoost:    { weekday: 1.1, weekend: 1.5 },
      monthBoost:  [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.5, 1.5, 1.0, 1.0, 1.5, 1.5],
      description: '40H battery life, ENx noise cancellation. Best budget TWS earbuds.',
    },
    {
      id: 'E002', title: 'Noise Cancelling Headphones',
      originalPrice: 14999, offerPrice: 9999,
      discount: 33, brand: 'Sony', qty: 'WH-1000XM4',
      img: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80',
      tags: ['audio', 'wireless'],
      timeBoost:   { morning: 1.1, afternoon: 1.1, evening: 1.3, night: 1.5 },
      dayBoost:    { weekday: 1.0, weekend: 1.4 },
      monthBoost:  [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.2, 1.2, 1.5],
      description: 'Industry-leading noise cancellation and premium sound.',
    },
    {
      id: 'E003', title: 'Smart Fitness Watch',
      originalPrice: 5999, offerPrice: 2999,
      discount: 50, brand: 'Amazfit', qty: 'GTS 2 Mini',
      img: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&q=80',
      tags: ['gadgets', 'fitness', 'wireless', 'accessories'],
      timeBoost:   { morning: 1.6, afternoon: 1.0, evening: 1.2, night: 0.9 },
      dayBoost:    { weekday: 1.2, weekend: 1.5 },
      monthBoost:  [1.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.2],
      description: 'Track your health and fitness metrics round the clock.',
    },
    {
      id: 'E004', title: 'Gaming Mouse',
      originalPrice: 2499, offerPrice: 1499,
      discount: 40, brand: 'Logitech', qty: 'G502 Hero',
      img: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&q=80',
      tags: ['gaming', 'accessories'],
      timeBoost:   { morning: 0.8, afternoon: 1.1, evening: 1.4, night: 1.8 },
      dayBoost:    { weekday: 1.0, weekend: 1.6 },
      monthBoost:  [1.0, 1.0, 1.0, 1.0, 1.0, 1.5, 1.5, 1.0, 1.0, 1.0, 1.0, 1.2],
      description: 'High-performance gaming mouse with programmable buttons.',
    },
  ],

  all: [], // populated dynamically
};

// All category pool
OFFERS.all = [...OFFERS.ration, ...OFFERS.clothing, ...OFFERS.electronics];

// ── Time-of-Day helper ──────────────────────────────────────────
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
  return new Date().getMonth(); // 0-indexed
}

// ── Association Rules ────────────────────────────────────────────
const ASSOCIATIONS = {
  'staples':    ['cooking', 'dairy', 'spices'],
  'breakfast':  ['dairy', 'morning'],
  'ethnic':     ['festive', 'women'],
  'sports':     ['gym', 'active'],
  'formal':     ['office', 'men'],
  'casual':     ['western', 'denim'],
};

function associationBoost(offer, inputTags) {
  let boost = 0;
  for (const tag of inputTags) {
    const assocs = ASSOCIATIONS[tag] || [];
    for (const a of assocs) {
      if (offer.tags.includes(a)) boost += 0.15;
    }
    if (offer.tags.includes(tag)) boost += 0.3;
  }
  return Math.min(boost, 0.6); // cap at 0.6 bonus
}

// ── Main Prediction Engine ───────────────────────────────────────
function predictOffers(category, preferences = [], limit = 6) {
  const time     = getTimeOfDay();
  const dayType  = getDayType();
  const month    = getMonth();

  const pool = OFFERS[category] || OFFERS.all;

  const scored = pool.map(offer => {
    // Base score from discount size
    let score = offer.discount / 100;

    // Time-of-day factor
    score *= (offer.timeBoost[time] || 1.0);

    // Day-type factor
    score *= (offer.dayBoost[dayType] || 1.0);

    // Seasonal (month) factor
    score *= (offer.monthBoost[month] || 1.0);

    // Association rule boost (user preferences)
    score += associationBoost(offer, preferences);

    return {
      ...offer,
      score:        +score.toFixed(4),
      confidence:   Math.min(Math.round(score * 100), 99),
      timeOfDay:    time,
      dayType,
      savingsAmt:   offer.originalPrice - offer.offerPrice,
      aiReason:     buildReason(offer, time, dayType, preferences),
    };
  });

  // Sort by score descending
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function buildReason(offer, time, dayType, prefs) {
  const reasons = [];
  if (offer.timeBoost[time] > 1.1)    reasons.push(`🕐 Peak ${time} demand`);
  if (offer.dayBoost[dayType] > 1.2)  reasons.push(`📅 ${dayType === 'weekend' ? 'Weekend' : 'Weekday'} special`);
  if (offer.discount >= 40)           reasons.push(`🔥 Mega discount (${offer.discount}% off)`);
  if (prefs.some(p => offer.tags.includes(p))) reasons.push('⭐ Matches your preferences');
  if (reasons.length === 0)           reasons.push('💡 Recommended for you');
  return reasons.join(' · ');
}

function addOffer(category, offer) {
  if (!OFFERS[category]) {
    throw new Error('Invalid category. Must be ration, clothing, or electronics');
  }
  
  // Assign a random ID if not provided
  if (!offer.id) {
    offer.id = `A${Date.now().toString().slice(-4)}${Math.random().toString(36).substring(2, 5)}`;
  }
  
  OFFERS[category].unshift(offer); // Add to the beginning of the list
  // Rebuild the all array
  OFFERS.all = [...OFFERS.ration, ...OFFERS.clothing, ...OFFERS.electronics];
  return offer;
}

module.exports = { predictOffers, getTimeOfDay, getDayType, addOffer };
