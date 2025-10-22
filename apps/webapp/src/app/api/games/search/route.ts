import { NextRequest, NextResponse } from 'next/server';
import { searchGames, type GamesSearchRequest } from './searchGames';

// POST filtered games
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GamesSearchRequest;
    const result = await searchGames(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error searching games:', error);
    return NextResponse.json({ error: 'Failed to search games' }, { status: 500 });
  }
}
