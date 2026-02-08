import { NextResponse } from 'next/server';
import { getUserByUsername } from '@/server/domain/users/users.service';
import { comparePassword, generateToken } from '@/server/auth/auth.service';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

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
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error: any) {
    console.error('auth/login failed', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
