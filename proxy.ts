import { NextRequest, NextResponse } from 'next/server';

const allowedOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:5173';
const allowedMethods = 'GET,DELETE,PATCH,POST,PUT,OPTIONS';
const allowedHeaders = 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version';

export function proxy(request: NextRequest) {
  const origin = request.headers.get('origin');
  const isAllowedOrigin = origin === allowedOrigin;

  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 204 });
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Vary', 'Origin');
    }
    response.headers.set('Access-Control-Allow-Methods', allowedMethods);
    response.headers.set('Access-Control-Allow-Headers', allowedHeaders);
    return response;
  }

  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Vary', 'Origin');
  }
  response.headers.set('Access-Control-Allow-Methods', allowedMethods);
  response.headers.set('Access-Control-Allow-Headers', allowedHeaders);
  return response;
}

export const config = {
  matcher: '/api/:path*',
};