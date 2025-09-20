import React from 'react';

/**
 * SecureInput Component - Prevents browser auto-fill and form persistence
 * 
 * This component wraps input fields with security attributes to prevent:
 * - Browser auto-complete/auto-fill
 * - Form data persistence across page refreshes
 * - Auto-correction and spell checking
 * - Auto-capitalization
 */
const SecureInput = ({ 
  className = '', 
  autoComplete = 'off',
  autoCorrect = 'off',
  autoCapitalize = 'off',
  spellCheck = 'false',
  ...props 
}) => {
  return (
    <input
      {...props}
      autoComplete={autoComplete}
      autoCorrect={autoCorrect}
      autoCapitalize={autoCapitalize}
      spellCheck={spellCheck}
      className={className}
    />
  );
};

export default SecureInput;
