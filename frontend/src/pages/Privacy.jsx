import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  Eye,
  Database,
  Share2,
  Cookie,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';

const Privacy = () => {
  const privacySections = [
    {
      icon: Database,
      title: 'Information We Collect',
      color: 'from-blue-500 to-indigo-500',
      items: [
        'Personal information: Name, email, phone number, address',
        'Identity documents: Government ID, college ID, photographs',
        'Payment information: Card details, transaction history',
        'Usage data: App interactions, search queries, preferences',
        'Device information: IP address, browser type, operating system'
      ]
    },
    {
      icon: UserCheck,
      title: 'How We Use Your Information',
      color: 'from-green-500 to-emerald-500',
      items: [
        'Account creation and user authentication',
        'Processing bookings and payments',
        'Background verification and safety checks',
        'Customer support and communication',
        'Service improvement and personalization'
      ]
    },
    {
      icon: Share2,
      title: 'Information Sharing',
      color: 'from-purple-500 to-pink-500',
      items: [
        'Property owners: Basic contact and verification details',
        'Payment processors: Encrypted payment information only',
        'Legal authorities: When required by law or safety concerns',
        'Service providers: Technical support and maintenance partners',
        'We never sell personal data to third parties'
      ]
    },
    {
      icon: Lock,
      title: 'Data Security',
      color: 'from-red-500 to-orange-500',
      items: [
        'End-to-end encryption for sensitive data',
        'Secure servers with regular security audits',
        'Multi-factor authentication for account access',
        'Regular data backups and disaster recovery',
        'Staff training on data protection protocols'
      ]
    },
    {
      icon: Cookie,
      title: 'Cookies & Tracking',
      color: 'from-amber-500 to-yellow-500',
      items: [
        'Essential cookies for app functionality',
        'Analytics cookies to improve user experience',
        'Preference cookies to remember your settings',
        'You can manage cookie preferences in settings',
        'No tracking for advertising purposes'
      ]
    },
    {
      icon: Eye,
      title: 'Your Privacy Rights',
      color: 'from-teal-500 to-cyan-500',
      items: [
        'Access your personal data anytime',
        'Request correction of inaccurate information',
        'Delete your account and associated data',
        'Download your data in portable format',
        'Opt-out of non-essential communications'
      ]
    }
  ];

  const dataRetention = [
    {
      type: 'Account Data',
      period: 'Until account deletion',
      description: 'Profile information, preferences, and settings'
    },
    {
      type: 'Booking History',
      period: '7 years',
      description: 'Transaction records for legal and tax compliance'
    },
    {
      type: 'Communication Logs',
      period: '2 years',
      description: 'Support tickets and customer service interactions'
    },
    {
      type: 'Usage Analytics',
      period: '1 year',
      description: 'Anonymized data for service improvement'
    }
  ];

  const safetyMeasures = [
    {
      icon: Shield,
      title: 'Girls Safety Priority',
      description: 'Special privacy protections for female users including restricted data sharing and enhanced verification.'
    },
    {
      icon: Lock,
      title: 'Secure Verification',
      description: 'Background checks are conducted by certified agencies with strict confidentiality agreements.'
    },
    {
      icon: AlertTriangle,
      title: 'Emergency Protocols',
      description: 'In safety emergencies, we may share location data with authorities and emergency contacts.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Your privacy is our priority. Learn how we collect, use, and protect your personal information
            while providing safe accommodation services.
          </p>
        </motion.div>

        {/* Privacy Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {privacySections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-14 h-14 bg-gradient-to-r ${section.color} rounded-2xl flex items-center justify-center`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>
                <ul className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <motion.li
                      key={itemIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (index * 0.1) + (itemIndex * 0.05) }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {item}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Data Retention */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20 mb-16"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Data Retention Periods
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dataRetention.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-orange-200 dark:border-orange-800"
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {item.type}
                </h3>
                <p className="text-orange-600 dark:text-orange-400 font-semibold mb-3">
                  Retained for: {item.period}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Safety Measures */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {safetyMeasures.map((measure, index) => {
            const Icon = measure.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-pink-200 dark:border-pink-800 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                  {measure.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {measure.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Contact for Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-8 text-white text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Privacy Questions or Concerns?</h2>
          <p className="text-xl mb-8 opacity-90">
            Contact our Data Protection Officer for any privacy-related inquiries.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.a
              href="mailto:privacy@messwallah.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300"
            >
              <Mail className="w-5 h-5" />
              privacy@messwallah.com
            </motion.a>
            <motion.a
              href="tel:+919946660012"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300"
            >
              <Phone className="w-5 h-5" />
              +91 9946 66 0012
            </motion.a>
          </div>
        </motion.div>

        {/* Compliance & Updates */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Compliance & Standards
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  IT Act 2000 (India) compliant
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  GDPR principles followed
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  ISO 27001 security standards
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Regular third-party audits
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Policy Updates
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                We may update this privacy policy to reflect changes in our practices or legal requirements.
                Users will be notified of significant changes via email or app notifications.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last updated: January 2024 | Version 3.2
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;
