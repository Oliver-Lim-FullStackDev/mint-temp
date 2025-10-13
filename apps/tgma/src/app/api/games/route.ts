import { NextRequest, NextResponse } from 'next/server';
import { mintApi } from '@mint/client';

// GET all games
export async function GET(_req: NextRequest) {
  try {
    const games = await mintApi.get('/games');
    return NextResponse.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 });
  }
}
