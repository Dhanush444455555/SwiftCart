const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });
};

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, role = 'user' } = req.body;
        if (!name || !email || !password) {
            res.status(400);
            throw new Error('Name, email and password are required');
        }

        let user = await User.findOne({ email });
        if (user) {
            res.status(400);
            throw new Error('User already exists');
        }

        user = new User({ name, email, password, role });
        await user.save();

        res.status(201).json({
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
            token: generateToken(user._id)
        });
    } catch (err) {
        next(err);
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;

        // Demo accounts (no DB needed for quick testing)
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
        if (!user || !(await user.matchPassword(password))) {
            res.status(400);
            throw new Error('Invalid credentials');
        }

        if (role && user.role !== role) {
            res.status(403);
            throw new Error('User role mismatch');
        }

        res.json({
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
            token: generateToken(user._id)
        });
    } catch (err) {
        next(err);
    }
};

const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
};
