/**
 * adminRoutes.js — Admin-only product CRUD endpoints
 * Protected by: protect + admin middleware
 */
const express  = require('express');
const router   = express.Router();
const pool     = require('../db');
const { protect, admin } = require('../middleware/authMiddleware');
const { body, param, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// GET /api/admin/products — all products
router.get('/products', protect, admin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(rows.map(normalise));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/products — create product
router.post('/products', protect, admin, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price required'),
  body('stockCount').isInt({ min: 0 }).withMessage('Valid stock count required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
], validate, async (req, res) => {
  try {
    const { name, description, price, category, image, stockCount, aisle } = req.body;
    const qrCode = `QR-ADM-${Date.now()}-${Math.random().toString(36).substring(2,7)}`;
    const [result] = await pool.query(
      `INSERT INTO products (name, description, price, category, image, in_stock, stock_count, qr_code, aisle)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description || '', price, category, image || null, stockCount > 0 ? 1 : 0, stockCount, qrCode, aisle || null]
    );
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
    res.status(201).json(normalise(rows[0]));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/products/:id — update product
router.put('/products/:id', protect, admin, [
  param('id').isInt().withMessage('Invalid product ID'),
  body('name').optional().trim().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
  body('stockCount').optional().isInt({ min: 0 }),
], validate, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image, stockCount, aisle } = req.body;
    
    // Build dynamic SET clause
    const fields = [];
    const vals   = [];
    if (name        !== undefined) { fields.push('name = ?');        vals.push(name); }
    if (description !== undefined) { fields.push('description = ?'); vals.push(description); }
    if (price       !== undefined) { fields.push('price = ?');       vals.push(price); }
    if (category    !== undefined) { fields.push('category = ?');    vals.push(category); }
    if (image       !== undefined) { fields.push('image = ?');       vals.push(image); }
    if (aisle       !== undefined) { fields.push('aisle = ?');       vals.push(aisle); }
    if (stockCount  !== undefined) {
      fields.push('stock_count = ?', 'in_stock = ?');
      vals.push(stockCount, stockCount > 0 ? 1 : 0);
    }
    if (!fields.length) return res.status(400).json({ message: 'No fields to update' });

    vals.push(id);
    await pool.query(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, vals);
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (!rows[0]) return res.status(404).json({ message: 'Product not found' });
    res.json(normalise(rows[0]));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/products/:id — delete product
router.delete('/products/:id', protect, admin, [
  param('id').isInt().withMessage('Invalid product ID'),
], validate, async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/orders — all orders with user info
router.get('/orders', protect, admin, async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.*, u.name AS user_name, u.email AS user_email
      FROM orders o
      JOIN users u ON u.id = o.user_id
      ORDER BY o.created_at DESC
    `);
    // Fetch items for each order
    const result = await Promise.all(orders.map(async o => {
      const [items] = await pool.query(`
        SELECT oi.*, p.name AS product_name, p.image, p.category
        FROM order_items oi
        JOIN products p ON p.id = oi.product_id
        WHERE oi.order_id = ?
      `, [o.id]);
      return { ...o, items };
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/stats — dashboard stats
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const [[{ totalProducts }]] = await pool.query('SELECT COUNT(*) AS totalProducts FROM products');
    const [[{ totalOrders }]]   = await pool.query('SELECT COUNT(*) AS totalOrders FROM orders');
    const [[{ totalUsers }]]    = await pool.query('SELECT COUNT(*) AS totalUsers FROM users');
    const [[{ revenue }]]       = await pool.query("SELECT COALESCE(SUM(total_amount),0) AS revenue FROM orders WHERE payment_status='completed'");
    const [[{ outOfStock }]]    = await pool.query('SELECT COUNT(*) AS outOfStock FROM products WHERE stock_count = 0');
    res.json({ totalProducts, totalOrders, totalUsers, revenue, outOfStock });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/feedbacks — all feedback
router.get('/feedbacks', protect, admin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM feedbacks ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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

module.exports = router;
