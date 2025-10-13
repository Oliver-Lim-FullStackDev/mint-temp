import { mintApi } from '@mint/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Extract the Authorization header
    const authorization = request.headers.get('Authorization');

    if (!authorization) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      );
    }

    // Extract session token from Authorization header
    // Assuming format: "Bearer <token>" or just "<token>"
    const sessionToken = authorization.startsWith('Bearer ')
      ? authorization.slice(7)
      : authorization;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Session token is required' },
        { status: 401 }
      );
    }

    // Fetch session data from the API
    const session = await mintApi.get('/session', {
      headers: {
        Authorization: authorization,
      },
    });

    return NextResponse.json(session);
  } catch (error: any) {
    console.error('Session fetch error:', error);

    // Handle different error types
    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid or expired session token' },
        { status: 401 }
      );
    }

    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
