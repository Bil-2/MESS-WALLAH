// Simple and reliable auto-fill prevention script
// Version 2.0 - No MutationObserver to avoid errors

(function() {
  'use strict';
  
  console.log('🛡️ Auto-fill prevention v2.0 loaded');
  
  // Function to clear all form inputs safely
  function clearAllInputs() {
    try {
      if (!document || typeof document.querySelectorAll !== 'function') return;
      
      const inputs = document.querySelectorAll('input');
      inputs.forEach(input => {
        try {
          if (input && input.type !== 'hidden' && input.type !== 'submit' && input.type !== 'button') {
            input.value = '';
            input.defaultValue = '';
          }
        } catch (e) {
          // Ignore individual input errors
        }
      });
    } catch (error) {
      console.warn('Failed to clear inputs:', error);
    }
  }
  
  // Function to disable auto-fill on all forms safely
  function disableAutoFillOnAllForms() {
    try {
      if (!document || typeof document.querySelectorAll !== 'function') return;
      
      // Handle forms
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        try {
          if (form && form.setAttribute) {
            form.setAttribute('autocomplete', 'new-password');
            form.setAttribute('novalidate', 'true');
          }
        } catch (e) {
          // Ignore individual form errors
        }
      });
      
      // Handle inputs
      const inputs = document.querySelectorAll('input');
      inputs.forEach(input => {
        try {
          if (input && input.setAttribute) {
            input.setAttribute('autocomplete', 'new-password');
            input.setAttribute('autocorrect', 'off');
            input.setAttribute('autocapitalize', 'off');
            input.setAttribute('spellcheck', 'false');
          }
        } catch (e) {
          // Ignore individual input errors
        }
      });
    } catch (error) {
      console.warn('Failed to disable autofill:', error);
    }
  }
  
  // Safe DOM ready check
  function runWhenReady() {
    clearAllInputs();
    disableAutoFillOnAllForms();
  }
  
  // Run immediately or when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runWhenReady);
  } else {
    runWhenReady();
  }
  
  // Use interval-based checking instead of MutationObserver
  // This is more reliable and doesn't cause errors
  let intervalId = null;
  
  function startPeriodicClearing() {
    // Clear any existing interval
    if (intervalId) {
      clearInterval(intervalId);
    }
    
    // Run every 500ms to catch new React components
    intervalId = setInterval(() => {
      try {
        clearAllInputs();
        disableAutoFillOnAllForms();
      } catch (error) {
        console.warn('Periodic clearing error:', error);
      }
    }, 500);
    
    console.log('🔄 Periodic auto-fill prevention started');
    
    // Stop after 30 seconds to avoid running forever
    setTimeout(() => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        console.log('⏹️ Periodic auto-fill prevention stopped');
      }
    }, 30000);
  }
  
  // Start periodic clearing
  startPeriodicClearing();
  
  // Initial clearing with delays
  const delays = [100, 300, 500, 1000, 2000, 5000];
  delays.forEach(delay => {
    setTimeout(() => {
      clearAllInputs();
      disableAutoFillOnAllForms();
    }, delay);
  });
  
  // Listen for focus events to clear inputs when user interacts
  document.addEventListener('focusin', function(event) {
    if (event.target && event.target.tagName === 'INPUT') {
      try {
        const input = event.target;
        if (input.type !== 'hidden' && input.type !== 'submit' && input.type !== 'button') {
          // Clear the input when user focuses on it
          setTimeout(() => {
            if (input.value && input.value.length > 0) {
              input.value = '';
            }
          }, 10);
        }
      } catch (e) {
        // Ignore focus event errors
      }
    }
  }, true);
  
  console.log('✅ Auto-fill prevention v2.0 initialized (no MutationObserver)');
  
})();
