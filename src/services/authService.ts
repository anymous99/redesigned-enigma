import { User, AuthCredentials } from '../types';
import { loadData } from './dataService';

const AUTH_KEY = 'campus_life_auth';

export const login = async (credentials: AuthCredentials): Promise<User> => {
  try {
    const data = await loadData();
    
    // Find user first
    const user = data.users.find(u => u.email === credentials.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const storedPassword = data.credentials[credentials.email];
    if (!storedPassword || storedPassword !== credentials.password) {
      throw new Error('Invalid email or password');
    }

    // Store auth state
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error instanceof Error ? error : new Error('An error occurred during login');
  }
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_KEY);
};

export const getCurrentUser = (): User | null => {
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
};