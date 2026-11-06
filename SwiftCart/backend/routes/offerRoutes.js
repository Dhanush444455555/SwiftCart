const express = require('express');
const router  = express.Router();
const { predictOffers, getTimeOfDay, getDayType, addOffer } = require('../services/offerPredictor');

/**
 * POST /api/offers/predict
 * Body: { category: "ration"|"clothing"|"electronics"|"all", preferences: string[], limit: number }
 * Returns ranked offers with confidence scores and AI reasoning.
 */
router.post('/predict', (req, res) => {
  const { category = 'all', preferences = [], limit = 12 } = req.body;

  const validCategories = ['ration', 'clothing', 'electronics', 'all'];
  const targetCategory = validCategories.includes(category) ? category : 'all';

  const offers = predictOffers(targetCategory, Array.isArray(preferences) ? preferences : [], parseInt(limit, 10) || 12);

  res.json({
    category: targetCategory,
    preferences: Array.isArray(preferences) ? preferences : [],
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

  const newOffer = {
    ...offerData,
    timeBoost: offerData.timeBoost || { morning: 1, afternoon: 1, evening: 1, night: 1 },
    dayBoost:  offerData.dayBoost || { weekday: 1, weekend: 1 },
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
 */
router.get('/categories', (_req, res) => {
  res.json({
    categories: [
      { key: 'all',         label: 'All Deals',          emoji: '🎯', description: 'Best offers across all categories' },
      { key: 'ration',      label: 'Ration & Groceries', emoji: '🛒', description: 'Rice, oil, dal, spices, dairy & pantry essentials' },
      { key: 'clothing',    label: 'Clothing & Apparel',  emoji: '👗', description: 'Ethnic wear, casuals, formals, kids & sportswear' },
      { key: 'electronics', label: 'Electronics',         emoji: '📱', description: 'Gadgets, audio, accessories & more' },
    ],
  });
});

module.exports = router;

