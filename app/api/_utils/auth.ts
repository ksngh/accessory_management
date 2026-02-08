import { NextRequest } from 'next/server';
import { verifyToken } from '@/server/auth/auth.service';

export const getUserIdFromRequest = (request: NextRequest): number | null => {
  const token = request.cookies.get('accesstoken')?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  const userId = Number(payload?.id);

  if (!Number.isFinite(userId)) return null;
  return userId;
};
