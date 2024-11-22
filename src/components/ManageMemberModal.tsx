import React, { useState } from 'react';
import { X, Plus, UserMinus } from 'lucide-react';
import { ClubMembership, ClubRole, User } from '../types';
import { customRoles } from '../data/mockData';

interface ManageMemberModalProps {
  membership: ClubMembership;
  onClose: () => void;
  onSubmit: (membership: ClubMembership, newRole: ClubRole) => void;
  onRemove: (membership: ClubMembership) => void;
}

export function ManageMemberModal({ membership, onClose, onSubmit, onRemove }: ManageMemberModalProps) {
  const [role, setRole] = useState<ClubRole>(membership.role || 'member');
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);

  const clubCustomRoles = customRoles.filter(r => r.clubId === membership.clubId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(membership, role);
  };

  const baseRoleDescriptions = {
    member: 'Regular club member with basic privileges',
    secretary: 'Manages club records and communications',
    treasurer: 'Handles club finances and budget',
    vice_president: 'Assists in club leadership and coordination'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Manage Member Role</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Current Role: <span className="text-indigo-600 capitalize">{membership.role || 'Member'}</span>
              </label>
            </div>

            <div className="space-y-3">
              <div className="border-b pb-4 mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Base Roles</h4>
                {Object.entries(baseRoleDescriptions).map(([roleKey, description]) => (
                  <label key={roleKey} className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50 mb-2">
                    <input
                      type="radio"
                      name="role"
                      value={roleKey}
                      checked={role === roleKey}
                      onChange={(e) => setRole(e.target.value as ClubRole)}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <p className="font-medium capitalize">{roleKey.replace('_', ' ')}</p>
                      <p className="text-sm text-gray-500">{description}</p>
                    </div>
                  </label>
                ))}
              </div>

              {clubCustomRoles.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Custom Roles</h4>
                  {clubCustomRoles.map((customRole) => (
                    <label key={customRole.id} className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50 mb-2">
                      <input
                        type="radio"
                        name="role"
                        value={customRole.name}
                        checked={role === customRole.name}
                        onChange={(e) => setRole(e.target.value)}
                        className="mt-1 mr-3"
                      />
                      <div>
                        <p className="font-medium">{customRole.name}</p>
                        <p className="text-sm text-gray-500">{customRole.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between gap-4 mt-6">
            <button
              type="button"
              onClick={() => setShowConfirmRemove(true)}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center"
            >
              <UserMinus className="w-5 h-5 mr-2" />
              Remove Member
            </button>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Update Role
              </button>
            </div>
          </div>
        </form>

        {showConfirmRemove && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-2">Remove Member</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to remove this member from the club? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowConfirmRemove(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onRemove(membership)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Remove Member
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}