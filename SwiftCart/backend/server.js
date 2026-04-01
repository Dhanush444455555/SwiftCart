const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Default Middleware
app.use(cors());
app.use(express.json());

// Main Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Database Connection Mock
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/swiftcart', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB Connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('Database connection error:', err);
});
