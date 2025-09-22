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
  }, [currentPage]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      
      // Get URL parameters for initial search
      const urlParams = new URLSearchParams(window.location.search);
      const urlSearch = urlParams.get('search');
      
      // Use URL search parameter if available, otherwise use filters
      const searchFilters = { ...filters };
      if (urlSearch && !searchFilters.search) {
        searchFilters.search = urlSearch;
        setFilters(prev => ({ ...prev, search: urlSearch }));
      }
      
      // Build query parameters for real API
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 24,
        ...(searchFilters.search && { search: searchFilters.search }),
        ...(searchFilters.location && { location: searchFilters.location }),
        ...(searchFilters.minRent && { minPrice: searchFilters.minRent }),
        ...(searchFilters.maxRent && { maxPrice: searchFilters.maxRent }),
        ...(searchFilters.roomType && { roomType: searchFilters.roomType })
      });
      
      // Fetch real rooms from your backend
      const response = await fetch(`/api/rooms?${queryParams}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Handle both array and object responses
          const roomsArray = Array.isArray(data.data) ? data.data : data.data.rooms || [];
          // Transform backend data to match frontend format
          const transformedRooms = roomsArray.map(room => ({
            _id: room._id,
            title: room.title,
            location: `${room.address.area}, ${room.address.city}`,
            rent: room.rentPerMonth,
            rating: room.rating || 4.5,
            ownerName: room.ownerName || 'Property Owner',
            ownerPhone: room.ownerPhone || '+91 9876543210',
            verified: true,
            amenities: room.amenities || ['wifi', 'security'],
            image: room.photos && room.photos[0] ? room.photos[0].url : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
            type: room.roomType || 'Single',
            reviews: room.reviews ? room.reviews.length : Math.floor(Math.random() * 50) + 10,
            description: room.description || 'Well-furnished room in prime location.'
          }));
          
          setRooms(transformedRooms);
          setTotalPages(data.pagination?.totalPages || Math.ceil(data.total / 24) || 1);
        }
      } else {
        // Fallback to show some sample data
        const fallbackRooms = generateMockRooms();
        setRooms(fallbackRooms);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Error loading rooms:', error);
      // Final fallback - show sample rooms
      const fallbackRooms = generateMockRooms();
      setRooms(fallbackRooms);
      setTotalPages(1);
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
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 bg-clip-text text-transparent mb-4">
            Find Your Perfect Student Housing
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-4">
            Discover comfortable, affordable student accommodations with verified owners and safe environment
          </p>

          {/* Safety Banner */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 px-6 py-3 rounded-full text-base font-bold shadow-lg">
            <span>🛡️</span>
            <span>BE TENSION FREE! - Complete Girls Safety Guaranteed</span>
            <span>✨</span>
          </div>
        </div>

        {/* Enhanced Search Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
          {/* Quick Search Bar */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by city, area, college..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full pl-12 pr-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white text-base"
                />
                {filters.search && (
                  <button
                    type="button"
                    onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
              >
                <FiSearch className="w-5 h-5" />
                Search
              </button>
            </div>
          </form>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mr-2">Quick:</span>
            {[
              { label: 'Under ₹10K', filter: { maxRent: '10000' } },
              { label: '₹10K-₹15K', filter: { minRent: '10000', maxRent: '15000' } },
              { label: 'Girls Only', filter: { roomType: 'girls' } },
              { label: 'WiFi', filter: { amenities: ['wifi'] } },
              { label: 'Mess', filter: { amenities: ['mess'] } }
            ].map((quickFilter, index) => (
              <button
                key={index}
                onClick={() => setFilters(prev => ({ ...prev, ...quickFilter.filter }))}
                className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium hover:bg-orange-200 dark:hover:bg-orange-900/50"
              >
                {quickFilter.label}
              </button>
            ))}
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium"
            >
              <FiSliders className="w-4 h-4" />
              Filters
              <FiChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            {/* Active Filters Count */}
            {(filters.location || filters.minRent || filters.maxRent || filters.roomType || filters.amenities.length > 0) && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
                <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-bold">
                  {[filters.location, filters.minRent, filters.maxRent, filters.roomType, ...filters.amenities].filter(Boolean).length}
                </span>
                <button
                  onClick={() => setFilters({ search: filters.search, location: '', minRent: '', maxRent: '', roomType: '', amenities: [] })}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>

          {showFilters && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                      <FiMapPin className="inline w-4 h-4 mr-2" />
                      Specific Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Koramangala, Whitefield"
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700/50 dark:text-white transition-all duration-300"
                    />
                  </div>

                  {/* Room Type Filter */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                      <FiHome className="inline w-4 h-4 mr-2" />
                      Room Type
                    </label>
                    <select
                      value={filters.roomType}
                      onChange={(e) => setFilters(prev => ({ ...prev, roomType: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700/50 dark:text-white transition-all duration-300"
                    >
                      <option value="">All Types</option>
                      <option value="single">Single Room</option>
                      <option value="shared">Shared Room</option>
                      <option value="studio">Studio Apartment</option>
                      <option value="family">Family Room</option>
                      <option value="girls">Girls Only</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                      💰 Price Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min ₹"
                        value={filters.minRent}
                        onChange={(e) => setFilters(prev => ({ ...prev, minRent: e.target.value }))}
                        className="w-1/2 px-3 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700/50 dark:text-white transition-all duration-300"
                      />
                      <input
                        type="number"
                        placeholder="Max ₹"
                        value={filters.maxRent}
                        onChange={(e) => setFilters(prev => ({ ...prev, maxRent: e.target.value }))}
                        className="w-1/2 px-3 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700/50 dark:text-white transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Amenities Filter */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                      ⭐ Must-Have Amenities
                    </label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {['wifi', 'mess', 'laundry', 'security', 'parking', 'gym', 'ac', 'balcony'].map((amenity) => (
                        <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.amenities.includes(amenity)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters(prev => ({ ...prev, amenities: [...prev.amenities, amenity] }));
                              } else {
                                setFilters(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== amenity) }));
                              }
                            }}
                            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

              {/* Apply Filters Button */}
              <div className="flex justify-center mt-6">
                <button
                  type="button"
                  onClick={handleSearch}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
                >
                  Apply Filters & Search
                </button>
              </div>
            </div>
          )}
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" text="Finding perfect rooms for you..." />
          </div>
        )}

        {!loading && (
          <>
            <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {rooms.length} rooms found
              </p>
              <div className="flex flex-col md:flex-row gap-3 items-center">
                <div className="flex items-center gap-2 text-orange-600">
                  <FiGift className="w-4 h-4" />
                  <span className="font-medium text-sm">Free site visits!</span>
                </div>
                <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                  <FiShield className="w-4 h-4" />
                  <span>Safety Verified</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room, index) => (
                <div
                  key={room._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
                  onClick={() => handleViewDetails(room, { stopPropagation: () => { } })}
                >
                  <div className="relative h-48">
                    <img
                      src={room.photos?.[0]?.url || room.image || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop'}
                      alt={room.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">
                      {room.roomType || room.type || 'Available'}
                    </div>
                    <div className="absolute top-2 left-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                      🛡️ Safe
                    </div>
                    <button
                      className="absolute top-10 left-2 bg-white p-1 rounded-full hover:bg-gray-100"
                      onClick={(e) => handleFavorite(room._id, e)}
                    >
                      <FiHeart className={`w-4 h-4 ${favorites.has(room._id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
                    </button>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">
                        {room.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {room.rating || 4.0}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mb-3">
                      <FiMapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {room.location || `${room.address?.area || ''}, ${room.address?.city || ''}`.trim().replace(/^,\s*/, '') || 'Location not specified'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-xl font-bold text-orange-600">
                          ₹{(room.rentPerMonth || room.rent || 0).toLocaleString()}
                        </span>
                        <span className="text-gray-500 text-sm">/month</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">{room.totalReviews || room.reviewCount || (Array.isArray(room.reviews) ? room.reviews.length : room.reviews) || 0} reviews</div>
                        <div className="text-xs font-medium text-green-600 flex items-center gap-1">
                          {room.owner?.verified || room.verified ? (
                            <>
                              <FiShield className="w-3 h-3" />
                              Verified
                            </>
                          ) : (
                            'Pending'
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {(room.amenities || []).slice(0, 3).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium"
                        >
                          {amenity}
                        </span>
                      ))}
                      {(room.amenities || []).length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                          +{room.amenities.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-medium text-sm"
                        onClick={(e) => handleBookNow(room, e)}
                      >
                        Book Now
                      </button>
                      <button
                        className="px-3 py-2 border border-orange-600 text-orange-600 rounded-lg hover:bg-orange-600 hover:text-white"
                        onClick={(e) => handleViewDetails(room, e)}
                      >
                        <FiEye className="w-4 h-4" />
                      </button>
                      <button
                        className="px-3 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-600 hover:text-white"
                        onClick={(e) => handleCallOwner(room, e)}
                      >
                        <FiPhone className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-orange-500 text-orange-600 rounded-lg font-medium hover:bg-orange-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                >
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                    if (pageNum > totalPages) return null;

                    return (
                      <button
                        key={pageNum}
                        className={`w-10 h-10 rounded-lg font-medium ${pageNum === currentPage
                          ? 'bg-orange-600 text-white'
                          : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-orange-500 hover:text-orange-600'
                          }`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-orange-500 text-orange-600 rounded-lg font-medium hover:bg-orange-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                >
                  Next
                </button>
              </div>
            )}

            {rooms.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                  No rooms found
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search criteria or filters
                </p>
                <button
                  onClick={() => setFilters({ search: '', location: '', minRent: '', maxRent: '', roomType: '', amenities: [] })}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Clear All Filters
                </button>
              </div>
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
