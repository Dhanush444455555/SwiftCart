/**
 * db.js — MySQL / TiDB connection pool (mysql2/promise)
 *
 * Supports connection strings (DATABASE_URL / MYSQL_URL)
 * and individual environment variables:
 *   MYSQL_HOST / DB_HOST
 *   MYSQL_PORT / DB_PORT
 *   MYSQL_USER / DB_USERNAME
 *   MYSQL_PASSWORD / DB_PASSWORD
 *   MYSQL_DATABASE / DB_DATABASE
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
    ssl: process.env.MYSQL_SSL === 'false' ? undefined : { minVersion: 'TLSv1.2', rejectUnauthorized: false },
  });
} else {
  const host     = process.env.MYSQL_HOST     || process.env.DB_HOST     || 'localhost';
  const port     = parseInt(process.env.MYSQL_PORT || process.env.DB_PORT || '3306', 10);
  const user     = process.env.MYSQL_USER     || process.env.DB_USERNAME || 'root';
  const password = process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '';
  const database = process.env.MYSQL_DATABASE || process.env.DB_DATABASE || 'swiftcart';
  const isRemote = host !== 'localhost' && host !== '127.0.0.1';
  const useSsl   = process.env.MYSQL_SSL === 'true' || (isRemote && process.env.MYSQL_SSL !== 'false');

  pool = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: useSsl ? { minVersion: 'TLSv1.2', rejectUnauthorized: false } : undefined,
  });
}

module.exports = pool;
