import { NextResponse } from 'next/server';

export async function POST() {
    console.info("API COOKIE");
  const response = NextResponse.json({ ok: true });

  response.cookies.set('onboarding-completed', 'true', {
    path: '/',
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  return response;
}
