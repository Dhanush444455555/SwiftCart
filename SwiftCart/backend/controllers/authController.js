const mongoose = require('mongoose');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

const generateToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });

/* ─────────────────────────────────────────────────────────
   In-memory fallback store  (used when MongoDB is offline)
   Seeded with demo accounts so the app always works.
   ───────────────────────────────────────────────────────── */
const memUsers = [
  {
    _id:      'admin-id',
    name:     'Admin User',
    email:    'admin@swiftcart.com',
    password: bcrypt.hashSync('admin123', 10),
    role:     'admin',
  },
  {
    _id:      'user-id',
    name:     'Demo User',
    email:    'user@swiftcart.com',
    password: bcrypt.hashSync('user123', 10),
    role:     'user',
  },
];

/** Returns true when Mongoose has an open connection to MongoDB */
const isDbConnected = () => mongoose.connection.readyState === 1;

/* ── Helpers for in-memory store ── */
const memFindByEmail = (email) =>
  memUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;

const memFindById = (id) =>
  memUsers.find(u => u._id === id) || null;

const memCreate = async ({ name, email, password, role = 'user' }) => {
  const hashed = await bcrypt.hash(password, 10);
  const user = {
    _id:      `mem-${Date.now()}`,
    name,
    email,
    password: hashed,
    role,
  };
  memUsers.push(user);
  return user;
};

/* ─────────────────────────────────────────────────────────
   Controllers
   ───────────────────────────────────────────────────────── */

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    /* ── Try real DB first ── */
    if (isDbConnected()) {
      const User = require('../models/User');

      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: 'An account with this email already exists' });
      }

      const user = await User.create({ name, email, password, role });
      console.log(`[Auth] Registered in MongoDB: ${email}`);

      return res.status(201).json({
        user:  { _id: user._id, name: user.name, email: user.email, role: user.role },
        token: generateToken(user._id),
      });
    }

    /* ── Fallback: in-memory ── */
    if (memFindByEmail(email)) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const user = await memCreate({ name, email, password, role });
    console.log(`[Auth] Registered in-memory (no DB): ${email}`);

    return res.status(201).json({
      user:  { _id: user._id, name: user.name, email: user.email, role: user.role },
      token: generateToken(user._id),
    });

  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    /* ── Try real DB first ── */
    if (isDbConnected()) {
      const User = require('../models/User');

      const user = await User.findOne({ email });
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      console.log(`[Auth] Logged in from MongoDB: ${email}`);
      return res.json({
        user:  { _id: user._id, name: user.name, email: user.email, role: user.role },
        token: generateToken(user._id),
      });
    }

    /* ── Fallback: in-memory ── */
    const user = memFindByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log(`[Auth] Logged in from in-memory store: ${email}`);
    return res.json({
      user:  { _id: user._id, name: user.name, email: user.email, role: user.role },
      token: generateToken(user._id),
    });

  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    /* ── Try real DB ── */
    if (isDbConnected()) {
      const User = require('../models/User');
      const user = await User.findById(req.user._id || req.user.id).select('-password');
      if (user) return res.status(200).json(user);
    }

    /* ── Fallback: in-memory ── */
    const user = memFindById(req.user._id || req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { password: _, ...safeUser } = user;
    return res.status(200).json(safeUser);

  } catch (err) {
    next(err);
  }
};

module.exports = { registerUser, loginUser, getMe };
