import React, { useState } from 'react';
import firebasePhoneAuth from '../services/firebasePhoneAuth';
import toast from 'react-hot-toast';

const FirebaseTest = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSendOTP = async () => {
    setLoading(true);
    setResult(null);
    
    const res = await firebasePhoneAuth.sendOTP(phone);
    setResult(res);
    
    if (res.success) {
      setOtpSent(true);
      toast.success('OTP sent via Firebase!');
    } else {
      toast.error(res.message);
    }
    
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setResult(null);
    
    const res = await firebasePhoneAuth.verifyOTP(otp);
    setResult(res);
    
    if (res.success) {
      toast.success('Phone verified successfully!');
    } else {
      toast.error(res.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 pt-20">
      {/* Hidden reCAPTCHA container */}
      <div id="recaptcha-container"></div>

      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
          🔥 Firebase Phone Auth Test
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Test Firebase Phone Authentication
        </p>

        {!otpSent ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number (10 digits)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                placeholder="9876543210"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
                maxLength="10"
              />
            </div>

            <button
              onClick={handleSendOTP}
              disabled={loading || phone.length !== 10}
              className="w-full bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP via Firebase'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-sm text-green-800 dark:text-green-200">
                ✅ OTP sent to +91{phone}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter OTP (6 digits)
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white text-center text-2xl tracking-widest"
                maxLength="6"
              />
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.length !== 6}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button
              onClick={() => {
                setOtpSent(false);
                setOtp('');
                setResult(null);
              }}
              className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Change Number
            </button>
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className={`mt-6 p-4 rounded-lg ${
            result.success 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <h3 className={`font-semibold mb-2 ${
              result.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
            }`}>
              {result.success ? '✅ Success!' : '❌ Error'}
            </h3>
            <pre className={`text-xs overflow-auto ${
              result.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
            }`}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {/* Info */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> Make sure you've configured Firebase in <code>frontend/src/config/firebase.js</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FirebaseTest;
