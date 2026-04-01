const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Routes
const authRoutes    = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes    = require('./routes/cartRoutes');
const orderRoutes   = require('./routes/orderRoutes');
const storeRoutes    = require('./routes/storeRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
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

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Database Connection Mock
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/swiftcart', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async() => {
    console.log('MongoDB Connected');

    try {
        const User = require('./models/User');
        const adminEmail = 'admin@example.com';
        const userEmail = 'user@example.com';

        const admin = await User.findOne({ email: adminEmail });
        if (!admin) {
            await User.create({
                name: 'Admin',
                email: adminEmail,
                password: 'admin123',
                role: 'admin',
            });
            console.log('Created default admin account: admin@example.com/admin123');
        }

        const customer = await User.findOne({ email: userEmail });
        if (!customer) {
            await User.create({
                name: 'Customer',
                email: userEmail,
                password: 'user123',
                role: 'user',
            });
            console.log('Created default customer account: user@example.com/user123');
        }
    } catch (e) {
        console.error('Could not ensure default users: ', e.message);
    }
}).catch(err => {
    console.error('Database connection error:', err.message);
    console.log('App will continue running with fallback mock data.');
});

// Start server whether DB connects or not
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));