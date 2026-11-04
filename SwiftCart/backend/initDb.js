/**
 * initDb.js — Creates the swiftcart MySQL database and all tables.
 *
 * Run once: node backend/initDb.js
 *
 * Tables:
 *   users, products, carts, cart_items, orders, order_items, feedbacks
 */
const mysql = require('mysql2/promise');
require('dotenv').config();

async function init() {
  // Connect without selecting a database first (so we can create it)
  const conn = await mysql.createConnection({
    host:     process.env.MYSQL_HOST     || 'localhost',
    port:     parseInt(process.env.MYSQL_PORT || '3306', 10),
    user:     process.env.MYSQL_USER     || 'root',
    password: process.env.MYSQL_PASSWORD || '',
  });

  const db = process.env.MYSQL_DATABASE || 'swiftcart';

  console.log(`Creating database '${db}' if it does not exist…`);
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${db}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await conn.query(`USE \`${db}\``);

  // ── users ────────────────────────────────────────────────────────
  await conn.query(`
    CREATE TABLE IF NOT EXISTS users (
      id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name        VARCHAR(255)                        NOT NULL,
      email       VARCHAR(255)                        NOT NULL UNIQUE,
      password    VARCHAR(255)                        NOT NULL,
      role        ENUM('user','admin') DEFAULT 'user' NOT NULL,
      created_at  DATETIME             DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME             DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB
  `);
  console.log('  ✓ users');

  // ── products ─────────────────────────────────────────────────────
  await conn.query(`
    CREATE TABLE IF NOT EXISTS products (
      id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name        VARCHAR(255)         NOT NULL,
      description TEXT,
      price       DECIMAL(10,2)        NOT NULL,
      category    VARCHAR(100),
      image       VARCHAR(1000),
      in_stock    TINYINT(1) DEFAULT 1 NOT NULL,
      stock_count INT        DEFAULT 0 NOT NULL,
      qr_code     VARCHAR(255)         NOT NULL UNIQUE,
      aisle       VARCHAR(50),
      created_at  DATETIME   DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME   DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB
  `);
  console.log('  ✓ products');

  // ── carts ────────────────────────────────────────────────────────
  await conn.query(`
    CREATE TABLE IF NOT EXISTS carts (
      id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id     INT UNSIGNED NOT NULL UNIQUE,
      total_price DECIMAL(10,2) DEFAULT 0,
      created_at  DATETIME      DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB
  `);
  console.log('  ✓ carts');

  // ── cart_items ───────────────────────────────────────────────────
  await conn.query(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      cart_id     INT UNSIGNED NOT NULL,
      product_id  INT UNSIGNED NOT NULL,
      quantity    INT          DEFAULT 1 NOT NULL,
      FOREIGN KEY (cart_id)    REFERENCES carts(id)    ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      UNIQUE KEY uq_cart_product (cart_id, product_id)
    ) ENGINE=InnoDB
  `);
  console.log('  ✓ cart_items');

  // ── orders ───────────────────────────────────────────────────────
  await conn.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id                   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      user_id              INT UNSIGNED NOT NULL,
      total_amount         DECIMAL(10,2) NOT NULL,
      payment_status       ENUM('pending','completed','failed') DEFAULT 'pending' NOT NULL,
      razorpay_order_id    VARCHAR(255),
      razorpay_payment_id  VARCHAR(255),
      razorpay_signature   VARCHAR(512),
      created_at           DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at           DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB
  `);
  console.log('  ✓ orders');

  // ── order_items ──────────────────────────────────────────────────
  await conn.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      order_id   INT UNSIGNED  NOT NULL,
      product_id INT UNSIGNED  NOT NULL,
      quantity   INT           NOT NULL,
      price      DECIMAL(10,2) NOT NULL,
      FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
    ) ENGINE=InnoDB
  `);
  console.log('  ✓ order_items');

  // ── feedbacks ────────────────────────────────────────────────────
  await conn.query(`
    CREATE TABLE IF NOT EXISTS feedbacks (
      id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name       VARCHAR(255) NOT NULL,
      phone      VARCHAR(20)  NOT NULL,
      rating     TINYINT      DEFAULT 5 NOT NULL,
      message    TEXT         NOT NULL,
      created_at DATETIME     DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB
  `);
  console.log('  ✓ feedbacks');

  await conn.end();
  console.log(`\n✅ Database '${db}' initialised successfully.`);
}

init().catch(err => {
  console.error('❌ initDb failed:', err.message);
  process.exit(1);
});
