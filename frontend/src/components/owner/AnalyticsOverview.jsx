import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { TrendingUp, TrendingDown, Eye, DollarSign, Home, Users } from 'lucide-react';

const AnalyticsOverview = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const response = await api.get('/owner/analytics');

      if (response.data.success) {
        setAnalytics(response.data.data);
      } else {
        setError('Failed to fetch analytics');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError(error.response?.data?.message || 'Error fetching analytics');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-8">
        <p className="text-red-700 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!analytics) return null;

  const { overview } = analytics;

  const MetricCard = ({ icon: Icon, value, label, subtext, trend, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend !== undefined && trend !== 0 && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${trend > 0
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </div>
        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </div>
        {subtext && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {subtext}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="mb-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Overview</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Last 30 days</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={Home}
          value={`${overview.occupancyRate}%`}
          label="Occupancy Rate"
          subtext={`${overview.occupiedRooms} of ${overview.totalRooms} rooms occupied`}
          color="from-blue-500 to-blue-600"
        />

        <MetricCard
          icon={DollarSign}
          value={`₹${overview.avgRent.toLocaleString()}`}
          label="Average Rent"
          subtext="Per month"
          color="from-green-500 to-emerald-600"
        />

        <MetricCard
          icon={Eye}
          value={overview.totalViews.toLocaleString()}
          label="Total Views"
          subtext="All your listings"
          color="from-purple-500 to-purple-600"
        />

        <MetricCard
          icon={Users}
          value={`${overview.conversionRate}%`}
          label="Conversion Rate"
          subtext={`${overview.totalBookings} bookings from views`}
          trend={overview.bookingTrend}
          color="from-orange-500 to-red-600"
        />
      </div>

      {overview.totalRooms === 0 && (
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            <strong>Get started:</strong> Add your first room to see analytics and start earning!
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsOverview;
