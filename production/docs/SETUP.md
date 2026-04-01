# 🚀 SwiftCart - Complete Setup Guide

## Prerequisites

Before starting, ensure you have:

- **Node.js** v18+ and npm/yarn installed
- **MongoDB** (local or Cloud MongoDB Atlas account)
- **Razorpay Account** (for payment testing)
- **Git** (optional but recommended)

---

## 📦 Installation Steps

### Step 1: Backend Setup

#### 1.1 Navigate to Server Directory

```bash
cd production/server
```

#### 1.2 Install Dependencies

```bash
npm install
```

#### 1.3 Create Environment File

```bash
cp .env.example .env
```

#### 1.4 Configure Environment Variables

Edit `.env` file with your settings:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/swiftcart
# OR for MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/swiftcart

# Server Port
PORT=5000

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_1234567890

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000

# Razorpay Keys (get from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxx

# Environment
NODE_ENV=development
```

#### 1.5 Seed Database

Run the seed script to populate mock data:

```bash
npm run seed
```

**Output:**

```
✓ Admin user created
✓ Customer user created
✓ 8 products created
✅ Database seeded successfully!

Test Credentials:
Admin - Email: admin@swiftcart.com, Password: admin123
Customer - Email: customer@swiftcart.com, Password: customer123
```

#### 1.6 Start Backend Server

```bash
npm run dev
```

**Expected Output:**

```
✓ MongoDB Connected Successfully
✓ Server running on http://localhost:5000
```

---

### Step 2: Frontend Setup

#### 2.1 Navigate to Client Directory

```bash
cd ../client
```

#### 2.2 Install Dependencies

```bash
npm install
```

#### 2.3 Create Environment File

```bash
cp .env.example .env.local
```

#### 2.4 Configure Environment Variables

Edit `.env.local `:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Get your test key from: https://dashboard.razorpay.com/app/keys
# Look for "API Keys" section, copy the "Key ID"
NEXT_PUBLIC_RAZORPAY_KEY=rzp_test_xxxxxxxxxxxxxxxx
```

#### 2.5 Start Frontend Server

```bash
npm run dev
```

**Expected Output:**

```
> temp-app@1.0.0 dev
> next dev

  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
```

---

## 🌐 Access the Application

1. **Open Frontend**: http://localhost:3000
2. **API Health Check**: http://localhost:5000/api/health

---

## 🧪 Testing the Application

### Test Credentials

**Admin Account:**

- Email: `admin@swiftcart.com`
- Password: `admin123`
- Permissions: Manage products, view all orders

**Customer Account:**

- Email: `customer@swiftcart.com`
- Password: `customer123`
- Permissions: Browse products, place orders

### Test Flow

1. **Login**
   - Go to http://localhost:3000/login
   - Enter admin credentials
   - Should redirect to /admin or /products

2. **Browse Products**
   - Navigate to /products
   - View all 8 sample products
   - Filter by category

3. **Add to Cart**
   - Click "Add to Cart" on any product
   - Navigate to /cart
   - Adjust quantities

4. **Checkout**
   - Click "Proceed to Checkout"
   - Fill delivery address
   - Click "Pay with Razorpay"

5. **Razorpay Test Payment**
   - Use test card: `4111 1111 1111 1111`
   - Expiry: Any future date (e.g., 12/25)
   - CVV: Any 3 digits
   - Click "Pay"

6. **Order Confirmation**
   - See order success page with QR code
   - View order details and receipt

---

## 📁 Project Structure

```
production/
├── server/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   └── Order.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   └── orderController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   └── orderRoutes.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── utils/
│   │   │   └── jwt.js
│   │   ├── scripts/
│   │   │   └── seed.js
│   │   └── index.js
│   ├── package.json
│   ├── .env.example
│   └── .env
│
├── client/
│   ├── app/
│   │   └── layout.jsx
│   ├── pages/
│   │   ├── index.jsx          # Home
│   │   ├── login.jsx
│   │   ├── register.jsx
│   │   ├── products.jsx
│   │   ├── cart.jsx
│   │   ├── checkout.jsx
│   │   └── order-success.jsx
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Toast.jsx
│   │   └── Layout.jsx
│   ├── lib/
│   │   ├── apiClient.js
│   │   └── store.js
│   ├── styles/
│   │   └── globals.css
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   └── .env.local
│
└── docs/
    └── SETUP.md
```

