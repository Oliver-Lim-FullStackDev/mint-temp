import { NextRequest, NextResponse } from 'next/server';
import { mintApi } from '@mint/client';

export async function GET(req: NextRequest) {
  try {
    const data = await mintApi.get('/missions');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching missions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch missions' },
      { status: 500 }
    );
  }
}