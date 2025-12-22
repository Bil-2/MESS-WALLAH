import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import {
  Home, Plus, List, FileText, DollarSign, TrendingUp,
  Users, CheckCircle, Clock, XCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import AnalyticsOverview from '../components/owner/AnalyticsOverview';
import ScrollReveal from '../components/ScrollReveal';

const OwnerDashboard = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalListings: 0,
    activeBookings: 0,
    pendingRequests: 0,
    totalEarnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // TODO: Implement actual API calls
      // For now, using placeholder data
      setStats({
        totalListings: 0,
        activeBookings: 0,
        pendingRequests: 0,
        totalEarnings: 0
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Add New Room',
      description: 'List a new property',
      icon: Plus,
      color: 'from-blue-500 to-cyan-500',
      action: () => navigate('/owner/rooms/new')
    },
    {
      title: 'My Listings',
      description: 'Manage your rooms',
      icon: List,
      color: 'from-green-500 to-emerald-500',
      action: () => navigate('/owner/rooms')
    },
    {
      title: 'Booking Requests',
      description: 'Review pending requests',
      icon: FileText,
      color: 'from-orange-500 to-red-500',
      action: () => navigate('/owner/bookings')
    },
    {
      title: 'Earnings',
      description: 'View your revenue',
      icon: DollarSign,
      color: 'from-purple-500 to-pink-500',
      action: () => toast.info('Earnings page coming soon!')
    }
  ];

  const statCards = [
    { title: 'Total Listings', value: stats.totalListings, icon: Home, color: 'blue' },
    { title: 'Active Bookings', value: stats.activeBookings, icon: CheckCircle, color: 'green' },
    { title: 'Pending Requests', value: stats.pendingRequests, icon: Clock, color: 'orange' },
    { title: 'Total Earnings', value: `₹${stats.totalEarnings.toLocaleString()}`, icon: TrendingUp, color: 'purple' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <ScrollReveal animation="fade-up">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Owner Dashboard - Manage your properties and bookings
            </p>
          </div>
        </ScrollReveal>

        {/* Analytics Overview */}
        <ScrollReveal animation="fade-up" delay={100}>
          <AnalyticsOverview />
        </ScrollReveal>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <ScrollReveal key={index} animation="fade-up" delay={index * 100}>
                <div
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Quick Actions */}
        <ScrollReveal animation="fade-up" delay={200}>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    onClick={action.action}
                    className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 text-left"
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {action.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        {/* Getting Started Guide */}
        <ScrollReveal animation="fade-up" delay={300}>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
            <h2 className="text-2xl font-bold mb-4">Welcome to Owner Portal!</h2>
            <p className="text-blue-50 mb-6 text-lg">
              You've successfully registered as a property owner. Your interface is completely separate from tenants.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
              <h3 className="font-bold text-xl mb-3">What you can do:</h3>
              <ul className="space-y-2 text-blue-50">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>List unlimited rooms and properties</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Manage booking requests and approve tenants</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Track your earnings and occupancy rates</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Communicate directly with potential tenants</span>
                </li>
              </ul>
            </div>
            <p className="text-blue-50 text-sm">
              Note: The owner-specific pages (Add Room, Manage Listings, etc.) are being built step by step. Stay tuned!
            </p>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default OwnerDashboard;
