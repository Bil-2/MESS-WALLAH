import React from 'react';
import { Shield, Users, FileText, AlertCircle, HelpCircle } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const Terms = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing and using MESS WALLAH, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`
    },
    {
      title: "2. Use License",
      content: `Permission is granted to temporarily download one copy of the materials on MESS WALLAH's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
      
      • Modify or copy the materials
      • Use the materials for any commercial purpose or for any public display
      • Attempt to reverse engineer any software contained on the website
      • Remove any copyright or other proprietary notations from the materials`
    },
    {
      title: "3. User Accounts",
      content: `When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account. You agree not to disclose your password to any third party.`
    },
    {
      title: "4. Property Listings",
      content: `Property owners are responsible for the accuracy of their listings. MESS WALLAH does not guarantee the accuracy, completeness, or reliability of any listing information. All property descriptions, photos, and amenities must be truthful and current.`
    },
    {
      title: "5. Booking and Payments",
      content: `All bookings are subject to availability and confirmation by the property owner. Payment processing is handled securely through our platform. Cancellation policies vary by property and are clearly stated in each listing.`
    },
    {
      title: "6. User Conduct",
      content: `You agree not to use the service to:
      
      • Upload or transmit any content that is unlawful, harmful, or offensive
      • Impersonate any person or entity
      • Interfere with or disrupt the service or servers
      • Attempt to gain unauthorized access to any portion of the website
      • Use the service for any illegal or unauthorized purpose`
    },
    {
      title: "7. Privacy Policy",
      content: `Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our service. By using our service, you agree to the collection and use of information in accordance with our Privacy Policy.`
    },
    {
      title: "8. Disclaimer",
      content: `The materials on MESS WALLAH's website are provided on an 'as is' basis. MESS WALLAH makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.`
    },
    {
      title: "9. Limitations",
      content: `In no event shall MESS WALLAH or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on MESS WALLAH's website, even if MESS WALLAH or its authorized representative has been notified orally or in writing of the possibility of such damage.`
    },
    {
      title: "10. Accuracy of Materials",
      content: `The materials appearing on MESS WALLAH's website could include technical, typographical, or photographic errors. MESS WALLAH does not warrant that any of the materials on its website are accurate, complete, or current. MESS WALLAH may make changes to the materials contained on its website at any time without notice.`
    },
    {
      title: "11. Links",
      content: `MESS WALLAH has not reviewed all of the sites linked to our website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by MESS WALLAH of the site. Use of any such linked website is at the user's own risk.`
    },
    {
      title: "12. Modifications",
      content: `MESS WALLAH may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.`
    },
    {
      title: "13. Governing Law",
      content: `These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 pt-24 pb-12 px-4">
      {/* Header */}
      <ScrollReveal animation="fade-up">
        <div className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <FileText className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Terms of Service
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Please read these terms and conditions carefully before using our service.
              </p>
              <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                Last updated: January 15, 2024
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Introduction */}
        <ScrollReveal animation="fade-up" delay={100}>
          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-6 mb-8 transition-colors duration-200">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Important Notice
                </h2>
                <p className="text-blue-800 dark:text-blue-200">
                  These Terms of Service constitute a legally binding agreement between you and MESS WALLAH.
                  By using our platform, you acknowledge that you have read, understood, and agree to be bound by these terms.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Terms Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <ScrollReveal key={index} animation="fade-up" delay={index * 50}>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm transition-colors duration-200">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  {section.title}
                </h2>
                <div className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Contact Information */}
        <ScrollReveal animation="fade-up">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mt-12 transition-colors duration-200">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-gray-600 dark:text-gray-400">
              <div>Email: legal@messwallah.com</div>
              <div>Phone: +91 1800-123-4567</div>
              <div>Address: MESS WALLAH Legal Department, Bangalore, India</div>
            </div>
          </div>
        </ScrollReveal>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <ScrollReveal animation="fade-up" delay={0}>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm text-center transition-colors duration-200">
              <Shield className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Privacy Policy
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Learn how we protect your personal information
              </p>
              <button type="button" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                Read Privacy Policy
              </button>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={100}>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm text-center transition-colors duration-200">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Community Guidelines
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Guidelines for respectful community interaction
              </p>
              <button type="button" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                View Guidelines
              </button>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200}>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm text-center transition-colors duration-200">
              <HelpCircle className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Help & Support
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Get answers to frequently asked questions
              </p>
              <button type="button" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                Get Help
              </button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default Terms;
