import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Star,
  Shield,
  Clock,
  Users,
  Award,
  CheckCircle,
  Phone,
  Heart,
  Utensils,
  ArrowRight,
  Play,
  UserCheck,
  Camera,
  Sparkles,
  Zap,
  TrendingUp,
  Globe,
  Wifi,
  Coffee,
  Mail,
  UserPlus,
  Eye,
  Home as HomeIcon
} from 'lucide-react';
import { useAuthContext } from '../context/AuthContext.jsx';
import { roomsAPI } from '../utils/api';

const Home = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const fetchFeaturedRooms = async () => {
      try {
        const response = await roomsAPI.getFeaturedRooms();
        console.log('Featured rooms response:', response);

        // Handle different possible response structures
        let rooms = [];
        if (response.data && Array.isArray(response.data)) {
          rooms = response.data;
        } else if (response.data && response.data.rooms && Array.isArray(response.data.rooms)) {
          rooms = response.data.rooms;
        } else if (Array.isArray(response)) {
          rooms = response;
        } else if (response.success && response.data && Array.isArray(response.data)) {
          rooms = response.data;
        }

        setFeaturedRooms(rooms.slice(0, 3));
      } catch (error) {
        console.error('Error fetching featured rooms:', error);
        // Set fallback featured rooms
        setFeaturedRooms([
          {
            _id: 'featured-1',
            title: 'Premium Girls PG near College',
            location: 'Koramangala, Bangalore',
            rent: 12000,
            rating: 4.8,
            image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&h=300&fit=crop',
            amenities: ['WiFi', 'Mess', '24/7 Security', 'Laundry'],
            verified: true
          },
          {
            _id: 'featured-2',
            title: 'Safe & Secure Accommodation',
            location: 'HSR Layout, Bangalore',
            rent: 10500,
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
            amenities: ['WiFi', 'Mess', 'CCTV', 'Girls Only'],
            verified: true
          },
          {
            _id: 'featured-3',
            title: 'Comfortable Student Housing',
            location: 'Whitefield, Bangalore',
            rent: 8500,
            rating: 4.4,
            image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=300&fit=crop',
            amenities: ['WiFi', 'Mess', 'Study Room', 'Safe'],
            verified: true
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedRooms();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/rooms?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const stats = [
    { icon: Users, label: 'Happy Students', value: '10,000+', color: 'from-emerald-400 to-teal-600', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { icon: MapPin, label: 'Cities Covered', value: '50+', color: 'from-blue-400 to-indigo-600', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
    { icon: Shield, label: 'Verified Safe Mess', value: '500+', color: 'from-purple-400 to-pink-600', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
    { icon: Award, label: 'Girls Safety Rating', value: '4.9★', color: 'from-amber-400 to-orange-600', bgColor: 'bg-amber-50 dark:bg-amber-900/20' },
  ];

  const safetyFeatures = [
    {
      icon: Shield,
      title: 'Girls Safety First',
      description: 'Verified female-only sections, CCTV monitoring, and 24/7 security for complete peace of mind',
      gradient: 'from-pink-500 via-rose-500 to-red-500',
      iconBg: 'bg-gradient-to-r from-pink-500 to-rose-500'
    },
    {
      icon: UserCheck,
      title: 'Verified Owners',
      description: 'All mess owners undergo background verification and safety compliance checks',
      gradient: 'from-blue-500 via-indigo-500 to-purple-500',
      iconBg: 'bg-gradient-to-r from-blue-500 to-indigo-500'
    },
    {
      icon: Camera,
      title: 'Live Safety Monitoring',
      description: 'Real-time CCTV access for parents and emergency contact integration',
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      iconBg: 'bg-gradient-to-r from-green-500 to-emerald-500'
    },
    {
      icon: Phone,
      title: '24/7 Safety Helpline',
      description: 'Dedicated girls safety helpline with immediate response team',
      gradient: 'from-purple-500 via-violet-500 to-indigo-500',
      iconBg: 'bg-gradient-to-r from-purple-500 to-violet-500'
    }
  ];

  const whyChooseUs = [
    {
      icon: Utensils,
      title: 'Personalized Meal Plans',
      description: 'Customize your daily meals with our flexible subscription plans',
      gradient: 'from-orange-400 to-red-500'
    },
    {
      icon: Clock,
      title: 'On-Time Delivery',
      description: 'Fresh meals delivered right to your room at scheduled times',
      gradient: 'from-blue-400 to-indigo-500'
    },
    {
      icon: CheckCircle,
      title: 'Hygienic & Safe',
      description: 'Certified kitchens with highest hygiene standards and safety protocols',
      gradient: 'from-green-400 to-emerald-500'
    },
    {
      icon: Heart,
      title: 'Just Like Home',
      description: 'Homely atmosphere with care and comfort just like your mother provides',
      gradient: 'from-pink-400 to-rose-500'
    }
  ];

  const testimonials = [
    {
      name: 'Emma Johnson',
      role: 'Engineering Student',
      image: '👩‍🎓',
      text: 'Best decision ever! The safety features gave my parents complete peace of mind. Food is amazing too!',
      rating: 5
    },
    {
      name: 'Sofia Chen',
      role: 'Medical Student',
      image: '👩‍⚕️',
      text: 'The 24/7 helpline and CCTV monitoring made me feel so secure. Highly recommend for girls!',
      rating: 5
    },
    {
      name: 'Aisha Patel',
      role: 'MBA Student',
      image: '👩‍💼',
      text: 'Clean, safe, and delicious food. The verified owners and safety protocols are excellent!',
      rating: 5
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-pink-300/20 to-orange-300/20 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-blue-300/20 to-purple-300/20 rounded-full blur-xl"
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <motion.div
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center">
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full text-sm font-semibold mb-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Award className="w-5 h-5 mr-2" />
              <span className="bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                #1 SAFE MESS App for Students
              </span>
              <Sparkles className="w-4 h-4 ml-2 animate-pulse" />
            </motion.div>

            {/* Main Heading */}
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h1
                className="text-5xl md:text-7xl font-bold mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                  Safe & Secure
                </span>
                <br />
                <span className="text-gray-800 dark:text-white">
                  Girls Accommodation
                </span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Find verified, safe, and comfortable rooms for girls with 24/7 security,
                modern amenities, and a supportive community environment.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <motion.button
                  onClick={() => navigate('/rooms')}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Search className="w-5 h-5" />
                  Find Rooms
                </motion.button>

                <motion.button
                  onClick={() => navigate('/register')}
                  className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 dark:border-gray-700 flex items-center gap-2"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <UserPlus className="w-5 h-5" />
                  Join Now
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Trust Indicators & Statistics */}
            <motion.div
              className="max-w-5xl mx-auto mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {/* Views Counter */}
                <motion.div
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center">
                    <motion.div
                      className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                      <Eye className="w-6 h-6 text-white" />
                    </motion.div>
                    <motion.div
                      className="text-2xl font-bold text-gray-800 dark:text-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                    >
                      5,000+
                    </motion.div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">People Viewed</div>
                  </div>
                </motion.div>

                {/* Bookings Counter */}
                <motion.div
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center">
                    <motion.div
                      className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <HomeIcon className="w-6 h-6 text-white" />
                    </motion.div>
                    <motion.div
                      className="text-2xl font-bold text-gray-800 dark:text-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.4 }}
                    >
                      500+
                    </motion.div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Rooms Booked</div>
                  </div>
                </motion.div>

                {/* Verified Badge */}
                <motion.div
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center">
                    <motion.div
                      className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Shield className="w-6 h-6 text-white" />
                    </motion.div>
                    <motion.div
                      className="text-2xl font-bold text-gray-800 dark:text-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.6 }}
                    >
                      100%
                    </motion.div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Verified Safe</div>
                  </div>
                </motion.div>

                {/* Happy Customers */}
                <motion.div
                  className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center">
                    <motion.div
                      className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Star className="w-6 h-6 text-white" />
                    </motion.div>
                    <motion.div
                      className="text-2xl font-bold text-gray-800 dark:text-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.8 }}
                    >
                      4.9★
                    </motion.div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
                  </div>
                </motion.div>
              </div>

              {/* Trust Badges */}
              <motion.div
                className="flex flex-wrap justify-center gap-4 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                <motion.div
                  className="flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 px-4 py-2 rounded-full"
                  whileHover={{ scale: 1.05 }}
                >
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Government Verified</span>
                </motion.div>
                
                <motion.div
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 px-4 py-2 rounded-full"
                  whileHover={{ scale: 1.05 }}
                >
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">24/7 Security</span>
                </motion.div>
                
                <motion.div
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 px-4 py-2 rounded-full"
                  whileHover={{ scale: 1.05 }}
                >
                  <Award className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Premium Quality</span>
                </motion.div>
              </motion.div>
            </motion.div>

          </div>
        </motion.div>
      </section>

      {/* Stats Section with Amazing Animations */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.1,
                    rotateY: 10,
                    transition: { duration: 0.3 }
                  }}
                  className="text-center group"
                >
                  <div className={`relative w-20 h-20 mx-auto mb-6 ${stat.bgColor} rounded-3xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500`}>
                    <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <Icon className={`w-10 h-10 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent relative z-10 group-hover:text-white transition-all duration-300`} />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className={`absolute inset-0 border-2 border-gradient-to-r ${stat.color} rounded-3xl opacity-20`}
                    />
                  </div>
                  <motion.div
                    className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2"
                    whileHover={{ scale: 1.1 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Girls Safety Section with Stunning Effects */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 dark:from-pink-900/20 dark:via-purple-900/20 dark:to-blue-900/20" />

        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(255, 182, 193, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(147, 197, 253, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 20%, rgba(196, 181, 253, 0.3) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(255, 182, 193, 0.3) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute inset-0"
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Girls Safety
            </h2>
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Our Priority
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              We understand parents' concerns. That's why we've built the most comprehensive safety system for female students.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {safetyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{
                    y: -10,
                    rotateX: 5,
                    transition: { duration: 0.3 }
                  }}
                  className="group"
                >
                  <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 text-center border border-white/20 overflow-hidden">
                    {/* Animated background gradient */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                      whileHover={{ scale: 1.1 }}
                    />

                    <div className="relative z-10">
                      <motion.div
                        className={`w-20 h-20 ${feature.iconBg} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:shadow-xl`}
                        whileHover={{
                          rotate: [0, -10, 10, 0],
                          scale: 1.1
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-10 h-10 text-white" />
                      </motion.div>

                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Emergency Contact Banner with Pulse Effect */}
          <motion.div
            className="mt-20 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="relative bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 rounded-3xl p-8 text-center overflow-hidden shadow-2xl">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-red-400/20 rounded-3xl"
              />

              <div className="relative z-10 text-white">
                <motion.div
                  className="flex items-center justify-center mb-6"
                  whileHover={{ scale: 1.1 }}
                >
                  <Phone className="w-10 h-10 mr-4" />
                  <h3 className="text-3xl font-bold">24/7 Girls Safety Helpline</h3>
                </motion.div>
                <p className="text-xl mb-6 opacity-90">
                  Immediate assistance for any safety concerns or emergencies
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
                  <motion.a
                    href="tel:1800-SAFE-GIRL"
                    className="text-2xl font-bold bg-white/20 px-6 py-3 rounded-2xl backdrop-blur-sm hover:bg-white/30 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    📞 1800-SAFE-GIRL (Free)
                  </motion.a>
                  <span className="text-white/60">|</span>
                  <motion.a
                    href="tel:911"
                    className="text-xl font-bold bg-red-600/30 px-6 py-3 rounded-2xl backdrop-blur-sm hover:bg-red-600/50 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    🚨 Emergency: 911
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-6">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Real experiences from students, families, and residents who found their perfect home through MessWallah
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              // Girls Students
              {
                name: "Priya Sharma",
                role: "Engineering Student",
                category: "girl",
                image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                rating: 5,
                text: "MessWallah helped me find the safest PG near my college. The 24/7 security and girls-only environment gives my parents complete peace of mind. The mess food is homely and nutritious!"
              },
              {
                name: "Ananya Patel",
                role: "Medical Student",
                category: "girl",
                image: "https://images.unsplash.com/photo-1438761681033-4f4e44671d66?w=150&h=150&fit=crop&crop=face",
                rating: 5,
                text: "As a medical student, I needed a quiet and secure place to study. The PG I found through MessWallah has excellent WiFi, study rooms, and a supportive community of girls."
              },
              {
                name: "Kavya Reddy",
                role: "MBA Student",
                category: "girl",
                image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face",
                rating: 4,
                text: "The verification process is thorough and the rooms are exactly as shown. I love the modern amenities and the fact that it's exclusively for girls. Highly recommended!"
              },

              // Bachelor Students
              {
                name: "Arjun Kumar",
                role: "Software Developer",
                category: "bachelor",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                rating: 5,
                text: "Found an amazing shared room near my office through MessWallah. The process was smooth, rent is affordable, and the location is perfect for my daily commute."
              },
              {
                name: "Rohit Singh",
                role: "CA Student",
                category: "bachelor",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                rating: 4,
                text: "Great platform for finding quality accommodation. The rooms are well-maintained, and the landlords are verified. The booking process is hassle-free!"
              },
              {
                name: "Vikash Gupta",
                role: "Marketing Executive",
                category: "bachelor",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
                rating: 5,
                text: "MessWallah made my relocation to Bangalore so easy! Found a great PG with all amenities within my budget. The community is friendly and supportive."
              },

              // Families
              {
                name: "Rajesh & Sunita Agarwal",
                role: "Working Parents",
                category: "family",
                image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?w=150&h=150&fit=crop&crop=face",
                rating: 5,
                text: "We found a perfect 2BHK for our family through MessWallah. The safety features and family-friendly environment are excellent. Our daughter feels secure here."
              },
              {
                name: "Amit & Neha Verma",
                role: "IT Professionals",
                category: "family",
                image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=face",
                rating: 4,
                text: "Great service for families! The properties are well-vetted and the landlords are cooperative. We got a spacious apartment with all modern amenities."
              },
              {
                name: "Suresh & Meera Joshi",
                role: "Bank Employees",
                category: "family",
                image: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face",
                rating: 5,
                text: "MessWallah helped us find our dream home in Bangalore. The process was transparent, and we got exactly what we were looking for within our budget."
              },

              // Senior Citizens
              {
                name: "Dr. Ramesh Iyer",
                role: "Retired Professor",
                category: "senior",
                image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
                rating: 5,
                text: "At my age, finding suitable accommodation was challenging. MessWallah's team was very patient and helped me find a peaceful place with medical facilities nearby."
              },
              {
                name: "Mrs. Lakshmi Nair",
                role: "Retired Teacher",
                category: "senior",
                image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
                rating: 4,
                text: "Excellent service for senior citizens! They understood my specific needs and found me a ground floor apartment with easy access and helpful neighbors."
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="flex items-center mb-4">
                  <motion.img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-orange-200 dark:border-orange-700"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                  <div className="ml-4 flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {testimonial.role}
                    </p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                        >
                          <Star
                            className={`w-4 h-4 ${i < testimonial.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300 dark:text-gray-600'
                              }`}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${testimonial.category === 'girl' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' :
                    testimonial.category === 'bachelor' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      testimonial.category === 'family' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                    }`}>
                    {testimonial.category === 'girl' ? '👩‍🎓 Student' :
                      testimonial.category === 'bachelor' ? '👨‍💼 Professional' :
                        testimonial.category === 'family' ? '👨‍👩‍👧‍👦 Family' :
                          '👴👵 Senior'}
                  </div>
                </div>

                <motion.p
                  className="text-gray-700 dark:text-gray-300 leading-relaxed italic"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  "{testimonial.text}"
                </motion.p>
              </motion.div>
            ))}
          </div>

          {/* Trust Indicators */}
          <motion.div
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl">
              <motion.div
                className="text-3xl font-bold text-orange-600 mb-2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                10,000+
              </motion.div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Happy Students</p>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl">
              <motion.div
                className="text-3xl font-bold text-pink-600 mb-2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                50+
              </motion.div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Cities Covered</p>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl">
              <motion.div
                className="text-3xl font-bold text-purple-600 mb-2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                500+
              </motion.div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Verified Safe Properties</p>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-6 rounded-2xl">
              <motion.div
                className="text-3xl font-bold text-green-600 mb-2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
              >
                4.9⭐
              </motion.div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">Girls Safety Rating</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us with 3D Effects */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-orange-900/10 dark:via-pink-900/10 dark:to-purple-900/10" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Why Choose
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Mess Wallah
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              The best food for you at affordable prices with complete safety assurance
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {whyChooseUs.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{
                    y: -15,
                    rotateY: 10,
                    transition: { duration: 0.3 }
                  }}
                  className="group"
                >
                  <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 text-center border border-white/20 overflow-hidden h-full">
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    />

                    <div className="relative z-10">
                      <motion.div
                        className={`w-20 h-20 bg-gradient-to-r ${feature.gradient} rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg group-hover:shadow-xl`}
                        whileHover={{
                          rotate: 360,
                          scale: 1.1
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className="w-10 h-10 text-white" />
                      </motion.div>

                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-pink-500/20 to-purple-600/20" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="bg-white/10 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border border-white/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-5xl md:text-6xl font-bold text-white mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Ready to Find
              </span>
              <br />
              <span className="text-gray-800 dark:text-white">
                Your Perfect Room?
              </span>
            </motion.h2>

            <motion.p
              className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Join thousands of girls who have found their safe and comfortable homes through MessWallah.
              Start your journey to secure accommodation today!
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.button
                onClick={() => navigate('/rooms')}
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="w-6 h-6" />
                Browse Rooms
              </motion.button>

              <motion.button
                onClick={() => navigate('/register')}
                className="bg-white/20 backdrop-blur-xl text-gray-800 dark:text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-white/30 flex items-center justify-center gap-3"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <UserPlus className="w-6 h-6" />
                Get Started
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white py-20 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-20 -left-20 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-20 -right-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 0.8, 1]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Company Info */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <motion.div 
                className="flex items-center gap-4"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl"
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <span className="text-3xl">🏠</span>
                </motion.div>
                <div>
                  <motion.h2 
                    className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    MESS WALLAH
                  </motion.h2>
                  <p className="text-lg text-gray-300 font-medium">Find your Perfect Home</p>
                </div>
              </motion.div>

              <div className="space-y-6">
                <motion.div
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.02, x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg">support@messwallah.com</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-3"
                  whileHover={{ scale: 1.02, x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg">+91 9946 66 0012</span>
                </motion.div>

                {/* Social Media Links */}
                <motion.div
                  className="flex items-center gap-4 pt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <span className="text-gray-300 font-medium">Follow us:</span>
                  <div className="flex gap-4">
                    <motion.a
                      href="https://facebook.com/messwallah"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg"
                      whileHover={{ 
                        scale: 1.15,
                        rotate: 5,
                        boxShadow: "0 10px 25px rgba(59, 130, 246, 0.5)"
                      }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </motion.a>
                    <motion.a
                      href="https://instagram.com/messwallah"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg"
                      whileHover={{ 
                        scale: 1.15,
                        rotate: -5,
                        boxShadow: "0 10px 25px rgba(236, 72, 153, 0.5)"
                      }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </motion.a>
                    <motion.a
                      href="https://twitter.com/messwallah"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gradient-to-r from-gray-800 to-black rounded-xl flex items-center justify-center shadow-lg"
                      whileHover={{ 
                        scale: 1.15,
                        rotate: 5,
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)"
                      }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </motion.a>
                  </div>
                </motion.div>

                {/* Google Maps Address */}
                <motion.div
                  className="flex items-start gap-4 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <motion.div 
                    className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mt-1 shadow-lg"
                    animate={{ pulse: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <MapPin className="w-5 h-5 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-gray-300 font-medium mb-2">Our Office:</p>
                    <motion.a
                      href="https://maps.google.com/?q=Koramangala,+Bangalore,+Karnataka,+India"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-orange-400 transition-colors cursor-pointer text-lg leading-relaxed"
                      whileHover={{ scale: 1.05 }}
                    >
                      Koramangala, Bangalore<br />
                      Karnataka, India 560034
                    </motion.a>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <h3 className="text-xl font-bold text-gray-300 mb-6">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { name: 'Home', href: '/' },
                  { name: 'Rooms', href: '/rooms' },
                  { name: 'About Us', href: '/about' },
                  { name: 'How It Works', href: '/how-it-works' },
                  { name: 'Safety Guidelines', href: '/safety' },
                  { name: 'Privacy Policy', href: '/privacy' },
                  { name: 'Terms & Conditions', href: '/terms' },
                  { name: 'Booking Policy', href: '/booking-policy' },
                  { name: 'Support', href: '/support' },
                  { name: 'Contact Us', href: '/contact' },
                  { name: 'Report Issue', href: '/report' }
                ].map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.05, duration: 0.4 }}
                  >
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-orange-400 transition-colors duration-200 hover:underline"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <h3 className="text-xl font-bold text-gray-300 mb-6">Features</h3>
              <ul className="space-y-4">
                {[
                  { icon: '🍴', text: 'Easy Room Search' },
                  { icon: '🔒', text: 'Verified Safe Properties' },
                  { icon: '👧', text: 'Girls-Only Accommodations' },
                  { icon: '📱', text: 'Instant Booking' },
                  { icon: '👍', text: 'Quality Assured Rooms' },
                  { icon: '🕒', text: '24/7 Security Support' }
                ].map((feature, index) => (
                  <motion.li
                    key={feature.text}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <span className="text-lg">{feature.icon}</span>
                    <span className="text-gray-400">{feature.text}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Girls Safety Disclaimer */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <motion.h3 
                className="text-2xl font-bold text-white mb-6 flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🛡️
                </motion.div>
                Safety First
              </motion.h3>
              <motion.div 
                className="bg-gradient-to-br from-red-900/40 to-pink-900/40 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 shadow-2xl"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(239, 68, 68, 0.25)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex items-start gap-4">
                  <motion.div
                    animate={{ pulse: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Shield className="w-6 h-6 text-red-400 mt-1 flex-shrink-0" />
                  </motion.div>
                  <div className="space-y-3">
                    <p className="text-red-300 font-semibold text-sm">
                      🚨 Important Safety Notice
                    </p>
                    <p className="text-red-100 text-sm leading-relaxed">
                      While we strive to provide safe accommodations, we encourage all users to verify property details,
                      meet landlords in person, and trust their instincts. Your safety is paramount - always inform
                      family/friends of your location and arrangements.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <motion.div
            className="border-t border-gray-700 pt-4 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-center md:text-left">
                Copyright 2024. MessWallah. All rights reserved.
              </p>

              <div className="flex items-center gap-6">
              </div>
            </div>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;
