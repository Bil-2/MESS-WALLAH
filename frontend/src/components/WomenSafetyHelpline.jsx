import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiShield, 
  FiPhone, 
  FiAlertTriangle, 
  FiHeart, 
  FiMapPin,
  FiClock,
  FiUsers,
  FiX,
  FiExternalLink
} from 'react-icons/fi';

const WomenSafetyHelpline = ({ isFixed = false, showMinimized = false }) => {
  const [isExpanded, setIsExpanded] = useState(!showMinimized);
  const [isVisible, setIsVisible] = useState(true);

  const emergencyNumbers = [
    {
      name: "Women Helpline",
      number: "1091",
      description: "24/7 Women in Distress",
      icon: FiShield,
      color: "text-red-500",
      bgColor: "bg-red-500"
    },
    {
      name: "Police Emergency",
      number: "100",
      description: "Immediate Police Help",
      icon: FiAlertTriangle,
      color: "text-blue-500",
      bgColor: "bg-blue-500"
    },
    {
      name: "Child Helpline",
      number: "1098",
      description: "Child Protection Services",
      icon: FiHeart,
      color: "text-pink-500",
      bgColor: "bg-pink-500"
    },
    {
      name: "Domestic Violence",
      number: "181",
      description: "Domestic Violence Helpline",
      icon: FiUsers,
      color: "text-purple-500",
      bgColor: "bg-purple-500"
    }
  ];

  const safetyTips = [
    "Always inform someone about your location",
    "Trust your instincts - if something feels wrong, leave",
    "Keep emergency contacts readily available",
    "Verify property owner credentials before visiting",
    "Meet in public places for initial discussions",
    "Check property reviews and ratings thoroughly",
    "Visit properties during daytime hours",
    "Keep important documents secure"
  ];

  const safetyFeatures = [
    {
      icon: FiShield,
      title: "Verified Properties",
      description: "All properties verified for safety",
      color: "text-green-500"
    },
    {
      icon: FiUsers,
      title: "Background Checks",
      description: "Owner background verification",
      color: "text-blue-500"
    },
    {
      icon: FiMapPin,
      title: "Safe Locations",
      description: "Properties in secure neighborhoods",
      color: "text-purple-500"
    },
    {
      icon: FiClock,
      title: "24/7 Support",
      description: "Round-the-clock assistance",
      color: "text-orange-500"
    }
  ];

  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  const handleSafetyGuide = () => {
    window.open('/safety', '_blank');
  };

  if (!isVisible) return null;

  const containerClasses = isFixed 
    ? "fixed bottom-4 right-4 z-50 max-w-sm" 
    : "w-full max-w-4xl mx-auto";

  return (
    <motion.div
      className={containerClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 dark:from-red-900/20 dark:via-pink-900/20 dark:to-purple-900/20 border-2 border-red-200 dark:border-red-700 rounded-2xl shadow-2xl backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-red-200 dark:border-red-700">
          <div className="flex items-center gap-2">
            <motion.div 
              className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center"
              animate={{ 
                boxShadow: [
                  "0 0 0 0 rgba(239, 68, 68, 0.7)",
                  "0 0 0 8px rgba(239, 68, 68, 0)",
                  "0 0 0 0 rgba(239, 68, 68, 0)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <FiShield className="w-4 h-4 text-white" />
            </motion.div>
            <div>
              <h3 className="font-bold text-base text-red-700 dark:text-red-300">
                Women Safety Helpline
              </h3>
              <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                <FiClock className="w-3 h-3" />
                24/7 Emergency Support
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isFixed && (
              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-800 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isExpanded ? <FiX className="w-4 h-4 text-red-600" /> : <FiShield className="w-4 h-4 text-red-600" />}
                </motion.div>
              </motion.button>
            )}
            
            {isFixed && (
              <motion.button
                onClick={() => setIsVisible(false)}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-800 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiX className="w-4 h-4 text-red-600" />
              </motion.button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
                {/* Emergency Numbers - Left Column */}
                <div className="lg:col-span-1">
                  <h4 className="font-semibold text-red-700 dark:text-red-300 mb-3 flex items-center gap-2 text-sm">
                    <FiPhone className="w-4 h-4" />
                    Emergency Helplines
                  </h4>
                  
                  <div className="space-y-2">
                    {emergencyNumbers.map((helpline, index) => (
                      <motion.button
                        key={helpline.number}
                        onClick={() => handleCall(helpline.number)}
                        className="w-full flex items-center gap-3 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 border border-gray-200 dark:border-gray-700 group"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className={`w-8 h-8 ${helpline.bgColor} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <helpline.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left flex-1">
                          <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                            {helpline.name}
                          </div>
                          <div className={`font-bold ${helpline.color} text-lg`}>
                            {helpline.number}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {helpline.description}
                          </div>
                        </div>
                        <FiExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Safety Tips - Middle Column */}
                <div className="lg:col-span-1">
                  <h4 className="font-semibold text-red-700 dark:text-red-300 mb-3 flex items-center gap-2 text-sm">
                    <FiMapPin className="w-4 h-4" />
                    Safety Guidelines
                  </h4>
                  
                  <div className="space-y-2">
                    {safetyTips.map((tip, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300 p-2 bg-white/50 dark:bg-gray-800/50 rounded-lg"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{tip}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Safety Features - Right Column */}
                <div className="lg:col-span-1">
                  <h4 className="font-semibold text-red-700 dark:text-red-300 mb-3 flex items-center gap-2 text-sm">
                    <FiShield className="w-4 h-4" />
                    Our Safety Features
                  </h4>
                  
                  <div className="space-y-2">
                    {safetyFeatures.map((feature, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-gray-200 dark:border-gray-700"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <div className={`w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center`}>
                          <feature.icon className={`w-4 h-4 ${feature.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                            {feature.title}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {feature.description}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-red-200 dark:border-red-700 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 rounded-b-2xl">
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    onClick={handleSafetyGuide}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiShield className="w-4 h-4" />
                    Complete Safety Guide
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleCall("1091")}
                    className="flex-1 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 px-6 py-3 rounded-xl font-semibold border-2 border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiPhone className="w-4 h-4" />
                    Call Now: 1091
                  </motion.button>
                  
                  <motion.button
                    onClick={() => window.open('/contact', '_blank')}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiUsers className="w-4 h-4" />
                    Report Incident
                  </motion.button>
                </div>
                
                <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4 font-medium">
                  🛡️ Your safety is our priority. Don't hesitate to reach out for help anytime.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default WomenSafetyHelpline;
