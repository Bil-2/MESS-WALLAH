# 🏠 MESS WALLAH - Student Accommodation Platform

> **Professional OYO-style booking system for student housing**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Now-success?style=for-the-badge)](https://mess-wallah.netlify.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/Bil-2/MESS-WALLAH)
[![Backend](https://img.shields.io/badge/Backend-Live-blueviolet?style=for-the-badge)](https://mess-wallah.onrender.com)

---

## 🚀 Live Application

**Access the live application here:**

### 🌐 Frontend (User Interface)
**URL**: https://mess-wallah.netlify.app

**Features**:
- Browse student accommodation
- Search rooms by city, price, amenities
- Professional 3-step booking with payment
- User dashboard & bookings
- Owner dashboard for property management

### ⚙️ Backend (API Server)
**URL**: https://mess-wallah.onrender.com  
**Health Check**: https://mess-wallah.onrender.com/health

**Tech Stack**:
- Node.js + Express
- MongoDB Atlas (Cloud Database)
- Razorpay Payment Gateway
- SendGrid Email Service
- Twilio SMS/OTP Service

### 🗄️ Database
**MongoDB Atlas** (Fully Managed Cloud Database)
- **Cluster**: `bil-2.xu2re3p.mongodb.net`
- **Database**: `mess-wallah`
- **Collections**: Users, Rooms, Bookings, Notifications, OTPs

---

## 📱 Quick Demo

1. **Visit**: https://mess-wallah.netlify.app
2. **Browse Rooms**: No login required
3. **Register**: Create account (Email + OTP verified)
4. **Book a Room**: 3-step process (Details → Payment → Confirmation)
5. **Get Notifications**: Email + SMS to both buyer & seller

---

## ✨ Key Features

### For Students
- ✅ Browse 900+ cities across India
- ✅ Advanced filters (price, amenities, room type)
- ✅ Secure OYO-style booking
- ✅ Razorpay payment integration
- ✅ Email + SMS notifications
- ✅ View booking history

### For Property Owners
- ✅ List properties for free
- ✅ Manage bookings
- ✅ Get instant booking notifications
- ✅ Smart pricing suggestions
- ✅ Availability calendar

### Authentication & Security
- ✅ Email/Password login
- ✅ Google OAuth (existing users only)
- ✅ OTP-based login (SMS)
- ✅ Forgot password recovery
- ✅ JWT authentication
- ✅ CSRF protection
- ✅ Rate limiting

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **UI Notifications**: React Hot Toast
- **Deployment**: Netlify

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT + Passport.js
- **Payment**: Razorpay SDK
- **Email**: SendGrid
- **SMS**: Twilio Verify
- **Deployment**: Render

### DevOps
- **Version Control**: Git + GitHub
- **CI/CD**: Automated deployment (Netlify + Render)
- **Monitoring**: Backend health checks
- **Database**: MongoDB Atlas (Cloud)

---

## 📂 Project Structure

```
MESS-WALLAH/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # Auth & state management
│   │   ├── utils/           # Helper functions
│   │   └── App.jsx          # Main app component
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                 # Express API server
│   ├── controllers/         # Business logic
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth, validation, security
│   ├── services/           # Email, SMS, notifications
│   ├── config/             # Configuration files
│   └── server.js           # Entry point
│
├── docker-compose.yml       # Docker orchestration
├── render.yaml             # Render deployment config
└── README.md               # This file
```

---

## 🔗 Important Links

| Resource | URL |
|----------|-----|
| **Live Application** | https://mess-wallah.netlify.app |
| **Backend API** | https://mess-wallah.onrender.com |
| **GitHub Repository** | https://github.com/Bil-2/MESS-WALLAH |
| **Frontend Deployment** | Netlify (Manual deploy via CLI) |
| **Backend Deployment** | Render (Auto-deploy from `main` branch) |
| **Database** | MongoDB Atlas (Cloud) |

---

## 🎯 Core Functionality

### 1. User Registration & Authentication
- Email/Password signup with OTP verification
- Google OAuth (for existing users)
- Phone OTP login
- Forgot password with email recovery
- **Security**: Only registered users can use all auth methods

### 2. Room Browsing
- Public access (no login required)
- Search by city, price, amenities
- Filter by room type, features
- Sort by price, rating

### 3. Booking System (OYO-Style)
**Step 1: Booking Details**
- Check-in date selection
- Duration (1-12 months)
- Guest information
- Price breakdown (Rent + Security + Platform Fee + GST)

**Step 2: Payment**
- Razorpay integration
- Secure payment gateway
- Test mode available

**Step 3: Confirmation**
- Booking ID generation
- **Dual notifications**: Email + SMS to both buyer AND seller
- Payment receipt

### 4. Notifications
- Email (SendGrid)
- SMS (Twilio)
- In-app notifications
- Sent to both parties upon booking confirmation

---

## 🔐 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=https://mess-wallah.onrender.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Backend (.env)
```env
# Server
PORT=5001
NODE_ENV=production
FRONTEND_URL=https://mess-wallah.netlify.app

# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

# Payment (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email (SendGrid)
SENDGRID_API_KEY=your_sendgrid_key
FROM_EMAIL=your_verified_email

# SMS (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_VERIFY_SERVICE_SID=your_verify_service_sid
```

---

## 📊 Project Status

✅ **Completed Features**:
- User authentication (Email, Google, OTP)
- Room browsing and search
- Professional booking system with payment
- Dual notification system
- Owner dashboard
- Strict authentication validation
- Production deployment

🚀 **Live & Production Ready**

---

## 👨‍💻 Developer

**Biltu Bag**
- Email: biltubag29@gmail.com
- GitHub: [@Bil-2](https://github.com/Bil-2)
- Project: MESS WALLAH - Student Accommodation Platform

---

## 📄 License

This project is proprietary software developed for MESS WALLAH.

---

## 🎓 For Resume / Portfolio

**Project Name**: MESS WALLAH - Student Accommodation Booking Platform  
**Role**: Full Stack Developer  
**Duration**: 2024-Present  
**Live Demo**: https://mess-wallah.netlify.app  
**GitHub**: https://github.com/Bil-2/MESS-WALLAH

**Tech Stack**: React, Node.js, Express, MongoDB, Razorpay, SendGrid, Twilio, Docker, Netlify, Render

**Key Achievement**:
- Built complete OYO-style booking system with 3-step payment flow
- Implemented secure authentication with multiple methods (Email, Google OAuth, OTP)
- Integrated Razorpay payment gateway with dual notification system
- Deployed on cloud platforms with automated CI/CD
- Serving 900+ cities with real-time booking and notifications

---

## 📞 Support

For issues or questions:
- Email: support@messwallah.com
- Phone: +91 9946 66 0012

---

**Built with ❤️ for Indian students**
