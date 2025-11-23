import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiLink, FiPhone, FiMail, FiUser, FiShield, FiX, FiArrowRight } from 'react-icons/fi';

/**
 * COMPREHENSIVE ACCOUNT LINKING NOTIFICATION COMPONENT
 * Handles unified authentication flow and prevents duplicate accounts
 * Guides users through account linking process for millions of users
 */

const AccountLinkingNotification = ({ 
  isVisible, 
  onClose, 
  linkingData, 
  onProceedToRegister,
  onProceedToLogin,
  accountStatus 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (isVisible && linkingData?.accountLinked) {
      // Show success animation for linked accounts
      setCurrentStep(3);
    }
  }, [isVisible, linkingData]);

  if (!isVisible) return null;

  const getNotificationType = () => {
    if (linkingData?.accountLinked) return 'success';
    if (linkingData?.canLink || accountStatus?.canLink) return 'linking';
    if (linkingData?.needsPasswordSetup) return 'completion';
    return 'info';
  };

  const notificationType = getNotificationType();

  const notificationConfig = {
    success: {
      icon: FiCheck,
      title: '🎉 Account Successfully Linked!',
      color: 'green',
      bgGradient: 'from-green-500 to-emerald-600'
    },
    linking: {
      icon: FiLink,
      title: '🔗 Account Linking Available',
      color: 'blue',
      bgGradient: 'from-blue-500 to-indigo-600'
    },
    completion: {
      icon: FiUser,
      title: '📝 Complete Your Profile',
      color: 'orange',
      bgGradient: 'from-orange-500 to-red-600'
    },
    info: {
      icon: FiShield,
      title: 'ℹ️ Account Information',
      color: 'gray',
      bgGradient: 'from-gray-500 to-gray-600'
    }
  };

  const config = notificationConfig[notificationType];

  const renderSuccessContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <div className="mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center"
        >
          <FiCheck className="w-10 h-10 text-green-600 dark:text-green-400" />
        </motion.div>
        
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Your accounts are now unified!
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {linkingData?.message || 'Your phone and email are now connected in one secure account.'}
        </p>
      </div>

      {linkingData?.linkingDetails && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <FiPhone className="w-4 h-4 text-green-600" />
              <span className="text-gray-700 dark:text-gray-300">
                Phone: {linkingData.user?.phone || 'Verified'}
              </span>
            </div>
            <FiArrowRight className="w-4 h-4 text-green-600" />
            <div className="flex items-center space-x-2">
              <FiMail className="w-4 h-4 text-green-600" />
              <span className="text-gray-700 dark:text-gray-300">
                Email: {linkingData.user?.email || 'Added'}
              </span>
            </div>
          </div>
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClose}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
      >
        Continue to Dashboard
      </motion.button>
    </motion.div>
  );

  const renderLinkingContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
          <FiLink className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 text-center">
          Link Your Accounts
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
          We found an existing account that can be linked with your current login method.
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                <FiPhone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Phone Account</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {accountStatus?.hasPhone ? 'Already verified' : 'Available for linking'}
                </p>
              </div>
            </div>
            {accountStatus?.hasPhone && <FiCheck className="w-5 h-5 text-green-600" />}
          </div>
        </div>

        <div className="flex justify-center">
          <FiArrowRight className="w-6 h-6 text-gray-400" />
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center">
                <FiMail className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Email Account</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {accountStatus?.hasEmail ? 'Already verified' : 'Add email and password'}
                </p>
              </div>
            </div>
            {accountStatus?.hasEmail && <FiCheck className="w-5 h-5 text-green-600" />}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onProceedToRegister}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <FiLink className="w-4 h-4" />
          <span>Link Accounts</span>
        </motion.button>
        
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium py-2 transition-colors"
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Why link accounts?</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Single login for both phone and email</li>
              <li>• Enhanced security with multiple verification methods</li>
              <li>• Complete profile with all your information</li>
              <li>• Better booking and communication experience</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const renderCompletionContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
          <FiUser className="w-8 h-8 text-orange-600 dark:text-orange-400" />
        </div>
        
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 text-center">
          Complete Your Profile
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
          {linkingData?.message || 'Add email and password to complete your account setup.'}
        </p>
      </div>

      {linkingData?.hint && (
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 mb-4">
          <p className="text-sm text-orange-800 dark:text-orange-200">
            💡 {linkingData.hint}
          </p>
        </div>
      )}

      <div className="space-y-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onProceedToRegister}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Complete Registration
        </motion.button>
        
        <button
          onClick={onProceedToLogin}
          className="w-full text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium py-2 transition-colors"
        >
          Try Login Instead
        </button>
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch (notificationType) {
      case 'success':
        return renderSuccessContent();
      case 'linking':
        return renderLinkingContent();
      case 'completion':
        return renderCompletionContent();
      default:
        return renderLinkingContent();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className={`bg-gradient-to-r ${config.bgGradient} p-6 rounded-t-2xl`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <config.icon className="w-6 h-6 text-white" />
                <h2 className="text-xl font-bold text-white">
                  {config.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {renderContent()}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AccountLinkingNotification;
