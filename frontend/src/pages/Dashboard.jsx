import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiCalendar, FiDollarSign, FiStar, FiPlus } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();

  const StudentDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors duration-200">
              <FiCalendar className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-200">Active Bookings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 transition-colors duration-200">
              <FiDollarSign className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-200">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">₹0</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 transition-colors duration-200">
              <FiStar className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-200">Reviews Given</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-200">Recent Bookings</h2>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8 transition-colors duration-200">No bookings yet. Start exploring rooms!</p>
      </div>
    </div>
  );

  const OwnerDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition-colors duration-200">
              <FiHome className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-200">Total Rooms</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 transition-colors duration-200">
              <FiCalendar className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-200">Active Bookings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 transition-colors duration-200">
              <FiDollarSign className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-200">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">₹0</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 transition-colors duration-200">
              <FiStar className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-200">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">0.0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-200">My Rooms</h2>
            <button className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center transition-colors duration-200">
              <FiPlus className="h-4 w-4 mr-2" />
              Add Room
            </button>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-center py-8 transition-colors duration-200">No rooms listed yet. Add your first room!</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-200">Recent Booking Requests</h2>
          <p className="text-gray-500 dark:text-gray-400 text-center py-8 transition-colors duration-200">No booking requests yet.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-200">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-200">
            {user?.role === 'student'
              ? 'Find and book your perfect room'
              : 'Manage your properties and bookings'
            }
          </p>
        </div>

        {user?.role === 'student' ? <StudentDashboard /> : <OwnerDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;
