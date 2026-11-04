/**
 * Product.js — MySQL query helpers for the `products` table.
 * Replaces the Mongoose Product model.
 */
const pool = require('../db');

const Product = {
  /** Return all products */
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    return rows;
  },

  /** Find by primary key */
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  },

  /** Find by qrCode */
  async findByQrCode(qrCode) {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE qr_code = ? LIMIT 1',
      [qrCode]
    );
    return rows[0] || null;
  },

  /** Search by name (LIKE) */
  async search(query) {
    const [rows] = await pool.query(
      'SELECT * FROM products WHERE name LIKE ? ORDER BY name',
      [`%${query}%`]
    );
    return rows;
  },

  /** Insert many products (used by seed) */
  async insertMany(products) {
    if (!products.length) return;
    const values = products.map(p => [
      p.name,
      p.description || '',
      p.price,
      p.category   || null,
      p.image      || null,
      p.inStock !== undefined ? (p.inStock ? 1 : 0) : 1,
      p.stockCount || 0,
      p.qrCode,
      p.aisle      || null,
    ]);
    await pool.query(
      `INSERT INTO products
         (name, description, price, category, image, in_stock, stock_count, qr_code, aisle)
       VALUES ?`,
      [values]
    );
  },

  /** Delete all products (used by seed) */
  async deleteAll() {
    await pool.query('DELETE FROM products');
  },
};

module.exports = Product;
