import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, Users, Wifi, Car, Utensils, Star, Heart, Phone,
  Mail, Calendar, ArrowLeft, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import api, { roomsAPI, bookingsAPI } from '../utils/api';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    fetchRoomDetails();
  }, [id]);

  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/rooms/${id}`);
      setRoom(response.data);

      // Check if room is favorited (if user is authenticated)
      if (isAuthenticated) {
        // This would typically come from a favorites API
        // For now, we'll use localStorage as a simple solution
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorited(favorites.includes(id));
      }
    } catch (error) {
      console.error('Error fetching room details:', error);
      setError('Room not found');
    } finally {
      setLoading(false);
    }
  };

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
      return <Wifi className="w-5 h-5" />;
    }
    if (amenityLower.includes('parking') || amenityLower.includes('car')) {
      return <Car className="w-5 h-5" />;
    }
    if (amenityLower.includes('food') || amenityLower.includes('meal') || amenityLower.includes('kitchen')) {
      return <Utensils className="w-5 h-5" />;
    }
    return <Users className="w-5 h-5" />;
  };

  const handleImageNavigation = (direction) => {
    if (!room?.photos || room.photos.length <= 1) return;

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

  const handleFavorite = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let updatedFavorites;

    if (isFavorited) {
      updatedFavorites = favorites.filter(fav => fav !== id);
    } else {
      updatedFavorites = [...favorites, id];
    }

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setIsFavorited(!isFavorited);
  };

  const handleBooking = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setShowBookingModal(true);
  };

  const handleContactOwner = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // In a real app, this would open a chat or contact modal
    alert(`Contact ${room.owner?.name || 'Owner'} at ${room.owner?.phone || 'phone not available'}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Room Not Found</h1>
          <p className="text-gray-600 mb-8">The room you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/search')}
            className="btn-primary"
          >
            Browse Other Rooms
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Results</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
              <div className="relative h-96">
                {room.photos && room.photos.length > 0 ? (
                  <>
                    <img
                      src={room.photos[currentImageIndex]}
                      alt={room.title}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setShowImageModal(true)}
                    />

                    {room.photos.length > 1 && (
                      <>
                        <button
                          onClick={() => handleImageNavigation('prev')}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-sm transition-all"
                        >
                          <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleImageNavigation('next')}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-sm transition-all"
                        >
                          <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {room.photos.length}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500">No images available</p>
                    </div>
                  </div>
                )}

                {/* Favorite Button */}
                <button
                  onClick={handleFavorite}
                  className="absolute top-4 right-4 p-3 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full shadow-sm transition-all"
                >
                  <Heart
                    className={`w-5 h-5 ${isFavorited ? 'text-red-500 fill-current' : 'text-gray-600'
                      }`}
                  />
                </button>

                {/* Availability Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${room.isAvailable
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {room.isAvailable ? 'Available' : 'Not Available'}
                  </span>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {room.photos && room.photos.length > 1 && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2 overflow-x-auto">
                    {room.photos.map((photo, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${index === currentImageIndex
                          ? 'border-primary-500'
                          : 'border-gray-200'
                          }`}
                      >
                        <img
                          src={photo}
                          alt={`${room.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Room Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{room.title}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{room.address?.street}, {room.address?.area}, {room.address?.city}</span>
                </div>

                {room.rating && (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-medium text-gray-900">{room.rating.toFixed(1)}</span>
                    </div>
                    {room.reviewCount && (
                      <span className="text-gray-600">({room.reviewCount} reviews)</span>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              {room.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{room.description}</p>
                </div>
              )}

              {/* Amenities */}
              {room.amenities && room.amenities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {room.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg"
                      >
                        {getAmenityIcon(amenity)}
                        <span className="text-gray-700 capitalize">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Location</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Area:</span>
                      <span className="font-medium">{room.address?.area}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">City:</span>
                      <span className="font-medium">{room.address?.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">State:</span>
                      <span className="font-medium">{room.address?.state}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pincode:</span>
                      <span className="font-medium">{room.address?.pincode}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {formatPrice(room.rent)}
                </div>
                <div className="text-gray-600">per month</div>
              </div>

              {/* Owner Info */}
              {room.owner && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Property Owner</h4>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="font-medium text-primary-600">
                        {room.owner.name ? room.owner.name.charAt(0).toUpperCase() : 'O'}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {room.owner.name || 'Owner'}
                      </div>
                      {room.owner.phone && (
                        <div className="text-sm text-gray-600">{room.owner.phone}</div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleContactOwner}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Contact Owner</span>
                  </button>
                </div>
              )}

              {/* Booking Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleBooking}
                  disabled={!room.isAvailable}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {room.isAvailable ? 'Book Now' : 'Not Available'}
                </button>

                <button
                  onClick={handleFavorite}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'text-red-500 fill-current' : ''}`} />
                  <span>{isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                </button>
              </div>

              {/* Quick Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Available from today</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>Suitable for students & professionals</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && room.photos && room.photos.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-8 h-8" />
            </button>

            <img
              src={room.photos[currentImageIndex]}
              alt={room.title}
              className="max-w-full max-h-full object-contain"
            />

            {room.photos.length > 1 && (
              <>
                <button
                  onClick={() => handleImageNavigation('prev')}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={() => handleImageNavigation('next')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {currentImageIndex + 1} / {room.photos.length}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal Placeholder */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Book Room</h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Booking functionality will be implemented in the next phase.
            </p>
            <button
              onClick={() => setShowBookingModal(false)}
              className="w-full btn-primary"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetail;
