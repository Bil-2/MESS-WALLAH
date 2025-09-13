import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Star,
  Heart,
  TrendingUp,
  Users,
  Wifi,
  Car,
  Utensils,
  Shield,
  Clock,
  Filter,
  Sparkles,
  Target,
  Brain,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

const RecommendationEngine = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [userPreferences, setUserPreferences] = useState({
    budget: { min: 0, max: 50000 },
    location: '',
    roomType: '',
    amenities: [],
    lifestyle: '',
    studyHabits: '',
    socialPreference: '',
    dietaryPreference: ''
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('smart');
  const [showPreferences, setShowPreferences] = useState(false);

  // Lifestyle options for personalization
  const lifestyleOptions = [
    { id: 'early_bird', label: 'Early Bird', icon: '🌅', description: 'Wake up early, sleep early' },
    { id: 'night_owl', label: 'Night Owl', icon: '🦉', description: 'Stay up late, wake up late' },
    { id: 'social', label: 'Social Butterfly', icon: '🦋', description: 'Love meeting new people' },
    { id: 'quiet', label: 'Quiet Type', icon: '🤫', description: 'Prefer peaceful environment' },
    { id: 'fitness', label: 'Fitness Enthusiast', icon: '💪', description: 'Regular exercise routine' },
    { id: 'foodie', label: 'Foodie', icon: '🍽️', description: 'Love good food and cooking' }
  ];

  const studyHabits = [
    { id: 'library', label: 'Library Lover', icon: '📚' },
    { id: 'group_study', label: 'Group Study', icon: '👥' },
    { id: 'quiet_room', label: 'Quiet Room', icon: '🔇' },
    { id: 'music', label: 'Study with Music', icon: '🎵' }
  ];

  const amenityPreferences = [
    { id: 'wifi', label: 'High-Speed WiFi', icon: Wifi, priority: 'high' },
    { id: 'parking', label: 'Parking', icon: Car, priority: 'medium' },
    { id: 'mess', label: 'Mess Facility', icon: Utensils, priority: 'high' },
    { id: 'security', label: '24/7 Security', icon: Shield, priority: 'high' },
    { id: 'laundry', label: 'Laundry', icon: Clock, priority: 'medium' },
    { id: 'gym', label: 'Gym/Fitness', icon: Users, priority: 'low' }
  ];

  // Fetch personalized recommendations
  const fetchRecommendations = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await axios.get('/api/rooms/recommendations', {
        params: {
          userId: user._id,
          preferences: JSON.stringify(userPreferences),
          type: activeTab
        }
      });
      setRecommendations(response.data.recommendations || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Fallback to mock data for demo
      setRecommendations(generateMockRecommendations());
    } finally {
      setLoading(false);
    }
  };

  // Generate mock recommendations for demo
  const generateMockRecommendations = () => {
    const mockRooms = [
      {
        _id: '1',
        title: 'Perfect Match for You!',
        location: 'Koramangala, Bangalore',
        rent: 12000,
        rating: 4.8,
        image: '/api/placeholder/300/200',
        matchScore: 95,
        matchReasons: ['Budget friendly', 'Near IT hubs', 'Great WiFi', 'Quiet environment'],
        amenities: ['wifi', 'mess', 'security', 'laundry'],
        ownerName: 'Rajesh Kumar',
        verified: true,
        trending: true
      },
      {
        _id: '2',
        title: 'Highly Recommended',
        location: 'HSR Layout, Bangalore',
        rent: 15000,
        rating: 4.6,
        image: '/api/placeholder/300/200',
        matchScore: 88,
        matchReasons: ['Great for students', 'Near colleges', 'Social environment'],
        amenities: ['wifi', 'parking', 'gym', 'mess'],
        ownerName: 'Priya Sharma',
        verified: true,
        trending: false
      },
      {
        _id: '3',
        title: 'Budget-Friendly Choice',
        location: 'Marathahalli, Bangalore',
        rent: 8000,
        rating: 4.4,
        image: '/api/placeholder/300/200',
        matchScore: 82,
        matchReasons: ['Within budget', 'Good connectivity', 'Safe area'],
        amenities: ['wifi', 'security', 'mess'],
        ownerName: 'Amit Patel',
        verified: true,
        trending: false
      }
    ];
    return mockRooms;
  };

  // Update user preferences
  const updatePreference = (key, value) => {
    setUserPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Save preferences to backend
  const savePreferences = async () => {
    if (!user) return;

    try {
      await axios.put(`/api/users/${user._id}/preferences`, userPreferences);
      fetchRecommendations();
      setShowPreferences(false);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    }
  }, [user, activeTab]);

  const RecommendationCard = ({ room, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card card-hover relative overflow-hidden group"
    >
      {/* Match Score Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
          <Sparkles className="w-4 h-4" />
          {room.matchScore}% Match
        </div>
      </div>

      {/* Trending Badge */}
      {room.trending && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Trending
          </div>
        </div>
      )}

      {/* Room Image */}
      <div className="relative h-48 bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex items-center gap-1 mb-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{room.rating}</span>
          </div>
        </div>
        <button className="absolute bottom-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
          <Heart className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Room Details */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
              {room.title}
            </h3>
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              {room.location}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              ₹{room.rent.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">per month</div>
          </div>
        </div>

        {/* Match Reasons */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-500" />
            <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              Why it's perfect for you:
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {room.matchReasons.slice(0, 3).map((reason, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full"
              >
                {reason}
              </span>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="flex items-center gap-2 mb-4">
          {room.amenities.slice(0, 4).map((amenity) => {
            const amenityData = amenityPreferences.find(a => a.id === amenity);
            if (!amenityData) return null;
            const IconComponent = amenityData.icon;
            return (
              <div key={amenity} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <IconComponent className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              </div>
            );
          })}
          {room.amenities.length > 4 && (
            <span className="text-sm text-gray-500">+{room.amenities.length - 4} more</span>
          )}
        </div>

        {/* Owner Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {room.ownerName.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {room.ownerName}
              </div>
              {room.verified && (
                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                  <Shield className="w-3 h-3" />
                  Verified Owner
                </div>
              )}
            </div>
          </div>
          <button className="btn-primary text-sm py-2 px-4 flex items-center gap-1">
            View Details
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );

  const PreferencesModal = () => (
    <AnimatePresence>
      {showPreferences && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowPreferences(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Brain className="w-6 h-6 text-purple-500" />
                Personalize Your Experience
              </h2>
              <button
                onClick={() => setShowPreferences(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* Budget Range */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Budget Range
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    value={userPreferences.budget.max}
                    onChange={(e) => updatePreference('budget', {
                      ...userPreferences.budget,
                      max: parseInt(e.target.value)
                    })}
                    className="flex-1"
                  />
                  <span className="text-lg font-bold text-purple-600">
                    ₹{userPreferences.budget.max.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Lifestyle Preferences */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Lifestyle
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {lifestyleOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => updatePreference('lifestyle', option.id)}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${userPreferences.lifestyle === option.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{option.icon}</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {option.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {option.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Study Habits */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Study Habits
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {studyHabits.map((habit) => (
                    <button
                      key={habit.id}
                      onClick={() => updatePreference('studyHabits', habit.id)}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${userPreferences.studyHabits === habit.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                        }`}
                    >
                      <div className="text-lg mb-1">{habit.icon}</div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">
                        {habit.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenity Preferences */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Must-Have Amenities
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {amenityPreferences.map((amenity) => {
                    const IconComponent = amenity.icon;
                    const isSelected = userPreferences.amenities.includes(amenity.id);
                    return (
                      <button
                        key={amenity.id}
                        onClick={() => {
                          const newAmenities = isSelected
                            ? userPreferences.amenities.filter(a => a !== amenity.id)
                            : [...userPreferences.amenities, amenity.id];
                          updatePreference('amenities', newAmenities);
                        }}
                        className={`p-3 rounded-xl border-2 transition-all ${isSelected
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-5 h-5 text-purple-500" />
                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                            {amenity.label}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowPreferences(false)}
                className="btn-ghost flex-1"
              >
                Cancel
              </button>
              <button
                onClick={savePreferences}
                className="btn-primary flex-1"
              >
                Save Preferences
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!user) {
    return (
      <div className="text-center py-12">
        <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Sign in for Personalized Recommendations
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Get AI-powered room suggestions tailored to your preferences and lifestyle
        </p>
        <button className="btn-primary">
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-500" />
            Recommended for You
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            AI-powered suggestions based on your preferences and behavior
          </p>
        </div>
        <button
          onClick={() => setShowPreferences(true)}
          className="btn-secondary flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Customize Preferences
        </button>
      </div>

      {/* Recommendation Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        {[
          { id: 'smart', label: 'Smart Picks', icon: Brain },
          { id: 'trending', label: 'Trending', icon: TrendingUp },
          { id: 'budget', label: 'Budget Friendly', icon: Target }
        ].map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              <IconComponent className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Recommendations Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-2xl" />
              <div className="p-6 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((room, index) => (
            <RecommendationCard key={room._id} room={room} index={index} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && recommendations.length === 0 && (
        <div className="text-center py-12">
          <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No recommendations yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Set your preferences to get personalized room suggestions
          </p>
          <button
            onClick={() => setShowPreferences(true)}
            className="btn-primary"
          >
            Set Preferences
          </button>
        </div>
      )}

      <PreferencesModal />
    </div>
  );
};

export default RecommendationEngine;
