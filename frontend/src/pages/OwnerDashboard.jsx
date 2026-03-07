import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import {
  Home, Plus, Calendar, TrendingUp, Users, Star,
  IndianRupee, Bell, Phone, ChevronRight, Target, Zap, RefreshCw, Eye
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const StatCard = ({ label, value, icon: Icon, iconColor, bg, sub }) => (
  <div className={`${bg} rounded-2xl p-5 border border-gray-100 dark:border-gray-700`}>
    <div className="flex items-center justify-between mb-2">
      <p className="text-gray-500 dark:text-gray-400 text-xs font-semibold uppercase tracking-wider">{label}</p>
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${iconColor}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
    </div>
    <p className="text-3xl font-black text-gray-900 dark:text-white">{value}</p>
    {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
  </div>
);

const OwnerDashboard = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalListings: 0,
    activeBookings: 0,
    pendingRequests: 0,
    totalEarnings: 0,
    thisMonthEarnings: 0,
    occupancyRate: 0,
    avgRating: 0,
    totalViews: 0,
    totalRooms: 0,
    availableRooms: 0,
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch rooms and bookings in parallel
      const [roomsRes, bookingsRes] = await Promise.all([
        api.get('/rooms/my-rooms?limit=100'),
        api.get('/bookings/owner-bookings?limit=100').catch(() => ({ data: { data: [] } }))
      ]);

      const rooms = roomsRes.data?.data?.rooms || [];
      const bookings = bookingsRes.data?.data || [];

      // Calculate from rooms
      const totalRooms = rooms.length;
      const availableRooms = rooms.filter(r => r.isAvailable).length;
      const occupiedRooms = rooms.filter(r => r.isOccupied || !r.isAvailable).length;
      const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
      const totalViews = rooms.reduce((sum, r) => sum + (r.views || 0), 0);
      const avgRating = rooms.length > 0
        ? (rooms.reduce((sum, r) => sum + (r.rating || 0), 0) / rooms.length).toFixed(1)
        : '0.0';

      // Calculate from bookings
      const allBookings = Array.isArray(bookings) ? bookings : [];
      const pendingRequests = allBookings.filter(b => b.status === 'requested').length;
      const activeBookings = allBookings.filter(b => b.status === 'active' || b.status === 'confirmed').length;

      // Earnings calculation
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      const completedBookings = allBookings.filter(b =>
        ['active', 'completed', 'confirmed'].includes(b.status)
      );
      const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.pricing?.monthlyRent || 0), 0);
      const thisMonthEarnings = completedBookings
        .filter(b => {
          const d = new Date(b.createdAt);
          return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
        })
        .reduce((sum, b) => sum + (b.pricing?.monthlyRent || 0), 0);

      setStats({
        totalListings: totalRooms,
        availableRooms,
        activeBookings,
        pendingRequests,
        totalEarnings,
        thisMonthEarnings,
        occupancyRate,
        avgRating,
        totalViews,
      });
    } catch (err) {
      console.error('Dashboard stats error:', err);
      toast.error('Could not load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                {greeting}, {user?.name?.split(' ')[0]} 👋
              </h1>
              <p className="text-blue-100 text-base">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <button
              onClick={fetchStats}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-medium transition-all backdrop-blur-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Pending Requests Alert */}
        {stats.pendingRequests > 0 && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 shadow-xl text-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Action Required!</h3>
                  <p className="text-orange-100">You have <strong>{stats.pendingRequests}</strong> pending booking {stats.pendingRequests === 1 ? 'request' : 'requests'} waiting for you</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/owner/bookings')}
                className="w-full sm:w-auto px-6 py-3 bg-white text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition-all shadow-lg"
              >
                Review Now →
              </button>
            </div>
          </div>
        )}

        {/* Primary Action Buttons */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/owner/rooms/new')}
              className="group bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-0.5">Add New Room</h3>
                  <p className="text-blue-100 text-sm">List a new property to earn more</p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </button>

            <button
              onClick={() => navigate('/owner/bookings')}
              className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-gray-100 dark:border-gray-700 hover:border-indigo-400 transform hover:-translate-y-1 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-0.5">Manage Bookings</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {stats.activeBookings > 0 ? `${stats.activeBookings} active` : 'View all requests'}
                    {stats.pendingRequests > 0 && ` • ${stats.pendingRequests} pending`}
                  </p>
                </div>
                {stats.pendingRequests > 0 && (
                  <span className="flex-shrink-0 w-7 h-7 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {stats.pendingRequests}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Live Stats Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Your Numbers</h2>
            {loading && (
              <span className="text-sm text-blue-500 flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" /> Loading...
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              label="Total Earnings"
              value={`₹${stats.totalEarnings.toLocaleString('en-IN')}`}
              icon={IndianRupee}
              iconColor="bg-green-500"
              bg="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800"
              sub="From all active bookings"
            />
            <StatCard
              label="This Month"
              value={`₹${stats.thisMonthEarnings.toLocaleString('en-IN')}`}
              icon={TrendingUp}
              iconColor="bg-blue-500"
              bg="bg-white dark:bg-gray-800"
              sub={new Date().toLocaleString('en-IN', { month: 'long' })}
            />
            <StatCard
              label="My Rooms"
              value={stats.totalListings}
              icon={Home}
              iconColor="bg-indigo-500"
              bg="bg-white dark:bg-gray-800"
              sub={`${stats.availableRooms} available`}
            />
            <StatCard
              label="Total Views"
              value={stats.totalViews}
              icon={Eye}
              iconColor="bg-purple-500"
              bg="bg-white dark:bg-gray-800"
              sub="Across all listings"
            />
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/owner/bookings')}
            className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-green-400 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-2xl font-black text-gray-900 dark:text-white">{stats.activeBookings}</span>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">Active Guests</span>
          </button>

          <button
            onClick={() => navigate('/owner/rooms')}
            className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-400 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-2xl font-black text-gray-900 dark:text-white">{stats.occupancyRate}%</span>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">Occupancy Rate</span>
          </button>

          <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center mb-2">
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <span className="text-2xl font-black text-gray-900 dark:text-white">{stats.avgRating}</span>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">Avg Rating</span>
          </div>

          <button
            onClick={() => navigate('/support')}
            className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-purple-400 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm font-bold text-gray-900 dark:text-white">Help</span>
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-0.5">Support</span>
          </button>
        </div>

        {/* Pro Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Tips to Get More Bookings</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { icon: '📸', tip: 'Add at least 5 clear photos', action: 'Go to My Rooms', path: '/owner/rooms' },
              { icon: '✅', tip: 'Upload your Aadhar to get Verified badge', action: 'Add Room', path: '/owner/rooms/new' },
              { icon: '⚡', tip: 'Respond to booking requests within 1 hour', action: 'View Requests', path: '/owner/bookings' },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(item.path)}
                className="flex items-start gap-3 p-3 bg-white dark:bg-gray-700 rounded-xl hover:shadow-md transition-all text-left group"
              >
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{item.tip}</p>
                  <p className="text-xs text-blue-500 group-hover:text-blue-600 mt-0.5 font-semibold">{item.action} →</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Manage Rooms CTA */}
        <button
          onClick={() => navigate('/owner/rooms')}
          className="w-full flex items-center justify-between bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-400 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">My Listings</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats.totalListings} room{stats.totalListings !== 1 ? 's' : ''} · {stats.availableRooms} available
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </button>

      </div>
    </div>
  );
};

export default OwnerDashboard;
