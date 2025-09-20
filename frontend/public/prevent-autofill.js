// Immediate auto-fill prevention script
// This runs before React loads to prevent any auto-fill

(function() {
  'use strict';
  
  // Function to clear all form inputs
  function clearAllInputs() {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      if (input.type !== 'hidden' && input.type !== 'submit' && input.type !== 'button') {
        input.value = '';
        input.defaultValue = '';
      }
    });
  }
  
  // Function to disable auto-fill on all forms
  function disableAutoFillOnAllForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.setAttribute('autocomplete', 'new-password');
      form.setAttribute('novalidate', 'true');
    });
    
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.setAttribute('autocomplete', 'new-password');
      input.setAttribute('autocorrect', 'off');
      input.setAttribute('autocapitalize', 'off');
      input.setAttribute('spellcheck', 'false');
    });
  }
  
  // Run immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      clearAllInputs();
      disableAutoFillOnAllForms();
    });
  } else {
    clearAllInputs();
    disableAutoFillOnAllForms();
  }
  
  // Monitor for new elements (React components)
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // Element node
            // Clear any new inputs
            const newInputs = node.querySelectorAll ? node.querySelectorAll('input') : [];
            newInputs.forEach(input => {
              if (input.type !== 'hidden' && input.type !== 'submit' && input.type !== 'button') {
                setTimeout(() => {
                  input.value = '';
                  input.defaultValue = '';
                }, 0);
              }
            });
            
            // Disable auto-fill on new forms
            const newForms = node.querySelectorAll ? node.querySelectorAll('form') : [];
            newForms.forEach(form => {
              form.setAttribute('autocomplete', 'new-password');
              form.setAttribute('novalidate', 'true');
            });
          }
        });
      }
    });
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Additional clearing with delays
  setTimeout(clearAllInputs, 100);
  setTimeout(clearAllInputs, 500);
  setTimeout(clearAllInputs, 1000);
  setTimeout(clearAllInputs, 2000);
  
})();
