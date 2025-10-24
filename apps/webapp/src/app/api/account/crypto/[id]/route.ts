import { mintApi } from '@mint/client';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Get the account ID from the URL params
    const { id: accountId } = await params;

    if (!accountId) {
      return NextResponse.json(
        { error: 'Account ID is required' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { enabled } = body;

    if (typeof enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Enabled must be a boolean value' },
        { status: 400 }
      );
    }

    // Make request to NestJS API to update crypto account status
    const response = await mintApi.patch(`/accounts/crypto/${accountId}`, {
      enabled,
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Update crypto account error:', error);

    // Handle different error types
    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid or expired session token' },
        { status: 401 }
      );
    }

    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

