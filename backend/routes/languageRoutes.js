const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const { rateLimiters } = require('../middleware/advancedSecurity');

const router = express.Router();

// Apply rate limiting to all routes
router.use(rateLimiters.general);

// @desc    Get available languages
// @route   GET /api/languages
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Mock language data
    const languages = [
      { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
      { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
      { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
      { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
      { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
      { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
      { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
      { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
      { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
      { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
    ];

    res.status(200).json({
      success: true,
      data: languages
    });
  } catch (error) {
    console.error('Error fetching languages:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get translations for a namespace
// @route   GET /api/languages/translations/:namespace
// @access  Public
router.get('/translations/:namespace', [
  query('lang').optional().isLength({ min: 2, max: 5 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { namespace } = req.params;
    const lang = req.query.lang || 'en';

    // Mock translations
    const translations = {
      common: {
        welcome: lang === 'hi' ? 'स्वागत है' : 'Welcome',
        search: lang === 'hi' ? 'खोजें' : 'Search',
        login: lang === 'hi' ? 'लॉगिन' : 'Login',
        signup: lang === 'hi' ? 'साइन अप' : 'Sign Up'
      },
      auth: {
        loginTitle: lang === 'hi' ? 'लॉगिन करें' : 'Login',
        signupTitle: lang === 'hi' ? 'साइन अप करें' : 'Sign Up',
        phone: lang === 'hi' ? 'फ़ोन नंबर' : 'Phone Number',
        otp: lang === 'hi' ? 'ओटीपी' : 'OTP'
      }
    };

    res.status(200).json({
      success: true,
      data: translations[namespace] || {}
    });
  } catch (error) {
    console.error('Error fetching translations:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get user language preferences
// @route   GET /api/languages/preferences
// @access  Private
router.get('/preferences', protect, async (req, res) => {
  try {
    // Mock user preferences
    const preferences = {
      primaryLanguage: 'en',
      fallbackLanguage: 'hi',
      dateFormat: 'DD/MM/YYYY',
      currency: 'INR',
      timezone: 'Asia/Kolkata'
    };

    res.status(200).json({
      success: true,
      data: preferences
    });
  } catch (error) {
    console.error('Error fetching language preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update user language preferences
// @route   PUT /api/languages/preferences
// @access  Private
router.put('/preferences', [
  protect,
  body('primaryLanguage').isLength({ min: 2, max: 5 }),
  body('fallbackLanguage').optional().isLength({ min: 2, max: 5 }),
  body('dateFormat').optional().isIn(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']),
  body('currency').optional().isIn(['INR', 'USD', 'EUR']),
  body('timezone').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { primaryLanguage, fallbackLanguage, dateFormat, currency, timezone } = req.body;

    // Mock preference update
    const updatedPreferences = {
      primaryLanguage,
      fallbackLanguage: fallbackLanguage || 'en',
      dateFormat: dateFormat || 'DD/MM/YYYY',
      currency: currency || 'INR',
      timezone: timezone || 'Asia/Kolkata'
    };

    res.status(200).json({
      success: true,
      data: updatedPreferences,
      message: 'Language preferences updated successfully'
    });
  } catch (error) {
    console.error('Error updating language preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
