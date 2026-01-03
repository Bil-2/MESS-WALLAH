import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Star,
  Shield,
  Users,
  Home as HomeIcon,
  Mail,
  Phone,
  Trophy,
  Medal,
  Building2,
  Landmark,
  GraduationCap,
  Waves
} from 'lucide-react';
import SuccessStories from '../components/SuccessStories';
import ResponsiveContainer from '../components/ResponsiveContainer';
import ResponsiveRoomCard from '../components/ResponsiveRoomCard';
import ScrollReveal from '../components/ScrollReveal';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [stats, setStats] = useState({
    totalRooms: 4500,
    happyUsers: 25000,
    cities: 1500,
    rating: 4.8
  });

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      // Fetch real featured rooms from your backend
      const roomsResponse = await fetch('/api/rooms/featured');
      if (roomsResponse.ok) {
        const roomsData = await roomsResponse.json();
        if (roomsData.success && roomsData.data && roomsData.data.rooms) {
          // Transform backend data to match frontend format
          const transformedRooms = roomsData.data.rooms.slice(0, 6).map(room => ({
            id: room._id,
            title: room.title,
            location: `${room.address.area}, ${room.address.city}`,
            rent: room.rentPerMonth,
            rating: room.rating || 4.5,
            photos: room.photos || [], // Pass the entire photos array
            image: room.photos && room.photos[0] ? room.photos[0].url : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
            amenities: room.amenities ? room.amenities.slice(0, 3) : ['WiFi', 'AC', 'Food']
          }));
          setFeaturedRooms(transformedRooms);
        }
      }

      // Fetch real stats
      const statsResponse = await fetch('/api/rooms/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        if (statsData.success && statsData.data) {
          setStats({
            totalRooms: statsData.data.totalRooms || 4500,
            happyUsers: 25000,
            cities: statsData.data.totalCities || 1500,
            rating: 4.8
          });
        }
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
      // Fallback to show your project still has data
      setFeaturedRooms([
        {
          id: 1,
          title: 'Premium Room in Mumbai',
          location: 'Andheri, Mumbai',
          rent: 12000,
          rating: 4.7,
          image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
          amenities: ['WiFi', 'AC', 'Food']
        }
      ]);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/rooms?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/rooms');
    }
  };

  const handleQuickSearch = (city) => {
    navigate(`/rooms?search=${encodeURIComponent(city)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 fade-in">
      {/* Hero Section */}
      <section className="relative pt-8 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-orange-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <ScrollReveal animation="fade-down" duration={800}>
              <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-2xl text-base font-bold mb-6 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-white/20">
                <div className="relative">
                  <Shield className="w-5 h-5 text-white" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow- rounded-full flex items-center justify-center">

                  </div>
                </div>
                <span className="text-white font-extrabold tracking-wide">
                  SAFE STUDENT HOUSING PLATFROM
                </span>
                <div className="px-2 py-1 bg-white/20 rounded-full">
                  <span className="text-xs font-bold text-white">TRUSTED</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Awards & Recognition Section */}
            <ScrollReveal animation="fade-up" delay={200}>
              <div className="max-w-4xl mx-auto mb-8">
                {/* Section Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-yellow-500 dark:to-orange-600 backdrop-blur-sm rounded-full border border-yellow-500/50 dark:border-orange-500/50 mb-3 shadow-lg">
                    <Trophy className="w-5 h-5 text-white" />
                    <span className="text-white font-bold text-sm">Awards & Recognition</span>
                  </div>
                </div>

                {/* Awards Row - Horizontal Layout */}
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  {/* Gold Award - Most Searched */}
                  <div className="relative group">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                          <Trophy className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-black text-white">2024 MOST SEARCHED</h4>
                          <p className="text-white/90 text-sm font-semibold">Global Search Index</p>
                        </div>
                        <div className="px-3 py-1 bg-white/20 rounded-lg">
                          <span className="text-xs font-bold text-white">GOLD</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Silver Award - Top 10 Platforms */}
                  <div className="relative group">
                    <div className="bg-gradient-to-r from-slate-500 to-gray-600 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                          <Medal className="w-6 h-6 text-slate-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-black text-white">TOP 10 PLATFORMS</h4>
                          <p className="text-white/90 text-sm font-semibold">Industry Insights India</p>
                        </div>
                        <div className="px-3 py-1 bg-white/20 rounded-lg">
                          <span className="text-xs font-bold text-white">SILVER</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Main Hero Content */}
            <ScrollReveal animation="zoom" delay={400}>
              <div className="text-center mb-8">
                {/* Hero Headline */}
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-4 leading-tight">
                  <span className="block bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
                    Find Your Perfect
                  </span>
                  <span className="block text-white relative">
                    Student Accommodation
                  </span>
                </h1>

                {/* Value Proposition */}
                <p className="text-xl sm:text-2xl text-gray-300 mb-6 max-w-4xl mx-auto font-medium leading-relaxed">
                  Discover <span className="text-orange-400 font-bold">verified</span>,
                  <span className="text-pink-400 font-bold"> secure</span>, and
                  <span className="text-purple-400 font-bold"> affordable</span> student housing
                  with premium amenities and 24/7 safety for your peace of mind.
                </p>

                {/* Key Features Pills */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full backdrop-blur-sm">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-green-300 font-semibold text-sm">24/7 Security</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full backdrop-blur-sm">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="text-blue-300 font-semibold text-sm">Verified Owners</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-400/30 rounded-full backdrop-blur-sm">
                    <HomeIcon className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-300 font-semibold text-sm">Premium Amenities</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-400/30 rounded-full backdrop-blur-sm">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    <span className="text-orange-300 font-semibold text-sm">Prime Locations</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Enhanced Action Buttons */}
            <ScrollReveal animation="fade-up" delay={600}>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                {/* Primary CTA - Decreased color intensity */}
                <button
                  type="button"
                  onClick={() => navigate('/rooms')}
                  className="group relative overflow-hidden px-10 py-5 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 text-white rounded-2xl font-bold text-xl shadow-lg hover:shadow-orange-400/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3">
                    <Search className="w-6 h-6" />
                    <span>Find Student Housing</span>
                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                  </div>
                </button>

                {/* Secondary CTA - Improved colors */}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="group px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-500 hover:scale-105 hover:-translate-y-2 shadow-lg hover:shadow-emerald-500/25"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-white" />
                    <span>Register Now</span>
                  </div>
                </button>
              </div>
            </ScrollReveal>

            {/* Trust Indicators */}
            <ScrollReveal animation="fade-up" delay={800}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl font-black text-orange-400 mb-1">25K+</div>
                  <div className="text-sm text-gray-400 font-semibold">Happy Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-pink-400 mb-1">4,500+</div>
                  <div className="text-sm text-gray-400 font-semibold">Verified Rooms</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-purple-400 mb-1">1,500+</div>
                  <div className="text-sm text-gray-400 font-semibold">Cities Covered</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-black text-green-400 mb-1">4.88★</div>
                  <div className="text-sm text-gray-400 font-semibold">Safety Rating</div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Top 5 Cities Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-900/30 via-purple-900/30 to-pink-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Top Cities for <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">Student Housing</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Discover premium student accommodations in India's top educational and professional hubs
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {[
              {
                name: 'Kolkata',
                rooms: '850+',
                icon: Building2,
                popular: 'Cultural Capital',
                gradient: 'from-blue-500 to-cyan-500',
                bgGradient: 'from-blue-500/20 to-cyan-500/20'
              },
              {
                name: 'Bangalore',
                rooms: '1,200+',
                icon: Building2,
                popular: 'Silicon Valley',
                gradient: 'from-orange-500 to-red-500',
                bgGradient: 'from-orange-500/20 to-red-500/20'
              },
              {
                name: 'Delhi',
                rooms: '950+',
                icon: Landmark,
                popular: 'Capital City',
                gradient: 'from-purple-500 to-pink-500',
                bgGradient: 'from-purple-500/20 to-pink-500/20'
              },
              {
                name: 'Pune',
                rooms: '780+',
                icon: GraduationCap,
                popular: 'Education Hub',
                gradient: 'from-green-500 to-teal-500',
                bgGradient: 'from-green-500/20 to-teal-500/20'
              },
              {
                name: 'Chennai',
                rooms: '720+',
                icon: Waves,
                popular: 'Tech Center',
                gradient: 'from-indigo-500 to-blue-500',
                bgGradient: 'from-indigo-500/20 to-blue-500/20'
              }
            ].map((city, index) => {
              const CityIcon = city.icon;
              return (
                <div
                  key={city.name}
                  className="group relative stagger-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    onClick={() => handleQuickSearch(city.name)}
                    className={`group relative bg-gradient-to-br ${city.bgGradient} backdrop-blur-xl rounded-3xl p-8 text-center cursor-pointer hover:scale-105 hover:-translate-y-2 transition-all duration-200 shadow-2xl border border-white/10 hover:border-white/30 overflow-hidden`}
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-8 -translate-x-8"></div>
                    </div>

                    {/* City Icon */}
                    <div className="relative z-10 mb-6">
                      <div className="flex justify-center mb-4 transform group-hover:scale-105 transition-transform duration-200">
                        <CityIcon className="w-16 h-16 text-white drop-shadow-lg" />
                      </div>
                      <div className={`w-16 h-1 bg-gradient-to-r ${city.gradient} rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200`}></div>
                    </div>

                    {/* City Info */}
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-200 transition-all duration-300">
                        {city.name}
                      </h3>
                      <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${city.gradient} text-white rounded-full font-bold text-lg mb-3 shadow-lg`}>
                        <HomeIcon className="w-4 h-4 mr-2" />
                        {city.rooms}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-4">{city.popular}</p>

                      {/* Action Button */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className={`inline-flex items-center px-6 py-2 bg-gradient-to-r ${city.gradient} text-white rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transition-shadow duration-300`}>
                          <Search className="w-4 h-4 mr-2" />
                          Explore Rooms
                        </div>
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${city.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl`}></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Info */}
          <ScrollReveal animation="fade-up" delay={600}>
            <div className="text-center mt-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Click on any city to explore available student housing and PG accommodations
              </p>
              <div className="flex justify-center items-center mt-4 space-x-4">
                <div className="flex items-center space-x-2 text-green-400">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm font-medium">100% Verified Properties</span>
                </div>
                <div className="w-px h-4 bg-gray-600"></div>
                <div className="flex items-center space-x-2 text-blue-400">
                  <Star className="w-5 h-5" />
                  <span className="text-sm font-medium">Premium Locations</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats Section */}
      {/* Trust & Statistics Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full text-sm font-bold mb-6 shadow-lg">
                <Star className="w-4 h-4" />
                <span>Why Students Trust Us</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black mb-4">
                <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Trusted by Thousands
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Join thousands of students who have found their perfect, safe accommodation through our platform
              </p>
            </div>
          </ScrollReveal>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Users,
                label: "Daily Visitors",
                value: "50,000+",
                color: "from-blue-500 to-cyan-500",
                bgColor: "bg-blue-50 dark:bg-blue-900/20",
                description: "Students explore daily"
              },
              {
                icon: HomeIcon,
                label: "Rooms Booked",
                value: "6,500+",
                color: "from-green-500 to-emerald-500",
                bgColor: "bg-green-50 dark:bg-green-900/20",
                description: "Successfully booked daily"
              },
              {
                icon: Shield,
                label: "Safety Score",
                value: "100%",
                color: "from-purple-500 to-violet-500",
                bgColor: "bg-purple-50 dark:bg-purple-900/20",
                description: "Verified & secure"
              },
              {
                icon: Shield,
                label: "Girls Safety",
                value: "Premium",
                color: "from-pink-500 to-rose-500",
                bgColor: "bg-pink-50 dark:bg-pink-900/20",
                description: "Trusted & verified"
              }
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className={`relative ${stat.bgColor} rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/50`}>
                  {/* Gradient Background Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}></div>

                  {/* Content */}
                  <div className="relative z-10 text-center">
                    {/* Icon */}
                    <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Value */}
                    <div className={`text-4xl font-black mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </div>

                    {/* Label */}
                    <div className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
                      {stat.label}
                    </div>

                    {/* Description */}
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.description}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full border-2 border-white"></div>
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm ml-2">
                Join 25,000+ happy students
              </span>
            </div>
          </div>
        </div>
      </section>


      {/* Success Stories - Auto-rotating Reviews */}
      <SuccessStories />


    </div>
  );
};

export default Home;
