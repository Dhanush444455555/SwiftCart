/**
 * SwiftCart AI Model Service — Port 5001
 * Standalone Express server for the Offer Prediction Engine
 */
const express = require('express');
const cors    = require('cors');
const offerRoutes = require('./routes/offerRoutes');

const app  = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (_req, res) => {
  res.json({
    service: 'SwiftCart AI Offer Prediction Engine',
    version: '1.0.0',
    status:  'running',
    port:    PORT,
    endpoints: [
      'POST /api/offers/predict  — Predict personalised offers',
      'GET  /api/offers/categories — List available categories',
    ],
  });
});

app.use('/api/offers', offerRoutes);

// 404
app.use((_req, res) => res.status(404).json({ message: 'Endpoint not found' }));

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🤖 SwiftCart AI Model running on http://localhost:${PORT}`);
    console.log(`   POST /api/offers/predict  — Get AI-predicted offers`);
    console.log(`   GET  /api/offers/categories — Browse categories\n`);
  });
}

module.exports = app;
