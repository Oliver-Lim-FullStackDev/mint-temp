import { apiFetch } from "@mint/client";

export const verifyPrivyAuth = async ({
  referralId,
  referrerId,
}: {
  referralId?: string | null;
  referrerId?: string | null;
}) => {
  const PrivyLoginPayload = { referralId, referrerId }
  // Attempt calling backend verification route
  const user = await apiFetch("/auth/privy/verify", {
    method: "POST",
    body: JSON.stringify(PrivyLoginPayload),
  });

  if (!user) {
    throw new Error("Server verification failed");
  }
  return user;
};
