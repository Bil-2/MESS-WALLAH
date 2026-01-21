import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiMapPin, FiStar, FiHeart, FiChevronDown, FiGrid, FiList,
  FiWifi, FiShield, FiCoffee, FiWind, FiTruck, FiX, FiPhone, FiShare2,
  FiCheck, FiClock, FiUsers, FiHome, FiZap, FiAward, FiTrendingUp,
  FiFilter, FiChevronRight, FiPlay, FiCamera
} from 'react-icons/fi';
import { useAuthContext } from '../context/AuthContext';
import { useDebounce } from '../hooks/usePerformance';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import api from '../utils/api';

// ============================================
// MARKET-RESEARCH BASED MODERN ROOM CARD
// Inspired by: OYO, Airbnb, Booking.com, NoBroker
// ============================================
const ModernRoomCard = ({ room, onBook, onView, onFavorite, isFavorite }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const images = room.photos?.length > 0
    ? room.photos.map(p => p.url || p)
    : [room.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600'];

  // Auto-rotate images on hover (like Airbnb)
  useEffect(() => {
    if (isHovered && images.length > 1) {
      const interval = setInterval(() => {
        setImageIndex(prev => (prev + 1) % images.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isHovered, images.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setImageIndex(0); }}
      className="group bg-white dark:bg-gray-800/90 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm"
    >
      {/* Image Section - Airbnb Style */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={imageIndex}
            src={images[imageIndex]}
            alt={room.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Image Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setImageIndex(idx); }}
                className={`w-1.5 h-1.5 rounded-full transition-all ${idx === imageIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'
                  }`}
              />
            ))}
          </div>
        )}

        {/* Top Badges Row */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            {/* Superhost/Verified Badge - Like Airbnb */}
            {room.verified && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-white backdrop-blur-md rounded-full shadow-lg border border-gray-100"
              >
                <FiAward className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-xs font-bold" style={{ color: '#000000' }}>Superhost</span>
              </motion.div>
            )}

            {/* Room Type Badge */}
            <div className="px-2.5 py-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg uppercase tracking-wide">
              {room.roomType || 'Room'}
            </div>
          </div>

          {/* Favorite Button - Heart */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onFavorite(room._id || room.id); }}
            className={`p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all ${isFavorite
              ? 'bg-rose-500 text-white'
              : 'bg-white/90 text-gray-700 hover:bg-white'
              }`}
          >
            <FiHeart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </motion.button>
        </div>

        {/* Bottom Left - Price Tag (OYO Style) */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-white backdrop-blur-md rounded-xl px-3 py-2 shadow-lg border border-gray-100">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black" style={{ color: '#000000' }}>₹{(room.rent || room.rentPerMonth || 0).toLocaleString()}</span>
              <span className="text-sm font-medium" style={{ color: '#4B5563' }}>/mo</span>
            </div>
          </div>
        </div>

        {/* Photo Count Badge */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-xs">
            <FiCamera className="w-3 h-3" />
            <span>{images.length}</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Location - Small & Subtle */}
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-1">
          <FiMapPin className="w-3.5 h-3.5" />
          <span className="truncate">{room.location || room.city}</span>
        </div>

        {/* Title */}
        <h3
          onClick={() => onView(room._id || room.id)}
          className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 cursor-pointer hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
        >
          {room.title}
        </h3>

        {/* Rating & Reviews - Booking.com Style */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500 rounded-lg">
            <FiStar className="w-3.5 h-3.5 text-white fill-current" />
            <span className="text-sm font-bold text-white">{room.rating || 4.5}</span>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {room.reviews || 0} reviews
          </span>
          {room.rating >= 4.5 && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Excellent</span>
          )}
        </div>

        {/* Amenities - Compact Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(room.amenities || []).slice(0, 4).map((amenity, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-xs rounded-full capitalize"
            >
              {amenity}
            </span>
          ))}
          {(room.amenities?.length || 0) > 4 && (
            <span className="px-2 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-xs rounded-full font-medium">
              +{room.amenities.length - 4} more
            </span>
          )}
        </div>

        {/* Urgency Indicator - Booking.com Style */}
        <div className="flex items-center gap-2 mb-4 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800/30">
          <FiZap className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
            HIGH DEMAND - {Math.floor(Math.random() * 10) + 3} people viewing
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onBook(room._id || room.id)}
            className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-violet-500/25 transition-all"
          >
            Book Now
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open(`tel:${room.ownerPhone}`, '_self')}
            className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
          >
            <FiPhone className="w-5 h-5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              navigator.share?.({
                title: room.title,
                url: `${window.location.origin}/rooms/${room._id}`
              }) || navigator.clipboard.writeText(`${window.location.origin}/rooms/${room._id}`);
              toast.success('Link copied!');
            }}
            className="p-3 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <FiShare2 className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ============================================
