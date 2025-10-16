import { NextRequest, NextResponse } from 'next/server';
import { mintApi } from '@mint/client';

// GET a single item with current pricing
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Call the backend API to get the item with current pricing
    const item = await mintApi.get(`/store/items/${id}/prices`);

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Return the item with current pricing
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error fetching item with current pricing:', error);
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 });
  }
}
