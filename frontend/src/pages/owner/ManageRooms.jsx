import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';
import PricingSuggestion from '../../components/owner/PricingSuggestion';

const ManageRooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [showPricingFor, setShowPricingFor] = useState(null);

  useEffect(() => {
    fetchMyRooms();
  }, []);

  const fetchMyRooms = async () => {
    try {
      // TODO: Implement API call to fetch owner's rooms
      // For now, showing empty state
      setRooms([]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to load rooms');
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (roomId, currentStatus) => {
    try {
      // TODO: API call to toggle availability
      toast.success(`Room ${currentStatus ? 'marked unavailable' : 'marked available'}`);
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!confirm('Are you sure you want to delete this room listing?')) return;

    try {
      // TODO: API call to delete room
      toast.success('Room deleted successfully');
      fetchMyRooms();
    } catch (error) {
      toast.error('Failed to delete room');
    }
  };

  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6">
        <Plus className="w-12 h-12 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        No Rooms Listed Yet
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
        Start earning by listing your first property. It only takes a few minutes!
      </p>
      <button
        onClick={() => navigate('/owner/rooms/new')}
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
      >
        <Plus className="w-5 h-5" />
        Add Your First Room
      </button>
    </div>
  );

  const RoomCard = ({ room }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
      {/* Room Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="absolute top-3 right-3 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${room.isAvailable
            ? 'bg-green-500 text-white'
            : 'bg-gray-500 text-white'
            }`}>
            {room.isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white text-center">
            <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm opacity-75">Photo upload coming soon</p>
          </div>
        </div>
      </div>

      {/* Room Info */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate">
          {room.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
          {room.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ₹{room.rentPerMonth?.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">per month</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {room.bookings || 0} Bookings
            </p>
            <p className="text-xs text-gray-500">
              {room.views || 0} views
            </p>
          </div>
        </div>

        {/* Smart Pricing Suggestion */}
        {showPricingFor === room._id && (
          <PricingSuggestion
            roomId={room._id}
            currentPrice={room.rentPerMonth}
            onClose={() => setShowPricingFor(null)}
          />
        )}

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleToggleAvailability(room._id, room.isAvailable)}
            className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            {room.isAvailable ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
            {room.isAvailable ? 'Disable' : 'Enable'}
          </button>
          <button
            onClick={() => setShowPricingFor(showPricingFor === room._id ? null : room._id)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors"
          >
            💡 Pricing
          </button>
          <button
            onClick={() => toast.info('Edit functionality coming soon!')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteRoom(room._id)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/owner-dashboard')}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                My Listings
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your room listings and availability
              </p>
            </div>
            <button
              onClick={() => navigate('/owner/rooms/new')}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Add New Room
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : rooms.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <EmptyState />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageRooms;
