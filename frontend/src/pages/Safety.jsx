import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Camera,
  Phone,
  UserCheck,
  Lock,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Users,
  Heart,
  Star,
  Eye,
  Headphones,
  FileCheck
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

const Safety = () => {
  const safetyFeatures = [
    {
      icon: Shield,
      title: '24/7 Security Monitoring',
      description: 'Round-the-clock security personnel and CCTV surveillance in all common areas',
      color: 'from-orange-500 to-red-500',
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
      color: 'from-emerald-500 to-teal-500',
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
      color: 'from-emerald-500 to-teal-500',
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
      color: 'from-emerald-500 to-teal-500'
    }
  ];

  const safetyStats = [
    { icon: Users, label: 'Safe Residents', value: '25,000+', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { icon: Shield, label: 'Verified Properties', value: '7,500+', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: Star, label: 'Safety Rating', value: '4.9/5', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { icon: Clock, label: 'Response Time', value: '<5 min', color: 'text-red-500', bg: 'bg-red-500/10' }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-gray-900 pt-24 pb-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-bl from-red-100/40 via-orange-100/30 to-pink-100/40 dark:from-red-900/10 dark:via-orange-900/10 dark:to-pink-900/10 -z-10 rounded-b-[150px]"></div>
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-red-300/20 dark:bg-red-600/10 blur-[120px] rounded-full -z-10"></div>
      <div className="absolute top-60 -right-20 w-80 h-80 bg-orange-300/20 dark:bg-orange-600/10 blur-[100px] rounded-full -z-10"></div>

      <div className="max-w-7xl mx-auto">
        {/* Dynamic Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-20 relative"
        >
          <motion.div variants={fadeInUp} className="inline-block mb-4">
            <span className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-5 py-2 rounded-full text-sm font-bold tracking-wide uppercase shadow-sm border border-red-200 dark:border-red-800/50">
              <Shield className="w-4 h-4" /> Uncompromising Security
            </span>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
            Safety <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Guidelines</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Your safety is our absolute top priority. Learn about our elite security protocols,
            rapid emergency response systems, and strict verification processes.
          </motion.p>
        </motion.div>

        {/* Floating Safety Stats */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24 relative z-10"
        >
          {safetyStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/50 dark:border-gray-700/50 text-center group"
              >
                <div className={`w-16 h-16 ${stat.bg} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-gray-500 dark:text-gray-400 font-medium text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Premium Core Safety Features */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-24"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">Our Elite Safety Features</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400">The impenetrable security infrastructure deployed at every property.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {safetyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -5 }}
                  className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-white/40 dark:border-gray-700/50 relative overflow-hidden group hover:shadow-2xl transition-all duration-300"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${feature.color} opacity-10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity`}></div>

                  <div className="flex items-center gap-5 mb-8 relative z-10">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        {feature.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed relative z-10">
                    {feature.description}
                  </p>

                  <ul className="space-y-4 relative z-10">
                    {feature.features.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-4">
                        <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded-full shrink-0">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
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

        {/* Actionable Personal Guidelines */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-24"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">Mandatory Guidelines</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400">Strict rules in place to ensure a peaceful environment for all residents.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 sm:px-0">
            {safetyGuidelines.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -8 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-lg border border-white/40 dark:border-gray-700/50 relative overflow-hidden group"
                >
                  <div className={`absolute h-2 w-full top-0 left-0 bg-gradient-to-r ${category.color}`}></div>
                  <div className="text-center mb-8 relative z-10 mt-4">
                    <div className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                      {category.category}
                    </h3>
                  </div>
                  <ul className="space-y-4 relative z-10">
                    {category.guidelines.map((guideline, guidelineIndex) => (
                      <li key={guidelineIndex} className="flex items-start gap-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <div className={`w-2.5 h-2.5 bg-gradient-to-br ${category.color} rounded-full mt-1.5 shrink-0 shadow-sm`} />
                        <span className="text-gray-700 dark:text-gray-300 text-sm md:text-base font-medium">
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

        {/* Global Emergency Hotlines (High Priority Red) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-24"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-red-600 dark:text-red-400 tracking-tight mb-4 flex items-center justify-center gap-4">
              <AlertTriangle className="w-10 h-10" /> Immediate Emergency
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400">Tap any hotline below to dial unconditionally immediately.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emergencyContacts.map((contact, index) => (
              <motion.a
                key={index}
                href={`tel:${contact.number}`}
                variants={fadeInUp}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-3xl p-8 shadow-xl border border-red-100 dark:border-red-900/50 hover:shadow-2xl hover:border-red-300 dark:hover:border-red-700 transition-all duration-300 group flex items-center gap-6"
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${contact.color} rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <Phone className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {contact.service}
                  </h3>
                  <p className="text-3xl font-black text-red-600 dark:text-red-400 tracking-tighter mb-2">
                    {contact.number}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    {contact.description}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Final Safety Guarantee CTA */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="relative overflow-hidden bg-gradient-to-br from-red-600 via-orange-600 to-pink-600 rounded-[3rem] p-12 md:p-20 text-white text-center shadow-2xl"
        >
          {/* Decorative CTA bg shapes */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white opacity-10 rounded-full blur-3xl -mr-40 -mt-40"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black opacity-10 rounded-full blur-3xl -ml-40 -mb-40"></div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <Shield className="w-24 h-24 mx-auto mb-8 text-white opacity-90 drop-shadow-2xl" />
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">Our Unbreakable Guarantee</h2>
            <p className="text-xl md:text-2xl mb-12 text-red-50 font-medium opacity-90 leading-relaxed">
              We are unconditionally committed to providing the safest accommodation experience in India. No compromises. Ever.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.a
                href="tel:1800-SAFE-GIRL"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-white text-red-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-white/20 transition-all duration-300"
              >
                <Phone className="w-6 h-6" />
                Call Emergency Line
              </motion.a>
              <motion.a
                href="/report"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-8 py-4 rounded-full font-bold text-lg text-white border border-white/30 hover:bg-white/20 transition-all duration-300"
              >
                <AlertTriangle className="w-6 h-6" />
                Report An Issue
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Safety;
