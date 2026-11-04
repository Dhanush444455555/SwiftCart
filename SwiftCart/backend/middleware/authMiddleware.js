const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Support mock tokens for demo/testing
      if (token === 'mock-admin-token') {
        req.user = { id: 1, _id: 1, name: 'Admin User', email: 'admin@swiftcart.com', role: 'admin' };
        return next();
      }
      if (token === 'mock-jwt-token' || token === 'mock-jwt-token-777') {
        req.user = { id: 2, _id: 2, name: 'Demo User', email: 'user@swiftcart.com', role: 'user' };
        return next();
      }

      // Real JWT verification
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
      const user    = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user missing' });
      }

      req.user = { ...user, _id: user.id }; // expose both id and _id
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };
