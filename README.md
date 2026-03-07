# MESS WALLAH - Student Accommodation Platform

> **Enterprise-Grade Rental Booking & Property Management System**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Now-success?style=for-the-badge)](https://mess-wallah.netlify.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/Bil-2/MESS-WALLAH)
[![Backend](https://img.shields.io/badge/Backend-Live-orange?style=for-the-badge)](https://us-central1-YOUR-FIREBASE-PROJECT-ID.cloudfunctions.net/api)

---

## Live Application

**Access the live application here:**

### Frontend (User Interface)
**URL**: https://mess-wallah.netlify.app

**Features**:
- 8,460+ Seeded Rooms with Ghost Owner Generation
- Search rooms by city, price, and smart rank algorithms
- Professional 3-step booking with payment
- Auto-saving Profiles (Aadhar, Age, Profession)
- Instant "Contact Owner" zero-latency reveals

### Backend (API Server)
**URL**: https://us-central1-YOUR-FIREBASE-PROJECT-ID.cloudfunctions.net/api  
**Health Check**: https://us-central1-YOUR-FIREBASE-PROJECT-ID.cloudfunctions.net/api/health

**Tech Stack**:
- Node.js + Express
- MongoDB Atlas (Cloud Database)
- Razorpay Payment Gateway
- SendGrid Email Service (with Analytics Tracking)
- Twilio SMS/OTP Service

---

## Data Lifecycle Architecture (OYO / Booking.com Style)

MESS WALLAH uses a highly advanced **Event-Driven Database Architecture**. Instead of just storing the *current state* of a room or user, the platform records a permanent history of every cycle, enabling enterprise-level reporting.

### The 5 Core Tracking Engines:
1. **`RevenueEvent`**: A banking ledger that records every deposit, rent payment, and platform fee.
2. **`RoomAvailabilityLog`**: Tracks the exact history of when a room went offline, changed price, or was booked.
3. **`GuestHistory`**: A permanent hotel-style register storing past tenants, physical check-in/out dates, and two-way reviews.
4. **`AnalyticsEvent`**: Internal Google Analytics tracking every `room_view`, `booking_start`, and `contact_click`.
5. **`NotificationLog`**: An audit trail permanently saving every email and WhatsApp sent to buyers and sellers.

---

## Key Features

### For Students (Tenants)
- **Massive Database:** Browse 8,460+ rooms across India.
- **Smart Search:** Algorithmic ranking based on Verified Owners and Views.
- **Secure Booking:** OYO-style booking sequence.
- **Auto-Save Profile:** Enter Aadhar, Age, and Profession once; it permanently saves to your account.
- **Instant Contact:** Click to instantly reveal verified Owner Names & Phones.

### For Property Owners
- **Quality Scores:** 0-100% metrics telling you exactly how to improve your listing.
- **Verified Badges:** Upload Aadhar to boost algorithmic search ranking.
- **Traffic Analytics:** See exactly how many people viewed your room.
- **Automated Revenue Tracking:** `RevenueEvents` capture every deposit instantly.

### Security & Reliability
- **100% API Health:** Zero 500 or 404 errors across all routes.
- **Zero Code Bloat:** React tree professionally swept of all orphaned dependencies and dummy files.
- **Zero Cold Start:** Server auto-pings every 12 minutes to prevent sleep.
- **ESLint Compliant:** Automated production builds run in under 2.5 seconds.
- **Account Linking:** Prevents duplicate accounts when users mix Google OAuth, Email, and OTP logins.

---

## Technology Stack

### Frontend
- **Framework**: React 18 (Vite 7 compiler)
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + Autoprefixer
- **State**: React Context API
- **HTTP/Data**: Axios

### Backend
- **Runtime**: Node.js 14+
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT + Passport.js (Google OAuth 2.0)
- **Payment**: Razorpay SDK
- **Email**: SendGrid + Nodemailer

### DevOps & Infrastructure
- **Containerization**: Docker + Docker Compose
- **Database**: MongoDB Atlas (Cloud)
- **Frontend Host**: Netlify
- **Backend Host**: Firebase Functions

---

## Project Structure

```
MESS-WALLAH/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # Reusable UI elements
│   │   ├── pages/           # Route views (Home, Rooms, Dashboard)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── context/         # Global state management
│   │   └── utils/           # Frontend helpers
│
├── backend/                 # Express API server
│   ├── controllers/         # Business logic (Rooms, Bookings, Auth)
│   ├── models/             # Mongoose Schemas (11 Total Models)
│   │   ├── Room.js, User.js, Booking.js
│   │   └── AnalyticsEvent.js, RevenueEvent.js, GuestHistory.js
│   ├── routes/             # API endpoints
│   ├── middleware/         # Security (Rate limits, CSRF, Sanitize)
│   ├── services/           # Lifecycle tracking & Integrations
│   └── utils/             # Notification loggers, PDF generators
│
├── docker-compose.yml       # Local stack orchestration
└── README.md               # Project documentation
```

---

## For Resume / Portfolio

**Project Name**: MESS WALLAH - Platform  
**Role**: Full Stack Developer  
**Duration**: 2024-Present  
**Live Demo**: https://mess-wallah.netlify.app  
**GitHub**: https://github.com/Bil-2/MESS-WALLAH

**Key Engineering Achievements**:
- Re-architected database to a **Data Lifecycle Model (OYO-style)** utilizing 11 MongoDB schemas to track permanent financial ledgers, room history cycles, and granular user analytics.
- Engineered an **Automated Profile Pipeline** that seamlessly intercepts form data during booking requests to implicitly build and verify permanent user profiles (Aadhar, Age, Profession).
- Built a sophisticated **Smart Search Algorithm** leveraging MongoDB Aggregation Pipelines to dynamically rank rooms based on Owner Verification, Total Views (Logarithmic Scale), and Feature flags.
- Developed an internal **Email Audit & Analytics Tracker** providing 100% observability over automated notification deliveries (SendGrid).
- Authored a **Zero Cold-Start Architecture** to bypass Firebase server sleep limitations while maintaining active Database pooling.

---

**Built for Indian students**
