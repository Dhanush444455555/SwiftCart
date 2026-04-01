const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/', async (req, res) => {
  try {
    const { user, items, totalAmount, paymentStatus, transactionId } = req.body;
    const order = new Order({
      user,
      items,
      totalAmount,
      paymentStatus,
      transactionId
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate('items.product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
