import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Calendar,
  CreditCard,
  CheckCircle,
  Users,
  ShieldCheck,
  Zap,
  Star
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: Search,
      title: "Discover Your Perfect Space",
      description: "Browse through hundreds of exclusively verified student accommodations and premium PG rooms in your preferred location.",
      color: "from-blue-500 to-indigo-500",
      details: ["Intelligent location-based filtering", "High-res verified photo galleries", "Transparent pricing & detailed amenity lists"]
    },
    {
      icon: MapPin,
      title: "Schedule An Inspection",
      description: "Book a highly convenient visit to physically inspect the property, meet the owner, and evaluate the neighborhood firsthand.",
      color: "from-purple-500 to-pink-500",
      details: ["Flexible scheduling directly through the app", "Secure in-person meetings with verified owners", "Comprehensive property condition checks"]
    },
    {
      icon: Calendar,
      title: "Reserve Instantly",
      description: "Select your precise move-in dates and ideal duration, locking in your room with our guaranteed reservation engine.",
      color: "from-pink-500 to-rose-500",
      details: ["Real-time room availability sync", "Customizable long-term or short-term stays", "Instant email & SMS booking confirmations"]
    },
    {
      icon: CreditCard,
      title: "Secure Digital Payment",
      description: "Execute your initial payment through our military-grade encrypted gateway, guaranteeing your absolute financial safety.",
      color: "from-orange-500 to-red-500",
      details: ["Zero hidden fees or surprise charges", "Multiple payment methods including UPI & Cards", "Instant digital receipts and legally compliant invoices"]
    },
    {
      icon: CheckCircle,
      title: "Move In Seamlessly",
      description: "Complete quick digital documentation, collect your keys effortlessly, and immediately start enjoying your new premium accommodation.",
      color: "from-emerald-500 to-teal-500",
      details: ["Paperless digital contract signing", "Streamlined, conflict-free handover ceremony", "24/7 dedicated resident support line"]
    }
  ];

  const benefits = [
    {
      icon: ShieldCheck,
      title: "100% Verified Properties",
      description: "Every single listing undergoes a rigorous 50-point physical inspection by our elite on-ground team before being approved.",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      icon: Zap,
      title: "Zero Brokerage",
      description: "We completely eliminate the middleman. You pay exactly the listed rent directly to the owner, saving you thousands of rupees.",
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      icon: Star,
      title: "Premium Living Guarantee",
      description: "If the room doesn't match the listing photos or mandatory standards, we provide an immediate 100% no-questions-asked refund.",
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 pt-24 pb-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[700px] bg-gradient-to-br from-blue-100/40 via-purple-100/30 to-pink-100/40 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10 -z-10 rounded-b-[150px] md:rounded-b-[300px]"></div>
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-purple-300/20 dark:bg-purple-600/10 blur-[120px] rounded-full -z-10"></div>

      <div className="max-w-7xl mx-auto">
        {/* Dynamic Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-20 relative"
        >
          <motion.div variants={fadeInUp} className="inline-block mb-4">
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-5 py-2 rounded-full text-sm font-bold tracking-wide uppercase shadow-sm border border-blue-200 dark:border-blue-800/50">
              The Journey to Home
            </span>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
            How It <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Works</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Finding your absolute perfect accommodation shouldn&apos;t be stressful. We&apos;ve engineered
            a flawlessly transparent, 5-step digital process that guarantees peace of mind.
          </motion.p>
        </motion.div>

        {/* The Core Promises (Benefits) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 relative z-10 px-4 sm:px-0"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-[2rem] p-8 shadow-xl border border-white/50 dark:border-gray-700/50 text-center group"
              >
                <div className={`w-20 h-20 ${benefit.bg} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-10 h-10 ${benefit.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
                  {benefit.title}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                  {benefit.description}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* The Vertical Stepper Timeline */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-32 relative"
        >
          <motion.div variants={fadeInUp} className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">The 5-Step Formula</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400">From searching to unlocking your front door.</p>
          </motion.div>

          <div className="relative max-w-5xl mx-auto px-4 sm:px-0">
            {/* The glowing vertical timeline spine */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1.5 h-[95%] top-4 bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.3)]" />

            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className={`relative flex flex-col lg:flex-row items-center mb-16 lg:mb-24 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                >
                  {/* Content Box */}
                  <div className={`w-full lg:w-1/2 ${index % 2 === 0 ? 'lg:pr-20' : 'lg:pl-20'} mb-8 lg:mb-0`}>
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-xl border border-white/40 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300 relative group overflow-hidden">
                      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${step.color} opacity-10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity`}></div>

                      <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="lg:hidden w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center font-bold text-xl text-gray-700 dark:text-gray-300 shadow-inner">
                          {index + 1}
                        </div>
                        <h3 className={`text-3xl font-bold bg-gradient-to-r ${step.color} bg-clip-text text-transparent tracking-tight`}>
                          {step.title}
                        </h3>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 leading-relaxed relative z-10">
                        {step.description}
                      </p>

                      <ul className="space-y-4 relative z-10">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start gap-4 p-3 bg-gray-50/80 dark:bg-gray-900/50 rounded-2xl hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                              {detail}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Center Node / Number Indicator */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 hidden lg:flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-white dark:bg-gray-900 rounded-full border-4 border-[#FDFBF7] dark:border-gray-900 flex items-center justify-center p-1.5 relative z-10 shadow-2xl group cursor-default">
                      <div className={`w-full h-full bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white drop-shadow-md" />
                      </div>
                    </div>
                    {/* The glowing step number */}
                    <div className="absolute -left-12 top-1/2 transform -translate-y-1/2 font-black text-6xl text-gray-200/50 dark:text-gray-800/50 select-none">
                      0{index + 1}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Massive Call To Action Module */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-[3rem] p-12 md:p-20 text-white text-center shadow-2xl"
        >
          {/* Decorative CTA bg shapes */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white opacity-5 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-black opacity-10 rounded-full blur-3xl -ml-40 -mb-40 pointer-events-none"></div>

          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">Ready to bypass the stress?</h2>
            <p className="text-xl md:text-2xl mb-12 text-blue-50 font-medium opacity-90 leading-relaxed">
              Join thousands of extremely satisfied students and professionals who have already absolutely revolutionized their daily living experience.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.button
                onClick={() => navigate('/rooms')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-white text-blue-600 px-10 py-5 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-white/20 transition-all duration-300 w-full sm:w-auto justify-center"
              >
                <Search className="w-6 h-6" />
                Start My Room Search
              </motion.button>
              <motion.button
                onClick={() => navigate('/register')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-10 py-5 rounded-full font-bold text-lg text-white border border-white/30 hover:bg-white/20 transition-all duration-300 w-full sm:w-auto justify-center"
              >
                <Users className="w-6 h-6" />
                List My Property
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HowItWorks;
