import React from 'react';
import { motion } from 'framer-motion';
import {
  FiShield as Shield,
  FiCamera as Camera,
  FiPhone as Phone,
  FiUserCheck as UserCheck,
  FiLock as Lock,
  FiAlertTriangle as AlertTriangle,
  FiCheckCircle as CheckCircle,
  FiClock as Clock,
  FiMapPin as MapPin,
  FiUsers as Users,
  FiHeart as Heart,
  FiStar as Star,
  FiEye as Eye,
  FiHeadphones as Headphones,
  FiFileText as FileCheck
} from 'react-icons/fi';
import ScrollReveal from '../components/ScrollReveal';

const Safety = () => {
  const safetyFeatures = [
    {
      icon: Shield,
      title: '24/7 Security Monitoring',
      description: 'Round-the-clock security personnel and CCTV surveillance in all common areas',
      color: 'from-red-500 to-pink-500',
      features: [
        'Trained security guards on duty 24/7',
        'CCTV cameras in lobbies, corridors, and entrances',
        'Secure entry systems with access cards',
        'Regular security patrols and checks'
      ]
    },
    {
      icon: UserCheck,
      title: 'Verified Background Checks',
      description: 'Comprehensive verification of all residents and property owners',
      color: 'from-blue-500 to-indigo-500',
      features: [
        'Government ID verification for all residents',
        'Background checks through certified agencies',
        'Reference verification from previous accommodations',
        'Regular re-verification for long-term residents'
      ]
    },
    {
      icon: Camera,
      title: 'Smart Safety Technology',
      description: 'Advanced technology solutions for enhanced security and monitoring',
      color: 'from-purple-500 to-violet-500',
      features: [
        'AI-powered surveillance systems',
        'Motion detection and alerts',
        'Emergency panic buttons in rooms',
        'Mobile app integration for safety features'
      ]
    },
    {
      icon: Phone,
      title: 'Emergency Response System',
      description: 'Immediate response protocols for any safety concerns or emergencies',
      color: 'from-green-500 to-emerald-500',
      features: [
        'Dedicated emergency helpline: 1800-SAFE-GIRL',
        'Direct connection to local police and hospitals',
        'Trained emergency response team',
        'GPS tracking for emergency situations'
      ]
    }
  ];

  const safetyGuidelines = [
    {
      category: 'Personal Safety',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      guidelines: [
        'Always inform someone about your whereabouts',
        'Keep emergency contacts updated in your profile',
        'Use well-lit and populated routes when traveling',
        'Trust your instincts - report any suspicious activity',
        'Keep your room locked at all times'
      ]
    },
    {
      category: 'Digital Safety',
      icon: Lock,
      color: 'from-blue-500 to-cyan-500',
      guidelines: [
        'Never share personal information with strangers',
        'Use strong, unique passwords for your accounts',
        'Be cautious about sharing location on social media',
        'Report any harassment or inappropriate behavior',
        'Keep your app updated for latest security features'
      ]
    },
    {
      category: 'Property Safety',
      icon: CheckCircle,
      color: 'from-green-500 to-teal-500',
      guidelines: [
        'Familiarize yourself with emergency exits',
        'Know the location of fire extinguishers',
        'Report any maintenance issues immediately',
        'Follow all house rules and regulations',
        'Participate in safety drills and training'
      ]
    }
  ];

  const emergencyContacts = [
    {
      service: 'MessWallah Emergency',
      number: '1800-SAFE-GIRL',
      description: 'Our dedicated 24/7 girls safety helpline',
      color: 'from-red-500 to-pink-500'
    },
    {
      service: 'Police Emergency',
      number: '100',
      description: 'National emergency number for police',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      service: 'Women Helpline',
      number: '1091',
      description: 'National helpline for women in distress',
      color: 'from-purple-500 to-pink-500'
    },
    {
      service: 'Medical Emergency',
      number: '108',
      description: 'National ambulance and medical emergency',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const safetyStats = [
    { icon: Users, label: 'Safe Residents', value: '25,000+', color: 'text-green-600' },
    { icon: Shield, label: 'Verified Properties', value: '4,500+', color: 'text-blue-600' },
    { icon: Star, label: 'Safety Rating', value: '4.9/5', color: 'text-yellow-600' },
    { icon: Clock, label: 'Response Time', value: '<5 min', color: 'text-red-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Safety Guidelines
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your safety is our top priority. Learn about our comprehensive safety measures and
            guidelines to ensure a secure living experience.
          </p>
        </motion.div>

        {/* Safety Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {safetyStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 text-center"
              >
                <Icon className={`w-12 h-12 ${stat.color} mx-auto mb-4`} />
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Safety Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Our Safety Features
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {safetyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {feature.features.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Safety Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Safety Guidelines for Residents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {safetyGuidelines.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20"
                >
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {category.category}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {category.guidelines.map((guideline, guidelineIndex) => (
                      <li key={guidelineIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                          {guideline}
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Emergency Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Emergency Contacts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emergencyContacts.map((contact, index) => (
              <motion.a
                key={index}
                href={`tel:${contact.number}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-r ${contact.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Phone className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {contact.service}
                    </h3>
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {contact.number}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {contact.description}
                    </p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Safety Commitment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-8 text-white text-center"
        >
          <Shield className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Our Safety Commitment</h2>
          <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
            We are committed to providing the safest accommodation experience for girls.
            Our comprehensive safety measures, 24/7 support, and emergency response systems
            ensure your peace of mind and security.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.a
              href="tel:1800-SAFE-GIRL"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-8 py-4 rounded-full font-bold text-lg hover:bg-white/30 transition-all duration-300"
            >
              <Phone className="w-6 h-6" />
              Emergency: 1800-SAFE-GIRL
            </motion.a>
            <motion.a
              href="/report"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-8 py-4 rounded-full font-bold text-lg hover:bg-white/30 transition-all duration-300"
            >
              <AlertTriangle className="w-6 h-6" />
              Report Issue
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Safety;
