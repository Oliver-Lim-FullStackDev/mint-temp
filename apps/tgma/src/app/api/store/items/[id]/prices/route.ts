import { NextRequest, NextResponse } from 'next/server';
import { mintApi } from '@mint/client';

// GET prices for a specific item
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Call the backend API to get the item prices with TON conversion
    const prices = await mintApi.get(`/store/items/${id}/prices`);

    if (!prices) {
      return NextResponse.json({ error: 'Item not found or no prices available' }, { status: 404 });
    }

    // Return the price data for the item
    return NextResponse.json(prices);
  } catch (error) {
    console.error('Error fetching item prices:', error);
    return NextResponse.json({ error: 'Failed to fetch item prices' }, { status: 500 });
  }
}