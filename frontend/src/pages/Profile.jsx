import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { 
  User, Mail, Phone, MapPin, Edit3, Save, X, Camera,
  Shield, Key, Star, Home, CreditCard, Heart, 
  CheckCircle, Eye, EyeOff, Calendar, Clock,
  Settings, Bell, Lock, Smartphone, Trash2,
  Download, Upload, RefreshCw, TrendingUp, Zap,
  Monitor, Database, Server
} from '../utils/iconMappings';

// Password Change Form Component
const PasswordChangeForm = ({ onSubmit, onCancel, loading }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(passwordData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg mt-4"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type={showPassword.current ? "text" : "password"}
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handleInputChange}
            placeholder="Current Password"
            required
            className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-600 dark:text-white"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('current')}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        
        <div className="relative">
          <input
            type={showPassword.new ? "text" : "password"}
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handleInputChange}
            placeholder="New Password"
            required
            className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-600 dark:text-white"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('new')}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        
        <div className="relative">
          <input
            type={showPassword.confirm ? "text" : "password"}
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm New Password"
            required
            className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-600 dark:text-white"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility('confirm')}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        
        <div className="flex space-x-2">
          <button 
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
          <button 
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout, loading: authLoading } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [authChecked, setAuthChecked] = useState(false);

  // Redirect to login if not authenticated (after auth check is complete)
  useEffect(() => {
    if (!authLoading) {
      setAuthChecked(true);
      if (!user) {
        toast.error('Please login to view your profile');
        navigate('/login');
      }
    }
  }, [user, authLoading, navigate]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  // Get user initials (first letter of first name + first letter of last name)
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    
    const fullName = user.name.trim();
    const words = fullName.split(/\s+/).filter(word => word.length > 0);
    
    if (words.length === 0) return 'U';
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    
    // Get first letter of first word and first letter of last word
    const firstInitial = words[0].charAt(0).toUpperCase();
    const lastInitial = words[words.length - 1].charAt(0).toUpperCase();
    return firstInitial + lastInitial;
  };
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    city: '',
    state: ''
  });

  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    favoriteRooms: 0,
    memberSince: new Date().getFullYear(),
    activeBookings: 0,
    reviewsGiven: 0,
    averageRating: 0,
    lastActivity: new Date()
  });

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'booking', message: 'Booked a room in Mumbai', time: '2 hours ago', icon: Home },
    { id: 2, type: 'review', message: 'Left a review for Sunrise PG', time: '1 day ago', icon: Star },
    { id: 3, type: 'favorite', message: 'Added room to favorites', time: '3 days ago', icon: Heart },
    { id: 4, type: 'profile', message: 'Updated profile information', time: '1 week ago', icon: User }
  ]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        bio: user.profile?.bio || '',
        city: user.profile?.city || '',
        state: user.profile?.state || ''
      });
      
      setStats({
        totalBookings: user.stats?.totalBookings || 8,
        totalSpent: user.stats?.totalSpent || 45000,
        favoriteRooms: user.stats?.favoriteRooms || 12,
        memberSince: user.createdAt ? new Date(user.createdAt).getFullYear() : 2024,
        activeBookings: user.stats?.activeBookings || 2,
        reviewsGiven: user.stats?.reviewsGiven || 6,
        averageRating: user.stats?.averageRating || 4.8,
        lastActivity: user.stats?.lastActivity || new Date()
      });
      
      // Calculate profile completion
      const fields = ['name', 'email', 'phone', 'bio', 'city', 'state'];
      const completedFields = fields.filter(field => {
        if (field === 'bio') return user.profile?.bio;
        if (field === 'city') return user.profile?.city;
        if (field === 'state') return user.profile?.state;
        return user[field];
      }).length;
      setProfileCompletion(Math.round((completedFields / fields.length) * 100));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await updateProfile(formData);
      if (result && result.success) {
        setEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        throw new Error(result?.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (passwordData) => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      // Call the actual API to change password
      const response = await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.data.success) {
        toast.success('Password changed successfully!');
        setShowPasswordChange(false);
      } else {
        toast.error(response.data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password change error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to change password';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setLoading(true);
    try {
      // Simulate upload for demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      const imageUrl = URL.createObjectURL(file);
      toast.success('Profile picture updated successfully!');
      console.log('Profile picture preview:', imageUrl);
    } catch (error) {
      toast.error('Failed to upload profile picture');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Zap },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'bookings', label: 'Bookings', icon: Home },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  // If no user after loading, don't render (will redirect)
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-8">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
            <span className="text-gray-900 dark:text-white font-medium">Updating...</span>
          </div>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Enhanced Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          <div className="relative">
            <div className="bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 h-32 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-4 right-4 flex space-x-2">
                <span className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm font-medium">
                  MESS WALLAH Profile
                </span>
                <span className="bg-green-500/80 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm font-medium flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </span>
              </div>
              {/* Floating elements */}
              <div className="absolute top-8 left-8 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 right-16 w-8 h-8 bg-white/20 rounded-full animate-bounce"></div>
            </div>
            
            <div className="relative px-6 pb-6">
              <div className="flex flex-col lg:flex-row items-start lg:items-end -mt-16 relative z-10">
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl bg-white dark:bg-gray-700 border-4 border-white shadow-2xl flex items-center justify-center overflow-hidden">
                    {user?.profilePicture ? (
                      <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center">
                        <span className="text-5xl font-bold text-white">
                          {getUserInitials()}
                        </span>
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-2 right-2 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-xl shadow-lg transition-all duration-200 cursor-pointer hover:scale-110">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      className="hidden"
                    />
                  </label>
                  {/* Profile completion ring */}
                  <div className="absolute -top-2 -right-2">
                    <div className="relative w-12 h-12">
                      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-gray-300"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="transparent"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-green-500"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeDasharray={`${profileCompletion}, 100`}
                          strokeLinecap="round"
                          fill="transparent"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{profileCompletion}%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 lg:mt-0 lg:ml-8 flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {user?.name || 'User Name'}
                      </h1>
                      <p className="text-lg text-gray-600 dark:text-gray-300 mb-3">{user?.email}</p>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          <Calendar className="w-4 h-4 mr-1" />
                          Member since {stats.memberSince}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          <Star className="w-4 h-4 mr-1" />
                          {stats.averageRating} Rating
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          {stats.totalBookings} Bookings
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-3">
                      {!editing ? (
                        <>
                          <button
                            onClick={() => setEditing(true)}
                            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            <Edit3 className="w-5 h-5 mr-2" />
                            Edit Profile
                          </button>
                          <button 
                            onClick={handleLogout}
                            className="inline-flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            <Lock className="w-5 h-5 mr-2" />
                            Logout
                          </button>
                        </>
                      ) : (
                        <div className="flex space-x-3">
                          <button
                            onClick={handleSave}
                            disabled={loading}
                            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 shadow-lg"
                          >
                            <Save className="w-5 h-5 mr-2" />
                            {loading ? 'Saving...' : 'Save Changes'}
                          </button>
                          <button
                            onClick={() => setEditing(false)}
                            className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
                          >
                            <X className="w-5 h-5 mr-2" />
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            { 
              icon: Home, 
              label: 'Total Bookings', 
              value: stats.totalBookings, 
              subValue: `${stats.activeBookings} active`,
              color: 'blue',
              gradient: 'from-blue-500 to-cyan-500'
            },
            { 
              icon: CreditCard, 
              label: 'Total Spent', 
              value: `₹${stats.totalSpent.toLocaleString()}`, 
              subValue: 'This year',
              color: 'green',
              gradient: 'from-green-500 to-emerald-500'
            },
            { 
              icon: Heart, 
              label: 'Favorites', 
              value: stats.favoriteRooms, 
              subValue: 'Saved rooms',
              color: 'pink',
              gradient: 'from-pink-500 to-rose-500'
            },
            { 
              icon: Star, 
              label: 'Rating', 
              value: stats.averageRating, 
              subValue: `${stats.reviewsGiven} reviews`,
              color: 'purple',
              gradient: 'from-purple-500 to-indigo-500'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              <div className="p-6 relative">
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full transform translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-500`}></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{stat.subValue}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                    <div className={`mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
                      <div className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transform origin-left scale-x-75 group-hover:scale-x-100 transition-transform duration-500`}></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <nav className="flex space-x-1 px-6 py-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg transform scale-105'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account Overview</h3>
                    
                    {/* Profile Completion */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Completion</h4>
                          <p className="text-gray-600 dark:text-gray-400">Complete your profile to get better recommendations</p>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{profileCompletion}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-1000"
                          style={{ width: `${profileCompletion}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <Zap className="w-5 h-5 mr-2 text-orange-500" />
                          Recent Activity
                        </h4>
                        <div className="space-y-4">
                          {recentActivity.map((activity) => {
                            const Icon = activity.icon;
                            return (
                              <motion.div
                                key={activity.id}
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:shadow-md transition-all duration-200"
                              >
                                <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg mr-4">
                                  <Icon className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.message}</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                          <Settings className="w-5 h-5 mr-2 text-purple-500" />
                          Quick Actions
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { icon: Home, label: 'Browse Rooms', color: 'blue' },
                            { icon: Heart, label: 'My Favorites', color: 'pink' },
                            { icon: Calendar, label: 'My Bookings', color: 'green' },
                            { icon: Settings, label: 'Settings', color: 'purple' }
                          ].map((action) => {
                            const Icon = action.icon;
                            return (
                              <motion.button
                                key={action.label}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`p-4 bg-${action.color}-50 dark:bg-${action.color}-900/20 rounded-xl hover:shadow-lg transition-all duration-200 group`}
                              >
                                <Icon className={`w-6 h-6 text-${action.color}-600 dark:text-${action.color}-400 mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                                <p className={`text-sm font-medium text-${action.color}-700 dark:text-${action.color}-300`}>{action.label}</p>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'Full Name', name: 'name', type: 'text', editable: true },
                      { label: 'Email', name: 'email', type: 'email', editable: false },
                      { label: 'Phone', name: 'phone', type: 'tel', editable: false },
                      { label: 'City', name: 'city', type: 'text', editable: true },
                      { label: 'State', name: 'state', type: 'text', editable: true }
                    ].map((field) => (
                      <div key={field.name} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          {field.label}
                        </label>
                        {editing && field.editable ? (
                          <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                          />
                        ) : (
                          <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50 px-4 py-3 rounded-xl">
                            {formData[field.name] || 'Not provided'}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                    {editing ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                        placeholder="Tell us about yourself..."
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700/50 px-4 py-3 rounded-xl">
                        {formData.bio || 'No bio provided'}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'bookings' && (
                <motion.div
                  key="bookings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Bookings</h3>
                  <div className="text-center py-12">
                    <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Your booking history will appear here</p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-6 border border-gray-200 dark:border-gray-600 rounded-2xl hover:shadow-lg transition-all duration-200">
                      <div className="flex items-center">
                        <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-xl mr-4">
                          <Key className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">Password</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Keep your account secure with a strong password</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setShowPasswordChange(!showPasswordChange)}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium transition-colors"
                      >
                        Change Password
                      </button>
                    </div>
                    
                    {showPasswordChange && (
                      <PasswordChangeForm 
                        onSubmit={handlePasswordChange}
                        onCancel={() => setShowPasswordChange(false)}
                        loading={loading}
                      />
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Account Settings</h3>
                  <div className="space-y-4">
                    {[
                      { icon: Bell, title: 'Notifications', description: 'Manage your notification preferences', action: 'Configure' },
                      { icon: Monitor, title: 'Language', description: 'Choose your preferred language', action: 'Change' },
                      { icon: Smartphone, title: 'Two-Factor Authentication', description: 'Add an extra layer of security', action: 'Enable' },
                      { icon: Download, title: 'Export Data', description: 'Download your account data', action: 'Export' },
                      { icon: Trash2, title: 'Delete Account', description: 'Permanently delete your account', action: 'Delete', danger: true }
                    ].map((setting) => {
                      const Icon = setting.icon;
                      return (
                        <div key={setting.title} className={`flex items-center justify-between p-6 border rounded-2xl hover:shadow-lg transition-all duration-200 ${
                          setting.danger 
                            ? 'border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700' 
                            : 'border-gray-200 dark:border-gray-600'
                        }`}>
                          <div className="flex items-center">
                            <div className={`p-3 rounded-xl mr-4 ${
                              setting.danger 
                                ? 'bg-red-100 dark:bg-red-900/50' 
                                : 'bg-blue-100 dark:bg-blue-900/50'
                            }`}>
                              <Icon className={`w-6 h-6 ${
                                setting.danger 
                                  ? 'text-red-600 dark:text-red-400' 
                                  : 'text-blue-600 dark:text-blue-400'
                              }`} />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">{setting.title}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{setting.description}</p>
                            </div>
                          </div>
                          <button className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                            setting.danger
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }`}>
                            {setting.action}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
