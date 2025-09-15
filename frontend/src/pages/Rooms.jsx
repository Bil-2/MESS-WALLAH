import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiFilter, FiMapPin, FiStar, FiHeart, FiEye, FiCalendar, FiChevronDown, FiSliders, FiHome, FiUsers, FiWifi, FiShield, FiClock, FiGift, FiPhone, FiShare2 } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { roomsAPI } from '../utils/api';
import { getAllRooms, mockRooms } from '../data/mockRooms';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Rooms = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    minRent: '',
    maxRent: '',
    roomType: '',
    amenities: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    fetchRooms();
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('mess-wallah-favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, [currentPage, filters]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      
      // Use comprehensive mock data directly for demo
      const mockResponse = getAllRooms(filters, currentPage, 50);
      
      if (mockResponse.success && mockResponse.data) {
        setRooms(mockResponse.data.rooms);
        setTotalPages(mockResponse.data.pagination?.totalPages || 1);
        toast.success(`Loaded ${mockResponse.data.rooms.length} rooms`);
      } else {
        // Fallback to all mock rooms
        setRooms(mockRooms);
        setTotalPages(Math.ceil(mockRooms.length / 50));
        toast.success(`Loaded ${mockRooms.length} demo rooms`);
      }
    } catch (error) {
      console.error('Error loading rooms:', error);
      // Final fallback
      setRooms(mockRooms);
      setTotalPages(Math.ceil(mockRooms.length / 50));
      toast.error('Using demo room data');
    } finally {
      setLoading(false);
    }
  };

  const generateMockRooms = () => {
    return [
      {
        _id: '68c597a733be9e11bd88fa52',
        title: 'Premium Student Room - Koramangala',
        location: 'Koramangala, Bangalore',
        rent: 12000,
        rating: 4.8,
        ownerName: 'Rajesh Kumar',
        ownerPhone: '+91 9876543210',
        verified: true,
        amenities: ['wifi', 'mess', 'security', 'laundry', 'parking', 'gym'],
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
        type: 'Single',
        reviews: 45,
        description: 'Spacious and well-furnished room perfect for students. Located in the heart of Koramangala.'
      },
      {
        _id: '68c597a733be9e11bd88fa53',
        title: 'Cozy Girls PG - Whitefield',
        location: 'Whitefield, Bangalore',
        rent: 9500,
        rating: 4.6,
        ownerName: 'Sunita Devi',
        ownerPhone: '+91 9876543211',
        verified: true,
        amenities: ['wifi', 'mess', 'security', 'laundry', 'ac'],
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
        type: 'Shared',
        reviews: 32,
        description: 'Safe and secure accommodation for working women and students.'
      },
      {
        _id: '68c597a733be9e11bd88fa54',
        title: 'Budget Friendly Room - BTM Layout',
        location: 'BTM Layout, Bangalore',
        rent: 7500,
        rating: 4.2,
        ownerName: 'Ramesh Gupta',
        ownerPhone: '+91 9876543212',
        verified: true,
        amenities: ['wifi', 'mess', 'security', 'laundry'],
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        type: 'Shared',
        reviews: 28,
        description: 'Affordable accommodation for students and young professionals.'
      },
      {
        _id: '68c597a733be9e11bd88fa55',
        title: 'Luxury Studio Apartment - Indiranagar',
        location: 'Indiranagar, Bangalore',
        rent: 18000,
        rating: 4.9,
        ownerName: 'Priya Nair',
        ownerPhone: '+91 9876543213',
        verified: true,
        amenities: ['wifi', 'parking', 'gym', 'security', 'ac', 'balcony'],
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
        type: 'Studio',
        reviews: 67,
        description: 'Premium studio apartment with modern amenities for working professionals.'
      },
      {
        _id: '68c597a733be9e11bd88fa56',
        title: 'Family Room - Jayanagar',
        location: 'Jayanagar, Bangalore',
        rent: 15000,
        rating: 4.7,
        ownerName: 'Lakshmi Rao',
        ownerPhone: '+91 9876543214',
        verified: true,
        amenities: ['wifi', 'parking', 'mess', 'laundry', 'security', 'playground'],
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
        type: 'Family',
        reviews: 41,
        description: 'Spacious accommodation suitable for small families or groups.'
      }
    ];
  };

  const handleFavorite = (roomId, e) => {
    e.stopPropagation();
    const newFavorites = new Set(favorites);

    if (favorites.has(roomId)) {
      newFavorites.delete(roomId);
      toast.success('Removed from favorites');
    } else {
      newFavorites.add(roomId);
      toast.success('Added to favorites');
    }

    setFavorites(newFavorites);
    localStorage.setItem('mess-wallah-favorites', JSON.stringify([...newFavorites]));
  };

  const handleBookNow = (room, e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please login to book a room');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
      return;
    }

    setSelectedRoom(room);
    setShowBookingModal(true);
    toast.success(`Booking ${room.title}...`);
  };

  const handleViewDetails = (room, e) => {
    e.stopPropagation();
    // Navigate to room details page
    window.location.href = `/rooms/${room._id}`;
  };

  const handleCallOwner = (room, e) => {
    e.stopPropagation();
    if (room.ownerPhone) {
      window.open(`tel:${room.ownerPhone}`, '_self');
      toast.success(`Calling ${room.ownerName}...`);
    } else {
      toast.error('Owner phone number not available');
    }
  };

  const handleShare = (room, e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: room.title,
        text: `Check out this amazing room: ${room.title} in ${room.location} for ₹${room.rent}/month`,
        url: `${window.location.origin}/rooms/${room._id}`
      });
    } else {
      // Fallback to clipboard
      const shareText = `Check out this amazing room: ${room.title} in ${room.location} for ₹${room.rent}/month - ${window.location.origin}/rooms/${room._id}`;
      navigator.clipboard.writeText(shareText);
      toast.success('Room link copied to clipboard!');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRooms();
    toast.success('Searching for rooms...');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 text-4xl opacity-10"
          variants={floatingVariants}
          animate="animate"
        >
          🏠
        </motion.div>
        <motion.div
          className="absolute top-60 right-20 text-3xl opacity-10"
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: '1s' }}
        >
          🛏️
        </motion.div>
        <motion.div
          className="absolute bottom-40 left-20 text-5xl opacity-10"
          variants={floatingVariants}
          animate="animate"
          style={{ animationDelay: '2s' }}
        >
          🔑
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Header */}
        <motion.div
          className="text-center mb-12 pt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 bg-clip-text text-transparent mb-6"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Find Your Perfect Room
          </motion.h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            Discover comfortable, affordable rooms with verified owners and homely atmosphere
          </p>

          {/* Safety Banner */}
          <motion.div
            className="inline-flex items-center gap-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 px-6 py-3 rounded-full text-lg font-bold shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 500 }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🛡️
            </motion.div>
            <span>BE TENSION FREE! - Complete Girls Safety Guaranteed</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ✨
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Search Section */}
        <motion.div
          className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-12 border border-white/20 dark:border-gray-700/30"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by location, college, or area..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700/50 dark:text-white transition-all duration-300 text-lg backdrop-blur-sm"
              />
            </div>
            <motion.button
              type="submit"
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-green-500/25 transition-all duration-300"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiSearch className="w-5 h-5" />
              Search
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <FiSliders className="w-5 h-5" />
              Filters
              <FiChevronDown className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </motion.button>
          </form>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-200 dark:border-gray-700 pt-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="Enter location"
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700/50 dark:text-white transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Min Rent
                    </label>
                    <input
                      type="number"
                      placeholder="₹0"
                      value={filters.minRent}
                      onChange={(e) => setFilters(prev => ({ ...prev, minRent: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700/50 dark:text-white transition-all duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                      Max Rent
                    </label>
                    <input
                      type="number"
                      placeholder="₹50000"
                      value={filters.maxRent}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxRent: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700/50 dark:text-white transition-all duration-300"
                    />
                  </div>
                  <div className="flex items-end">
                    <motion.button
                      type="button"
                      onClick={() => setFilters({ search: '', location: '', minRent: '', maxRent: '', roomType: '', amenities: [] })}
                      className="w-full px-6 py-3 text-orange-600 border-2 border-orange-500 rounded-xl hover:bg-orange-500 hover:text-white transition-all duration-300 font-bold"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Clear Filters
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" text="Finding perfect rooms for you..." />
          </div>
        )}

        {!loading && (
          <>
            <motion.div
              className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <p className="text-xl font-bold text-gray-700 dark:text-gray-300">
                {rooms.length} amazing rooms found
              </p>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <motion.div
                  className="flex items-center gap-2 text-orange-600"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <FiGift className="w-5 h-5" />
                  <span className="font-bold">Free site visits available!</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-bold"
                  whileHover={{ scale: 1.05 }}
                >
                  <FiShield className="w-4 h-4" />
                  <span>Girls Safety Verified</span>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {rooms.map((room, index) => (
                <motion.div
                  key={room._id}
                  className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden cursor-pointer transform transition-all duration-500 border border-white/20 dark:border-gray-700/30"
                  variants={itemVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                  onHoverStart={() => setHoveredCard(room._id)}
                  onHoverEnd={() => setHoveredCard(null)}
                  onClick={() => handleViewDetails(room, { stopPropagation: () => { } })}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={room.photos?.[0]?.url || room.image || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop'}
                      alt={room.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop';
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      {room.roomType || room.type || 'Available'}
                    </div>

                    {/* Safety Badge */}
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      🛡️ Girls Safe
                    </div>

                    <motion.button
                      className="absolute top-16 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-300"
                      animate={{ scale: hoveredCard === room._id ? [1, 1.2, 1] : 1 }}
                      transition={{ duration: 0.3 }}
                      onClick={(e) => handleFavorite(room._id, e)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiHeart className={`w-5 h-5 transition-colors duration-300 ${favorites.has(room._id) ? 'text-red-500 fill-current' : 'text-gray-400'
                        }`} />
                    </motion.button>
                    <motion.button
                      className="absolute top-16 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all duration-300"
                      onClick={(e) => handleShare(room, e)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FiShare2 className="w-4 h-4 text-gray-600" />
                    </motion.button>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 line-clamp-1">
                        {room.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                          {room.rating || 4.0}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <FiMapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">
                        {room.location || `${room.address?.area || ''}, ${room.address?.city || ''}`.trim().replace(/^,\s*/, '') || 'Location not specified'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                          ₹{(room.rentPerMonth || room.rent || 0).toLocaleString()}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">/month</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">{room.totalReviews || room.reviewCount || (Array.isArray(room.reviews) ? room.reviews.length : room.reviews) || 0} reviews</div>
                        <div className="text-sm font-bold text-green-600 flex items-center gap-1">
                          {room.owner?.verified || room.verified ? (
                            <>
                              <FiShield className="w-3 h-3" />
                              Verified Owner
                            </>
                          ) : (
                            'Pending'
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {(room.amenities || []).slice(0, 3).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-700 rounded-full text-xs font-bold"
                        >
                          {amenity}
                        </span>
                      ))}
                      {(room.amenities || []).length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">
                          +{room.amenities.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-2xl font-bold transition-all duration-300 hover:shadow-lg"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => handleBookNow(room, e)}
                      >
                        Book Now
                      </motion.button>
                      <motion.button
                        className="px-4 py-3 border-2 border-orange-500 text-orange-600 rounded-2xl font-bold hover:bg-orange-500 hover:text-white transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => handleViewDetails(room, e)}
                      >
                        <FiEye className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        className="px-4 py-3 border-2 border-green-500 text-green-600 rounded-2xl font-bold hover:bg-green-500 hover:text-white transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => handleCallOwner(room, e)}
                      >
                        <FiPhone className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <motion.div
                className="flex justify-center items-center gap-4 mt-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <motion.button
                  className="px-6 py-3 bg-white dark:bg-gray-800 border-2 border-orange-500 text-orange-600 rounded-xl font-bold hover:bg-orange-500 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: currentPage > 1 ? 1.02 : 1 }}
                  whileTap={{ scale: currentPage > 1 ? 0.98 : 1 }}
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                >
                  Previous
                </motion.button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                    if (pageNum > totalPages) return null;

                    return (
                      <motion.button
                        key={pageNum}
                        className={`w-12 h-12 rounded-xl font-bold transition-all duration-300 ${pageNum === currentPage
                          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                          : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-orange-500 hover:text-orange-600'
                          }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </motion.button>
                    );
                  })}
                </div>

                <motion.button
                  className="px-6 py-3 bg-white dark:bg-gray-800 border-2 border-orange-500 text-orange-600 rounded-xl font-bold hover:bg-orange-500 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: currentPage < totalPages ? 1.02 : 1 }}
                  whileTap={{ scale: currentPage < totalPages ? 0.98 : 1 }}
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                >
                  Next
                </motion.button>
              </motion.div>
            )}

            {rooms.length === 0 && (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-8xl mb-6">🏠</div>
                <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                  No rooms found
                </h3>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                  Try adjusting your search criteria or filters
                </p>
                <motion.button
                  onClick={() => setFilters({ search: '', location: '', minRent: '', maxRent: '', roomType: '', amenities: [] })}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear All Filters
                </motion.button>
              </motion.div>
            )}
          </>
        )}

        {/* Simple Booking Modal */}
        {showBookingModal && selectedRoom && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Book {selectedRoom.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Contact the owner directly to book this room.
              </p>
              <div className="flex gap-3">
                <motion.button
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-2xl font-bold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleCallOwner(selectedRoom, { stopPropagation: () => { } });
                    setShowBookingModal(false);
                  }}
                >
                  Call Owner
                </motion.button>
                <motion.button
                  className="px-6 py-3 border-2 border-gray-300 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowBookingModal(false)}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Rooms;