// MAIN ROOMS PAGE COMPONENT
// ============================================
const Rooms = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // State
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filters
  const initialSearch = searchParams.get('search') || '';
  const [filters, setFilters] = useState({
    search: initialSearch,
    location: initialSearch,
    minRent: '',
    maxRent: '',
    roomType: '',
    amenities: [],
    sortBy: 'popular'
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  // Popular Cities Data
  const popularCities = [
    { name: 'Bangalore', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=300', rooms: '2,500+' },
    { name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=300', rooms: '1,800+' },
    { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=300', rooms: '1,500+' },
    { name: 'Pune', image: 'https://images.unsplash.com/photo-1625731226721-b4d51ae70e20?w=300', rooms: '1,200+' },
    { name: 'Chennai', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=300', rooms: '900+' },
    { name: 'Kolkata', image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=300', rooms: '800+' },
  ];

  // Amenity Options
  const amenityOptions = [
    { key: 'wifi', label: 'WiFi', icon: FiWifi },
    { key: 'mess', label: 'Meals', icon: FiCoffee },
    { key: 'ac', label: 'AC', icon: FiWind },
    { key: 'security', label: 'Security', icon: FiShield },
    { key: 'parking', label: 'Parking', icon: FiTruck },
    { key: 'laundry', label: 'Laundry', icon: FiHome },
  ];

  // Fetch Rooms
  const fetchRooms = useCallback(async (page = 1, append = false) => {
    try {
      if (!append) setLoading(true);

      const params = new URLSearchParams({
        page,
        limit: 50,
        ...(filters.search && { search: filters.search }),
        ...(filters.location && { location: filters.location }),
        ...(filters.minRent && { minRent: filters.minRent }),
        ...(filters.maxRent && { maxRent: filters.maxRent }),
        ...(filters.roomType && { roomType: filters.roomType }),
        ...(filters.amenities.length && { amenities: filters.amenities.join(',') }),
      });

      const response = await api.get(`/rooms?${params}`);
      const data = response.data;

      if (data.success) {
        const transformedRooms = (data.data || []).map(room => ({
          ...room,
          id: room._id,
          location: `${room.address?.area || ''}, ${room.address?.city || ''}`.trim(),
          city: room.address?.city || '',
          rent: room.rentPerMonth,
          image: room.photos?.[0]?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600',
          verified: true,
          ownerPhone: room.owner?.phone || '+91 9876543210',
          ownerName: room.owner?.name || 'Property Owner',
        }));

        if (append) {
          setRooms(prev => [...prev, ...transformedRooms]);
        } else {
          setRooms(transformedRooms);
        }

        setTotalPages(data.pagination?.totalPages || 1);
        setHasMore(data.pagination?.hasNextPage || false);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Initial Load
  useEffect(() => {
    const savedFavorites = localStorage.getItem('mess-wallah-favorites');
    if (savedFavorites) setFavorites(new Set(JSON.parse(savedFavorites)));
    fetchRooms(1);
  }, []);

  // Search Effect
  useEffect(() => {
    fetchRooms(1);
  }, [debouncedSearch, filters.roomType, filters.minRent, filters.maxRent, filters.amenities.length]);

  // Handlers
  const handleBook = (roomId) => {
    if (!user) {
      toast.error('Please login to book');
      navigate('/login');
      return;
    }
    navigate(`/rooms/${roomId}`);
  };

  const handleView = (roomId) => navigate(`/rooms/${roomId}`);

  const handleFavorite = (roomId) => {
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

  const handleCityClick = (city) => {
    setFilters(prev => ({ ...prev, search: city, location: city }));
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      fetchRooms(currentPage + 1, true);
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      minRent: '',
      maxRent: '',
      roomType: '',
      amenities: [],
      sortBy: 'popular'
    });
  };

  const activeFiltersCount = [
    filters.roomType,
    filters.minRent,
    filters.maxRent,
    ...filters.amenities
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-purple-50/20 dark:from-gray-900 dark:via-violet-950/20 dark:to-gray-900">

      {/* ============================================ */}
      {/* HERO SECTION - Airbnb/OYO Inspired */}
      {/* ============================================ */}
      <section className="relative pt-20 pb-8 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl animate-blob" />
          <div className="absolute top-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 right-1/3 w-60 h-60 bg-pink-400/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Find Your Perfect
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">Student Home</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              4,500+ verified rooms across India. Safe, affordable, and hassle-free.
            </p>
          </motion.div>

          {/* ============================================ */}
          {/* SEARCH BAR - Modern Floating Design */}
          {/* ============================================ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl shadow-violet-500/10 border border-gray-200/50 dark:border-gray-700/50 p-2">
              <div className="flex flex-col md:flex-row gap-2">
                {/* Location Input */}
                <div className="flex-1 relative">
                  <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-500" />
                  <input
                    type="text"
                    placeholder="Where do you want to stay?"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, location: e.target.value }))}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-violet-500 focus:bg-white dark:focus:bg-gray-700 transition-all"
                  />
                  {filters.search && (
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, search: '', location: '' }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full"
                    >
                      <FiX className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>

                {/* Room Type Dropdown */}
                <div className="relative md:w-48">
                  <FiHome className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-500" />
                  <select
                    value={filters.roomType}
                    onChange={(e) => setFilters(prev => ({ ...prev, roomType: e.target.value }))}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border-0 rounded-xl text-gray-900 dark:text-white appearance-none cursor-pointer focus:ring-2 focus:ring-violet-500 transition-all"
                  >
                    <option value="">All Types</option>
                    <option value="single">Single Room</option>
                    <option value="shared">Shared Room</option>
                    <option value="pg">PG</option>
                    <option value="studio">Studio</option>
                    <option value="apartment">Apartment</option>
                  </select>
                  <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Search Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fetchRooms(1)}
                  className="px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2 transition-all"
                >
                  <FiSearch className="w-5 h-5" />
                  <span>Search</span>
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-6 mt-8"
          >
            {[
              { icon: FiShield, label: '100% Verified', color: 'text-emerald-500' },
              { icon: FiUsers, label: '50K+ Happy Students', color: 'text-blue-500' },
              { icon: FiZap, label: 'Instant Booking', color: 'text-amber-500' },
              { icon: FiAward, label: 'Best Price Guarantee', color: 'text-rose-500' },
            ].map((stat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-sm font-medium">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================ */}
      {/* POPULAR CITIES - Horizontal Scroll */}
      {/* ============================================ */}
      <section className="py-8 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Popular Cities</h2>
            <button className="text-violet-600 dark:text-violet-400 text-sm font-medium hover:underline flex items-center gap-1">
              View all <FiChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
            {popularCities.map((city, idx) => (
              <motion.button
                key={city.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleCityClick(city.name)}
                className={`flex-shrink-0 relative w-36 h-24 rounded-2xl overflow-hidden group ${filters.search === city.name ? 'ring-2 ring-violet-500 ring-offset-2' : ''
                  }`}
              >
                <img src={city.image} alt={city.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3">
                  <p className="text-white font-bold text-sm">{city.name}</p>
                  <p className="text-white/80 text-xs">{city.rooms} rooms</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* FILTERS BAR - Sticky */}
      {/* ============================================ */}
      <section className="sticky top-16 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Amenity Filters - Desktop */}
            <div className="hidden md:flex items-center gap-2 overflow-x-auto">
              {amenityOptions.map((amenity) => {
                const isActive = filters.amenities.includes(amenity.key);
                return (
                  <button
                    key={amenity.key}
                    onClick={() => {
                      setFilters(prev => ({
                        ...prev,
                        amenities: isActive
                          ? prev.amenities.filter(a => a !== amenity.key)
                          : [...prev.amenities, amenity.key]
                      }));
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${isActive
                      ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                  >
                    <amenity.icon className="w-4 h-4" />
                    {amenity.label}
                  </button>
                );
              })}
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium"
            >
              <FiFilter className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 bg-violet-600 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Price Range & Sort */}
            <div className="flex items-center gap-2">
              {/* Price Range Dropdown */}
              <select
                value={filters.maxRent ? `${filters.minRent || '0'}-${filters.maxRent}` : ''}
                onChange={(e) => {
                  const [min, max] = e.target.value.split('-');
                  setFilters(prev => ({ ...prev, minRent: min || '', maxRent: max || '' }));
                }}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer focus:ring-2 focus:ring-violet-500"
              >
                <option value="">Any Price</option>
                <option value="0-8000">Under ₹8K</option>
                <option value="8000-12000">₹8K - ₹12K</option>
                <option value="12000-18000">₹12K - ₹18K</option>
                <option value="18000-100000">₹18K+</option>
              </select>

              {/* View Toggle */}
              <div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-rose-500 hover:text-rose-600 font-medium whitespace-nowrap"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* ============================================ */}
      {/* ROOMS GRID */}
      {/* ============================================ */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {filters.search ? `Rooms in ${filters.search}` : 'All Rooms'}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {rooms.length} properties found
              </p>
            </div>

            {/* Sort Dropdown */}
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium cursor-pointer focus:ring-2 focus:ring-violet-500"
            >
              <option value="popular">Most Popular</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          {/* Loading State */}
          {loading && rooms.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-violet-200 dark:border-violet-900 rounded-full animate-spin border-t-violet-600" />
                <FiHome className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-violet-600" />
              </div>
              <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium">Finding perfect rooms for you...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && rooms.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiSearch className="w-10 h-10 text-violet-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No rooms found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                We couldn't find any rooms matching your criteria. Try adjusting your filters or search for a different location.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl transition-colors"
              >
                Clear all filters
              </button>
            </motion.div>
          )}

          {/* Rooms Grid */}
          {rooms.length > 0 && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
              }}
              className={`grid gap-6 ${viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1 max-w-3xl mx-auto'
                }`}
            >
              {rooms.map((room) => (
                <ModernRoomCard
                  key={room._id || room.id}
                  room={room}
                  onBook={handleBook}
                  onView={handleView}
                  onFavorite={handleFavorite}
                  isFavorite={favorites.has(room._id || room.id)}
                />
              ))}
            </motion.div>
          )}

          {/* Load More Button */}
          {hasMore && rooms.length > 0 && (
            <div className="flex justify-center mt-12">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLoadMore}
                disabled={loading}
                className="px-8 py-4 bg-white dark:bg-gray-800 border-2 border-violet-600 text-violet-600 dark:text-violet-400 font-bold rounded-2xl hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Load More Rooms
                    <FiChevronDown className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </div>
          )}

          {/* Pagination Info */}
          {rooms.length > 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6">
              Showing {rooms.length} of {totalPages * 50}+ rooms
            </p>
          )}
        </div>
      </section>

      {/* ============================================ */}
      {/* TRUST SECTION */}
      {/* ============================================ */}
      <section className="py-16 bg-gradient-to-r from-violet-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: '4,500+', label: 'Verified Rooms' },
              { value: '50K+', label: 'Happy Students' },
              { value: '900+', label: 'Cities Covered' },
              { value: '4.8', label: 'Average Rating' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-black mb-2">{stat.value}</div>
                <div className="text-white/80 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* WHY CHOOSE US */}
      {/* ============================================ */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
              Why Students Love Us
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We're not just another room booking platform. We're your trusted partner in finding the perfect home away from home.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: FiShield,
                title: '100% Verified Properties',
                description: 'Every room is personally verified by our team. No fake listings, no scams.',
                color: 'from-emerald-500 to-teal-500'
              },
              {
                icon: FiZap,
                title: 'Instant Booking',
                description: 'Book your room in minutes. No lengthy paperwork or waiting periods.',
                color: 'from-amber-500 to-orange-500'
              },
              {
                icon: FiUsers,
                title: 'Girls Safety First',
                description: 'Special focus on safe accommodations for female students with 24/7 security.',
                color: 'from-rose-500 to-pink-500'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl -z-10"
                  style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}
                />
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-transparent transition-all">
                  <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* MOBILE FILTERS MODAL */}
      {/* ============================================ */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setShowMobileFilters(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Room Type */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Room Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {['single', 'shared', 'pg', 'studio', 'apartment'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilters(prev => ({ ...prev, roomType: prev.roomType === type ? '' : type }))}
                      className={`px-4 py-3 rounded-xl text-sm font-medium capitalize transition-all ${filters.roomType === type
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Amenities</label>
                <div className="flex flex-wrap gap-2">
                  {amenityOptions.map((amenity) => {
                    const isActive = filters.amenities.includes(amenity.key);
                    return (
                      <button
                        key={amenity.key}
                        onClick={() => {
                          setFilters(prev => ({
                            ...prev,
                            amenities: isActive
                              ? prev.amenities.filter(a => a !== amenity.key)
                              : [...prev.amenities, amenity.key]
                          }));
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive
                          ? 'bg-violet-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                          }`}
                      >
                        <amenity.icon className="w-4 h-4" />
                        {amenity.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Price Range</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Min ₹"
                    value={filters.minRent}
                    onChange={(e) => setFilters(prev => ({ ...prev, minRent: e.target.value }))}
                    className="px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-0 focus:ring-2 focus:ring-violet-500"
                  />
                  <input
                    type="number"
                    placeholder="Max ₹"
                    value={filters.maxRent}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxRent: e.target.value }))}
                    className="px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl border-0 focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>

              {/* Apply Button */}
              <div className="flex gap-3">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-xl"
                >
                  Clear All
                </button>
                <button
                  onClick={() => { setShowMobileFilters(false); fetchRooms(1); }}
                  className="flex-1 py-4 bg-violet-600 text-white font-semibold rounded-xl"
                >
                  Show Results
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Rooms;
