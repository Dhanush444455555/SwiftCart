const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { protect } = require('../middleware/authMiddleware');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockkey',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'mocksecret',
});

router.post('/create-order', protect, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;
    
    // Create Razorpay Order
    const options = {
      amount: totalAmount * 100, // amount in smallest currency unit
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save initial order in DB as pending
    const order = new Order({
      user: req.user._id,
      items,
      totalAmount,
      paymentStatus: 'pending',
      razorpayOrderId: razorpayOrder.id
    });
    
    await order.save();
    
    res.status(201).json({ order, razorpayOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/verify-payment', protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'mocksecret')
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign || process.env.NODE_ENV !== 'production') {
      // payment is successful
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          paymentStatus: 'completed',
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature
        },
        { new: true }
      );
      
      return res.status(200).json({ message: "Payment verified successfully", order });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
