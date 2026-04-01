const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      if (token === 'mock-admin-token') {
        req.user = { id: 'admin-id', name: 'Admin User', email: 'admin@swiftcart.com', role: 'admin' };
        next();
      } else if (token === 'mock-jwt-token' || token === 'mock-jwt-token-777') {
        req.user = { id: 'consumer-id', name: 'Demo User', email: 'user@swiftcart.com', role: 'user' };
        next();
      } else {
        res.status(401).json({ message: 'Not authorized, token failed' });
      }
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
