import { NextResponse } from 'next/server';
import { createUser } from '@/server/domain/users/users.service';
import { hashPassword } from '@/server/auth/auth.service';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password are required' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const user = await createUser(username, hashedPassword);

    return NextResponse.json({ id: user.id, username: user.username }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 409 }); // 409 Conflict for existing user
  }
}
