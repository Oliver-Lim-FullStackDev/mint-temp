import { NextRequest, NextResponse } from 'next/server';
import { mintApi } from '@mint/client';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const { itemId } = await params;

    if (!itemId) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      );
    }

    const response = await mintApi.put(`/inventory/${itemId}/activate`);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error activating inventory item:', error);
    return NextResponse.json(
      { error: 'Failed to activate inventory item' },
      { status: 500 }
    );
  }
}