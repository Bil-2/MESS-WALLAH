import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiSearch, FiTrash2, FiEye } from 'react-icons/fi';
import ResponsiveContainer from '../components/ResponsiveContainer';
import ResponsiveRoomCard from '../components/ResponsiveRoomCard';
import { useAuthContext } from '../context/AuthContext';

const Favorites = () => {
  const { user } = useAuthContext();
  const [favorites, setFavorites] = useState(new Set());
  const [favoriteRooms, setFavoriteRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('mess-wallah-favorites');
    if (savedFavorites) {
      const favSet = new Set(JSON.parse(savedFavorites));
      setFavorites(favSet);
      
      // For demo purposes, create some mock favorite rooms
      const mockFavoriteRooms = Array.from(favSet).slice(0, 6).map((id, index) => ({
        _id: id,
        id: id,
        title: `Favorite Room ${index + 1}`,
        location: ['Koramangala, Bangalore', 'Whitefield, Bangalore', 'BTM Layout, Bangalore'][index % 3],
        rent: [12000, 15000, 10000][index % 3],
        rating: 4.5 + (index % 3) * 0.2,
        ownerName: ['Rajesh Kumar', 'Priya Sharma', 'Amit Singh'][index % 3],
        ownerPhone: '+91 9876543210',
        verified: true,
        amenities: ['wifi', 'mess', 'security', 'laundry'],
        image: `https://images.unsplash.com/photo-${1522708323590 + index}?w=400&h=300&fit=crop`
      }));
      
      setFavoriteRooms(mockFavoriteRooms);
    }
    setLoading(false);
  }, []);

  const handleToggleFavorite = (roomId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(roomId)) {
      newFavorites.delete(roomId);
      setFavoriteRooms(prev => prev.filter(room => room._id !== roomId));
    } else {
      newFavorites.add(roomId);
    }
    setFavorites(newFavorites);
    localStorage.setItem('mess-wallah-favorites', JSON.stringify([...newFavorites]));
  };

  const handleViewDetails = (roomId) => {
    // Navigate to room details
    window.location.href = `/room/${roomId}`;
  };

  const handleBookNow = (roomId) => {
    // Handle booking
    console.log('Book room:', roomId);
  };

  const clearAllFavorites = () => {
    setFavorites(new Set());
    setFavoriteRooms([]);
    localStorage.removeItem('mess-wallah-favorites');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 pt-20 pb-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <ResponsiveContainer>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <FiHeart className="w-8 h-8 text-red-500" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Favorites</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {favoriteRooms.length} saved accommodations
            </p>
          </motion.div>

        {favoriteRooms.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiHeart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No Favorites Yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Start exploring rooms and tap the heart icon to save your favorite accommodations here.
            </p>
            <motion.a
              href="/rooms"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <FiSearch className="w-5 h-5" />
              Explore Rooms
            </motion.a>
          </motion.div>
        ) : (
          <>
            {/* Actions Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex justify-between items-center mb-8 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {favoriteRooms.length} room{favoriteRooms.length !== 1 ? 's' : ''} saved
                </span>
              </div>
              <button
                onClick={clearAllFavorites}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <FiTrash2 className="w-4 h-4" />
                Clear All
              </button>
            </motion.div>

            {/* Favorites Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {favoriteRooms.map((room, index) => (
                <motion.div
                  key={room._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <ResponsiveRoomCard
                    room={room}
                    onBookNow={handleBookNow}
                    onViewDetails={handleViewDetails}
                    onToggleFavorite={handleToggleFavorite}
                    isFavorite={favorites.has(room._id)}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Bottom Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mt-12"
            >
              <motion.a
                href="/rooms"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <FiSearch className="w-5 h-5" />
                Find More Rooms
              </motion.a>
            </motion.div>
          </>
        )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Favorites;
