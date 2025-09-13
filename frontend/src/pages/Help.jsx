import React, { useState } from 'react';
import { Search, MessageCircle, Phone, Mail, Book, Users, HelpCircle, ChevronDown, ChevronRight } from 'lucide-react';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const categories = [
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Getting Started',
      description: 'Learn the basics of using MESS WALLAH',
      articles: 12
    },
    {
      icon: <Book className="w-8 h-8" />,
      title: 'Booking & Payments',
      description: 'Everything about bookings and payments',
      articles: 8
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Property Management',
      description: 'For property owners and managers',
      articles: 15
    },
    {
      icon: <HelpCircle className="w-8 h-8" />,
      title: 'Account & Profile',
      description: 'Manage your account settings',
      articles: 6
    }
  ];

  const faqs = [
    {
      question: 'How do I book a room on MESS WALLAH?',
      answer: 'To book a room, browse our listings, select your preferred property, choose your dates, and complete the booking process. You can pay securely through our platform using various payment methods.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit cards, debit cards, UPI, net banking, and popular digital wallets like Paytm, PhonePe, and Google Pay.'
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel your booking according to the cancellation policy of the specific property. Most properties offer free cancellation up to 24-48 hours before check-in.'
    },
    {
      question: 'How do I list my property?',
      answer: 'Property owners can list their mess accommodations by clicking "List Your Property" and following our simple 4-step process. It\'s free to list and takes just a few minutes.'
    },
    {
      question: 'Is my personal information secure?',
      answer: 'Yes, we use industry-standard encryption and security measures to protect your personal and payment information. We never share your data with third parties without your consent.'
    },
    {
      question: 'How do I contact property owners?',
      answer: 'Once you\'re interested in a property, you can contact the owner directly through our platform. We provide secure messaging and verified contact information.'
    },
    {
      question: 'What if I have issues with my accommodation?',
      answer: 'Our customer support team is available 24/7 to help resolve any issues. You can contact us through chat, email, or phone, and we\'ll work to resolve your concerns quickly.'
    },
    {
      question: 'How do I get a refund?',
      answer: 'Refunds are processed according to the property\'s cancellation policy. If you\'re eligible for a refund, it will be processed within 5-7 business days to your original payment method.'
    }
  ];

  const popularArticles = [
    'How to create the perfect property listing',
    'Understanding booking confirmations',
    'Payment security and protection',
    'Tips for first-time renters',
    'Managing multiple properties',
    'Resolving booking disputes'
  ];

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How can we help you?
          </h1>
          <p className="text-xl opacity-90 mb-8">
            Find answers to your questions and get the support you need
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help articles, FAQs, and guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Help Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Browse Help Topics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer">
                <div className="text-blue-600 dark:text-blue-400 mb-4">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {category.description}
                </p>
                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  {category.articles} articles
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm transition-colors duration-200">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {faq.question}
                    </span>
                    {expandedFaq === index ? (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Support */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md transition-colors duration-200">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Need More Help?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Start Live Chat
                </button>
                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Mail className="w-5 h-5 mr-2" />
                  Send Email
                </button>
                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Support
                </button>
              </div>
            </div>

            {/* Popular Articles */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md transition-colors duration-200">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Popular Articles
              </h3>
              <ul className="space-y-3">
                {popularArticles.map((article, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                    >
                      {article}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md transition-colors duration-200">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Contact Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">+91 1800-123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-gray-600 dark:text-gray-400">support@messwallah.com</span>
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  <strong>Support Hours:</strong><br />
                  Monday - Friday: 9 AM - 9 PM<br />
                  Saturday - Sunday: 10 AM - 6 PM
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Still Need Help Section */}
      <div className="bg-white dark:bg-gray-800 py-16 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Still Need Help?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Our friendly support team is available 24/7 to assist you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Contact Support
            </button>
            <button className="border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              Browse All Articles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
