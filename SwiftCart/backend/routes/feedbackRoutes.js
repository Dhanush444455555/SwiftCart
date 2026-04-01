const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// POST /api/feedback — Submit new feedback
router.post('/', async (req, res) => {
  try {
    const { name, phone, rating, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({ message: 'Name, phone and message are required.' });
    }

    const phoneRegex = /^[0-9+\-\s()]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Please enter a valid phone number.' });
    }

    const feedback = await Feedback.create({ name, phone, rating: rating || 5, message });
    res.status(201).json({ success: true, message: 'Feedback submitted successfully!', data: feedback });
  } catch (err) {
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// GET /api/feedback — Get all feedback (admin use)
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
