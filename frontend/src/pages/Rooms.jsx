import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  FiSearch, FiFilter, FiMapPin, FiStar, FiHeart, FiEye, FiCalendar, FiChevronDown, 
  FiSliders, FiHome, FiUsers, FiWifi, FiShield, FiClock, FiGift, FiPhone, FiShare2,
  FiX, FiChevronRight, FiCheckCircle
} from 'react-icons/fi';
import { useAuthContext } from '../context/AuthContext';
import rocketAPI from '../services/rocketAPI';
import { usePerformance, useDebounce, useThrottle } from '../hooks/usePerformance';
import VirtualizedRoomList from '../components/VirtualizedRoomList';
import LoadingSpinner from '../components/LoadingSpinner';
import ResponsiveContainer from '../components/ResponsiveContainer';
import ResponsiveRoomCard from '../components/ResponsiveRoomCard';
import toast from 'react-hot-toast';

const Rooms = () => {
  const { user } = useAuthContext();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  
  // Performance hooks
  const { trackRender, trackApiCall } = usePerformance();
  
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    minRent: '',
    maxRent: '',
    roomType: '',
    amenities: []
  });
  
  // Debounced search for performance
  const debouncedSearch = useDebounce(filters.search, 300);
  const debouncedLocation = useDebounce(filters.location, 300);
  
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [favorites, setFavorites] = useState(new Set());
  const [showBookingModal, setShowBookingModal] = useState(false);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      trackApiCall();
      
      // Get URL parameters for initial search
      const urlParams = new URLSearchParams(window.location.search);
      const urlSearch = urlParams.get('search');
      
      // Use URL search parameter if available, otherwise use filters
      const searchFilters = { ...filters };
      if (urlSearch && !searchFilters.search) {
        searchFilters.search = urlSearch;
        setFilters(prev => ({ ...prev, search: urlSearch }));
      }
      
      // Build query parameters for rocket API
      const queryParams = {
        page: currentPage,
        limit: 24,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(debouncedLocation && { location: debouncedLocation }),
        ...(searchFilters.minRent && { minPrice: searchFilters.minRent }),
        ...(searchFilters.maxRent && { maxPrice: searchFilters.maxRent }),
        ...(searchFilters.roomType && { roomType: searchFilters.roomType })
      };
      
      // Use rocket API for optimized fetching
      const response = await rocketAPI.getRooms(queryParams);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          // Handle both array and object responses
          const roomsArray = Array.isArray(data.data) ? data.data : data.data.rooms || [];
          // Transform backend data to match frontend format
          const transformedRooms = roomsArray.map(room => ({
            id: room._id,
            _id: room._id,
            title: room.title,
            location: `${room.address?.area || ''}, ${room.address?.city || ''}`,
            rent: room.rentPerMonth,
            rating: room.rating || 4.5,
            ownerName: room.ownerName || 'Property Owner',
            ownerPhone: room.ownerPhone || '+91 9876543210',
            verified: room.isVerified || true,
            amenities: room.amenities || ['wifi', 'security'],
            image: room.photos && room.photos[0] ? room.photos[0].url : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop&q=75',
            roomType: room.roomType || 'Single',
            reviews: room.reviews ? room.reviews.length : Math.floor(Math.random() * 50) + 10,
            description: room.description || 'Well-furnished room in prime location.',
            isVerified: room.isVerified || true
          }));
          
          // Append to existing rooms for infinite scroll
          if (currentPage === 1) {
            setRooms(transformedRooms);
          } else {
            setRooms(prev => [...prev, ...transformedRooms]);
          }
          
          setTotalPages(data.pagination?.totalPages || Math.ceil(data.total / 24) || 1);
          setHasMore(currentPage < (data.pagination?.totalPages || 1));
        }
      } else {
        throw new Error('Failed to fetch rooms');
      }
    } catch (error) {
      console.error('Error loading rooms:', error);
      setError('Failed to load rooms');
      // Final fallback - show sample rooms
      if (currentPage === 1) {
        const fallbackRooms = generateMockRooms();
        setRooms(fallbackRooms);
        setTotalPages(1);
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, debouncedLocation, filters, trackApiCall]);

  useEffect(() => {
    trackRender();
    fetchRooms();
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('mess-wallah-favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, [fetchRooms, trackRender]);

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

  // Optimized event handlers with useCallback
  const handleBookNow = useCallback((roomId) => {
    if (!user) {
      toast.error('Please login to book a room');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
      return;
    }
    
    const room = rooms.find(r => r.id === roomId || r._id === roomId);
    if (room) {
      setSelectedRoom(room);
      setShowBookingModal(true);
    }
  }, [user, rooms]);

  const handleViewDetails = useCallback((roomId) => {
    window.location.href = `/rooms/${roomId}`;
  }, []);

  const handleToggleFavorite = useCallback((roomId) => {
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
  }, [favorites]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      setCurrentPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  // Throttled filter change handler
  const handleFilterChange = useThrottle(useCallback((newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setRooms([]);
  }, []), 300);

  // Additional booking handlers
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    duration: 1,
    name: '',
    phone: '',
    email: '',
    occupation: '',
    emergencyContact: '',
    specialRequests: ''
  });

  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    if (bookingStep === 1) {
      if (!bookingData.checkInDate || !bookingData.duration) {
        toast.error('Please fill in check-in date and duration');
        return;
      }
    } else if (bookingStep === 2) {
      if (!bookingData.name || !bookingData.phone || !bookingData.email) {
        toast.error('Please fill in all required fields');
        return;
      }
    }
    setBookingStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setBookingStep(prev => prev - 1);
  };

  const handleSubmitBooking = async () => {
    setLoading(true);
    try {
      // Mock booking submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Booking request submitted successfully!', {
        duration: 5000,
        position: 'top-center',
      });
      
      setShowBookingModal(false);
      setBookingStep(1);
      
      // Show success message with owner contact
      setTimeout(() => {
        toast.success(`Owner will contact you at ${bookingData.phone} within 24 hours`, {
          duration: 6000,
          position: 'top-center',
        });
      }, 1000);
      
    } catch (error) {
      toast.error('Failed to submit booking request');
    } finally {
      setLoading(false);
    }
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
      <ResponsiveContainer className="py-4 sm:py-6 lg:py-8">
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
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
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
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
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

            {/* Rocket-Fast Room List */}
            <VirtualizedRoomList
              rooms={rooms}
              onBookNow={handleBookNow}
              onViewDetails={handleViewDetails}
              onToggleFavorite={handleToggleFavorite}
              isLoading={loading}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
            />

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

        {/* Enhanced Booking Modal */}
        {showBookingModal && selectedRoom && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowBookingModal(false)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">
                        Book {selectedRoom.title}
                      </h3>
                      <p className="text-orange-100 flex items-center gap-2">
                        <FiMapPin className="w-4 h-4" />
                        {selectedRoom.location}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowBookingModal(false)}
                      className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                    >
                      <FiX className="w-6 h-6" />
                    </button>
                  </div>
                  
                  {/* Step Indicator */}
                  <div className="flex items-center mt-6 space-x-4">
                    {[1, 2, 3].map((step) => (
                      <div key={step} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          bookingStep >= step 
                            ? 'bg-white text-orange-500' 
                            : 'bg-white/30 text-white'
                        }`}>
                          {bookingStep > step ? <FiCheckCircle className="w-5 h-5" /> : step}
                        </div>
                        {step < 3 && (
                          <div className={`w-12 h-1 mx-2 rounded ${
                            bookingStep > step ? 'bg-white' : 'bg-white/30'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6">
                  {/* Step 1: Booking Details */}
                  {bookingStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                          Booking Details
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Check-in Date *
                            </label>
                            <input
                              type="date"
                              name="checkInDate"
                              value={bookingData.checkInDate}
                              onChange={handleBookingInputChange}
                              min={new Date().toISOString().split('T')[0]}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Duration (months) *
                            </label>
                            <select
                              name="duration"
                              value={bookingData.duration}
                              onChange={handleBookingInputChange}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                              required
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
                                <option key={month} value={month}>
                                  {month} month{month > 1 ? 's' : ''}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Price Calculation */}
                        <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700 dark:text-gray-300">
                              Monthly Rent: ₹{(selectedRoom.rentPerMonth || selectedRoom.rent || 0).toLocaleString()}
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">
                              Duration: {bookingData.duration} month{bookingData.duration > 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="border-t border-orange-200 dark:border-orange-700 mt-2 pt-2">
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                Total Amount:
                              </span>
                              <span className="text-xl font-bold text-orange-600">
                                ₹{((selectedRoom.rentPerMonth || selectedRoom.rent || 0) * bookingData.duration).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Personal Information */}
                  {bookingStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                          Personal Information
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              name="name"
                              value={bookingData.name}
                              onChange={handleBookingInputChange}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              value={bookingData.phone}
                              onChange={handleBookingInputChange}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={bookingData.email}
                              onChange={handleBookingInputChange}
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Occupation
                            </label>
                            <input
                              type="text"
                              name="occupation"
                              value={bookingData.occupation}
                              onChange={handleBookingInputChange}
                              placeholder="Student, Working Professional, etc."
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Emergency Contact Number
                            </label>
                            <input
                              type="tel"
                              name="emergencyContact"
                              value={bookingData.emergencyContact}
                              onChange={handleBookingInputChange}
                              placeholder="Parent/Guardian contact number"
                              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Review & Submit */}
                  {bookingStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                          Review & Submit
                        </h4>
                        
                        {/* Booking Summary */}
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                          <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Booking Summary</h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Room:</span>
                              <span className="font-medium">{selectedRoom.title}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Check-in:</span>
                              <span className="font-medium">{new Date(bookingData.checkInDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                              <span className="font-medium">{bookingData.duration} month{bookingData.duration > 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Contact:</span>
                              <span className="font-medium">{bookingData.name} - {bookingData.phone}</span>
                            </div>
                            <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
                              <div className="flex justify-between">
                                <span className="font-semibold text-gray-800 dark:text-gray-200">Total Amount:</span>
                                <span className="font-bold text-orange-600 text-lg">
                                  ₹{((selectedRoom.rentPerMonth || selectedRoom.rent || 0) * bookingData.duration).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Special Requests */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Special Requests (Optional)
                          </label>
                          <textarea
                            name="specialRequests"
                            value={bookingData.specialRequests}
                            onChange={handleBookingInputChange}
                            rows={3}
                            placeholder="Any special requirements or requests..."
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>

                        {/* Terms & Conditions */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div className="text-sm text-blue-800 dark:text-blue-200">
                              <p className="font-semibold mb-1">Important Notes:</p>
                              <ul className="space-y-1 text-xs">
                                <li>• Owner will contact you within 24 hours to confirm availability</li>
                                <li>• Security deposit may be required as per owner's policy</li>
                                <li>• Room visit can be arranged before final booking</li>
                                <li>• Cancellation policy applies as per terms & conditions</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Modal Footer */}
                  <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-4">
                      {bookingStep > 1 && (
                        <button
                          onClick={handlePrevStep}
                          className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors hover:scale-105"
                        >
                          <FiChevronRight className="w-4 h-4 rotate-180" />
                          Previous
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowBookingModal(false)}
                        className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors hover:scale-105"
                      >
                        Cancel
                      </button>

                      {bookingStep < 3 ? (
                        <button
                          onClick={handleNextStep}
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                        >
                          Next
                          <FiChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={handleSubmitBooking}
                          disabled={loading}
                          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <FiCheckCircle className="w-4 h-4" />
                              Submit Booking
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
      </ResponsiveContainer>
    </div>
  );
};

export default Rooms;
