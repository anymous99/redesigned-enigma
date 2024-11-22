import React from 'react';
import { X, Mail, Phone, BookOpen, Building, Calendar } from 'lucide-react';
import { User } from '../types';
import { clubs, clubMemberships, events } from '../data/mockData';
import { format } from 'date-fns';

interface ProfileModalProps {
  user: User;
  onClose: () => void;
}

export function ProfileModal({ user, onClose }: ProfileModalProps) {
  // Get user's clubs
  const userClubs = user.role === 'coordinator'
    ? clubs.filter(club => club.coordinatorId === user.id)
    : clubMemberships
        .filter(m => m.userId === user.id)
        .map(m => ({
          club: clubs.find(c => c.id === m.clubId)!,
          role: m.role || 'Member',
          joinedAt: m.joinedAt
        }));

  // Get user's events
  const userEvents = events.filter(event => {
    if (user.role === 'coordinator') {
      return clubs.some(club => club.coordinatorId === user.id && club.id === event.clubId);
    }
    return event.registeredUsers.includes(user.id);
  });

  const contactInfo = [
    { id: 'email', icon: <Mail className="w-5 h-5 mr-3" />, value: user.email },
    user.phone && { id: 'phone', icon: <Phone className="w-5 h-5 mr-3" />, value: user.phone },
    user.regNo && { id: 'regNo', icon: <BookOpen className="w-5 h-5 mr-3" />, value: user.regNo },
    user.department && { id: 'department', icon: <Building className="w-5 h-5 mr-3" />, value: user.department }
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative h-48 bg-gradient-to-r from-indigo-500 to-purple-500">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-6 pb-6">
          <div className="flex items-end -mt-16 mb-6">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-32 h-32 rounded-full border-4 border-white mr-4"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600 capitalize">{user.role}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                <div className="space-y-3">
                  {contactInfo.map(item => (
                    <div key={item.id} className="flex items-center text-gray-600">
                      {item.icon}
                      <span>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {userClubs.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    {user.role === 'coordinator' ? 'Managing Clubs' : 'Club Memberships'}
                  </h3>
                  <div className="space-y-3">
                    {userClubs.map(clubInfo => (
                      <div key={'club' in clubInfo ? clubInfo.club.id : clubInfo.id} className="bg-gray-50 rounded-lg p-3">
                        <p className="font-medium">{'club' in clubInfo ? clubInfo.club.name : clubInfo.name}</p>
                        {'role' in clubInfo && (
                          <p className="text-sm text-gray-600">
                            {clubInfo.role} • Joined {format(new Date(clubInfo.joinedAt), 'MMMM yyyy')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {userEvents.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  {user.role === 'coordinator' ? 'Managed Events' : 'Registered Events'}
                </h3>
                <div className="space-y-3">
                  {userEvents.map(event => (
                    <div key={event.id} className="bg-gray-50 rounded-lg p-3">
                      <p className="font-medium">{event.title}</p>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          {format(new Date(event.date), 'MMMM d, yyyy')} at {event.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}