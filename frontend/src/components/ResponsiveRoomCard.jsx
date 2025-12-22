import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  MapPin,
  Star,
  Phone,
  Eye,
  Wifi,
  Shield,
  Users,
  Home as HomeIcon,
  Share2,
  Camera,
  Award,
  Zap
} from '../utils/iconMappings';

/**
 * Modern Room Card Component
 * Inspired by: Airbnb, OYO, Booking.com
 * Features: Image carousel, hover effects, urgency indicators, trust badges
 */
const ResponsiveRoomCard = ({
  room,
  onBookNow,
  onViewDetails,
  onToggleFavorite,
  isFavorite = false
}) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get all images
  const images = room.photos?.length > 0 
    ? room.photos.map(p => p.url || p) 
    : [room.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600'];

  // Auto-rotate images on hover (Airbnb style)
  useEffect(() => {
    if (isHovered && images.length > 1) {
      const interval = setInterval(() => {
        setImageIndex(prev => (prev + 1) % images.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isHovered, images.length]);

  const amenityIcons = {
    wifi: Wifi,
    security: Shield,
    mess: Users,
    laundry: HomeIcon,
    parking: HomeIcon,
    gym: Users,
    ac: HomeIcon,
    balcony: HomeIcon
  };

  // Random viewers count for urgency (Booking.com style)
  const viewersCount = Math.floor(Math.random() * 8) + 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setImageIndex(0); }}
      className="group bg-white dark:bg-gray-800/90 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700/50 backdrop-blur-sm w-full"
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {/* Loading Skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        )}

        {/* Image with Animation */}
        <AnimatePresence mode="wait">
          <motion.img
            key={imageIndex}
            src={images[imageIndex]}
            alt={room.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </AnimatePresence>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Image Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {images.slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setImageIndex(idx); }}
                className={`h-1.5 rounded-full transition-all ${
                  idx === imageIndex ? 'bg-white w-4' : 'bg-white/50 w-1.5 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <div className="flex flex-col gap-2">
            {/* Superhost Badge */}
            {(room.verified || room.isVerified) && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-full shadow-lg"
              >
                <Award className="w-3.5 h-3.5 text-rose-500" />
                <span className="text-xs font-semibold text-gray-800">Verified</span>
              </motion.div>
            )}
            
            {/* Room Type Badge */}
            <div className="px-2.5 py-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg uppercase tracking-wide">
              {room.roomType || room.type || 'Room'}
            </div>
          </div>

          {/* Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(room._id || room.id);
            }}
            className={`p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all ${
              isFavorite 
                ? 'bg-rose-500 text-white' 
                : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </motion.button>
        </div>

        {/* Price Tag - Bottom Left */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-gray-900">
                ₹{(room.rent || room.rentPerMonth || 0).toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 font-medium">/mo</span>
            </div>
          </div>
        </div>

        {/* Photo Count */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-xs">
            <Camera className="w-3 h-3" />
            <span>{images.length}</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Location */}
        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm mb-1">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{room.location || `${room.address?.area}, ${room.address?.city}`}</span>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onViewDetails(room._id || room.id)}
          className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 cursor-pointer hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
        >
          {room.title}
        </h3>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500 rounded-lg">
            <Star className="w-3.5 h-3.5 text-white fill-current" />
            <span className="text-sm font-bold text-white">{room.rating || 4.5}</span>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            ({room.reviews || room.totalReviews || 0} reviews)
          </span>
          {(room.rating || 4.5) >= 4.5 && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Excellent</span>
          )}
        </div>

        {/* Amenities */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {room.amenities.slice(0, 4).map((amenity, index) => (
              <span 
                key={index}
                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 text-xs rounded-full capitalize"
              >
                {amenity}
              </span>
            ))}
            {room.amenities.length > 4 && (
              <span className="px-2 py-0.5 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-xs rounded-full font-medium">
                +{room.amenities.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Urgency Indicator */}
        <div className="flex items-center gap-2 mb-4 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200/50 dark:border-amber-800/30">
          <Zap className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
            🔥 {viewersCount} people viewing now
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              onBookNow(room._id || room.id);
            }}
            className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg shadow-violet-500/25 transition-all"
          >
            Book Now
          </motion.button>
          
          {room.ownerPhone && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                window.open(`tel:${room.ownerPhone}`, '_self');
              }}
              className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
              title="Call Owner"
            >
              <Phone className="w-5 h-5" />
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(room._id || room.id);
            }}
            className="p-3 bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            title="View Details"
          >
            <Eye className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ResponsiveRoomCard;
