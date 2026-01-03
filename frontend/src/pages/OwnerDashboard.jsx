import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import {
  Home, Plus, Calendar, TrendingUp, Users, Star,
  IndianRupee, Clock, CheckCircle, Bell, Phone, ChevronRight,
  Award, Target, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

const OwnerDashboard = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [stats] = useState({
    totalListings: 0,
    activeBookings: 0,
    pendingRequests: 0,
    totalEarnings: 0,
    thisMonthEarnings: 0,
    occupancyRate: 0,
    avgRating: 0,
    todayCheckIns: 0,
    totalViews: 0
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">

      {/* Stunning Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {greeting}, Owner {user?.name}
            </h1>
            <p className="text-blue-100 text-lg">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* HERO Revenue Card - Most Important */}
        <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 rounded-3xl p-8 shadow-2xl text-white transform hover:scale-[1.02] transition-all">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-green-100 text-lg mb-2">Total Earnings</p>
              <h2 className="text-5xl md:text-6xl font-black mb-2">
                ₹{stats.totalEarnings.toLocaleString()}
              </h2>
              <p className="text-green-100 text-base">All time revenue from your properties</p>
            </div>
            <div className="hidden md:block w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <IndianRupee className="w-12 h-12" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-green-100 text-sm mb-1">This Month</p>
              <p className="text-2xl font-bold">₹{stats.thisMonthEarnings.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-green-100 text-sm mb-1">Occupancy</p>
              <p className="text-2xl font-bold">{stats.occupancyRate}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-green-100 text-sm mb-1">Average Rating</p>
              <p className="text-2xl font-bold flex items-center gap-1">
                <Star className="w-5 h-5 fill-current" />
                {stats.avgRating || '5.0'}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-green-100 text-sm mb-1">Active Guests</p>
              <p className="text-2xl font-bold">{stats.activeBookings}</p>
            </div>
          </div>
        </div>

        {/* Action Needed Alert */}
        {stats.pendingRequests > 0 && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 shadow-xl text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Bell className="w-7 h-7 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">Action Required!</h3>
                  <p className="text-orange-100">You have {stats.pendingRequests} pending booking requests</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/owner/bookings')}
                className="px-6 py-3 bg-white text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition-all shadow-lg"
              >
                Review Now
              </button>
            </div>
          </div>
        )}

        {/* Quick Stats Grid - Beautiful Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Total Rooms */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Home className="w-7 h-7 text-white" />
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Rooms</p>
            <p className="text-4xl font-black text-gray-900 dark:text-white">{stats.totalListings}</p>
            <button
              onClick={() => navigate('/owner/rooms')}
              className="mt-4 text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline"
            >
              Manage Rooms
            </button>
          </div>

          {/* Active Bookings */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-green-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Active Guests</p>
            <p className="text-4xl font-black text-gray-900 dark:text-white">{stats.activeBookings}</p>
            <button
              onClick={() => navigate('/owner/bookings')}
              className="mt-4 text-green-600 dark:text-green-400 text-sm font-semibold hover:underline"
            >
              View Bookings
            </button>
          </div>

          {/* Today's Check-ins */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Today's Check-ins</p>
            <p className="text-4xl font-black text-gray-900 dark:text-white">{stats.todayCheckIns}</p>
            <p className="mt-4 text-purple-600 dark:text-purple-400 text-sm font-semibold">
              {new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
          </div>

          {/* Total Views */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-orange-500">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Views</p>
            <p className="text-4xl font-black text-gray-900 dark:text-white">{stats.totalViews}</p>
            <p className="mt-4 text-orange-600 dark:text-orange-400 text-sm font-semibold">
              This month
            </p>
          </div>
        </div>

        {/* Giant Action Buttons */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Add New Room - PRIMARY CTA */}
            <button
              onClick={() => navigate('/owner/rooms/new')}
              className="group bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-10 h-10 text-white" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">Add New Room</h3>
                  <p className="text-blue-100 text-base">Start earning by listing your property</p>
                </div>
                <ChevronRight className="w-8 h-8 text-white/60 group-hover:text-white group-hover:translate-x-2 transition-all" />
              </div>
            </button>

            {/* View All Rooms */}
            <button
              onClick={() => navigate('/owner/rooms')}
              className="group bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Home className="w-10 h-10 text-white" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">My Rooms</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-base">Manage {stats.totalListings} listings</p>
                </div>
                <ChevronRight className="w-8 h-8 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" />
              </div>
            </button>
          </div>
        </div>

        {/* Performance & Support Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Performance Insights */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Performance</h3>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Occupancy Rate</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">{stats.occupancyRate}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full" style={{ width: `${stats.occupancyRate}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Guest Rating</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    {stats.avgRating || '5.0'}
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" style={{ width: `${(stats.avgRating || 5) * 20}%` }}></div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Great performance! Keep it up</span>
                </div>
              </div>
            </div>
          </div>

          {/* 24/7 Support */}
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 shadow-xl text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">24/7 Support</h3>
            </div>

            <p className="text-purple-100 text-lg mb-6">
              Need help? Our expert team is always here to assist you with your properties
            </p>

            <div className="space-y-4">
              <a
                href="tel:+919876543210"
                className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-xl p-5 hover:bg-white/30 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6" />
                  <div>
                    <p className="font-semibold text-lg">Call Support</p>
                    <p className="text-purple-100 text-sm">+91 98765 43210</p>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </a>

              <button
                onClick={() => navigate('/help')}
                className="w-full flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-xl p-5 hover:bg-white/30 transition-all group"
              >
                <span className="font-semibold text-lg">Visit Help Center</span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OwnerDashboard;
