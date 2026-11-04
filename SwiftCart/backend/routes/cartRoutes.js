const express = require('express');
const router  = express.Router();
const Cart    = require('../models/Cart');
const { protect } = require('../middleware/authMiddleware');

// GET /api/cart — return the authenticated user's cart (create if missing)
router.get('/', protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const cart   = await Cart.findOrCreateByUser(userId);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/cart/sync — replace cart contents for the authenticated user
router.post('/sync', protect, async (req, res) => {
  try {
    const userId               = req.user.id || req.user._id;
    const { items, totalPrice } = req.body;
    const cart = await Cart.sync(userId, items, totalPrice);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
