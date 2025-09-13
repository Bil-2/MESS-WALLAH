import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MapPin, Star, Heart, Eye, Calendar, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { roomsAPI } from '../utils/api';
import InteractivePropertyCard from '../components/InteractivePropertyCard';
import SubscriptionBooking from '../components/SubscriptionBooking';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Rooms = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    minRent: '',
    maxRent: '',
    roomType: '',
    amenities: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch rooms data
  useEffect(() => {
    fetchRooms();
  }, [currentPage, filters]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 12,
        ...filters
      };

      const response = await roomsAPI.getRooms(params);
      setRooms(response.data.data.rooms || []);
      setTotalPages(response.data.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      // Fallback to mock data for demo
      setRooms(generateMockRooms());
      toast.error('Failed to load rooms. Showing demo data.');
    } finally {
      setLoading(false);
    }
  };

  // Generate mock rooms for demo
  const generateMockRooms = () => {
    return [
      {
        _id: '1',
        title: 'Cozy Student Room near College',
        location: 'Koramangala, Bangalore',
        rent: 8500,
        rating: 4.5,
        ownerName: 'Rajesh Kumar',
        verified: true,
        amenities: ['wifi', 'mess', 'security', 'laundry']
      },
      {
        _id: '2',
        title: 'Modern Mess Accommodation',
        location: 'Whitefield, Bangalore',
        rent: 7200,
        rating: 4.2,
        ownerName: 'Priya Sharma',
        verified: true,
        amenities: ['wifi', 'mess', 'parking']
      },
      {
        _id: '3',
        title: 'Premium PG with All Facilities',
        location: 'HSR Layout, Bangalore',
        rent: 12000,
        rating: 4.8,
        ownerName: 'Amit Patel',
        verified: true,
        amenities: ['wifi', 'mess', 'security', 'gym', 'laundry']
      }
    ];
  };

  const handleBooking = (room) => {
    if (!user) {
      toast.error('Please login to book a room');
      return;
    }
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  const handleViewDetails = (room) => {
    // Navigate to room details page
    window.location.href = `/rooms/${room._id}`;
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      minRent: '',
      maxRent: '',
      roomType: '',
      amenities: []
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Find Your Perfect Room
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover comfortable and affordable accommodation options
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by location, college, or area..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-200 dark:border-gray-700 pt-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="Enter location"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Min Rent
                    </label>
                    <input
                      type="number"
                      placeholder="₹0"
                      value={filters.minRent}
                      onChange={(e) => handleFilterChange('minRent', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Max Rent
                    </label>
                    <input
                      type="number"
                      placeholder="₹50000"
                      value={filters.maxRent}
                      onChange={(e) => handleFilterChange('maxRent', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2 text-purple-600 border border-purple-600 rounded-md hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" text="Finding perfect rooms for you..." />
          </div>
        )}

        {/* Rooms Grid */}
        {!loading && (
          <>
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600 dark:text-gray-400">
                {rooms.length} rooms found
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {rooms.map((room, index) => (
                  <InteractivePropertyCard
                    key={room._id}
                    room={room}
                    onBooking={() => handleBooking(room)}
                    onViewDetails={() => handleViewDetails(room)}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Empty State */}
            {rooms.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No rooms found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search criteria or filters
                </p>
                <button
                  onClick={clearFilters}
                  className="btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Previous
                  </button>

                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-4 py-2 rounded-md transition-colors ${currentPage === index + 1
                          ? 'bg-purple-600 text-white'
                          : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Subscription Booking Modal */}
        {showBookingModal && selectedRoom && (
          <SubscriptionBooking
            room={selectedRoom}
            onClose={() => {
              setShowBookingModal(false);
              setSelectedRoom(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Rooms;
