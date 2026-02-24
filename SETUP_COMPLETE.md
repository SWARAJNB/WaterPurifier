# 🌊 AquaPure Water Purifier eCommerce - Complete Setup Guide

A modern, scalable water purifier eCommerce platform with admin dashboard, payment integration, and real-time order management.

## 📋 Project Overview

**Tech Stack:**
- **Backend:** FastAPI (Python) + MongoDB Atlas
- **Frontend:** React + Vite
- **Payment:** Razorpay (India-friendly)
- **Host:** Render (Backend) + Vercel (Frontend)
- **Images:** Cloudinary

## 🚀 Quick Start

### Prerequisites
- Python 3.8+ 
- Node.js 14+
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image uploads)
- Razorpay account (for payments)

---

## 🔧 BACKEND Setup

### Step 1: Clone & Navigate
```bash
cd backend
```

### Step 2: Setup Python Virtual Environment
```bash
python -m venv venv

# On Windows:
venv\Scripts\activate

# On Mac/Linux:
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Create .env File
Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with:
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/waterpurifier
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
JWT_SECRET=your-secret-key-here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret
WHATSAPP_NUMBER=919999999999
```

### Step 5: Seed Demo Data
```bash
python seed_products.py
```

This creates:
- 15 demo water purifier products
- Admin user: `admin@aquapure.com` / `admin123`
- Regular user: `user@aquapure.com` / `user123`

### Step 6: Run Server
```bash
python main.py
```

Server runs on: `http://localhost:5000`

API Docs: `http://localhost:5000/docs`

---

## 🎨 FRONTEND Setup

### Step 1: Navigate & Install
```bash
cd frontend
npm install
```

### Step 2: Create .env File
```bash
cp .env.example .env
```

Add API URL:
```
VITE_API_URL=http://localhost:5000/api/v1
```

### Step 3: Run Development Server
```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

### Step 4: Build for Production
```bash
npm run build
```

---

## 📚 API Endpoints

### Authentication
```
POST   /api/v1/auth/register       # Create account
POST   /api/v1/auth/login          # Login user
POST   /api/v1/auth/logout         # Logout
GET    /api/v1/auth/profile        # Get user profile
POST   /api/v1/auth/verify-token   # Check token validity
```

### Products
```
GET    /api/v1/products            # Get all products (paginated)
GET    /api/v1/products/{id}       # Get single product
POST   /api/v1/products            # Create product (admin only)
PUT    /api/v1/products/{id}       # Update product (admin only)
DELETE /api/v1/products/{id}       # Delete product (admin only)
```

### Cart & Wishlist
```
GET    /api/v1/user/cart           # Get shopping cart
POST   /api/v1/user/cart           # Add to cart
DELETE /api/v1/user/cart/{id}      # Remove from cart
POST   /api/v1/user/wishlist/{id}  # Toggle wishlist
```

### Orders & Payments
```
POST   /api/v1/orders              # Create order
GET    /api/v1/orders/myorders     # Get user orders
POST   /api/v1/payments/create-order     # Create Razorpay order
POST   /api/v1/payments/verify           # Verify payment
```

### Admin Panel
```
GET    /api/v1/admin/stats         # Dashboard stats
GET    /api/v1/admin/users         # Get all users
GET    /api/v1/admin/orders        # Get all orders
PUT    /api/v1/admin/services      # Manage services
```

---

## 🔐 Demo Credentials

### Admin Account
- **Email:** admin@aquapure.com
- **Password:** admin123

### Regular User
- **Email:** user@aquapure.com
- **Password:** user123

---

## 🗂️ Project Structure

```
backend/
├── app/
│   ├── api_v1.py              # Route includes
│   ├── core/
│   │   ├── config.py          # Settings
│   │   └── security.py        # JWT/Auth logic
│   ├── models/                # MongoDB models
│   │   ├── user.py
│   │   ├── product.py
│   │   ├── order.py
│   │   └── extras.py
│   ├── routers/               # API endpoints
│   │   ├── auth.py
│   │   ├── products.py
│   │   ├── orders.py
│   │   ├── payments.py
│   │   ├── admin.py
│   │   └── user.py
│   └── schemas/               # Pydantic models
├── main.py                    # App entry point
├── seed_products.py           # Demo data
└── requirements.txt

