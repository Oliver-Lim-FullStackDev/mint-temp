import { NextRequest, NextResponse } from 'next/server';
import { mintApi } from '@mint/client';

// GET user inventory
export async function GET(req: NextRequest) {
  try {
    const inventory = await mintApi.get('/inventory');
    return NextResponse.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    );
  }
}