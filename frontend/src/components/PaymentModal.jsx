import React, { useState, useEffect, memo } from 'react';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';

const PaymentModal = memo(({
  isOpen,
  onClose,
  booking,
  onPaymentSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    upiId: '',
    walletType: 'paytm'
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock payment processing
  const processPaymentMutation = useMutation(
    async (paymentInfo) => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock payment success (90% success rate)
      if (Math.random() > 0.1) {
        return {
          success: true,
          transactionId: `TXN${Date.now()}`,
          amount: paymentInfo.amount,
          method: paymentInfo.method
        };
      } else {
        throw new Error('Payment failed. Please try again.');
      }
    },
    {
      onSuccess: (data) => {
        toast.success(`Payment successful! Transaction ID: ${data.transactionId}`);
        onPaymentSuccess(data);
        onClose();
      },
      onError: (error) => {
        toast.error(error.message || 'Payment failed. Please try again.');
      }
    }
  );

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Validate payment data
      if (paymentMethod === 'card') {
        if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv || !paymentData.cardholderName) {
          toast.error('Please fill in all card details');
          return;
        }
      } else if (paymentMethod === 'upi') {
        if (!paymentData.upiId) {
          toast.error('Please enter UPI ID');
          return;
        }
      }

      await processPaymentMutation.mutateAsync({
        amount: booking?.totalAmount || 0,
        method: paymentMethod,
        bookingId: booking?.id,
        ...paymentData
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={isProcessing}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Booking Summary */}
          <div className="bg-orange-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-orange-900 mb-2">Booking Summary</h3>
            <div className="space-y-1 text-sm text-orange-800">
              <div className="flex justify-between">
                <span>Room:</span>
                <span className="font-medium">{booking?.room?.title}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-medium">{booking?.duration} months</span>
              </div>
              <div className="flex justify-between">
                <span>Monthly Rent:</span>
                <span className="font-medium">₹{booking?.room?.price}</span>
              </div>
              <div className="flex justify-between font-bold text-orange-900 pt-2 border-t border-orange-200">
                <span>Total Amount:</span>
                <span>₹{booking?.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Select Payment Method</h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-lg border-2 transition-all ${paymentMethod === 'card'
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">💳</div>
                  <div className="text-xs font-medium">Card</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-lg border-2 transition-all ${paymentMethod === 'upi'
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">📱</div>
                  <div className="text-xs font-medium">UPI</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`p-3 rounded-lg border-2 transition-all ${paymentMethod === 'wallet'
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">👛</div>
                  <div className="text-xs font-medium">Wallet</div>
                </div>
              </button>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handlePayment} className="space-y-4">
            {paymentMethod === 'card' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={paymentData.cardholderName}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, cardholderName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="John Doe"
                    disabled={isProcessing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={paymentData.cardNumber}
                    onChange={(e) => setPaymentData(prev => ({
                      ...prev,
                      cardNumber: formatCardNumber(e.target.value)
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    disabled={isProcessing}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={paymentData.expiryDate}
                      onChange={(e) => setPaymentData(prev => ({
                        ...prev,
                        expiryDate: formatExpiryDate(e.target.value)
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="MM/YY"
                      maxLength="5"
                      disabled={isProcessing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={paymentData.cvv}
                      onChange={(e) => setPaymentData(prev => ({
                        ...prev,
                        cvv: e.target.value.replace(/\D/g, '')
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="123"
                      maxLength="4"
                      disabled={isProcessing}
                    />
                  </div>
                </div>
              </>
            )}

            {paymentMethod === 'upi' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  UPI ID
                </label>
                <input
                  type="text"
                  value={paymentData.upiId}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, upiId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="yourname@paytm"
                  disabled={isProcessing}
                />
              </div>
            )}

            {paymentMethod === 'wallet' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Wallet
                </label>
                <select
                  value={paymentData.walletType}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, walletType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  disabled={isProcessing}
                >
                  <option value="paytm">Paytm</option>
                  <option value="phonepe">PhonePe</option>
                  <option value="googlepay">Google Pay</option>
                  <option value="amazonpay">Amazon Pay</option>
                </select>
              </div>
            )}

            {/* Security Notice */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-sm text-green-800">
                  Your payment is secured with 256-bit SSL encryption
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium rounded-lg hover:from-orange-600 hover:to-red-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" color="white" />
                    <span className="ml-2">Processing...</span>
                  </div>
                ) : (
                  `Pay ₹${booking?.totalAmount}`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
});

PaymentModal.displayName = 'PaymentModal';

export default PaymentModal;
