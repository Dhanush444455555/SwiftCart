const express  = require('express');
const Razorpay = require('razorpay');
const crypto   = require('crypto');
const router   = express.Router();

// ── Razorpay instance ────────────────────────────────────────────
// Replace these with your real keys from https://dashboard.razorpay.com/
const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID     || 'rzp_test_REPLACE_ME',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'REPLACE_ME_SECRET',
});

/**
 * POST /api/payment/create-order
 * Creates a Razorpay order and returns order_id + key_id to front-end
 */
router.post('/create-order', async (req, res) => {
  const { amount } = req.body;          // amount in INR (e.g. 1078.92)
  if (!amount || isNaN(amount)) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  try {
    const order = await razorpay.orders.create({
      amount:   Math.round(parseFloat(amount) * 100), // paise
      currency: 'INR',
      receipt:  `swiftcart_${Date.now()}`,
      notes:    { merchant_upi: '8904062827@ibl', app: 'SwiftCart' },
    });

    res.json({
      order_id:  order.id,
      amount:    order.amount,
      currency:  order.currency,
      key_id:    process.env.RAZORPAY_KEY_ID || 'rzp_test_REPLACE_ME',
    });
  } catch (err) {
    console.error('Razorpay order error:', err.message);
    res.status(500).json({ message: 'Failed to create payment order', error: err.message });
  }
});

/**
 * POST /api/payment/verify
 * Verifies the Razorpay payment signature after successful payment
 */
router.post('/verify', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const secret    = process.env.RAZORPAY_KEY_SECRET || 'REPLACE_ME_SECRET';
  const generated = crypto
    .createHmac('sha256', secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generated === razorpay_signature) {
    return res.json({ success: true, payment_id: razorpay_payment_id });
  } else {
    return res.status(400).json({ success: false, message: 'Payment verification failed' });
  }
});

module.exports = router;
