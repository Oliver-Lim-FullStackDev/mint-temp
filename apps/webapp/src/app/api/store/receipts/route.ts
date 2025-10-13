import { NextRequest, NextResponse } from 'next/server';
import { mintApi } from '@mint/client';

export async function GET(req: NextRequest) {
  try {
    const result = await mintApi.get('/transaction/receipts');
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching receipts:', error);
    return NextResponse.json({ error: 'Failed to fetch receipts' }, { status: 500 });
  }
}