import { NextRequest, NextResponse } from 'next/server';
import { mintApi } from '@mint/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { itemId, amount, transactionId, username, playerId } = body;

    if (!itemId || amount === undefined || amount === null || !transactionId || !username) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await mintApi.post('/transaction/purchase/stars', {
      itemId,
      amount,
      transactionId,
      username,
      ...(playerId ? { playerId } : {})
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing Stars purchase:', error);
    return NextResponse.json({ error: 'Failed to process Stars purchase' }, { status: 500 });
  }
}