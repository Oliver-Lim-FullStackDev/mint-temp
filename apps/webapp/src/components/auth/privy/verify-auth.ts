import { apiFetch } from "@mint/client";

export const verifyPrivyAuth = async () => {
  // Attempt calling backend verification route
  const user = await apiFetch("/auth/privy/verify");  

  if (!user) {
    throw new Error("Server verification failed");
  }
  return user
};
