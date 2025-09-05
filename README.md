# 🏠 Room Rental Platform - MERN Stack

A comprehensive room rental platform built with the MERN stack, designed for students, bachelors, and families to find and rent rooms from verified property owners.

## 🚀 Features

### For Tenants (Students/Bachelors/Families)
- **Advanced Search & Filtering**: Search by location, price range, room type, amenities
- **Location-based Search**: Find rooms near colleges, metro stations, hospitals
- **Secure Booking System**: Request bookings with owner approval workflow
- **Real-time Messaging**: Chat with property owners
- **Review System**: Read and write reviews for properties
- **Payment Integration**: Secure online payments via Stripe/Razorpay

### For Property Owners
- **Property Management**: Add, edit, and manage room listings
- **Image Upload**: Multiple property images with Cloudinary integration
- **Booking Management**: Approve/reject booking requests
- **Tenant Communication**: Direct messaging with potential tenants
- **Analytics Dashboard**: Track views, bookings, and earnings

### For Admins
- **User Management**: Manage users and verify property owners
- **Platform Analytics**: Monitor platform usage and transactions
- **Content Moderation**: Review and moderate listings and reviews

## 🛠 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Cloudinary** for image storage
- **Stripe** for payment processing
- **Nodemailer** for email notifications

### Frontend
- **React 18** with functional components and hooks
- **React Router** for navigation
- **React Query** for data fetching and caching
- **Tailwind CSS** for styling
- **React Hook Form** for form management
- **React Hot Toast** for notifications

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- Stripe account (for payments)

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd room-rental-platform
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Environment Configuration**
Create a `.env` file in the root directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/room-rental-platform

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
CLIENT_URL=http://localhost:3000
```

4. **Start the backend server**
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Install frontend dependencies**
```bash
cd frontend
npm install
```

2. **Configure Tailwind CSS**
```bash
npx tailwindcss init -p
```

3. **Start the frontend development server**
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",
  "phone": "1234567890",
  "college": "ABC University", // Required for students
  "course": "Computer Science", // Required for students
  "year": 3 // Required for students
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <jwt-token>
```

### Room Endpoints

#### Get All Rooms (with filtering)
```http
GET /api/rooms?city=Mumbai&minRent=5000&maxRent=15000&type=single&amenities=wifi,parking
```

#### Get Single Room
```http
GET /api/rooms/:id
```

#### Create Room (Owner only)
```http
POST /api/rooms
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data

{
  "title": "Spacious Single Room",
  "description": "Well-furnished room with all amenities",
  "type": "single",
  "targetAudience": "students",
  "rent": {
    "monthly": 12000,
    "security": 24000,
    "maintenance": 1000
  },
  "location": {
    "address": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "coordinates": {
      "lat": 19.0760,
      "lng": 72.8777
    }
  },
  "specifications": {
    "area": 150,
    "bedrooms": 1,
    "bathrooms": 1,
    "floor": 2,
    "totalFloors": 5,
    "furnished": "fully-furnished"
  },
  "amenities": ["wifi", "parking", "ac"],
  "availability": {
    "availableFrom": "2024-01-01"
  }
}
```

### Booking Endpoints

#### Create Booking Request
```http
POST /api/bookings
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "roomId": "room-id",
  "checkIn": "2024-01-01",
  "checkOut": "2024-07-01",
  "duration": 6,
  "guests": 1,
  "message": "I'm interested in this room"
}
```

#### Get My Bookings
```http
GET /api/bookings
Authorization: Bearer <jwt-token>
```

#### Respond to Booking (Owner only)
```http
PUT /api/bookings/:id/respond
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "status": "approved",
  "message": "Your booking has been approved!"
}
```

## 🏗 Project Structure

```
room-rental-platform/
├── backend/
│   ├── config/
│   │   ├── dbConnection.js
│   │   ├── jwtConfig.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── roomController.js
│   │   └── bookingController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Room.js
│   │   ├── Booking.js
│   │   ├── Review.js
│   │   └── Payment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── roomRoutes.js
│   │   └── bookingRoutes.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Rooms.jsx
│   │   │   └── Dashboard/
│   │   ├── App.js
│   │   └── index.css
│   ├── tailwind.config.js
│   └── package.json
├── .env
└── README.md
```

## 🔧 Development Commands

### Backend
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm test         # Run tests
```

### Frontend
```bash
npm start        # Start development server
npm run build    # Build for production
npm test         # Run tests
```

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy using Git or GitHub integration

### Frontend Deployment (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the `build` folder to your hosting platform
3. Set environment variables for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

