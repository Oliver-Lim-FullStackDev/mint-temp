'use client';

import { useEffect, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { paths } from 'src/routes/paths';
import { isPublicPage } from 'src/lib/auth/public-pages';
import { useUserAuth } from 'src/modules/telegram/context/user-auth-telegram-provider';

interface AuthGuardProps {
  children: ReactNode;
}

/**
 * AuthGuard component
 *
 * Protects routes by checking if the user is authenticated
 * Redirects to sign-in page if not authenticated and trying to access a protected route
 * Redirects to home page if authenticated and on the sign-in page
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { loading , isAuthenticated } = useUserAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip redirection logic during initial loading
    if (loading) return;

    // If user is not connected and trying to access a protected page
    if (!isAuthenticated && !isPublicPage(pathname)) {
      // Store the current URL before redirecting
      const originalUrl = pathname;
      // Redirect to sign-in page with the original URL as a query parameter
      router.push(`${paths.auth.signIn}?returnTo=${encodeURIComponent(originalUrl)}`);
    }

    // If user is connected and on the sign-in page, redirect to the original URL or home page
    if (isAuthenticated && pathname === paths.auth.signIn) {
      // Get the returnTo parameter from the URL
      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get('returnTo');

      // Redirect to the original URL if available, otherwise to the play & win page
      router.push(returnTo || paths.casinos.root);
    }

  }, [isAuthenticated, loading, pathname, router]);

  // If on a protected page and not authenticated, don't render children
  // This prevents flash of protected content before redirect
  if (!isAuthenticated && !isPublicPage(pathname) && !loading) {
    return null;
  }

  // Otherwise, render the children
  return <>{children}</>;
}
