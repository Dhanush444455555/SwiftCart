import { verifyToken } from '../utils/jwt.js';

export const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization ? .split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'No token, authorization denied' });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed' });
    }
};

export const authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.userRole)) {
            return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
        }
        next();
    };
};

export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: 'Validation error', details: err.message });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid ID format' });
    }

    if (err.code === 11000) {
        return res.status(400).json({ error: 'Duplicate field value entered' });
    }

    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
    });
};