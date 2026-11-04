/**
 * User.js — MySQL query helpers for the `users` table.
 * Replaces the Mongoose User model.
 */
const pool    = require('../db');
const bcrypt  = require('bcryptjs');

const User = {
  /** Find one user by email (returns row or null) */
  async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    );
    return rows[0] || null;
  },

  /** Find one user by primary key (returns row or null) */
  async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ? LIMIT 1',
      [id]
    );
    return rows[0] || null;
  },

  /** Create a new user (hashes password, returns inserted row) */
  async create({ name, email, password, role = 'user' }) {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashed, role]
    );
    return { id: result.insertId, name, email, role };
  },

  /** Insert a user with an already-hashed password (used by seed) */
  async insertRaw({ name, email, password, role = 'user' }) {
    const [result] = await pool.query(
      'INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role]
    );
    return result.insertId;
  },

  /** Compare a plain-text password against a stored hash */
  async matchPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  },
};

module.exports = User;
