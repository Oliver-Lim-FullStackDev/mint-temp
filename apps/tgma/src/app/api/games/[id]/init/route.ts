import { NextRequest, NextResponse } from 'next/server';
import { mintApi } from '@mint/client';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const game = await mintApi.get(`/games/${id}/init`);
    return NextResponse.json(game);
  } catch (error) {
    console.error('Error initialising game:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game' },
      { status: 500 }
    );
  }
}
