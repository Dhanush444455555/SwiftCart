/**
 * Cart.js — MySQL query helpers for `carts` + `cart_items` tables.
 * Replaces the Mongoose Cart model.
 *
 * A cart is 1-to-1 with a user (carts.user_id UNIQUE).
 * Items are stored in cart_items joined to products.
 */
const pool = require('../db');

const Cart = {
  /**
   * Find (or create) the cart for a user, returning the cart row
   * with its items populated with product data.
   */
  async findOrCreateByUser(userId) {
    // Ensure a cart row exists
    await pool.query(
      'INSERT IGNORE INTO carts (user_id, total_price) VALUES (?, 0)',
      [userId]
    );

    const [cartRows] = await pool.query(
      'SELECT * FROM carts WHERE user_id = ? LIMIT 1',
      [userId]
    );
    const cart = cartRows[0];

    // Fetch items + product details
    cart.items = await Cart._getItems(cart.id);
    return cart;
  },

  /** Get a cart by its ID with populated items */
  async findById(cartId) {
    const [rows] = await pool.query('SELECT * FROM carts WHERE id = ? LIMIT 1', [cartId]);
    if (!rows[0]) return null;
    const cart = rows[0];
    cart.items = await Cart._getItems(cart.id);
    return cart;
  },

  /**
   * Sync items for a user's cart (replaces all existing items).
   * items: [{ product: productId, quantity }]
   */
  async sync(userId, items, totalPrice) {
    // Ensure cart exists
    await pool.query(
      'INSERT IGNORE INTO carts (user_id, total_price) VALUES (?, 0)',
      [userId]
    );

    const [cartRows] = await pool.query(
      'SELECT id FROM carts WHERE user_id = ? LIMIT 1',
      [userId]
    );
    const cartId = cartRows[0].id;

    // Replace all items
    await pool.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);

    if (items && items.length) {
      const vals = items.map(it => [cartId, it.product || it.product_id, it.quantity || 1]);
      await pool.query(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ?',
        [vals]
      );
    }

    // Update total_price
    await pool.query('UPDATE carts SET total_price = ? WHERE id = ?', [totalPrice || 0, cartId]);

    return Cart.findById(cartId);
  },

  /** Internal: fetch cart items joined with product data */
  async _getItems(cartId) {
    const [rows] = await pool.query(
      `SELECT
         ci.id, ci.quantity,
         p.id AS product_id, p.name, p.description, p.price,
         p.category, p.image, p.in_stock, p.stock_count, p.qr_code, p.aisle
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.cart_id = ?`,
      [cartId]
    );
    // Shape to match the old Mongoose populate structure: { product: {...}, quantity }
    return rows.map(r => ({
      id: r.id,
      quantity: r.quantity,
      product: {
        id:          r.product_id,
        _id:         r.product_id,
        name:        r.name,
        description: r.description,
        price:       r.price,
        category:    r.category,
        image:       r.image,
        inStock:     !!r.in_stock,
        stockCount:  r.stock_count,
        qrCode:      r.qr_code,
        aisle:       r.aisle,
      },
    }));
  },
};

module.exports = Cart;
