import { NextRequest, NextResponse } from 'next/server';
import { mintApi } from '@mint/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { itemId, walletAddress, amount, transactionId, playerId, username } = body;
    if (!itemId || !walletAddress || amount === undefined || amount === null || !transactionId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const result = await mintApi.post('/transaction/purchase/ton', {
      itemId,
      walletAddress,
      amount,
      transactionId,
      username,
      ...(playerId ? { playerId } : {}),
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing TON purchase:', error);
    return NextResponse.json({ error: 'Failed to process TON purchase' }, { status: 500 });
  }
}