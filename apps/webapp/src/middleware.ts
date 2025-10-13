import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { paths } from '@/routes/paths';

export function middleware(request: NextRequest) {
  const { href, pathname, searchParams } = request.nextUrl;
  const protocol = request.headers.get('x-forwarded-proto') ?? 'http';
  const host = request.headers.get('host'); // satisfies local domains too
  const origin = `${protocol}://${host}`;

  /**
   * VERCEL
   */
  const vercelToken = searchParams.get('x-vercel-protection-bypass');
  if (vercelToken) {
    // Remove token from URL and set it as a cookie
    const cleanedUrl = new URL(href);
    cleanedUrl.searchParams.delete('x-vercel-protection-bypass');

    const response = NextResponse.redirect(cleanedUrl);
    response.cookies.set('x-vercel-protection-bypass', vercelToken, {
      httpOnly: true,
      secure: true,
      path: '/',
      sameSite: 'strict',
    });

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/(.*)'], // apply to all routes
};
