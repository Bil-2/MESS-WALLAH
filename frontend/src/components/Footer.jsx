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
  const handleSocialClick = (platform) => {
    const urls = {
      facebook: 'https://facebook.com/messwallah',
      instagram: 'https://instagram.com/messwallah',
      twitter: 'https://twitter.com/messwallah'
    };
    window.open(urls[platform], '_blank');
  };

  // Handle Google Maps click
  const handleMapClick = () => {
    const address = 'Koramangala, Bangalore, Karnataka, India 560034';
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
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
    <footer className="bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100 dark:from-gray-800 dark:via-purple-800 dark:to-gray-800 text-gray-800 dark:text-white py-16 px-4 sm:px-6 lg:px-8 footer-fade">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1 stagger-item">
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

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <button 
                onClick={handleEmailClick}
                className="group flex items-center gap-3 text-gray-300 hover:text-orange-400 transition-colors btn-hover"
              >
                <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center group-hover:bg-orange-500/30 transition-colors">
                  <FiMail className="w-4 h-4 text-orange-400" />
                </div>
                <span className="text-sm">support@messwallah.com</span>
              </button>

              <button 
                onClick={handlePhoneClick}
                className="group flex items-center gap-3 text-gray-300 hover:text-green-400 transition-colors btn-hover"
              >
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                  <FiPhone className="w-4 h-4 text-green-400" />
                </div>
                <span className="text-sm">+91 9946 66 0012</span>
              </button>

              <button 
                onClick={handleMapClick}
                className="group flex items-start gap-3 text-gray-300 hover:text-blue-400 transition-colors text-left btn-hover"
              >
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors mt-0.5">
                  <FiMapPin className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-blue-400 text-sm font-medium">Our Office:</span>
                    <FiExternalLink className="w-3 h-3 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-gray-300 text-sm">
                    Koramangala, Bangalore<br />
                    Karnataka, India 560034
                  </p>
                </div>
              </button>
            </div>

            {/* Social Media */}
            <div className="flex gap-3">
              <button 
                onClick={() => handleSocialClick('facebook')}
                className="w-8 h-8 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg flex items-center justify-center transition-colors scale-hover"
              >
                <FiFacebook className="w-4 h-4 text-blue-400" />
              </button>
              <button 
                onClick={() => handleSocialClick('instagram')}
                className="w-8 h-8 bg-pink-600/20 hover:bg-pink-600/30 rounded-lg flex items-center justify-center transition-colors scale-hover"
              >
                <FiInstagram className="w-4 h-4 text-pink-400" />
              </button>
              <button 
                onClick={() => handleSocialClick('twitter')}
                className="w-8 h-8 bg-blue-400/20 hover:bg-blue-400/30 rounded-lg flex items-center justify-center transition-colors scale-hover"
              >
                <FiTwitter className="w-4 h-4 text-blue-300" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="stagger-item">
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button 
                  onClick={() => handleNavigation('/')} 
                  className="hover:text-orange-400 transition-colors text-left hover-lift"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/rooms')} 
                  className="hover:text-orange-400 transition-colors text-left hover-lift"
                >
                  Rooms
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/about')} 
                  className="hover:text-orange-400 transition-colors text-left hover-lift"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/how-it-works')} 
                  className="hover:text-orange-400 transition-colors text-left hover-lift"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/safety')} 
                  className="hover:text-orange-400 transition-colors text-left hover-lift"
                >
                  Safety Guidelines
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/privacy')} 
                  className="hover:text-orange-400 transition-colors text-left hover-lift"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/terms')} 
                  className="hover:text-orange-400 transition-colors text-left hover-lift"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/booking-policy')} 
                  className="hover:text-orange-400 transition-colors text-left hover-lift"
                >
                  Booking Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/support')} 
                  className="hover:text-orange-400 transition-colors text-left hover-lift"
                >
                  Support
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/contact')} 
                  className="hover:text-orange-400 transition-colors text-left hover-lift"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/report')} 
                  className="hover:text-orange-400 transition-colors text-left hover-lift"
                >
                  Report Issue
                </button>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="stagger-item">
            <h3 className="font-semibold text-lg mb-4">Features</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center gap-2 hover-lift">
                <FiSearch className="w-4 h-4 text-orange-400" />
                <span>Easy Room Search</span>
              </li>
              <li className="flex items-center gap-2 hover-lift">
                <FiShield className="w-4 h-4 text-green-400" />
                <span>Verified Safe Properties</span>
              </li>
              <li className="flex items-center gap-2 hover-lift">
                <FiUsers className="w-4 h-4 text-blue-400" />
                <span>Trusted Community</span>
              </li>
              <li className="flex items-center gap-2 hover-lift">
                <FiHome className="w-4 h-4 text-purple-400" />
                <span>Quality Accommodations</span>
              </li>
              <li className="flex items-center gap-2 hover-lift">
                <FiStar className="w-4 h-4 text-yellow-400" />
                <span>Rated Properties</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Critical Safety Warning for Girls */}
        <div className="mt-12 mb-8">
          <div className="bg-gradient-to-r from-red-600 via-red-500 to-pink-600 rounded-2xl p-6 shadow-2xl border-2 border-red-400/50 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
                  <FiAlertTriangle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-white font-black text-xl mb-3 flex items-center gap-2">
                  <FiShield className="w-5 h-5 animate-pulse" />
                  🚨 CRITICAL SAFETY WARNING FOR GIRLS 🚨
                </h3>
                <div className="space-y-2 text-white/95 font-semibold">
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-300 rounded-full animate-ping"></span>
                    <strong>NEVER visit properties alone</strong> - Always bring a trusted friend or family member
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-300 rounded-full animate-ping delay-100"></span>
                    <strong>Meet only in daylight hours</strong> - Avoid evening or night property visits
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-300 rounded-full animate-ping delay-200"></span>
                    <strong>Verify owner identity</strong> - Check government ID and property documents
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-300 rounded-full animate-ping delay-300"></span>
                    <strong>Share location with family</strong> - Always inform someone about your whereabouts
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <button 
                    onClick={() => window.location.href = 'tel:1091'}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 hover:scale-105 flex items-center gap-2"
                  >
                    <FiPhone className="w-4 h-4" />
                    Women Helpline: 1091
                  </button>
                  <button 
                    onClick={() => window.location.href = 'tel:100'}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 hover:scale-105 flex items-center gap-2"
                  >
                    <FiPhone className="w-4 h-4" />
                    Police: 100
                  </button>
                  <button 
                    onClick={() => window.location.href = 'tel:1098'}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 hover:scale-105 flex items-center gap-2"
                  >
                    <FiPhone className="w-4 h-4" />
                    Child Helpline: 1098
                  </button>
                  <button 
                    onClick={() => window.location.href = 'tel:181'}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-bold text-sm transition-all duration-300 hover:scale-105 flex items-center gap-2"
                  >
                    <FiPhone className="w-4 h-4" />
                    Domestic Violence: 181
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-300/20 dark:border-gray-600/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                © 2024 MESS WALLAH. All rights reserved.
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                Made with ❤️ for safe student housing
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
             
              
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
