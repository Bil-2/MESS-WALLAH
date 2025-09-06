import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FiCalendar, FiClock, FiMapPin, FiUser, FiDollarSign, FiFilter, FiSearch } from 'react-icons/fi';

const Bookings = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();

  const EmptyState = ({ title, description, icon: Icon }) => (
    <div className={`
      text-center py-16 px-8 rounded-2xl border-2 border-dashed transition-all duration-300
      ${isDark
        ? 'border-gray-600 bg-gray-800/50 backdrop-blur-sm'
        : 'border-gray-300 bg-white/80 backdrop-blur-sm'
      }
    `}>
      <div className={`
        mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-all duration-300
        ${isDark
          ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/20 text-orange-400'
          : 'bg-gradient-to-br from-orange-100 to-orange-200 text-orange-600'
        }
      `}>
        <Icon className="w-8 h-8" />
      </div>
      <h3 className={`
        text-xl font-semibold mb-3 transition-colors duration-300
        ${isDark ? 'text-gray-100' : 'text-gray-900'}
      `}>
        {title}
      </h3>
      <p className={`
        text-base leading-relaxed transition-colors duration-300
        ${isDark ? 'text-gray-400' : 'text-gray-600'}
      `}>
        {description}
      </p>
    </div>
  );

  const FilterBar = () => (
    <div className={`
      p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 mb-8
      ${isDark
        ? 'bg-gray-800/70 border-gray-700 shadow-xl shadow-gray-900/20'
        : 'bg-white/90 border-gray-200 shadow-lg shadow-gray-900/5'
      }
    `}>
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <FiSearch className={`
            absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300
            ${isDark ? 'text-gray-400' : 'text-gray-500'}
          `} />
          <input
            type="text"
            placeholder="Search bookings..."
            className={`
              w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500
              ${isDark
                ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }
            `}
          />
        </div>
        <button className={`
          flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105
          ${isDark
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
          }
        `}>
          <FiFilter className="w-4 h-4" />
          Filter
        </button>
      </div>
    </div>
  );

  return (
    <div className={`
      min-h-screen py-8 transition-all duration-300
      ${isDark
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className={`
              p-3 rounded-xl transition-all duration-300
              ${isDark
                ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/20'
                : 'bg-gradient-to-br from-orange-100 to-orange-200'
              }
            `}>
              <FiCalendar className={`
                w-6 h-6 transition-colors duration-300
                ${isDark ? 'text-orange-400' : 'text-orange-600'}
              `} />
            </div>
            <div>
              <h1 className={`
                text-3xl font-bold transition-colors duration-300
                ${isDark ? 'text-gray-100' : 'text-gray-900'}
              `}>
                {user?.role === 'student' ? 'My Bookings' : 'Booking Requests'}
              </h1>
              <p className={`
                text-lg mt-1 transition-colors duration-300
                ${isDark ? 'text-gray-400' : 'text-gray-600'}
              `}>
                {user?.role === 'student'
                  ? 'Track your current and past room bookings'
                  : 'Manage incoming booking requests from students'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              icon: FiCalendar,
              label: 'Active Bookings',
              value: '0',
              color: 'blue',
              gradient: isDark ? 'from-blue-500/20 to-blue-600/20' : 'from-blue-100 to-blue-200'
            },
            {
              icon: FiClock,
              label: 'Pending Requests',
              value: '0',
              color: 'yellow',
              gradient: isDark ? 'from-yellow-500/20 to-yellow-600/20' : 'from-yellow-100 to-yellow-200'
            },
            {
              icon: FiDollarSign,
              label: 'Total Revenue',
              value: '₹0',
              color: 'green',
              gradient: isDark ? 'from-green-500/20 to-green-600/20' : 'from-green-100 to-green-200'
            }
          ].map((stat, index) => (
            <div key={index} className={`
              p-6 rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg
              ${isDark
                ? 'bg-gray-800/70 border-gray-700 shadow-xl shadow-gray-900/20'
                : 'bg-white/90 border-gray-200 shadow-lg shadow-gray-900/5'
              }
            `}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`
                    text-sm font-medium transition-colors duration-300
                    ${isDark ? 'text-gray-400' : 'text-gray-600'}
                  `}>
                    {stat.label}
                  </p>
                  <p className={`
                    text-2xl font-bold mt-1 transition-colors duration-300
                    ${isDark ? 'text-gray-100' : 'text-gray-900'}
                  `}>
                    {stat.value}
                  </p>
                </div>
                <div className={`
                  p-3 rounded-xl bg-gradient-to-br ${stat.gradient} transition-all duration-300
                `}>
                  <stat.icon className={`
                    w-6 h-6 transition-colors duration-300
                    ${isDark ? `text-${stat.color}-400` : `text-${stat.color}-600`}
                  `} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className={`
          rounded-2xl border backdrop-blur-sm transition-all duration-300 overflow-hidden
          ${isDark
            ? 'bg-gray-800/70 border-gray-700 shadow-2xl shadow-gray-900/30'
            : 'bg-white/90 border-gray-200 shadow-xl shadow-gray-900/10'
          }
        `}>
          <div className={`
            px-6 py-4 border-b transition-colors duration-300
            ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50/50'}
          `}>
            <h2 className={`
              text-lg font-semibold transition-colors duration-300
              ${isDark ? 'text-gray-100' : 'text-gray-900'}
            `}>
              {user?.role === 'student' ? 'Recent Bookings' : 'Recent Requests'}
            </h2>
          </div>

          <div className="p-8">
            <EmptyState
              icon={user?.role === 'student' ? FiMapPin : FiUser}
              title={user?.role === 'student' ? 'No Bookings Yet' : 'No Booking Requests'}
              description={
                user?.role === 'student'
                  ? 'Start exploring available rooms and make your first booking to see them here.'
                  : 'When students book your rooms, their requests will appear here for you to manage.'
              }
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button className={`
            px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg
            ${isDark
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white shadow-lg shadow-orange-500/25'
              : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25'
            }
          `}>
            {user?.role === 'student' ? 'Browse Rooms' : 'Add New Room'}
          </button>

          <button className={`
            px-8 py-4 rounded-xl font-semibold border-2 transition-all duration-300 hover:scale-105
            ${isDark
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
            }
          `}>
            View History
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
