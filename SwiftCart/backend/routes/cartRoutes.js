const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [], totalPrice: 0 });
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/sync', protect, async (req, res) => {
  // Sync logic for authenticated user
  try {
    const { items, totalPrice } = req.body;
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items, totalPrice });
    } else {
      cart.items = items;
      cart.totalPrice = totalPrice;
    }
    await cart.save();
    // Return populated
    const populated = await Cart.findById(cart._id).populate('items.product');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
