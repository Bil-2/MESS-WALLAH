import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  User, Mail, Phone, MapPin, Calendar, Edit3, Save, X, Camera,
  Shield, Bell, Key, Star, Home, CreditCard, TrendingUp, Heart, 
  Clock, CheckCircle, Eye, EyeOff, Settings, Download, Upload
} from 'lucide-react';

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
      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
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
  const { user, updateProfile } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', bio: '', city: '', state: '',
    dateOfBirth: '', gender: '', occupation: '',
    emergencyContact: { name: '', phone: '', relation: '' }
  });

  const [stats, setStats] = useState({
    totalBookings: 0, totalSpent: 0, favoriteRooms: 0, memberSince: '',
    completedBookings: 0, activeBookings: 0, reviewsGiven: 0
  });

  const [profileCompletion, setProfileCompletion] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);
  const [backendStatus, setBackendStatus] = useState('checking');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    marketing: false
  });
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    currency: 'INR',
    timezone: 'Asia/Kolkata'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '', email: user.email || '', phone: user.phone || '',
        bio: user.profile?.bio || '', city: user.profile?.city || '',
        state: user.profile?.state || '', dateOfBirth: user.profile?.dateOfBirth || '',
        gender: user.profile?.gender || '', occupation: user.profile?.occupation || '',
        emergencyContact: user.profile?.emergencyContact || { name: '', phone: '', relation: '' }
      });
      
      setStats({
        totalBookings: user.stats?.totalBookings || 3,
        totalSpent: user.stats?.totalSpent || 25000,
        favoriteRooms: user.stats?.favoriteRooms || 5,
        memberSince: user.createdAt ? new Date(user.createdAt).getFullYear() : 2024,
        completedBookings: 2, activeBookings: 1, reviewsGiven: 3
      });

      // Calculate profile completion
      const fields = [user.name, user.email, user.phone, user.profile?.bio, user.profile?.city];
      const completed = fields.filter(f => f && f.trim() !== '').length;
      setProfileCompletion(Math.round((completed / fields.length) * 100));

      setRecentActivity([
        { id: 1, type: 'booking', message: 'Booked Premium PG in Mumbai', time: '2 hours ago', icon: Home },
        { id: 2, type: 'review', message: 'Left 5-star review', time: '1 day ago', icon: Star },
        { id: 3, type: 'favorite', message: 'Added room to favorites', time: '3 days ago', icon: Heart }
      ]);
    }
  }, [user]);

  // Check backend status
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch('/api/test');
        if (response.ok) {
          setBackendStatus('connected');
        } else {
          setBackendStatus('error');
        }
      } catch (error) {
        setBackendStatus('error');
        console.error('Backend connection error:', error);
      }
    };

    checkBackendStatus();
  }, []);

  const handleNotificationChange = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} notifications ${notifications[type] ? 'disabled' : 'enabled'}`);
  };

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
    toast.success('Preferences updated successfully!');
  };

  const exportData = async () => {
    setLoading(true);
    try {
      const userData = {
        profile: formData,
        stats: stats,
        preferences: preferences,
        notifications: notifications,
        recentActivity: recentActivity
      };
      
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `mess-wallah-profile-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Profile data exported successfully!');
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const result = await updateProfile(formData);
      if (result && result.success) {
        setEditing(false);
        toast.success('Profile updated successfully!', {
          duration: 4000,
          position: 'top-right',
        });
      } else {
        throw new Error(result?.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to update profile', {
        duration: 4000,
        position: 'top-right',
      });
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
      // Call API to change password
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Password changed successfully!');
        setShowPasswordChange(false);
      } else {
        throw new Error(result.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password change error:', error);
      toast.error(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setLoading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('profilePicture', file);

      // Upload to backend (will create this endpoint)
      const response = await fetch('/api/auth/upload-profile-picture', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success('Profile picture updated successfully!', {
          duration: 4000,
          position: 'top-right',
        });
        
        // Update user context with new profile picture
        console.log('Profile picture updated:', result.data.profilePicture);
        
      } else {
        throw new Error(result.message || 'Failed to upload profile picture');
      }
      
    } catch (error) {
      console.error('Profile picture upload error:', error);
      
      // Fallback to mock upload for demo purposes
      const imageUrl = URL.createObjectURL(file);
      toast.success('Profile picture preview updated! (Demo mode)', {
        duration: 4000,
        position: 'top-right',
      });
      console.log('Profile picture preview:', imageUrl);
      
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'activity', label: 'Activity', icon: Clock },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'stats', label: 'Statistics', icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 py-8 relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
            <span className="text-gray-900 dark:text-white font-medium">Processing...</span>
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 h-32 relative">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="absolute top-4 right-4 flex space-x-2">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                <span className="text-white text-sm font-medium">
                  Profile {profileCompletion}% Complete
                </span>
              </div>
              <div className={`bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center space-x-1 ${
                backendStatus === 'connected' ? 'text-green-200' : 
                backendStatus === 'error' ? 'text-red-200' : 'text-yellow-200'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  backendStatus === 'connected' ? 'bg-green-400' : 
                  backendStatus === 'error' ? 'bg-red-400' : 'bg-yellow-400'
                }`}></div>
                <span className="text-white text-xs font-medium">
                  {backendStatus === 'connected' ? 'Online' : 
                   backendStatus === 'error' ? 'Offline' : 'Checking...'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16 relative z-10">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-white dark:bg-gray-700 border-4 border-white shadow-lg flex items-center justify-center">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full shadow-lg transition-colors cursor-pointer">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                  />
                </label>
              </div>
              
              <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.name || 'User Name'}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">{user?.email}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </span>
                  <span className="text-sm text-gray-500">Member since {stats.memberSince}</span>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-0 flex space-x-2">
                {!editing ? (
                  <>
                    <button
                      onClick={() => setEditing(true)}
                      className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </button>
                    <button
                      onClick={exportData}
                      disabled={loading}
                      className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                      title="Export Profile Data"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { icon: Home, label: 'Total Bookings', value: stats.totalBookings, color: 'blue' },
            { icon: CreditCard, label: 'Total Spent', value: `₹${stats.totalSpent}`, color: 'green' },
            { icon: Heart, label: 'Favorites', value: stats.favoriteRooms, color: 'pink' },
            { icon: Star, label: 'Reviews Given', value: stats.reviewsGiven, color: 'purple' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className={`p-2 bg-${stat.color}-100 dark:bg-${stat.color}-900 rounded-lg`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
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
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'personal' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Full Name', name: 'name', type: 'text', editable: true },
                    { label: 'Email', name: 'email', type: 'email', editable: false },
                    { label: 'Phone', name: 'phone', type: 'tel', editable: false },
                    { label: 'City', name: 'city', type: 'text', editable: true },
                    { label: 'State', name: 'state', type: 'text', editable: true },
                    { label: 'Occupation', name: 'occupation', type: 'text', editable: true }
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {field.label}
                      </label>
                      {editing && field.editable ? (
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">{formData[field.name] || 'Not provided'}</p>
                      )}
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                  {editing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Tell us about yourself..."
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{formData.bio || 'No bio provided'}</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
                  <div className="flex space-x-2">
                    <button className="inline-flex items-center px-3 py-1.5 text-xs bg-orange-100 hover:bg-orange-200 dark:bg-orange-900 dark:hover:bg-orange-800 text-orange-700 dark:text-orange-300 rounded-lg transition-colors">
                      <Star className="w-3 h-3 mr-1" />
                      Add Review
                    </button>
                    <button className="inline-flex items-center px-3 py-1.5 text-xs bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-lg transition-colors">
                      <Home className="w-3 h-3 mr-1" />
                      Browse Rooms
                    </button>
                  </div>
                </div>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-orange-100 to-pink-100 dark:from-orange-900 dark:to-pink-900 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.activeBookings}</div>
                    <div className="text-xs text-orange-700 dark:text-orange-300">Active Bookings</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.reviewsGiven}</div>
                    <div className="text-xs text-green-700 dark:text-green-300">Reviews Given</div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.favoriteRooms}</div>
                    <div className="text-xs text-purple-700 dark:text-purple-300">Favorites</div>
                  </div>
                </div>

                {/* Activity Timeline */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">Activity Timeline</h4>
                  {recentActivity.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <motion.div 
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                          <Icon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="ml-4 flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.message}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          #{activity.id.toString().padStart(3, '0')}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center">
                      <Key className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Password</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Last changed 30 days ago</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowPasswordChange(!showPasswordChange)}
                      className="text-orange-600 hover:text-orange-700 font-medium"
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
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Preferences & Settings</h3>
                  <button
                    onClick={exportData}
                    disabled={loading}
                    className="inline-flex items-center px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </button>
                </div>
                
                {/* Notification Settings */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Notification Preferences
                  </h4>
                  <div className="space-y-4">
                    {[
                      { key: 'email', label: 'Email Notifications', desc: 'Receive booking confirmations and updates via email' },
                      { key: 'sms', label: 'SMS Notifications', desc: 'Get important alerts via SMS' },
                      { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications for real-time updates' },
                      { key: 'marketing', label: 'Marketing Communications', desc: 'Promotional offers and newsletters' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={notifications[item.key]}
                            onChange={() => handleNotificationChange(item.key)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* App Preferences */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    App Preferences
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Theme
                      </label>
                      <select
                        value={preferences.theme}
                        onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Language
                      </label>
                      <select
                        value={preferences.language}
                        onChange={(e) => handlePreferenceChange('language', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                      >
                        <option value="en">English</option>
                        <option value="hi">हिंदी (Hindi)</option>
                        <option value="bn">বাংলা (Bengali)</option>
                        <option value="ta">தமிழ் (Tamil)</option>
                        <option value="te">తెలుగు (Telugu)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Currency
                      </label>
                      <select
                        value={preferences.currency}
                        onChange={(e) => handlePreferenceChange('currency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                      >
                        <option value="INR">₹ Indian Rupee</option>
                        <option value="USD">$ US Dollar</option>
                        <option value="EUR">€ Euro</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Timezone
                      </label>
                      <select
                        value={preferences.timezone}
                        onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                      >
                        <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                        <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                        <option value="Europe/London">Europe/London (GMT)</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Account Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { title: 'Booking History', value: stats.totalBookings, desc: 'Total bookings made', color: 'orange' },
                    { title: 'Total Spent', value: `₹${stats.totalSpent}`, desc: 'Amount spent on bookings', color: 'green' },
                    { title: 'Active Bookings', value: stats.activeBookings, desc: 'Currently active bookings', color: 'blue' },
                    { title: 'Account Age', value: `${new Date().getFullYear() - stats.memberSince} years`, desc: 'Years as member', color: 'purple' }
                  ].map((stat) => (
                    <motion.div
                      key={stat.title}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">{stat.title}</h4>
                      <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{stat.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
