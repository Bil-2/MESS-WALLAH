/**
 * Form Utilities - Prevent auto-fill and form persistence issues
 */

/**
 * Clear browser form data and prevent auto-fill
 * Call this in useEffect on component mount
 */
export const clearFormData = (formRef) => {
  if (formRef && formRef.current) {
    // Reset the form
    formRef.current.reset();
    
    // Clear all input values
    const inputs = formRef.current.querySelectorAll('input');
    inputs.forEach(input => {
      input.value = '';
      input.defaultValue = '';
    });
    
    // Clear all textarea values
    const textareas = formRef.current.querySelectorAll('textarea');
    textareas.forEach(textarea => {
      textarea.value = '';
      textarea.defaultValue = '';
    });
    
    // Clear all select values
    const selects = formRef.current.querySelectorAll('select');
    selects.forEach(select => {
      select.selectedIndex = 0;
    });
  }
};

/**
 * Disable browser auto-fill for a form element
 */
export const disableAutoFill = (formElement) => {
  if (formElement) {
    formElement.setAttribute('autocomplete', 'off');
    formElement.setAttribute('novalidate', 'true');
    
    // Add random form name to prevent browser recognition
    const randomName = 'form_' + Math.random().toString(36).substr(2, 9);
    formElement.setAttribute('name', randomName);
  }
};

/**
 * Create secure input props to prevent auto-fill
 */
export const getSecureInputProps = (additionalProps = {}) => {
  return {
    autoComplete: 'off',
    autoCorrect: 'off',
    autoCapitalize: 'off',
    spellCheck: 'false',
    ...additionalProps
  };
};

/**
 * Clear localStorage and sessionStorage form data
 */
export const clearStoredFormData = (formKey) => {
  if (formKey) {
    localStorage.removeItem(formKey);
    sessionStorage.removeItem(formKey);
  }
  
  // Clear all form-related storage
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.includes('form') || key.includes('input') || key.includes('field')) {
      localStorage.removeItem(key);
    }
  });
  
  const sessionKeys = Object.keys(sessionStorage);
  sessionKeys.forEach(key => {
    if (key.includes('form') || key.includes('input') || key.includes('field')) {
      sessionStorage.removeItem(key);
    }
  });
};

/**
 * Hook to prevent form auto-fill on component mount
 */
export const usePreventAutoFill = (initialFormData) => {
  const clearAndReset = () => {
    // Clear any stored form data
    clearStoredFormData();
    
    // Return fresh initial data
    return { ...initialFormData };
  };
  
  return clearAndReset;
};
