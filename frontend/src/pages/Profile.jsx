import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  User, Mail, Phone, MapPin, Save, X, Camera, Key,
  Home, Heart, CheckCircle, Eye, EyeOff, Settings, Lock,
  Building2, Calendar, PlusCircle, BarChart2, BookOpen,
  ShieldCheck, ChevronRight, LogOut, Star, BedDouble, Edit3, Wifi
} from 'lucide-react';
import api from '../utils/api';

/* ─── helpers ──────────────────────────────────────────────────────── */
const getInitials = (name = '') => {
  const w = name.trim().split(/\s+/).filter(Boolean);
  if (!w.length) return 'U';
  if (w.length === 1) return w[0][0].toUpperCase();
  return (w[0][0] + w[w.length - 1][0]).toUpperCase();
};

/* ─── Reusable field row for display ─────────────────────────────── */
const InfoRow = ({ icon: Icon, label, value, color = 'text-blue-500' }) => (
  <div className="group flex items-center gap-4 py-3.5 px-3 hover:bg-gray-50/80 dark:hover:bg-gray-800/40 rounded-2xl transition-all duration-300">
    <div className={`w-11 h-11 rounded-[14px] bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:shadow-md transition-all duration-300`}>
      <Icon className={`w-5 h-5 ${color} group-hover:opacity-100 opacity-80 transition-opacity`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-[15px] font-bold text-gray-800 dark:text-gray-100 truncate group-hover:text-black dark:group-hover:text-white transition-colors">{value || '—'}</p>
    </div>
  </div>
);

/* ─── Sidebar menu item ───────────────────────────────────────────── */
const MenuItem = ({ icon: Icon, iconBg, iconColor, label, onClick }) => (
  <button onClick={onClick}
    className="w-full flex items-center gap-3.5 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all duration-300 group rounded-2xl text-left hover:pr-2">
    <div className={`w-11 h-11 ${iconBg} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:shadow-lg transition-all duration-300`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
    <span className="flex-1 text-[15px] font-bold text-gray-800 dark:text-gray-100 group-hover:translate-x-1 transition-transform duration-300">{label}</span>
    <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-900 dark:group-hover:text-gray-300 transition-colors" />
  </button>
);

const Divider = () => <div className="h-px bg-gray-100 dark:bg-gray-800 mx-4" />;

/* ═══════════════════════════════════════════════════════════════════ */
const Profile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout, loading: authLoading } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', bio: '', city: '', state: '' });

  const isOwner = user?.role === 'owner';
  const initials = getInitials(user?.name);

  useEffect(() => {
    if (!authLoading && !user) { toast.error('Please login'); navigate('/login'); }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '', email: user.email || '', phone: user.phone || '',
        bio: user.profile?.bio || '', city: user.profile?.city || '', state: user.profile?.state || ''
      });
    }
  }, [user]);

  const handleLogout = async () => {
    try { await logout(); toast.success('Logged out'); navigate('/login'); }
    catch { toast.error('Failed to logout'); }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Create backend-friendly payload
      const payload = {
        name: formData.name,
        profile: {
          bio: formData.bio,
          city: formData.city,
          state: formData.state
        }
      };
      
      // Only include email and phone if they are not empty strings to avoid validation errors
      if (formData.email?.trim()) payload.email = formData.email.trim();
      if (formData.phone?.trim()) payload.phone = formData.phone.trim();

      const result = await updateProfile(payload);
      if (result?.success) { setEditing(false); toast.success('Profile updated!'); }
      else throw new Error(result?.message || 'Failed');
    } catch (e) { toast.error(e.message || 'Failed to update profile'); }
    finally { setLoading(false); }
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (passwordData.newPassword.length < 8) { toast.error('Min 8 characters'); return; }
    setLoading(true);
    try {
      const res = await api.put('/auth/change-password', { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
      if (res.data.success) {
        toast.success('Password updated!');
        setShowPasswordChange(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else toast.error(res.data.message || 'Failed');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className={`w-12 h-12 border-4 ${isOwner ? 'border-indigo-500' : 'border-orange-500'} border-t-transparent rounded-full animate-spin`} />
      </div>
    );
  }

  /* ── Owner menus ── */
  const ownerMenus = [
    { icon: Building2, iconBg: 'bg-blue-100 dark:bg-blue-900/30',   iconColor: 'text-blue-500',   label: 'My Listings',     onClick: () => navigate('/owner/rooms') },
    { icon: Calendar,  iconBg: 'bg-teal-100 dark:bg-teal-900/30',   iconColor: 'text-teal-500',   label: 'Manage Bookings', onClick: () => navigate('/owner/bookings') },
    { icon: PlusCircle,iconBg: 'bg-indigo-100 dark:bg-indigo-900/30',iconColor: 'text-indigo-500', label: 'Add New Room',    onClick: () => navigate('/owner/rooms/new') },
    { icon: BarChart2, iconBg: 'bg-purple-100 dark:bg-purple-900/30',iconColor: 'text-purple-500', label: 'Dashboard',       onClick: () => navigate('/owner-dashboard') },
  ];

  /* ── Renter menus ── */
  const renterMenus = [
    { icon: BookOpen, iconBg: 'bg-blue-100 dark:bg-blue-900/30',   iconColor: 'text-blue-500',  label: 'My Bookings', onClick: () => navigate('/bookings') },
    { icon: Heart,    iconBg: 'bg-pink-100 dark:bg-pink-900/30',   iconColor: 'text-pink-500',  label: 'Favorites',   onClick: () => navigate('/favorites') },
  ];

  const menus = isOwner ? ownerMenus : renterMenus;
  const headerGrad = isOwner
    ? 'from-blue-600 via-indigo-600 to-purple-700'
    : 'from-orange-500 via-pink-500 to-purple-600';
  const accentBg = isOwner ? 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40' : 'bg-gradient-to-br from-orange-50/40 via-pink-50/20 to-purple-50/30';
  const accentDark = 'dark:from-gray-950 dark:via-gray-900 dark:to-gray-900';

  return (
    <div className={`min-h-screen ${accentBg} ${accentDark} pt-24 pb-16`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page title ────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-8 pl-2">
          <div>
            <p className={`text-[11px] font-black uppercase tracking-[0.2em] mb-1 ${isOwner ? 'text-indigo-500' : 'text-orange-500'}`}>
              {isOwner ? 'Owner Account' : 'My Account'}
            </p>
            <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
              Profile
            </h1>
          </div>

        </div>

        {/* ── Main grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* ── LEFT: Profile card ──────────────────────────────── */}
          <div className="lg:col-span-4 mx-auto w-full max-w-md lg:max-w-none">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200/50 dark:shadow-black/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-white dark:border-gray-800 lg:sticky lg:top-28">

              {/* Gradient header */}
              <div className={`relative bg-gradient-to-br ${headerGrad} px-6 pt-8 pb-7`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-6 -translate-x-6" />
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: 'radial-gradient(circle at 2px 2px,white 1px,transparent 0)', backgroundSize: '20px 20px' }} />

                <div className="relative z-10 flex items-center gap-4">
                  <div className="relative">
                    <div className="w-18 h-18 w-[72px] h-[72px] rounded-2xl bg-white/25 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center shadow-xl">
                      {user?.profilePicture
                        ? <img src={user.profilePicture} alt="" className="w-full h-full object-cover rounded-2xl" />
                        : <span className="text-2xl font-black text-white">{initials}</span>
                      }
                    </div>
                    <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                      <Camera className={`w-3.5 h-3.5 ${isOwner ? 'text-indigo-600' : 'text-orange-500'}`} />
                      <input type="file" accept="image/*" className="hidden" />
                    </label>
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white leading-tight">{user?.name}</h2>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-white/70 text-sm font-medium">Online</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {isOwner
                        ? <><ShieldCheck className="w-3.5 h-3.5 text-green-300" /><span className="text-xs font-bold text-green-300">Verified Owner</span></>
                        : <><CheckCircle className="w-3.5 h-3.5 text-green-300" /><span className="text-xs font-bold text-green-300">Verified Student</span></>
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-gray-800 py-4 px-1">
                {(isOwner ? [
                  { icon: BedDouble, label: 'Rooms',    value: '—',   color: 'text-blue-500',   fill: false },
                  { icon: Calendar,  label: 'Bookings', value: '—',   color: 'text-teal-500',   fill: false },
                  { icon: Star,      label: 'Rating',   value: '4.8', color: 'text-yellow-400', fill: true  },
                ] : [
                  { icon: Home,  label: 'Bookings',  value: '8',   color: 'text-orange-500', fill: false },
                  { icon: Heart, label: 'Favorites', value: '12',  color: 'text-pink-500',   fill: true  },
                  { icon: Star,  label: 'Rating',    value: '4.8', color: 'text-yellow-400', fill: true  },
                ]).map(s => (
                  <div key={s.label} className="flex flex-col items-center gap-0.5">
                    <s.icon className={`w-5 h-5 ${s.color}`} strokeWidth={2} fill={s.fill ? 'currentColor' : 'none'} />
                    <span className="text-xl font-black text-gray-900 dark:text-white">{s.value}</span>
                    <span className="text-xs font-semibold text-gray-400">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Navigation menus */}
              <div className="h-px bg-gray-100 dark:bg-gray-800" />
              <div className="p-2">
                {/* Edit profile — mobile only button */}
                <div className="md:hidden">
                  {!editing && (
                    <>
                      <MenuItem icon={Edit3}
                        iconBg={isOwner ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-orange-100 dark:bg-orange-900/30'}
                        iconColor="text-orange-500"
                        label="Edit Profile"
                        onClick={() => setEditing(true)} />
                      <Divider />
                    </>
                  )}
                </div>
                {menus.map((item, i) => (
                  <div key={item.label}>
                    <MenuItem {...item} />
                    {i < menus.length - 1 && <Divider />}
                  </div>
                ))}

              </div>

              {/* Sign out */}
              <div className="h-px bg-gray-100 dark:bg-gray-800" />
              <div className="p-2">
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                    <LogOut className="w-5 h-5 text-red-500" />
                  </div>
                  <span className="text-[14px] font-semibold text-red-500">Sign Out</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: Profile details + forms ──────────────────── */}
          <div className="lg:col-span-8 space-y-5">

            {/* Account info card — toggle with edit form */}
            {!editing && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl shadow-gray-200/50 dark:shadow-black/50 overflow-hidden border border-white dark:border-gray-800 p-2">
                <div className="flex items-center justify-between px-6 pt-6 pb-2">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">Account Information</h3>
                  <button onClick={() => setEditing(true)}
                    className={`hidden md:flex items-center gap-1.5 text-xs font-black px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5
                      ${isOwner ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:shadow-lg hover:shadow-indigo-500/20 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-orange-600 bg-orange-50 hover:bg-orange-100 hover:shadow-lg hover:shadow-orange-500/20 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                    <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                </div>
                <div className="px-5 pb-5">
                  <InfoRow icon={User}   label="Full Name"  value={user?.name}              color={isOwner ? 'text-indigo-500' : 'text-orange-500'} />
                  <InfoRow icon={Mail}   label="Email"      value={user?.email}             color={isOwner ? 'text-blue-500'   : 'text-pink-500'} />
                  <InfoRow icon={Phone}  label="Phone"      value={user?.phone}             color={isOwner ? 'text-teal-500'   : 'text-teal-500'} />
                  <InfoRow icon={MapPin} label="City"       value={user?.profile?.city}     color="text-purple-500" />
                  <InfoRow icon={MapPin} label="State"      value={user?.profile?.state}    color="text-purple-500" />
                  {user?.profile?.bio && (
                    <InfoRow icon={Wifi} label={isOwner ? 'About Business' : 'Bio'} value={user.profile.bio} color="text-gray-400" />
                  )}
                </div>
              </motion.div>
            )}


            {/* Edit Profile form */}
            <AnimatePresence>
              {editing && (
                <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl shadow-gray-300/50 dark:shadow-black/50 overflow-hidden border border-white dark:border-gray-800 p-2 relative">
                  <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100/50 dark:border-gray-800/50">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">Edit Profile</h3>
                    <button onClick={() => setEditing(false)} className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 hover:rotate-90 transition-all duration-300">
                      <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>
                  <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { label: 'Full Name', name: 'name',  icon: User,   type: 'text',  editable: true },
                        { label: 'Email',     name: 'email', icon: Mail,   type: 'email', editable: false },
                        { label: 'Phone',     name: 'phone', icon: Phone,  type: 'tel',   editable: false },
                        { label: 'City',      name: 'city',  icon: MapPin, type: 'text',  editable: true },
                        { label: 'State',     name: 'state', icon: MapPin, type: 'text',  editable: true },
                      ].map(f => (
                        <div key={f.name}>
                          <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">{f.label}</label>
                          <div className="relative">
                            <f.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type={f.type} value={formData[f.name]}
                              onChange={e => setFormData({ ...formData, [f.name]: e.target.value })}
                              readOnly={!f.editable}
                              className={`w-full pl-12 pr-4 py-4 rounded-2xl font-bold text-[15px] transition-all duration-300
                                ${f.editable
                                  ? `bg-gray-50/50 dark:bg-gray-800/30 border-2 border-transparent focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white shadow-inner ${isOwner ? 'focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10' : 'focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10'}`
                                  : 'bg-gray-100/80 dark:bg-gray-800/80 text-gray-400 border-2 border-transparent cursor-not-allowed outline-none shadow-none'
                                }`} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">{isOwner ? 'About Your Business' : 'Bio'}</label>
                      <textarea value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} rows={3}
                        className={`w-full px-5 py-4 rounded-2xl font-bold text-[15px] bg-gray-50/50 dark:bg-gray-800/30 border-2 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:outline-none text-gray-900 dark:text-white shadow-inner resize-none transition-all duration-300 ${isOwner ? 'focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10' : 'focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10'}`}
                        placeholder={isOwner ? 'Describe your properties and services...' : 'Write a few sentences about yourself...'} />
                    </div>
                    <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-800/50">
                      <button onClick={handleSaveProfile} disabled={loading}
                        className={`flex-1 text-white py-4 rounded-2xl font-black text-[15px] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 flex items-center justify-center gap-2
                          ${isOwner ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500' : 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-400 hover:to-pink-400'}`}>
                        <Save className="w-5 h-5" />
                        {loading ? 'Saving Changes...' : 'Save Changes'}
                      </button>
                      <button onClick={() => setEditing(false)}
                        className="px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-black text-[15px] hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover:-translate-y-1">
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>



          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
