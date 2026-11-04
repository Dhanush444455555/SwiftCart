/**
 * Feedback.js — MySQL query helpers for the `feedbacks` table.
 * Replaces the Mongoose Feedback model.
 */
const pool = require('../db');

const Feedback = {
  /** Create a new feedback entry */
  async create({ name, phone, rating = 5, message }) {
    const [result] = await pool.query(
      'INSERT INTO feedbacks (name, phone, rating, message) VALUES (?, ?, ?, ?)',
      [name, phone, rating, message]
    );
    const [rows] = await pool.query('SELECT * FROM feedbacks WHERE id = ? LIMIT 1', [result.insertId]);
    return rows[0];
  },

  /** Return all feedbacks, newest first */
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM feedbacks ORDER BY created_at DESC');
    return rows;
  },
};

module.exports = Feedback;
