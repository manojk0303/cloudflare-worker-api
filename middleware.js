import { NextResponse } from 'next/server';

export function middleware(request) {
  // Only run middleware for our API routes
  if (request.nextUrl.pathname.startsWith('/api/emails')) {
    // Handle CORS preflight OPTIONS request
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': '*', // You can restrict this to your Cloudflare worker origin
          'Access-Control-Allow-Methods': 'GET,OPTIONS,POST',
          'Access-Control-Allow-Headers': 'Authorization, Content-Type',
          'Access-Control-Max-Age': '86400', // 24 hours
        },
      });
    }

    // For actual requests, add the CORS headers to the response
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};