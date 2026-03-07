import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone,
  Mail,
  MessageCircle,
  Shield,
  Search,
  ChevronDown,
  User,
  Home,
  CreditCard,
  Headphones,
  Zap,
  BookOpen
} from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const Support = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const supportChannels = [
    {
      icon: Phone,
      title: 'Global Phone Line',
      description: 'Zero wait-time priority routing',
      contact: '+91 9946 66 0012',
      action: 'tel:+919946660012',
      color: 'from-blue-500 to-indigo-500',
      badge: '24/7 Live Agent'
    },
    {
      icon: Mail,
      title: 'Email Desk',
      description: 'For detailed written inquiries',
      contact: 'support@messwallah.com',
      action: 'mailto:support@messwallah.com',
      color: 'from-purple-500 to-pink-500',
      badge: '< 4h Response'
    },
    {
      icon: MessageCircle,
      title: 'Instant Chat',
      description: 'Connect directly in-app',
      contact: 'Start Secure Chat',
      action: '#',
      color: 'from-emerald-500 to-teal-500',
      badge: 'Live Now'
    },
    {
      icon: Shield,
      title: 'SOS Emergency',
      description: 'Absolute highest priority routing',
      contact: '1800-SAFE-GIRL',
      action: 'tel:1800-SAFE-GIRL',
      color: 'from-red-500 to-orange-500',
      badge: 'Critical Only'
    }
  ];

  const faqCategories = [
    {
      category: 'Leasing & Bookings',
      icon: Home,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      faqs: [
        {
          id: 'b1',
          question: 'How do I officially lock in my room?',
          answer: 'Navigate to any verified listing, tap "Book Now", select your move-in date, and process your secure security deposit. Your room is instantly locked in our system the second payment clears.'
        },
        {
          id: 'b2',
          question: 'What is the absolute latest I can cancel?',
          answer: 'Our policy grants you a 100% full refund if you cancel up to 48 hours precisely before your scheduled check-in time. Any cancellations within the 48-hour window forfeit 50% of the advance.'
        },
        {
          id: 'b3',
          question: 'What official ID is strictly required?',
          answer: 'Every resident must upload a high-res copy of a Government ID (Aadhaar or Passport) and an official College/Corporate ID badge for secondary validation.'
        }
      ]
    },
    {
      category: 'Security Infrastructure',
      icon: Shield,
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-900/20',
      faqs: [
        {
          id: 's1',
          question: 'How do you guarantee physical safety?',
          answer: 'We employ a zero-compromise approach: 24/7 CCTV in all common zones, armed quick-response teams within 5 minutes, mandatory biometric/card entry, and daily property audits.'
        },
        {
          id: 's2',
          question: 'Who do I contact in an active emergency?',
          answer: 'Dial 1800-SAFE-GIRL. This permanently bypasses all standard queues and connects you instantly to our highest-level security intervention directors.'
        }
      ]
    },
    {
      category: 'Financials & Billing',
      icon: CreditCard,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      faqs: [
        {
          id: 'f1',
          question: 'Which payment rails do you formally support?',
          answer: 'We support 100% of Indian payment rails: all major UPI apps (GPay, PhonePe, Paytm), Visa/Mastercard, core Net Banking, and select digital wallets.'
        },
        {
          id: 'f2',
          question: 'When exactly is monthly rent due?',
          answer: 'Rent is structurally due on the 1st of every month. A structured grace period exists until the 5th, after which a non-negotiable ₹500 late fee is automatically appended.'
        }
      ]
    },
    {
      category: 'Platform Access',
      icon: User,
      color: 'text-purple-500',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      faqs: [
        {
          id: 'a1',
          question: 'I am locked out. How do I reset my password?',
          answer: 'We completely eliminated passwords. Simply go to the login screen, enter your email, and we will email you a secure, mathematically unique Magic Link to authenticate instantly.'
        },
        {
          id: 'a2',
          question: 'Can I rent out multiple rooms simultaneously?',
          answer: 'Yes, corporate or bulk student bookings are permitted. However, every single occupant must individually pass our KYC background verification before keys are physically handed over.'
        }
      ]
    }
  ];

  const handleFaqToggle = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  // Perform deep dynamic filtering across all categories
  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-gray-900 pt-24 pb-24 px-4 sm:px-6 relative overflow-hidden transition-colors">

      {/* Immersive Ambient Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-blue-100/40 via-purple-100/30 to-pink-100/40 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10 -z-10 rounded-bl-full"></div>
      <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-emerald-300/20 dark:bg-emerald-600/10 blur-[130px] rounded-full -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Elite Support Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-20"
        >
          <motion.div variants={fadeInUp} className="inline-block mb-4">
            <span className="flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-5 py-2 rounded-full text-sm font-bold tracking-wide uppercase shadow-sm border border-purple-200 dark:border-purple-800/50">
              <Headphones className="w-4 h-4" /> Command Center
            </span>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
            Help & <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Support</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Our unified intelligence hub. Instantly search our deep knowledge base or connect directly with our global support agents.
          </motion.p>
        </motion.div>

        {/* Global Support Agent Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
        >
          {supportChannels.map((channel, index) => {
            const Icon = channel.icon;
            return (
              <motion.a
                key={index}
                href={channel.action}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-3xl p-8 shadow-xl border border-white/50 dark:border-gray-700/50 text-center group cursor-pointer relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${channel.color} opacity-10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity`}></div>

                <div className="absolute top-4 right-4 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 px-3 py-1 text-xs font-bold rounded-full">
                  {channel.badge}
                </div>

                <div className={`w-16 h-16 bg-gradient-to-br ${channel.color} rounded-2xl flex items-center justify-center mx-auto mb-6 mt-4 shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                  {channel.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-4">
                  {channel.description}
                </p>
                <div className={`text-lg font-black bg-gradient-to-r ${channel.color} bg-clip-text text-transparent group-hover:scale-105 transition-transform inline-block`}>
                  {channel.contact}
                </div>
              </motion.a>
            );
          })}
        </motion.div>

        {/* The Knowledge Base Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Left Column: Heavy Search Hub */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="lg:col-span-4"
          >
            <div className="sticky top-32">
              <motion.div variants={fadeInUp} className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-[2.5rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>

                <BookOpen className="w-12 h-12 text-blue-300 mb-6" />
                <h2 className="text-3xl font-black mb-4 tracking-tight leading-tight">Instant Knowledge Base</h2>
                <p className="text-blue-100 text-lg mb-8 font-medium opacity-90">
                  Type your exact question below to instantly query our deep operational databases.
                </p>

                <div className="relative group">
                  <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10" />
                  <input
                    type="text"
                    placeholder="E.g. How to cancel..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-white rounded-2xl text-gray-900 font-bold placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-400/50 shadow-inner transition-all text-lg"
                  />
                </div>

                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 flex items-center justify-between text-blue-100 font-medium"
                  >
                    <span>Live Filtering Engaged</span>
                    <Zap className="w-5 h-5 text-yellow-300 animate-pulse" />
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column: Intelligent FAQ Accordions */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="lg:col-span-8 space-y-12"
          >
            {filteredFaqs.length === 0 ? (
              <motion.div variants={fadeInUp} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl rounded-[2.5rem] p-16 text-center border border-gray-200 dark:border-gray-700">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Zero queries matched</h3>
                <p className="text-gray-500 font-medium">Try lowering your physical search parameters or contact an agent directly.</p>
              </motion.div>
            ) : (
              <AnimatePresence>
                {filteredFaqs.map((category, _catIndex) => {
                  const CategoryIcon = category.icon;
                  return (
                    <motion.div
                      key={category.category}
                      variants={fadeInUp}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`p-3 rounded-xl shadow-sm ${category.bg}`}>
                          <CategoryIcon className={`w-6 h-6 ${category.color}`} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                          {category.category}
                        </h2>
                      </div>

                      <div className="space-y-4">
                        {category.faqs.map((faq) => {
                          const isOpen = expandedFaq === faq.id;
                          return (
                            <motion.div
                              layout
                              key={faq.id}
                              className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border ${isOpen ? 'border-blue-300 dark:border-blue-500/50 shadow-lg' : 'border-gray-200 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-gray-600'} rounded-2xl overflow-hidden transition-all duration-300`}
                            >
                              <button
                                onClick={() => handleFaqToggle(faq.id)}
                                className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
                              >
                                <span className={`font-bold text-[16px] md:text-lg pr-6 transition-colors ${isOpen ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>
                                  {faq.question}
                                </span>
                                <div className={`w-8 h-8 rounded-full flex flex-shrink-0 items-center justify-center transition-colors ${isOpen ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-gray-100 dark:bg-gray-900 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30'}`}>
                                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : 'text-gray-500'}`} />
                                </div>
                              </button>

                              <AnimatePresence>
                                {isOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                  >
                                    <div className="px-6 pb-8 text-gray-600 dark:text-gray-300 font-medium leading-relaxed text-[15px] md:text-base border-t border-gray-100 dark:border-gray-800 pt-4 mt-2">
                                      {faq.answer}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Support;
