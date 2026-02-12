import { NextResponse } from 'next/server';
import { getUserByUsername } from '@/server/domain/users/users.service';
import { comparePassword, generateToken } from '@/server/auth/auth.service';
import { getAuthCookieOptions } from '../../_utils/cookie';

export async function POST(request: Request) {
  try {
    let payload: { username?: string; password?: string } = {};
    try {
      payload = await request.json();
    } catch {
      return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }

    const { username, password } = payload;

    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }

    const user = await getUserByUsername(username);

    if (!user || !user.password) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateToken(user);

    const response = NextResponse.json({ token });
    response.cookies.set({
      name: 'accesstoken',
      value: token,
      ...getAuthCookieOptions(request),
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error: any) {
    console.error('auth/login failed', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
