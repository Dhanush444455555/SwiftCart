const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    // Normalize column names to match what the front-end expects
    res.json(products.map(normalise));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(normalise(product));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductByQrCode = async (req, res) => {
  try {
    const product = await Product.findByQrCode(req.params.qrCode);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(normalise(product));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    const products = await Product.search(query || '');
    res.json(products.map(normalise));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Map MySQL snake_case column names to the camelCase shape
 * the existing front-end expects (e.g. inStock, stockCount, qrCode).
 * Also add _id alias so any code checking product._id still works.
 */
function normalise(p) {
  return {
    _id:         p.id,
    id:          p.id,
    name:        p.name,
    description: p.description,
    price:       p.price,
    category:    p.category,
    image:       p.image,
    inStock:     !!p.in_stock,
    stockCount:  p.stock_count,
    qrCode:      p.qr_code,
    aisle:       p.aisle,
    createdAt:   p.created_at,
    updatedAt:   p.updated_at,
  };
}
