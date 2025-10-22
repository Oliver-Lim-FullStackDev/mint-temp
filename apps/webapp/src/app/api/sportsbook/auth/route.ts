import { NextRequest, NextResponse } from 'next/server';
import { mintApi } from '@mint/client';

/**
 * GET /sportsbook/auth
 * Fetches token for Sportsbook
 */
export async function GET(_req: NextRequest) {
  try {
    const token = await mintApi.get(`/sportsbook/auth`);

    return NextResponse.json(token);
  } catch (error: any) {
    console.error('Error fetching sportsbook auth:', error);
    const message = error?.message || 'Failed to fetch sportsbook auth';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
