import { NextRequest, NextResponse } from 'next/server';
import { mintApi } from '@mint/client';

// GET all items with current pricing
export async function GET(_req: NextRequest) {
  try {
    // Call the backend API to get items with current pricing
    const items = await mintApi.get('/store/items/prices');

    if (!items) {
      return NextResponse.json({ error: 'No items available' }, { status: 404 });
    }

    // Return the items with current pricing
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching items with current pricing:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}