frontend/
├── src/
│   ├── api/                   # API calls
│   ├── components/            # Reusable components
│   ├── context/               # Auth, Cart context
│   ├── pages/                 # Page components
│   ├── App.jsx
│   └── main.jsx
├── vite.config.js
└── package.json
```

---

## 🔄 Workflow

### User Registration & Login
1. User fills registration form
2. Backend creates account with bcrypt hashed password
3. JWT token generated and returned
4. Token stored in localStorage
5. Token automatically attached to all API requests

### Adding to Cart
1. User clicks "Add to Cart" (no login required)
2. Product added to localStorage cart
3. On login, cart syncs with database
4. Cart persists after logout if user logs back in

### Making a Purchase
1. User adds items to cart
2. Clicks checkout
3. System creates orders in database
4. Client initiates Razorpay payment
5. Payment verified via signature
6. Order marked as paid & confirmed
7. Cart cleared from database

### Admin Functions
1. Login with admin account
2. Access `/admin-panel`
3. Add/edit/delete products
4. View all orders
5. Update order status
6. Manage users

---

## 📦 Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `MONGODB_URI` | Database connection | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Token signing key | `secretkey123456` |
| `CLOUDINARY_*` | Image uploads | API credentials from Cloudinary |
| `RAZORPAY_*` | Payment processing | API credentials from Razorpay |
| `CORS_ORIGINS` | Allowed frontend URLs | `http://localhost:5173` |

---

## 🚀 Deployment

### Deploy Backend to Render

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create Render Service**
   - Go to [render.com](https://render.com)
   - Create New > Web Service
   - Connect GitHub repository
   - Environment: Python 3
   - Build: `pip install -r requirements.txt`
   - Start: `gunicorn main:app --workers 4`

3. **Add Environment Variables**
   - In Render dashboard: Settings > Environment
   - Add `MONGODB_URI`, `JWT_SECRET`, etc.

### Deploy Frontend to Vercel

1. **Build Project**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import project from GitHub
   - Add Environment: `VITE_API_URL=https://your-backend.onrender.com/api/v1`
   - Deploy

---

## 🐛 Troubleshooting

### "Connection refused" error
- Check if MongoDB is running (cloud or local)
- Verify `MONGODB_URI` is correct
- Check firewall/network policies

### "CORS error" on frontend
- Ensure `CORS_ORIGINS` includes frontend URL
- Check that backend is running on correct port

### "Payment verification failed"
- Verify Razorpay credentials are correct
- Check timezone consistency
- Debug signature generation

### "Product not showing"
- Run `python seed_products.py` to populate data
- Check MongoDB connection
- Verify product documents exist

---

## 📝 Key Features Implemented

✅ User Registration & JWT Authentication
✅ Password Hashing with Bcrypt
✅ Shopping Cart with localStorage sync
✅ Wishlist functionality
✅ Razorpay Payment Integration
✅ Order Management
✅ Admin Dashboard
✅ Product Management
✅ CORS & Security Headers
✅ Error Handling Middleware
✅ API Response Format Standardization
✅ MongoDB Indexing for Performance

---

## 🔮 Future Enhancements

- [ ] Email notifications (SendGrid)
- [ ] SMS updates (Twilio)
- [ ] Product reviews & ratings
- [ ] Service bookings
- [ ] Coupon/discount codes
- [ ] Analytics dashboard
- [ ] Inventory alerts
- [ ] Multi-currency support

---

## 📞 Support & Contact

For issues or questions:
- Check /docs API documentation
- Review error logs in console
- Consult MongoDB documentation
- Visit Razorpay integration docs

---

## 📄 License

This project is open source and released under the MIT License.

---

**Made with ❤️ for pure water**
