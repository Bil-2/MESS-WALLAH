import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiSearch, FiTrash2 } from 'react-icons/fi';
import ResponsiveContainer from '../components/ResponsiveContainer';
import ResponsiveRoomCard from '../components/ResponsiveRoomCard';
import { useAuthContext } from '../context/AuthContext';
import api from '../utils/api';

const Favorites = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [favoriteRooms, setFavoriteRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/users/my-favorites');
      if (response.data.success) {
        setFavoriteRooms(response.data.data.rooms || []);
      } else {
        setError('Failed to load favorites');
      }
    } catch (err) {
      console.error('Favorites fetch error:', err);
      setError('Could not load your favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleToggleFavorite = async (roomId) => {
    try {
      await api.post(`/users/favorites/${roomId}`);
      // Remove from UI immediately
      setFavoriteRooms(prev => prev.filter(room => (room._id || room.id) !== roomId));
    } catch (err) {
      console.error('Toggle favorite error:', err);
    }
  };

  const handleClearAll = async () => {
    try {
      // Remove all one by one
      await Promise.all(
        favoriteRooms.map(room => api.delete(`/users/favorites/${room._id || room.id}`))
      );
      setFavoriteRooms([]);
    } catch (err) {
      console.error('Clear all favorites error:', err);
    }
  };

  const handleViewDetails = (roomId) => navigate(`/rooms/${roomId}`);
  const handleBookNow = (roomId) => navigate(`/rooms/${roomId}`);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium mb-4">{error}</p>
          <button
            onClick={fetchFavorites}
            className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
          >
            Try Again
          </button>
        </div>
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
              {favoriteRooms.length} saved accommodation{favoriteRooms.length !== 1 ? 's' : ''}
            </p>
          </motion.div>

          {favoriteRooms.length === 0 ? (
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
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {favoriteRooms.length} room{favoriteRooms.length !== 1 ? 's' : ''} saved
                </span>
                <button
                  type="button"
                  onClick={handleClearAll}
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
                    key={room._id || room.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <ResponsiveRoomCard
                      room={room}
                      onBookNow={handleBookNow}
                      onViewDetails={handleViewDetails}
                      onToggleFavorite={handleToggleFavorite}
                      isFavorite={true}
                    />
                  </motion.div>
                ))}
              </motion.div>

              {/* Bottom Action */}
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
