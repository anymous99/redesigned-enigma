import React, { useState } from 'react';
import { X, Users, Calendar, Settings } from 'lucide-react';
import { Club, JoinRequest, ClubRole, ClubMembership } from '../types';
import { users, clubMemberships, events, joinRequests } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { JoinRequestModal } from './JoinRequestModal';
import { ManageRequestModal } from './ManageRequestModal';
import { ManageMemberModal } from './ManageMemberModal';
import { ClubMembersModal } from './ClubMembersModal';

interface ClubModalProps {
  club: Club;
  onClose: () => void;
}

export function ClubModal({ club, onClose }: ClubModalProps) {
  const { user } = useAuth();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showMembersListModal, setShowMembersListModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<JoinRequest | null>(null);
  const [selectedMembership, setSelectedMembership] = useState<ClubMembership | null>(null);
  
  const memberships = clubMemberships.filter(m => m.clubId === club.id);
  const members = memberships.map(m => ({
    membership: m,
    user: users.find(u => u.id === m.userId)!
  }));

  const clubEvents = events.filter(e => e.clubId === club.id);
  const isMember = user && memberships.some(m => m.userId === user.id);
  const isCoordinator = user?.id === club.coordinatorId;
  
  const pendingRequests = joinRequests.filter(
    req => req.clubId === club.id && req.status === 'pending'
  );

  const userRequest = user 
    ? joinRequests.find(
        req => req.clubId === club.id && 
        req.userId === user.id && 
        req.status === 'pending'
      )
    : null;

  const handleJoinRequest = (message: string) => {
    const newRequest: JoinRequest = {
      id: String(joinRequests.length + 1),
      userId: user!.id,
      clubId: club.id,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      message
    };
    joinRequests.push(newRequest);
    setShowJoinModal(false);
  };

  const handleRequestResponse = (
    request: JoinRequest,
    status: 'approved' | 'rejected',
    responseMessage: string,
    assignedRole?: ClubRole
  ) => {
    const requestIndex = joinRequests.findIndex(r => r.id === request.id);
    if (requestIndex !== -1) {
      joinRequests[requestIndex] = {
        ...request,
        status,
        responseMessage,
        respondedAt: new Date().toISOString(),
        assignedRole
      };

      if (status === 'approved') {
        clubMemberships.push({
          userId: request.userId,
          clubId: request.clubId,
          joinedAt: new Date().toISOString(),
          role: assignedRole
        });
      }
    }
    setShowManageModal(false);
    setSelectedRequest(null);
  };

  const handleUpdateMemberRole = (membership: ClubMembership, newRole: ClubRole) => {
    const membershipIndex = clubMemberships.findIndex(
      m => m.userId === membership.userId && m.clubId === membership.clubId
    );
    if (membershipIndex !== -1) {
      clubMemberships[membershipIndex] = {
        ...membership,
        role: newRole
      };
    }
    setShowMemberModal(false);
    setSelectedMembership(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative h-64">
          <img 
            src={club.image} 
            alt={club.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-full">
            {club.category}
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">{club.name}</h2>
          <p className="text-gray-600 mb-6">{club.description}</p>
          
          <div className="space-y-6">
            {isCoordinator && pendingRequests.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Pending Requests ({pendingRequests.length})
                </h3>
                <div className="space-y-2">
                  {pendingRequests.map(request => {
                    const requestUser = users.find(u => u.id === request.userId);
                    return (
                      <div key={request.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center">
                          <img
                            src={requestUser?.avatar}
                            alt={requestUser?.name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <div>
                            <p className="font-medium">{requestUser?.name}</p>
                            <p className="text-sm text-gray-500">
                              {requestUser?.regNo} - {requestUser?.department}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowManageModal(true);
                          }}
                          className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                          Review
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">Members ({members.length})</h3>
                {(isCoordinator || isMember) && (
                  <button
                    onClick={() => setShowMembersListModal(true)}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    View All Members
                  </button>
                )}
              </div>
              <div className="flex -space-x-2 overflow-hidden">
                {members.slice(0, 5).map(({ user: member }) => (
                  <img
                    key={member.id}
                    src={member.avatar}
                    alt={member.name}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                  />
                ))}
                {members.length > 5 && (
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 ring-2 ring-white">
                    <span className="text-xs font-medium text-gray-500">
                      +{members.length - 5}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Upcoming Events</h3>
              <div className="space-y-3">
                {clubEvents.map(event => (
                  <div key={event.id} className="flex items-center bg-gray-50 rounded-lg p-3">
                    <Calendar className="w-5 h-5 mr-3 text-indigo-600" />
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(event.date), 'MMMM d, yyyy')} at {event.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {user?.role === 'student' && !isMember && !userRequest && (
            <button
              className="w-full mt-6 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              onClick={() => setShowJoinModal(true)}
            >
              Request to Join Club
            </button>
          )}

          {userRequest && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Your join request is pending approval from the coordinator.
              </p>
            </div>
          )}
        </div>
      </div>

      {showJoinModal && (
        <JoinRequestModal
          onClose={() => setShowJoinModal(false)}
          onSubmit={handleJoinRequest}
        />
      )}

      {showManageModal && selectedRequest && (
        <ManageRequestModal
          request={selectedRequest}
          onClose={() => {
            setShowManageModal(false);
            setSelectedRequest(null);
          }}
          onSubmit={handleRequestResponse}
        />
      )}

      {showMemberModal && selectedMembership && (
        <ManageMemberModal
          membership={selectedMembership}
          onClose={() => {
            setShowMemberModal(false);
            setSelectedMembership(null);
          }}
          onSubmit={handleUpdateMemberRole}
        />
      )}

      {showMembersListModal && (
        <ClubMembersModal
          club={club}
          members={members}
          onClose={() => setShowMembersListModal(false)}
        />
      )}
    </div>
  );
}