import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Wifi, Car, Utensils, Calendar, Users, Heart, Share2, ArrowLeft, Phone, Mail } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext.jsx';
import { apiHelpers } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import SubscriptionBooking from '../components/SubscriptionBooking';
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

  useEffect(() => {
    fetchRoomDetails();
  }, [id]);

  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      const response = await apiHelpers.rooms.getById(id);
      setRoom(response.data.data);

      // Check if room is in user's favorites
      if (user && user.favourites && user.favourites.includes(id)) {
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error fetching room details:', error);
      // Fallback to mock data for demo
      setRoom(getMockRoomData());
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
      { url: 'https://via.placeholder.com/800x600', caption: 'Main room view' },
      { url: 'https://via.placeholder.com/800x600', caption: 'Bathroom' },
      { url: 'https://via.placeholder.com/800x600', caption: 'Common area' },
      { url: 'https://via.placeholder.com/800x600', caption: 'Kitchen' }
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
        await apiHelpers.users.removeFavorite(id);
        toast.success('Removed from favorites');
      } else {
        await apiHelpers.users.addFavorite(id);
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
    wifi: <Wifi className="w-5 h-5" />,
    parking: <Car className="w-5 h-5" />,
    mess: <Utensils className="w-5 h-5" />,
    laundry: <Users className="w-5 h-5" />,
    security: <Users className="w-5 h-5" />
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading room details..." />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Room not found</h2>
          <button
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Rooms
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8 transition-colors duration-200">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={room.photos?.[selectedImage]?.url || room.photos?.[selectedImage] || 'https://via.placeholder.com/800x600'}
                  alt={room.photos?.[selectedImage]?.caption || room.title}
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex space-x-2 overflow-x-auto">
                  {(room.photos || []).map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-colors ${selectedImage === index
                        ? 'border-purple-500'
                        : 'border-gray-200 dark:border-gray-700'
                        }`}
                    >
                      <img
                        src={photo.url || photo || 'https://via.placeholder.com/150x120'}
                        alt={photo.caption || `View ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Room Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {room.title}
                  </h1>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{room.address?.area}, {room.address?.city}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-gray-900 dark:text-white font-medium mr-1">
                      {room.rating || 4.5}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      ({room.reviewCount || 0} reviews)
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleToggleFavorite}
                    className={`p-2 rounded-full transition-colors ${isLiked
                      ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                      }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => {
                      navigator.share?.({
                        title: room.title,
                        text: `Check out this room: ${room.title}`,
                        url: window.location.href
                      }).catch(() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success('Link copied to clipboard!');
                      });
                    }}
                    className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {room.description}
                </p>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Amenities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {(room.amenities || []).map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    <div className="text-purple-600 dark:text-purple-400 mr-3">
                      {amenityIcons[amenity] || <Users className="w-5 h-5" />}
                    </div>
                    <span className="text-gray-900 dark:text-white capitalize">
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            {room.features && room.features.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Room Features
                </h3>
                <ul className="space-y-2">
                  {room.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-gray-600 dark:text-gray-400"
                    >
                      <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
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

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-8 transition-colors duration-200">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  ₹{room.rentPerMonth?.toLocaleString() || '8,500'}
                </div>
                <div className="text-gray-600 dark:text-gray-400">per month</div>
                {room.securityDeposit && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    + ₹{room.securityDeposit.toLocaleString()} security deposit
                  </div>
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

              <button
                onClick={handleBooking}
                disabled={!room.isAvailable}
                className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium mb-4"
              >
                {room.isAvailable ? 'Book Now' : 'Not Available'}
              </button>

              <button
                onClick={handleContactOwner}
                className="w-full border border-purple-600 text-purple-600 dark:text-purple-400 py-3 rounded-md hover:bg-purple-50 dark:hover:bg-purple-900 transition-colors font-medium"
              >
                Contact Owner
              </button>

              {/* Owner Info */}
              {room.owner && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Property Owner
                  </h4>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3">
                      <Users className="w-6 h-6 text-gray-500 dark:text-gray-400" />
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
                            <Phone className="w-3 h-3 mr-1" />
                            {room.owner.phone}
                          </div>
                        )}
                        {room.owner.email && (
                          <div className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {room.owner.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subscription Booking Modal */}
        {showBookingModal && (
          <SubscriptionBooking
            room={room}
            onClose={() => setShowBookingModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default RoomDetails;
