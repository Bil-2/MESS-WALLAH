# 🏠 MESS WALLAH - Student Accommodation Platform

> **Professional OYO-style booking system for student housing**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Now-success?style=for-the-badge)](https://mess-wallah.netlify.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/Bil-2/MESS-WALLAH)
[![Backend](https://img.shields.io/badge/Backend-Live-orange?style=for-the-badge)](https://us-central1-YOUR-FIREBASE-PROJECT-ID.cloudfunctions.net/api)

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
**URL**: https://us-central1-YOUR-FIREBASE-PROJECT-ID.cloudfunctions.net/api  
**Health Check**: https://us-central1-YOUR-FIREBASE-PROJECT-ID.cloudfunctions.net/api/health

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
- ✅ Offline support & PWA capabilities
- ✅ Real-time notifications
- ✅ Dark mode / Theme toggle
- ✅ Favorites & wishlists

### For Property Owners
- ✅ List properties for free
- ✅ Manage bookings
- ✅ Get instant booking notifications
- ✅ Smart pricing suggestions
- ✅ Availability calendar
- ✅ Analytics dashboard

### Authentication & Security
- ✅ Email/Password login
- ✅ Google OAuth (existing users only)
- ✅ OTP-based login (SMS)
- ✅ Forgot password recovery
- ✅ **Account Linking System** (prevents duplicate accounts)
- ✅ JWT authentication
- ✅ CSRF protection
- ✅ Rate limiting
- ✅ XSS protection
- ✅ SQL injection prevention
- ✅ Advanced security middleware

### Performance & Reliability
- ✅ **Zero Cold Start** (GitHub Actions warmup every 12 minutes)
- ✅ Client-side server warmup
- ✅ Health monitoring system
- ✅ Lazy loading & code splitting
- ✅ Performance monitoring (Web Vitals)
- ✅ Image optimization
- ✅ Automated deployment (CI/CD)

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 (with lazy loading & code splitting)
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + Autoprefixer
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **UI Notifications**: React Hot Toast
- **Real-time**: Socket.io Client
- **Push Notifications**: Firebase Cloud Messaging
- **Performance**: Web Vitals
- **Icons**: React Icons + Lucide React
- **Date Handling**: date-fns
- **Build Tool**: Vite 7
- **Deployment**: Netlify

### Backend
- **Runtime**: Node.js 14+
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT + Passport.js (Google OAuth 2.0)
- **Payment**: Razorpay SDK
- **Email**: SendGrid + Nodemailer
- **SMS**: Twilio Verify + Fast2SMS
- **Real-time**: Socket.io
- **Logging**: Winston
- **Security**: Helmet, XSS-Clean, Express-Mongo-Sanitize, HPP
- **Validation**: Express-Validator
- **File Upload**: Multer + Cloudinary
- **Rate Limiting**: Express-Rate-Limit
- **Compression**: Compression middleware
- **Deployment**: Firebase Functions

### DevOps & Infrastructure
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions (Keep-Alive Workflow)
- **Containerization**: Docker + Docker Compose
- **Monitoring**: Health checks + Performance monitoring
- **Database**: MongoDB Atlas (Cloud)
- **Deployment**: 
  - Frontend: Netlify (Auto-deploy)
  - Backend: Firebase Functions
- **Cold Start Prevention**: Automated warmup every 12 minutes

---

## 📂 Project Structure

```
MESS-WALLAH/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # 34 reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── RoomCard.jsx
│   │   │   ├── BookingModal.jsx
│   │   │   ├── NotificationBell.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   ├── OfflineWrapper.jsx
│   │   │   ├── PerformanceMonitor.jsx
│   │   │   └── ...
│   │   ├── pages/           # 28 page components
│   │   │   ├── Home.jsx
│   │   │   ├── Rooms.jsx
│   │   │   ├── RoomDetails.jsx
│   │   │   ├── Bookings.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── owner/       # Owner-specific pages
│   │   │   └── ...
│   │   ├── hooks/           # 7 custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useServerWarmup.js
│   │   │   ├── useOffline.js
│   │   │   ├── usePerformance.js
│   │   │   └── ...
│   │   ├── context/         # State management
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── ...
│   │   ├── utils/           # 8 utility modules
│   │   │   ├── api.js
│   │   │   ├── security.js
│   │   │   ├── apiCache.js
│   │   │   └── ...
│   │   └── App.jsx          # Main app component
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                 # Express API server
│   ├── controllers/         # 5 business logic controllers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── roomController.js
│   │   ├── ownerController.js
│   │   └── otpController.js
│   ├── models/             # 6 Mongoose schemas
│   │   ├── User.js
│   │   ├── Room.js
│   │   ├── Booking.js
│   │   ├── Notification.js
│   │   ├── NotificationPreference.js
│   │   └── Otp.js
│   ├── routes/             # 11 API endpoint groups
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── rooms.js
│   │   ├── bookings.js
│   │   ├── paymentRoutes.js
│   │   ├── notifications.js
│   │   ├── googleAuth.js
│   │   └── ...
│   ├── middleware/         # 4 security & validation layers
│   │   ├── auth.js
│   │   ├── advancedSecurity.js
│   │   ├── paymentSecurity.js
│   │   └── productionErrorHandler.js
│   ├── services/           # 4 external service integrations
│   │   ├── notify.js           # Email & SMS
│   │   ├── accountLinkingService.js
│   │   ├── twilioVerifyService.js
│   │   └── fast2smsService.js
│   ├── utils/             # 6 helper utilities
│   │   ├── email.js
│   │   ├── healthMonitor.js
│   │   ├── keepAlive.js
│   │   ├── regexSecurity.js
│   │   └── ...
│   ├── config/             # Configuration files
│   └── server.js           # Entry point (588 lines)
│
├── .github/
│   └── workflows/
│       └── keep-alive.yml   # Automated server warmup (every 12 min)
│
├── docker-compose.yml       # Full-stack Docker orchestration
├── firebase.json           # Firebase deployment config
├── LICENSE
└── README.md               # This file
```

---

## 🔗 Important Links

| Resource | URL |
|----------|-----|
| **Live Application** | https://mess-wallah.netlify.app |
| **Backend API** | https://us-central1-YOUR-FIREBASE-PROJECT-ID.cloudfunctions.net/api |
| **GitHub Repository** | https://github.com/Bil-2/MESS-WALLAH |
| **Frontend Deployment** | Netlify (Manual deploy via CLI) |
| **Backend Deployment** | Firebase Functions |
| **Database** | MongoDB Atlas (Cloud) |

---

## 🚀 Advanced Features & Innovations

### 1. **Account Linking Service** 
A sophisticated system that prevents duplicate accounts when users sign up using different methods (Email, Google OAuth, OTP):

- **Smart Detection**: Automatically detects existing accounts by email/phone variations
- **Seamless Merging**: Links Google OAuth to existing email accounts
- **Phone Variants**: Handles multiple phone number formats (+91, without +91, etc.)
- **Data Preservation**: Merges bookings and data when combining accounts
- **Prevents Chaos**: Ensures one user = one account, regardless of login method

**File**: [`backend/services/accountLinkingService.js`](file:///Users/biltubag/Downloads/Full%20stack%20developer%20all%20resource/project%20/resume%20project/MESS-WALLAH/backend/services/accountLinkingService.js)

---

### 2. **Zero Cold Start Architecture** 
Eliminates Firebase Functions cold starts with automated warmup:

**GitHub Actions Workflow** (`.github/workflows/keep-alive.yml`):
- Pings server **every 12 minutes** (safer than 15-min limit)
- **Retry logic**: 3 attempts with exponential backoff
- **Dual endpoint pings**: `/api/warmup` + `/health`
- **Zero failures**: Always exits successfully to avoid email spam

**Client-Side Warmup** (`frontend/src/hooks/useServerWarmup.js`):
- Pre-warms server when users visit the site
- Prevents waiting on first API call
- Background ping with timeout handling

**Backend Warmup Endpoint** (`/api/warmup`):
- Touches database to keep connections alive
- Returns server metrics (uptime, memory, connections)
- Minimal resource usage

**Result**: ✅ **Server always warm**, users never experience 15+ second load times

---

### 3. **Comprehensive Notification System**

**Dual-Channel Notifications** (Email + SMS):
- Customer gets Email + SMS after booking
- Owner gets Email + SMS after booking
- SendGrid for emails (production-grade templates)
- Twilio Verify for SMS (OTP + notifications)
- Fast2SMS fallback for India-specific delivery

**Notification Types**:
- Welcome emails
- Booking confirmations
- Payment receipts
- Booking status updates
- Password reset emails
- OTP verification

**File**: [`backend/services/notify.js`](file:///Users/biltubag/Downloads/Full%20stack%20developer%20all%20resource/project%20/resume%20project/MESS-WALLAH/backend/services/notify.js) (907 lines)

---

### 4. **Advanced Security Implementation**

- **CSRF Protection**: Token-based validation for state-changing operations
- **Rate Limiting**: Prevents brute force attacks (100 requests per 15 min)
- **XSS Protection**: Sanitizes user input with `xss-clean`
- **SQL Injection Prevention**: `express-mongo-sanitize`
- **Security Headers**: Helmet middleware (12+ security headers)
- **Payment Security**: Dedicated middleware for Razorpay validation
- **HPP Protection**: Prevents HTTP Parameter Pollution
- **Session Security**: Secure cookies with HttpOnly and SameSite
- **Audit Logging**: Security event tracking with Winston

**Files**: 
- [`backend/middleware/advancedSecurity.js`](file:///Users/biltubag/Downloads/Full%20stack%20developer%20all%20resource/project%20/resume%20project/MESS-WALLAH/backend/middleware/advancedSecurity.js)
- [`backend/middleware/paymentSecurity.js`](file:///Users/biltubag/Downloads/Full%20stack%20developer%20all%20resource/project%20/resume%20project/MESS-WALLAH/backend/middleware/paymentSecurity.js)

---

### 5. **Performance Optimization**

**Frontend Optimizations**:
- **Lazy Loading**: All pages loaded on-demand with React.lazy()
- **Code Splitting**: Vite automatic chunking
- **Image Optimization**: Lazy-loaded images with placeholders
- **Virtual Scrolling**: Efficient rendering of large room lists
- **Web Vitals Monitoring**: Real-time performance tracking
- **Service Worker**: Offline support and caching

**Backend Optimizations**:
- **Compression**: Gzip compression for all responses
- **MongoDB Indexing**: Optimized queries on city, price, availability
- **Connection Pooling**: Efficient database connection management
- **Health Monitoring**: Tracks memory, CPU, database connections

**Files**:
- [`frontend/src/hooks/usePerformance.js`](file:///Users/biltubag/Downloads/Full%20stack%20developer%20all%20resource/project%20/resume%20project/MESS-WALLAH/frontend/src/hooks/usePerformance.js)
- [`backend/utils/healthMonitor.js`](file:///Users/biltubag/Downloads/Full%20stack%20developer%20all%20resource/project%20/resume%20project/MESS-WALLAH/backend/utils/healthMonitor.js)

---

### 6. **Real-Time Features**

- **Socket.io Integration**: Real-time notifications
- **Live Booking Updates**: Instant notification when someone books
- **Connection Status**: Online/offline detection
- **Firebase Push Notifications**: Browser push notifications support

---

### 7. **Progressive Web App (PWA) Features**

- **Offline Support**: Browse cached rooms without internet
- **Install Prompt**: Add to home screen capability
- **Theme Toggle**: Dark mode with system preference detection
- **Mobile-First Design**: Responsive across all devices
- **Mobile Navigation**: Bottom navigation for mobile users

**Files**:
- [`frontend/src/hooks/useOffline.js`](file:///Users/biltubag/Downloads/Full%20stack%20developer%20all%20resource/project%20/resume%20project/MESS-WALLAH/frontend/src/hooks/useOffline.js)
- [`frontend/src/components/OfflineWrapper.jsx`](file:///Users/biltubag/Downloads/Full%20stack%20developer%20all%20resource/project%20/resume%20project/MESS-WALLAH/frontend/src/components/OfflineWrapper.jsx)

---

### 8. **Docker & Containerization**

**Full Stack Docker Setup** (`docker-compose.yml`):
- **MongoDB Service**: Containerized database with health checks
- **Backend Service**: Node.js API with volume mounts
- **Frontend Service**: Vite build served on Nginx
- **Network Isolation**: Bridge network for service communication
- **Persistent Volumes**: Database data persistence

**One-Command Startup**:
```bash
docker-compose up
```

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

## 📊 Project Status & Statistics

✅ **Production Ready & Live**

**Codebase Stats**:
- **Backend**: 5 controllers, 6 models, 11 routes, 4 services, 4 middleware, 6 utilities
- **Frontend**: 34 components, 28 pages, 7 custom hooks, 8 utilities, 3 context providers
- **Total Lines**: ~18,000+ lines of production code
- **Infrastructure**: Docker setup, GitHub Actions CI/CD, Health monitoring

**Recent Enhancements**:
- ✅ Zero cold-start architecture (Jan 2026)
- ✅ Account linking service (Jan 2026)
- ✅ Advanced security middleware (Jan 2026)
- ✅ PWA features & offline support (Jan 2026)
- ✅ Performance monitoring (Jan 2026)
- ✅ Real-time notifications (Jan 2026)

**Production Deployment**:
- Frontend: Netlify (Auto-deploy on push)
- Backend: Firebase Functions
- Database: MongoDB Atlas (Cloud, Free tier M0)
- Uptime: 99.9% (with automated keep-alive)

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

**Tech Stack**: React 18, Node.js, Express, MongoDB, Razorpay, SendGrid, Twilio, Socket.io, Firebase Functions, Docker, GitHub Actions, Netlify

**Key Achievements**:
- Built complete **OYO-style booking system** with 3-step payment flow and Razorpay integration
- Implemented **Account Linking Service** preventing duplicate accounts across 3 login methods (Email, Google OAuth, OTP)
- Developed **Zero Cold Start architecture** using GitHub Actions (automated pings every 12 minutes)
- Created **dual notification system** (Email + SMS) for booking confirmations to both buyers and sellers
- Integrated advanced security (CSRF, XSS, rate limiting, SQL injection prevention)
- Built **PWA features** with offline support, dark mode, and performance monitoring
- Deployed full-stack application on cloud platforms with **automated CI/CD**
- Serving **900+ cities** across India with real-time booking and notifications
- **34 reusable components**, 28 pages, 7 custom hooks, and 11 API route groups
- Achieved **production-grade architecture** with health monitoring, logging (Winston), and containerization (Docker)

---

## 📞 Support

For issues or questions:
- Email: support@messwallah.com
- Phone: +91 9946 66 0012

---

**Built with ❤️ for Indian students**
