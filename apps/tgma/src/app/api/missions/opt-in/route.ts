import { NextRequest, NextResponse } from 'next/server';
import { mintApi } from '@mint/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await mintApi.post('/missions/opt-in', body);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error opting into campaign:', error);
    return NextResponse.json(
      { error: 'Failed to opt into campaign' },
      { status: 500 }
    );
  }
}