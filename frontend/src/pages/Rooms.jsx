import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  searchAllProperties,
  getAllStates,
  getCitiesByState,
  getPropertyStats,
  allIndiaProperties
} from '../data/allIndiaProperties';
import { FiSearch, FiFilter, FiMapPin, FiStar, FiUsers, FiWifi, FiCar, FiPhone, FiMail } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Rooms = () => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    state: 'all',
    city: 'all',
    type: 'all',
    minPrice: '',
    maxPrice: '',
    sortBy: 'rating'
  });
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState(null);

  // Get available states and cities
  const states = getAllStates();
  const cities = getCitiesByState(filters.state);

  useEffect(() => {
    setStats(getPropertyStats());
    performSearch();
  }, []);

  useEffect(() => {
    performSearch();
  }, [searchQuery, filters]);

  const performSearch = () => {
    setLoading(true);
    setTimeout(() => {
      const results = searchAllProperties(searchQuery, {
        ...filters,
        minPrice: filters.minPrice ? parseInt(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? parseInt(filters.maxPrice) : undefined
      });
      setProperties(results);
      setLoading(false);
    }, 300);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      ...(key === 'state' && value !== prev.state ? { city: 'all' } : {})
    }));
  };

  const clearFilters = () => {
    setFilters({
      state: 'all',
      city: 'all',
      type: 'all',
      minPrice: '',
      maxPrice: '',
      sortBy: 'rating'
    });
    setSearchQuery('');
  };

  const PropertyCard = ({ property }) => (
    <div className={`
      rounded-xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-lg group
      ${isDark
        ? 'bg-gray-800/70 border-gray-700 shadow-xl shadow-gray-900/20 hover:shadow-gray-900/30'
        : 'bg-white/90 border-gray-200 shadow-lg shadow-gray-900/5 hover:shadow-gray-900/10'
      }
    `}>
      <div className="relative overflow-hidden rounded-t-xl">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className={`
            px-3 py-1 rounded-full text-sm font-medium capitalize transition-colors duration-300
            ${property.type === 'mess'
              ? (isDark ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-blue-100 text-blue-700 border border-blue-200')
              : (isDark ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-green-100 text-green-700 border border-green-200')
            }
          `}>
            {property.type}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className={`
            px-3 py-1 rounded-full text-sm font-bold transition-colors duration-300
            ${isDark ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-orange-100 text-orange-700 border border-orange-200'}
          `}>
            ₹{property.price}/month
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className={`
            text-xl font-bold mb-2 transition-colors duration-300
            ${isDark ? 'text-gray-100' : 'text-gray-900'}
          `}>
            {property.title}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <FiMapPin className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {property.location.area}, {property.location.city}, {property.location.state}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <FiUsers className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {property.property.capacity} capacity
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FiStar className="w-4 h-4 text-yellow-500" />
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {property.owner.rating}
              </span>
            </div>
          </div>
        </div>

        {/* Owner Info */}
        <div className={`
          p-4 rounded-lg mb-4 transition-colors duration-300
          ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}
        `}>
          <h4 className={`font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
            Owner: {property.owner.name}
          </h4>
          <div className="flex flex-col gap-1 text-sm">
            <div className="flex items-center gap-2">
              <FiPhone className={`w-3 h-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {property.owner.phone}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FiMail className={`w-3 h-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {property.owner.email}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FiStar className="w-3 h-3 text-yellow-500" />
              <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {property.owner.experience} experience
              </span>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {property.property.amenities.slice(0, 4).map((amenity, index) => (
              <span
                key={index}
                className={`
                  px-2 py-1 rounded-md text-xs transition-colors duration-300
                  ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}
                `}
              >
                {amenity}
              </span>
            ))}
            {property.property.amenities.length > 4 && (
              <span className={`
                px-2 py-1 rounded-md text-xs transition-colors duration-300
                ${isDark ? 'bg-gray-600 text-gray-400' : 'bg-gray-200 text-gray-600'}
              `}>
                +{property.property.amenities.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Cuisine */}
        <div className="mb-4">
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <strong>Cuisine:</strong> {property.property.cuisine.join(', ')}
          </p>
        </div>

        <Link
          to={`/rooms/${property.id}`}
          className={`
            w-full py-3 px-4 rounded-lg font-semibold text-center block transition-all duration-300 hover:scale-105
            ${isDark
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white shadow-lg shadow-orange-500/25'
              : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/25'
            }
          `}
        >
          View Details & Book
        </Link>
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
        {/* Header with Stats */}
        <div className="mb-8">
          <h1 className={`
            text-4xl font-bold mb-4 transition-colors duration-300
            ${isDark ? 'text-gray-100' : 'text-gray-900'}
          `}>
            Find Mess & PG Across India
          </h1>
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className={`
                p-4 rounded-lg text-center transition-colors duration-300
                ${isDark ? 'bg-gray-800/50' : 'bg-white/80'}
              `}>
                <div className={`text-2xl font-bold ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>
                  {stats.totalProperties}
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Properties
                </div>
              </div>
              <div className={`
                p-4 rounded-lg text-center transition-colors duration-300
                ${isDark ? 'bg-gray-800/50' : 'bg-white/80'}
              `}>
                <div className={`text-2xl font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                  {stats.totalStates}
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  States
                </div>
              </div>
              <div className={`
                p-4 rounded-lg text-center transition-colors duration-300
                ${isDark ? 'bg-gray-800/50' : 'bg-white/80'}
              `}>
                <div className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                  {stats.totalCities}
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Cities
                </div>
              </div>
              <div className={`
                p-4 rounded-lg text-center transition-colors duration-300
                ${isDark ? 'bg-gray-800/50' : 'bg-white/80'}
              `}>
                <div className={`text-2xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                  ₹{stats.averagePrice}
                </div>
                <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Avg Price
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className={`
          p-6 rounded-xl border backdrop-blur-sm mb-8 transition-all duration-300
          ${isDark
            ? 'bg-gray-800/70 border-gray-700 shadow-xl shadow-gray-900/20'
            : 'bg-white/90 border-gray-200 shadow-lg shadow-gray-900/5'
          }
        `}>
          {/* Search Bar */}
          <div className="relative mb-6">
            <FiSearch className={`
              absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300
              ${isDark ? 'text-gray-400' : 'text-gray-500'}
            `} />
            <input
              type="text"
              placeholder="Search by location, owner name, amenities, cuisine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`
                w-full pl-12 pr-4 py-4 rounded-lg border text-lg transition-all duration-300 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500
                ${isDark
                  ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }
              `}
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300
                ${isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }
              `}
            >
              <FiFilter className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            <button
              onClick={clearFilters}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all duration-300
                ${isDark
                  ? 'text-orange-400 hover:bg-gray-700'
                  : 'text-orange-600 hover:bg-gray-100'
                }
              `}
            >
              Clear All
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <select
                value={filters.state}
                onChange={(e) => handleFilterChange('state', e.target.value)}
                className={`
                  px-3 py-2 rounded-lg border transition-all duration-300
                  ${isDark
                    ? 'bg-gray-700 border-gray-600 text-gray-100'
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                `}
              >
                <option value="all">All States</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>

              <select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                disabled={filters.state === 'all'}
                className={`
                  px-3 py-2 rounded-lg border transition-all duration-300
                  ${isDark
                    ? 'bg-gray-700 border-gray-600 text-gray-100'
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                `}
              >
                <option value="all">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>

              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className={`
                  px-3 py-2 rounded-lg border transition-all duration-300
                  ${isDark
                    ? 'bg-gray-700 border-gray-600 text-gray-100'
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                `}
              >
                <option value="all">All Types</option>
                <option value="mess">Mess</option>
                <option value="pg">PG</option>
              </select>

              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className={`
                  px-3 py-2 rounded-lg border transition-all duration-300
                  ${isDark
                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }
                `}
              />

              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className={`
                  px-3 py-2 rounded-lg border transition-all duration-300
                  ${isDark
                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }
                `}
              />

              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className={`
                  px-3 py-2 rounded-lg border transition-all duration-300
                  ${isDark
                    ? 'bg-gray-700 border-gray-600 text-gray-100'
                    : 'bg-white border-gray-300 text-gray-900'
                  }
                `}
              >
                <option value="rating">Sort by Rating</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="experience">Experience</option>
              </select>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {loading ? 'Searching...' : `Found ${properties.length} properties`}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`
                animate-pulse rounded-xl border p-6 transition-colors duration-300
                ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
              `}>
                <div className={`h-48 rounded-lg mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`h-4 rounded mb-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`h-4 rounded w-3/4 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              </div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className={`
            text-center py-16 rounded-xl border-2 border-dashed transition-colors duration-300
            ${isDark ? 'border-gray-600 bg-gray-800/50' : 'border-gray-300 bg-white/80'}
          `}>
            <FiMapPin className={`
              mx-auto w-16 h-16 mb-4 transition-colors duration-300
              ${isDark ? 'text-gray-500' : 'text-gray-400'}
            `} />
            <h3 className={`
              text-xl font-semibold mb-2 transition-colors duration-300
              ${isDark ? 'text-gray-300' : 'text-gray-700'}
            `}>
              No properties found
            </h3>
            <p className={`
              transition-colors duration-300
              ${isDark ? 'text-gray-400' : 'text-gray-600'}
            `}>
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;
