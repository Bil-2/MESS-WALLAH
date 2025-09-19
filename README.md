# MESS WALLAH 🏠

> **Modern MERN stack accommodation marketplace for Indian students and families**

[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16.0+-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

A production-ready accommodation marketplace featuring OTP authentication, advanced search, interactive galleries, and mobile-first responsive design with glassmorphism effects and smooth animations.

## ✨ Features

- 🔐 **OTP Authentication** - Secure phone verification with Twilio/console fallback
- 🏠 **Room Management** - Advanced search, filters, and interactive image galleries
- 📱 **Mobile-First Design** - Responsive UI with touch-friendly interactions
- 🎨 **Modern UI/UX** - Framer Motion animations and glassmorphism styling
- ⚡ **Performance Optimized** - Code splitting, lazy loading, and caching
- 🛡️ **Security Focus** - Rate limiting, validation, and girls safety emphasis

## Tech Stack

**Frontend:** React 18 • Vite • Tailwind CSS • Framer Motion • React Router  
**Backend:** Node.js • Express • MongoDB • JWT • Twilio • SendGrid • Cloudinary  
**Security:** Rate limiting • Input validation • CORS • Helmet.js

## Quick Start

### Prerequisites
Node.js 16+ • MongoDB • Git

### Backend Setup
```bash
# Clone and setup
git clone <repo-url>
cd mess-wallah/backend
npm install

# Configure environment
cp .env.example .env
# Update .env with your MongoDB URI, JWT secret, etc.

# Start server
npm run dev
```

### Frontend Setup
```bash
cd ../frontend
npm install

# Configure environment
cp .env.example .env
# Set VITE_API_BASE=http://localhost:5000/api

# Start development server
npm run dev
```

**Access:** Frontend at http://localhost:5173 • Backend at http://localhost:5000

### OTP Demo Instructions

#### Development Mode (No Twilio Required)

When `DEV_ALLOW_OTP_CONSOLE=true` in your `.env`:

1. **Send OTP Request**
   ```bash
   curl -X POST http://localhost:5000/api/auth/send-otp \
     -H "Content-Type: application/json" \
     -d '{"phone":"9876543210"}'
   ```

2. **Check Console Output**
   The OTP will be displayed in your server console:
   ```
   🔔 [DEV SMS FALLBACK]
   📱 To: 9876543210
   💬 Message: Your MessWalla OTP is 123456. Expires in 5 minutes.
   ──────────────────────────────────────────────────────
   ```

3. **Verify OTP**
   ```bash
   curl -X POST http://localhost:5000/api/auth/verify-otp \
     -H "Content-Type: application/json" \
     -d '{"phone":"9876543210","code":"123456"}'
   ```

#### Production Mode (With Twilio)

1. Set up Twilio account and get credentials
2. Update `.env` with Twilio credentials
3. Set `DEV_ALLOW_OTP_CONSOLE=false`
4. OTPs will be sent via SMS to real phone numbers

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone number
- `POST /api/auth/verify-otp` - Verify OTP and login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Logout user

### Rooms
- `GET /api/rooms` - Search and list rooms
- `GET /api/rooms/:id` - Get room details
- `POST /api/rooms` - Create room (owner only)
- `PUT /api/rooms/:id` - Update room (owner only)
- `DELETE /api/rooms/:id` - Delete room (owner only)

### Bookings
- `POST /api/bookings` - Create booking request
- `PUT /api/bookings/:id/confirm` - Confirm booking (owner)
- `GET /api/users/:id/bookings` - Get user bookings

### Users
- `GET /api/users/dashboard/stats` - Dashboard statistics
- `GET /api/users/stats/platform` - Public platform stats

## 🗄 Database Models

### User Model
```javascript
{
  name: String,
  phone: String (required, unique),
  email: String (optional),
  role: ['user', 'owner', 'admin'],
  isVerified: Boolean,
  profile: {
    age, occupation, city, state, bio
  },
  ownerDetails: {
    businessName, businessAddress, gstNumber, bankDetails
  },
  preferences: {
    roomType, budgetRange, preferredCities, amenities
  }
}
```

### Room Model
```javascript
{
  ownerId: ObjectId,
  title: String,
  description: String,
  address: { line1, city, state, pincode, lat, lng },
  rentPerMonth: Number,
  deposit: Number,
  amenities: [String],
  photos: [String],
  availableFrom: Date,
  maxOccupancy: Number,
  roomType: ['bachelor', 'family', 'student', 'pg']
}
```

### Booking Model
```javascript
{
  roomId: ObjectId,
  userId: ObjectId,
  ownerId: ObjectId,
  status: ['requested', 'confirmed', 'cancelled', 'completed'],
  startDate: Date,
  endDate: Date,
  pricing: { monthlyRent, deposit, totalAmount },
  statusHistory: [{ status, timestamp, updatedBy, reason }]
}
```

## 🧪 Testing the API

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Complete Authentication Flow
```bash
# Send OTP
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210"}'

# Check console for OTP, then verify
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210","code":"CONSOLE_OTP"}'

# Use returned token for authenticated requests
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:5000/api/auth/me
```

### 3. Create a Room (Owner)
```bash
curl -X POST http://localhost:5000/api/rooms \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Cozy PG Room",
    "description": "Well-furnished room for students",
    "address": {
      "line1": "123 Main Street",
      "city": "Bangalore",
      "state": "Karnataka",
      "pincode": "560001"
    },
    "rentPerMonth": 8000,
    "deposit": 16000,
    "amenities": ["wifi", "ac", "parking"],
    "availableFrom": "2024-01-01",
    "maxOccupancy": 2,
    "roomType": "student"
  }'
```

## Deployment

### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set environment variables in platform dashboard
3. Deploy from main branch

### Frontend (Vercel/Netlify)
1. Build React app: `npm run build`
2. Deploy dist folder
3. Set `VITE_API_BASE` to your backend URL

### Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Update `MONGODB_URI` in production environment
3. Whitelist deployment platform IPs

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers
- **JWT**: Secure token-based authentication
- **OTP Expiry**: 5-minute expiration with attempt limits
- **Input Validation**: Express-validator for all endpoints

## Interview Notes

This project demonstrates:
- **Authentication**: OTP-based phone verification
- **Database Design**: Normalized MongoDB schemas
- **API Design**: RESTful endpoints with proper status codes
- **Security**: Rate limiting, validation, JWT tokens
- **Scalability**: Modular structure, environment configs
- **Real-world Features**: SMS integration, file uploads, search

### Next Steps (Phase 2+)
- Payment integration (Razorpay)
- Real-time chat between users and owners
- Advanced search with filters and maps
- Push notifications
- Mobile app (React Native)
- Admin dashboard with analytics

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Mess Walla** - Making room hunting simple for students and families across India! 

# MessWallah 

A high-performance, mobile-first MERN stack accommodation marketplace designed for Indian students and families. Features modern UI/UX, OTP-based authentication, comprehensive room management, and lightning-fast performance across all devices.

## Performance & Compatibility

- **Rocket-Fast Performance** - Optimized for speed with lazy loading, code splitting, and efficient state management
- **Mobile-First Design** - Fully responsive across all screen sizes (320px to 4K+)
- **Cross-Platform Compatible** - Seamless experience on mobile, tablet, and desktop
- **Modern UI/UX** - Enhanced with Framer Motion animations, glassmorphism effects, and intuitive design
- **Lightning Load Times** - Optimized bundle sizes and efficient rendering
- **Dark Mode Support** - Complete dark/light theme implementation
- **💻 Cross-Platform Compatible** - Seamless experience on mobile, tablet, and desktop
- **🎨 Modern UI/UX** - Enhanced with Framer Motion animations, glassmorphism effects, and intuitive design
- **⚡ Lightning Load Times** - Optimized bundle sizes and efficient rendering
- **🌙 Dark Mode Support** - Complete dark/light theme implementation

## 🚀 Enhanced Features

### 🔐 Advanced Authentication
- **OTP Phone Authentication** - Secure login using Twilio SMS with console fallback
- **Modern Auth UI** - Enhanced login/register pages with real-time validation
- **Phone Verification Flow** - Streamlined OTP verification with loading states
- **Form Validation** - Real-time validation with inline error messages and animations

### 👥 User Experience
- **Dual User Roles** - Optimized dashboards for room seekers and property owners  
- **Enhanced Navigation** - Modern navbar with smooth animations and mobile menu
- **Interactive Forms** - Password visibility toggles, animated inputs, and smart validation
- **Toast Notifications** - Real-time feedback for all user actions

### 🏠 Room Management
- **Complete CRUD Operations** - Full room management with photos and amenities
- **Advanced Search** - Filter by location, price, amenities, and room type
- **Interactive Booking Flow** - Request, confirm, and manage room bookings
- **Photo Gallery** - Cloudinary integration for high-quality image management

### 📱 Mobile Optimization
- **Touch-Friendly Interface** - Optimized button sizes and touch targets
- **Responsive Typography** - Adaptive text sizes for optimal readability
- **Mobile Navigation** - Hamburger menu with smooth slide animations
- **Performance Optimized** - Lazy loading and efficient mobile rendering

### 🎨 Modern Design System
- **Glassmorphism Effects** - Modern backdrop blur and transparency effects
- **Gradient Backgrounds** - Beautiful animated gradient overlays
- **Framer Motion** - Smooth page transitions and micro-interactions
- **Tailwind CSS** - Utility-first styling with consistent design tokens
- **Responsive Breakpoints** - Mobile-first responsive design patterns

### 📧 Communication
- **SMS & Email Notifications** - Twilio SMS and SendGrid email integration
- **Real-time Updates** - Instant notifications for booking status changes
- **Multi-channel Alerts** - Console fallback for development environments

### 🛡️ Safety & Security
- **Girls Safety Focus** - Dedicated safety features and guidelines
- **Secure Authentication** - JWT tokens with proper expiration handling
- **Data Protection** - Input validation and sanitization
- **Privacy Controls** - Comprehensive privacy policy and user controls

## 🛠 Enhanced Tech Stack

### Frontend
- **React 18** - Latest React with concurrent features
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **React Router DOM** - Client-side routing
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Elegant toast notifications

### Backend  
- **Node.js + Express** - High-performance server architecture
- **MongoDB** - Flexible NoSQL database
- **JWT Authentication** - Secure token-based auth
- **Rate Limiting** - API protection and performance optimization
- **Input Validation** - Comprehensive request validation

### Integrations
- **Twilio SMS** - Reliable SMS delivery with fallback
- **SendGrid Email** - Professional email notifications  
- **Cloudinary** - Advanced image management and optimization
- **Google Maps** - Location services and mapping

### Performance Features
- **Code Splitting** - Lazy loading for optimal bundle sizes
- **Image Optimization** - Cloudinary transformations and compression
- **Caching Strategy** - Efficient data caching and state management
- **Bundle Optimization** - Tree shaking and dead code elimination

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js >= 16.0.0
- MongoDB (local or Atlas)
- Git

### Backend Setup

1. **Clone and navigate to backend**
   ```bash
   git clone <repository-url>
   cd mess-wallah/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   # Required
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/messwallah
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:3000
   
   # OTP Configuration
   OTP_EXPIRE_MINUTES=5
   DEV_ALLOW_OTP_CONSOLE=true
   
   # Optional (for production)
   TWILIO_SID=your_twilio_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE=+1234567890
   SENDGRID_API_KEY=your_sendgrid_key
   CLOUDINARY_URL=your_cloudinary_url
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with:
   ```env
   VITE_API_BASE=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📱 OTP Demo

### Development Mode
Set `DEV_ALLOW_OTP_CONSOLE=true` in `.env` for console-based OTP (no Twilio needed):

```bash
# Send OTP
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210"}'

# Check console for OTP, then verify
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"9876543210","code":"CONSOLE_OTP"}'
```

## 🔧 API Endpoints

**Authentication:** `/api/auth/send-otp` • `/api/auth/verify-otp` • `/api/auth/me`  
**Rooms:** `/api/rooms` • `/api/rooms/:id` • `/api/rooms/featured`  
**Bookings:** `/api/bookings` • `/api/bookings/:id/confirm`  
**Users:** `/api/users/dashboard/stats` • `/api/users/favorites`

## 🚀 Deployment

**Backend (Railway/Render):** Set environment variables → Deploy from main branch  
**Frontend (Vercel/Netlify):** `npm run build` → Deploy dist folder  
**Database:** MongoDB Atlas with connection string in production env

## 🎯 Project Highlights

- **Modern MERN Stack** with mobile-first responsive design
- **Advanced Authentication** using OTP verification system  
- **Performance Optimized** with code splitting and lazy loading
- **Production Security** with rate limiting, validation, and CORS
- **Clean Architecture** with modular, maintainable codebase

## 🚧 Future Enhancements

- [ ] Payment Integration (Razorpay/Stripe)
- [ ] Real-time Chat (Socket.io)  
- [ ] Mobile App (React Native)
- [ ] AI Recommendations

## 📄 License

MIT License - Built with ❤️ for students and families across India

---

**MESS WALLAH** - Modern accommodation marketplace with enhanced 