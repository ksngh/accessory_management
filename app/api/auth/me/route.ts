import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/server/auth/auth.service';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('accesstoken')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ user: payload });
  } catch (error) {
    console.error('auth/me failed', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
