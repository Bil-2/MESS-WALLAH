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
import { getServerImageUrl } from '../utils/imageUtils';

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
  const { user, updateProfile, uploadProfilePicture, logout, loading: authLoading } = useAuthContext();

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
      // Strip +91 prefix for display — store as plain 10-digit
      const rawPhone = user.phone?.startsWith('+91')
        ? user.phone.slice(3)
        : (user.phone || '');
      setFormData({
        name: user.name || '', email: user.email || '', phone: rawPhone,
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
      // Validate phone if provided
      const rawPhone = formData.phone?.trim().replace(/\s/g, '');
      if (rawPhone) {
        if (!/^[6-9]\d{9}$/.test(rawPhone)) {
          toast.error('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210)');
          setLoading(false);
          return;
        }
      }

      // Create backend-friendly payload
      const payload = {
        name: formData.name,
        profile: {
          bio: formData.bio,
          city: formData.city,
          state: formData.state
        }
      };
      
      // Only include email and phone if not empty
      if (formData.email?.trim()) payload.email = formData.email.trim();
      // Send phone in +91 international format that backend expects
      if (rawPhone) payload.phone = `+91${rawPhone}`;

      const result = await updateProfile(payload);
      if (result?.success) { setEditing(false); toast.success('Profile updated!'); }
      else throw new Error(result?.message || 'Failed');
    } catch (e) { toast.error(e.message || 'Failed to update profile'); }
    finally { setLoading(false); }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image max size is 5MB');
      return;
    }

    try {
      const toastId = toast.loading('Uploading profile picture...');
      const result = await uploadProfilePicture(file);
      if (result?.success) {
        toast.success('Profile picture updated!', { id: toastId });
      } else {
        throw new Error(result?.message || 'Upload failed');
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred during upload');
    }
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
    <div className={`min-h-screen relative overflow-hidden ${accentBg} ${accentDark} pt-24 pb-16`}>
      {/* ── Ambient Background Orbs ── */}
      <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-40 mix-blend-multiply dark:mix-blend-screen animate-pulse pointer-events-none ${isOwner ? 'bg-indigo-300 dark:bg-indigo-900/40' : 'bg-orange-300 dark:bg-orange-900/40'}`} style={{ animationDuration: '4s' }} />
      <div className={`absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[140px] opacity-30 mix-blend-multiply dark:mix-blend-screen animate-pulse pointer-events-none ${isOwner ? 'bg-purple-300 dark:bg-purple-900/40' : 'bg-pink-300 dark:bg-pink-900/40'}`} style={{ animationDuration: '7s', animationDelay: '2s' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

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

                <div className="relative z-10 flex items-center gap-5">
                  <div className="relative group">
                    <div className="relative w-[84px] h-[84px] rounded-[1.5rem] bg-white/20 backdrop-blur-md border-[2px] border-white/50 flex items-center justify-center shadow-2xl p-1 overflow-hidden transition-all duration-500 group-hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]">
                      <div className="w-full h-full rounded-[1.1rem] overflow-hidden bg-white/10 flex items-center justify-center relative">
                        {user?.profilePicture
                          ? <img src={getServerImageUrl(user.profilePicture)} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          : <span className="text-3xl font-black text-white">{initials}</span>
                        }
                      </div>
                    </div>
                    <label className="absolute -bottom-2 -right-2 w-9 h-9 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-xl shadow-black/20 cursor-pointer hover:scale-110 hover:rotate-12 transition-all ring-4 ring-black/5 dark:ring-white/10 z-20 overflow-hidden group/cam">
                      <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 to-white dark:from-gray-800 dark:to-gray-700 opacity-0 group-hover/cam:opacity-100 transition-opacity" />
                      <Camera className={`relative w-4 h-4 ${isOwner ? 'text-indigo-600 dark:text-indigo-400' : 'text-orange-500 dark:text-orange-400'}`} />
                      <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                    </label>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-md">{user?.name}</h2>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/20 shadow-sm">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
                        <span className="text-white/90 text-[10px] font-bold uppercase tracking-widest leading-none mt-0.5">Online</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2.5 drop-shadow-sm">
                      {isOwner
                        ? <><ShieldCheck className="w-4 h-4 text-green-300 drop-shadow-sm" strokeWidth={2.5} /><span className="text-[13px] font-bold text-green-300 tracking-wide">Verified Owner</span></>
                        : <><CheckCircle className="w-4 h-4 text-green-300 drop-shadow-sm" strokeWidth={2.5} /><span className="text-[13px] font-bold text-green-300 tracking-wide">Verified Student</span></>
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 divide-x divide-gray-100/50 dark:divide-gray-800/50 py-5 px-2 bg-gray-50/50 dark:bg-gray-800/20">
                {(isOwner ? [
                  { icon: BedDouble, label: 'Rooms',    value: '—',   color: 'text-blue-500',   fill: false },
                  { icon: Calendar,  label: 'Bookings', value: '—',   color: 'text-teal-500',   fill: false },
                  { icon: Star,      label: 'Rating',   value: '4.8', color: 'text-yellow-400', fill: true  },
                ] : [
                  { icon: Home,  label: 'Bookings',  value: '8',   color: 'text-orange-500', fill: false },
                  { icon: Heart, label: 'Favorites', value: '12',  color: 'text-pink-500',   fill: true  },
                  { icon: Star,  label: 'Rating',    value: '4.8', color: 'text-yellow-400', fill: true  },
                ]).map(s => (
                  <div key={s.label} className="flex flex-col items-center gap-1 group/stat cursor-pointer">
                    <div className={`p-2 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 group-hover/stat:scale-110 group-hover/stat:-translate-y-1 group-hover/stat:shadow-md transition-all duration-300`}>
                      <s.icon className={`w-4 h-4 ${s.color}`} strokeWidth={2.5} fill={s.fill ? 'currentColor' : 'none'} />
                    </div>
                    <span className="text-[22px] font-black text-gray-900 dark:text-white tracking-tight leading-none mt-1.5">{s.value}</span>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em]">{s.label}</span>
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
                className="relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-black/50 overflow-hidden border border-white/60 dark:border-gray-800/80 p-3 before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/40 before:to-transparent before:pointer-events-none">
                <div className="relative z-10 flex items-center justify-between px-6 pt-5 pb-3">
                  <h3 className="text-[22px] font-black text-gray-900 dark:text-white tracking-tight">Account Information</h3>
                  <button onClick={() => setEditing(true)}
                    className={`hidden md:flex items-center gap-2 text-[13px] font-black px-5 py-2.5 rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-0.5
                      ${isOwner ? 'text-white bg-indigo-500 hover:bg-indigo-600 shadow-xl shadow-indigo-500/30' : 'text-white bg-orange-500 hover:bg-orange-600 shadow-xl shadow-orange-500/30'}`}>
                    <Edit3 className="w-4 h-4" /> Edit Profile
                  </button>
                </div>
                <div className="relative z-10 px-5 pb-5">
                  <InfoRow icon={User}   label="Full Name"  value={user?.name}              color={isOwner ? 'text-indigo-500' : 'text-orange-500'} />
                  <InfoRow icon={Mail}   label="Email"      value={user?.email}             color={isOwner ? 'text-blue-500'   : 'text-pink-500'} />
                  <InfoRow icon={Phone}  label="Phone"      value={user?.phone ? (user.phone.startsWith('+91') ? user.phone.slice(3) : user.phone) : '—'} color={isOwner ? 'text-teal-500' : 'text-teal-500'} />
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
                        { label: 'Full Name',       name: 'name',  icon: User,   type: 'text',  editable: true,  placeholder: 'Your full name' },
                        { label: 'Email',            name: 'email', icon: Mail,   type: 'email', editable: false, placeholder: '' },
                        { label: 'Phone (10-digit)', name: 'phone', icon: Phone,  type: 'tel',   editable: true,  placeholder: '9XXXXXXXXX (10 digits)' },
                        { label: 'City',             name: 'city',  icon: MapPin, type: 'text',  editable: true,  placeholder: 'Your city' },
                        { label: 'State',            name: 'state', icon: MapPin, type: 'text',  editable: true,  placeholder: 'Your state' },
                      ].map(f => (
                        <div key={f.name}>
                          <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">{f.label}</label>
                          <div className="relative">
                            <f.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type={f.type}
                              value={formData[f.name]}
                              onChange={e => setFormData({ ...formData, [f.name]: e.target.value })}
                              readOnly={!f.editable}
                              placeholder={f.placeholder || ''}
                              maxLength={f.name === 'phone' ? 10 : undefined}
                              className={`w-full pl-12 pr-4 py-4 rounded-2xl font-bold text-[15px] transition-all duration-300
                                ${f.editable
                                  ? `bg-gray-50/50 dark:bg-gray-800/30 border-2 border-transparent focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white shadow-inner ${isOwner ? 'focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10' : 'focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10'}`
                                  : 'bg-gray-100/80 dark:bg-gray-800/80 text-gray-400 border-2 border-transparent cursor-not-allowed outline-none shadow-none'
                                }`}
                            />
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
