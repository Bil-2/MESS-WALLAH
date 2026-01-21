import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCalendar, FiUser, FiMail, FiPhone, FiCheck, FiAlertCircle, FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../utils/api';

const BookingModal = ({ room, onClose, user }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    duration: 1,
    specialRequests: '',
    guestDetails: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    }
  });
  const [razorpayOrder, setRazorpayOrder] = useState(null);
  const [bookingConfirmation, setBookingConfirmation] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, success, failed

  // Calculate pricing
  const calculatePricing = () => {
    const monthlyRent = room?.rentPerMonth || 0;
    const securityDeposit = room?.securityDeposit || 0;
    const duration = bookingData.duration;

    const rentTotal = monthlyRent * duration;
    const platformFee = Math.round(rentTotal * 0.05); // 5% platform fee
    const tax = Math.round(platformFee * 0.18); // 18% GST
    const ownerAmount = rentTotal + securityDeposit;
    const totalAmount = ownerAmount + platformFee + tax;

    return {
      monthlyRent,
      securityDeposit,
      rentTotal,
      platformFee,
      tax,
      ownerAmount,
      totalAmount
    };
  };

  const pricing = calculatePricing();

  // Validate Step 1
  const validateStep1 = () => {
    if (!bookingData.checkInDate) {
      toast.error('Please select a check-in date');
      return false;
    }

    const checkInDate = new Date(bookingData.checkInDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      toast.error('Check-in date cannot be in the past');
      return false;
    }

    return true;
  };

  // Validate Step 2 (Guest Details)
  const validateStep2 = () => {
    const { name, email, phone } = bookingData.guestDetails;

    if (!name || name.length < 2) {
      toast.error('Please enter your full name');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }

    return true;
  };

  // Handle Step 1 Next
  const handleStep1Next = async () => {
    if (!validateStep1()) return;

    try {
      setLoading(true);

      // Create booking request
      const response = await api.post('/bookings', {
        roomId: room._id,
        checkInDate: bookingData.checkInDate,
        duration: bookingData.duration,
        seekerInfo: bookingData.guestDetails,
        specialRequests: bookingData.specialRequests
      });

      if (response.data.success) {
        const booking = response.data.data.booking;
        setBookingConfirmation(booking);

        // Create Razorpay order
        const orderResponse = await api.post('/payments/create-order', {
          amount: pricing.totalAmount * 100, // Convert to paise
          currency: 'INR',
          bookingId: booking._id,
          notes: {
            roomTitle: room.title,
            checkInDate: bookingData.checkInDate,
            duration: bookingData.duration
          }
        });

        if (orderResponse.data.success) {
          setRazorpayOrder(orderResponse.data.data);
          setCurrentStep(2);
          toast.success('Booking created! Proceed to payment');
        }
      }
    } catch (error) {
      console.error('Booking creation error:', error);
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  // Load Razorpay Script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle Payment
  const handlePayment = async () => {
    if (!validateStep2()) return;

    setLoading(true);
    setPaymentStatus('processing');

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error('Failed to load payment gateway. Please try again.');
      setLoading(false);
      setPaymentStatus('failed');
      return;
    }

    const options = {
      key: razorpayOrder.keyId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'MESS WALLAH',
      description: `Booking for ${room.title}`,
      order_id: razorpayOrder.orderId,
      prefill: {
        name: bookingData.guestDetails.name,
        email: bookingData.guestDetails.email,
        contact: bookingData.guestDetails.phone
      },
      theme: {
        color: '#F97316' // Orange color
      },
      handler: async function (response) {
        try {
          // Verify payment
          const verifyResponse = await api.post('/payments/verify', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            bookingId: bookingConfirmation._id
          });

          if (verifyResponse.data.success) {
            setPaymentStatus('success');
            setCurrentStep(3);
            toast.success('Payment successful! Booking confirmed.');
          } else {
            setPaymentStatus('failed');
            toast.error('Payment verification failed');
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          setPaymentStatus('failed');
          toast.error('Payment verification failed');
        } finally {
          setLoading(false);
        }
      },
      modal: {
        ondismiss: function () {
          setLoading(false);
          setPaymentStatus('pending');
          toast.error('Payment cancelled');
        }
      }
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with Gradient & Progress */}
          <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
            >
              <FiX className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-bold mb-2">
              Book {room?.roomType === 'studio' ? 'Studio Apartment' : 'Room'} in {room?.address?.city}
            </h3>

            <p className="text-white/90 text-sm mb-6">
              {room?.address?.area}, {room?.address?.city}
            </p>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-4">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${currentStep >= step
                        ? 'bg-white text-orange-500 shadow-lg scale-110'
                        : 'bg-white/20 text-white/60'
                        }`}
                    >
                      {currentStep > step ? <FiCheck className="w-5 h-5" /> : step}
                    </div>
                    <span className="text-xs mt-2 text-white/80">
                      {step === 1 ? 'Details' : step === 2 ? 'Payment' : 'Confirm'}
                    </span>
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-16 h-1 rounded-full transition-all duration-300 ${currentStep > step ? 'bg-white' : 'bg-white/20'
                        }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 280px)' }}>
            {/* Step 1: Booking Details */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Booking Details
                </h4>

                <div className="space-y-6">
                  {/* Check-in Date & Duration */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Check-in Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="date"
                          value={bookingData.checkInDate}
                          onChange={(e) => setBookingData({ ...bookingData, checkInDate: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Duration (months) <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={bookingData.duration}
                        onChange={(e) => setBookingData({ ...bookingData, duration: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white transition-all"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
                          <option key={month} value={month}>
                            {month} month{month > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Guest Details */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          value={bookingData.guestDetails.name}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              guestDetails: { ...bookingData.guestDetails, name: e.target.value }
                            })
                          }
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          value={bookingData.guestDetails.email}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              guestDetails: { ...bookingData.guestDetails, email: e.target.value }
                            })
                          }
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="tel"
                          value={bookingData.guestDetails.phone}
                          onChange={(e) =>
                            setBookingData({
                              ...bookingData,
                              guestDetails: { ...bookingData.guestDetails, phone: e.target.value }
                            })
                          }
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white"
                          placeholder="10-digit mobile number"
                          maxLength="10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Special Requests (Optional)
                    </label>
                    <textarea
                      value={bookingData.specialRequests}
                      onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-gray-700 dark:text-white resize-none"
                      rows="3"
                      maxLength="500"
                      placeholder="Any special requirements or requests..."
                    />
                    <p className="text-xs text-gray-500 mt-1">{bookingData.specialRequests.length}/500 characters</p>
                  </div>

                  {/* Price Summary */}
                  <div className="bg-gradient-to-br from-orange-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Monthly Rent:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">₹{pricing.monthlyRent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Duration:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {bookingData.duration} month{bookingData.duration > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Security Deposit:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">₹{pricing.securityDeposit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Platform Fee (5%):</span>
                      <span className="font-semibold text-gray-900 dark:text-white">₹{pricing.platformFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 dark:text-gray-300">GST (18%):</span>
                      <span className="font-semibold text-gray-900 dark:text-white">₹{pricing.tax.toLocaleString()}</span>
                    </div>
                    <div className="border-t-2 border-orange-200 dark:border-gray-500 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-900 dark:text-white text-lg">Total Amount:</span>
                        <span className="font-black text-2xl bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                          ₹{pricing.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center py-8"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FiCheck className="w-12 h-12 text-white" />
                </div>

                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ready for Payment</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  Your booking details have been saved. Click below to proceed with secure payment via Razorpay.
                </p>

                {/* Payment Summary */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 mb-6 max-w-md mx-auto">
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Amount to Pay</p>
                    <p className="text-4xl font-black bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                      ₹{pricing.totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-left space-y-2 text-sm border-t border-gray-200 dark:border-gray-600 pt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Booking ID:</span>
                      <span className="font-mono font-semibold">{bookingConfirmation?.bookingId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Check-in:</span>
                      <span className="font-semibold">{new Date(bookingData.checkInDate).toLocaleDateString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                      <span className="font-semibold">{bookingData.duration} months</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-6">
                  <FiAlertCircle className="w-5 h-5" />
                  <span>Secure payment powered by Razorpay</span>
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
                  <FiCheck className="w-12 h-12 text-white" />
                </div>

                <h4 className="text-3xl font-black bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-4">
                  Booking Confirmed!
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                  Your payment has been received successfully.
                </p>

                {/* Booking Details */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 mb-6 max-w-md mx-auto">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Booking ID</p>
                  <p className="text-2xl font-black text-gray-900 dark:text-white mb-6 font-mono">
                    {bookingConfirmation?.bookingId}
                  </p>

                  <div className="space-y-3 text-left border-t border-green-200 dark:border-gray-500 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Room:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{room?.title}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Check-in Date:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {new Date(bookingData.checkInDate).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Duration:</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{bookingData.duration} months</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">Amount Paid:</span>
                      <span className="font-bold text-green-600 dark:text-green-400">₹{pricing.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6 max-w-md mx-auto">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    📧 Confirmation emails have been sent to you and the property owner.
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-3">
              {currentStep === 1 && (
                <>
                  <button
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStep1Next}
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Next: Payment →'
                    )}
                  </button>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <button
                    onClick={() => setCurrentStep(1)}
                    disabled={loading || paymentStatus === 'processing'}
                    className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={loading || paymentStatus === 'processing'}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {loading || paymentStatus === 'processing' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Pay ₹{pricing.totalAmount.toLocaleString()} →
                      </>
                    )}
                  </button>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <button
                    onClick={() => window.location.href = '/bookings'}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                  >
                    View My Bookings
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                  >
                    Close
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BookingModal;
