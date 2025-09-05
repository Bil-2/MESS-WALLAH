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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-300 rounded-lg mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="h-8 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
              <div className="h-64 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card text-center">
            <p className="text-red-600 mb-4">
              {error?.response?.data?.message || 'Room not found'}
            </p>
            <button onClick={() => navigate('/rooms')} className="btn-primary">
              Back to Rooms
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
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
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2"
                >
                  <FiChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2"
                >
                  <FiChevronRight className="h-6 w-6" />
                </button>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {room.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
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
            <div className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {room.title}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <FiMapPin className="h-5 w-5 mr-2" />
                    <span>{room.address.street}, {room.address.area}, {room.address.city}</span>
                  </div>
                  <div className="flex items-center">
                    <FiStar className="h-5 w-5 text-yellow-500 mr-1" />
                    <span className="font-semibold">{room.averageRating?.toFixed(1) || 'New'}</span>
                    <span className="text-gray-600 ml-2">({room.totalReviews || 0} reviews)</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600">
                    ₹{room.rent}
                  </div>
                  <div className="text-gray-600">per month</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <FiUsers className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                  <div className="text-sm text-gray-600">Capacity</div>
                  <div className="font-semibold">{room.capacity} people</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Type</div>
                  <div className="font-semibold capitalize">{room.type}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Deposit</div>
                  <div className="font-semibold">₹{room.securityDeposit}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-600">Available</div>
                  <div className="font-semibold">
                    {room.isAvailable ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-700">{room.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {room.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <FiWifi className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {room.rules?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">House Rules</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {room.rules.map((rule, index) => (
                      <li key={index} className="text-gray-700 text-sm">{rule}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="card sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Book This Room</h3>

              {room.isAvailable ? (
                <>
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-primary-600 mb-1">
                      ₹{room.rent}/month
                    </div>
                    <div className="text-sm text-gray-600">
                      + ₹{room.securityDeposit} security deposit
                    </div>
                  </div>

                  {isAuthenticated && user?.role === 'student' ? (
                    <button
                      onClick={() => setShowBookingModal(true)}
                      className="w-full btn-primary mb-4"
                    >
                      Request Booking
                    </button>
                  ) : (
                    <div className="mb-4">
                      {!isAuthenticated ? (
                        <button
                          onClick={() => navigate('/login')}
                          className="w-full btn-primary mb-2"
                        >
                          Login to Book
                        </button>
                      ) : (
                        <div className="text-center text-gray-600 text-sm">
                          Only students can book rooms
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-red-600 font-semibold mb-4">
                  Currently Unavailable
                </div>
              )}

              {/* Owner Contact */}
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Contact Owner</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <FiPhone className="h-4 w-4 mr-2 text-gray-600" />
                    <span>{room.owner?.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <FiMail className="h-4 w-4 mr-2 text-gray-600" />
                    <span>{room.owner?.email || 'Not provided'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Request Booking</h3>

              <form onSubmit={handleBooking}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Check-in Date
                  </label>
                  <input
                    type="date"
                    required
                    className="input-field"
                    value={bookingData.checkIn}
                    onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Check-out Date (Optional)
                  </label>
                  <input
                    type="date"
                    className="input-field"
                    value={bookingData.checkOut}
                    onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message to Owner
                  </label>
                  <textarea
                    rows="3"
                    className="input-field"
                    placeholder="Tell the owner about yourself..."
                    value={bookingData.message}
                    onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })}
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 btn-primary">
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
