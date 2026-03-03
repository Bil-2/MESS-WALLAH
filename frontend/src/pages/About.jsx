import React from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Shield,
  Users,
  MapPin,
  Award,
  Target,
  CheckCircle,
  Star,
  Phone,
  Mail,
  Globe,
  Building,
  Check,
  TrendingUp,
  UserCheck,
  Home,
  Briefcase,
  Code
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

const About = () => {
  const stats = [
    { icon: Users, label: 'Happy Residents', value: '25,000+', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { icon: Building, label: 'Verified Properties', value: '7,500+', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { icon: MapPin, label: 'Cities Covered', value: '3,734+', color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { icon: Star, label: 'Average Rating', value: '4.9/5', color: 'text-amber-500', bg: 'bg-amber-500/10' }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'We prioritize the safety and security of every resident with comprehensive background checks and strict 24/7 monitoring protocols.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Heart,
      title: 'Empowering Women',
      description: 'Creating safe spaces that empower girls and women to confidently pursue their dreams, education, and careers with full independence.',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Users,
      title: 'Community Building',
      description: 'Fostering a highly supportive, inclusive community where residents can universally connect, grow, and support each other.',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: CheckCircle,
      title: 'Quality Assurance',
      description: 'Maintaining uncompromised high standards in accommodation quality, immaculate cleanliness, and premium service delivery.',
      color: 'from-emerald-400 to-teal-500'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Foundation',
      description: 'MessWallah was founded with a pristine vision to provide unmatched safe accommodation for girls.',
      icon: Home
    },
    {
      year: '2021',
      title: 'First 500 Properties',
      description: 'Reached our critical first milestone of 500 exclusively verified properties across 50 major cities.',
      icon: Building
    },
    {
      year: '2022',
      title: '10,000 Residents',
      description: 'Proudly welcomed our 10,000th resident and expanded operations to serve 500 distinct cities.',
      icon: Users
    },
    {
      year: '2023',
      title: 'Safety Innovation',
      description: 'Launched advanced proprietary safety features including AI monitoring and rapid emergency response teams.',
      icon: Shield
    },
    {
      year: '2024',
      title: 'National Presence',
      description: 'Achieved commanding presence in 3,734+ cities actively protecting 25,000+ happy, thriving residents.',
      icon: TrendingUp
    }
  ];

  const team = [
    { name: 'Priya Sharma', role: 'Founder & CEO', icon: Briefcase, description: 'Passionate about creating safe spaces for women with 10+ years in hospitality.' },
    { name: 'Rahul Gupta', role: 'CTO', icon: Code, description: 'Technology leader focused exclusively on building secure and infinitely scalable platforms.' },
    { name: 'Anjali Patel', role: 'Head of Safety', icon: Shield, description: 'Former high-level security consultant ensuring comprehensive, flawless safety protocols.' },
    { name: 'Vikram Singh', role: 'Head of Operations', icon: Users, description: 'Operations expert surgically managing property partnerships and quality standards.' }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-gray-900 pt-24 pb-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-orange-100/50 via-pink-100/30 to-purple-100/50 dark:from-orange-900/10 dark:via-pink-900/10 dark:to-purple-900/10 -z-10 rounded-b-[100px] sm:rounded-b-[200px]"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-300/30 dark:bg-orange-600/20 blur-[100px] rounded-full -z-10"></div>
      <div className="absolute top-40 -left-20 w-72 h-72 bg-pink-300/30 dark:bg-pink-600/20 blur-[100px] rounded-full -z-10"></div>

      <div className="max-w-7xl mx-auto">
        {/* Dynamic Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-20 relative"
        >
          <motion.div variants={fadeInUp} className="inline-block mb-4">
            <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase shadow-sm border border-orange-200 dark:border-orange-800/50">
              The Standard in Safety
            </span>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
            About <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">MessWallah</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Empowering girls and women with safe, secure, and uniquely comfortable accommodation solutions across India.
            <span className="block mt-2 font-medium text-gray-900 dark:text-gray-100">Your safety is our absolute priority.</span>
          </motion.p>
        </motion.div>

        {/* Floating Stats */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24 relative z-10"
        >
          {stats.map((stat, index) => {
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

        {/* Glassmorphic Mission & Vision */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24"
        >
          {/* Mission Card */}
          <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-[2rem] p-10 shadow-xl border border-white/40 dark:border-gray-700/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl -mr-20 -mt-20 transition-all duration-500 group-hover:bg-orange-400/20"></div>
            <div className="flex items-center gap-5 mb-8 relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Our Mission</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed relative z-10">
              To unconditionally revolutionize the accommodation experience for girls and women by providing hyper-safe, strictly verified, and incredibly comfortable living spaces that enable them to pursue their ambitions with unbreakable confidence and independence.
            </p>
          </motion.div>

          {/* Vision Card */}
          <motion.div variants={fadeInUp} whileHover={{ scale: 1.02 }} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-[2rem] p-10 shadow-xl border border-white/40 dark:border-gray-700/50 relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl -ml-20 -mb-20 transition-all duration-500 group-hover:bg-purple-400/20"></div>
            <div className="flex items-center gap-5 mb-8 relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Our Vision</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed relative z-10">
              To categorically conquer the industry and become India's most universally trusted platform for women's accommodation, creating an unparalleled network of safe spaces that empowers millions of girls to live independently and build massively successful careers.
            </p>
          </motion.div>
        </motion.div>

        {/* Premium Core Values Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-24"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">The Pillars of Our Success</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400">Our unwavering core values dictate absolutely everything we do.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-0">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{ y: -10 }}
                  className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-white/40 dark:border-gray-700/50 relative group"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}></div>
                  <div className={`w-14 h-14 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-6 shadow-md transition-transform duration-300 group-hover:rotate-6`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm lg:text-base">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Stepper Timeline UI */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-24 bg-white/50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-[3rem] p-8 md:p-16 backdrop-blur-3xl"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">Our Historic Journey</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400">Milestones that heavily define our exponential growth trajectory.</p>
          </motion.div>

          <div className="relative">
            {/* The vertical timeline spine */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1.5 h-full bg-gradient-to-b from-orange-500 via-pink-500 to-purple-600 rounded-full shadow-[0_0_15px_rgba(249,115,22,0.4)]" />

            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className={`relative flex flex-col lg:flex-row items-center mb-12 lg:mb-20 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                >
                  {/* Content Box */}
                  <div className={`w-full lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-16 lg:text-right' : 'lg:pl-16 text-left'} mb-8 lg:mb-0`}>
                    <div className={`bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 relative group`}>
                      <div className="text-3xl font-black bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent mb-3 tracking-tighter">
                        {milestone.year}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Center Node */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 hidden lg:flex items-center justify-center">
                    <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-full border-4 border-gray-100 dark:border-gray-800 flex items-center justify-center p-1 relative z-10 shadow-lg group">
                      <div className="w-full h-full bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* The Executive Team */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-24"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">Meet The Architects</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400">The brilliant minds engineering the safest homes in India.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl border border-white/20 dark:border-gray-700/50 text-center group"
              >
                <div className="flex justify-center mb-6">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full blur-md opacity-40 group-hover:opacity-70 transition-opacity"></div>
                    <div className="relative w-full h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-full border-2 border-white dark:border-gray-700 flex items-center justify-center z-10">
                      <member.icon className="w-10 h-10 text-orange-500" />
                    </div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                  {member.name}
                </h3>
                <p className="text-orange-600 dark:text-orange-400 font-semibold mb-4 text-sm uppercase tracking-wider">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Global CTA Banner */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-pink-600 to-purple-700 rounded-[3rem] p-12 md:p-20 text-white text-center shadow-2xl"
        >
          {/* Decorative CTA bg circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-black opacity-10 rounded-full blur-3xl -ml-32 -mb-32"></div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">Ready to shape the future of women's safety?</h2>
            <p className="text-xl md:text-2xl mb-12 text-orange-50 font-medium opacity-90 leading-relaxed">
              Have questions about our mission or urgently want to partner with us at a corporate level? We absolutely want to hear from you right now.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.a
                href="mailto:hello@messwallah.com"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-white/20 transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
                hello@messwallah.com
              </motion.a>
              <motion.a
                href="tel:+919946660012"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-8 py-4 rounded-full font-bold text-lg text-white border border-white/30 hover:bg-white/20 transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
                +91 9946 66 0012
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
