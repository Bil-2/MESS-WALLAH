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
  Calendar,
  FileKey
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const Privacy = () => {
  const privacySections = [
    {
      icon: Database,
      title: 'Information We Collect',
      color: 'from-blue-500 to-cyan-500',
      items: [
        'Personal core data: Name, email address, phone number',
        'Crucial identity documents: Aadhaar, official college ID, photographs',
        'Financial records: Highly encrypted payment and transaction history',
        'Usage analytics: Advanced application interactions, search queries',
        'Device intelligence: Encrypted IP metrics, OS specifications'
      ]
    },
    {
      icon: UserCheck,
      title: 'How We Utilize Your Data',
      color: 'from-emerald-500 to-teal-500',
      items: [
        'Secure account creation and rigid user authentication',
        'Instantaneous processing of bookings and payments',
        'Aggressive background verification and continuous safety checks',
        'Direct connection to our 24/7 dedicated customer support',
        'Algorithmic personalization of your dashboard and search results'
      ]
    },
    {
      icon: Share2,
      title: 'Data Sharing Architecture',
      color: 'from-purple-500 to-fuchsia-500',
      items: [
        'Property owners receive ONLY essential contact data post-booking',
        'PCI-compliant payment gateways process encrypted finance data securely',
        'We enforce strict compliance with official legal and local authorities',
        'We definitively NEVER sell, trade, or leak personal data to third parties',
        'Your internal messaging is end-to-end encrypted locally'
      ]
    },
    {
      icon: FileKey,
      title: 'Your Ultimate Privacy Rights',
      color: 'from-pink-500 to-rose-500',
      items: [
        'Absolute right to access and download your complete personal dataset',
        'Immediate capability to permanently delete your account autonomously',
        'Ability to opt-out of all non-essential analytics tracking',
        'Granular control over specific email and SMS notifications',
        'Dedicated Data Protection Officer (DPO) accessible 24/7'
      ]
    }
  ];

  const dataRetention = [
    { type: 'Core Account Data', period: 'Until account deletion', description: 'Essential profile information, preferences, and saved locations.' },
    { type: 'Financial History', period: '7 years strictly', description: 'Mandatory transaction logs required for Indian legal/tax compliance.' },
    { type: 'Communication Logs', period: '2 years max', description: 'Internal support tickets and customer service interactions.' },
    { type: 'Usage Telemetry', period: 'Anonymized after 1 year', description: 'Behavioral analytics utilized solely for local app optimization.' }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-gray-900 pt-24 pb-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Immersive Background Glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-teal-100/40 via-cyan-100/30 to-blue-100/40 dark:from-teal-900/10 dark:via-cyan-900/10 dark:to-blue-900/10 -z-10 rounded-bl-full"></div>
      <div className="absolute top-40 left-0 w-96 h-96 bg-blue-300/20 dark:bg-blue-600/10 blur-[100px] rounded-full -z-10"></div>
      <div className="absolute bottom-40 right-0 w-96 h-96 bg-cyan-300/20 dark:bg-cyan-600/10 blur-[100px] rounded-full -z-10"></div>

      <div className="max-w-5xl mx-auto">
        {/* Dynamic Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-24 relative"
        >
          <motion.div variants={fadeInUp} className="inline-block mb-4">
            <span className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-5 py-2 rounded-full text-sm font-bold tracking-wide uppercase shadow-sm border border-blue-200 dark:border-blue-800/50">
              <Shield className="w-4 h-4" /> Military Grade Protection
            </span>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
            Privacy <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Policy</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Your data is not a commodity. We employ cutting-edge cryptography and strict protocols to brutally defend your absolute privacy.
          </motion.p>
        </motion.div>

        {/* The Massive Privacy Guarantee Banner */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-[2.5rem] p-10 md:p-14 mb-24 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10"
        >
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-20 -mb-20"></div>
          <div className="flex-1 relative z-10">
            <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">The Anti-Tracking Promise</h2>
            <p className="text-xl text-blue-50 opacity-90 leading-relaxed">
              We fundamentally disagree with invasive ad trackers. Your location, your bookings, and your financial data will entirely remain exclusively visible to you and our highly secured infrastructure.
            </p>
          </div>
          <div className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shrink-0 border-2 border-white/30 relative z-10 shadow-inner">
            <Lock className="w-16 h-16 text-white drop-shadow-lg" />
          </div>
        </motion.div>

        {/* Detailed Data Policies (The Core) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-24"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">Complete Transparency</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400">Exactly what we collect and hyper-specifically why we collect it.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {privacySections.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -8 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-white/50 dark:border-gray-700/50 relative overflow-hidden group hover:shadow-2xl transition-all duration-300"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${section.color} opacity-10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity`}></div>

                  <div className="flex items-center gap-5 mb-8 relative z-10">
                    <div className={`w-16 h-16 bg-gradient-to-br ${section.color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
                      {section.title}
                    </h3>
                  </div>

                  <ul className="space-y-4 relative z-10">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-4">
                        <div className="mt-1.5 w-2 h-2 rounded-full border border-gray-300 dark:border-gray-600 flex-shrink-0 group-hover:border-blue-500 transition-colors shadow-sm">
                          <div className={`w-full h-full bg-gradient-to-br ${section.color} rounded-full`}></div>
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
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

        {/* Data Retention Lifecycle Card */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-24 bg-white/70 dark:bg-gray-800/40 backdrop-blur-3xl rounded-[3rem] p-10 md:p-16 shadow-lg border border-white/50 dark:border-gray-700/50"
        >
          <motion.div variants={fadeInUp} className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 border-b border-gray-200 dark:border-gray-700/50 pb-10">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-4 flex items-center gap-4">
                <Calendar className="w-10 h-10 text-cyan-500" /> Destruction Timelines
              </h2>
              <p className="text-xl text-gray-500 dark:text-gray-400">Our self-executing data deletion protocols.</p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dataRetention.map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-cyan-50/50 dark:bg-cyan-900/10 rounded-2xl p-6 border border-cyan-100 dark:border-cyan-800/50 hover:bg-cyan-100/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {item.type}
                  </h3>
                  <span className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-400 text-xs font-bold rounded-full uppercase tracking-wider">
                    {item.period}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Legal Authority Contact Box */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="relative overflow-hidden bg-gray-900 rounded-[3rem] p-12 text-white text-center shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500 opacity-20 rounded-full blur-3xl -mr-32 -mt-32"></div>

          <div className="relative z-10">
            <Shield className="w-16 h-16 mx-auto mb-6 text-blue-400" />
            <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">Data Protection Officer</h2>
            <p className="text-lg mb-10 text-gray-300 max-w-2xl mx-auto">
              For any highly specific legal inquiries regarding GDPR compliances, IT Act 2000 structures, or formal localized data deletion requests.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.a
                href="mailto:privacy@messwallah.com"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 w-full md:w-auto shadow-lg shadow-blue-500/30"
              >
                <Mail className="w-5 h-5" />
                privacy@messwallah.com
              </motion.a>
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> ISO 27001 Certified System
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;
