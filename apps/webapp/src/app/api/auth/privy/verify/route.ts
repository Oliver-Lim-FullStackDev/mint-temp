import { mintApi } from "@mint/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
/**
 * POST /auth/privy/verify
 * Receives `{ userId }` from client, forwards verification to API.
 * - Reads `Authorization` header (expects `Bearer <privy_id_token>`).
 * - Calls `mintApi.get('/auth/privy/verify')` to validate the Id token.
 * - Optionally forwards `userId` as a query param.
 */
export async function POST(req: NextRequest) {
  try {
    // Read identity token set by Privy in cookies
    const idToken = (await cookies()).get("privy-token")?.value;

    if (!idToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Extract referralId and referrerId from body
    const body = await req.json();
    const { referralId, referrerId } = body;

    // Forward the token to the backend via a header for verification
    const user = await mintApi.post("/auth/privy/verify", { referralId, referrerId }, {
      headers: {
        "privy-id-token": idToken,
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Error verifying Privy auth:", error);
    const message = error?.message || "Failed to verify Privy authentication";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
