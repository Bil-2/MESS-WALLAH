# Mess Walla

A compact, interview-friendly MERN stack room/mess rental marketplace for Indian students and families. Features OTP-based phone authentication, room listings, and booking management.

## 🚀 Features

- **OTP Phone Authentication** - Secure login using Twilio SMS or console fallback
- **User & Owner Roles** - Different dashboards for room seekers and property owners
- **Room CRUD Operations** - Complete room management with photos and amenities
- **Booking Flow** - Request, confirm, and manage room bookings
- **SMS & Email Notifications** - Twilio SMS and SendGrid email integration
- **Responsive UI Ready** - Mobile-first design approach
- **Demo Mode** - Console OTP logging for development without Twilio

## 🛠 Tech Stack

- **Frontend**: React + Vite, Tailwind CSS
- **Backend**: Node.js + Express, MongoDB
- **Authentication**: JWT with OTP verification
- **SMS**: Twilio (with console fallback)
- **Email**: SendGrid (with console fallback)
- **File Storage**: Cloudinary
- **Maps**: Google Maps integration

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js >= 14.0.0
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

### 📱 OTP Demo Instructions

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

## 🚀 Deployment

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

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers
- **JWT**: Secure token-based authentication
- **OTP Expiry**: 5-minute expiration with attempt limits
- **Input Validation**: Express-validator for all endpoints

## 📝 Interview Notes

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

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Mess Walla** - Making room hunting simple for students and families across India! 🏠✨
