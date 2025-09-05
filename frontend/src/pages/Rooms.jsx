import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { roomAPI } from '../services/api';
import {
  FiSearch, FiFilter, FiMapPin, FiUsers, FiStar, FiWifi, FiShield,
  FiCoffee, FiHome, FiClock, FiHeart, FiEye, FiChevronDown
} from 'react-icons/fi';

const Rooms = () => {
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    minRent: '',
    maxRent: '',
    roomType: '',
    messType: '',
    cuisine: [],
    amenities: [],
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [showFilters, setShowFilters] = useState(false);
  const [savedRooms, setSavedRooms] = useState(new Set());

  const { data: roomsData, isLoading, error } = useQuery(
    ['rooms', filters],
    () => roomAPI.getAllRooms(filters),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const rooms = roomsData?.data?.rooms || [];
  const pagination = roomsData?.data?.pagination || {};

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleArrayFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const toggleSaveRoom = (roomId) => {
    setSavedRooms(prev => {
      const newSet = new Set(prev);
      if (newSet.has(roomId)) {
        newSet.delete(roomId);
      } else {
        newSet.add(roomId);
      }
      return newSet;
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      minRent: '',
      maxRent: '',
      roomType: '',
      messType: '',
      cuisine: [],
      amenities: [],
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const RoomCard = ({ room }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative">
        <img
          src={room.images?.[0]?.url || '/placeholder-room.jpg'}
          alt={room.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <div className="bg-white px-3 py-1 rounded-full text-sm font-semibold text-orange-600 shadow-sm">
            ₹{room.rent?.monthly || 0}/month
          </div>
          {room.featured && (
            <div className="bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              Featured
            </div>
          )}
        </div>
        <button
          onClick={() => toggleSaveRoom(room._id)}
          className={`absolute top-3 left-3 p-2 rounded-full transition-colors ${savedRooms.has(room._id)
              ? 'bg-red-500 text-white'
              : 'bg-white text-gray-600 hover:text-red-500'
            }`}
        >
          <FiHeart className="h-4 w-4" />
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{room.title}</h3>
            <p className="text-sm text-orange-600 font-medium">{room.messDetails?.messName}</p>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FiEye className="h-4 w-4 mr-1" />
            <span>{room.views || 0}</span>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <FiMapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="text-sm truncate">{room.location?.address}, {room.location?.city}</span>
        </div>

        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FiUsers className="h-4 w-4 mr-1 text-gray-500" />
              <span>{room.specifications?.occupancy?.maximum || 1} people</span>
            </div>
            <div className="flex items-center">
              <FiStar className="h-4 w-4 mr-1 text-yellow-500" />
              <span>{room.ratings?.average?.toFixed(1) || 'New'}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {room.messDetails?.messType && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${room.messDetails.messType === 'vegetarian'
                  ? 'bg-green-100 text-green-700'
                  : room.messDetails.messType === 'non-vegetarian'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                {room.messDetails.messType}
              </span>
            )}
          </div>
        </div>

        {/* Meal Plans */}
        {room.messDetails?.mealPlans?.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-700 mb-2">Meal Plans:</p>
            <div className="flex flex-wrap gap-1">
              {room.messDetails.mealPlans.slice(0, 2).map((plan, index) => (
                <span key={index} className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-full">
                  {plan.name} - ₹{plan.price}
                </span>
              ))}
              {room.messDetails.mealPlans.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{room.messDetails.mealPlans.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Amenities */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {room.amenities?.slice(0, 4).map((amenity, index) => {
              const getAmenityIcon = (amenity) => {
                switch (amenity) {
                  case 'wifi': return <FiWifi className="h-3 w-3" />;
                  case 'security': return <FiShield className="h-3 w-3" />;
                  case 'ac': return <FiHome className="h-3 w-3" />;
                  default: return <FiCoffee className="h-3 w-3" />;
                }
              };

              return (
                <div key={index} className="flex items-center space-x-1 px-2 py-1 bg-gray-50 rounded-md">
                  {getAmenityIcon(amenity)}
                  <span className="text-xs text-gray-600 capitalize">{amenity.replace('_', ' ')}</span>
                </div>
              );
            })}
            {room.amenities?.length > 4 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-md">
                +{room.amenities.length - 4} more
              </span>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          <Link
            to={`/rooms/${room._id}`}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors"
          >
            View Details
          </Link>
          <button className="px-4 py-2 border border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg transition-colors">
            Contact
          </button>
        </div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-red-600 mb-4">Error loading rooms: {error.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find Your Perfect Mess Room
          </h1>
          <p className="text-gray-600">
            Browse through verified mess accommodations with quality food and comfortable living
          </p>
        </div>

        {/* Enhanced Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by mess name, location, cuisine..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiFilter className="h-4 w-4 mr-2" />
              Filters
              <FiChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="City, Area"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={filters.roomType}
                    onChange={(e) => handleFilterChange('roomType', e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="single">Single Room</option>
                    <option value="shared">Shared Room</option>
                    <option value="family">Family Room</option>
                    <option value="studio">Studio</option>
                    <option value="apartment">Apartment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mess Type</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    value={filters.messType}
                    onChange={(e) => handleFilterChange('messType', e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="non-vegetarian">Non-Vegetarian</option>
                    <option value="both">Both</option>
                    <option value="jain">Jain</option>
                    <option value="vegan">Vegan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      value={filters.minRent}
                      onChange={(e) => handleFilterChange('minRent', e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      value={filters.maxRent}
                      onChange={(e) => handleFilterChange('maxRent', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Cuisine Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Cuisine Preferences</label>
                <div className="flex flex-wrap gap-2">
                  {['north-indian', 'south-indian', 'gujarati', 'punjabi', 'bengali', 'chinese', 'continental'].map(cuisine => (
                    <button
                      key={cuisine}
                      onClick={() => handleArrayFilterChange('cuisine', cuisine)}
                      className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${filters.cuisine.includes(cuisine)
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {cuisine.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Clear All Filters
                </button>

                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    handleFilterChange('sortBy', sortBy);
                    handleFilterChange('sortOrder', sortOrder);
                  }}
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="rent.monthly-asc">Price: Low to High</option>
                  <option value="rent.monthly-desc">Price: High to Low</option>
                  <option value="ratings.average-desc">Highest Rated</option>
                  <option value="views-desc">Most Viewed</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm animate-pulse overflow-hidden">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-5">
                  <div className="h-4 bg-gray-300 rounded mb-3"></div>
                  <div className="h-3 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-4"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : rooms.length > 0 ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                <span className="font-semibold">{pagination.total || 0}</span> mess rooms found
              </p>
              <div className="text-sm text-gray-500">
                Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  {[...Array(Math.min(pagination.pages, 5))].map((_, index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        key={pageNum}
                        className={`px-4 py-2 rounded-lg font-medium ${pageNum === pagination.page
                            ? 'bg-orange-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiHome className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No rooms found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search criteria or filters</p>
            <button
              onClick={clearFilters}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;
