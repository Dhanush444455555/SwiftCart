const express = require('express');
const cors    = require('cors');
const dotenv  = require('dotenv');
const path    = require('path');
const pool    = require('./db');         // MySQL connection pool
const bcrypt  = require('bcryptjs');

// Routes
const authRoutes     = require('./routes/authRoutes');
const productRoutes  = require('./routes/productRoutes');
const cartRoutes     = require('./routes/cartRoutes');
const orderRoutes    = require('./routes/orderRoutes');
const storeRoutes    = require('./routes/storeRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const paymentRoutes  = require('./routes/paymentRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

dotenv.config();

const app  = express();
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

/* ── Database Connection + Seed ───────────────────────────────────── */
async function startServer() {
  try {
    // Test the MySQL connection pool
    const conn = await pool.getConnection();
    console.log('✅ MySQL Connected Successfully');
    conn.release();

    // Seed default admin/user accounts if they don't exist
    try {
      const adminEmail = 'admin@swiftcart.com';
      const userEmail  = 'user@swiftcart.com';

      const [adminRows] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [adminEmail]);
      if (!adminRows.length) {
        await pool.query(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          ['Admin User', adminEmail, await bcrypt.hash('admin123', 10), 'admin']
        );
        console.log('👤 Seeded admin: admin@swiftcart.com / admin123');
      }

      const [userRows] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [userEmail]);
      if (!userRows.length) {
        await pool.query(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          ['Demo User', userEmail, await bcrypt.hash('user123', 10), 'user']
        );
        console.log('👤 Seeded user: user@swiftcart.com / user123');
      }
    } catch (seedErr) {
      console.error('⚠️  Seed warning:', seedErr.message);
    }

    // Start listening
    if (require.main === module) {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }
  } catch (err) {
    console.error('❌ MySQL connection error:', err.message);
    console.error('Make sure MySQL is running and .env is configured.');
    process.exit(1);
  }
}

startServer();

module.exports = app;
