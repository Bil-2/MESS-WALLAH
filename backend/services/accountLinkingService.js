const User = require('../models/User');

/**
 * COMPREHENSIVE ACCOUNT LINKING SERVICE
 * Handles unified authentication for millions of users
 * Prevents duplicate accounts for same person using different login methods
 */

class AccountLinkingService {

  /**
   * Find existing user by email or phone with all possible variations
   * @param {string} email - User's email address
   * @param {string} phone - User's phone number
   * @returns {Object} - Search result with user and linking possibilities
   */
  static async findExistingUser(email, phone) {
    try {
      console.log(`[DEBUG] ACCOUNT SEARCH: Looking for existing accounts...`);

      // Generate all possible phone number variations
      const phoneVariants = this.generatePhoneVariants(phone);

      // Search for user with email OR any phone variant
      const searchQuery = {
        $or: [
          ...(email ? [{ email: email.toLowerCase().trim() }] : []),
          ...(phoneVariants.length > 0 ? [{ phone: { $in: phoneVariants } }] : [])
        ]
      };

      console.log(`[DEBUG] Phone variants to search:`, phoneVariants);
      console.log(`[DEBUG] Email to search:`, email);

      const existingUser = await User.findOne(searchQuery)
        .select('+password +registrationMethod +accountType +canLinkEmail +profileCompleted +isPhoneVerified +isEmailVerified');

      if (existingUser) {
        console.log(`[INFO] EXISTING USER FOUND:`, {
          id: existingUser._id,
          email: existingUser.email,
          phone: existingUser.phone,
          accountType: existingUser.accountType,
          registrationMethod: existingUser.registrationMethod,
          hasPassword: !!existingUser.password,
          canLinkEmail: existingUser.canLinkEmail,
          profileCompleted: existingUser.profileCompleted
        });

        // Analyze linking possibilities
        const linkingAnalysis = this.analyzeLinkingPossibilities(existingUser, email, phone);

        return {
          found: true,
          user: existingUser,
          ...linkingAnalysis
        };
      }

      console.log(`[INFO] NO EXISTING USER FOUND - Safe to create new account`);
      return {
        found: false,
        user: null,
        canLink: false,
        shouldLink: false,
        linkingType: 'none'
      };

    } catch (error) {
      console.error('[ERROR] Account search error:', error);
      throw error;
    }
  }

  /**
   * Generate all possible phone number variations for comprehensive search
   * @param {string} phone - Original phone number
   * @returns {Array} - Array of phone number variants
   */
  static generatePhoneVariants(phone) {
    if (!phone) return [];

    const cleanPhone = phone.replace(/[^0-9+]/g, ''); // Remove spaces, dashes, etc.
    const variants = new Set();

    // Add original
    variants.add(phone);
    variants.add(cleanPhone);

    // Handle Indian numbers specifically
    if (cleanPhone.length >= 10) {
      // With +91 prefix
      const withCountryCode = cleanPhone.startsWith('+91') ? cleanPhone : `+91${cleanPhone.replace(/^0+/, '')}`;
      variants.add(withCountryCode);

      // Without +91 prefix
      const withoutCountryCode = cleanPhone.replace(/^\+?91/, '');
      if (withoutCountryCode.length >= 10) {
        variants.add(withoutCountryCode);
      }

      // With leading zero
      if (!withoutCountryCode.startsWith('0') && withoutCountryCode.length === 10) {
        variants.add(`0${withoutCountryCode}`);
      }

      // With 91 prefix (no +)
      if (!cleanPhone.startsWith('91') && withoutCountryCode.length === 10) {
        variants.add(`91${withoutCountryCode}`);
      }
    }

    // Filter out invalid variants
    return Array.from(variants).filter(v => v && v.length >= 10);
  }

  /**
   * Analyze if and how accounts can be linked
   * @param {Object} existingUser - Found user document
   * @param {string} email - New email to potentially link
   * @param {string} phone - New phone to potentially link
   * @returns {Object} - Linking analysis result
   */
  static analyzeLinkingPossibilities(existingUser, email, phone) {
    const analysis = {
      canLink: false,
      shouldLink: false,
      linkingType: 'none',
      reason: '',
      confidence: 'low'
    };

    // Check if this is an OTP-only account that can be enhanced
    const isOtpOnlyAccount = (
      // Primary: OTP-only accounts without password
      (!existingUser.password && existingUser.registrationMethod === 'otp') ||
      // Secondary: Explicitly marked as linkable
      (existingUser.accountType === 'otp-only' && existingUser.canLinkEmail) ||
      // Tertiary: Legacy OTP users without email
      (!existingUser.email && existingUser.phone && existingUser.registrationMethod === 'otp') ||
      // Quaternary: Incomplete profiles that can be enhanced
      (existingUser.phone && !existingUser.email && existingUser.isPhoneVerified && !existingUser.profileCompleted) ||
      // Quinary: Any account marked as otp-only
      (existingUser.accountType === 'otp-only') ||
      // Senary: Phone-verified users without complete registration
      (existingUser.phone && existingUser.isPhoneVerified && !existingUser.password && existingUser.canLinkEmail !== false)
    );

    if (isOtpOnlyAccount) {
      analysis.canLink = true;
      analysis.shouldLink = true;
      analysis.linkingType = 'otp-to-unified';
      analysis.reason = 'OTP-only account can be upgraded to unified account with email and password';
      analysis.confidence = 'high';

      console.log(`[INFO] LINKING ANALYSIS: OTP account can be linked`, {
        userId: existingUser._id,
        currentPhone: existingUser.phone,
        newEmail: email,
        accountType: existingUser.accountType,
        hasPassword: !!existingUser.password,
        canLinkEmail: existingUser.canLinkEmail
      });

      return analysis;
    }

    // Check if this is an email-only account that can add phone
    const isEmailOnlyAccount = (
      existingUser.email && !existingUser.phone && existingUser.password
    );

    if (isEmailOnlyAccount && phone) {
      analysis.canLink = true;
      analysis.shouldLink = true;
      analysis.linkingType = 'email-to-unified';
      analysis.reason = 'Email-only account can be enhanced with phone number';
      analysis.confidence = 'medium';

      console.log(`[INFO] LINKING ANALYSIS: Email account can add phone`, {
        userId: existingUser._id,
        currentEmail: existingUser.email,
        newPhone: phone,
        accountType: existingUser.accountType
      });

      return analysis;
    }

    // Account already complete - cannot link
    analysis.canLink = false;
    analysis.shouldLink = false;
    analysis.linkingType = 'blocked';
    analysis.reason = 'Account already has complete profile with both email and password';
    analysis.confidence = 'high';

    console.log(`[WARNING] LINKING BLOCKED: Account already complete`, {
      userId: existingUser._id,
      hasEmail: !!existingUser.email,
      hasPhone: !!existingUser.phone,
      hasPassword: !!existingUser.password,
      accountType: existingUser.accountType
    });

    return analysis;
  }

