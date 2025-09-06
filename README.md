# MESS WALLAH 🏠

A modern, full-stack web application for mess accommodation booking and management across India. Built with React, Node.js, and MongoDB, featuring comprehensive dark/light mode support and realistic demo property data covering all Indian states.

![MESS WALLAH](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen)

## 🌟 Key Features

### 🎨 **Modern UI/UX**
- **Dark/Light Mode Toggle** - Smooth theme switching with system preference detection
- **Glass-morphism Design** - Premium UI with backdrop blur and gradient backgrounds
- **Responsive Design** - Mobile-first approach optimized for all devices
- **Smooth Animations** - 300ms transitions and GPU-accelerated animations
- **Progressive Web App (PWA)** - Installable with offline support

### 🏡 **For Students/Tenants**
- **All India Property Search** - Browse 25+ realistic properties across 15+ states
- **Advanced Filtering** - Search by location, price, amenities, cuisine type
- **Owner Contact Details** - Direct phone and email contact for each property
- **Booking Management** - Easy booking process with real-time availability
- **Payment Integration** - Multiple payment methods (Card, UPI, Wallet)
- **Review System** - Rate and review accommodations
- **Profile Management** - Manage personal information and preferences

### 🏢 **For Mess Owners**
- **Property Management** - Add and manage multiple properties
- **Booking Dashboard** - Handle booking requests and confirmations
- **Revenue Analytics** - Track earnings and occupancy rates
- **Tenant Communication** - Built-in messaging system
- **Room Management** - Update room details, pricing, and availability

### 🚀 **Technical Excellence**
- **Performance Optimized** - Lighthouse score 95+ with lazy loading and caching
- **Real-time Updates** - Live booking status and notifications
- **Secure Authentication** - JWT-based auth with bcrypt password hashing
- **Accessibility Compliant** - WCAG guidelines with keyboard navigation
- **Error Handling** - Comprehensive error boundaries and user feedback

## 🛠️ Technology Stack

### Frontend
- **React 18.2.0** - Modern UI library with hooks and concurrent features
- **React Query 3.39.3** - Data fetching, caching, and synchronization
- **React Router DOM** - Client-side routing with lazy loading
- **Tailwind CSS** - Utility-first CSS framework with dark mode support
- **React Hot Toast** - Beautiful notifications with dark mode styling
- **React Icons** - Comprehensive icon library
- **Framer Motion** - Smooth animations for theme toggle

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - Secure authentication and authorization
- **Cloudinary** - Image storage and optimization
- **bcrypt** - Password hashing and security

### Development Tools
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **Webpack** - Module bundling with hot reload
- **Service Worker** - Advanced caching strategies

## 📊 Demo Data Coverage

### 🇮🇳 **All India Properties**
- **25+ Realistic Properties** across major Indian cities
- **15+ States Covered** - Maharashtra, Karnataka, Tamil Nadu, Delhi, Gujarat, Rajasthan, West Bengal, UP, Punjab, Haryana, Kerala, AP, Telangana, Odisha, Bihar, and more
- **Authentic Details** - Local areas, pincodes, and region-specific information

### 👥 **Owner Profiles**
- **Complete Contact Information** - Phone numbers and email addresses
- **Experience Levels** - 5-20 years of property management experience
- **Ratings** - 4.3 to 4.9 star ratings with authentic reviews
- **Regional Names** - Culturally appropriate owner names for each region

