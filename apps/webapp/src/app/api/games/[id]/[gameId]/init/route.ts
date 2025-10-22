import { NextRequest, NextResponse } from 'next/server';
import { mintApi } from '@mint/client';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; gameId: string }> },
) {
  try {
    const { id: studioId, gameId } = await params;
    const game = await mintApi.get(`/games/${studioId}/${gameId}/init`);
    return NextResponse.json(game);
  } catch (error) {
    console.error('Error initializing game:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game init' },
      { status: 500 },
    );
  }
}
