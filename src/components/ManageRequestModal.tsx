import React, { useState } from 'react';
import { X } from 'lucide-react';
import { JoinRequest, ClubRole, User } from '../types';
import { users } from '../data/mockData';

interface ManageRequestModalProps {
  request: JoinRequest;
  onClose: () => void;
  onSubmit: (
    request: JoinRequest,
    status: 'approved' | 'rejected',
    message: string,
    role?: ClubRole
  ) => void;
}

export function ManageRequestModal({ request, onClose, onSubmit }: ManageRequestModalProps) {
  const [status, setStatus] = useState<'approved' | 'rejected'>('approved');
  const [message, setMessage] = useState('');
  const [role, setRole] = useState<ClubRole>('member');

  const requestUser = users.find(u => u.id === request.userId) as User;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(request, status, message, status === 'approved' ? role : undefined);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Review Join Request</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <img
                src={requestUser.avatar}
                alt={requestUser.name}
                className="w-12 h-12 rounded-full mr-3"
              />
              <div>
                <h3 className="font-medium">{requestUser.name}</h3>
                <p className="text-sm text-gray-500">{requestUser.regNo}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-600">{request.message}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Decision
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={status === 'approved'}
                    onChange={() => setStatus('approved')}
                    className="mr-2"
                  />
                  Approve
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={status === 'rejected'}
                    onChange={() => setStatus('rejected')}
                    className="mr-2"
                  />
                  Reject
                </label>
              </div>
            </div>

            {status === 'approved' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as ClubRole)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="member">Member</option>
                  <option value="secretary">Secretary</option>
                  <option value="treasurer">Treasurer</option>
                  <option value="vice_president">Vice President</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Response Message
              </label>
              <textarea
                required
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                placeholder={`Explain why you're ${status === 'approved' ? 'approving' : 'rejecting'} this request...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 text-white rounded-lg ${
                  status === 'approved'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {status === 'approved' ? 'Approve Request' : 'Reject Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}