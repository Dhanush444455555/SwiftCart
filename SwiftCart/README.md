# SwiftCart — Smart Self-Checkout & AI-Powered Retail Platform

[![React 19](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-MySQL%20%7C%20TiDB%20Cloud-00758F?logo=mysql&logoColor=white)](https://tidbcloud.com/)
[![Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)](https://swift-cart-tawny.vercel.app)

> **Live Demo**: [https://swift-cart-tawny.vercel.app](https://swift-cart-tawny.vercel.app)  
> **API Endpoint**: [https://swift-cart-tawny.vercel.app/api/products](https://swift-cart-tawny.vercel.app/api/products)

---

## 📌 Executive Summary & Architecture

SwiftCart is a modern full-stack web application designed to eliminate supermarket checkout queues through in-store mobile barcode scanning, personalized real-time AI deal prediction, live crowd density telemetry, and digital payment settlement.

```
                              ┌───────────────────────────────────┐
                              │     Client Layer (React 19)       │
                              │  - Redux Toolkit State Store      │
                              │  - HTML5 QR/Barcode Scanner       │
                              │  - Framer Motion Fluid Animations │
                              └─────────────────┬─────────────────┘
                                                │ REST API / TLS
                                                ▼
                              ┌───────────────────────────────────┐
                              │     Server Layer (Express.js)     │
                              │  - JWT Authentication & RBAC      │
                              │  - AI Predictive Offer Engine     │
                              │  - Order Stock Transaction Locks  │
                              │  - Helmet.js & Input Sanitization │
                              └─────────────────┬─────────────────┘
                                                │ TLS / Connection Pool
                                                ▼
                              ┌───────────────────────────────────┐
                              │   Cloud Database (TiDB / MySQL)   │
                              │  - Users, Products, Carts, Orders │
                              │  - Atomic Transaction Support     │
                              │  - Distributed Serverless Scale   │
                              └───────────────────────────────────┘
```

---

## 🏗️ Clean Project Structure

```
SwiftCart/
├── frontend/                     # React 19 Client (Vite)
│   ├── src/
│   │   ├── components/           # Modular UI Components (Cart, Common, CrowdSystem, Layout)
│   │   ├── hooks/                # Custom React Hooks (useCart, useAuth, useDebounce)
│   │   ├── pages/                # Routed Views (Home, Search, Scan, Cart, Checkout, Admin, Offers)
│   │   ├── services/             # Axios API Client Modules (productService, authService, etc.)
│   │   ├── store/                # Redux Toolkit Global State (auth, cart, products)
│   │   └── utils/                # Utility helpers (currency formatting, date formatters)
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                      # Node.js + Express REST API
│   ├── controllers/              # Route Controllers (authController, productController, etc.)
│   ├── middleware/               # Auth Guard, Role Check, Error Handling, Validation
│   ├── models/                   # Pure SQL Query Mappers (User, Product, Cart, Order, Feedback)
│   ├── routes/                   # Endpoint Declarations (auth, products, cart, orders, offers, admin)
│   ├── services/                 # AI Multi-factor Offer Prediction Engine
│   ├── data/                     # Seeders for Catalog Initialization
│   ├── db.js                     # Connection Pool with SSL & Failover Handling
│   ├── initDb.js                 # Database DDL Table Initializer
│   ├── server.js                 # Express Application Entry Point
│   └── package.json
│
├── connect_tidb.bat              # 1-Click Interactive MySQL Shell to TiDB Cloud
├── run_swiftcart.bat             # 1-Click Local Development Pipeline
└── vercel.json                   # Cloud Serverless Monorepo Configuration
```

---

## 🚀 Key Features

1. **Queue-Free Self-Checkout**: Customers scan item barcodes in aisles, accumulate cart items, and pay online via Razorpay or simulated payment rails.
2. **AI-Powered Predictive Offers**: Multi-factor scoring engine evaluating association rules, time-of-day boosts, and category affinity to recommend personalized savings.
3. **Live Crowd Telemetry & Store Locator**: Integrates OpenStreetMap Overpass API for real-time customer density tracking and in-store aisle wayfinding.
4. **Cloud Database (TiDB / MySQL)**: Distributed MySQL-compatible relational schema ensuring ACID transaction guarantees and real-time inventory decrement.
5. **Role-Based Admin Dashboard**: Complete CRUD controls for product inventory, real-time analytics, user orders, and customer feedback.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Redux Toolkit, Framer Motion, Lucide Icons, Axios, Tailwind CSS |
| **Backend** | Node.js, Express 5, `mysql2/promise`, JWT, bcryptjs, Helmet, Express Validator |
| **Database** | TiDB Cloud (Serverless MySQL 8.0 Wire Protocol), TLS 1.2+ Connection Pooling |
| **Hosting & CI/CD** | Vercel Serverless Edge, GitHub Actions |

---

## ⚙️ Local Development Setup

### Prerequisites
* **Node.js**: v18 or higher
* **MySQL** or **TiDB Cloud account**

### 1. Clone the repository
```bash
git clone https://github.com/dhanush444455555/SwiftCart.git
cd SwiftCart/SwiftCart
```

### 2. Configure Environment Variables
Inside `backend/.env`:
```env
# TiDB Cloud / MySQL Database
MYSQL_HOST=gateway01.ap-northeast-1.prod.aws.tidbcloud.com
MYSQL_PORT=4000
MYSQL_USER=nfGig79oo2Esd4c.root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=swiftcart
MYSQL_SSL=true

JWT_SECRET=your_secret_key
PORT=5000
```

### 3. Initialize Database & Run
```bash
# Option A: One-click runner (Windows)
run_swiftcart.bat

# Option B: Manual setup
cd frontend && npm install && npm run build
cd ../backend && npm install
node initDb.js
node server.js
```
Open **`http://localhost:5000`** in your browser.

---

## 🔐 Default Admin Credentials
* **Email**: `admin@swiftcart.com`
* **Password**: `admin123`
* **Dashboard**: `http://localhost:5000/admin` (or `https://swift-cart-tawny.vercel.app/admin`)

---

## 📄 License
This project is licensed under the ISC License.

