import type { User } from 'src/types';
import { apiFetch } from '@mint/client';

type VerifyPayload = {
  referralId?: string | null;
  referrerId?: string | null;
};

/**
 * Verify Privy login via Next.js API route which forwards the
 * identity token (from HttpOnly cookie) to the backend.
 * Ensures cookies set by the route are applied in the browser.
 */
export async function verifyPrivyAuth(payload: VerifyPayload): Promise<User> {
  // Call our Next.js route (same-origin) to forward token/cookies
  const user = await apiFetch('/auth/privy/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!user) throw new Error('Privy Auth Server verification failed');
  return user as User;
}
