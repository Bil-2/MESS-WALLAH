import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  User, Mail, Phone, MapPin, Edit3, Save, X, Camera,
  Shield, Key, Star, Home, CreditCard, Heart, 
  CheckCircle, Eye, EyeOff
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
  const { user, updateProfile } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  
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
    memberSince: new Date().getFullYear()
  });

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
        totalBookings: user.stats?.totalBookings || 3,
        totalSpent: user.stats?.totalSpent || 25000,
        favoriteRooms: user.stats?.favoriteRooms || 5,
        memberSince: user.createdAt ? new Date(user.createdAt).getFullYear() : 2024
      });
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
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Password changed successfully!');
      setShowPasswordChange(false);
    } catch (error) {
      console.error('Password change error:', error);
      toast.error('Failed to change password');
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
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield }
  ];

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
        
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 h-24 relative">
            <div className="absolute top-4 right-4">
              <span className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm font-medium">
                MESS WALLAH Profile
              </span>
            </div>
          </div>
          
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-12 relative z-10">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-700 border-4 border-white shadow-lg flex items-center justify-center">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-gray-400" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 text-white p-1.5 rounded-full shadow-lg transition-colors cursor-pointer">
                  <Camera className="w-3 h-3" />
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
                  <button
                    onClick={() => setEditing(true)}
                    className="inline-flex items-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
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

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { icon: Home, label: 'Total Bookings', value: stats.totalBookings, color: 'blue' },
            { icon: CreditCard, label: 'Total Spent', value: `₹${stats.totalSpent.toLocaleString()}`, color: 'green' },
            { icon: Heart, label: 'Favorites', value: stats.favoriteRooms, color: 'pink' },
            { icon: Star, label: 'Reviews', value: '4.8', color: 'purple' }
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

        {/* Tabs */}
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
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: 'Full Name', name: 'name', type: 'text', editable: true },
                    { label: 'Email', name: 'email', type: 'email', editable: false },
                    { label: 'Phone', name: 'phone', type: 'tel', editable: false },
                    { label: 'City', name: 'city', type: 'text', editable: true },
                    { label: 'State', name: 'state', type: 'text', editable: true }
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

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center">
                      <Key className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Password</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Keep your account secure</p>
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
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
