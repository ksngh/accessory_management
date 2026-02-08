import * as repo from './users.repo';
import { User } from '@/types';

export const getUser = async (id: number): Promise<User | null> => {
  return await repo.findUserById(id);
};

export const getUserByUsername = async (username: string): Promise<User | null> => {
  return await repo.findUserByUsername(username);
};

export const createUser = async (username: string, hashedPassword: string): Promise<User> => {
  // Basic validation
  if (!username || !hashedPassword) {
    throw new Error('Username and password are required');
  }
  const existingUser = await repo.findUserByUsername(username);
  if (existingUser) {
    throw new Error('Username already exists');
  }
  return await repo.createUser(username, hashedPassword);
};
