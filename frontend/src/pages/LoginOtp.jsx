import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import OtpInput from '../components/OtpInput';
import { Phone, ArrowLeft, Loader2 } from 'lucide-react';

const LoginOtp = () => {
  const { sendOtp, verifyOtp, isAuthenticated } = useAuth();
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!phone || phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    const result = await sendOtp(phone);
    setLoading(false);

    if (result.success) {
      setStep('otp');
    } else {
      setError(result.error || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (otp) => {
    setError('');
    setLoading(true);

    const result = await verifyOtp(phone, otp);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Invalid OTP');
    }
    // Success is handled by the auth hook (redirect happens automatically)
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mess Wallah</h1>
          <p className="text-gray-600">Find your perfect room</p>
        </div>

        <div className="card p-6">
          {step === 'phone' ? (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-primary-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Enter your phone number</h2>
                <p className="text-gray-600">We'll send you an OTP to verify your account</p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="9876543210"
                      className="input-field pl-12"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !phone || phone.length !== 10}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending OTP...
                    </>
                  ) : (
                    'Send OTP'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                <p>Demo Mode: OTP will be logged in the backend console</p>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <button
                  onClick={handleBackToPhone}
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </button>

                <h2 className="text-xl font-semibold text-gray-900 mb-2">Enter OTP</h2>
                <p className="text-gray-600">
                  We've sent a 6-digit code to +91 {phone}
                </p>
              </div>

              <div className="space-y-6">
                <OtpInput
                  length={6}
                  onComplete={handleVerifyOtp}
                  disabled={loading}
                />

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg text-center">
                    {error}
                  </div>
                )}

                {loading && (
                  <div className="text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary-600" />
                    <p className="text-sm text-gray-600 mt-2">Verifying OTP...</p>
                  </div>
                )}

                <div className="text-center">
                  <button
                    onClick={() => handleSendOtp({ preventDefault: () => { } })}
                    disabled={loading}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center text-xs text-gray-500 bg-yellow-50 p-3 rounded-lg">
                <p><strong>Demo Mode:</strong> Check your backend console for the OTP code</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginOtp;
