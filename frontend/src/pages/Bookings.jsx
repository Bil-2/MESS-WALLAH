import React from 'react';
import { useAuth } from '../context/AuthContext';

const Bookings = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === 'student' ? 'My Bookings' : 'Booking Requests'}
          </h1>
          <p className="text-gray-600 mt-2">
            {user?.role === 'student'
              ? 'Track your current and past bookings'
              : 'Manage incoming booking requests'
            }
          </p>
        </div>

        <div className="card">
          <p className="text-center text-gray-500">
            Booking data will be displayed here. Connect to backend to load bookings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
