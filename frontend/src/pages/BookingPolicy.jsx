import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  CreditCard,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  FileText,
  Phone,
  Mail
} from 'lucide-react';

const BookingPolicy = () => {
  const policyItems = [
    {
      icon: Calendar,
      title: 'Booking Requirements',
      color: 'from-blue-500 to-indigo-500',
      items: [
        'Valid government-issued photo ID (Aadhar Card, Passport, or Driver\'s License)',
        'College/University ID for student accommodations',
        'Recent passport-size photograph',
        'Emergency contact information',
        'Proof of income or sponsorship letter (if applicable)'
      ]
    },
    {
      icon: CreditCard,
      title: 'Payment Terms',
      color: 'from-green-500 to-emerald-500',
      items: [
        'Security deposit: 1-2 months rent (refundable)',
        'First month rent due at booking confirmation',
        'Monthly rent due by 5th of each month',
        'Late payment fee: ₹500 after 7 days',
        'Payment methods: UPI, Cards, Net Banking, Digital Wallets'
      ]
    },
    {
      icon: Clock,
      title: 'Cancellation Policy',
      color: 'from-orange-500 to-red-500',
      items: [
        'Free cancellation up to 48 hours before check-in',
        'Cancellation within 48 hours: 50% refund of advance payment',
        'No-show policy: No refund of advance payment',
        'Monthly bookings: 30 days notice required for termination',
        'Emergency cancellations considered case-by-case'
      ]
    },
    {
      icon: Shield,
      title: 'Safety & Security',
      color: 'from-purple-500 to-pink-500',
      items: [
        'Background verification mandatory for all residents',
        'Visitor policy: Registration required, timing restrictions apply',
        'CCTV monitoring in common areas (privacy compliant)',
        'Emergency contact system with 24/7 response',
        'Regular safety audits and compliance checks'
      ]
    },
    {
      icon: FileText,
      title: 'Terms & Conditions',
      color: 'from-teal-500 to-cyan-500',
      items: [
        'Minimum booking period: 1 month for PG, 3 months for apartments',
        'Maximum occupancy as per room capacity',
        'Subletting or unauthorized sharing prohibited',
        'Property damage charges apply as per assessment',
        'Compliance with house rules and local regulations mandatory'
      ]
    },
    {
      icon: RefreshCw,
      title: 'Refund Policy',
      color: 'from-amber-500 to-yellow-500',
      items: [
        'Security deposit refunded within 7-10 business days after checkout',
        'Deductions for damages, unpaid bills, or cleaning charges',
        'Advance rent refund as per cancellation policy',
        'Processing fee: ₹200 for refunds below ₹5000',
        'Refunds processed to original payment method only'
      ]
    }
  ];

  const importantNotes = [
    {
      type: 'success',
      icon: CheckCircle,
      title: 'What\'s Included',
      items: [
        'Furnished accommodation with basic amenities',
        'WiFi connectivity and power backup',
        'Housekeeping and maintenance services',
        'Common area access (kitchen, lounge, etc.)',
        '24/7 security and emergency support'
      ]
    },
    {
      type: 'warning',
      icon: AlertTriangle,
      title: 'Important Restrictions',
      items: [
        'No smoking or alcohol consumption on premises',
        'Quiet hours: 10 PM to 7 AM',
        'No pets allowed (except service animals)',
        'Guests must be registered and follow timing restrictions',
        'Commercial activities strictly prohibited'
      ]
    },
    {
      type: 'error',
      icon: XCircle,
      title: 'Grounds for Immediate Termination',
      items: [
        'Violation of safety protocols or harassment',
        'Damage to property or unauthorized modifications',
        'Non-payment of dues for more than 15 days',
        'Breach of house rules or local laws',
        'Subletting or unauthorized occupancy'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Booking Policy
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Please read our booking terms and conditions carefully before making a reservation.
            These policies ensure a safe and comfortable experience for all residents.
          </p>
        </motion.div>

        {/* Policy Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {policyItems.map((section, index) => {
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

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16"
        >
          {importantNotes.map((note, index) => {
            const Icon = note.icon;
            const colorClasses = {
              success: 'from-green-500 to-emerald-500 border-green-200 dark:border-green-800',
              warning: 'from-amber-500 to-orange-500 border-amber-200 dark:border-amber-800',
              error: 'from-red-500 to-pink-500 border-red-200 dark:border-red-800'
            };

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border-2 ${colorClasses[note.type]}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 bg-gradient-to-r ${colorClasses[note.type].split(' ')[0]} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {note.title}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {note.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-8 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Questions About Our Policy?</h2>
          <p className="text-xl mb-8 opacity-90">
            Our support team is here to help clarify any doubts about our booking terms.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.a
              href="tel:+919946660012"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300"
            >
              <Phone className="w-5 h-5" />
              Call: +91 9946 66 0012
            </motion.a>
            <motion.a
              href="mailto:support@messwallah.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300"
            >
              <Mail className="w-5 h-5" />
              Email: support@messwallah.com
            </motion.a>
          </div>
        </motion.div>

        {/* Last Updated */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 dark:text-gray-400">
            Last updated: January 2024 | Version 2.1
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            MessWallah reserves the right to modify these policies with prior notice to users.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingPolicy;
