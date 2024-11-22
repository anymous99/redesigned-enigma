import React from 'react';
import { Users } from 'lucide-react';
import { Club } from '../types';
import { users, clubMemberships } from '../data/mockData';

interface ClubCardProps {
  club: Club;
  onClick: (club: Club) => void;
}

export function ClubCard({ club, onClick }: ClubCardProps) {
  const coordinator = users.find(user => user.id === club.coordinatorId);
  const memberCount = clubMemberships.filter(m => m.clubId === club.id).length;

  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer"
      onClick={() => onClick(club)}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={club.image} 
          alt={club.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-full">
          {club.category}
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-900">{club.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{club.description}</p>
        <div className="flex items-center justify-between text-gray-600">
          <div className="flex items-center">
            <img
              src={coordinator?.avatar}
              alt={coordinator?.name}
              className="w-6 h-6 rounded-full mr-2"
            />
            <span>{coordinator?.name}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{memberCount} members</span>
          </div>
        </div>
      </div>
    </div>
  );
}