import { NextRequest, NextResponse } from 'next/server';
import { mintApi } from '@mint/client';

export async function GET(req: NextRequest) {
  try {
    const result = await mintApi.get('/store/items');
    if (!result) {
      return NextResponse.json({ error: 'Failed to fetch store items' }, { status: 500 });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching store items:', error);
    return NextResponse.json({ error: 'Failed to fetch store items' }, { status: 500 });
  }
}
