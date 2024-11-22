import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';
import { loadData } from '../services/dataService';

export function LoginPage() {
  const { login } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await loadData();
        setUsers(data.users || []);
      } catch (err) {
        setError('Failed to load users');
        console.error('Error loading users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Users</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // Group users by role
  const groupedUsers = users.reduce((acc, user) => {
    if (!acc[user.role]) {
      acc[user.role] = [];
    }
    acc[user.role].push(user);
    return acc;
  }, {} as Record<string, User[]>);

  const roleOrder = ['admin', 'coordinator', 'student'];
  const roleLabels = {
    admin: 'Administrators',
    coordinator: 'Coordinators',
    student: 'Students'
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Campus Life
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Select a profile to continue
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-8">
            {roleOrder.map(role => (
              groupedUsers[role]?.length > 0 && (
                <div key={role}>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {roleLabels[role as keyof typeof roleLabels]}
                  </h3>
                  <div className="space-y-4">
                    {groupedUsers[role].map((profile) => (
                      <button
                        key={profile.id}
                        onClick={() => login(profile.email)}
                        className="w-full p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-4"
                      >
                        <img
                          src={profile.avatar}
                          alt={profile.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1 text-left">
                          <h3 className="text-lg font-medium text-gray-900">
                            {profile.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className="inline-block px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-100 rounded-full capitalize">
                              {profile.role}
                            </span>
                            {profile.department && (
                              <span className="text-sm text-gray-500">
                                {profile.department}
                              </span>
                            )}
                            {profile.regNo && (
                              <span className="text-sm text-gray-500">
                                • {profile.regNo}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}