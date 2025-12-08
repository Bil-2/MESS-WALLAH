import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  MapPin,
  Star,
  Phone,
  Eye,
  Wifi,
  Shield,
  Users,
  Home as HomeIcon
} from '../utils/iconMappings';
import { getAnimationVariants, getOptimizedProps } from '../utils/animations';

const ResponsiveRoomCard = ({
  room,
  onBookNow,
  onViewDetails,
  onToggleFavorite,
  isFavorite = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setImageError(true);

  const cardVariants = getAnimationVariants('card');
  const optimizedProps = getOptimizedProps();

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

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      {...optimizedProps}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 gpu-accelerated w-full max-w-sm mx-auto sm:max-w-none"
    >
      {/* Image Section */}
      <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden">
        {!imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
                <HomeIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <img
              src={room.image || room.photos?.[0]?.url || room.photos?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop'}
              alt={room.title}
              className={`w-full h-full object-cover transition-all duration-300 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                } hover:scale-105`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/20 dark:to-orange-800/20 flex items-center justify-center">
            <HomeIcon className="w-12 h-12 text-orange-500" />
          </div>
        )}

        {/* Overlay Elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(room._id || room.id);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 touch-target"
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-200 ${isFavorite
              ? 'text-red-500 fill-current'
              : 'text-gray-600 dark:text-gray-300'
              }`}
          />
        </button>

        {/* Room Type Badge */}
        <div className="absolute top-3 left-3 px-2 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
          {room.roomType || room.type || 'Room'}
        </div>

        {/* Verified Badge */}
        {room.verified && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
            <Shield className="w-3 h-3" />
            Verified
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5">
        {/* Title and Location */}
        <div className="mb-3">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 hover:text-orange-600 dark:hover:text-orange-400 transition-colors duration-200">
            {room.title}
          </h3>
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{room.location}</span>
          </div>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {room.rating || 4.5}
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({room.reviews || 0} reviews)
            </span>
          </div>

          {/* Owner Info */}
          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Users className="w-3 h-3" />
            <span className="truncate max-w-20">{room.ownerName || 'Owner'}</span>
          </div>
        </div>

        {/* Amenities */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {room.amenities.slice(0, 4).map((amenity, index) => {
                const IconComponent = amenityIcons[amenity] || HomeIcon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                  >
                    <IconComponent className="w-3 h-3" />
                    <span className="capitalize">{amenity}</span>
                  </div>
                );
              })}
              {room.amenities.length > 4 && (
                <div className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full">
                  +{room.amenities.length - 4} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-bold text-orange-600 dark:text-orange-400">
                ₹{(room.rent || room.rentPerMonth || 0).toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">/month</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Call Button */}
            {room.ownerPhone && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`tel:${room.ownerPhone}`, '_self');
                }}
                className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors duration-200 touch-target"
                title="Call Owner"
              >
                <Phone className="w-4 h-4" />
              </button>
            )}

            {/* View Details Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails(room._id || room.id);
              }}
              className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200 touch-target"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Book Now Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onBookNow(room._id || room.id);
          }}
          className="w-full mt-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] touch-target"
        >
          Book Now
        </button>
      </div>
    </motion.div>
  );
};

export default ResponsiveRoomCard;
