import { useEffect, useRef } from 'react';

/**
 * Aggressive auto-fill prevention hook
 * Uses multiple techniques to prevent browser auto-fill
 */
export const usePreventAutoFill = (formData, setFormData, initialData) => {
  const formRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Technique 1: Clear form immediately on mount
    setFormData({ ...initialData });

    // Technique 2: Add random attributes to prevent browser recognition
    const randomizeForm = () => {
      if (formRef.current) {
        const form = formRef.current;
        
        // Add random form name
        const randomName = 'form_' + Math.random().toString(36).substr(2, 9);
        form.setAttribute('name', randomName);
        form.setAttribute('id', randomName);
        
        // Find all inputs and randomize their attributes
        const inputs = form.querySelectorAll('input');
        inputs.forEach((input, index) => {
          // Add random name attributes
          const randomInputName = input.name + '_' + Math.random().toString(36).substr(2, 5);
          input.setAttribute('data-original-name', input.name);
          input.setAttribute('autocomplete', 'new-password'); // Trick browsers
          
          // Add fake hidden inputs to confuse auto-fill
          const fakeInput = document.createElement('input');
          fakeInput.type = 'text';
          fakeInput.style.position = 'absolute';
          fakeInput.style.left = '-9999px';
          fakeInput.style.opacity = '0';
          fakeInput.style.pointerEvents = 'none';
          fakeInput.tabIndex = -1;
          fakeInput.name = input.name + '_fake';
          fakeInput.autocomplete = 'off';
          
          // Insert fake input before real input
          input.parentNode.insertBefore(fakeInput, input);
        });
      }
    };

    // Technique 3: Delayed clearing (browsers sometimes auto-fill after mount)
    const clearWithDelay = () => {
      setTimeout(() => {
        setFormData({ ...initialData });
        
        // Clear input values directly
        if (formRef.current) {
          const inputs = formRef.current.querySelectorAll('input');
          inputs.forEach(input => {
            if (input.type !== 'hidden' && input.type !== 'submit') {
              input.value = '';
              input.defaultValue = '';
            }
          });
        }
      }, 100);

      setTimeout(() => {
        setFormData({ ...initialData });
      }, 500);

      setTimeout(() => {
        setFormData({ ...initialData });
      }, 1000);
    };

    // Execute techniques
    randomizeForm();
    clearWithDelay();

    // Technique 4: Continuous monitoring and clearing
    const monitorAndClear = () => {
      if (formRef.current) {
        const inputs = formRef.current.querySelectorAll('input');
        let hasAutoFill = false;
        
        inputs.forEach(input => {
          // Check if browser auto-filled (value exists but state doesn't match)
          if (input.value && input.value !== formData[input.name]) {
            hasAutoFill = true;
          }
        });
        
        if (hasAutoFill) {
          console.log('Auto-fill detected, clearing...');
          setFormData({ ...initialData });
          inputs.forEach(input => {
            if (input.type !== 'hidden' && input.type !== 'submit') {
              input.value = '';
            }
          });
        }
      }
    };

    // Monitor every 500ms for the first 5 seconds
    const monitorInterval = setInterval(monitorAndClear, 500);
    setTimeout(() => clearInterval(monitorInterval), 5000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      clearInterval(monitorInterval);
    };
  }, []);

  // Technique 5: Handle focus events to clear auto-filled values
  const handleInputFocus = (e) => {
    const input = e.target;
    const fieldName = input.name;
    
    // If input has value but our state doesn't, clear it
    if (input.value && !formData[fieldName]) {
      input.value = '';
      setFormData(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  // Technique 6: Handle input changes to prevent auto-fill persistence
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Update state normally
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear any other inputs that might have been auto-filled
    if (formRef.current) {
      const otherInputs = formRef.current.querySelectorAll(`input:not([name="${name}"])`);
      otherInputs.forEach(input => {
        if (input.value && !formData[input.name]) {
          input.value = '';
        }
      });
    }
  };

  return {
    formRef,
    handleInputFocus,
    handleInputChange
  };
};
