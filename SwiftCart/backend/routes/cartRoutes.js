const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

router.get('/:userId', async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.params.userId }).populate('items.product');
    if (!cart) {
      cart = new Cart({ user: req.params.userId, items: [], totalPrice: 0 });
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/sync', async (req, res) => {
  // Mock endpoint to sync local frontend cart with backend DB
  try {
    const { userId, items, totalPrice } = req.body;
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items, totalPrice });
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
