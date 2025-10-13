'use client';

import { useEffect } from 'react';
import Cookies from 'js-cookie';

/**
 * Component that manages CSS classes on the document root based on onboarding status
 * This allows CSS variables to be conditionally applied based on cookie values
 */
export function OnboardingCSSManager() {
  useEffect(() => {
    const updateRootClass = () => {
      const isOnboardingCompleted = Cookies.get('onboarding-completed') === 'true';
      const documentElement = document.documentElement;
      
      if (isOnboardingCompleted) {
        documentElement.classList.add('onboarding-completed');
      } else {
        documentElement.classList.remove('onboarding-completed');
      }
    };

    // Initial check
    updateRootClass();

    // Poll for cookie changes (useful for multi-tab scenarios)
    const interval = setInterval(updateRootClass, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // This component doesn't render anything
  return null;
}