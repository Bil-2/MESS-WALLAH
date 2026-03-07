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
  Mail,
  Home
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

const BookingPolicy = () => {
  const policyItems = [
    {
      icon: Calendar,
      title: 'Booking Requirements',
      color: 'from-blue-500 to-indigo-500',
      items: [
        'Valid government-issued photo ID (Aadhar Card, Passport)',
        'College/University ID strictly for student accommodations',
        'Recent passport-size photograph (digital upload)',
        'Verified emergency contact information',
        'Proof of income or official sponsorship letter (if applicable)'
      ]
    },
    {
      icon: CreditCard,
      title: 'Payment Specifications',
      color: 'from-emerald-500 to-teal-500',
      items: [
        'Security deposit: 1-2 months rent (100% refundable)',
        'First month rent due strictly at booking confirmation',
        'Monthly rent due transparently by the 5th of each month',
        'Late payment fee: ₹500 immediately after 7 days',
        'Payment methods: UPI, Credit/Debit Cards, Net Banking'
      ]
    },
    {
      icon: Clock,
      title: 'Cancellation Structure',
      color: 'from-orange-500 to-amber-500',
      items: [
        'Free absolute cancellation up to 48 hours before check-in',
        'Cancellation within 48 hours: 50% refund of advance payment',
        'No-show policy: Zero refund of advance payment',
        'Monthly bookings: Mandatory 30 days notice required for termination',
        'Emergency medical cancellations are considered case-by-case'
      ]
    },
    {
      icon: Shield,
      title: 'Safety Code',
      color: 'from-purple-500 to-pink-500',
      items: [
        'AI background verification mandatory for all residents',
        'Visitor policy: Digital registration required, strict timing restrictions',
        '24/7 CCTV monitoring in all structural common areas',
        'Emergency contact system tied directly to rapid response teams',
        'Surprise safety audits and compliance checks monthly'
      ]
    },
    {
      icon: FileText,
      title: 'Legal Terms',
      color: 'from-gray-700 to-gray-900 dark:from-gray-500 dark:to-gray-700',
      items: [
        'Minimum booking period: 1 month for PG, 3 months for apartments',
        'Maximum room occupancy strictly as per architectural capacity',
        'Subletting or unauthorized sharing is an instant eviction offense',
        'Property damage charges apply directly as per owner assessment',
        'Compliance with all local municipal regulations is mandatory'
      ]
    },
    {
      icon: RefreshCw,
      title: 'Refund Protocol',
      color: 'from-cyan-500 to-blue-500',
      items: [
        'Security deposit legally refunded within 7-10 business days post-checkout',
        'Deductions strictly limited to damages, unpaid bills, or heavy cleaning',
        'Advance rent refund executed perfectly as per cancellation policy',
        'Digital processing fee: ₹200 for all refunds below ₹5000',
        'Refunds routed securely to the original payment method exclusively'
      ]
    }
  ];

  const importantNotes = [
    {
      type: 'success',
      icon: CheckCircle,
      title: 'Guaranteed Inclusions',
      desc: 'You have guaranteed access to the following amenities.',
      items: [
        'Fully furnished accommodation with premium basic amenities',
        'High-speed WiFi connectivity and 24/7 power backup',
        'Professional housekeeping and deep maintenance services',
        'Complete common area access (kitchens, lounges, dining)',
        '24/7 elite security personnel and emergency support'
      ]
    },
    {
      type: 'warning',
      icon: AlertTriangle,
      title: 'Strict Restrictions',
      desc: 'Violation of these may result in severe warnings.',
      items: [
        'Zero smoking or alcohol consumption anywhere on premises',
        'Mandatory quiet hours: 10:00 PM to 7:00 AM',
        'No unregistered pets allowed (except official service animals)',
        'Guests must be digitally registered and obey timing curfews',
        'Commercial business activities are strictly prohibited inside rooms'
      ]
    },
    {
      type: 'error',
      icon: XCircle,
      title: 'Instant Termination',
      desc: 'Committing these offenses results in immediate eviction without refund.',
      items: [
        'Any violation of women safety protocols or physical harassment',
        'Intentional severe damage to property or structural modifications',
        'Sustained non-payment of rent dues for more than 15 days',
        'Egregious breach of house rules or breaking local state laws',
        'Secret subletting or allowing unauthorized permanent occupancy'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-gray-900 pt-24 pb-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Premium Ambient Background Elements */}
      <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-bl from-orange-100/40 via-pink-100/30 to-purple-100/40 dark:from-orange-900/10 dark:via-pink-900/10 dark:to-purple-900/10 -z-10 rounded-b-[150px] md:rounded-b-[300px]"></div>
      <div className="absolute -top-40 -left-60 w-[600px] h-[600px] bg-orange-300/20 dark:bg-orange-600/10 blur-[130px] rounded-full -z-10"></div>
      <div className="absolute top-80 right-0 w-96 h-96 bg-purple-300/20 dark:bg-purple-600/10 blur-[120px] rounded-full -z-10"></div>

      <div className="max-w-7xl mx-auto">
        {/* Dynamic Hero Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-24 relative"
        >
          <motion.div variants={fadeInUp} className="inline-block mb-4">
            <span className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-5 py-2 rounded-full text-sm font-bold tracking-wide uppercase shadow-sm border border-orange-200 dark:border-orange-800/50">
              <Home className="w-4 h-4" /> Transparent Leasing
            </span>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
            Booking <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Policy</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We believe in 100% crystal-clear transparency. Please review our mandatory booking protocols to ensure a flawlessly smooth living experience.
          </motion.p>
        </motion.div>

        {/* Master Policy Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24"
        >
          {policyItems.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-[2.5rem] p-8 shadow-xl border border-white/50 dark:border-gray-700/50 relative overflow-hidden group hover:shadow-2xl transition-all duration-300"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${section.color} opacity-10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity`}></div>

                <div className="flex flex-col gap-4 mb-8 relative z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${section.color} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
                    {section.title}
                  </h2>
                </div>

                <ul className="space-y-4 relative z-10">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <div className={`mt-2 w-2 h-2 rounded-full bg-gradient-to-br ${section.color} flex-shrink-0 shadow-sm`} />
                      <span className="text-gray-700 dark:text-gray-300 font-medium text-sm md:text-base">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Code of Conduct / Important Notes */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-24"
        >
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">The Resident Codex</h2>
            <p className="text-xl text-gray-500 dark:text-gray-400">Rules strictly enforced to protect our world-class community.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {importantNotes.map((note, index) => {
              const Icon = note.icon;
              const colorConfig = {
                success: { bg: 'bg-emerald-50 dark:bg-emerald-900/10', border: 'border-emerald-200 dark:border-emerald-800/50', gradient: 'from-emerald-500 to-teal-500', text: 'text-emerald-700 dark:text-emerald-400' },
                warning: { bg: 'bg-amber-50 dark:bg-amber-900/10', border: 'border-amber-200 dark:border-amber-800/50', gradient: 'from-amber-500 to-orange-500', text: 'text-amber-700 dark:text-amber-400' },
                error: { bg: 'bg-red-50 dark:bg-red-900/10', border: 'border-red-200 dark:border-red-800/50', gradient: 'from-red-500 to-pink-500', text: 'text-red-700 dark:text-red-400' }
              }[note.type];

              return (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className={`${colorConfig.bg} backdrop-blur-xl rounded-[2.5rem] p-8 shadow-lg border-2 ${colorConfig.border} relative overflow-hidden group`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${colorConfig.gradient} rounded-2xl flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                      {note.title}
                    </h3>
                  </div>
                  <p className={`font-semibold ${colorConfig.text} mb-6`}>{note.desc}</p>

                  <ul className="space-y-4">
                    {note.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3 bg-white/50 dark:bg-gray-900/50 p-3 rounded-xl border border-white/20 dark:border-gray-700/30">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${colorConfig.gradient} mt-1.5 flex-shrink-0 shadow-sm`} />
                        <span className="text-sm md:text-base text-gray-700 dark:text-gray-300 font-medium">
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

        {/* Floating Support Contact Card */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-500 to-pink-600 rounded-[3rem] p-12 md:p-16 text-white text-center shadow-2xl max-w-4xl mx-auto"
        >
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-10 rounded-full blur-3xl -mr-32 -mt-32"></div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight">Questions About a Clause?</h2>
            <p className="text-xl mb-10 text-orange-50 font-medium opacity-90 leading-relaxed">
              Our support team is on standby to help clarify any doubts regarding your specific booking terms or lease agreements.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.a
                href="tel:+919946660012"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-white/20 transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
                +91 9946 66 0012
              </motion.a>
              <motion.a
                href="mailto:support@messwallah.com"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-8 py-4 rounded-full font-bold text-lg text-white border border-white/30 hover:bg-white/20 transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
                support@messwallah.com
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingPolicy;
