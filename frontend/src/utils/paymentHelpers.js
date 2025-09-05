// Payment utility functions for MESS WALLAH

export const PAYMENT_METHODS = {
  CARD: 'card',
  UPI: 'upi',
  WALLET: 'wallet',
  NET_BANKING: 'netbanking'
};

export const WALLET_PROVIDERS = {
  PAYTM: 'paytm',
  PHONEPE: 'phonepe',
  GOOGLEPAY: 'googlepay',
  AMAZONPAY: 'amazonpay',
  MOBIKWIK: 'mobikwik'
};

export const CARD_TYPES = {
  VISA: 'visa',
  MASTERCARD: 'mastercard',
  RUPAY: 'rupay',
  AMEX: 'amex'
};

// Validate card number using Luhn algorithm
export const validateCardNumber = (cardNumber) => {
  const cleanNumber = cardNumber.replace(/\s/g, '');

  if (!/^\d+$/.test(cleanNumber)) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

// Detect card type from card number
export const detectCardType = (cardNumber) => {
  const cleanNumber = cardNumber.replace(/\s/g, '');

  if (/^4/.test(cleanNumber)) {
    return CARD_TYPES.VISA;
  } else if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) {
    return CARD_TYPES.MASTERCARD;
  } else if (/^6/.test(cleanNumber)) {
    return CARD_TYPES.RUPAY;
  } else if (/^3[47]/.test(cleanNumber)) {
    return CARD_TYPES.AMEX;
  }

  return null;
};

// Validate expiry date
export const validateExpiryDate = (expiryDate) => {
  const [month, year] = expiryDate.split('/');

  if (!month || !year) {
    return false;
  }

  const monthNum = parseInt(month);
  const yearNum = parseInt(`20${year}`);

  if (monthNum < 1 || monthNum > 12) {
    return false;
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
    return false;
  }

  return true;
};

// Validate CVV
export const validateCVV = (cvv, cardType) => {
  if (!cvv) return false;

  const cvvLength = cardType === CARD_TYPES.AMEX ? 4 : 3;
  return cvv.length === cvvLength && /^\d+$/.test(cvv);
};

// Validate UPI ID
export const validateUPIId = (upiId) => {
  const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
  return upiRegex.test(upiId);
};

// Format card number with spaces
export const formatCardNumber = (value) => {
  const cleanValue = value.replace(/\s/g, '');
  const cardType = detectCardType(cleanValue);

  if (cardType === CARD_TYPES.AMEX) {
    return cleanValue.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
  } else {
    return cleanValue.replace(/(\d{4})/g, '$1 ').trim();
  }
};

// Format expiry date
export const formatExpiryDate = (value) => {
  const cleanValue = value.replace(/\D/g, '');
  if (cleanValue.length >= 2) {
    return cleanValue.substring(0, 2) + '/' + cleanValue.substring(2, 4);
  }
  return cleanValue;
};

// Mask card number for display
export const maskCardNumber = (cardNumber) => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  if (cleanNumber.length < 4) return cardNumber;

  const lastFour = cleanNumber.slice(-4);
  const maskedPart = '*'.repeat(cleanNumber.length - 4);

  return formatCardNumber(maskedPart + lastFour);
};

// Calculate payment processing fee
export const calculateProcessingFee = (amount, paymentMethod) => {
  const fees = {
    [PAYMENT_METHODS.CARD]: 0.02, // 2%
    [PAYMENT_METHODS.UPI]: 0, // Free
    [PAYMENT_METHODS.WALLET]: 0.01, // 1%
    [PAYMENT_METHODS.NET_BANKING]: 0.015 // 1.5%
  };

  const feePercentage = fees[paymentMethod] || 0;
  return Math.round(amount * feePercentage);
};

// Generate payment reference ID
export const generatePaymentReference = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `MW${timestamp}${random}`;
};

// Payment status constants
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded'
};

// Payment error codes
export const PAYMENT_ERRORS = {
  INVALID_CARD: 'INVALID_CARD',
  EXPIRED_CARD: 'EXPIRED_CARD',
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  NETWORK_ERROR: 'NETWORK_ERROR',
  BANK_DECLINED: 'BANK_DECLINED',
  INVALID_UPI: 'INVALID_UPI',
  WALLET_INSUFFICIENT: 'WALLET_INSUFFICIENT'
};

// Get user-friendly error message
export const getPaymentErrorMessage = (errorCode) => {
  const messages = {
    [PAYMENT_ERRORS.INVALID_CARD]: 'Invalid card details. Please check and try again.',
    [PAYMENT_ERRORS.EXPIRED_CARD]: 'Your card has expired. Please use a different card.',
    [PAYMENT_ERRORS.INSUFFICIENT_FUNDS]: 'Insufficient funds in your account.',
    [PAYMENT_ERRORS.NETWORK_ERROR]: 'Network error. Please check your connection and try again.',
    [PAYMENT_ERRORS.BANK_DECLINED]: 'Payment declined by your bank. Please contact your bank.',
    [PAYMENT_ERRORS.INVALID_UPI]: 'Invalid UPI ID. Please check and try again.',
    [PAYMENT_ERRORS.WALLET_INSUFFICIENT]: 'Insufficient balance in your wallet.'
  };

  return messages[errorCode] || 'Payment failed. Please try again.';
};

// Validate payment form data
export const validatePaymentData = (paymentMethod, data) => {
  const errors = {};

  switch (paymentMethod) {
    case PAYMENT_METHODS.CARD:
      if (!data.cardholderName?.trim()) {
        errors.cardholderName = 'Cardholder name is required';
      }

      if (!validateCardNumber(data.cardNumber)) {
        errors.cardNumber = 'Invalid card number';
      }

      if (!validateExpiryDate(data.expiryDate)) {
        errors.expiryDate = 'Invalid expiry date';
      }

      const cardType = detectCardType(data.cardNumber);
      if (!validateCVV(data.cvv, cardType)) {
        errors.cvv = 'Invalid CVV';
      }
      break;

    case PAYMENT_METHODS.UPI:
      if (!validateUPIId(data.upiId)) {
        errors.upiId = 'Invalid UPI ID';
      }
      break;

    case PAYMENT_METHODS.WALLET:
      if (!data.walletType) {
        errors.walletType = 'Please select a wallet';
      }
      break;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Format currency for display
export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Payment analytics helper
export const trackPaymentEvent = (eventName, paymentData) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'Payment',
      payment_method: paymentData.method,
      value: paymentData.amount,
      currency: 'INR'
    });
  }
};
