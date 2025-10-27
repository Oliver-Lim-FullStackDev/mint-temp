import { paths } from 'src/routes/paths';

/**
 * List of pages that don't require authentication
 * Users can visit these pages without being connected to a wallet
 */
export const publicPages = [
  '/',
  // Authentication pages
  '/sign-in',

  // Public support/marketing pages
  '/terms',
  '/terms/policies',
  '/support',

  // Add more public pages as needed
];

// Check for paths that start with public prefixes
// For example, all paths under /terms/* would be public
const publicPrefixes = [
  // TGMA (by-pass for all pages, auto-auth in place)
  paths.casinos.root,
  `${paths.casinos.root}/*`,
  paths.earn,
  paths.onboarding,
  paths.store,
  paths.rankings,
];

/**
 * Check if a path is public (doesn't require authentication)
 * @param path - The current path to check
 * @returns boolean - True if the path is public, false otherwise
 */
export function isPublicPage(path: string): boolean {
  // Exact matches
  if (publicPages.includes(path)) {
    return true;
  }

  // Starting with
  return publicPrefixes.some(prefix => path.startsWith(prefix));
}
