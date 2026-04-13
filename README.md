# MESS WALLAH — Student Accommodation Platform

> **Full-Stack Room Booking & Property Management System for Indian Students**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-mess--wallah.netlify.app-success?style=for-the-badge&logo=netlify)](https://mess-wallah.netlify.app)
[![Backend](https://img.shields.io/badge/Backend%20API-Render-orange?style=for-the-badge&logo=render)](https://mess-wallah-api.onrender.com/health)
[![GitHub](https://img.shields.io/badge/GitHub-Bil--2/MESS--WALLAH-blue?style=for-the-badge&logo=github)](https://github.com/Bil-2/MESS-WALLAH)

---

## 🌐 Live Application

| Layer | URL |
|---|---|
| **Frontend** | https://mess-wallah.netlify.app |
| **Backend API** | https://mess-wallah-api.onrender.com |
| **Health Check** | https://mess-wallah-api.onrender.com/health |

---

## 📊 Database Stats

| Metric | Value |
|---|---|
| Total States | 35 |
| Total Districts | ~300+ |
| Total Cities | 666 |
| Total Rooms | **6,660** |
| Available per City | 8 |
| Booked per City | 2 |
| Database | MongoDB Atlas (Cloud) + Local |

---

## 🏗️ Tech Stack

### Frontend
| Tech | Purpose |
|---|---|
| React 18 + Vite 7 | UI Framework & Build Tool |
| React Router v6 | Client-side Routing |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Axios | HTTP Client |
| React Hot Toast | Notifications |
| React Icons | Icon Library |
| Context API | Global State Management |

### Backend
| Tech | Purpose |
|---|---|
| Node.js + Express.js | REST API Server |
| MongoDB + Mongoose | Database & ODM |
| JWT | Authentication Tokens |
| Passport.js | Google OAuth 2.0 |
| Bcryptjs | Password Hashing |
| Multer | File Uploads (Profile Pictures) |
| Nodemailer / Resend | Email Notifications |
| Twilio | SMS / OTP Verification |
| Razorpay SDK | Payment Gateway |
| Winston | Logging |
| Helmet + HPP + XSS-Clean | Security Middleware |
| Express Rate Limit | Rate Limiting |
| Morgan | HTTP Request Logging |

### Infrastructure
| Tech | Purpose |
|---|---|
| Netlify | Frontend Hosting & CD |
| Render | Backend Hosting |
| MongoDB Atlas | Cloud Database |
| Docker + Docker Compose | Local Dev Orchestration |
| GitHub | Version Control |

---

## 🔑 Key Features

### For Students (Tenants)
- 🔍 **Smart Search** — Filter rooms by city, price range, room type, amenities
- 📍 **India-Wide Coverage** — 666 cities across all 35 states and union territories
- 📅 **4-Step Booking Flow** — Details → Review → Payment → Confirmation
- 💳 **Razorpay Integration** — Secure payment gateway (skips gracefully if not configured)
- ❤️ **Favorites** — Save and revisit rooms of interest
- 📱 **Mobile Navigation** — Dedicated bottom nav bar for mobile users
- 👤 **Profile Management** — Update Name, Phone, City, State, Bio; upload profile picture

### For Property Owners
- 🏠 **List Rooms** — Create detailed room listings with photos and amenities
- 📋 **Manage Bookings** — View, confirm, and track all booking requests
- 📊 **Owner Dashboard** — Real-time stats for listings, bookings, and revenue
- ✅ **Verified Badge** — Builds trust with tenants

### Authentication
- 📧 **Email + Password** — Traditional signup/login
- 📱 **OTP Login** — Login via mobile number
- 🔒 **Google OAuth 2.0** — One-click sign-in via Google
- 🔗 **Account Linking** — Prevents duplicate accounts across auth methods
- 🔐 **JWT Sessions** — Secure, cookie-based token management

### Security
- Rate limiting on all endpoints
- CORS configured per environment
- XSS, NoSQL injection, and HPP protection
- bcrypt password hashing (12 rounds)
- Password history (prevents reuse of last 5 passwords)
- Account lockout after 5 failed login attempts

---

## 📁 Project Structure

```
MESS-WALLAH/
│
├── frontend/                        # React + Vite App (deployed to Netlify)
│   ├── public/
│   │   └── images/rooms/            # 92 local room images (room-1.jpg … room-92.jpg)
│   └── src/
│       ├── components/              # Navbar, Footer, BookingModal, etc.
│       ├── context/                 # AuthContext, ThemeContext
│       ├── hooks/                   # useServerWarmup, custom hooks
│       ├── pages/                   # All route views
│       │   ├── Home.jsx
│       │   ├── Rooms.jsx            # Browse & search rooms
│       │   ├── RoomDetails.jsx      # Single room with gallery & booking
│       │   ├── Profile.jsx          # User profile management
│       │   ├── Bookings.jsx         # Tenant my-bookings
│       │   ├── Favorites.jsx
│       │   ├── Login.jsx / Register.jsx
│       │   ├── GoogleAuthSuccess.jsx
│       │   └── owner/               # Owner-only pages
│       │       ├── AddRoom.jsx
│       │       ├── ManageRooms.jsx
│       │       └── OwnerBookings.jsx
│       ├── services/
│       ├── styles/
│       └── utils/
│           ├── api.js               # Axios instance (base URL from VITE_API_URL)
│           └── imageUtils.js        # Local image helpers + server URL builder
│
├── backend/                         # Express API (deployed to Render)
│   ├── controllers/                 # Business logic
│   ├── middleware/
│   │   ├── auth.js                  # JWT protect / authorize
│   │   ├── advancedSecurity.js      # Rate limit, CSRF, sanitize
│   │   └── productionErrorHandler.js
│   ├── models/                      # Mongoose Schemas
│   │   ├── User.js
│   │   ├── Room.js
│   │   ├── Booking.js
│   │   └── ... (11 total models)
│   ├── routes/                      # Express routers
│   │   ├── auth.js
│   │   ├── googleAuth.js
│   │   ├── users.js
│   │   ├── rooms.js
│   │   ├── bookings.js
│   │   ├── search.js
│   │   └── payments.js
│   ├── services/
│   │   └── accountLinkingService.js
│   ├── utils/
│   │   └── healthMonitor.js
│   ├── seedRooms.js                 # Original mega-seed (8400 rooms, 10 cities)
│   ├── seedFromIndiaClean.js        # ⭐ India-wide seed (6660 rooms, 666 cities)
│   ├── server.js                    # Entry point
│   └── .env                        # Environment variables (gitignored)
│
├── docker-compose.yml               # Local full-stack orchestration
├── netlify.toml                     # Netlify build + redirect config
└── .env                             # Root-level env (for Docker secrets)
```

---

## 🚀 Run Locally

### Prerequisites
- Node.js ≥ 20
- MongoDB (local via Homebrew or Docker)
- npm

### 1. Start MongoDB (local)

```bash
# via Homebrew (macOS)
brew services start mongodb-community

# OR via Docker
docker compose up mongo -d
```

### 2. Start Backend

```bash
cd backend
npm install
npm run dev
# → API running at http://localhost:5001
# → Auto-detects local MongoDB; falls back to Atlas if not found
```

### 3. Start Frontend

```bash
cd frontend
npm install
npm run dev
# → App running at http://localhost:5173
```

### 4. Seed the Database

```bash
# Seed 6,660 rooms across all 666 Indian cities (10 per city: 8 available, 2 booked)
cd backend
npm run seed:india

# Seeds both local MongoDB AND cloud Atlas automatically
# To re-seed cloud only: MONGODB_URI=<atlas_uri> node seedFromIndiaClean.js
```

---

## 🌍 API Routes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Server health check |
| POST | `/api/auth/register` | Email registration |
| POST | `/api/auth/login` | Email login |
| GET | `/api/auth/google` | Google OAuth |
| GET | `/api/auth/me` | Current user |
| GET | `/api/rooms` | List / search rooms |
| GET | `/api/rooms/:id` | Room details |
| POST | `/api/rooms` | Create room (owner) |
| GET | `/api/users/profile` | Get profile |
| PUT | `/api/users/profile` | Update profile + phone |
| POST | `/api/users/profile-picture` | Upload profile photo |
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings` | My bookings |
| POST | `/api/payments/create-order` | Razorpay order |
| POST | `/api/payments/verify` | Verify payment |

---

## 🌐 Frontend Routes

| Path | Description | Access |
|---|---|---|
| `/` | Home page | Public |
| `/rooms` | Browse all rooms | Public |
| `/rooms/:id` | Room details + Book | Public |
| `/login` | Login page | Guest only |
| `/register` | Register page | Guest only |
| `/profile` | User profile | Auth |
| `/bookings` | My bookings | Tenant |
| `/favorites` | Saved rooms | Tenant |
| `/owner-dashboard` | Owner stats | Owner |
| `/owner/rooms` | Manage listings | Owner |
| `/owner/rooms/new` | Add new room | Owner |
| `/owner/bookings` | Manage bookings | Owner |
| `/about` | About page | Public |
| `/how-it-works` | Guide | Public |
| `/safety` | Safety info | Public |
| `/support` | Support | Public |
| `/contact` | Contact | Public |

---

## 🔐 Environment Variables

### `backend/.env`

```env
NODE_ENV=development
PORT=5001

# Database
MONGODB_URI=mongodb+srv://...  # Atlas URI

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback

# Email
GMAIL_USER=your@gmail.com
GMAIL_PASS=your_app_password
FROM_EMAIL=your@gmail.com

# SMS / OTP
TWILIO_ACCOUNT_SID=ACxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxx
TWILIO_VERIFY_SERVICE_SID=VAxxxxxxx
TWILIO_PHONE_NUMBER=+91XXXXXXXXXX

# Payments
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx

# Security
SESSION_SECRET=your_session_secret
BCRYPT_ROUNDS=12

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173
```

### `frontend/.env` (optional, override)

```env
VITE_API_URL=http://localhost:5001/api
```

---

## 📦 Database Seeding

The `seedFromIndiaClean.js` script reads `/Users/biltubag/Downloads/xxxx/india-clean.json` and creates rooms for every city in India.

**Rules applied:**
- ✅ Every state → every district → every city gets **exactly 10 rooms**
- ✅ **8 rooms** per city → `isAvailable: true`
- ✅ **2 rooms** per city → `isAvailable: false, isOccupied: true` (booked)
- ✅ Same room structure as original `seedRooms.js` (photos, amenities, owners, pricing)
- ✅ Local room images only (`/images/rooms/room-1.jpg` … `room-92.jpg`)

```bash
npm run seed:india   # Seeds whichever DB the MONGODB_URI env points to
```

---

## 🚢 Deployment

### Frontend → Netlify

```bash
# Via Netlify CLI (from project root)
netlify deploy --prod

# Build settings (netlify.toml):
# Base: frontend/
# Build command: npm run build
# Publish dir: dist
# API URL injected: VITE_API_URL=https://mess-wallah-api.onrender.com/api
```

### Backend → Render

- Auto-deploys from GitHub `main` branch
- Set all `backend/.env` variables as Render environment variables
- Start command: `node server.js`

---

## 👨‍💻 Developer

**Biltu Bag**
- GitHub: [github.com/Bil-2](https://github.com/Bil-2)
- Live: [mess-wallah.netlify.app](https://mess-wallah.netlify.app)
- Project: Full-Stack Developer | 2024–Present

---

> Built for Indian students seeking safe, affordable accommodation across every city in India.
