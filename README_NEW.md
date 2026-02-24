# 🌊 AquaPure Water Purifier eCommerce Platform

A complete, production-ready eCommerce solution for selling water purifiers with admin management, payment integration, and user authentication.

[![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)](https://github.com)
[![Python](https://img.shields.io/badge/Python-3.8+-blue)](https://python.org)
[![Node.js](https://img.shields.io/badge/Node.js-14+-green)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

---

## 📝 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## ✨ Features

### 🛍️ Customer Features
- **Product Catalog** - Browse 10-20 water purifier products without login
- **Shopping Cart** - Add items, save for later, persistent storage
- **User Authentication** - Secure JWT-based login/signup
- **Wishlist** - Save favorite products for later
- **Checkout** - Smooth checkout process with address management
- **Payment** - Razorpay integration for secure payments
- **Order Tracking** - View order history and status
- **User Profile** - Manage personal information and addresses

### 👨‍💼 Admin Features
- **Dashboard** - Real-time statistics and insights
- **Product Management** - Add, edit, delete products with images
- **Order Management** - View all orders, update status
- **User Management** - View users, change roles, manage accounts
- **Service Management** - Add and manage services
- **Business Info** - Edit company vision, mission, contact info

### 🔒 Security Features
- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt encrypted passwords
- **CORS Protection** - Cross-origin request handling
- **Admin Authorization** - Role-based access control
- **Payment Verification** - Signature verification for payments

---

## 🛠 Tech Stack

### Backend
- **Framework:** FastAPI (Python)
- **Database:** MongoDB Atlas
- **Authentication:** JWT + Bcrypt
- **Payments:** Razorpay
- **Image Hosting:** Cloudinary
- **Deployment:** Render

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** CSS3 + React Icons
- **State:** Context API + localStorage
- **HTTP Client:** Axios
- **Deployment:** Vercel

### Infrastructure
- **Database:** MongoDB Atlas (Cloud)
- **Backend Hosting:** Render
- **Frontend Hosting:** Vercel
- **Image CDN:** Cloudinary
- **Payment Gateway:** Razorpay

---

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

#### Linux/Mac:
```bash
cd backend
chmod +x quick_start.sh
./quick_start.sh
```

#### Windows:
```bash
cd backend
quick_start.bat
```

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Verify setup
python health_check.py

# Seed demo data
python seed_products.py

# Start server
python main.py
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 🔑 Demo Credentials

- **Admin:** `admin@aquapure.com` / `admin123`
- **User:** `user@aquapure.com` / `user123`

### 📍 Access Points
- **Backend API:** http://localhost:5000
- **API Documentation:** http://localhost:5000/docs
- **Frontend:** http://localhost:5173

---

## 📁 Project Structure

```
AquaPure/
│
├── backend/                          # FastAPI Backend
│   ├── app/
│   │   ├── api_v1.py                # Route configuration
│   │   ├── core/
│   │   │   ├── config.py            # Settings
│   │   │   └── security.py          # JWT & Auth logic
│   │   ├── models/                  # MongoDB schemas
│   │   │   ├── user.py
│   │   │   ├── product.py
│   │   │   ├── order.py
│   │   │   ├── extras.py
│   │   │   └── info.py
│   │   ├── routers/                 # API endpoints
│   │   │   ├── auth.py              # Authentication
│   │   │   ├── products.py          # Products
│   │   │   ├── orders.py            # Orders
│   │   │   ├── payments.py          # Razorpay
│   │   │   ├── user.py              # User operations
│   │   │   ├── admin.py             # Admin functions
│   │   │   ├── services.py          # Services
│   │   │   ├── reviews.py           # Reviews
│   │   │   └── info.py              # Business info
│   │   ├── schemas/                 # Request/response models
│   │   └── utils/                   # Utilities
│   ├── main.py                      # Application entry point
│   ├── seed_products.py             # Database seeding
│   ├── health_check.py              # Setup verification
│   ├── quick_start.sh               # Linux/Mac setup script
│   ├── quick_start.bat              # Windows setup script
│   ├── requirements.txt             # Python dependencies
│   └── .env.example                 # Environment variables template
│
├── frontend/                        # React + Vite Frontend
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js             # API calls
│   │   ├── components/              # Reusable components
│   │   ├── context/                 # Global state (Auth, Cart)
│   │   ├── pages/                   # Page components
│   │   ├── App.jsx                  # Main app
│   │   └── main.jsx                 # Entry point
│   ├── public/                      # Static assets
│   ├── vite.config.js              # Vite configuration
│   ├── package.json                # Dependencies
│   └── .env.example                # Environment variables template
│
├── SETUP_COMPLETE.md               # Complete setup guide
├── REFACTORING_SUMMARY.md          # What's been done
└── README.md                       # This file
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Response Format
All responses follow this format:
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional message",
  "pagination": { /* for list endpoints */ }
}
```

### Key Endpoints

#### Authentication
- `POST /auth/register` - Create account
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get profile
- `POST /auth/logout` - Logout

#### Products
- `GET /products` - List all products
- `GET /products/{id}` - Get single product
- `POST /products` - Create product (admin)
- `PUT /products/{id}` - Update product (admin)
- `DELETE /products/{id}` - Delete product (admin)

#### Orders & Payments
- `POST /orders` - Create order
- `GET /orders/myorders` - Get user orders
- `POST /payments/create-order` - Create Razorpay order
- `POST /payments/verify` - Verify payment

#### Admin
- `GET /admin/stats` - Dashboard statistics
- `GET /admin/users` - List all users
- `GET /admin/orders` - List all orders

**Full API documentation available at:** `/docs` (Swagger UI)

---

## 🚀 Deployment

### Deploy Backend to Render

1. Push to GitHub
2. Create new Web Service on [render.com](https://render.com)
3. Connect GitHub repository
4. Configure:
   - Environment: Python 3
   - Build: `pip install -r requirements.txt`
   - Start: `gunicorn main:app --workers 4`
5. Add Environment Variables from `.env`

### Deploy Frontend to Vercel

1. Push to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add Environment: `VITE_API_URL=https://your-backend.onrender.com/api/v1`
4. Deploy

**See [SETUP_COMPLETE.md](SETUP_COMPLETE.md) for detailed deployment instructions.**

---

## 📚 Documentation

- **[SETUP_COMPLETE.md](SETUP_COMPLETE.md)** - Complete setup guide with environment variables
- **[REFACTORING_SUMMARY.md](REFACTORING_SUMMARY.md)** - Summary of all changes and improvements
- **API Docs** - Available at `/docs` when running backend

---

## 🐛 Troubleshooting

### Backend Connection Issues
```bash
python health_check.py
```

### Frontend API Errors
- Check backend is running on correct port
- Verify `VITE_API_URL` in frontend `.env`
- Check CORS configuration in backend

### Database Connection
- Verify `MONGODB_URI` in `.env`
- Check MongoDB Atlas firewall settings
- Ensure IP whitelist includes your machine

**Full troubleshooting guide in [SETUP_COMPLETE.md](SETUP_COMPLETE.md)**

---

## 🤝 Contributing

Contributions are welcome! 

### Development Workflow
1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

### Code Style
- Backend: PEP 8
- Frontend: ESLint configuration included

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For issues or questions:
- Check the documentation in this repo
- Review API documentation at `/docs`
- Check troubleshooting section

---

## 🎯 Roadmap

- [ ] Email notifications (SendGrid)
- [ ] SMS updates (Twilio)
- [ ] Product reviews & ratings
- [ ] Service bookings calendar
- [ ] Coupon/discount codes
- [ ] Analytics dashboard
- [ ] Inventory management
- [ ] Multi-language support

---

## 🙏 Acknowledgments

Built with:
- FastAPI
- React
- MongoDB
- Razorpay
- Cloudinary

---

<p align="center">
Made with ❤️ for pure water solutions
<br>
<strong>AquaPure © 2024</strong>
</p>
