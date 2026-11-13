/**
 * db.js — MySQL connection pool (mysql2/promise)
 *
 * Supports both connection strings (DATABASE_URL / MYSQL_URL)
 * and individual environment variables:
 *   MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_SSL
 */
const mysql = require('mysql2/promise');
require('dotenv').config();

const connectionUri = process.env.DATABASE_URL || process.env.MYSQL_URL;

let pool;

if (connectionUri) {
  pool = mysql.createPool({
    uri: connectionUri,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: process.env.MYSQL_SSL === 'false' ? undefined : { rejectUnauthorized: false },
  });
} else {
  const host = process.env.MYSQL_HOST || 'localhost';
  const isRemote = host !== 'localhost' && host !== '127.0.0.1';
  const useSsl = process.env.MYSQL_SSL === 'true' || (isRemote && process.env.MYSQL_SSL !== 'false');

  pool = mysql.createPool({
    host: host,
    port: parseInt(process.env.MYSQL_PORT || '3306', 10),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'swiftcart',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
  });
}

module.exports = pool;
