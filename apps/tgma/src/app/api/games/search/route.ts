import { NextRequest, NextResponse } from 'next/server';
import { mintApi } from '@mint/client';

// POST filtered games
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await mintApi.post('/games/search', body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error searching games:', error);
    return NextResponse.json({ error: 'Failed to search games' }, { status: 500 });
  }
}
