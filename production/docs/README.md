# SwiftCart - QR-Based Smart Retail Checkout System

A production-ready web application for scanning product QR codes, managing shopping carts, processing digital payments, and admin dashboard.

## 🏗️ Project Structure

```
production/
├── server/                    # Express backend
│   ├── src/
│   │   ├── models/           # MongoDB schemas
│   │   ├── routes/           # API routes
│   │   ├── controllers/      # Business logic
│   │   ├── middleware/       # Auth, error handling
│   │   ├── config/           # Database config
│   │   ├── utils/            # JWT utilities
│   │   ├── scripts/          # Seed script
│   │   └── index.js          # Main server
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── client/                    # Next.js frontend
│   ├── pages/                # App pages
│   ├── components/           # Reusable components
│   ├── lib/                  # Utilities (API, store)
│   ├── context/              # React context
│   ├── styles/               # Tailwind CSS
│   ├── package.json
│   ├── .env.example
│   └── next.config.js
│
├── docs/                      # Documentation
└── README.md                 # This file
```

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, CORS, Rate Limiting
- **Password Hashing**: bcryptjs

### Frontend

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **QR Scanner**: html5-qrcode
- **Notifications**: React Hot Toast
- **Payments**: Razorpay

## 📋 Prerequisites

- Node.js v18+ and npm or yarn
- MongoDB (local or cloud instance)
- Razorpay account (for payment integration)

## 🚀 Setup Instructions

### 1. Backend Setup

```bash
cd production/server

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Edit .env with your credentials
# MONGODB_URI=mongodb://localhost:27017/swiftcart
# JWT_SECRET=your-secret-key
# RAZORPAY_KEY_ID=your_key
# RAZORPAY_KEY_SECRET=your_secret
```

### 2. Seed Database

```bash
# From production/server directory
npm run seed

# This creates:
# - Admin user: admin@swiftcart.com / admin123
# - Customer user: customer@swiftcart.com / customer123
# - 8 sample products
```

### 3. Start Backend Server

```bash
npm run dev
# Server runs on http://localhost:5000
```

### 4. Frontend Setup

```bash
cd production/client

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Update with your Razorpay key
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
# NEXT_PUBLIC_RAZORPAY_KEY=your_razorpay_key_id
```

### 5. Start Frontend Server

```bash
npm run dev
# Frontend runs on http://localhost:3000
```

## 🔐 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details (for QR scan)
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders

- `POST /api/orders` - Create order
- `GET /api/orders/user` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/admin/all` - Get all orders (admin only)
- `PATCH /api/orders/:id/payment` - Update payment status
- `PATCH /api/orders/:id/cancel` - Cancel order

## 🧪 Test Credentials

After running seed script:

### Admin Account

- Email: `admin@swiftcart.com`
- Password: `admin123`
- Access: Product management, order management

### Customer Account

- Email: `customer@swiftcart.com`
- Password: `customer123`
- Access: Scan products, place orders, view order history

## 📱 Key Features

### For Customers

1. **QR Scanner**: Scan product QR codes to add to cart
2. **Shopping Cart**: Add/remove items, adjust quantities
3. **Checkout**: Razorpay integration for secure payments
4. **Order History**: View all past orders and receipts
5. **Product Search**: Find products by category or name

### For Admin

1. **Product Management**: Add, edit, delete products
2. **Order Management**: View all orders, track status
3. **Inventory Control**: Manage stock levels
4. **Order Analytics**: View sales and order statistics

## 🔄 Workflow

1. **Customer**: Scans QR code on product
2. **System**: Fetches product details from backend
3. **Customer**: Adds product to cart, adjusts quantity
4. **Customer**: Proceeds to checkout
5. **Payment**: Razorpay processes payment
6. **Backend**: Creates order, reduces stock
7. **Customer**: Receives receipt with QR code

## 🌐 Environment Variables

### Backend (.env)

```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
NODE_ENV=development
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_RAZORPAY_KEY=your_razorpay_public_key
```

## 🚢 Deployment Ready

The codebase includes production-ready features:

- ✅ Environment variable management
- ✅ Error handling middleware
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Security headers (Helmet)
- ✅ Modular architecture
- ✅ Proper logging
- ✅ Database abstraction

### Deployment Steps

1. Update MongoDB to production instance
2. Generate secure JWT_SECRET
3. Set environment variables in production
4. Build frontend: `npm run build`
5. Deploy to hosting (Vercel for frontend, Heroku/Railway for backend)

## 📚 Frontend Pages

- `/` - Home page
- `/login` - User login
- `/register` - User registration
- `/scanner` - QR code scanner
- `/products` - Product listing
- `/products/[id]` - Product details
- `/cart` - Shopping cart
- `/checkout` - Checkout page
- `/payment` - Payment processing
- `/order-success` - Order confirmation
- `/order-history` - User's orders
- `/admin` - Admin dashboard
- `/admin/products` - Product management
- `/admin/orders` - Order management

## 🔧 Development

### Backend Development

```bash
cd server
npm run dev # Use nodemon for auto-reload
```

### Frontend Development

```bash
cd client
npm run dev # Hot reload enabled
```

### Build for Production

```bash
# Backend
cd server
# No build needed, just use npm start

# Frontend
cd client
npm run build
npm start
```

## 📖 API Usage Example

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

### Get Products

```bash
curl http://localhost:5000/api/products
```

### Get Product by ID (After QR Scan)

```bash
curl http://localhost:5000/api/products/productId123
```

### Create Order

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "items": [
      {"productId": "id1", "quantity": 2},
      {"productId": "id2", "quantity": 1}
    ],
    "deliveryAddress": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    }
  }'
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- CORS protection
- Rate limiting (100 requests per 15 minutes)
- Security headers with Helmet
- Input validation on all endpoints
- Authorization checks for admin routes

## 🐛 Troubleshooting

### MongoDB Connection Failed

- Ensure MongoDB service is running
- Check MONGODB_URI in .env
- For cloud MongoDB, add IP to whitelist

### API Port Already in Use

```bash
# Kill process on port 5000
# On Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# On Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### Frontend Can't Connect to Backend

- Check API_URL in .env.local
- Verify backend server is running
- Check CORS settings in server

## 💡 Future Enhancements

- Real-time notifications for orders
- SMS/Email notifications
- Product reviews and ratings
- Wishlist feature
- Multiple payment methods
- Loyalty points system
- Analytics dashboard
- Mobile app (React Native)

## 📄 License

MIT License - Feel free to use this project

## 👥 Support

For issues or questions, please create an issue in the repository or contact support.

---

**Happy Coding!** 🚀
