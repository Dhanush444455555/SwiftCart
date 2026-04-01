const express = require('express');
const router = express.Router();
const { getNearbyStores } = require('../controllers/storeController');

// GET /api/stores/nearby?lat=XX.XXXX&lng=YY.YYYY
router.get('/nearby', getNearbyStores);

module.exports = router;
