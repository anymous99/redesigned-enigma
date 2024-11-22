import React from 'react';
import { X } from 'lucide-react';
import { Club, User, ClubMembership } from '../types';

interface ClubMembersModalProps {
  club: Club;
  members: Array<{
    membership: ClubMembership;
    user: User;
  }>;
  onClose: () => void;
}

export function ClubMembersModal({ club, members, onClose }: ClubMembersModalProps) {
  // Group members by role
  const groupedMembers = members.reduce((acc, { membership, user }) => {
    const role = membership.role || 'member';
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push({ membership, user });
    return acc;
  }, {} as Record<string, typeof members>);

  // Order roles by importance
  const roleOrder = ['vice_president', 'secretary', 'treasurer', 'member'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">{club.name} Members</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {roleOrder.map(role => {
            const roleMembers = groupedMembers[role];
            if (!roleMembers?.length) return null;

            return (
              <div key={role} className="mb-6 last:mb-0">
                <h3 className="text-lg font-medium mb-3 capitalize">
                  {role.replace('_', ' ')}s
                </h3>
                <div className="space-y-3">
                  {roleMembers.map(({ user }) => (
                    <div key={user.id} className="flex items-center bg-gray-50 rounded-lg p-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">
                          {user.department} • {user.regNo}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}