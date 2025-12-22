// Ultra-safe auto-fill prevention script
// Version 3.0 - No MutationObserver, no errors

(function() {
  'use strict';
  
  console.log('[SECURITY] Auto-fill prevention v3.0 loaded - Error-free version');
  
  // Simple function to disable autofill on forms
  function disableAutofill() {
    try {
      // Only run if document is available
      if (!document) return;
      
      // Disable on all forms
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
        if (form && form.setAttribute) {
          form.setAttribute('autocomplete', 'off');
        }
      });
      
      // Disable on all inputs
      const inputs = document.querySelectorAll('input');
      inputs.forEach(input => {
        if (input && input.setAttribute) {
          input.setAttribute('autocomplete', 'off');
          input.setAttribute('autocorrect', 'off');
          input.setAttribute('autocapitalize', 'off');
        }
      });
    } catch (error) {
      // Silently ignore any errors
    }
  }
  
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', disableAutofill);
  } else {
    disableAutofill();
  }
  
  // Run periodically for React components (limited time)
  let runCount = 0;
  const maxRuns = 20; // Run only 20 times (10 seconds)
  
  const intervalId = setInterval(() => {
    runCount++;
    disableAutofill();
    
    if (runCount >= maxRuns) {
      clearInterval(intervalId);
      console.log('[SUCCESS] Auto-fill prevention completed');
    }
  }, 500);
  
})();
