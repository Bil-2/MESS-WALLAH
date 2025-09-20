import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle, AlertCircle, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const SMSTest = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [twilioStatus, setTwilioStatus] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  // Check Twilio configuration status
  const checkTwilioStatus = async () => {
    try {
      const response = await fetch('/api/test-sms/twilio-status');
      const data = await response.json();
      setTwilioStatus(data.data);
    } catch (error) {
      console.error('Failed to check Twilio status:', error);
      toast.error('Failed to check SMS service status');
    }
  };

  // Send test OTP
  const sendTestOTP = async () => {
    if (!phoneNumber) {
      toast.error('Please enter a phone number');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/test-sms/send-test-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Test OTP sent successfully!');
        setLastResult(data.data);
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Failed to send OTP:', error);
      toast.error('Failed to send test OTP');
    } finally {
      setLoading(false);
    }
  };

  // Send custom SMS
  const sendCustomSMS = async () => {
    if (!phoneNumber || !message) {
      toast.error('Please enter both phone number and message');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/test-sms/send-test-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, message }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Custom SMS sent successfully!');
        setLastResult(data.data);
        setMessage(''); // Clear message after sending
      } else {
        toast.error(data.message || 'Failed to send SMS');
      }
    } catch (error) {
      console.error('Failed to send SMS:', error);
      toast.error('Failed to send custom SMS');
    } finally {
      setLoading(false);
    }
  };

  // Load Twilio status on component mount
  React.useEffect(() => {
    checkTwilioStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-orange-600 dark:text-orange-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            SMS Service Test
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Test Twilio SMS integration for MESS WALLAH
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Twilio Status Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Twilio Status
              </h2>
              <button
                onClick={checkTwilioStatus}
                className="text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                Refresh
              </button>
            </div>
            
            {twilioStatus ? (
              <div className="space-y-3">
                <div className="flex items-center">
                  {twilioStatus.configured ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
                  )}
                  <span className={`font-medium ${
                    twilioStatus.configured ? 'text-green-700' : 'text-yellow-700'
                  }`}>
                    {twilioStatus.configured ? 'Configured' : 'Not Configured'}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <div>Account SID: <span className="font-mono">{twilioStatus.accountSid}</span></div>
                  <div>Auth Token: <span className="font-mono">{twilioStatus.authToken}</span></div>
                  <div>Phone Number: <span className="font-mono">{twilioStatus.phoneNumber}</span></div>
                </div>
                
                <div className={`p-3 rounded-lg text-sm ${
                  twilioStatus.configured 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                }`}>
                  {twilioStatus.message}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading status...</p>
              </div>
            )}
          </div>

          {/* Test Controls Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Test SMS
            </h2>
            
            <div className="space-y-4">
              {/* Phone Number Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+919876543210"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Include country code (e.g., +91 for India)
                </p>
              </div>

              {/* Test OTP Button */}
              <button
                onClick={sendTestOTP}
                disabled={loading || !phoneNumber}
                className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Sending...' : 'Send Test OTP'}
              </button>

              {/* Custom Message Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Custom Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter custom message to send..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {/* Send Custom SMS Button */}
              <button
                onClick={sendCustomSMS}
                disabled={loading || !phoneNumber || !message}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
              >
                <Send className="w-4 h-4 mr-2" />
                {loading ? 'Sending...' : 'Send Custom SMS'}
              </button>
            </div>
          </div>
        </div>

        {/* Last Result Card */}
        {lastResult && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Last SMS Result
            </h3>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {JSON.stringify(lastResult, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            📋 Instructions
          </h3>
          <div className="text-blue-800 dark:text-blue-200 space-y-2 text-sm">
            <p>• <strong>Phone Format:</strong> Use international format with country code (e.g., +919876543210)</p>
            <p>• <strong>Test OTP:</strong> Sends a 6-digit verification code</p>
            <p>• <strong>Custom SMS:</strong> Send any message to test SMS delivery</p>
            <p>• <strong>Simulation Mode:</strong> If Twilio isn't configured, SMS will be simulated and logged</p>
            <p>• <strong>Real SMS:</strong> Configure Twilio credentials in .env to send actual SMS</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SMSTest;
