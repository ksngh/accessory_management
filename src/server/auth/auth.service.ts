import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '@/types';

const saltRounds = 10;
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('JWT_SECRET is not set in environment variables');
}

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateToken = (user: User): string => {
  const payload = {
    id: user.id,
    username: user.username,
  };
  return jwt.sign(payload, jwtSecret, { expiresIn: '24h' });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    return null;
  }
};
