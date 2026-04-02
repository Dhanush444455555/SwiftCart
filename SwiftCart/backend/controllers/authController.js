const mongoose = require('mongoose');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

const generateToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });

/* ─────────────────────────────────────────────────────────
   In-memory fallback store (used when MongoDB is offline)
   ───────────────────────────────────────────────────────── */
const memUsers = [
  { _id: 'admin-id', name: 'Admin User',  email: 'admin@swiftcart.com', password: bcrypt.hashSync('admin123', 10), role: 'admin' },
  { _id: 'user-id',  name: 'Demo User',   email: 'user@swiftcart.com',  password: bcrypt.hashSync('user123', 10),  role: 'user'  },
];

const isDbConnected = () => mongoose.connection.readyState === 1;
const memFindByEmail = (email) => memUsers.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
const memCreate = async ({ name, email, password, role = 'user' }) => {
  const user = { _id: `mem-${Date.now()}`, name, email, password: await bcrypt.hash(password, 10), role };
  memUsers.push(user);
  return user;
};

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

    if (isDbConnected()) {
      const User = require('../models/User');
      if (await User.findOne({ email }))
        return res.status(400).json({ message: 'An account with this email already exists' });

      const user = await User.create({ name, email, password, role });
      console.log(`[Auth] Registered in MongoDB: ${email}`);
      return res.status(201).json({
        user:  { _id: user._id, name: user.name, email: user.email, role: user.role },
        token: generateToken(user._id),
      });
    }

    // In-memory fallback
    if (memFindByEmail(email))
      return res.status(400).json({ message: 'An account with this email already exists' });

    const user = await memCreate({ name, email, password, role });
    console.log(`[Auth] Registered in-memory (no DB): ${email}`);
    return res.status(201).json({
      user:  { _id: user._id, name: user.name, email: user.email, role: user.role },
      token: generateToken(user._id),
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

    if (isDbConnected()) {
      const User = require('../models/User');
      const user = await User.findOne({ email });
      if (!user || !(await user.matchPassword(password)))
        return res.status(401).json({ message: 'Invalid email or password' });

      console.log(`[Auth] Logged in from MongoDB: ${email}`);
      return res.json({
        user:  { _id: user._id, name: user.name, email: user.email, role: user.role },
        token: generateToken(user._id),
      });
    }

    // In-memory fallback
    const user = memFindByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    console.log(`[Auth] Logged in from in-memory store: ${email}`);
    return res.json({
      user:  { _id: user._id, name: user.name, email: user.email, role: user.role },
      token: generateToken(user._id),
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
    if (isDbConnected()) {
      const User = require('../models/User');
      const user = await User.findById(req.user._id || req.user.id).select('-password');
      if (user) return res.status(200).json(user);
    }
    const user = memUsers.find(u => u._id === (req.user._id || req.user.id));
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { password: _, ...safeUser } = user;
    return res.status(200).json(safeUser);
  } catch (err) {
    console.error('[Auth] getMe error:', err.message);
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};

module.exports = { registerUser, loginUser, getMe };
