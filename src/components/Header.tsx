import React from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onViewProfile: () => void;
}

export function Header({ onViewProfile }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Campus Life</h1>
          {user && (
            <div className="flex items-center space-x-4">
              <button
                onClick={onViewProfile}
                className="flex items-center hover:bg-gray-50 rounded-lg px-3 py-2"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div className="text-left">
                  <span className="block text-sm font-medium text-gray-900">{user.name}</span>
                  <span className="block text-xs text-gray-500">{user.role}</span>
                </div>
              </button>
              <button
                onClick={logout}
                className="flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg px-3 py-2"
              >
                <LogOut className="w-5 h-5 mr-1" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}