import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ShieldAlert,
  MessageSquare,
  User,
  Home,
  CreditCard,
  Phone,
  Mail,
  Send,
  CheckCircle,
  ArrowLeft,
  Flame,
  Zap,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

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

const Report = () => {
  const [formData, setFormData] = useState({
    issueType: '',
    priority: 'medium',
    subject: '',
    description: '',
    name: '',
    email: '',
    phone: '',
    roomId: '',
    attachments: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const issueTypes = [
    { id: 'safety', label: 'Safety Concern', icon: ShieldAlert, color: 'from-red-500 to-pink-600', description: 'Immediate physical security or harassment.' },
    { id: 'property', label: 'Property Damage', icon: Home, color: 'from-orange-500 to-amber-600', description: 'Severe structural or amenity failures.' },
    { id: 'payment', label: 'Billing Dispute', icon: CreditCard, color: 'from-emerald-500 to-teal-600', description: 'Unrecognized charges or refund issues.' },
    { id: 'technical', label: 'App Bug', icon: Zap, color: 'from-blue-500 to-indigo-600', description: 'A critical software error on the platform.' },
    { id: 'service', label: 'Service Quality', icon: MessageSquare, color: 'from-purple-500 to-fuchsia-600', description: 'Complaints regarding staff or operations.' },
    { id: 'other', label: 'Other', icon: User, color: 'from-gray-500 to-slate-600', description: 'Any other undocumented grievances.' }
  ];

  const priorities = [
    { value: 'low', label: 'Standard', icon: Clock, color: 'bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-400 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800', description: 'Normal queue processing.' },
    { value: 'medium', label: 'Elevated', icon: AlertTriangle, color: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:border-yellow-400 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800', description: 'Requires attention soon.' },
    { value: 'high', label: 'Urgent', icon: Flame, color: 'bg-orange-50 text-orange-700 border-orange-200 hover:border-orange-400 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800', description: 'Priority intervention.' },
    { value: 'critical', label: 'Critical SOS', icon: ShieldAlert, color: 'bg-red-50 text-red-700 border-red-200 hover:border-red-400 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 font-bold', description: 'Immediate lockdown/response.' }
  ];

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate secure 256-bit encrypted payload submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] dark:bg-gray-900 flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-400/20 dark:bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="max-w-xl w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-3xl rounded-[3rem] p-12 shadow-2xl border border-white/50 dark:border-gray-700/50 text-center relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/20"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>

          <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            Report Logged.
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 font-medium leading-relaxed">
            Your grievance dossier has been securely encrypted and transmitted directly to our specialized escalations team.
          </p>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 mb-10 border border-gray-100 dark:border-gray-800 font-mono text-sm">
            <p className="text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 font-bold">Secure Ticket ID</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white tracking-widest">
              #MW-{Math.random().toString(36).substr(2, 6).toUpperCase()}
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 w-full py-5 rounded-2xl font-bold text-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <ArrowLeft className="w-5 h-5" />
            Return to Dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-gray-900 pt-24 pb-24 px-4 sm:px-6 relative overflow-hidden transition-colors">

      {/* Heavy Warning Gradient Backgrounds */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-red-100/40 via-orange-100/30 to-transparent dark:from-red-900/10 dark:via-orange-900/10 -z-10 rounded-br-full blur-3xl"></div>
      <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-pink-200/20 dark:bg-pink-900/10 blur-[130px] rounded-full -z-10 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">

        {/* Urgent Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp} className="inline-block mb-4">
            <span className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-5 py-2 rounded-full text-sm font-bold tracking-wide uppercase shadow-sm border border-red-200 dark:border-red-800/50">
              <AlertTriangle className="w-4 h-4" /> Official Grievance Form
            </span>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
            Report an <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">Issue</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Submit a formalized report regarding any operational anomalies. Your safety, integrity, and comfort dictate our immediate action.
          </motion.p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* Issue Classification Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-white/60 dark:border-gray-700/60"
          >
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 tracking-tight flex items-center gap-3">
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Issue Classification
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {issueTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.issueType === type.id;
                return (
                  <motion.label
                    key={type.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative cursor-pointer p-5 rounded-3xl border-2 transition-all duration-300 flex flex-col h-full ${isSelected ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-900/20 shadow-md' : 'border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-orange-300 dark:hover:border-orange-700'}`}
                  >
                    <input type="radio" name="issueType" value={type.id} onChange={handleInputChange} className="sr-only" required />

                    <div className={`w-14 h-14 bg-gradient-to-br ${type.color} rounded-2xl flex items-center justify-center mb-4 shadow-sm ${isSelected ? 'scale-110' : ''} transition-transform`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className={`font-bold mb-1 ${isSelected ? 'text-orange-700 dark:text-orange-400' : 'text-gray-900 dark:text-white'}`}>
                        {type.label}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {type.description}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-4 right-4 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </motion.label>
                );
              })}
            </div>
          </motion.div>

          {/* Matrix Priority Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-white/60 dark:border-gray-700/60"
          >
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 tracking-tight flex items-center gap-3">
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Severity Index
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {priorities.map((priority) => {
                const Icon = priority.icon;
                const isSelected = formData.priority === priority.value;
                return (
                  <motion.label
                    key={priority.value}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`cursor-pointer p-5 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center text-center ${isSelected ? `border-current ring-4 ring-opacity-20 ${priority.color.split(' ')[1]}` : 'border-transparent bg-gray-50 dark:bg-gray-900/50 hover:bg-white inset-ring'} ${priority.color}`}
                  >
                    <input type="radio" name="priority" value={priority.value} onChange={handleInputChange} className="sr-only" required />

                    <div className="mb-3">
                      <Icon className={`w-8 h-8 ${isSelected ? 'scale-125' : 'opacity-70'} transition-transform`} />
                    </div>
                    <div className="text-lg font-black mb-1 capitalize tracking-wide">
                      {priority.label}
                    </div>
                    <p className="text-xs font-medium opacity-80 mt-auto">
                      {priority.description}
                    </p>
                  </motion.label>
                );
              })}
            </div>
          </motion.div>

          {/* Deep Data Payload */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-white/60 dark:border-gray-700/60"
          >
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 tracking-tight flex items-center gap-3">
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
              Detailed Intelligence
            </h2>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Subject Headline</label>
                  <input type="text" name="subject" value={formData.subject} onChange={handleInputChange} required className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white transition-all font-semibold" placeholder="Summarize the core issue" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Target Room/Asset ID</label>
                  <input type="text" name="roomId" value={formData.roomId} onChange={handleInputChange} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white transition-all font-semibold uppercase" placeholder="e.g. BLR-Z09" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Comprehensive Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} required rows={6} className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white transition-all font-medium resize-none" placeholder="Elaborate exactly what happened, when it occurred, and who was involved..." />
              </div>
            </div>

            <hr className="my-10 border-gray-200 dark:border-gray-700" />

            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">Reporter Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Legal Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full pl-14 pr-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white transition-all font-semibold" placeholder="Type name exactly as on ID" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Secure Contact Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full pl-14 pr-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white transition-all font-semibold" placeholder="Your primary inbox" />
                </div>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting || !formData.issueType || !formData.priority}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="mt-12 w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-5 rounded-2xl text-[19px] font-black shadow-xl hover:shadow-red-500/30 focus:outline-none focus:ring-4 focus:ring-red-500/50 disabled:opacity-60 transition-all uppercase tracking-wider"
            >
              {isSubmitting ? (
                <>
                  <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                  Transmitting Payload...
                </>
              ) : (
                <>
                  <Send className="w-6 h-6" />
                  Finalize & Submit Report Blueprint
                </>
              )}
            </motion.button>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6 font-medium">
              By submitting this automated form, you hereby swear under penalty of perjury that all attached data is 100% accurate.
            </p>
          </motion.div>
        </form>

        {/* Global Emergency Bypass */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-gradient-to-br from-red-600 to-pink-700 rounded-[3rem] p-12 text-white text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <ShieldAlert className="w-16 h-16 mx-auto mb-6 text-red-200" />
            <h3 className="text-4xl font-black mb-4 tracking-tight">Active Emergency?</h3>
            <p className="text-xl mb-10 text-red-100 font-medium">
              Bypass digital queues instantly. Engage the SOS switchboard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="tel:1800-SAFE-GIRL"
                className="flex items-center justify-center gap-3 bg-white text-red-600 px-8 py-4 rounded-full font-black text-lg hover:shadow-xl hover:shadow-white/20 transition-all w-full sm:w-auto"
              >
                <Phone className="w-6 h-6" />
                1800-SAFE-GIRL
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="tel:112"
                className="flex items-center justify-center gap-3 bg-red-900/50 backdrop-blur-md border border-red-400 text-white px-8 py-4 rounded-full font-black text-lg hover:bg-red-900/80 transition-all w-full sm:w-auto"
              >
                <AlertTriangle className="w-6 h-6 text-red-300" />
                Dial 112 Protocol
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Report;
