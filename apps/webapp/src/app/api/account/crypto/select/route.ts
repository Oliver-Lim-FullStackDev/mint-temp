import { NextRequest, NextResponse } from 'next/server';
import { mintApi } from '@mint/client';
import { cookies } from 'next/headers';

export async function PUT(request: NextRequest) {
  try {
    // Get session token from cookies (apiFetch automatically includes cookies)
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('mint-session')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Session token is required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currency } = body;

    if (!currency) {
      return NextResponse.json(
        { error: 'Currency is required' },
        { status: 400 }
      );
    }

    // Make request to backend API using mintApi
    const result = await mintApi.put('/accounts/crypto/select', { currency });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Crypto account selection error:', error);

    // Handle different error types
    if (error.message?.includes('401')) {
      return NextResponse.json(
        { error: 'Invalid or expired session token' },
        { status: 401 }
      );
    }

    if (error.message?.includes('400')) {
      return NextResponse.json(
        { error: 'Invalid currency selection' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to select account' },
      { status: 500 }
    );
  }
}