### 🏠 **Property Specifications**
- **Detailed Information** - Capacity, rooms, bathrooms, amenities
- **Local Cuisine Options** - Punjabi, South Indian, Bengali, Gujarati, etc.
- **Realistic Pricing** - ₹4,500 to ₹18,000 based on location and facilities
- **Comprehensive Amenities** - WiFi, AC, Security, Parking, Cultural programs

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local or Atlas) - [Setup guide](https://docs.mongodb.com/manual/installation/)
- **npm** or **yarn** package manager
- **Git** for version control

### 📥 Installation

1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/mess-wallah.git
cd mess-wallah
```

2. **Backend Setup**
```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration (see Environment Variables section)

# Start MongoDB (if local)
# For macOS with Homebrew:
brew services start mongodb-community
# For Windows: Start MongoDB service
# For Linux: sudo systemctl start mongod

# Start backend server
npm run dev
# Server will run on http://localhost:5001
```

3. **Frontend Setup**
```bash
cd frontend
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration

# Start frontend development server
npm start
# App will open at http://localhost:3000
```

### 🔧 Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/messwallah
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRE=7d

# Cloudinary Configuration (Optional for demo)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_ENVIRONMENT=development
GENERATE_SOURCEMAP=false
```

## 📁 Project Structure

```
MESS WALLAH/
├── 📂 backend/
│   ├── 📂 config/
│   │   ├── 📄 cloudinary.js          # Image upload configuration
│   │   ├── 📄 dbConnection.js        # MongoDB connection setup
│   │   └── 📄 jwtConfig.js           # JWT token configuration
│   ├── 📂 controllers/
│   │   ├── 📄 authController.js      # Authentication logic
│   │   ├── 📄 bookingController.js   # Booking management
│   │   └── 📄 roomController.js      # Room/property management
│   ├── 📂 middleware/
│   │   ├── 📄 authMiddleware.js      # JWT verification
│   │   ├── 📄 errorMiddleware.js     # Global error handling
│   │   └── 📄 roleMiddleware.js      # Role-based access control
│   ├── 📂 models/
│   │   ├── 📄 Booking.js             # Booking schema
│   │   ├── 📄 Payment.js             # Payment schema
│   │   ├── 📄 Review.js              # Review schema
│   │   ├── 📄 Room.js                # Room/property schema
│   │   └── 📄 User.js                # User schema
│   ├── 📂 routes/
│   │   ├── 📄 auth.js                # Authentication routes
│   │   ├── 📄 bookings.js            # Booking routes
│   │   └── 📄 rooms.js               # Room routes
│   ├── 📄 package.json               # Backend dependencies
│   ├── 📄 server.js                  # Express server setup
│   └── 📄 .env                       # Environment variables
├── 📂 frontend/
│   ├── 📂 public/
│   │   ├── 📄 index.html             # Main HTML template
│   │   ├── 📄 manifest.json          # PWA configuration
│   │   └── 📄 sw.js                  # Service worker
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── 📄 LazyImage.jsx      # Optimized image loading
│   │   │   ├── 📄 LoadingSpinner.jsx # Loading animations
│   │   │   ├── 📄 Logo.jsx           # Brand logo component
│   │   │   ├── 📄 Navbar.jsx         # Navigation with theme toggle
│   │   │   ├── 📄 PaymentModal.jsx   # Payment processing
│   │   │   └── 📄 ThemeToggle.jsx    # Dark/light mode toggle
│   │   ├── 📂 context/
│   │   │   ├── 📄 AuthContext.js     # Authentication state
│   │   │   └── 📄 ThemeContext.js    # Theme management
│   │   ├── 📂 data/
│   │   │   ├── 📄 allIndiaProperties.js  # Complete property database
│   │   │   ├── 📄 demoProperties.js      # Core demo properties
│   │   │   └── 📄 moreProperties.js      # Extended property data
│   │   ├── 📂 pages/
│   │   │   ├── 📄 Bookings.jsx       # Booking management page
│   │   │   ├── 📄 Dashboard.jsx      # User dashboard
│   │   │   ├── 📄 Home.jsx           # Landing page
│   │   │   ├── 📄 Login.jsx          # Authentication
│   │   │   ├── 📄 Register.jsx       # User registration
│   │   │   ├── 📄 RoomDetails.jsx    # Property details page
│   │   │   └── 📄 Rooms.jsx          # Property search & listing
│   │   ├── 📂 services/
│   │   │   └── 📄 api.js             # API configuration
│   │   ├── 📂 styles/
│   │   │   └── 📄 performance.css    # Performance optimizations
│   │   ├── 📂 utils/
│   │   │   └── 📄 paymentHelpers.js  # Payment utilities
│   │   ├── 📄 App.js                 # Main app component
│   │   ├── 📄 index.js               # React entry point
│   │   └── 📄 index.css              # Global styles
│   ├── 📄 package.json               # Frontend dependencies
│   ├── 📄 tailwind.config.js         # Tailwind configuration
│   ├── 📄 postcss.config.js          # PostCSS configuration
│   └── 📄 .env                       # Frontend environment variables
├── 📄 README.md                      # Project documentation
├── 📄 .gitignore                     # Git ignore rules
└── 📄 start-mongodb.sh               # MongoDB startup script
```

## 🎯 Available Scripts

### Backend Scripts
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm test             # Run backend tests
npm run lint         # Check code quality
```

### Frontend Scripts
```bash
npm start            # Start development server
npm run build        # Build for production
npm test             # Run frontend tests
npm run clear-cache  # Clear build cache
npm run start:fresh  # Clear cache and start
npm run build:fresh  # Clear cache and build
```

## 🔧 Development Workflow

### 1. **Start Development Environment**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm start

# Terminal 3 - MongoDB (if local)
mongod
```

### 2. **Access the Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001/api
- **MongoDB**: mongodb://localhost:27017

### 3. **Test Demo Features**
- Browse properties across Indian states
- Toggle between dark/light themes
- Search and filter properties
- View owner contact details
- Test responsive design on mobile

## 🚨 Troubleshooting

### Common Issues & Solutions

#### 1. **Frontend Won't Start - Missing Dependencies**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

#### 2. **Backend Connection Issues**
```bash
# Check if MongoDB is running
mongosh
# or
mongo

# Verify backend port in frontend proxy
# frontend/package.json should have:
"proxy": "http://localhost:5001"
```

#### 3. **Build Cache Issues**
```bash
cd frontend
npm run clear-cache
npm start
```

#### 4. **Port Already in Use**
```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 5001
npx kill-port 5001
```

#### 5. **MongoDB Connection Failed**
- **Local MongoDB**: Ensure MongoDB service is running
- **MongoDB Atlas**: Check connection string and network access
- **Firewall**: Ensure ports 27017 (local) or 27017+ (Atlas) are open

#### 6. **Environment Variables Not Loading**
- Ensure `.env` files exist in both `backend/` and `frontend/` directories
- Restart servers after changing environment variables
- Check for typos in variable names

#### 7. **Dark Mode Not Working**
- Clear browser cache and localStorage
- Check if Tailwind CSS is properly configured
- Verify `darkMode: 'class'` in `tailwind.config.js`

## 🌐 Deployment

### Frontend Deployment (Netlify/Vercel)
```bash
cd frontend
npm run build

# Deploy the build folder to your hosting platform
# Set environment variables in hosting dashboard
```

### Backend Deployment (Railway/Render/Heroku)
```bash
# Set environment variables in hosting platform
# Deploy using Git or CLI tools
# Ensure MongoDB connection string is updated for production
```

### MongoDB Atlas Setup
1. Create account at [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create new cluster
3. Add database user and whitelist IP addresses
4. Update `MONGODB_URI` in backend `.env`

## 📊 Performance Metrics

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s
- **Bundle Size**: Optimized with code splitting

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt with salt rounds
- **Input Validation** - Comprehensive data sanitization
- **CORS Protection** - Cross-origin request security
- **Rate Limiting** - API request throttling
- **SSL/HTTPS** - Encrypted communications
- **Environment Variables** - Sensitive data protection

## 🧪 Testing

```bash
# Frontend Tests
cd frontend
npm test                    # Run all tests
npm test -- --coverage     # Run with coverage report
npm test -- --watch        # Watch mode for development

# Backend Tests
cd backend
npm test                    # Run API tests
npm run test:integration    # Integration tests
npm run test:unit          # Unit tests

# E2E Tests
npm run test:e2e           # End-to-end testing
```

## 📈 Analytics & Monitoring

- **Core Web Vitals** - Performance monitoring with reportWebVitals.js
- **Error Tracking** - Real-time error reporting and logging
- **User Analytics** - Usage patterns and user behavior metrics
- **Payment Analytics** - Transaction tracking and revenue metrics
- **Performance Monitoring** - Server response times and database queries

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
```bash
git clone https://github.com/Bil-2/mess-wallah.git
cd mess-wallah
```

2. **Create Feature Branch**
```bash
git checkout -b feature/amazing-feature
```

3. **Make Changes**
- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed

4. **Commit Changes**
```bash
git add .
git commit -m "Add amazing feature: detailed description"
```

5. **Push and Create PR**
```bash
git push origin feature/amazing-feature
# Create Pull Request on GitHub
```

### Development Guidelines
- Use meaningful commit messages
- Follow React and Node.js best practices
- Maintain consistent code formatting
- Add JSDoc comments for functions
- Update README for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS approach
- **MongoDB** - For the flexible NoSQL database
- **Cloudinary** - For image optimization services
- **Open Source Community** - For countless helpful libraries
- **Contributors** - All developers who helped improve this project

## 📞 Support & Contact

- **Email**: support@messwallah.com
- **Documentation**: [Wiki](https://github.com/Bil-2/mess-wallah/wiki)
- **Issues**: [GitHub Issues](https://github.com/Bil-2/mess-wallah/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Bil-2/mess-wallah/discussions)

## 📋 Changelog

### v3.0.0 (Current) - Dark Mode & All India Coverage
- ✨ **Dark/Light Mode Toggle** - Smooth theme switching with system sync
- 🇮🇳 **All India Property Data** - 25+ properties across 15+ states
- 🎨 **Premium UI Design** - Glass-morphism with backdrop blur
- 📱 **Enhanced Mobile Experience** - Touch-friendly interactions
- ⚡ **Performance Optimizations** - Lazy loading and caching improvements
- 🔍 **Advanced Search & Filters** - Multi-parameter property search
- 👥 **Owner Contact Integration** - Direct phone and email access
- 🏠 **Realistic Demo Data** - Authentic Indian property information

### v2.0.0 - PWA & Performance
- 📱 Progressive Web App implementation
- 💳 Payment integration with multiple methods
- ⚡ Performance optimizations and lazy loading
- 🎨 Enhanced UI/UX with modern design
- 📴 Offline support and caching strategies
- ♿ Accessibility improvements (WCAG compliance)
- 🔒 Security enhancements and JWT implementation

### v1.0.0 - Initial Release
- 🏠 Basic room booking and management
- 👤 User authentication and registration
- 📱 Responsive design foundation
- 🔍 Basic search functionality

---

<div align="center">

**Made with ❤️ for the student community across India**

![India](https://img.shields.io/badge/Made%20in-India-orange?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjgiIGZpbGw9IiNGRjk5MzMiLz4KPHJlY3QgeT0iOCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjgiIGZpbGw9IiNGRkZGRkYiLz4KPHJlY3QgeT0iMTYiIHdpZHRoPSIyNCIgaGVpZ2h0PSI4IiBmaWxsPSIjMTM4ODA4Ii8+Cjwvc3ZnPgo=)

[⭐ Star this repo](https://github.com/Bil-2/mess-wallah) • [🐛 Report Bug](https://github.com/Bil-2/mess-wallah/issues) • [💡 Request Feature](https://github.com/Bil-2/mess-wallah/issues)

</div>