---

## 🔧 API Endpoints Reference

### Authentication

```bash
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Products

```bash
GET    /api/products
GET    /api/products/:id
POST   /api/products               (admin only)
PUT    /api/products/:id           (admin only)
DELETE /api/products/:id           (admin only)
```

### Orders

```bash
POST   /api/orders
GET    /api/orders/user
GET    /api/orders/:id
GET    /api/orders/admin/all       (admin only)
PATCH  /api/orders/:id/payment
PATCH  /api/orders/:id/cancel
```

---

## 🐛 Troubleshooting

### Issue: MongoDB Connection Error

**Solution:**

```bash
# Check if MongoDB is running
# If using local MongoDB:
mongod

# If using MongoDB Atlas, ensure:
# 1. IP is whitelisted in Atlas dashboard
# 2. Connection string is correct in .env
# 3. Username and password are correct
```

### Issue: CORS Error in Frontend

**Solution:**

```bash
# Make sure CLIENT_URL in .env matches your frontend URL
CLIENT_URL=http://localhost:3000
```

### Issue: Razorpay Payment Not Working

**Solution:**

```bash
# 1. Verify RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env
# 2. Make sure NEXT_PUBLIC_RAZORPAY_KEY matches RAZORPAY_KEY_ID
# 3. Check that you're using test keys (rzp_test_*)
```

### Issue: Port Already in Use

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Issue: npm install Fails

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

## 📊 Database Models

### User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'user' | 'admin',
  createdAt: Date
}
```

### Product Model

```javascript
{
  name: String,
  description: String,
  price: Number,
  stock: Number,
  category: String,
  image: String,
  qrCode: String,
  discount: Number (0-100),
  createdBy: ObjectId (User),
  createdAt: Date
}
```

### Order Model

```javascript
{
  user: ObjectId (User),
  items: [{
    product: ObjectId (Product),
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  finalAmount: Number,
  paymentStatus: 'pending' | 'completed' |'failed' | 'refunded',
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled',
  razorpayOrderId: String,
  razorpayPaymentId: String,
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    phone: String
  },
  createdAt: Date
}
```

---

## 🚀 Development Commands

### Backend

```bash
npm run dev        # Start with auto-reload (nodemon)
npm run seed       # Populate database with sample data
npm start          # Production start
```

### Frontend

```bash
npm run dev        # Development server
npm run build      # Production build
npm start          # Serve production build
npm run lint       # Run ESLint
```

---

## 📝 Sample API Calls

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@swiftcart.com",
    "password": "admin123"
  }'
```

### Get All Products

```bash
curl http://localhost:5000/api/products
```

### Get Product by ID (After QR Scan)

```bash
curl http://localhost:5000/api/products/63d4f5a2b8c1e2f3g4h5i6j7
```

---

## 🔐 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcryptjs
- ✅ CORS protection
- ✅ Rate limiting (100 requests per 15 min)
- ✅ Security headers with Helmet
- ✅ Input validation
- ✅ Authorization checks

---

## 📱 Features Implemented

### Customer Features

- ✅ User registration and login
- ✅ Browse products by category
- ✅ Search products
- ✅ Add/remove items from cart
- ✅ Adjust item quantities
- ✅ Checkout with delivery address
- ✅ Razorpay payment integration
- ✅ Order history and receipts
- ✅ QR code verification

### Admin Features

- ✅ Admin dashboard
- ✅ Add/edit/delete products
- ✅ View all orders
- ✅ Track order status
- ✅ Inventory management
- ✅ User management

---

## 🔄 Next Steps / Enhancements

- [ ] QR Scanner implementation (html5-qrcode)
- [ ] Order tracking in real-time
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Product reviews
- [ ] Wishlist feature
- [ ] Loyalty points
- [ ] Admin analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Payment refund system

---

## 📚 Useful Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Razorpay Integration Guide](https://razorpay.com/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 💬 Support

For issues or questions:

1. Check the Troubleshooting section
2. Review API endpoint documentation
3. Check environment variables are correctly set
4. Review browser console for frontend errors
5. Check backend logs for API errors

---

**Happy Coding! 🎉**

For a live demo and support, visit: [Your Project Repository]
