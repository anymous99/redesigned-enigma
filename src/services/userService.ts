import { User } from '../types';
import { loadData, saveData } from './dataService';

export const getUsers = async (): Promise<User[]> => {
  const data = await loadData();
  return data.users;
};

export const createUser = async (userData: Partial<User>, password: string): Promise<User> => {
  const data = await loadData();
  
  // Check if email already exists
  if (data.users.some(user => user.email === userData.email)) {
    throw new Error('Email already exists');
  }

  // Create new user
  const newUser: User = {
    id: String(data.users.length + 1),
    name: userData.name!,
    email: userData.email!,
    role: userData.role!,
    regNo: userData.regNo,
    department: userData.department,
    phone: userData.phone,
    avatar: userData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name!)}&background=random`
  };

  // Update data
  const updatedData = {
    users: [...data.users, newUser],
    credentials: [...data.credentials, [userData.email!, password]]
  };

  await saveData(updatedData);
  return newUser;
};

export const updateUser = async (userId: string, updates: Partial<User>): Promise<User> => {
  const data = await loadData();
  const userIndex = data.users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  const updatedUser = {
    ...data.users[userIndex],
    ...updates
  };

  const updatedUsers = [...data.users];
  updatedUsers[userIndex] = updatedUser;

  await saveData({ users: updatedUsers });
  return updatedUser;
};

export const deleteUser = async (userId: string): Promise<void> => {
  const data = await loadData();
  const user = data.users.find(u => u.id === userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  const updatedData = {
    users: data.users.filter(u => u.id !== userId),
    credentials: data.credentials.filter(([email]) => email !== user.email),
    clubMemberships: data.clubMemberships.filter(m => m.userId !== userId)
  };

  await saveData(updatedData);
};