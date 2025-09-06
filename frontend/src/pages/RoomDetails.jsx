import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { roomAPI, bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  FiMapPin,
  FiUsers,
  FiWifi,
  FiStar,
  FiPhone,
  FiMail,
  FiChevronLeft,
  FiChevronRight
} from 'react-icons/fi';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    message: ''
  });

  const { data: roomData, isLoading, error } = useQuery(
    ['room', id],
    () => roomAPI.getRoomById(id),
    {
      enabled: !!id,
    }
  );

  const room = roomData?.data?.room;

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to book a room');
      navigate('/login');
      return;
    }

    if (user?.role !== 'student') {
      toast.error('Only students can book rooms');
      return;
    }

    try {
      const response = await bookingAPI.createBooking({
        room: id,
        ...bookingData
      });

      if (response.data.success) {
        toast.success('Booking request sent successfully!');
        setShowBookingModal(false);
        navigate('/bookings');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === room.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? room.images.length - 1 : prev - 1
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded-lg mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
              <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <p className="text-red-600 dark:text-red-400 mb-4 transition-colors duration-200">
              {error?.response?.data?.message || 'Room not found'}
            </p>
            <button
              onClick={() => navigate('/rooms')}
              className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Back to Rooms
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Image Gallery */}
        <div className="relative mb-6">
          <div className="h-64 md:h-96 rounded-lg overflow-hidden">
            <img
              src={room.images?.[currentImageIndex] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDE1MFYxNzVIMTc1VjEyNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+dGggZD0iTTIyNSAxMjVIMjAwVjE3NUgyMjVWMTI1WiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMjAwIDEwMEgxNzVWMTUwSDIwMFYxMDBaIiBmaWxsPSIjOUNBM0FGIi8+CjwvZz4KPC9zdmc+'}
              alt={room.title}
              className="w-full h-full object-cover"
            />

            {room.images?.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 hover:bg-opacity-100 dark:hover:bg-opacity-100 rounded-full p-2 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                >
                  <FiChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 hover:bg-opacity-100 dark:hover:bg-opacity-100 rounded-full p-2 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                >
                  <FiChevronRight className="h-6 w-6" />
                </button>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {room.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors duration-200 ${index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                        }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Room Details */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-200">
                    {room.title}
                  </h1>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2 transition-colors duration-200">
                    <FiMapPin className="h-5 w-5 mr-2" />
                    <span>{room.address.street}, {room.address.area}, {room.address.city}</span>
                  </div>
                  <div className="flex items-center">
                    <FiStar className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-1 transition-colors duration-200" />
                    <span className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">{room.averageRating?.toFixed(1) || 'New'}</span>
                    <span className="text-gray-600 dark:text-gray-400 ml-2 transition-colors duration-200">({room.totalReviews || 0} reviews)</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 transition-colors duration-200">
                    ₹{room.rent}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 transition-colors duration-200">per month</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <FiUsers className="h-6 w-6 mx-auto mb-2 text-gray-600 dark:text-gray-400 transition-colors duration-200" />
                  <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Capacity</div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">{room.capacity} people</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Type</div>
                  <div className="font-semibold capitalize text-gray-900 dark:text-gray-100 transition-colors duration-200">{room.type}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Deposit</div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">₹{room.securityDeposit}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">Available</div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">
                    {room.isAvailable ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100 transition-colors duration-200">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 transition-colors duration-200">{room.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100 transition-colors duration-200">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {room.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <FiWifi className="h-4 w-4 mr-2 text-green-600 dark:text-green-400 transition-colors duration-200" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-200">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {room.rules?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100 transition-colors duration-200">House Rules</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {room.rules.map((rule, index) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300 text-sm transition-colors duration-200">{rule}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 sticky top-8 transition-colors duration-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 transition-colors duration-200">Book This Room</h3>

              {room.isAvailable ? (
                <>
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1 transition-colors duration-200">
                      ₹{room.rent}/month
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-200">
                      + ₹{room.securityDeposit} security deposit
                    </div>
                  </div>

                  {isAuthenticated && user?.role === 'student' ? (
                    <button
                      onClick={() => setShowBookingModal(true)}
                      className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium mb-4 transition-colors duration-200"
                    >
                      Request Booking
                    </button>
                  ) : (
                    <div className="mb-4">
                      {!isAuthenticated ? (
                        <button
                          onClick={() => navigate('/login')}
                          className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium mb-2 transition-colors duration-200"
                        >
                          Login to Book
                        </button>
                      ) : (
                        <div className="text-center text-gray-600 dark:text-gray-400 text-sm transition-colors duration-200">
                          Only students can book rooms
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-red-600 dark:text-red-400 font-semibold mb-4 transition-colors duration-200">
                  Currently Unavailable
                </div>
              )}

              {/* Owner Contact */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 transition-colors duration-200">
                <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100 transition-colors duration-200">Contact Owner</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <FiPhone className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400 transition-colors duration-200" />
                    <span className="text-gray-700 dark:text-gray-300 transition-colors duration-200">{room.owner?.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FiMail className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400 transition-colors duration-200" />
                    <span className="text-gray-700 dark:text-gray-300 transition-colors duration-200">{room.owner?.email || 'Not provided'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center p-4 z-50 transition-colors duration-200">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 transition-colors duration-200">Request Booking</h3>

              <form onSubmit={handleBooking}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                    Preferred Check-in Date
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                    value={bookingData.checkIn}
                    onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                    Preferred Check-out Date (Optional)
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-200"
                    value={bookingData.checkOut}
                    onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                    Message to Owner
                  </label>
                  <textarea
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                    placeholder="Tell the owner about yourself..."
                    value={bookingData.message}
                    onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })}
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                  >
                    Send Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomDetails;
