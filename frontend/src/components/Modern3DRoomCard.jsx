import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Wifi, Car, Utensils, Heart, Star, Eye, Share2 } from 'lucide-react';

const Modern3DRoomCard = ({ room, onFavorite, isFavorited = false }) => {
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) {
      return <Wifi className="w-3 h-3" />;
    }
    if (amenityLower.includes('parking') || amenityLower.includes('car')) {
      return <Car className="w-3 h-3" />;
    }
    if (amenityLower.includes('food') || amenityLower.includes('meal') || amenityLower.includes('kitchen')) {
      return <Utensils className="w-3 h-3" />;
    }
    return <Users className="w-3 h-3" />;
  };

  const handleMouseMove = (e) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageNavigation = (direction, e) => {
    e.preventDefault();
    e.stopPropagation();

    if (direction === 'next') {
      setCurrentImageIndex((prev) =>
        prev === room.photos.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) =>
        prev === 0 ? room.photos.length - 1 : prev - 1
      );
    }
  };

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavorite) {
      onFavorite(room._id);
    }
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: room.title,
        text: `Check out this amazing room: ${room.title}`,
        url: window.location.origin + `/room/${room._id}`
      });
    }
  };

  return (
    <div
      ref={cardRef}
      className="group relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${(mousePosition.y - 0.5) * 10}deg) rotateY(${(mousePosition.x - 0.5) * 10}deg) translateZ(20px)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
        transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out'
      }}
    >
      {/* Animated Background Gradient */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
            rgba(139, 92, 246, 0.1) 0%, 
            rgba(219, 39, 119, 0.1) 50%, 
            transparent 100%)`
        }}
      />

      <Link to={`/room/${room._id}`} className="block">
        {/* Image Section with 3D Effects */}
        <div className="relative h-56 overflow-hidden">
          {room.photos && room.photos.length > 0 && !imageError ? (
            <>
              <div className="relative w-full h-full">
                <img
                  src={room.photos[currentImageIndex]}
                  alt={room.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={handleImageError}
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Floating Action Buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                <button
                  onClick={handleFavorite}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 transform hover:scale-110"
                >
                  <Heart
                    className={`w-4 h-4 ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-600'}`}
                  />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 transform hover:scale-110"
                >
                  <Share2 className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Image Navigation */}
              {room.photos.length > 1 && (
                <>
                  <button
                    onClick={(e) => handleImageNavigation('prev', e)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
                  >
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => handleImageNavigation('next', e)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
                  >
                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Modern Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {room.photos.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex
                            ? 'bg-white scale-125'
                            : 'bg-white/50 hover:bg-white/80'
                          }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Eye className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-sm text-gray-600 font-medium">No image available</p>
              </div>
            </div>
          )}

          {/* Floating Availability Badge */}
          <div className="absolute top-4 left-4">
            <div className={`px-3 py-1.5 text-xs font-semibold rounded-full backdrop-blur-sm border ${room.isAvailable
                ? 'bg-green-100/90 text-green-800 border-green-200'
                : 'bg-red-100/90 text-red-800 border-red-200'
              }`}>
              {room.isAvailable ? '✨ Available' : '❌ Occupied'}
            </div>
          </div>

          {/* Trending Badge */}
          {room.rating && room.rating > 4.5 && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <div className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                🔥 TRENDING
              </div>
            </div>
          )}
        </div>

        {/* Content Section with Enhanced Design */}
        <div className="p-6 relative">
          {/* Floating Particles Effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-1000"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${20 + i * 20}%`,
                  animationDelay: `${i * 0.5}s`,
                  animation: isHovered ? 'float 3s ease-in-out infinite' : 'none'
                }}
              />
            ))}
          </div>

          {/* Title and Location */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-purple-700 transition-colors duration-300">
              {room.title}
            </h3>
            <div className="flex items-center text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
              <MapPin className="w-4 h-4 mr-2 text-purple-500" />
              <span className="line-clamp-1">
                {room.address?.area || room.address?.city || 'Location not specified'}
              </span>
            </div>
          </div>

          {/* Description with Fade Effect */}
          {room.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
              {room.description}
            </p>
          )}

          {/* Enhanced Amenities */}
          {room.amenities && room.amenities.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {room.amenities.slice(0, 3).map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-full text-xs text-purple-700 font-medium hover:from-purple-100 hover:to-pink-100 transition-all duration-300 transform hover:scale-105"
                  >
                    {getAmenityIcon(amenity)}
                    <span className="capitalize">{amenity}</span>
                  </div>
                ))}
                {room.amenities.length > 3 && (
                  <div className="px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-full text-xs text-gray-600 font-medium hover:bg-gray-200 transition-all duration-300">
                    +{room.amenities.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Price and Rating Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {formatPrice(room.rent)}
              </span>
              <span className="text-sm text-gray-500 font-medium">/month</span>
            </div>

            {room.rating && (
              <div className="flex items-center space-x-1 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-200">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-bold text-yellow-700">
                  {room.rating.toFixed(1)}
                </span>
                {room.reviewCount && (
                  <span className="text-xs text-yellow-600">
                    ({room.reviewCount})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Enhanced Owner Info */}
          {room.owner && (
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-white">
                      {room.owner.name ? room.owner.name.charAt(0).toUpperCase() : 'O'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {room.owner.name || 'Property Owner'}
                    </p>
                    <p className="text-xs text-gray-500">Verified Owner</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Online</span>
                </div>
              </div>
            </div>
          )}

          {/* Call-to-Action Button */}
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              View Details
            </button>
          </div>
        </div>
      </Link>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default Modern3DRoomCard;
