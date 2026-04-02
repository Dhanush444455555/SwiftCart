const express = require('express');
const router  = express.Router();
const { predictOffers, getTimeOfDay, getDayType, addOffer } = require('../model/offerPredictor');

/**
 * POST /api/offers/predict
 * Body: { category: "ration"|"clothing"|"electronics"|"all", preferences: string[] }
 * Returns ranked offers with confidence scores and AI reasoning.
 */
router.post('/predict', (req, res) => {
  const { category = 'all', preferences = [], limit = 6 } = req.body;

  if (!['ration', 'clothing', 'electronics', 'all'].includes(category)) {
    return res.status(400).json({ message: 'Invalid category. Use: ration, clothing, electronics, all' });
  }

  const offers = predictOffers(category, preferences, parseInt(limit, 10));

  res.json({
    category,
    preferences,
    timeOfDay: getTimeOfDay(),
    dayType:   getDayType(),
    count:     offers.length,
    offers,
  });
});

/**
 * POST /api/offers/add
 * Body: { category, title, description, originalPrice, offerPrice, discount, brand, qty, tags, img }
 */
router.post('/add', (req, res) => {
  const { category, ...offerData } = req.body;
  if (!['ration', 'clothing', 'electronics'].includes(category)) {
    return res.status(400).json({ message: 'Category must be ration, clothing, or electronics' });
  }
  
  // Default boosts if missing
  const newOffer = {
    ...offerData,
    timeBoost: offerData.timeBoost || { morning: 1, afternoon: 1, evening: 1, night: 1 },
    dayBoost: offerData.dayBoost || { weekday: 1, weekend: 1 },
    monthBoost: offerData.monthBoost || Array(12).fill(1)
  };

  try {
    const added = addOffer(category, newOffer);
    res.json({ message: 'Offer added successfully', offer: added });
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/offers/categories
 * Returns available categories with metadata.
 */
router.get('/categories', (_req, res) => {
  res.json({
    categories: [
      { key: 'ration',      label: 'Ration & Groceries', emoji: '🛒', description: 'Rice, oil, dal, spices, dairy & pantry essentials' },
      { key: 'clothing',    label: 'Clothing & Apparel',  emoji: '👗', description: 'Ethnic wear, casuals, formals, kids & sportswear' },
      { key: 'electronics', label: 'Electronics',         emoji: '📱', description: 'Gadgets, audio, accessories & more' },
      { key: 'all',         label: 'All Categories',      emoji: '🎯', description: 'Best offers across everything' },
    ],
  });
});

module.exports = router;
