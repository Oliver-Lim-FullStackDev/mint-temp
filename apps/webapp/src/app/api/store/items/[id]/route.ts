import { NextRequest, NextResponse } from 'next/server';
import { mintApi } from '@mint/client';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const result = await mintApi.get(`/store/items/${id}`);
    if (!result) {
      return NextResponse.json({ error: 'Store item not found' }, { status: 404 });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching store item:', error);
    return NextResponse.json({ error: 'Failed to fetch store item' }, { status: 500 });
  }
}
