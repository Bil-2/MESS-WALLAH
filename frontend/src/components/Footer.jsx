import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiSearch, 
  FiShield, 
  FiUsers, 
  FiHome, 
  FiStar,
  FiExternalLink,
  FiAlertTriangle,
  FiFacebook,
  FiInstagram,
  FiTwitter
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const Footer = () => {
  const navigate = useNavigate();

  // Handle email click
  const handleEmailClick = () => {
    window.location.href = 'mailto:support@messwallah.com';
  };

  // Handle phone click
  const handlePhoneClick = () => {
    window.location.href = 'tel:+919946660012';
  };

  // Handle social media clicks
  const handleFacebookClick = () => {
    window.open('https://facebook.com/messwallah', '_blank');
  };

  const handleInstagramClick = () => {
    window.open('https://instagram.com/messwallah', '_blank');
  };

  const handleTwitterClick = () => {
    window.open('https://twitter.com/messwallah', '_blank');
  };

  // Handle map click
  const handleMapClick = () => {
    window.open('https://maps.google.com/?q=Koramangala,Bangalore,Karnataka,India', '_blank');
  };

  // Handle navigation - all routes are now available
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Handle report issue
  const handleReportIssue = () => {
    const subject = encodeURIComponent('Issue Report - MESS WALLAH');
    const body = encodeURIComponent('Please describe your issue here...');
    window.location.href = `mailto:support@messwallah.com?subject=${subject}&body=${body}`;
  };

  return (
    <footer className="bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100 dark:from-gray-800 dark:via-purple-800 dark:to-gray-800 text-gray-800 dark:text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div 
            className="md:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <div className="font-bold text-xl text-orange-400">MESS</div>
                <div className="font-bold text-xl">WALLAH</div>
              </div>
            </div>
            <p className="text-purple-300 mb-6">Find your Perfect Home</p>
            
            {/* Contact Information */}
            <div className="space-y-3">
              <motion.button
                onClick={handleEmailClick}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors group w-full text-left"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center group-hover:bg-red-400 transition-colors">
                  <FiMail className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm">support@messwallah.com</span>
                <FiExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
              
              <motion.button
                onClick={handlePhoneClick}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors group w-full text-left"
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center group-hover:bg-red-400 transition-colors">
                  <FiPhone className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm">+91 9946 66 0012</span>
                <FiExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </div>
            
            {/* Social Media */}
            <div className="mt-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Follow us:</p>
              <div className="flex gap-2">
                <motion.button
                  onClick={handleFacebookClick}
                  className="w-8 h-8 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Follow us on Facebook"
                >
                  <FiFacebook className="w-4 h-4 text-white" />
                </motion.button>
                
                <motion.button
                  onClick={handleInstagramClick}
                  className="w-8 h-8 bg-pink-500 hover:bg-pink-400 rounded-full flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Follow us on Instagram"
                >
                  <FiInstagram className="w-4 h-4 text-white" />
                </motion.button>
                
                <motion.button
                  onClick={handleTwitterClick}
                  className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Follow us on Twitter/X"
                >
                  <FiTwitter className="w-4 h-4 text-white" />
                </motion.button>
              </div>
            </div>
            
            {/* Office Location */}
            <motion.button
              onClick={handleMapClick}
              className="mt-6 p-3 bg-green-900/30 hover:bg-green-900/50 rounded-lg transition-colors group w-full text-left"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <FiMapPin className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-medium">Our Office:</span>
                <FiExternalLink className="w-3 h-3 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-gray-300 text-sm">
                Koramangala, Bangalore<br />
                Karnataka, India 560034
              </p>
            </motion.button>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <motion.button 
                  onClick={() => handleNavigation('/')} 
                  className="hover:text-orange-400 transition-colors text-left"
                  whileHover={{ x: 5 }}
                >
                  Home
                </motion.button>
              </li>
              <li>
                <motion.button 
                  onClick={() => handleNavigation('/rooms')} 
                  className="hover:text-orange-400 transition-colors text-left"
                  whileHover={{ x: 5 }}
                >
                  Rooms
                </motion.button>
              </li>
              <li>
                <motion.button 
                  onClick={() => handleNavigation('/about')} 
                  className="hover:text-orange-400 transition-colors text-left"
                  whileHover={{ x: 5 }}
                >
                  About Us
                </motion.button>
              </li>
              <li>
                <motion.button 
                  onClick={() => handleNavigation('/how-it-works')} 
                  className="hover:text-orange-400 transition-colors text-left"
                  whileHover={{ x: 5 }}
                >
                  How It Works
                </motion.button>
              </li>
              <li>
                <motion.button 
                  onClick={() => handleNavigation('/safety')} 
                  className="hover:text-orange-400 transition-colors text-left"
                  whileHover={{ x: 5 }}
                >
                  Safety Guidelines
                </motion.button>
              </li>
              <li>
                <motion.button 
                  onClick={() => handleNavigation('/privacy')} 
                  className="hover:text-orange-400 transition-colors text-left"
                  whileHover={{ x: 5 }}
                >
                  Privacy Policy
                </motion.button>
              </li>
              <li>
                <motion.button 
                  onClick={() => handleNavigation('/terms')} 
                  className="hover:text-orange-400 transition-colors text-left"
                  whileHover={{ x: 5 }}
                >
                  Terms & Conditions
                </motion.button>
              </li>
              <li>
                <motion.button 
                  onClick={() => handleNavigation('/booking-policy')} 
                  className="hover:text-orange-400 transition-colors text-left"
                  whileHover={{ x: 5 }}
                >
                  Booking Policy
                </motion.button>
              </li>
              <li>
                <motion.button 
                  onClick={() => handleNavigation('/support')} 
                  className="hover:text-orange-400 transition-colors text-left"
                  whileHover={{ x: 5 }}
                >
                  Support
                </motion.button>
              </li>
              <li>
                <motion.button 
                  onClick={() => handleNavigation('/contact')} 
                  className="hover:text-orange-400 transition-colors text-left"
                  whileHover={{ x: 5 }}
                >
                  Contact Us
                </motion.button>
              </li>
              <li>
                <motion.button 
                  onClick={handleReportIssue} 
                  className="hover:text-orange-400 transition-colors text-left flex items-center gap-1"
                  whileHover={{ x: 5 }}
                >
                  Report Issue
                  <FiExternalLink className="w-3 h-3" />
                </motion.button>
              </li>
            </ul>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-lg mb-4">Features</h3>
            <ul className="space-y-2 text-gray-400">
              <motion.li 
                className="flex items-center gap-2"
                whileHover={{ x: 5 }}
              >
                <FiSearch className="w-4 h-4 text-orange-400" />
                <span>Easy Room Search</span>
              </motion.li>
              <motion.li 
                className="flex items-center gap-2"
                whileHover={{ x: 5 }}
              >
                <FiShield className="w-4 h-4 text-green-400" />
                <span>Verified Safe Properties</span>
              </motion.li>
              <motion.li 
                className="flex items-center gap-2"
                whileHover={{ x: 5 }}
              >
                <FiUsers className="w-4 h-4 text-pink-400" />
                <span>Girls-Only Accommodations</span>
              </motion.li>
              <motion.li 
                className="flex items-center gap-2"
                whileHover={{ x: 5 }}
              >
                <FiHome className="w-4 h-4 text-blue-400" />
                <span>Instant Booking</span>
              </motion.li>
              <motion.li 
                className="flex items-center gap-2"
                whileHover={{ x: 5 }}
              >
                <FiStar className="w-4 h-4 text-yellow-400" />
                <span>Quality Assured Rooms</span>
              </motion.li>
              <motion.li 
                className="flex items-center gap-2"
                whileHover={{ x: 5 }}
              >
                <FiShield className="w-4 h-4 text-purple-400" />
                <span>24/7 Security Support</span>
              </motion.li>
            </ul>
          </motion.div>

          {/* Safety Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-lg mb-4 text-red-600 dark:text-red-400">Girls Safety Disclaimer</h3>
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <FiAlertTriangle className="w-2 h-2 text-white" />
                </div>
                <span className="text-red-600 dark:text-red-400 font-medium text-sm">Important Safety Notice</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                While we strive to provide safe accommodations, we encourage all users to verify property details, meet landlords in person, and trust their instincts. Your safety is paramount - always inform family/friends of your location and arrangements.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-gray-300 dark:border-gray-700 mt-12 pt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-600 dark:text-gray-400">
            Copyright 2024. MessWallah. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
