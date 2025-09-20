const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: false // Made optional to support email OTP
  },
  email: {
    type: String,
    required: false // Optional field for email OTP
  },
  codeHash: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  attempts: {
    type: Number,
    default: 0
  },
  method: {
    type: String,
    enum: ['sms', 'email'],
    default: 'sms'
  },
  verificationSid: {
    type: String,
    required: false // For Twilio verification SID
  }
}, {
  timestamps: true
});

// Validation: Either phone or email must be provided
OtpSchema.pre('save', function(next) {
  if (!this.phone && !this.email) {
    next(new Error('Either phone or email must be provided'));
  } else {
    next();
  }
});

// Index for automatic cleanup of expired OTPs
OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for faster phone lookups
OtpSchema.index({ phone: 1 });

// Index for faster email lookups
OtpSchema.index({ email: 1 });

// Compound index for method-based queries
OtpSchema.index({ method: 1, phone: 1 });
OtpSchema.index({ method: 1, email: 1 });

module.exports = mongoose.model('Otp', OtpSchema);
