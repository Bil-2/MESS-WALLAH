import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import {
  FiPlus, FiEdit, FiEye, FiTrash2, FiUsers, FiDollarSign,
  FiStar, FiTrendingUp, FiHome, FiCalendar, FiSettings,
  FiBarChart3, FiMapPin, FiClock, FiCheck, FiX, FiAlertCircle
} from 'react-icons/fi';
import { roomAPI, bookingAPI } from '../services/api';

const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const queryClient = useQueryClient();

  // Fetch owner's rooms
  const { data: roomsData, isLoading: roomsLoading } = useQuery(
    'owner-rooms',
    () => roomAPI.getOwnerRooms(),
    { staleTime: 5 * 60 * 1000 }
  );

  // Fetch bookings
  const { data: bookingsData, isLoading: bookingsLoading } = useQuery(
    'owner-bookings',
    () => bookingAPI.getOwnerBookings(),
    { staleTime: 5 * 60 * 1000 }
  );

  // Fetch analytics
  const { data: analyticsData } = useQuery(
    'owner-analytics',
    () => roomAPI.getOwnerAnalytics(),
    { staleTime: 10 * 60 * 1000 }
  );

  const rooms = roomsData?.data?.rooms || [];
  const bookings = bookingsData?.data?.bookings || [];
  const analytics = analyticsData?.data || {};

  // Update room status mutation
  const updateRoomStatus = useMutation(
    ({ roomId, status }) => roomAPI.updateRoomStatus(roomId, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('owner-rooms');
      }
    }
  );

  // Handle booking response mutation
  const respondToBooking = useMutation(
    ({ bookingId, response, message }) => bookingAPI.respondToBooking(bookingId, response, message),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('owner-bookings');
      }
    }
  );

  const StatCard = ({ icon: Icon, title, value, change, color = 'blue' }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 flex items-center ${change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
              <FiTrendingUp className="h-3 w-3 mr-1" />
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`h-6 w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  const RoomCard = ({ room }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="relative">
        <img
          src={room.images?.[0]?.url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgMTI1SDE1MFYxNzVIMTc1VjEyNVoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+dGggZD0iTTIyNSAxMjVIMjAwVjE3NUgyMjVWMTI1WiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMjAwIDEwMEgxNzVWMTUwSDIwMFYxMDBaIiBmaWxsPSIjOUNBM0FGIi8+CjwvZz4KPC9zdmc+'}
          alt={room.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${room.isActive
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
            }`}>
            {room.isActive ? 'Active' : 'Inactive'}
          </span>
          {room.featured && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
              Featured
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-900">{room.title}</h3>
            <p className="text-sm text-orange-600">{room.messDetails?.messName}</p>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FiEye className="h-4 w-4 mr-1" />
            <span>{room.views || 0}</span>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <FiMapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="text-sm truncate">{room.location?.city}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <span className="text-gray-500">Monthly Rent:</span>
            <p className="font-semibold">₹{room.rent?.monthly}</p>
          </div>
          <div>
            <span className="text-gray-500">Occupancy:</span>
            <p className="font-semibold">
              {room.specifications?.occupancy?.current || 0}/{room.specifications?.occupancy?.maximum || 1}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Rating:</span>
            <div className="flex items-center">
              <FiStar className="h-3 w-3 text-yellow-500 mr-1" />
              <span className="font-semibold">{room.ratings?.average?.toFixed(1) || 'New'}</span>
            </div>
          </div>
          <div>
            <span className="text-gray-500">Status:</span>
            <p className={`font-semibold ${room.availability?.isAvailable ? 'text-green-600' : 'text-red-600'
              }`}>
              {room.availability?.isAvailable ? 'Available' : 'Occupied'}
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <Link
            to={`/rooms/${room._id}`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-center py-2 px-3 rounded-lg text-sm font-medium transition-colors"
          >
            View
          </Link>
          <Link
            to={`/dashboard/rooms/${room._id}/edit`}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-center py-2 px-3 rounded-lg text-sm font-medium transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={() => updateRoomStatus.mutate({
              roomId: room._id,
              status: !room.isActive
            })}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${room.isActive
              ? 'bg-red-100 hover:bg-red-200 text-red-700'
              : 'bg-green-100 hover:bg-green-200 text-green-700'
              }`}
          >
            {room.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>
    </div>
  );

  const BookingCard = ({ booking }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{booking.room?.title}</h3>
          <p className="text-sm text-gray-600">{booking.tenant?.name}</p>
          <p className="text-xs text-gray-500">{booking.tenant?.email}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
          booking.status === 'approved' ? 'bg-green-100 text-green-700' :
            booking.status === 'rejected' ? 'bg-red-100 text-red-700' :
              'bg-blue-100 text-blue-700'
          }`}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-500">Check-in:</span>
          <p className="font-semibold">
            {new Date(booking.bookingDetails?.checkIn).toLocaleDateString()}
          </p>
        </div>
        <div>
          <span className="text-gray-500">Duration:</span>
          <p className="font-semibold">{booking.bookingDetails?.duration} months</p>
        </div>
        <div>
          <span className="text-gray-500">Total Amount:</span>
          <p className="font-semibold">₹{booking.pricing?.totalAmount}</p>
        </div>
        <div>
          <span className="text-gray-500">Payment:</span>
          <p className={`font-semibold ${booking.paymentStatus === 'completed' ? 'text-green-600' :
            booking.paymentStatus === 'partial' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
            {booking.paymentStatus}
          </p>
        </div>
      </div>

      {booking.status === 'pending' && (
        <div className="flex space-x-2">
          <button
            onClick={() => respondToBooking.mutate({
              bookingId: booking._id,
              response: 'approved',
              message: 'Booking approved!'
            })}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
          >
            <FiCheck className="h-4 w-4 mr-1" />
            Approve
          </button>
          <button
            onClick={() => respondToBooking.mutate({
              bookingId: booking._id,
              response: 'rejected',
              message: 'Sorry, room is no longer available.'
            })}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
          >
            <FiX className="h-4 w-4 mr-1" />
            Reject
          </button>
        </div>
      )}

      {booking.messages?.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Latest message:</p>
          <p className="text-sm text-gray-700">
            {booking.messages[booking.messages.length - 1].message}
          </p>
        </div>
      )}
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBarChart3 },
    { id: 'rooms', label: 'My Rooms', icon: FiHome },
    { id: 'bookings', label: 'Bookings', icon: FiCalendar },
    { id: 'analytics', label: 'Analytics', icon: FiTrendingUp },
    { id: 'settings', label: 'Settings', icon: FiSettings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your mess properties and bookings</p>
          </div>
          <Link
            to="/dashboard/rooms/add"
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
          >
            <FiPlus className="h-5 w-5 mr-2" />
            Add New Room
          </Link>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={FiHome}
                title="Total Rooms"
                value={rooms.length}
                change={analytics.roomsGrowth}
                color="blue"
              />
              <StatCard
                icon={FiUsers}
                title="Active Bookings"
                value={bookings.filter(b => b.status === 'active').length}
                change={analytics.bookingsGrowth}
                color="green"
              />
              <StatCard
                icon={FiDollarSign}
                title="Monthly Revenue"
                value={`₹${analytics.monthlyRevenue || 0}`}
                change={analytics.revenueGrowth}
                color="orange"
              />
              <StatCard
                icon={FiStar}
                title="Average Rating"
                value={analytics.averageRating?.toFixed(1) || 'N/A'}
                change={analytics.ratingChange}
                color="yellow"
              />
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h2>
                <div className="space-y-4">
                  {bookings.slice(0, 3).map((booking) => (
                    <div key={booking._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{booking.tenant?.name}</p>
                        <p className="text-sm text-gray-600">{booking.room?.title}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        booking.status === 'approved' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                        {booking.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Rooms</h2>
                <div className="space-y-4">
                  {rooms
                    .sort((a, b) => (b.ratings?.average || 0) - (a.ratings?.average || 0))
                    .slice(0, 3)
                    .map((room) => (
                      <div key={room._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{room.title}</p>
                          <p className="text-sm text-gray-600">{room.location?.city}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center">
                            <FiStar className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="font-medium">{room.ratings?.average?.toFixed(1) || 'New'}</span>
                          </div>
                          <p className="text-sm text-gray-600">{room.views || 0} views</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div>
            {roomsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm animate-pulse">
                    <div className="h-48 bg-gray-300"></div>
                    <div className="p-5">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded mb-4"></div>
                      <div className="h-10 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : rooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <RoomCard key={room._id} room={room} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FiHome className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No rooms yet</h3>
                <p className="text-gray-600 mb-6">Start by adding your first mess room</p>
                <Link
                  to="/dashboard/rooms/add"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
                >
                  <FiPlus className="h-5 w-5 mr-2" />
                  Add Your First Room
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div>
            {bookingsLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-5 animate-pulse">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded mb-4"></div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                  </div>
                ))}
              </div>
            ) : bookings.length > 0 ? (
              <div className="space-y-6">
                {bookings.map((booking) => (
                  <BookingCard key={booking._id} booking={booking} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FiCalendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-600">Bookings will appear here once tenants start booking your rooms</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics Dashboard</h2>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <FiBarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Coming Soon</h3>
                <p className="text-gray-600">Detailed analytics and insights will be available here</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h2>
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <FiSettings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings Panel</h3>
                <p className="text-gray-600">Account and property settings will be available here</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
