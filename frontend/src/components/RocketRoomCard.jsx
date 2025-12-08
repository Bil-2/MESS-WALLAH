// MESS WALLAH - Rocket-Fast Room Card Component
import React, { memo, useMemo, useCallback } from 'react';
import { FiMapPin, FiStar, FiWifi, FiCoffee, FiShield, FiHeart } from 'react-icons/fi';
import OptimizedImage from './OptimizedImage';
import { useIntersectionObserver } from '../hooks/usePerformance';

const RocketRoomCard = memo(({
  room,
  onBookNow,
  onViewDetails,
  onToggleFavorite,
  isFavorite = false,
  priority = false
}) => {
  const { elementRef, hasBeenVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });

  // Memoize expensive calculations
  const roomData = useMemo(() => {
    if (!room) return null;

    return {
      id: room.id || room._id,
      title: room.title || 'Untitled Room',
      location: room.location || `${room.address?.area || ''}, ${room.address?.city || ''}`,
      rent: room.rent || room.rentPerMonth || 0,
      rating: room.rating || 4.5,
      image: room.image || room.photos?.[0]?.url || room.photos?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=75',
      amenities: room.amenities?.slice(0, 3) || ['WiFi', 'AC', 'Food'],
      roomType: room.roomType || 'PG',
      isVerified: room.isVerified || true
    };
  }, [room]);

  // Memoize amenity icons
  const amenityIcons = useMemo(() => ({
    'WiFi': FiWifi,
    'AC': FiCoffee,
    'Food': FiCoffee,
    'Parking': FiMapPin,
    'Security': FiShield
  }), []);

  // Optimized event handlers
  const handleBookNow = useCallback((e) => {
    e.stopPropagation();
    onBookNow?.(roomData.id);
  }, [onBookNow, roomData?.id]);

  const handleViewDetails = useCallback(() => {
    onViewDetails?.(roomData.id);
  }, [onViewDetails, roomData?.id]);

  const handleToggleFavorite = useCallback((e) => {
    e.stopPropagation();
    onToggleFavorite?.(roomData.id);
  }, [onToggleFavorite, roomData?.id]);

  // Don't render if no room data
  if (!roomData) {
    return null;
  }

  // Render skeleton while not in viewport
  if (!hasBeenVisible && !priority) {
    return (
      <div
        ref={elementRef}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden animate-pulse"
      >
        <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={elementRef}
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-out overflow-hidden cursor-pointer transform hover:scale-[1.02] will-change-transform"
      onClick={handleViewDetails}
      style={{ contentVisibility: 'auto' }}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <OptimizedImage
          src={roomData.image}
          alt={roomData.title}
          className="w-full h-full"
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={80}
        />

        {/* Overlay Elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Room Type Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-full backdrop-blur-sm">
            {roomData.roomType}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:scale-110 transition-all duration-200 backdrop-blur-sm"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <FiHeart
            className={`w-4 h-4 transition-colors duration-200 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600 dark:text-gray-400'
              }`}
          />
        </button>

        {/* Verified Badge */}
        {roomData.isVerified && (
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center space-x-1 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full backdrop-blur-sm">
              <FiShield className="w-3 h-3" />
              <span>Verified</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title and Rating */}
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg leading-tight line-clamp-2 flex-1 mr-2">
            {roomData.title}
          </h3>
          <div className="flex items-center space-x-1 flex-shrink-0">
            <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {roomData.rating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
          <FiMapPin className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm line-clamp-1">{roomData.location}</span>
        </div>

        {/* Amenities */}
        <div className="flex items-center space-x-3">
          {roomData.amenities.map((amenity, index) => {
            const IconComponent = amenityIcons[amenity] || FiCoffee;
            return (
              <div key={index} className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                <IconComponent className="w-3 h-3" />
                <span className="text-xs">{amenity}</span>
              </div>
            );
          })}
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ₹{roomData.rent.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">/month</span>
          </div>

          <button
            onClick={handleBookNow}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-lg"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
});

RocketRoomCard.displayName = 'RocketRoomCard';

export default RocketRoomCard;
