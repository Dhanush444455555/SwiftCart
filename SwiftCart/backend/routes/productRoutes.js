const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/qr/:qrCode', productController.getProductByQrCode);
router.get('/:id', productController.getProductById);

module.exports = router;
