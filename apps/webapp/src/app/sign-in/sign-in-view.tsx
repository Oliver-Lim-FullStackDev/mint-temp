'use client';

import { useEffect, useState } from 'react';


export function SignInView() {
  // Get the returnTo parameter from the URL if it exists
  const [returnTo, setReturnTo] = useState<string | null>(null);

  // Extract returnTo from URL on component mount
  useEffect(() => {
    // Get the returnTo parameter from the URL
    const params = new URLSearchParams(window.location.search);
    const returnToParam = params.get('returnTo');
    if (returnToParam) {
      setReturnTo(returnToParam);
    }
  }, []);

  return null;
}
