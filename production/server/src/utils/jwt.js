import jwt from 'jsonwebtoken';

export const generateToken = (userId, role) => {
    return jwt.sign({ userId, role },
        process.env.JWT_SECRET || 'your-super-secret-jwt-key', { expiresIn: '30d' }
    );
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key');
    } catch (error) {
        return null;
    }
};