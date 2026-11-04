/**
 * Order.js — MySQL query helpers for `orders` + `order_items` tables.
 * Replaces the Mongoose Order model.
 */
const pool = require('../db');

const Order = {
  /**
   * Create a new order with its line items.
   * items: [{ product: productId, quantity, price }]
   * Returns the created order (with items populated).
   */
  async create({ userId, items, totalAmount, paymentStatus = 'pending', razorpayOrderId = null }) {
    const [result] = await pool.query(
      `INSERT INTO orders (user_id, total_amount, payment_status, razorpay_order_id)
       VALUES (?, ?, ?, ?)`,
      [userId, totalAmount, paymentStatus, razorpayOrderId]
    );
    const orderId = result.insertId;

    if (items && items.length) {
      const vals = items.map(it => [
        orderId,
        it.product || it.product_id,
        it.quantity,
        it.price,
      ]);
      await pool.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?',
        [vals]
      );
    }

    return Order.findById(orderId);
  },

  /** Find an order by its primary key (with populated items) */
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ? LIMIT 1', [id]);
    if (!rows[0]) return null;
    const order = rows[0];
    order.items = await Order._getItems(order.id);
    return order;
  },

  /** Find an order by its Razorpay order ID */
  async findByRazorpayOrderId(razorpayOrderId) {
    const [rows] = await pool.query(
      'SELECT * FROM orders WHERE razorpay_order_id = ? LIMIT 1',
      [razorpayOrderId]
    );
    if (!rows[0]) return null;
    const order = rows[0];
    order.items = await Order._getItems(order.id);
    return order;
  },

  /** Update payment fields after Razorpay callback */
  async updatePayment(razorpayOrderId, { paymentStatus, razorpayPaymentId, razorpaySignature }) {
    await pool.query(
      `UPDATE orders
       SET payment_status = ?, razorpay_payment_id = ?, razorpay_signature = ?
       WHERE razorpay_order_id = ?`,
      [paymentStatus, razorpayPaymentId, razorpaySignature, razorpayOrderId]
    );
    return Order.findByRazorpayOrderId(razorpayOrderId);
  },

  /** All orders for a user, newest first, with items */
  async findByUser(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return Promise.all(rows.map(async o => {
      o.items = await Order._getItems(o.id);
      return o;
    }));
  },

  /** Internal: fetch order line items joined with product data */
  async _getItems(orderId) {
    const [rows] = await pool.query(
      `SELECT
         oi.id, oi.quantity, oi.price,
         p.id AS product_id, p.name, p.description,
         p.category, p.image, p.qr_code, p.aisle
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ?`,
      [orderId]
    );
    return rows.map(r => ({
      id:       r.id,
      quantity: r.quantity,
      price:    r.price,
      product: {
        id:          r.product_id,
        _id:         r.product_id,
        name:        r.name,
        description: r.description,
        category:    r.category,
        image:       r.image,
        qrCode:      r.qr_code,
        aisle:       r.aisle,
      },
    }));
  },
};

module.exports = Order;
