const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String }, // URL or path
  inStock: { type: Boolean, default: true },
  stockCount: { type: Number, default: 0 },
  aisle: { type: String }, // For in-store navigation mock
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
