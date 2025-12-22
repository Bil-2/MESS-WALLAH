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
  Clock,
  TrendingUp,
  UserCheck,
  Home,
  Briefcase,
  Code
} from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const About = () => {
  const stats = [
    { icon: Users, label: 'Happy Residents', value: '25,000+', color: 'text-blue-600' },
    { icon: Building, label: 'Verified Properties', value: '4,500+', color: 'text-green-600' },
    { icon: MapPin, label: 'Cities Covered', value: '1,500+', color: 'text-purple-600' },
    { icon: Star, label: 'Average Rating', value: '4.9/5', color: 'text-yellow-600' }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'We prioritize the safety and security of every resident with comprehensive background checks and 24/7 monitoring.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Heart,
      title: 'Empowering Women',
      description: 'Creating safe spaces that empower girls and women to pursue their dreams with confidence and independence.',
      color: 'from-pink-500 to-purple-500'
    },
    {
      icon: Users,
      title: 'Community Building',
      description: 'Fostering a supportive community where residents can connect, grow, and support each other.',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: CheckCircle,
      title: 'Quality Assurance',
      description: 'Maintaining high standards in accommodation quality, cleanliness, and service delivery.',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Foundation',
      description: 'MessWallah was founded with a vision to provide safe accommodation for girls',
      icon: Home
    },
    {
      year: '2021',
      title: 'First 500 Properties',
      description: 'Reached our first milestone of 500 verified properties across 50 cities',
      icon: Building
    },
    {
      year: '2022',
      title: '10,000 Residents',
      description: 'Welcomed our 10,000th resident and expanded to 500 cities',
      icon: Users
    },
    {
      year: '2023',
      title: 'Safety Innovation',
      description: 'Launched advanced safety features including AI monitoring and emergency response',
      icon: Shield
    },
    {
      year: '2024',
      title: 'National Presence',
      description: 'Achieved presence in 1,500+ cities with 25,000+ happy residents',
      icon: TrendingUp
    }
  ];

  const team = [
    {
      name: 'Priya Sharma',
      role: 'Founder & CEO',
      icon: Briefcase,
      description: 'Passionate about creating safe spaces for women with 10+ years in hospitality'
    },
    {
      name: 'Rahul Gupta',
      role: 'CTO',
      icon: Code,
      description: 'Technology leader focused on building secure and scalable platforms'
    },
    {
      name: 'Anjali Patel',
      role: 'Head of Safety',
      icon: Shield,
      description: 'Former security consultant ensuring comprehensive safety protocols'
    },
    {
      name: 'Vikram Singh',
      role: 'Head of Operations',
      icon: Users,
      description: 'Operations expert managing property partnerships and quality standards'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-6">
            About MessWallah
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Empowering girls and women with safe, secure, and comfortable accommodation solutions
            across India. Your safety, our priority.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => {
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

        {/* Mission & Vision */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              To revolutionize the accommodation experience for girls and women by providing safe,
              verified, and comfortable living spaces that enable them to pursue their dreams with
              confidence and independence. We believe every woman deserves a secure home away from home.
            </p>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Vision</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              To become India's most trusted platform for women's accommodation, creating a network
              of safe spaces that empowers millions of girls to live independently, pursue education,
              and build successful careers without compromising on safety or comfort.
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-14 h-14 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {value.title}
                    </h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Journey Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Our Journey
          </h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-orange-500 to-pink-500 rounded-full" />
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className={`relative flex items-center mb-12 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                    }`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/20">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-800">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-pink-100 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                    <member.icon className="w-10 h-10 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-orange-600 dark:text-orange-400 font-semibold mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-8 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <p className="text-xl mb-8 opacity-90">
            Have questions about our mission or want to partner with us? We'd love to hear from you!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.a
              href="mailto:hello@messwallah.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300"
            >
              <Mail className="w-5 h-5" />
              hello@messwallah.com
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
            <motion.a
              href="https://messwallah.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-all duration-300"
            >
              <Globe className="w-5 h-5" />
              messwallah.com
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
