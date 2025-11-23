import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential
} from 'firebase/auth';
import { auth } from '../config/firebase';

class FirebasePhoneAuthService {
  constructor() {
    this.recaptchaVerifier = null;
    this.confirmationResult = null;
  }

  // Initialize reCAPTCHA
  initRecaptcha(containerId = 'recaptcha-container') {
    if (!this.recaptchaVerifier) {
      this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: (response) => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
          this.recaptchaVerifier = null;
        }
      });
    }
    return this.recaptchaVerifier;
  }

  // Send OTP to phone number
  async sendOTP(phoneNumber) {
    try {
      // Format phone number with country code if not present
      const formattedPhone = phoneNumber.startsWith('+') 
        ? phoneNumber 
        : `+91${phoneNumber}`;

      console.log('Sending OTP to:', formattedPhone);

      // Initialize reCAPTCHA
      const appVerifier = this.initRecaptcha();

      // Send OTP
      this.confirmationResult = await signInWithPhoneNumber(
        auth, 
        formattedPhone, 
        appVerifier
      );

      console.log('OTP sent successfully');
      
      return {
        success: true,
        message: 'OTP sent successfully to ' + formattedPhone,
        verificationId: this.confirmationResult.verificationId
      };
    } catch (error) {
      console.error('Error sending OTP:', error);
      
      // Reset reCAPTCHA on error
      if (this.recaptchaVerifier) {
        this.recaptchaVerifier.clear();
        this.recaptchaVerifier = null;
      }

      return {
        success: false,
        message: this.getErrorMessage(error),
        error: error.code
      };
    }
  }

  // Verify OTP
  async verifyOTP(otp) {
    try {
      if (!this.confirmationResult) {
        throw new Error('No confirmation result. Please send OTP first.');
      }

      console.log('Verifying OTP:', otp);

      // Verify the OTP
      const result = await this.confirmationResult.confirm(otp);
      
      console.log('OTP verified successfully');
      console.log('User:', result.user);

      // Get Firebase ID token
      const idToken = await result.user.getIdToken();

      return {
        success: true,
        message: 'Phone number verified successfully',
        user: {
          uid: result.user.uid,
          phoneNumber: result.user.phoneNumber,
          idToken: idToken
        }
      };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      
      return {
        success: false,
        message: this.getErrorMessage(error),
        error: error.code
      };
    }
  }

  // Resend OTP (same as sendOTP)
  async resendOTP(phoneNumber) {
    // Clear previous reCAPTCHA
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
    
    return await this.sendOTP(phoneNumber);
  }

  // Get user-friendly error messages
  getErrorMessage(error) {
    const errorMessages = {
      'auth/invalid-phone-number': 'Invalid phone number format',
      'auth/missing-phone-number': 'Please enter a phone number',
      'auth/quota-exceeded': 'SMS quota exceeded. Please try again later.',
      'auth/user-disabled': 'This account has been disabled',
      'auth/invalid-verification-code': 'Invalid OTP. Please check and try again.',
      'auth/code-expired': 'OTP has expired. Please request a new one.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/captcha-check-failed': 'reCAPTCHA verification failed. Please try again.',
      'auth/network-request-failed': 'Network error. Please check your connection.'
    };

    return errorMessages[error.code] || error.message || 'An error occurred';
  }

  // Clear reCAPTCHA
  clearRecaptcha() {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
  }

  // Sign out
  async signOut() {
    try {
      await auth.signOut();
      this.confirmationResult = null;
      this.clearRecaptcha();
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      return { success: false, message: error.message };
    }
  }
}

// Export singleton instance
export default new FirebasePhoneAuthService();
