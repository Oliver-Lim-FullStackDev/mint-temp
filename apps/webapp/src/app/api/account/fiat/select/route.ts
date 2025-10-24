import { mintApi } from '@mint/client';
import { NextRequest, NextResponse } from 'next/server';
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

    // Parse request body
    const body = await request.json();
    const { selected_currency } = body;

    if (!selected_currency) {
      return NextResponse.json(
        { error: 'selected_currency is required' },
        { status: 400 }
      );
    }

    // Update user currency preference via the NestJS API
    const response = await mintApi.put('/accounts/fiat/select', {
      selected_currency: selected_currency,
    });

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Fiat currency selection error:', error);

    // Handle different error types
    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid or expired session token' },
        { status: 401 }
      );
    }

    if (error.response?.status === 400) {
      return NextResponse.json(
        { error: 'Invalid currency selection' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

