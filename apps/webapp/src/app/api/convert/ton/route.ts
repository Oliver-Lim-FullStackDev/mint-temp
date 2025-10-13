import { NextRequest, NextResponse } from 'next/server';
import { mintApi } from '@mint/client';
import { Currency } from '@mint/types';

// GET TON conversion
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const amount = searchParams.get('amount');
    const from = searchParams.get('from') || Currency.USD;

    if (!amount) {
      return NextResponse.json({ error: 'Amount parameter is required' }, { status: 400 });
    }

    // Call the backend API to convert to TON
    const conversion = await mintApi.get(`/convert/ton?amount=${amount}&from=${from}`);

    if (!conversion) {
      return NextResponse.json({ error: 'Conversion failed' }, { status: 500 });
    }

    // Return the conversion result
    return NextResponse.json(conversion);
  } catch (error) {
    console.error('Error converting to TON:', error);
    return NextResponse.json({ error: 'Failed to convert to TON' }, { status: 500 });
  }
}
