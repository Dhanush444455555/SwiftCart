# 🎯 SwiftCart - Quick Start Guide

## ⚡ Get Running in 5 Minutes

### Terminal 1: Backend

```bash
cd production/server
npm install
npm run seed
npm run dev
```

### Terminal 2: Frontend

```bash
cd production/client
npm install
npm run dev
```

### Browser

```
Frontend: http://localhost:3000
Backend API: http://localhost:5000/api
```

---

## 🔓 Login Credentials (After Seed)

### Admin

- Email: `admin@swiftcart.com`
- Password: `admin123`

### Customer

- Email: `customer@swiftcart.com`
- Password: `customer123`

---

## 📍 Key Pages

| URL              | Purpose            |
| ---------------- | ------------------ |
| `/`              | Home page          |
| `/login`         | User login         |
| `/register`      | New user signup    |
| `/products`      | Product catalog    |
| `/cart`          | Shopping cart      |
| `/checkout`      | Payment checkout   |
| `/order-success` | Order confirmation |
| `/admin`         | Admin dashboard    |

---

## 💳 Test Payment

Use Razorpay test card:

- **Card**: 4111 1111 1111 1111
- **Expiry**: 12/25
- **CVV**: 123

---

## 🚨 If Something Fails

### Backend won't start

```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Try again
npm run dev
```

### Frontend can't connect to API

- Check `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
- Ensure backend is running on port 5000
- Clear browser cache

### Database connection fails

- Ensure MongoDB is installed and running
- Check `MONGODB_URI` in `.env` is correct
- For MongoDB Atlas: add your IP to whitelist

---

## 📚 Documentation

- **Full Setup Guide**: `docs/SETUP.md`
- **API Documentation**: `docs/README.md`
- **Architecture**: See folder structure below

---

## 🏗️ Project Structure

```
production/
├── server/              ← Backend API (Express.js)
├── client/              ← Frontend (Next.js)
└── docs/                ← Documentation
```

---

## ✅ Features Checklist

- ✅ User Authentication (JWT)
- ✅ Product Catalog
- ✅ Shopping Cart
- ✅ Razorpay Payment
- ✅ Order Management
- ✅ Admin Dashboard
- ✅ Security (Helmet, Rate Limiting)
- ✅ Error Handling
- ✅ Responsive Design (Tailwind)
- ✅ Toast Notifications

---

## 🔧 Technology Stack

**Backend:**

- Node.js + Express
- MongoDB + Mongoose
- JWT + bcryptjs
- Razorpay SDK

**Frontend:**

- Next.js 14
- React
- Tailwind CSS
- Zustand (State Management)
- Axios
- React Hot Toast

---

## 🎓 What's Included

✅ Complete backend with all APIs
✅ Complete frontend with all pages
✅ User authentication
✅ Payment integration
✅ Product management
✅ Order management
✅ Admin dashboard
✅ Seed data (8 products + 2 test users)
✅ Environment configuration
✅ Security middleware
✅ Error handling
✅ Comprehensive documentation

---

## 🚀 Ready to Deploy?

1. Update MongoDB URI to production database
2. Set strong JWT_SECRET
3. Get production Razorpay keys
4. Setup environment variables
5. Run: `npm run build` (frontend)
6. Deploy to Vercel (frontend) & Heroku/Railway (backend)

---

## 📞 Need Help?

1. Check `docs/SETUP.md` for detailed setup
2. Review `docs/README.md` for API docs
3. Check error messages in browser console
4. Check server logs in terminal

---

**Happy Shopping! 🛒**
