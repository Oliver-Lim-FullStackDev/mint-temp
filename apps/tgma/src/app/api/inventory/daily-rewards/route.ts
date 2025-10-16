import { NextRequest, NextResponse } from 'next/server';
import { mintApi } from '@mint/client';

// GET daily rewards
export async function GET(req: NextRequest) {
  try {
    const dailyRewards = await mintApi.get('/inventory/daily-rewards');
    return NextResponse.json(dailyRewards);
  } catch (error) {
    console.error('Error fetching daily rewards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily rewards' },
      { status: 500 }
    );
  }
}