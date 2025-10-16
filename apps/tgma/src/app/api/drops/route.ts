import { mintApi } from '@mint/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const data = await mintApi.get('/drops');
  return NextResponse.json(data);
}