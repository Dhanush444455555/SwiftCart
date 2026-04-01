const User = require('../models/User');

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      res.status(400);
      throw new Error('User already exists');
    }
    user = new User({ name, email, password, role: role || 'user' });
    await user.save();
    const token = user.role === 'admin' ? 'mock-admin-token' : 'mock-jwt-token';
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Demo accounts (no DB needed)
    if (email === 'admin@swiftcart.com' && password === 'admin123') {
      return res.json({
        user: { id: 'admin-id', name: 'Admin User', email, role: 'admin' },
        token: 'mock-admin-token',
      });
    }
    if (email === 'user@swiftcart.com' && password === 'user123') {
      return res.json({
        user: { id: 'user-id', name: 'Demo User', email, role: 'user' },
        token: 'mock-jwt-token',
      });
    }

    // Real DB lookup
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      res.status(400);
      throw new Error('Invalid credentials');
    }
    const token = user.role === 'admin' ? 'mock-admin-token' : 'mock-jwt-token';
    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    next(err);
  }
};

module.exports = { registerUser, loginUser, getMe };