  /**
   * Perform account linking by updating existing user with new information
   * @param {Object} existingUser - User document to update
   * @param {Object} newData - New registration data
   * @returns {Object} - Updated user document
   */
  static async linkAccounts(existingUser, newData) {
    try {
      console.log(`[INFO] ACCOUNT LINKING: Starting linking process for user ${existingUser._id}`);

      // Update user with new information
      if (newData.name && !existingUser.name) {
        existingUser.name = newData.name;
      }

      if (newData.email && !existingUser.email) {
        existingUser.email = newData.email.toLowerCase().trim();
        existingUser.isEmailVerified = false; // Email needs verification
      }

      if (newData.password && !existingUser.password) {
        existingUser.password = newData.password; // Will be hashed by pre-save hook
      }

      if (newData.phone && !existingUser.phone) {
        const formattedPhone = this.formatPhoneNumber(newData.phone);
        existingUser.phone = formattedPhone;
      }

      // Update profile information
      if (newData.role) existingUser.role = newData.role;
      if (newData.college) existingUser.college = newData.college;
      if (newData.course) existingUser.course = newData.course;
      if (newData.year) existingUser.year = newData.year;

      // Mark account as unified and complete
      existingUser.registrationMethod = 'complete';
      existingUser.accountType = 'unified';
      existingUser.canLinkEmail = false; // Prevent further linking
      existingUser.profileCompleted = true;
      existingUser.verified = true;
      existingUser.isVerified = true;
      existingUser.lastLogin = new Date();
      existingUser.isActive = true;

      await existingUser.save();

      console.log(`[SUCCESS] ACCOUNT LINKING SUCCESSFUL:`, {
        userId: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        phone: existingUser.phone,
        accountType: existingUser.accountType,
        profileCompleted: existingUser.profileCompleted
      });

      return existingUser;

    } catch (error) {
      console.error('[ERROR] Account linking error:', error);
      throw error;
    }
  }

  /**
   * Format phone number to international format
   * @param {string} phone - Phone number to format
   * @returns {string} - Formatted phone number
   */
  static formatPhoneNumber(phone) {
    if (!phone) return phone;

    const cleanPhone = phone.replace(/[^0-9+]/g, '');

    // If already has country code, return as is
    if (cleanPhone.startsWith('+')) {
      return cleanPhone;
    }

    // If starts with 91, add +
    if (cleanPhone.startsWith('91') && cleanPhone.length > 11) {
      return `+${cleanPhone}`;
    }

    // Assume Indian number, add +91
    const withoutLeadingZero = cleanPhone.replace(/^0+/, '');
    return `+91${withoutLeadingZero}`;
  }

  /**
   * Check if two phone numbers are the same (considering different formats)
   * @param {string} phone1 - First phone number
   * @param {string} phone2 - Second phone number
   * @returns {boolean} - True if phones match
   */
  static phonesMatch(phone1, phone2) {
    if (!phone1 || !phone2) return false;

    const variants1 = this.generatePhoneVariants(phone1);
    const variants2 = this.generatePhoneVariants(phone2);

    // Check if any variant of phone1 matches any variant of phone2
    return variants1.some(v1 => variants2.includes(v1));
  }

  /**
   * Get comprehensive account statistics for monitoring
   * @returns {Object} - Account statistics
   */
  static async getAccountStats() {
    try {
      const stats = await User.aggregate([
        {
          $group: {
            _id: '$accountType',
            count: { $sum: 1 },
            hasEmail: { $sum: { $cond: [{ $ne: ['$email', null] }, 1, 0] } },
            hasPhone: { $sum: { $cond: [{ $ne: ['$phone', null] }, 1, 0] } },
            hasPassword: { $sum: { $cond: [{ $ne: ['$password', null] }, 1, 0] } }
          }
        }
      ]);

      const totalUsers = await User.countDocuments();
      const duplicateRisk = await User.aggregate([
        {
          $group: {
            _id: { email: '$email', phone: '$phone' },
            count: { $sum: 1 },
            users: { $push: '$_id' }
          }
        },
        {
          $match: { count: { $gt: 1 } }
        }
      ]);

      return {
        totalUsers,
        accountTypes: stats,
        duplicateRisk: duplicateRisk.length,
        timestamp: new Date()
      };

    } catch (error) {
      console.error('[ERROR] Stats error:', error);
      return { error: error.message };
    }
  }
}

module.exports = AccountLinkingService;
