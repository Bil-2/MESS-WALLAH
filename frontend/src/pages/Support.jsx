import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Shield,
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  User,
  Home,
  CreditCard,
  Settings,
  AlertTriangle,
  CheckCircle,
  Send
} from 'lucide-react';

const Support = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });

  const supportChannels = [
    {
      icon: Phone,
      title: '24/7 Phone Support',
      description: 'Call us anytime for immediate assistance',
      contact: '+91 9946 66 0012',
      action: 'tel:+919946660012',
      color: 'from-green-500 to-emerald-500',
      available: 'Available 24/7'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us detailed queries via email',
      contact: 'support@messwallah.com',
      action: 'mailto:support@messwallah.com',
      color: 'from-blue-500 to-indigo-500',
      available: 'Response within 4 hours'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team instantly',
      contact: 'Start Chat',
      action: '#',
      color: 'from-purple-500 to-pink-500',
      available: 'Mon-Sun 6AM-12AM'
    },
    {
      icon: Shield,
      title: 'Emergency Helpline',
      description: 'For safety concerns and emergencies',
      contact: '1800-SAFE-GIRL',
      action: 'tel:1800-SAFE-GIRL',
      color: 'from-red-500 to-pink-500',
      available: 'Emergency 24/7'
    }
  ];

  const faqCategories = [
    {
      category: 'Booking & Reservations',
      icon: Home,
      faqs: [
        {
          question: 'How do I book a room through MessWallah?',
          answer: 'You can book a room by browsing our listings, selecting your preferred accommodation, and clicking "Book Now". Fill in your details, make the payment, and you\'ll receive a confirmation email with all the details.'
        },
        {
          question: 'Can I cancel my booking?',
          answer: 'Yes, you can cancel your booking up to 24 hours before check-in for a full refund. Cancellations made within 24 hours are subject to our cancellation policy.'
        },
        {
          question: 'What documents do I need for booking?',
          answer: 'You need a valid government ID (Aadhar Card, Passport, or Driver\'s License), college ID (for students), and a recent photograph.'
        }
      ]
    },
    {
      category: 'Safety & Security',
      icon: Shield,
      faqs: [
        {
          question: 'How does MessWallah ensure girls\' safety?',
          answer: 'We have 24/7 CCTV monitoring, verified female-only sections, background-checked owners, emergency helplines, and regular safety audits of all properties.'
        },
        {
          question: 'What should I do in case of an emergency?',
          answer: 'Call our emergency helpline 1800-SAFE-GIRL immediately. We have a rapid response team available 24/7 for any safety concerns.'
        },
        {
          question: 'Are all properties verified?',
          answer: 'Yes, all properties undergo thorough verification including safety compliance, legal documentation, and owner background checks.'
        }
      ]
    },
    {
      category: 'Payments & Billing',
      icon: CreditCard,
      faqs: [
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept all major credit/debit cards, UPI, net banking, and digital wallets like Paytm, PhonePe, and Google Pay.'
        },
        {
          question: 'When do I need to pay?',
          answer: 'A security deposit is required at booking. Monthly rent is due on the 1st of each month. We send reminders 3 days before the due date.'
        },
        {
          question: 'How do I get a refund?',
          answer: 'Refunds are processed within 5-7 business days to your original payment method. Security deposits are refunded after checkout inspection.'
        }
      ]
    },
    {
      category: 'Account & Profile',
      icon: User,
      faqs: [
        {
          question: 'How do I update my profile information?',
          answer: 'Go to your profile section, click "Edit Profile", make the necessary changes, and save. Some changes may require verification.'
        },
        {
          question: 'I forgot my password. How do I reset it?',
          answer: 'Click "Forgot Password" on the login page, enter your email, and follow the instructions sent to your email to reset your password.'
        },
        {
          question: 'Can I have multiple bookings?',
          answer: 'Yes, you can have multiple active bookings, but each booking requires separate verification and payment.'
        }
      ]
    }
  ];

  const handleFaqToggle = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', contactForm);
  };

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Support Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We're here to help! Find answers to common questions or get in touch with our support team.
          </p>
        </motion.div>

        {/* Support Channels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {supportChannels.map((channel, index) => {
            const Icon = channel.icon;
            return (
              <motion.a
                key={index}
                href={channel.action}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 text-center group"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${channel.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {channel.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  {channel.description}
                </p>
                <p className="text-orange-600 dark:text-orange-400 font-semibold mb-2">
                  {channel.contact}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {channel.available}
                </p>
              </motion.a>
            );
          })}
        </motion.div>

        {/* FAQ Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-lg"
            />
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Frequently Asked Questions
          </h2>

          {filteredFaqs.map((category, categoryIndex) => {
            const CategoryIcon = category.icon;
            return (
              <div key={categoryIndex} className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <CategoryIcon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {category.category}
                  </h3>
                </div>

                <div className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 100 + faqIndex;
                    return (
                      <motion.div
                        key={faqIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * faqIndex }}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20"
                      >
                        <button
                          onClick={() => handleFaqToggle(globalIndex)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors duration-300 rounded-2xl"
                        >
                          <span className="font-semibold text-gray-900 dark:text-white pr-4">
                            {faq.question}
                          </span>
                          {expandedFaq === globalIndex ? (
                            <ChevronUp className="w-5 h-5 text-orange-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-orange-500 flex-shrink-0" />
                          )}
                        </button>
                        {expandedFaq === globalIndex && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-6 pb-4"
                          >
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Still Need Help?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
              Can't find what you're looking for? Send us a message and we'll get back to you.
            </p>

            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={contactForm.category}
                  onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="general">General Inquiry</option>
                  <option value="booking">Booking Support</option>
                  <option value="payment">Payment Issues</option>
                  <option value="safety">Safety Concerns</option>
                  <option value="technical">Technical Support</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  placeholder="Brief description of your inquiry"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full px-4 py-3 bg-white/50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  placeholder="Please provide detailed information about your inquiry..."
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Support;
