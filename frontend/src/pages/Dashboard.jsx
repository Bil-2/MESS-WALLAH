import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, Calendar, Heart, Settings, Plus, Edit, Eye, Trash2,
  Users, MapPin, Star, TrendingUp, DollarSign, Clock
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import RoomCard from '../components/RoomCard';
import api, { roomsAPI, bookingsAPI, usersAPI } from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    recentBookings: [],
    myRooms: [],
    favorites: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      if (user?.role === 'owner') {
        // Fetch owner dashboard data
        const [statsRes, roomsRes, bookingsRes] = await Promise.all([
          api.get('/users/dashboard/stats'),
          api.get('/rooms/my-rooms'),
          api.get('/bookings/my-bookings')
        ]);

        setDashboardData({
          stats: statsRes.data,
          myRooms: roomsRes.data.rooms || [],
          recentBookings: bookingsRes.data.bookings || [],
          favorites: []
        });
      } else {
        // Fetch user dashboard data
        const [bookingsRes, favoritesRes] = await Promise.all([
          api.get('/bookings/my-bookings'),
          api.get('/users/favorites').catch(() => ({ data: { favorites: [] } }))
        ]);

        setDashboardData({
          stats: {},
          myRooms: [],
          recentBookings: bookingsRes.data.bookings || [],
          favorites: favoritesRes.data.favorites || []
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isOwner = user?.role === 'owner';

  const stats = [
    {
      title: 'Current Rent',
      value: '₹8,500',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Days Remaining',
      value: '45',
      icon: <Calendar className="w-6 h-6" />,
      color: 'bg-green-500'
    },
    {
      title: 'Rating Given',
      value: '4.5',
      icon: <Star className="w-6 h-6" />,
      color: 'bg-yellow-500'
    },
    {
      title: 'Bookings Made',
      value: '3',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-purple-500'
    }
  ];

  const recentActivities = [
    { id: 1, action: 'Rent payment completed', date: '2024-01-01', status: 'success' },
    { id: 2, action: 'Booking confirmed', date: '2023-12-15', status: 'success' },
    { id: 3, action: 'Profile updated', date: '2023-12-10', status: 'info' }
  ];

  const tabs = isOwner ? [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'rooms', label: 'My Rooms', icon: MapPin },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings }
  ] : [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderOverview = () => {
    if (isOwner) {
      return (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg text-white`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Current Booking */}
          {user.currentBooking && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md transition-colors duration-200">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Current Booking</h3>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h4 className="font-medium text-gray-900 dark:text-white">{user.currentBooking.property}</h4>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{user.currentBooking.location}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {user.currentBooking.checkIn} to {user.currentBooking.checkOut}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ₹{user.currentBooking.rent}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">per month</p>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activities */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md transition-colors duration-200">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activities</h3>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-3 ${activity.status === 'success' ? 'bg-green-500' :
                        activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                      }`}></div>
                    <span className="text-gray-900 dark:text-white">{activity.action}</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{activity.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-6">
          {/* Welcome Message */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md transition-colors duration-200">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {user?.name || 'User'}!
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your bookings and find your perfect accommodation.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => navigate('/search')}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-left hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Find Rooms</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Search for accommodations</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-left hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">My Bookings</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">View your reservations</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-left hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Favorites</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Saved accommodations</p>
                </div>
              </div>
            </button>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Bookings</h3>
            </div>
            <div className="p-6">
              {dashboardData.recentBookings.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentBookings.slice(0, 3).map((booking) => (
                    <div key={booking._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                          <Home className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{booking.room?.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {booking.room?.address?.area}, {booking.room?.address?.city}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {formatPrice(booking.totalAmount)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No bookings yet</p>
                  <button
                    onClick={() => navigate('/search')}
                    className="btn-primary"
                  >
                    Find Your First Room
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
  };

  const renderRooms = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Rooms</h2>
          <button
            onClick={() => navigate('/add-room')}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Room</span>
          </button>
        </div>

        {dashboardData.myRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardData.myRooms.map((room) => (
              <div key={room._id} className="relative">
                <RoomCard room={room} />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    onClick={() => navigate(`/room/${room._id}`)}
                    className="p-2 bg-white dark:bg-gray-800 bg-opacity-90 rounded-full shadow-sm hover:bg-opacity-100"
                  >
                    <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                  <button
                    onClick={() => navigate(`/edit-room/${room._id}`)}
                    className="p-2 bg-white dark:bg-gray-800 bg-opacity-90 rounded-full shadow-sm hover:bg-opacity-100"
                  >
                    <Edit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Home className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No rooms listed yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Start earning by listing your first room</p>
            <button
              onClick={() => navigate('/add-room')}
              className="btn-primary"
            >
              List Your First Room
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderBookings = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isOwner ? 'Bookings' : 'My Bookings'}
        </h2>

        {dashboardData.recentBookings.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Room
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {isOwner ? 'Guest' : 'Owner'}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {dashboardData.recentBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mr-3">
                            <Home className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {booking.room?.title}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {booking.room?.address?.area}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {isOwner
                            ? (booking.user?.name || booking.user?.phone)
                            : (booking.room?.owner?.name || 'Owner')
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(booking.checkIn).toLocaleDateString()} -
                        {new Date(booking.checkOut).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatPrice(booking.totalAmount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No bookings found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {isOwner ? 'Bookings will appear here once guests book your rooms' : 'Your bookings will appear here'}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderFavorites = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Favorite Rooms</h2>

        {dashboardData.favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardData.favorites.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No favorites yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Save rooms you like to view them later</p>
            <button
              onClick={() => navigate('/search')}
              className="btn-primary"
            >
              Browse Rooms
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Settings</h3>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/profile')}
              className="w-full text-left p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Edit Profile</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Update your personal information</p>
                </div>
                <Edit className="w-5 h-5 text-gray-400 dark:text-gray-600" />
              </div>
            </button>

            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Notifications</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage your notification preferences</p>
                </div>
                <Settings className="w-5 h-5 text-gray-400 dark:text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'rooms':
        return renderRooms();
      case 'bookings':
        return renderBookings();
      case 'favorites':
        return renderFavorites();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === tab.id
                          ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-400'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
