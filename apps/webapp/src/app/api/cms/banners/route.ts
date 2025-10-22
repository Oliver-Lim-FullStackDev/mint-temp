import { NextRequest, NextResponse } from 'next/server';
import { mintApi } from '@mint/client';

/**
 * GET /cms/banners
 * Fetches banners from the NestJS backend and returns them as JSON.
 */
export async function GET(_req: NextRequest) {
  try {
    // Call the NestJS backend to get banners
    const banners = await mintApi.get('/cms/banners');

    if (!banners) {
      return NextResponse.json({ error: 'No banners found' }, { status: 404 });
    }

    return NextResponse.json(banners);
  } catch (error: any) {
    console.error('Error fetching CMS banners:', error);
    const message = error?.message || 'Failed to fetch banners';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
