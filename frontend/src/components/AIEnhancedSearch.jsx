import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiMapPin, FiFilter, FiX } from 'react-icons/fi';

const AIEnhancedSearch = ({ onSearch, onFilterChange, className = "" }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [filters, setFilters] = useState({
    city: '',
    priceRange: '',
    roomType: '',
    amenities: []
  });

  // Mock AI suggestions based on search query
  const generateSuggestions = (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const mockSuggestions = [
      { text: `${query} near colleges`, confidence: 95 },
      { text: `${query} with WiFi`, confidence: 88 },
      { text: `${query} for girls`, confidence: 82 },
      { text: `${query} budget friendly`, confidence: 76 }
    ];

    setSuggestions(mockSuggestions.slice(0, 3));
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      generateSuggestions(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery, filters);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const clearFilters = () => {
    const emptyFilters = {
      city: '',
      priceRange: '',
      roomType: '',
      amenities: []
    };
    setFilters(emptyFilters);
    if (onFilterChange) {
      onFilterChange(emptyFilters);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Search Bar */}
      <motion.div 
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center">
          <div className="flex-1 flex items-center px-6 py-4">
            <FiSearch className="text-gray-400 mr-3 text-xl" />
            <input
              type="text"
              placeholder="Search by city, area, or landmark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 bg-transparent text-gray-700 dark:text-gray-300 placeholder-gray-400 outline-none text-lg"
            />
          </div>
          
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-4 text-gray-500 hover:text-orange-500 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiFilter className="text-xl" />
          </motion.button>
          
          <motion.button
            onClick={handleSearch}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Search
          </motion.button>
        </div>

        {/* AI Suggestions */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50"
            >
              <div className="px-6 py-3">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">AI Suggestions:</div>
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setSearchQuery(suggestion.text);
                      setSuggestions([]);
                    }}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors mb-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span>{suggestion.text}</span>
                    <span className="ml-2 text-xs text-green-500">
                      {suggestion.confidence}% confidence
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="mt-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Advanced Filters
              </h3>
              <button
                onClick={clearFilters}
                className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* City Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City
                </label>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Cities</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Price Range
                </label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Any Price</option>
                  <option value="0-5000">Under ₹5,000</option>
                  <option value="5000-10000">₹5,000 - ₹10,000</option>
                  <option value="10000-15000">₹10,000 - ₹15,000</option>
                  <option value="15000+">Above ₹15,000</option>
                </select>
              </div>

              {/* Room Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Room Type
                </label>
                <select
                  value={filters.roomType}
                  onChange={(e) => handleFilterChange('roomType', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="Single">Single Room</option>
                  <option value="Shared">Shared Room</option>
                  <option value="PG">PG</option>
                  <option value="Hostel">Hostel</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIEnhancedSearch;
