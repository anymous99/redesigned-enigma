import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Club } from '../types';

interface EditClubModalProps {
  club: Club;
  onClose: () => void;
  onSubmit: (clubId: string, updates: Partial<Club>) => void;
}

export function EditClubModal({ club, onClose, onSubmit }: EditClubModalProps) {
  const [image, setImage] = useState(club.image);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(club.id, { image });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Edit Club Logo</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Logo
            </label>
            <img
              src={image}
              alt={club.name}
              className="w-32 h-32 rounded-lg object-cover mb-4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Logo URL
            </label>
            <input
              type="url"
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="Enter image URL"
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
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Update Logo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}