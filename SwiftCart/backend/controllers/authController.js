const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const User      = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

const generateToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });

/* ─────────────────────────────────────────────────────────
   Register
   ───────────────────────────────────────────────────────── */
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const existing = await User.findByEmail(email);
    if (existing)
      return res.status(400).json({ message: 'An account with this email already exists' });

    const user = await User.create({ name, email, password, role });
    console.log(`[Auth] Registered: ${email}`);

    return res.status(201).json({
      user:  { _id: user.id, id: user.id, name: user.name, email: user.email, role: user.role },
      token: generateToken(user.id),
    });
  } catch (err) {
    console.error('[Auth] Register error:', err.message);
    return res.status(500).json({ message: err.message || 'Registration failed' });
  }
};

/* ─────────────────────────────────────────────────────────
   Login
   ───────────────────────────────────────────────────────── */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findByEmail(email);
    if (!user || !(await User.matchPassword(password, user.password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    console.log(`[Auth] Logged in: ${email}`);
    return res.json({
      user:  { _id: user.id, id: user.id, name: user.name, email: user.email, role: user.role },
      token: generateToken(user.id),
    });
  } catch (err) {
    console.error('[Auth] Login error:', err.message);
    return res.status(500).json({ message: err.message || 'Login failed' });
  }
};

/* ─────────────────────────────────────────────────────────
   Get current user
   ───────────────────────────────────────────────────────── */
const getMe = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const user   = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Alias _id so front-end code that uses either field still works
    return res.status(200).json({ ...user, _id: user.id });
  } catch (err) {
    console.error('[Auth] getMe error:', err.message);
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};

module.exports = { registerUser, loginUser, getMe };
