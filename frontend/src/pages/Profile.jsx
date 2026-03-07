import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  User, Mail, Phone, MapPin, Edit3, Save, X, Camera, Key, Home, Heart,
  CheckCircle, Eye, EyeOff,
  Settings, Lock, Zap
} from 'lucide-react';
import api from '../utils/api';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout, loading: authLoading } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);

  // Password Change State
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });

  // Profile Form State
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', bio: '', city: '', state: '' });

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please login to view your profile');
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Load User Data
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

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const words = user.name.trim().split(/\s+/).filter(word => word.length > 0);
    if (words.length === 0) return 'U';
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return words[0].charAt(0).toUpperCase() + words[words.length - 1].charAt(0).toUpperCase();
  };

  const handleSaveProfile = async () => {
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
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
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
      const response = await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      if (response.data.success) {
        toast.success('Password changed successfully!');
        setShowPasswordChange(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(response.data.message || 'Failed to change password');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] dark:bg-gray-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: Zap },
    { id: 'profile', label: 'My Info', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-gray-900 pt-24 pb-12 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-orange-200/30 via-pink-200/20 to-transparent dark:from-orange-900/20 dark:via-pink-900/10 blur-3xl -z-10"></div>

      <div className="max-w-5xl mx-auto">

        {/* Massive Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-3xl rounded-[3rem] p-8 md:p-12 mb-8 shadow-2xl border border-white/50 dark:border-gray-700/50 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden"
        >
          {/* Circular Decorative Blur */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-400/10 to-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Avatar Section */}
          <div className="relative z-10">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 p-1 shadow-2xl relative">
              <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl font-black bg-gradient-to-br from-orange-500 to-pink-600 bg-clip-text text-transparent">
                    {getUserInitials()}
                  </span>
                )}
              </div>
              <label className="absolute bottom-2 right-2 p-3 bg-white dark:bg-gray-700 rounded-full shadow-xl cursor-pointer hover:scale-110 transition-transform text-orange-600 dark:text-orange-400 hover:text-orange-700">
                <Camera className="w-5 h-5" />
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
          </div>

          {/* Info Section */}
          <div className="flex-1 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-bold mb-4 shadow-sm">
              <CheckCircle className="w-4 h-4" />
              Verified {user.role === 'owner' ? 'Owner' : 'Student'}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
              {user?.name || 'User Name'}
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 font-medium mb-6">
              {user?.email}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {!editing ? (
                <>
                  <button onClick={() => setEditing(true)} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <Edit3 className="w-4 h-4" /> Edit Profile
                  </button>
                  <button onClick={handleLogout} className="flex items-center gap-2 bg-red-50 text-red-600 dark:bg-red-900/10 dark:text-red-400 px-6 py-3 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors">
                    <Lock className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <button onClick={handleSaveProfile} disabled={loading} className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50">
                    <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button onClick={() => setEditing(false)} disabled={loading} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <X className="w-4 h-4" /> Cancel
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Profile Completion Circle */}
          <div className="hidden lg:flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 z-10 w-48">
            <div className="relative w-24 h-24 mb-3">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-gray-200 dark:text-gray-700" stroke="currentColor" strokeWidth="3" fill="transparent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-orange-500" stroke="currentColor" strokeWidth="3" strokeDasharray={`${profileCompletion}, 100`} strokeLinecap="round" fill="transparent" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xl font-black text-gray-900 dark:text-white">
                {profileCompletion}%
              </div>
            </div>
            <span className="text-sm font-bold text-gray-500 text-center">Profile Setup</span>
          </div>
        </motion.div>

        {/* Dynamic Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Navigation Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-3xl rounded-[2rem] p-4 shadow-xl border border-white/50 dark:border-gray-700/50 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible sticky top-28">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-bold transition-all whitespace-nowrap ${isActive
                      ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/20'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                      }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Panels */}
          <div className="lg:col-span-9">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-white/50 dark:border-gray-700/50 min-h-[500px]">
              <AnimatePresence mode="wait">

                {/* DASHBOARD TAB */}
                {activeTab === 'overview' && (
                  <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Hello, {user.name.split(' ')[0]} 👋</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 font-medium">Here&apos;s a quick summary of your account.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <button onClick={() => navigate('/favorites')} className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/10 dark:to-rose-900/10 rounded-3xl p-8 border border-pink-100 dark:border-pink-900/30 text-left hover:shadow-lg transition-all group">
                        <div className="w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                          <Heart className="w-7 h-7 text-pink-500 fill-pink-500/20" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Saved Rooms</h3>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">View the accommodations you&apos;ve bookmarked.</p>
                      </button>

                      <button onClick={() => navigate('/bookings')} className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-3xl p-8 border border-blue-100 dark:border-blue-900/30 text-left hover:shadow-lg transition-all group">
                        <div className="w-14 h-14 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                          <Home className="w-7 h-7 text-blue-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">My Bookings</h3>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">Manage your active leases and payments.</p>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* PROFILE TAB */}
                {activeTab === 'profile' && (
                  <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8">Personal Information</h2>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { label: 'Full Legal Name', name: 'name', icon: User, type: 'text', readOnly: !editing },
                          { label: 'Email Address', name: 'email', icon: Mail, type: 'email', readOnly: true },
                          { label: 'Phone Number', name: 'phone', icon: Phone, type: 'tel', readOnly: true },
                          { label: 'Current City', name: 'city', icon: MapPin, type: 'text', readOnly: !editing },
                          { label: 'State/Province', name: 'state', icon: MapPin, type: 'text', readOnly: !editing }
                        ].map((field) => (
                          <div key={field.name}>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{field.label}</label>
                            <div className="relative">
                              <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                                readOnly={field.readOnly}
                                className={`w-full pl-12 pr-4 py-4 rounded-2xl font-medium transition-all ${field.readOnly ? 'bg-gray-50 dark:bg-gray-900 text-gray-500 border-transparent outline-none' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20'}`}
                                placeholder={`Enter ${field.label.toLowerCase()}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Short Bio</label>
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          readOnly={!editing}
                          rows={4}
                          className={`w-full p-4 rounded-2xl font-medium resize-none transition-all ${!editing ? 'bg-gray-50 dark:bg-gray-900 text-gray-500 border-transparent outline-none' : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20'}`}
                          placeholder="Write a few sentences about yourself..."
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SETTINGS TAB */}
                {activeTab === 'settings' && (
                  <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">

                    <div className="bg-[#1A202C] dark:bg-[#1A202C] rounded-[2rem] p-6 md:p-8 border border-gray-800">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-900/50 rounded-2xl flex items-center justify-center border border-gray-800">
                            <Key className="w-5 h-5 text-orange-500" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">Password</h3>
                            <p className="text-sm text-gray-400 font-medium">Last changed recently</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowPasswordChange(!showPasswordChange)}
                          className="px-6 py-2.5 bg-transparent hover:bg-white/5 text-white border-2 border-blue-500/50 hover:border-blue-400 rounded-xl font-bold transition-all whitespace-nowrap"
                        >
                          Update Password
                        </button>
                      </div>

                      <AnimatePresence>
                        {showPasswordChange && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <form onSubmit={handlePasswordChangeSubmit} className="pt-6 mt-6 border-t border-gray-800 space-y-4">
                              {[
                                { id: 'current', label: 'Current Password', value: passwordData.currentPassword, key: 'currentPassword' },
                                { id: 'new', label: 'New Password', value: passwordData.newPassword, key: 'newPassword' },
                                { id: 'confirm', label: 'Confirm New Password', value: passwordData.confirmPassword, key: 'confirmPassword' }
                              ].map((field) => (
                                <div key={field.id}>
                                  <label className="block text-sm font-bold text-white mb-2">{field.label}</label>
                                  <div className="relative">
                                    <input
                                      type={showPassword[field.id] ? "text" : "password"}
                                      value={field.value}
                                      onChange={(e) => setPasswordData({ ...passwordData, [field.key]: e.target.value })}
                                      required
                                      className="w-full px-4 py-4 rounded-xl bg-gray-900/50 border border-gray-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-white font-medium placeholder-gray-700"
                                      placeholder="••••••••"
                                      title="Please fill in this field."
                                    />
                                    <button type="button" onClick={() => setShowPassword({ ...showPassword, [field.id]: !showPassword[field.id] })} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                                      {showPassword[field.id] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                  </div>
                                </div>
                              ))}
                              <div className="flex gap-4 pt-4">
                                <button type="submit" disabled={loading} className="flex-1 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50">
                                  {loading ? 'Securing...' : 'Set New Password'}
                                </button>
                                <button type="button" onClick={() => setShowPasswordChange(false)} className="px-6 py-4 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 border border-gray-700 transition-colors">
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
