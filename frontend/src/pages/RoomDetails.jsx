import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiHeart, FiShare2, FiPhone, FiMapPin, FiStar, FiWifi, FiShield, FiUsers, FiCalendar, FiDollarSign, FiCheck, FiX, FiTruck, FiMail, FiMaximize2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useAuthContext } from '../context/AuthContext';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(0);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    duration: 1,
    specialRequests: '',
    guestDetails: {
      name: '',
      email: '',
      phone: ''
    }
  });

  useEffect(() => {
    fetchRoomDetails();
  }, [id]);

  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API
      const response = await fetch(`/api/rooms/${id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setRoom(data.data);
          toast.success('Room details loaded successfully');
          return;
        }
      }
      
      // Fallback to mock data if API fails
      const fallbackRoom = getMockRoomData(id);
      setRoom(fallbackRoom);
      toast.error('Failed to load room details. Showing demo data.');
    } catch (error) {
      console.error('Error fetching room details:', error);
      // Final fallback to mock room
      const fallbackRoom = getMockRoomData(id);
      setRoom(fallbackRoom);
      toast.error('Failed to load room details. Showing demo data.');
    } finally {
      setLoading(false);
    }
  };

  const getMockRoomData = () => ({
    _id: id,
    title: 'Cozy Student Room near College',
    description: 'A comfortable and well-furnished room perfect for students. Located in the heart of Koramangala with easy access to colleges, restaurants, and public transport.',
    address: {
      area: 'Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034'
    },
    rentPerMonth: 8500,
    securityDeposit: 5000,
    rating: 4.5,
    reviewCount: 23,
    photos: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop', caption: 'Main room view' },
      { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=600&fit=crop', caption: 'Bathroom' },
      { url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', caption: 'Common area' },
      { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop', caption: 'Kitchen' }
    ],
    amenities: ['wifi', 'parking', 'mess', 'laundry', 'security'],
    roomType: 'single',
    isAvailable: true,
    features: [
      'Fully furnished room',
      'Attached bathroom',
      'Study table and chair',
      'Wardrobe',
      '24/7 security',
      'Common kitchen access'
    ],
    owner: {
      _id: 'owner1',
      name: 'Rajesh Kumar',
      phone: '+91 9876543210',
      email: 'rajesh@example.com',
      verified: true
    },
    rules: ['No smoking', 'No pets', 'Visitors allowed till 10 PM'],
    preferences: ['Students preferred', 'Working professionals welcome']
  });

  const handleBooking = () => {
    if (!user) {
      toast.error('Please login to book this room');
      navigate('/login');
      return;
    }
    setShowBookingModal(true);
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error('Please login to add favorites');
      navigate('/login');
      return;
    }

    try {
      if (isLiked) {
        await api.delete(`/users/favorites/${id}`);
        toast.success('Removed from favorites');
      } else {
        await api.post(`/users/favorites/${id}`);
        toast.success('Added to favorites');
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  const handleContactOwner = () => {
    if (!user) {
      toast.error('Please login to contact owner');
      navigate('/login');
      return;
    }

    if (room?.owner?.phone) {
      window.open(`tel:${room.owner.phone}`, '_self');
    } else {
      toast.error('Owner contact information not available');
    }
  };

  const amenityIcons = {
    wifi: <FiWifi className="w-5 h-5" />,
    parking: <FiTruck className="w-5 h-5" />,
    mess: <FiUsers className="w-5 h-5" />,
    laundry: <FiUsers className="w-5 h-5" />,
    security: <FiShield className="w-5 h-5" />
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center pt-24">
        <LoadingSpinner size="large" text="Loading room details..." />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center pt-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Room not found</h2>
          <button
            type="button"
            onClick={() => navigate('/rooms')}
            className="btn-primary"
          >
            Back to Rooms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        {/* Back Button */}
        <motion.button 
          type="button"
          onClick={() => navigate('/rooms')}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 mb-8 transition-colors group"
          whileHover={{ x: -5 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FiArrowLeft className="w-5 h-5 mr-2 group-hover:animate-pulse" />
          Back to Rooms
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Enhanced Image Gallery */}
            <motion.div 
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative group">
                <motion.img
                  key={selectedImage}
                  src={room.photos?.[selectedImage]?.url || room.photos?.[selectedImage] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'}
                  alt={room.photos?.[selectedImage]?.caption || room.title}
                  className="w-full h-96 object-cover cursor-pointer"
                  onClick={() => {
                    setLightboxImage(selectedImage);
                    setShowLightbox(true);
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Image Navigation Arrows */}
                {room.photos && room.photos.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : room.photos.length - 1)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    >
                      <FiChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImage(selectedImage < room.photos.length - 1 ? selectedImage + 1 : 0)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                    >
                      <FiChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                
                {/* Expand Button */}
                <button
                  onClick={() => {
                    setLightboxImage(selectedImage);
                    setShowLightbox(true);
                  }}
                  className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                >
                  <FiMaximize2 className="w-4 h-4" />
                </button>
                
                {/* Image Counter */}
                {room.photos && room.photos.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImage + 1} / {room.photos.length}
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {(room.photos || []).map((photo, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden border-3 transition-all duration-300 ${
                        selectedImage === index
                          ? 'border-orange-500 shadow-lg scale-105'
                          : 'border-gray-200 dark:border-gray-600 hover:border-orange-300'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={photo.url || photo || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=150&h=120&fit=crop'}
                        alt={photo.caption || `View ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Room Details */}
            <motion.div 
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl p-8 mb-8 border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <motion.h1 
                    className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    {room.title}
                  </motion.h1>
                  <motion.div 
                    className="flex items-center text-gray-600 dark:text-gray-400 mb-3 text-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <FiMapPin className="w-5 h-5 mr-2 text-orange-500" />
                    <span>{room.address?.area}, {room.address?.city}</span>
                  </motion.div>
                  <motion.div 
                    className="flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
                      <FiStar className="w-4 h-4 text-yellow-500 mr-1 fill-current" />
                      <span className="text-gray-900 dark:text-white font-semibold mr-1">
                        {room.rating || 4.5}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        ({room.reviewCount || 0} reviews)
                      </span>
                    </div>
                  </motion.div>
                </div>
                <motion.div 
                  className="flex space-x-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <motion.button
                    onClick={handleToggleFavorite}
                    className={`p-3 rounded-full transition-all duration-300 ${isLiked
                      ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400 scale-110'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 hover:bg-red-50 hover:text-red-500'
                      }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiHeart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      navigator.share?.({title: room.title, text: `Check out this room: ${room.title}`, url: window.location.href}).catch(() => {navigator.clipboard.writeText(window.location.href); toast.success('Link copied to clipboard!');});
                    }}
                    className="p-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full hover:bg-orange-50 hover:text-orange-500 dark:hover:bg-orange-900/20 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiShare2 className="w-6 h-6" />
                  </motion.button>
                </motion.div>
              </div>

              <motion.div 
                className="border-t border-gray-200 dark:border-gray-700 pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
                  {room.description}
                </p>
              </motion.div>
            </motion.div>

            {/* Enhanced Amenities */}
            <motion.div 
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl p-8 mb-8 border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Amenities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(room.amenities || []).map((amenity, index) => (
                  <motion.div
                    key={amenity}
                    className="flex items-center p-4 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-xl hover:shadow-lg transition-all duration-300 border border-orange-100 dark:border-gray-600"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <div className="text-orange-500 dark:text-orange-400 mr-3">
                      {amenityIcons[amenity] || <FiUsers className="w-5 h-5" />}
                    </div>
                    <span className="text-gray-900 dark:text-white capitalize font-medium">
                      {amenity}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Enhanced Features */}
            {room.features && room.features.length > 0 && (
              <motion.div 
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl p-8 mb-8 border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Room Features
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {room.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-lg border border-green-100 dark:border-gray-600"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mr-4 flex-shrink-0"></div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Rules & Preferences */}
            {(room.rules?.length > 0 || room.preferences?.length > 0) && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
                {room.rules && room.rules.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      House Rules
                    </h3>
                    <ul className="space-y-2">
                      {room.rules.map((rule, index) => (
                        <li
                          key={index}
                          className="flex items-center text-gray-600 dark:text-gray-400"
                        >
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {room.preferences && room.preferences.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Tenant Preferences
                    </h3>
                    <ul className="space-y-2">
                      {room.preferences.map((preference, index) => (
                        <li
                          key={index}
                          className="flex items-center text-gray-600 dark:text-gray-400"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          {preference}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Enhanced Booking Card */}
          <div className="lg:col-span-1">
            <motion.div 
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 sticky top-8 border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-center mb-8">
                <motion.div 
                  className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-2"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  ₹{room.rentPerMonth?.toLocaleString() || '8,500'}
                </motion.div>
                <div className="text-gray-600 dark:text-gray-400 text-lg font-medium">per month</div>
                {room.securityDeposit && (
                  <motion.div 
                    className="text-sm text-gray-500 dark:text-gray-400 mt-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    + ₹{room.securityDeposit.toLocaleString()} security deposit
                  </motion.div>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Room Type
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-md text-gray-900 dark:text-white capitalize">
                    {room.roomType || 'Single'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Availability
                  </label>
                  <div className={`px-3 py-2 rounded-md text-center font-medium ${room.isAvailable
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                    {room.isAvailable ? 'Available Now' : 'Not Available'}
                  </div>
                </div>
              </div>

              <motion.button
                onClick={handleBooking}
                disabled={!room.isAvailable}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-xl hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg mb-4"
                whileHover={{ scale: room.isAvailable ? 1.02 : 1, y: room.isAvailable ? -2 : 0 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                {room.isAvailable ? 'Book Now' : 'Not Available'}
              </motion.button>

              <motion.button
                onClick={handleContactOwner}
                className="w-full border-2 border-orange-500 text-orange-500 dark:text-orange-400 py-4 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300 font-semibold text-lg"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                Contact Owner
              </motion.button>

              {/* Owner Info */}
              {room.owner && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Property Owner
                  </h4>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3">
                      <FiUsers className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {room.owner.name}
                        {room.owner.verified && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {room.owner.phone && (
                          <div className="flex items-center">
                            <FiPhone className="w-3 h-3 mr-1" />
                            {room.owner.phone}
                          </div>
                        )}
                        {room.owner.email && (
                          <div className="flex items-center">
                            <FiMail className="w-3 h-3 mr-1" />
                            {room.owner.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Image Lightbox */}
        <AnimatePresence>
          {showLightbox && (
            <motion.div
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLightbox(false)}
            >
              <div className="relative max-w-4xl max-h-full">
                <motion.img
                  src={room.photos?.[lightboxImage]?.url || room.photos?.[lightboxImage] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop'}
                  alt={room.photos?.[lightboxImage]?.caption || room.title}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8 }}
                  onClick={(e) => e.stopPropagation()}
                />
                
                {/* Close Button */}
                <button
                  onClick={() => setShowLightbox(false)}
                  className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
                
                {/* Navigation */}
                {room.photos && room.photos.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxImage(lightboxImage > 0 ? lightboxImage - 1 : room.photos.length - 1);
                      }}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <FiChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxImage(lightboxImage < room.photos.length - 1 ? lightboxImage + 1 : 0);
                      }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <FiChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
                
                {/* Image Counter */}
                {room.photos && room.photos.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                    {lightboxImage + 1} / {room.photos.length}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Advanced Booking Modal */}
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Gradient */}
              <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 p-6 text-white relative">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
                
                <h3 className="text-xl font-bold mb-2">
                  Book {room?.roomType === 'studio' ? 'Studio Apartment' : 'Room'} in {room?.address?.area || 'Location'}
                </h3>
                
                <div className="flex items-center gap-2 text-white/90">
                  <FiMapPin className="w-4 h-4" />
                  <span className="text-sm">{room?.address?.area}, {room?.address?.city}</span>
                </div>
                
                {/* Progress Steps */}
                <div className="flex items-center justify-center mt-6 space-x-8">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        bookingStep >= step 
                          ? 'bg-white text-orange-500' 
                          : 'bg-white/20 text-white/60'
                      }`}>
                        {step}
                      </div>
                      {step < 3 && (
                        <div className={`w-16 h-0.5 mx-2 ${
                          bookingStep > step ? 'bg-white' : 'bg-white/20'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-96 overflow-y-auto">
                {bookingStep === 1 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Booking Details
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Check-in Date *
                          </label>
                          <input
                            type="date"
                            value={bookingData.checkInDate}
                            onChange={(e) => setBookingData({...bookingData, checkInDate: e.target.value})}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                            placeholder="dd/mm/yyyy"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Duration (months) *
                          </label>
                          <select
                            value={bookingData.duration}
                            onChange={(e) => setBookingData({...bookingData, duration: parseInt(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          >
                            {[1,2,3,4,5,6,7,8,9,10,11,12].map(month => (
                              <option key={month} value={month}>
                                {month} month{month > 1 ? 's' : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      {/* Price Summary */}
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mt-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Rent:</span>
                          <span className="font-medium">₹{room?.rentPerMonth?.toLocaleString() || '8,309'}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Duration:</span>
                          <span className="font-medium">{bookingData.duration} month{bookingData.duration > 1 ? 's' : ''}</span>
                        </div>
                        <hr className="my-2 border-gray-200 dark:border-gray-600" />
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900 dark:text-white">Total Amount:</span>
                          <span className="font-bold text-lg text-orange-600">
                            ₹{((room?.rentPerMonth || 8309) * bookingData.duration).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {bookingStep === 2 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Guest Details
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={bookingData.guestDetails.name}
                          onChange={(e) => setBookingData({
                            ...bookingData, 
                            guestDetails: {...bookingData.guestDetails, name: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={bookingData.guestDetails.email}
                          onChange={(e) => setBookingData({
                            ...bookingData, 
                            guestDetails: {...bookingData.guestDetails, email: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Enter your email"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={bookingData.guestDetails.phone}
                          onChange={(e) => setBookingData({
                            ...bookingData, 
                            guestDetails: {...bookingData.guestDetails, phone: e.target.value}
                          })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Special Requests (Optional)
                        </label>
                        <textarea
                          value={bookingData.specialRequests}
                          onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Any special requirements or requests..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {bookingStep === 3 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Booking Summary
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <h5 className="font-medium mb-3">Booking Details</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Check-in Date:</span>
                            <span>{new Date(bookingData.checkInDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Duration:</span>
                            <span>{bookingData.duration} month{bookingData.duration > 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Monthly Rent:</span>
                            <span>₹{room?.rentPerMonth?.toLocaleString() || '8,309'}</span>
                          </div>
                          <hr className="my-2" />
                          <div className="flex justify-between font-bold">
                            <span>Total Amount:</span>
                            <span className="text-orange-600">₹{((room?.rentPerMonth || 8309) * bookingData.duration).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                        <h5 className="font-medium mb-3">Guest Information</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Name:</span>
                            <span>{bookingData.guestDetails.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Email:</span>
                            <span>{bookingData.guestDetails.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Phone:</span>
                            <span>{bookingData.guestDetails.phone}</span>
                          </div>
                        </div>
                      </div>
                      
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
              </div>

              {/* Footer Buttons */}
              <div className="border-t border-gray-200 dark:border-gray-600 p-6">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      if (bookingStep > 1) {
                        setBookingStep(bookingStep - 1);
                      } else {
                        setShowBookingModal(false);
                      }
                    }}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    {bookingStep === 1 ? 'Cancel' : 'Back'}
                  </button>
                  
                  <button
                    onClick={() => {
                      if (bookingStep < 3) {
                        // Validation for each step
                        if (bookingStep === 1 && !bookingData.checkInDate) {
                          toast.error('Please select a check-in date');
                          return;
                        }
                        if (bookingStep === 2) {
                          if (!bookingData.guestDetails.name || !bookingData.guestDetails.email || !bookingData.guestDetails.phone) {
                            toast.error('Please fill in all required fields');
                            return;
                          }
                        }
                        setBookingStep(bookingStep + 1);
                      } else {
                        // Final booking submission
                        toast.success('Booking request submitted! Owner will contact you soon.');
                        setShowBookingModal(false);
                        setBookingStep(1);
                      }
                    }}
                    className="flex-1 px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {bookingStep === 3 ? 'Confirm Booking' : 'Next'}
                    {bookingStep < 3 && <FiChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RoomDetails;
