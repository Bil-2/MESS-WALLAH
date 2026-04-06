import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import {
  Plus, Calendar, BedDouble, Star, IndianRupee,
  Bell, ChevronRight, RefreshCw, Camera, CheckSquare,
  Clock, User, LogOut, Settings, Layers, TrendingUp,
  Target, Eye, Home, BarChart2, ShieldCheck
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

/* ─── helpers ──────────────────────────────────────────────────────── */
const getInitials = (name = '') => {
  const w = name.trim().split(/\s+/).filter(Boolean);
  if (!w.length) return 'U';
  if (w.length === 1) return w[0][0].toUpperCase();
  return (w[0][0] + w[w.length - 1][0]).toUpperCase();
};
const fmt = (n) => Number(n).toLocaleString('en-IN');

/* ─── Demo fallback data ─────────────────────────────────────────── */
const DEMO = {
  totalListings: 6, availableRooms: 4, activeBookings: 3,
  pendingRequests: 2, totalEarnings: 84000, thisMonthEarnings: 21000,
  occupancyRate: 67, avgRating: '4.3', totalViews: 1248,
};

/* ─── Shared mini components ─────────────────────────────────────── */
const MenuItem = ({ icon: Icon, iconBg, iconColor, label, sub, badge, onClick }) => (
  <button onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors group text-left rounded-2xl">
    <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform shadow-sm`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[14px] font-semibold text-gray-800 dark:text-gray-100 leading-tight">{label}</p>
      {sub && <p className="text-xs text-gray-400 font-medium mt-0.5 truncate">{sub}</p>}
    </div>
    {badge > 0 && (
      <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center flex-shrink-0">{badge}</span>
    )}
    <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 flex-shrink-0" />
  </button>
);

const Divider = () => <div className="h-px bg-gray-100 dark:bg-gray-800 mx-4" />;

/* ── Stat big card ───────────────────────────────────────────────── */
const BigStat = ({ label, value, sub, grad, icon: Icon, onClick }) => (
  <div onClick={onClick}
    className={`relative overflow-hidden rounded-2xl p-6 ${grad} text-white ${onClick ? 'cursor-pointer hover:opacity-90' : ''} transition-opacity`}>
    <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
    <div className="absolute -bottom-3 -left-3 w-14 h-14 bg-white/10 rounded-full" />
    <div className="relative z-10">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-white/70">{label}</p>
      </div>
      <p className="text-3xl font-black">{value}</p>
      {sub && <p className="text-xs text-white/60 mt-1">{sub}</p>}
    </div>
  </div>
);

/* ── Small metric card ──────────────────────────────────────────── */
const MetricCard = ({ label, value, sub, icon: Icon, iconGrad, onClick }) => (
  <div onClick={onClick}
    className={`bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''} transition-all`}>
    <div className="flex items-center justify-between mb-3">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br ${iconGrad}`}>
        <Icon className="w-4 h-4 text-white" />
      </div>
    </div>
    <p className="text-2xl font-black text-gray-900 dark:text-white">{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

/* ── Action button ──────────────────────────────────────────────── */
const ActionBtn = ({ icon: Icon, iconGrad, label, sub, badge, onClick, primary }) => (
  <button onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all group hover:-translate-y-0.5 hover:shadow-lg text-left
      ${primary
        ? 'bg-gradient-to-br from-blue-600 to-indigo-700 border-transparent text-white'
        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
      }`}>
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform
      ${primary ? 'bg-white/20' : `bg-gradient-to-br ${iconGrad}`}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div className="flex-1">
      <p className={`font-bold text-sm ${primary ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{label}</p>
      {sub && <p className={`text-xs mt-0.5 ${primary ? 'text-blue-200' : 'text-gray-400'}`}>{sub}</p>}
    </div>
    {badge > 0 && (
      <span className="w-6 h-6 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center">{badge}</span>
    )}
    <ChevronRight className={`w-4 h-4 flex-shrink-0 ${primary ? 'text-white/60' : 'text-gray-300'} group-hover:translate-x-0.5 transition-transform`} />
  </button>
);

/* ═══════════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                   */
/* ═══════════════════════════════════════════════════════════════════ */
const OwnerDashboard = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [stats, setStats] = useState(DEMO);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const [roomsRes, bookingsRes] = await Promise.all([
        api.get('/rooms/my-rooms?limit=100'),
        api.get('/bookings/owner-bookings?limit=100').catch(() => ({ data: { data: [] } }))
      ]);
      const rooms = roomsRes.data?.data?.rooms || [];
      const bookings = bookingsRes.data?.data || [];
      const allB = Array.isArray(bookings) ? bookings : [];
      const totalRooms = rooms.length;
      const allZero = totalRooms === 0 && allB.length === 0;
      if (allZero) { setStats(DEMO); setIsDemo(true); setLoading(false); return; }

      const availableRooms = rooms.filter(r => r.isAvailable).length;
      const occupiedRooms = rooms.filter(r => r.isOccupied || !r.isAvailable).length;
      const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;
      const totalViews = rooms.reduce((s, r) => s + (r.views || 0), 0);
      const avgRating = rooms.length > 0
        ? (rooms.reduce((s, r) => s + (r.rating || 0), 0) / rooms.length).toFixed(1) : '0.0';
      const pendingRequests = allB.filter(b => b.status === 'requested').length;
      const activeBookings = allB.filter(b => ['active', 'confirmed'].includes(b.status)).length;
      const now = new Date();
      const doneB = allB.filter(b => ['active', 'completed', 'confirmed'].includes(b.status));
      const totalEarnings = doneB.reduce((s, b) => s + (b.pricing?.monthlyRent || 0), 0);
      const thisMonthEarnings = doneB
        .filter(b => { const d = new Date(b.createdAt); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); })
        .reduce((s, b) => s + (b.pricing?.monthlyRent || 0), 0);
      setStats({ totalListings: totalRooms, availableRooms, activeBookings, pendingRequests, totalEarnings, thisMonthEarnings, occupancyRate, avgRating, totalViews });
      setIsDemo(false);
    } catch { setStats(DEMO); setIsDemo(true); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  const handleLogout = async () => {
    try { await logout(); toast.success('Logged out'); navigate('/login'); }
    catch { toast.error('Logout failed'); }
  };

  const initials = getInitials(user?.name);
  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
  })();

  /* sidebar menus */
  const sidebarMenus = [
    { icon: User,      iconBg: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-500', label: 'My Profile',      sub: 'Edit personal information',          path: '/profile' },
    { icon: Layers,    iconBg: 'bg-blue-100 dark:bg-blue-900/30',     iconColor: 'text-blue-500',   label: 'My Listings',     sub: `${stats.totalListings} rooms listed`, path: '/owner/rooms' },
    { icon: Calendar,  iconBg: 'bg-teal-100 dark:bg-teal-900/30',     iconColor: 'text-teal-500',   label: 'Manage Bookings', sub: `${stats.activeBookings} active`,      badge: stats.pendingRequests, path: '/owner/bookings' },
    { icon: Settings,  iconBg: 'bg-gray-100 dark:bg-gray-800',        iconColor: 'text-gray-500',   label: 'Settings',        sub: 'Password & preferences',             path: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 pt-20 pb-12">

      {/* Page header strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-0.5">Owner Dashboard</p>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
              {greeting}, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isDemo && (
              <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-xl text-xs font-bold border border-yellow-200 dark:border-yellow-800">
                Sample Data
              </span>
            )}
            <button onClick={fetchStats} disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:shadow-md transition-all disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-500' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pending alert */}
      {stats.pendingRequests > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <button onClick={() => navigate('/owner/bookings')}
            className="w-full flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all group">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-bold">{stats.pendingRequests} Booking {stats.pendingRequests === 1 ? 'Request' : 'Requests'} Need Review</p>
              <p className="text-orange-100 text-sm">Tap to approve or reject pending requests</p>
            </div>
            <ChevronRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* ── Main content — full width ─────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">

            {/* Quick actions */}
            <div>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Quick Actions</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <ActionBtn icon={Plus}     iconGrad="from-blue-500 to-indigo-600"  label="Add New Room"     sub="List a new property"           onClick={() => navigate('/owner/rooms/new')} primary />
                <ActionBtn icon={Calendar} iconGrad="from-teal-500 to-green-500"   label="Manage Bookings"  sub={`${stats.activeBookings} active${stats.pendingRequests > 0 ? ` · ${stats.pendingRequests} pending` : ''}`} badge={stats.pendingRequests} onClick={() => navigate('/owner/bookings')} />
                <ActionBtn icon={Layers}   iconGrad="from-indigo-500 to-purple-600" label="My Listings"      sub={`${stats.totalListings} rooms · ${stats.availableRooms} available`} onClick={() => navigate('/owner/rooms')} />
              </div>
            </div>

            {/* Earnings */}
            <div>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Earnings Overview</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <BigStat label="Total Earnings"
                  value={`₹${fmt(stats.totalEarnings)}`}
                  sub="From all completed bookings"
                  grad="bg-gradient-to-br from-blue-600 to-indigo-700"
                  icon={IndianRupee} />
                <BigStat label="This Month"
                  value={`₹${fmt(stats.thisMonthEarnings)}`}
                  sub={new Date().toLocaleString('en-IN', { month: 'long', year: 'numeric' })}
                  grad="bg-gradient-to-br from-teal-500 to-emerald-600"
                  icon={TrendingUp} />
              </div>
            </div>

            {/* Property metrics */}
            <div>
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Property Metrics</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <MetricCard label="My Rooms"    value={stats.totalListings}               sub={`${stats.availableRooms} available`}  icon={Home}    iconGrad="from-indigo-500 to-purple-600" onClick={() => navigate('/owner/rooms')} />
                <MetricCard label="Total Views" value={fmt(stats.totalViews)}             sub="Across all listings"                  icon={Eye}     iconGrad="from-purple-500 to-pink-500" />
                <MetricCard label="Occupancy"   value={`${stats.occupancyRate}%`}         sub="Current fill rate"                    icon={Target}  iconGrad="from-teal-500 to-cyan-500" />
                <MetricCard label="Avg Rating"  value={stats.avgRating}                   sub="Based on reviews"                     icon={Star}    iconGrad="from-yellow-400 to-orange-400" />
              </div>
            </div>

            {/* Secondary stats */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => navigate('/owner/bookings')}
                className="flex items-center gap-4 p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-teal-400 hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart2 className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.activeBookings}</p>
                  <p className="text-xs font-semibold text-gray-400">Active Guests</p>
                </div>
              </button>
              <button onClick={() => navigate('/owner/bookings')}
                className="flex items-center gap-4 p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-orange-400 hover:shadow-md transition-all group">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Bell className="w-6 h-6 text-orange-500" />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-black text-gray-900 dark:text-white">{stats.pendingRequests}</p>
                  <p className="text-xs font-semibold text-gray-400">Pending Requests</p>
                </div>
              </button>
            </div>

            {/* Tips */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm">
              <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Tips to Get More Bookings</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: Camera,      iconBg: 'bg-blue-100 dark:bg-blue-900/30',     iconColor: 'text-blue-500',   label: 'Add 5+ photos',              sub: 'High-quality images get 3× more views', path: '/owner/rooms' },
                  { icon: CheckSquare, iconBg: 'bg-teal-100 dark:bg-teal-900/30',     iconColor: 'text-teal-500',   label: 'Get Verified badge',          sub: 'Upload Aadhaar for a trust boost',      path: '/owner/rooms/new' },
                  { icon: Clock,       iconBg: 'bg-orange-100 dark:bg-orange-900/30', iconColor: 'text-orange-500', label: 'Reply within 1 hour',         sub: 'Faster replies win more bookings',      path: '/owner/bookings' },
                ].map(t => (
                  <button key={t.label} onClick={() => navigate(t.path)}
                    className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:shadow-md transition-all group text-left border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800">
                    <div className={`w-9 h-9 ${t.iconBg} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <t.icon className={`w-4 h-4 ${t.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-100">{t.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{t.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
