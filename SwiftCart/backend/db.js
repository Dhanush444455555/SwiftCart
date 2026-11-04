/**
 * db.js — MySQL connection pool (mysql2/promise)
 *
 * Uses environment variables:
 *   MYSQL_HOST     (default: localhost)
 *   MYSQL_PORT     (default: 3306)
 *   MYSQL_USER     (default: root)
 *   MYSQL_PASSWORD (default: '')
 *   MYSQL_DATABASE (default: swiftcart)
 */
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:     process.env.MYSQL_HOST     || 'localhost',
  port:     parseInt(process.env.MYSQL_PORT || '3306', 10),
  user:     process.env.MYSQL_USER     || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'swiftcart',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
});

module.exports = pool;

