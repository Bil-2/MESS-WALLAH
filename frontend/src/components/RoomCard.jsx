import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Wifi, Car, Utensils, Heart, Star } from 'lucide-react';

const RoomCard = ({ room, onFavorite, isFavorited = false }) => {
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
      return <Wifi className="w-4 h-4" />;
    }
    if (amenityLower.includes('parking') || amenityLower.includes('car')) {
      return <Car className="w-4 h-4" />;
    }
    if (amenityLower.includes('food') || amenityLower.includes('meal') || amenityLower.includes('kitchen')) {
      return <Utensils className="w-4 h-4" />;
    }
    return <Users className="w-4 h-4" />;
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 card-hover fade-in">
      <Link to={`/room/${room._id}`} className="block">
        {/* Image Section */}
        <div className="relative h-48 bg-gray-200">
          {room.photos && room.photos.length > 0 && !imageError ? (
            <>
              <img
                src={room.photos[currentImageIndex]}
                alt={room.title}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />

              {/* Image Navigation */}
              {room.photos.length > 1 && (
                <>
                  <button
                    onClick={(e) => handleImageNavigation('prev', e)}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1 shadow-sm transition-all scale-hover"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => handleImageNavigation('next', e)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1 shadow-sm transition-all scale-hover"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Image Indicators */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    {room.photos.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                          }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">No image available</p>
              </div>
            </div>
          )}

          {/* Favorite Button */}
          {onFavorite && (
            <button
              onClick={handleFavorite}
              className="absolute top-3 right-3 p-2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-sm transition-all"
            >
              <Heart
                className={`w-4 h-4 ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-600'
                  }`}
              />
            </button>
          )}

          {/* Availability Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${room.isAvailable
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
              }`}>
              {room.isAvailable ? 'Available' : 'Not Available'}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Title and Location */}
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
              {room.title}
            </h3>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="line-clamp-1">
                {room.address?.area || room.address?.city || 'Location not specified'}
              </span>
            </div>
          </div>

          {/* Description */}
          {room.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {room.description}
            </p>
          )}

          {/* Amenities */}
          {room.amenities && room.amenities.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                {room.amenities.slice(0, 3).map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700"
                  >
                    {getAmenityIcon(amenity)}
                    <span className="capitalize">{amenity}</span>
                  </div>
                ))}
                {room.amenities.length > 3 && (
                  <div className="px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700">
                    +{room.amenities.length - 3} more
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Price and Rating */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(room.rent)}
              </span>
              <span className="text-sm text-gray-600">/month</span>
            </div>

            {room.rating && (
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-700">
                  {room.rating.toFixed(1)}
                </span>
                {room.reviewCount && (
                  <span className="text-sm text-gray-500">
                    ({room.reviewCount})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Owner Info */}
          {room.owner && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-primary-600">
                    {room.owner.name ? room.owner.name.charAt(0).toUpperCase() : 'O'}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  {room.owner.name || 'Owner'}
                </span>
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default RoomCard;
