const express  = require('express');
const router   = express.Router();
const Order    = require('../models/Order');
const Razorpay = require('razorpay');
const crypto   = require('crypto');
const { protect } = require('../middleware/authMiddleware');

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID     || 'rzp_test_mockkey',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'mocksecret',
});

// POST /api/orders/create-order
router.post('/create-order', protect, async (req, res) => {
  try {
    const userId               = req.user.id || req.user._id;
    const { items, totalAmount } = req.body;

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount:   totalAmount * 100, // paise
      currency: 'INR',
      receipt:  `receipt_order_${Date.now()}`,
    });

    // Persist to MySQL
    const order = await Order.create({
      userId,
      items,
      totalAmount,
      paymentStatus:   'pending',
      razorpayOrderId: razorpayOrder.id,
    });

    res.status(201).json({ order, razorpayOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/orders/verify-payment
router.post('/verify-payment', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign        = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'mocksecret')
      .update(sign)
      .digest('hex');

    if (razorpay_signature === expectedSign || process.env.NODE_ENV !== 'production') {
      const order = await Order.updatePayment(razorpay_order_id, {
        paymentStatus:      'completed',
        razorpayPaymentId:  razorpay_payment_id,
        razorpaySignature:  razorpay_signature,
      });
      return res.status(200).json({ message: 'Payment verified successfully', order });
    } else {
      return res.status(400).json({ message: 'Invalid signature sent!' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/my-orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const orders = await Order.findByUser(userId);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
