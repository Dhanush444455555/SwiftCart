const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // In a real app, verify token and find user
      // const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // req.user = await User.findById(decoded.id).select('-password');
      
      // Mock validation for now
      if (token === 'mock-jwt-token-777') {
        req.user = { id: 'mock-user-id', name: 'Demo User', role: 'user' };
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
