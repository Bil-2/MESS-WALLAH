// Fixed MutationObserver version with proper DOM ready handling
// This version implements your suggested fix

(function() {
  'use strict';
  
  console.log('🛡️ Auto-fill prevention (Fixed MutationObserver) loaded');
  
  // Function to clear all form inputs
  function clearAllInputs() {
    try {
      const inputs = document.querySelectorAll('input');
      inputs.forEach(input => {
        if (input.type !== 'hidden' && input.type !== 'submit' && input.type !== 'button') {
          input.value = '';
          input.defaultValue = '';
        }
      });
    } catch (error) {
      console.warn('Failed to clear inputs:', error);
    }
  }
  
  // Function to disable auto-fill on all forms
  function disableAutoFillOnAllForms() {
    try {
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
    } catch (error) {
      console.warn('Failed to disable autofill:', error);
    }
  }
  
  // Create MutationObserver
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
  
  // YOUR SUGGESTED FIX: Wait for DOM to be ready before observing
  document.addEventListener('DOMContentLoaded', () => {
    console.log('📍 DOM ready - starting MutationObserver');
    
    // Ensure document.body exists before observing
    if (document.body) {
      try {
        // Start observing - this is your suggested fix
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
        console.log('✅ MutationObserver started successfully');
      } catch (error) {
        console.error('❌ Failed to start MutationObserver:', error);
      }
    } else {
      console.error('❌ document.body still not available');
    }
    
    // Run initial clearing
    clearAllInputs();
    disableAutoFillOnAllForms();
    
    // Additional clearing with delays
    setTimeout(clearAllInputs, 100);
    setTimeout(clearAllInputs, 500);
    setTimeout(clearAllInputs, 1000);
    setTimeout(clearAllInputs, 2000);
  });
  
  // Also run immediately if DOM is already ready
  if (document.readyState !== 'loading') {
    console.log('📍 DOM already ready - running immediately');
    clearAllInputs();
    disableAutoFillOnAllForms();
    
    if (document.body) {
      try {
        observer.observe(document.body, {
          childList: true,
          subtree: true
        });
        console.log('✅ MutationObserver started immediately');
      } catch (error) {
        console.error('❌ Failed to start MutationObserver immediately:', error);
      }
    }
  }
  
  console.log('✅ Fixed MutationObserver version initialized');
  
})();
