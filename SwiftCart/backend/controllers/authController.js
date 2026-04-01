const User = require('../models/User');

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      res.status(400);
      throw new Error('User already exists');
    }
    
    user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ user, token: 'mock-jwt-token' });
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      res.status(400);
      throw new Error('Invalid credentials');
    }
    res.json({ user, token: 'mock-jwt-token' });
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

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
