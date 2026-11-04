const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const dotenv   = require('dotenv');
const path     = require('path');
const pool     = require('./db');
const bcrypt   = require('bcryptjs');

// Routes
const authRoutes     = require('./routes/authRoutes');
const productRoutes  = require('./routes/productRoutes');
const cartRoutes     = require('./routes/cartRoutes');
const orderRoutes    = require('./routes/orderRoutes');
const storeRoutes    = require('./routes/storeRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const paymentRoutes  = require('./routes/paymentRoutes');
const adminRoutes    = require('./routes/adminRoutes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security ──────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: false,  // Allow inline scripts (Razorpay checkout)
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ── CORS ─────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
}));

// ── Body Parsing ──────────────────────────────────────────────────
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// ── Health check ─────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── API Routes ────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart',     cartRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/stores',   storeRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/payment',  paymentRoutes);
app.use('/api/admin',    adminRoutes);

// ── 404 for unknown API routes ────────────────────────────────────
app.use('/api', notFound);

// ── Serve frontend build ──────────────────────────────────────────
const frontendDist = path.join(__dirname, '..', '01_frontend', 'dist');
app.use(express.static(frontendDist));
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

// ── Global error handler ──────────────────────────────────────────
app.use(errorHandler);

/* ── Database connection + seed ───────────────────────────────────── */
async function startServer() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL Connected Successfully');
    conn.release();

    // Seed default accounts if missing
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

    if (require.main === module) {
      app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    }
  } catch (err) {
    console.error('❌ MySQL connection error:', err.message);
    console.error('Make sure MySQL is running and .env is configured correctly.');
    process.exit(1);
  }
}

startServer();

module.exports = app;
