import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FiSearch, FiFilter, FiMapPin, FiStar, FiHeart, FiEye, FiCalendar, FiChevronDown,
  FiSliders, FiHome, FiUsers, FiWifi, FiShield, FiClock, FiGift, FiPhone, FiShare2,
  FiX, FiChevronRight, FiCheckCircle, FiDollarSign, FiUser, FiCoffee, FiLock, FiWind,
  FiSun, FiActivity, FiLayers, FiTruck
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
  const [searchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false); // Start with false to test
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  // Performance hooks - simplified
  const trackRender = () => { }; // Disabled for debugging
  const trackApiCall = () => { }; // Disabled for debugging

  // Get initial search from URL parameters
  const initialSearch = searchParams.get('search') || '';

  const [filters, setFilters] = useState({
    search: initialSearch,
    location: initialSearch, // Also set as location for city-based filtering
    minRent: '',
    maxRent: '',
    roomType: '',
    amenities: []
  });

  // Simplified - no debouncing for now
  // const debouncedSearch = useDebounce(filters.search, 300);
  // const debouncedLocation = useDebounce(filters.location, 300);

  const [showFilters, setShowFilters] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [favorites, setFavorites] = useState(new Set());
  const [showBookingModal, setShowBookingModal] = useState(false);

  const fetchRooms = useCallback(async () => {
    console.log('Starting fetchRooms...');

    try {
      setLoading(true);
      setError(null);

      // Build URL with search parameters
      const params = new URLSearchParams({
        page: currentPage,
        limit: 24
      });

      // Add search parameter if it exists
      if (filters.search) {
        params.append('search', filters.search);
      }

      const url = `/api/rooms?${params.toString()}`;
      console.log('Fetching from:', url);

      const response = await fetch(url);
      console.log('Response received:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Data received:', data);

        if (data.success && data.data) {
          const roomsArray = Array.isArray(data.data) ? data.data : [];
          console.log('Rooms count:', roomsArray.length);

          // Simple transformation
          const transformedRooms = roomsArray.map(room => ({
            id: room._id,
            _id: room._id,
            title: room.title,
            location: `${room.address?.area || ''}, ${room.address?.city || ''}`.trim(),
            city: room.address?.city || '',
            rent: room.rentPerMonth,
            rating: room.rating || 4.5,
            ownerName: room.owner?.name || 'Property Owner',
            ownerPhone: room.owner?.phone || '+91 9876543210',
            verified: true,
            amenities: room.amenities || ['wifi', 'security'],
            photos: room.photos || [], // Pass the entire photos array
            image: room.photos?.[0]?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
            roomType: room.roomType || 'single',
            reviews: room.totalReviews || 25,
            description: room.description || 'Well-furnished room',
            isVerified: true
          }));

          setRooms(transformedRooms);
          setTotalPages(data.pagination?.totalPages || 1);
          setHasMore(data.pagination?.hasNextPage || false);

          console.log('Successfully set', transformedRooms.length, 'rooms');
        } else {
          throw new Error('Invalid response structure');
        }
      } else {
        throw new Error(`API failed: ${response.status}`);
      }
    } catch (error) {
      console.error('Fetch error:', error);

      // Always show fallback data
      const fallbackRooms = generateMockRooms();
      setRooms(fallbackRooms);
      setTotalPages(1);
      setHasMore(false);

      toast.error('Loading sample data - API issue');
    } finally {
      setLoading(false);
      console.log('fetchRooms completed');
    }
  }, [currentPage, filters.search]);

  useEffect(() => {
    trackRender();

    // Load favorites from localStorage only once
    const savedFavorites = localStorage.getItem('mess-wallah-favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []); // Empty dependency array to run only once

  // Fetch rooms when page or search changes
  useEffect(() => {
    console.log('useEffect triggered, calling fetchRooms...');
    console.log('Current filters:', filters);

    // Fetch real data
    fetchRooms();
  }, [fetchRooms]); // Re-fetch when fetchRooms changes (which depends on currentPage and filters.search)

  // Handle URL search parameters - update filters when URL changes
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam && searchParam !== filters.search) {
      console.log('URL search parameter found:', searchParam);
      // Update filters to trigger search
      setFilters(prev => ({
        ...prev,
        search: searchParam,
        location: searchParam
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Filter rooms based on search criteria
  const filteredRooms = useMemo(() => {
    console.log('Filtering rooms:', {
      totalRooms: rooms.length,
      searchFilter: filters.search,
      locationFilter: filters.location
    });

    let filtered = rooms;

    // Filter by search term (title, location, owner name)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      console.log('Applying search filter:', searchTerm);

      filtered = filtered.filter(room => {
        const matches = room.title?.toLowerCase().includes(searchTerm) ||
          room.location?.toLowerCase().includes(searchTerm) ||
          room.ownerName?.toLowerCase().includes(searchTerm) ||
          room.city?.toLowerCase().includes(searchTerm);

        if (matches) {
          console.log('Room matches:', room.title, room.city);
        }
        return matches;
      });
    }

    // Filter by location
    if (filters.location && filters.location !== filters.search) {
      const locationTerm = filters.location.toLowerCase();
      filtered = filtered.filter(room =>
        room.location?.toLowerCase().includes(locationTerm) ||
        room.city?.toLowerCase().includes(locationTerm)
      );
    }

    // Filter by rent range
    if (filters.minRent) {
      filtered = filtered.filter(room => room.rent >= parseInt(filters.minRent));
    }
    if (filters.maxRent) {
      filtered = filtered.filter(room => room.rent <= parseInt(filters.maxRent));
    }

    // Filter by room type
    if (filters.roomType) {
      filtered = filtered.filter(room => room.roomType === filters.roomType);
    }

    console.log(`Filtered ${filtered.length} rooms from ${rooms.length} total`);
    return filtered;
  }, [rooms, filters]);

  const generateMockRooms = () => {
    return [
      {
        _id: '68c597a733be9e11bd88fa52',
        id: '68c597a733be9e11bd88fa52',
        title: 'Premium Student Room - Koramangala',
        location: 'Koramangala, Bangalore',
        city: 'Bangalore',
        rent: 12000,
        rating: 4.8,
        ownerName: 'Rajesh Kumar',
        ownerPhone: '+91 9876543210',
        verified: true,
        isVerified: true,
        amenities: ['wifi', 'mess', 'security', 'laundry', 'parking', 'gym'],
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
        roomType: 'bachelor',
        reviews: 45,
        description: 'Spacious and well-furnished room perfect for students. Located in the heart of Koramangala.'
      },
      {
        _id: '68c597a733be9e11bd88fa53',
        id: '68c597a733be9e11bd88fa53',
        title: 'Cozy Girls PG - Whitefield',
        location: 'Whitefield, Bangalore',
        city: 'Bangalore',
        rent: 9500,
        rating: 4.6,
        ownerName: 'Sunita Devi',
        ownerPhone: '+91 9876543211',
        verified: true,
        isVerified: true,
        amenities: ['wifi', 'mess', 'security', 'laundry', 'ac'],
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
        roomType: 'pg',
        reviews: 32,
        description: 'Safe and secure accommodation for working women and students.'
      },
      {
        _id: '68c597a733be9e11bd88fa54',
        id: '68c597a733be9e11bd88fa54',
        title: 'Budget Friendly Room - BTM Layout',
        location: 'BTM Layout, Bangalore',
        city: 'Bangalore',
        rent: 7500,
        rating: 4.2,
        ownerName: 'Ramesh Gupta',
        ownerPhone: '+91 9876543212',
        verified: true,
        isVerified: true,
        amenities: ['wifi', 'mess', 'security', 'laundry'],
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        roomType: 'student',
        reviews: 28,
        description: 'Affordable accommodation for students and young professionals.'
      },
      {
        _id: '68c597a733be9e11bd88fa55',
        id: '68c597a733be9e11bd88fa55',
        title: 'Luxury Studio Apartment - Indiranagar',
        location: 'Indiranagar, Bangalore',
        city: 'Bangalore',
        rent: 18000,
        rating: 4.9,
        ownerName: 'Priya Nair',
        ownerPhone: '+91 9876543213',
        verified: true,
        isVerified: true,
        amenities: ['wifi', 'parking', 'gym', 'security', 'ac', 'balcony'],
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
        roomType: 'bachelor',
        reviews: 67,
        description: 'Premium studio apartment with modern amenities for working professionals.'
      },
      {
        _id: '68c597a733be9e11bd88fa56',
        id: '68c597a733be9e11bd88fa56',
        title: 'Family Room - Jayanagar',
        location: 'Jayanagar, Bangalore',
        city: 'Bangalore',
        rent: 15000,
        rating: 4.7,
        ownerName: 'Lakshmi Rao',
        ownerPhone: '+91 9876543214',
        verified: true,
        isVerified: true,
        amenities: ['wifi', 'parking', 'mess', 'laundry', 'security', 'playground'],
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
        roomType: 'family',
        reviews: 41,
        description: 'Spacious accommodation suitable for small families or groups.'
      },
      // Kolkata Rooms
      {
        _id: '68c597a733be9e11bd88fa57',
        id: '68c597a733be9e11bd88fa57',
        title: 'Student PG - Salt Lake',
        location: 'Salt Lake, Kolkata',
        city: 'Kolkata',
        rent: 8500,
        rating: 4.5,
        ownerName: 'Amit Chatterjee',
        ownerPhone: '+91 9876543215',
        verified: true,
        isVerified: true,
        amenities: ['wifi', 'mess', 'security', 'laundry', 'ac'],
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
        roomType: 'pg',
        reviews: 35,
        description: 'Comfortable PG accommodation near IT hubs in Salt Lake.'
      },
      {
        _id: '68c597a733be9e11bd88fa58',
        id: '68c597a733be9e11bd88fa58',
        title: 'Heritage Room - Park Street',
        location: 'Park Street, Kolkata',
        city: 'Kolkata',
        rent: 11000,
        rating: 4.6,
        ownerName: 'Ruma Das',
        ownerPhone: '+91 9876543216',
        verified: true,
        isVerified: true,
        amenities: ['wifi', 'mess', 'security', 'laundry', 'balcony'],
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
        roomType: 'bachelor',
        reviews: 42,
        description: 'Beautiful room in the heart of Kolkata with cultural vibes.'
      },
      // Delhi Rooms
      {
        _id: '68c597a733be9e11bd88fa59',
        id: '68c597a733be9e11bd88fa59',
        title: 'Modern PG - Lajpat Nagar',
        location: 'Lajpat Nagar, Delhi',
        city: 'Delhi',
        rent: 13000,
        rating: 4.4,
        ownerName: 'Vikash Sharma',
        ownerPhone: '+91 9876543217',
        verified: true,
        isVerified: true,
        amenities: ['wifi', 'mess', 'security', 'laundry', 'ac', 'gym'],
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        roomType: 'pg',
        reviews: 38,
        description: 'Modern PG facility in central Delhi with metro connectivity.'
      },
      {
        _id: '68c597a733be9e11bd88fa60',
        id: '68c597a733be9e11bd88fa60',
        title: 'Premium Room - Connaught Place',
        location: 'Connaught Place, Delhi',
        city: 'Delhi',
        rent: 16000,
        rating: 4.8,
        ownerName: 'Neha Gupta',
        ownerPhone: '+91 9876543218',
        verified: true,
        isVerified: true,
        amenities: ['wifi', 'parking', 'security', 'ac', 'balcony', 'gym'],
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
        roomType: 'bachelor',
        reviews: 55,
        description: 'Premium accommodation in the heart of Delhi.'
      },
      // Pune Rooms
      {
        _id: '68c597a733be9e11bd88fa61',
        id: '68c597a733be9e11bd88fa61',
        title: 'Student Hostel - Kothrud',
        location: 'Kothrud, Pune',
        city: 'Pune',
        rent: 7000,
        rating: 4.3,
        ownerName: 'Sachin Patil',
        ownerPhone: '+91 9876543219',
        verified: true,
        isVerified: true,
        amenities: ['wifi', 'mess', 'security', 'laundry', 'library'],
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
        roomType: 'student',
        reviews: 29,
        description: 'Budget-friendly hostel near Pune University.'
      },
      {
        _id: '68c597a733be9e11bd88fa62',
        id: '68c597a733be9e11bd88fa62',
        title: 'IT Professional PG - Hinjewadi',
        location: 'Hinjewadi, Pune',
        city: 'Pune',
        rent: 12000,
        rating: 4.7,
        ownerName: 'Pradeep Joshi',
        ownerPhone: '+91 9876543220',
        verified: true,
        isVerified: true,
        amenities: ['wifi', 'mess', 'security', 'laundry', 'ac', 'parking'],
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        roomType: 'pg',
        reviews: 47,
        description: 'Perfect for IT professionals working in Hinjewadi IT Park.'
      },
      // Chennai Rooms
      {
        _id: '68c597a733be9e11bd88fa63',
        id: '68c597a733be9e11bd88fa63',
        title: 'Beach Side Room - Marina',
        location: 'Marina Beach, Chennai',
        city: 'Chennai',
        rent: 10000,
        rating: 4.5,
        ownerName: 'Kamala Krishnan',
        ownerPhone: '+91 9876543221',
        verified: true,
        isVerified: true,
        amenities: ['wifi', 'mess', 'security', 'laundry', 'balcony'],
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
        roomType: 'bachelor',
        reviews: 33,
        description: 'Beautiful room with sea view near Marina Beach.'
      },
      {
        _id: '68c597a733be9e11bd88fa64',
        id: '68c597a733be9e11bd88fa64',
        title: 'Tech Hub PG - OMR',
        location: 'OMR, Chennai',
        city: 'Chennai',
        rent: 9500,
        rating: 4.4,
        ownerName: 'Rajesh Murugan',
        ownerPhone: '+91 9876543222',
        verified: true,
        isVerified: true,
        amenities: ['wifi', 'mess', 'security', 'laundry', 'ac', 'gym'],
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
        roomType: 'pg',
        reviews: 41,
        description: 'Modern PG facility on OMR for tech professionals.'
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
        <div className="text-center mb-8 pt-20">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 bg-clip-text text-transparent mb-4">
            Find Your Perfect Student Housing
          </h1>
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-4">
            Discover comfortable, affordable student accommodations with verified owners and safe environment
          </p>


          {/* Safety Banner */}
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 px-6 py-3 rounded-full text-base font-bold shadow-lg">
            <FiShield className="w-5 h-5" />
            <span>BE TENSION FREE! - Complete Girls Safety Guaranteed</span>
            <FiStar className="w-5 h-5" />
          </div>
        </div>

        {/* Enhanced Search & Filter Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl mb-8 border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Search Header */}
          <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 p-6 text-white">
            <h2 className="text-xl font-bold mb-2">Find Your Perfect Room</h2>
            <p className="text-orange-100 text-sm">Search from 970+ verified accommodations</p>
          </div>

          <div className="p-6">
            {/* Main Search Bar */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="h-6 w-6 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by city, area, college, or landmark..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="block w-full pl-12 pr-20 py-4 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                />
                {filters.search && (
                  <button
                    type="button"
                    onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                    className="absolute inset-y-0 right-16 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center pr-4"
                >
                  <div className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                    Search
                  </div>
                </button>
              </div>
            </form>

            {/* Search Suggestions */}
            {!filters.search && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center mb-2">
                  <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">💡 Popular Searches:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Koramangala', 'Whitefield', 'BTM Layout', 'Electronic City',
                    'Marathahalli', 'HSR Layout', 'Indiranagar', 'Jayanagar'
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setFilters(prev => ({ ...prev, search: suggestion }))}
                      className="px-3 py-1 bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-200 dark:border-blue-600 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Filter Chips */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mr-3">Popular Filters:</span>
                <div className="h-px bg-gradient-to-r from-gray-200 to-transparent flex-1"></div>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Under ₹10K', icon: FiHome, filter: { maxRent: '10000' }, color: 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300' },
                  { label: '₹10K-₹15K', icon: FiDollarSign, filter: { minRent: '10000', maxRent: '15000' }, color: 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300' },
                  { label: 'Girls Only', icon: FiUser, filter: { roomType: 'girls' }, color: 'bg-pink-100 text-pink-700 hover:bg-pink-200 dark:bg-pink-900/30 dark:text-pink-300' },
                  { label: 'WiFi', icon: FiWifi, filter: { amenities: ['wifi'] }, color: 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-300' },
                  { label: 'Mess', icon: FiCoffee, filter: { amenities: ['mess'] }, color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300' },
                  { label: 'Security', icon: FiShield, filter: { amenities: ['security'] }, color: 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300' }
                ].map((quickFilter, index) => {
                  const Icon = quickFilter.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => setFilters(prev => ({ ...prev, ...quickFilter.filter }))}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md ${quickFilter.color}`}
                    >
                      <Icon className="w-4 h-4" />
                      {quickFilter.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <FiSliders className="w-5 h-5" />
                Advanced Filters
                <FiChevronDown className={`w-5 h-5 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Active Filters Count */}
              {(filters.location || filters.minRent || filters.maxRent || filters.roomType || filters.amenities.length > 0) && (
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm font-bold">
                    {[filters.location, filters.minRent, filters.maxRent, filters.roomType, ...filters.amenities].filter(Boolean).length} active
                  </span>
                  <button
                    onClick={() => setFilters({ search: filters.search, location: '', minRent: '', maxRent: '', roomType: '', amenities: [] })}
                    className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 mt-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <FiSliders className="w-6 h-6 text-orange-500 mr-3" />
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">Advanced Filters</h3>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Refine your search</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Location Filter */}
                <div className="space-y-3">
                  <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300">
                    <FiMapPin className="w-4 h-4 mr-2 text-orange-500" />
                    Specific Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g., Koramangala, Whitefield"
                      value={filters.location}
                      onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700/50 dark:text-white transition-all duration-300 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Room Type Filter */}
                <div className="space-y-3">
                  <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300">
                    <FiHome className="w-4 h-4 mr-2 text-orange-500" />
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
                <div className="space-y-3">
                  <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300">
                    <FiDollarSign className="w-4 h-4 text-orange-500 mr-2" />
                    Price Range (Monthly)
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="Min ₹"
                        value={filters.minRent}
                        onChange={(e) => setFilters(prev => ({ ...prev, minRent: e.target.value }))}
                        className="w-full px-3 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700/50 dark:text-white transition-all duration-300"
                      />
                    </div>
                    <div className="flex items-center px-2">
                      <span className="text-gray-400">to</span>
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        placeholder="Max ₹"
                        value={filters.maxRent}
                        onChange={(e) => setFilters(prev => ({ ...prev, maxRent: e.target.value }))}
                        className="w-full px-3 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700/50 dark:text-white transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Amenities Filter */}
                <div className="space-y-3">
                  <label className="flex items-center text-sm font-bold text-gray-700 dark:text-gray-300">
                    <FiStar className="w-4 h-4 text-orange-500 mr-2" />
                    Must-Have Amenities
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {[
                      { key: 'wifi', label: 'WiFi', icon: FiWifi, color: 'text-blue-600' },
                      { key: 'mess', label: 'Mess', icon: FiCoffee, color: 'text-green-600' },
                      { key: 'laundry', label: 'Laundry', icon: FiLayers, color: 'text-purple-600' },
                      { key: 'security', label: 'Security', icon: FiLock, color: 'text-red-600' },
                      { key: 'parking', label: 'Parking', icon: FiTruck, color: 'text-gray-600' },
                      { key: 'gym', label: 'Gym', icon: FiActivity, color: 'text-orange-600' },
                      { key: 'ac', label: 'AC', icon: FiWind, color: 'text-cyan-600' },
                      { key: 'balcony', label: 'Balcony', icon: FiSun, color: 'text-emerald-600' }
                    ].map((amenity) => {
                      const Icon = amenity.icon;
                      return (
                        <label key={amenity.key} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                          <input
                            type="checkbox"
                            checked={filters.amenities.includes(amenity.key)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFilters(prev => ({ ...prev, amenities: [...prev.amenities, amenity.key] }));
                              } else {
                                setFilters(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== amenity.key) }));
                              }
                            }}
                            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <Icon className={`w-4 h-4 ${amenity.color}`} />
                          <span className={`text-sm font-medium ${amenity.color}`}>{amenity.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Apply Filters Button */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={handleSearch}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <FiSearch className="w-5 h-5" />
                  Apply Filters & Search
                  <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                    {rooms.length} rooms
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFilters({ search: '', location: '', minRent: '', maxRent: '', roomType: '', amenities: [] })}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  <FiX className="w-4 h-4" />
                  Reset All Filters
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

            {/* Responsive Room Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredRooms.length > 0 ? (
                filteredRooms.map((room, index) => (
                  <ResponsiveRoomCard
                    key={room._id || room.id || index}
                    room={room}
                    onBookNow={handleBookNow}
                    onViewDetails={handleViewDetails}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={favorites.has(room._id || room.id)}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="flex justify-center mb-4">
                    <FiHome className="w-16 h-16 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                    No rooms found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {filters.search || filters.location
                      ? `No accommodations available for "${filters.search || filters.location}"`
                      : 'No rooms match your current filters'
                    }
                  </p>
                  <button
                    onClick={() => setFilters({
                      search: '',
                      location: '',
                      minRent: '',
                      maxRent: '',
                      roomType: '',
                      amenities: []
                    })}
                    className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* Load More Button */}
            {hasMore && !loading && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  className="btn-responsive bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg hover:shadow-xl"
                >
                  Load More Rooms
                </button>
              </div>
            )}

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
                <div className="flex justify-center mb-4">
                  <FiHome className="w-16 h-16 text-gray-400" />
                </div>
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
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${bookingStep >= step
                        ? 'bg-white text-orange-500'
                        : 'bg-white/30 text-white'
                        }`}>
                        {bookingStep > step ? <FiCheckCircle className="w-5 h-5" /> : step}
                      </div>
                      {step < 3 && (
                        <div className={`w-12 h-1 mx-2 rounded ${bookingStep > step ? 'bg-white' : 'bg-white/30'
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
                          <FiShield className="w-5 h-5 text-blue-600 mt-0.5" />
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
