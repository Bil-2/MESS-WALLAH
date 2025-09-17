import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiSearch, 
  FiMapPin, 
  FiStar, 
  FiShield, 
  FiUsers, 
  FiHome,
  FiMail,
  FiPhone
} from 'react-icons/fi';
import WomenSafetyHelpline from '../components/WomenSafetyHelpline';
import SuccessStories from '../components/SuccessStories';

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [stats, setStats] = useState({
    totalRooms: 970,
    happyUsers: 10000,
    cities: 90,
    rating: 4.8
  });

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const mockRooms = [
        {
          id: 1,
          title: 'Cozy Single Room in Koramangala',
          location: 'Koramangala, Bangalore',
          rent: 8500,
          rating: 4.5,
          image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
          amenities: ['WiFi', 'AC', 'Food']
        },
        {
          id: 3,
          title: 'Girls Only PG in CP',
          location: 'Connaught Place, Delhi',
          rent: 15000,
          rating: 4.8,
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
          amenities: ['WiFi', 'Security', 'Food']
        }
      ];
      setFeaturedRooms(mockRooms);
    } catch (error) {
      console.error('Error fetching home data:', error);
      setFeaturedRooms([]);
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-orange-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full text-sm font-semibold mb-6 animate-bounce shadow-lg">
              <FiShield className="w-4 h-4 animate-pulse" />
              #1 SAFE MESS App for Students 
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
              <span className="bg-gradient-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
                Safe & Secure
              </span>
              <br />
              <span className="text-white animate-fade-in-up delay-300">Girls Accommodation</span>
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in-up delay-500">
              Find verified, safe, and comfortable rooms for girls with 24/7 security, modern amenities, and a supportive community environment.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in-up delay-700">
            <button
              onClick={() => navigate('/rooms')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-translate-y-1 transform"
            >
              <FiSearch className="w-5 h-5 animate-pulse" />
              Find Rooms
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-800/50 backdrop-blur-sm text-white border border-gray-600 rounded-xl font-semibold text-lg hover:bg-gray-700/50 transition-all duration-500 hover:scale-110 hover:-translate-y-1 transform"
            >
              <FiUsers className="w-5 h-5 animate-pulse" />
              Join Now
            </button>
          </div>
        </div>
      </section>

      {/* Top 5 Cities Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-900/30 via-purple-900/30 to-pink-900/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              🏙️ Top Cities for <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">All</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              Discover premium accommodations in India's top student and professional destinations
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {[
              { 
                name: 'Kolkata', 
                rooms: '2,500+', 
                image: '🏙️', 
                popular: 'Cultural Capital',
                gradient: 'from-blue-500 to-cyan-500',
                bgGradient: 'from-blue-500/20 to-cyan-500/20'
              },
              { 
                name: 'Bangalore', 
                rooms: '3,200+', 
                image: '🌆', 
                popular: 'Silicon Valley',
                gradient: 'from-orange-500 to-red-500',
                bgGradient: 'from-orange-500/20 to-red-500/20'
              },
              { 
                name: 'Delhi', 
                rooms: '2,800+', 
                image: '🏛️', 
                popular: 'Capital City',
                gradient: 'from-purple-500 to-pink-500',
                bgGradient: 'from-purple-500/20 to-pink-500/20'
              },
              { 
                name: 'Pune', 
                rooms: '2,100+', 
                image: '🎓', 
                popular: 'Education Hub',
                gradient: 'from-green-500 to-teal-500',
                bgGradient: 'from-green-500/20 to-teal-500/20'
              },
              { 
                name: 'Chennai', 
                rooms: '1,900+', 
                image: '🌊', 
                popular: 'Tech Center',
                gradient: 'from-indigo-500 to-blue-500',
                bgGradient: 'from-indigo-500/20 to-blue-500/20'
              }
            ].map((city, index) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
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
                  <div className="text-6xl mb-4 transform group-hover:scale-105 transition-transform duration-200">
                    {city.image}
                  </div>
                  <div className={`w-16 h-1 bg-gradient-to-r ${city.gradient} rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200`}></div>
                </div>

                {/* City Info */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-200 transition-all duration-300">
                    {city.name}
                  </h3>
                  <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${city.gradient} text-white rounded-full font-bold text-lg mb-3 shadow-lg`}>
                    <FiHome className="w-4 h-4 mr-2" />
                    {city.rooms}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium mb-4">{city.popular}</p>
                  
                  {/* Action Button */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className={`inline-flex items-center px-6 py-2 bg-gradient-to-r ${city.gradient} text-white rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transition-shadow duration-300`}>
                      <FiSearch className="w-4 h-4 mr-2" />
                      Explore Rooms
                    </div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${city.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl`}></div>
              </motion.div>
            ))}
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Click on any city to explore available rooms and accommodations
            </p>
            <div className="flex justify-center items-center mt-4 space-x-4">
              <div className="flex items-center space-x-2 text-green-400">
                <FiShield className="w-5 h-5" />
                <span className="text-sm font-medium">100% Verified Properties</span>
              </div>
              <div className="w-px h-4 bg-gray-600"></div>
              <div className="flex items-center space-x-2 text-blue-400">
                <FiStar className="w-5 h-5" />
                <span className="text-sm font-medium">Premium Locations</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">
            <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Trusted by Thousands
            </span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: FiUsers, label: "People Viewed", value: "5,000+", color: "text-blue-500" },
              { icon: FiHome, label: "Rooms Booked", value: "500+", color: "text-green-500" },
              { icon: FiShield, label: "Verified Safe", value: "100%", color: "text-purple-500" },
              { icon: FiStar, label: "Rating", value: "4.9★", color: "text-yellow-500" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl hover:scale-105 transition-transform duration-300">
                  <stat.icon className={`w-12 h-12 mx-auto mb-4 ${stat.color}`} />
                  <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Success Stories - Auto-rotating Reviews */}
      <SuccessStories />

      {/* Women Safety Helpline Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 dark:from-red-900/10 dark:via-pink-900/10 dark:to-purple-900/10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Your Safety is Our Priority
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-400 max-w-2xl mx-auto">
              We're committed to providing a safe environment for all women. Access emergency helplines and safety resources anytime.
            </p>
          </motion.div>
          
          <WomenSafetyHelpline isFixed={false} showMinimized={false} />
        </div>
      </section>

    </div>
  );
};

export default Home;
