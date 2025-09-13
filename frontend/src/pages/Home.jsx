import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthContext } from '../context/AuthContext.jsx';
import { apiHelpers } from '../utils/api';
import InteractivePropertyCard from '../components/InteractivePropertyCard';

const Home = () => {
  const { user, isAuthenticated } = useAuthContext();
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);

        // Fetch featured rooms
        const roomsResponse = await apiHelpers.getFeaturedRooms();
        if (roomsResponse.success) {
          setFeaturedRooms(roomsResponse.data.rooms || []);
        }

        // Fetch dashboard stats if user is authenticated
        if (isAuthenticated()) {
          const statsResponse = await apiHelpers.getDashboardStats();
          if (statsResponse.success) {
            setStats(statsResponse.data.stats || {});
          }
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
        // Fallback to mock data for demo
        setFeaturedRooms([
          {
            _id: '1',
            title: 'Cozy Single Room in Koramangala',
            rentPerMonth: 12000,
            address: { area: 'Koramangala', city: 'Bangalore' },
            photos: [{ url: '/api/placeholder/400/300', isPrimary: true }],
            amenities: ['wifi', 'ac', 'parking'],
            rating: 4.5,
            totalReviews: 23,
            owner: { name: 'John Doe', verified: true }
          },
          {
            _id: '2',
            title: 'Spacious Shared Room near IT Hub',
            rentPerMonth: 8500,
            address: { area: 'Electronic City', city: 'Bangalore' },
            photos: [{ url: '/api/placeholder/400/300', isPrimary: true }],
            amenities: ['wifi', 'kitchen', 'laundry'],
            rating: 4.2,
            totalReviews: 18,
            owner: { name: 'Jane Smith', verified: true }
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, [isAuthenticated]);

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <motion.section
        className="relative py-20 px-4 text-center"
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h1
            className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Find Your Perfect Room
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Discover comfortable, affordable rooms with verified owners and seamless booking experience
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link
              to="/rooms"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Explore Rooms
            </Link>
            {!isAuthenticated() && (
              <Link
                to="/login"
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-600 hover:text-white transition-all duration-300"
              >
                Get Started
              </Link>
            )}
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20"
            animate={{ y: [0, -20, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-40 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-20"
            animate={{ y: [0, 20, 0], rotate: [360, 180, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.section>

      {/* Dashboard Stats for Authenticated Users */}
      {isAuthenticated() && Object.keys(stats).length > 0 && (
        <motion.section
          className="py-12 px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Welcome back, {user?.name}! 👋
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {user?.role === 'owner' ? (
                <>
                  <motion.div
                    className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.9 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Rooms</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalRooms || 0}</p>
                  </motion.div>

                  <motion.div
                    className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 1.0 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Rooms</h3>
                    <p className="text-3xl font-bold text-green-600">{stats.activeRooms || 0}</p>
                  </motion.div>

                  <motion.div
                    className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 1.1 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Bookings</h3>
                    <p className="text-3xl font-bold text-orange-600">{stats.pendingBookings || 0}</p>
                  </motion.div>

                  <motion.div
                    className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 1.2 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Revenue</h3>
                    <p className="text-3xl font-bold text-purple-600">₹{stats.totalRevenue?.toLocaleString('en-IN') || 0}</p>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div
                    className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.9 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">My Bookings</h3>
                    <p className="text-3xl font-bold text-blue-600">{stats.totalBookings || 0}</p>
                  </motion.div>

                  <motion.div
                    className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 1.0 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Bookings</h3>
                    <p className="text-3xl font-bold text-green-600">{stats.activeBookings || 0}</p>
                  </motion.div>

                  <motion.div
                    className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 1.1 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Favourite Rooms</h3>
                    <p className="text-3xl font-bold text-red-600">{stats.favouriteRooms || 0}</p>
                  </motion.div>

                  <motion.div
                    className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 1.2 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Completed</h3>
                    <p className="text-3xl font-bold text-purple-600">{stats.completedBookings || 0}</p>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </motion.section>
      )}

      {/* Featured Rooms Section */}
      <motion.section
        className="py-16 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl font-bold text-center mb-12 text-gray-800"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            Featured Rooms
          </motion.h2>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredRooms.map((room, index) => (
                <motion.div
                  key={room._id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
                >
                  <InteractivePropertyCard room={room} />
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
          >
            <Link
              to="/rooms"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              View All Rooms
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Trust Indicators */}
      <motion.section
        className="py-16 px-4 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0, duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl font-bold text-center mb-12 text-gray-800"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.6 }}
          >
            Why Choose MESS WALLAH?
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="text-center p-6"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 2.4, duration: 0.5 }}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Verified Owners</h3>
              <p className="text-gray-600">All property owners are verified for your safety and peace of mind</p>
            </motion.div>

            <motion.div
              className="text-center p-6"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 2.5, duration: 0.5 }}
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Instant Booking</h3>
              <p className="text-gray-600">Book your perfect room instantly with our streamlined process</p>
            </motion.div>

            <motion.div
              className="text-center p-6"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: 2.6, duration: 0.5 }}
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">24/7 Support</h3>
              <p className="text-gray-600">Get help whenever you need it with our dedicated support team</p>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
