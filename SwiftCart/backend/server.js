const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Routes
const authRoutes    = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes    = require('./routes/cartRoutes');
const orderRoutes   = require('./routes/orderRoutes');
const storeRoutes    = require('./routes/storeRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Default Middleware
app.use(cors());
app.use(express.json());

// Main Routes
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart',     cartRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/stores',   storeRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/payment',  paymentRoutes);

// 404 for unknown API routes (before catch-all)
app.use('/api', notFound);

// Serve frontend build
const frontendDist = path.join(__dirname, '..', '01_frontend', 'dist');
app.use(express.static(frontendDist));

// Catch-all: send index.html for client-side routing (Express 5 syntax)
app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
});

// Global error handler — must be last
app.use(errorHandler);

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/swiftcart')
.then(async () => {
    console.log('✅ MongoDB Connected');
    try {
        const bcrypt = require('bcryptjs');
        const User   = require('./models/User');

        // Use insertOne directly to bypass pre-save hook (passwords already hashed)
        const adminEmail = 'admin@swiftcart.com';
        if (!(await User.findOne({ email: adminEmail }))) {
            await User.collection.insertOne({
                name: 'Admin User', email: adminEmail,
                password: await bcrypt.hash('admin123', 10),
                role: 'admin', createdAt: new Date(), updatedAt: new Date(),
            });
            console.log('👤 Seeded admin: admin@swiftcart.com / admin123');
        }

        const userEmail = 'user@swiftcart.com';
        if (!(await User.findOne({ email: userEmail }))) {
            await User.collection.insertOne({
                name: 'Demo User', email: userEmail,
                password: await bcrypt.hash('user123', 10),
                role: 'user', createdAt: new Date(), updatedAt: new Date(),
            });
            console.log('👤 Seeded user: user@swiftcart.com / user123');
        }
    } catch (e) {
        console.error('⚠️  Seed warning:', e.message);
    }
}).catch(err => {
    console.error('❌ Database connection error:', err.message);
    console.log('App will continue running with in-memory fallback.');
});

// Start server when not exported (local dev)
if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;