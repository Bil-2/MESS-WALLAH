# MESS WALLAH 

A modern, full-stack web application for mess accommodation booking and management, optimized for both mobile and desktop devices.

## Features

### For Students/Tenants
- **Room Discovery**: Browse available mess rooms with detailed information
- **Advanced Search**: Filter by location, price, amenities, and meal plans
- **Booking Management**: Easy booking process with real-time availability
- **Payment Integration**: Multiple payment methods (Card, UPI, Wallet)
- **Review System**: Rate and review accommodations
- **Profile Management**: Manage personal information and preferences

### For Mess Owners
- **Property Management**: Add and manage multiple properties
- **Booking Requests**: Handle booking requests and confirmations
- **Revenue Analytics**: Track earnings and occupancy rates
- **Tenant Communication**: Built-in messaging system
- **Room Management**: Update room details, pricing, and availability

### Technical Features
- **Progressive Web App (PWA)**: Installable app with offline support
- **Mobile-First Design**: Optimized for all screen sizes
- **Performance Optimized**: Lazy loading, caching, and code splitting
- **Real-time Updates**: Live booking status and notifications
- **Secure Payments**: SSL encrypted payment processing
- **Accessibility**: WCAG compliant with keyboard navigation

## Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks and concurrent features
- **React Query** - Data fetching, caching, and synchronization
- **React Router** - Client-side routing with lazy loading
- **Tailwind CSS** - Utility-first CSS framework
- **React Hot Toast** - Beautiful notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication and authorization
- **Cloudinary** - Image storage and optimization

### Performance & PWA
- **Service Worker** - Advanced caching strategies
- **Web Vitals** - Performance monitoring
- **Lazy Loading** - Images and components
- **Code Splitting** - Optimized bundle loading
- **Intersection Observer** - Efficient scroll-based loading

## Mobile Optimization

- **Touch-friendly UI**: 44px minimum touch targets
- **Responsive Design**: Mobile-first approach
- **Offline Support**: Service worker caching
- **Fast Loading**: Critical CSS inlining
- **App-like Experience**: PWA with app shortcuts
- **Network Awareness**: Offline detection and graceful degradation

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Configure your API endpoints
npm start
```

### Environment Variables

#### Backend (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/messwallah
JWT_SECRET=your-jwt-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENVIRONMENT=development
```

## Project Structure

```
MESS WALLAH/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   ├── dbConnection.js
│   │   └── jwtConfig.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   └── roomController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Payment.js
│   │   ├── Review.js
│   │   ├── Room.js
│   │   └── User.js
│   └── server.js
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── sw.js
│   ├── src/
│   │   ├── components/
│   │   │   ├── LazyImage.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Logo.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── PaymentModal.jsx
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Bookings.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── RoomDetails.jsx
│   │   │   └── Rooms.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   └── performance.css
│   │   ├── utils/
│   │   │   └── paymentHelpers.js
│   │   ├── App.js
│   │   └── index.js
└── README.md
```

## Deployment

### Frontend (Netlify/Vercel)
```bash
npm run build
# Deploy the build folder
```

### Backend (Heroku/Railway)
```bash
# Set environment variables
# Deploy using Git or CLI
```

### MongoDB (Atlas)
- Create a MongoDB Atlas cluster
- Update connection string in environment variables

## Performance Metrics

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Input Validation**: Comprehensive data validation
- **CORS Protection**: Cross-origin request security
- **Rate Limiting**: API request throttling
- **SSL Encryption**: HTTPS for all communications

## Testing

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test

# E2E tests
npm run test:e2e
```

## Analytics & Monitoring

- **Core Web Vitals**: Performance monitoring
- **Error Tracking**: Real-time error reporting
- **User Analytics**: Usage patterns and metrics
- **Payment Analytics**: Transaction tracking

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- MongoDB team for the flexible database
- All contributors and testers

## Support

For support, email support@messwallah.com or join our Slack channel.

## Changelog

### v2.0.0 (Latest)
- Complete mobile and desktop optimization
- Progressive Web App implementation
- Payment integration with multiple methods
- Performance optimizations and lazy loading
- Enhanced UI/UX with modern design
- Offline support and caching strategies
- Accessibility improvements
- Security enhancements

### v1.0.0
- Initial release with basic functionality
- Room booking and management
- User authentication
- Basic responsive design

---

**Made with for the student community**
