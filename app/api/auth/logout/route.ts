import { NextResponse } from 'next/server';
import { getAuthCookieOptions } from '../../_utils/cookie';

export async function POST(request: Request) {
  const response = NextResponse.json({ message: 'Logged out' });

  response.cookies.set({
    name: 'accesstoken',
    value: '',
    ...getAuthCookieOptions(request),
    maxAge: 0,
  });

  return response;
}
