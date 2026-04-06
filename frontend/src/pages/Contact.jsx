import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  User,
  Home,
  Coffee,
  CheckCircle,
  Star,
  Heart,
  ChevronDown
} from 'lucide-react';
import toast from 'react-hot-toast';

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

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    userType: 'student'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    setFormData({
      name: '', email: '', phone: '', subject: '', message: '', userType: 'student'
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Message secured and sent! Our executive team will reply shortly.', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#333',
          color: '#fff',
          borderRadius: '16px'
        }
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '', userType: 'student' });
      setIsSubmitting(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'hello@messwallah.com',
      description: 'Response time: < 2 Hours',
      color: 'from-orange-500 to-red-500',
      href: 'mailto:hello@messwallah.com'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+91 9946 66 0012',
      description: '24/7 Global Priority Support',
      color: 'from-blue-500 to-indigo-500',
      href: 'tel:+919946660012'
    },
    {
      icon: MapPin,
      title: 'Headquarters',
      details: 'Prime Location, Bangalore',
      description: 'Corporate Office',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Clock,
      title: 'Operations',
      details: '24/7/365 Available',
      description: 'We never sleep',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const faqs = [
    {
      question: 'Exactly how do I lock in a premium room?',
      answer: 'After finding your ideal space via our advanced search, click "Book Now", select your dates, and secure the room instantly via our military-grade encrypted payment gateway.',
      icon: Home
    },
    {
      question: 'Are properties physically verified or just online?',
      answer: 'Our elite ground team conducts a rigorous 50-point physical inspection of every single property. Zero exceptions. We guarantee the photos exactly match reality.',
      icon: CheckCircle
    },
    {
      question: 'What happens if I need an emergency cancellation?',
      answer: 'Contact our 24/7 support line immediately. We handle medical and personal emergencies securely and empathetically on a case-by-case basis outside of normal cancellation windows.',
      icon: Star
    },
    {
      question: 'Is food natively included in the rent?',
      answer: 'Over 85% of our premium listings feature 3-time hygienic, home-cooked food. This is clearly indicated with a "Meals Included" badge on the property card.',
      icon: Coffee
    }
  ];

  const floatingVariants = {
    animate: {
      y: [-15, 15, -15],
      rotate: [0, 8, -8, 0],
      transition: { duration: 8, repeat: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 pt-24 pb-24 px-4 sm:px-6 relative overflow-hidden transition-colors duration-300">

      {/* Immersive 3D-Like Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div variants={floatingVariants} animate="animate" className="absolute top-20 left-[10%] w-64 h-64 bg-orange-300/20 dark:bg-orange-600/10 rounded-full blur-[80px]" />
        <motion.div variants={floatingVariants} animate="animate" style={{ animationDelay: '2s' }} className="absolute top-[40%] right-[5%] w-96 h-96 bg-pink-300/20 dark:bg-pink-600/10 rounded-full blur-[100px]" />
        <motion.div variants={floatingVariants} animate="animate" style={{ animationDelay: '4s' }} className="absolute bottom-10 left-[20%] w-72 h-72 bg-purple-300/20 dark:bg-purple-600/10 rounded-full blur-[90px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Elite Hero Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="text-center mb-24"
        >
          <motion.div variants={fadeInUp} className="inline-block mb-4">
            <span className="flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-5 py-2 rounded-full text-sm font-bold tracking-wide uppercase shadow-sm border border-orange-200 dark:border-orange-800/50">
              <MessageCircle className="w-4 h-4" /> 24/7 Support Network
            </span>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
            Let&apos;s <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">Connect</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Whether you&apos;re looking for your next home or wanting to list your property, our dedicated executive team is standing by to assist you instantly.
          </motion.p>
        </motion.div>

        {/* Floating Quick Contact Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
        >
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                onClick={() => info.href && window.open(info.href)}
                className={`bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-3xl p-8 shadow-xl border border-white/50 dark:border-gray-700/50 text-center group ${info.href ? 'cursor-pointer' : ''}`}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">
                  {info.title}
                </h3>
                <p className={`bg-gradient-to-r ${info.color} bg-clip-text text-transparent font-black text-lg mb-2`}>
                  {info.details}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                  {info.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Form Side - Takes up 7 columns on LG */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="lg:col-span-7"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/60 dark:border-gray-700/60 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-orange-400 to-pink-500 opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>

              <motion.h2 variants={fadeInUp} className="text-3xl font-black text-gray-900 dark:text-white mb-8 tracking-tight flex items-center gap-3">
                Send a Direct Message
              </motion.h2>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                {/* Dual Type Toggle */}
                <motion.div variants={fadeInUp}>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">I am a:</p>
                  <div className="flex bg-gray-100 dark:bg-gray-900 p-1.5 rounded-2xl w-full max-w-sm">
                    <button
                      type="button"
                      onClick={() => handleInputChange({ target: { name: 'userType', value: 'student' } })}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${formData.userType === 'student' ? 'bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                    >
                      <User className="w-4 h-4" /> Resident
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange({ target: { name: 'userType', value: 'owner' } })}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all ${formData.userType === 'owner' ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-md' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                    >
                      <Home className="w-4 h-4" /> Owner
                    </button>
                  </div>
                </motion.div>

                {/* Input Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={fadeInUp}>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white transition-all font-medium"
                      placeholder="John Doe"
                    />
                  </motion.div>
                  <motion.div variants={fadeInUp}>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white transition-all font-medium"
                      placeholder="john@example.com"
                    />
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div variants={fadeInUp}>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white transition-all font-medium"
                      placeholder="+91 98765 43210"
                    />
                  </motion.div>
                  <motion.div variants={fadeInUp}>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Inquiry Type</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white transition-all font-medium appearance-none"
                    >
                      <option value="">Select a category</option>
                      <option value="booking">Priority Booking Issue</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Corporate Partnership</option>
                      <option value="feedback">Platform Feedback</option>
                    </select>
                  </motion.div>
                </div>

                <motion.div variants={fadeInUp}>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Detailed Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 dark:text-white transition-all font-medium resize-none"
                    placeholder="How can we assist you today?"
                  />
                </motion.div>

                <motion.button
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center px-8 py-5 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-orange-500/30 focus:outline-none focus:ring-4 focus:ring-orange-500/50 disabled:opacity-70 transition-all"
                >
                  {isSubmitting ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="rounded-full h-6 w-6 border-b-2 border-white mr-3" />
                  ) : <Send className="w-6 h-6 mr-3" />}
                  {isSubmitting ? 'Transmitting Securely...' : 'Fire Message'}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* FAQ Side - Takes up 5 columns on LG */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="lg:col-span-5 flex flex-col justify-between"
          >
            <div className="mb-10">
              <motion.h2 variants={fadeInUp} className="text-3xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
                Quick Answers
              </motion.h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => {
                  const Icon = faq.icon;
                  const isOpen = expandedFaq === index;
                  return (
                    <motion.div
                      variants={fadeInUp}
                      key={index}
                      className={`bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border ${isOpen ? 'border-orange-300 dark:border-orange-500/50 shadow-md' : 'border-gray-200 text-gray-800 dark:border-gray-700/50 hover:border-orange-200 dark:hover:border-gray-600'} rounded-2xl overflow-hidden transition-all duration-300`}
                    >
                      <button
                        onClick={() => setExpandedFaq(isOpen ? null : index)}
                        className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-xl transition-colors ${isOpen ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="font-bold text-gray-900 dark:text-white text-[15px] pr-4">{faq.question}</span>
                        </div>
                        <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-500' : 'text-gray-400'}`} />
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="px-5 pb-6 pt-1 ml-14 text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Direct SOS Box */}
            <motion.div variants={fadeInUp} className="mt-auto bg-gradient-to-br from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl"></div>
              <Heart className="w-10 h-10 text-orange-400 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Still Need Us?</h3>
              <p className="text-gray-400 mb-6 font-medium">Bypass the form and talk directly to our core executive team right now.</p>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="tel:+919946660012"
                className="inline-flex items-center justify-center w-full px-6 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-bold transition-all"
              >
                <Phone className="w-5 h-5 mr-3 text-orange-400" />
                Tap to Call Directly
              </motion.a>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
