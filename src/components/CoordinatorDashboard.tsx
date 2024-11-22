import React, { useState, useEffect } from 'react';
import { Users, Calendar, Bell, Edit, UserPlus, CheckCircle, XCircle } from 'lucide-react';
import { Club, Event, User, JoinRequest, ClubMembership } from '../types';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { ManageRequestModal } from './ManageRequestModal';
import { ManageMemberModal } from './ManageMemberModal';
import { Header } from './Header';
import { ProfileModal } from './ProfileModal';
import { EditClubModal } from './EditClubModal';
import { loadData, saveData } from '../services/dataService';

interface DashboardData {
  users: User[];
  clubs: Club[];
  events: Event[];
  clubMemberships: ClubMembership[];
  joinRequests: JoinRequest[];
}

const initialData: DashboardData = {
  users: [],
  clubs: [],
  events: [],
  clubMemberships: [],
  joinRequests: []
};

export function CoordinatorDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showManageRequest, setShowManageRequest] = useState(false);
  const [showManageMember, setShowManageMember] = useState(false);
  const [showEditClub, setShowEditClub] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<JoinRequest | null>(null);
  const [selectedMembership, setSelectedMembership] = useState<ClubMembership | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loadedData = await loadData();
        if (loadedData) {
          setData({
            users: loadedData.users || [],
            clubs: loadedData.clubs || [],
            events: loadedData.events || [],
            clubMemberships: loadedData.clubMemberships || [],
            joinRequests: loadedData.joinRequests || []
          });
        }
      } catch (err) {
        setError('Failed to load data');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (!user) {
    return null;
  }

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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const coordinatorClub = data.clubs.find(club => club.coordinatorId === user.id);

  if (!coordinatorClub) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onViewProfile={() => setShowProfile(true)} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome, Coordinator!</h2>
            <p className="text-gray-600">You haven't been assigned to any clubs yet.</p>
          </div>
        </div>
        {showProfile && (
          <ProfileModal user={user} onClose={() => setShowProfile(false)} />
        )}
      </div>
    );
  }

  // Get club members with safe array operations
  const clubMembers = data.clubMemberships
    .filter(m => m.clubId === coordinatorClub.id)
    .map(membership => ({
      membership,
      user: data.users.find(u => u.id === membership.userId)
    }))
    .filter(member => member.user !== undefined);

  // Get club events with safe array operations
  const clubEvents = data.events
    .filter(event => event.clubId === coordinatorClub.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Get pending join requests with safe array operations
  const pendingRequests = data.joinRequests
    .filter(req => req.clubId === coordinatorClub.id && req.status === 'pending')
    .map(request => ({
      request,
      user: data.users.find(u => u.id === request.userId)
    }))
    .filter(req => req.user !== undefined);

  const handleRequestResponse = async (
    request: JoinRequest,
    status: 'approved' | 'rejected',
    responseMessage: string,
    role?: string
  ) => {
    try {
      const updatedRequests = data.joinRequests.map(r =>
        r.id === request.id
          ? {
              ...r,
              status,
              responseMessage,
              respondedAt: new Date().toISOString(),
              assignedRole: role
            }
          : r
      );

      let updatedMemberships = [...data.clubMemberships];

      if (status === 'approved') {
        updatedMemberships.push({
          userId: request.userId,
          clubId: request.clubId,
          joinedAt: new Date().toISOString(),
          role: role || 'member'
        });
      }

      const updatedData = {
        ...data,
        joinRequests: updatedRequests,
        clubMemberships: updatedMemberships
      };

      await saveData(updatedData);
      setData(updatedData);
      setShowManageRequest(false);
      setSelectedRequest(null);
    } catch (err) {
      console.error('Error handling request:', err);
      setError('Failed to process request');
    }
  };

  const handleUpdateMemberRole = async (membership: ClubMembership, newRole: string) => {
    try {
      const updatedMemberships = data.clubMemberships.map(m =>
        m.userId === membership.userId && m.clubId === membership.clubId
          ? { ...m, role: newRole }
          : m
      );

      const updatedData = {
        ...data,
        clubMemberships: updatedMemberships
      };

      await saveData(updatedData);
      setData(updatedData);
      setShowManageMember(false);
      setSelectedMembership(null);
    } catch (err) {
      console.error('Error updating member role:', err);
      setError('Failed to update member role');
    }
  };

  const handleRemoveMember = async (membership: ClubMembership) => {
    try {
      const updatedMemberships = data.clubMemberships.filter(
        m => !(m.userId === membership.userId && m.clubId === membership.clubId)
      );

      const updatedData = {
        ...data,
        clubMemberships: updatedMemberships
      };

      await saveData(updatedData);
      setData(updatedData);
      setShowManageMember(false);
      setSelectedMembership(null);
    } catch (err) {
      console.error('Error removing member:', err);
      setError('Failed to remove member');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onViewProfile={() => setShowProfile(true)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Club Overview */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-48">
            <img 
              src={coordinatorClub.image} 
              alt={coordinatorClub.name}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setShowEditClub(true)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
            >
              <Edit className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            <div className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-full">
              {coordinatorClub.category}
            </div>
            <h2 className="text-2xl font-bold mb-2">{coordinatorClub.name}</h2>
            <p className="text-gray-600">{coordinatorClub.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Join Requests */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <UserPlus className="w-6 h-6 text-indigo-600 mr-2" />
                <h3 className="text-xl font-semibold">Join Requests</h3>
              </div>
              {pendingRequests.length > 0 && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  {pendingRequests.length} pending
                </span>
              )}
            </div>
            <div className="space-y-4">
              {pendingRequests.map(({ request, user }) => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-gray-500">
                        {user?.department} • {user?.regNo}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowManageRequest(true);
                    }}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Review
                  </button>
                </div>
              ))}
              {pendingRequests.length === 0 && (
                <p className="text-center text-gray-500">No pending join requests</p>
              )}
            </div>
          </div>

          {/* Club Members */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <Users className="w-6 h-6 text-indigo-600 mr-2" />
              <h3 className="text-xl font-semibold">Club Members ({clubMembers.length})</h3>
            </div>
            <div className="space-y-4">
              {clubMembers.map(({ membership, user }) => (
                <div key={user?.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-sm text-gray-500">
                        {membership.role || 'Member'} • {user?.department}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedMembership(membership);
                      setShowManageMember(true);
                    }}
                    className="px-3 py-1 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                  >
                    Manage
                  </button>
                </div>
              ))}
              {clubMembers.length === 0 && (
                <p className="text-center text-gray-500">No members yet</p>
              )}
            </div>
          </div>

          {/* Club Events */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-6">
              <Calendar className="w-6 h-6 text-indigo-600 mr-2" />
              <h3 className="text-xl font-semibold">Club Events</h3>
            </div>
            <div className="space-y-4">
              {clubEvents.map(event => (
                <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium">{event.title}</h4>
                      {event.status && (
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                          event.status === 'approved' 
                            ? 'bg-green-100 text-green-800'
                            : event.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      {format(new Date(event.date), 'MMMM d, yyyy')} at {event.time}
                    </div>
                  </div>
                  {event.status === 'proposed' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRequestResponse(
                          { ...event, id: event.id },
                          'approved',
                          'Event approved'
                        )}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRequestResponse(
                          { ...event, id: event.id },
                          'rejected',
                          'Event rejected'
                        )}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {clubEvents.length === 0 && (
                <p className="text-center text-gray-500">No events yet</p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {showProfile && user && (
        <ProfileModal user={user} onClose={() => setShowProfile(false)} />
      )}

      {showManageRequest && selectedRequest && (
        <ManageRequestModal
          request={selectedRequest}
          onClose={() => {
            setShowManageRequest(false);
            setSelectedRequest(null);
          }}
          onSubmit={handleRequestResponse}
        />
      )}

      {showManageMember && selectedMembership && (
        <ManageMemberModal
          membership={selectedMembership}
          onClose={() => {
            setShowManageMember(false);
            setSelectedMembership(null);
          }}
          onSubmit={handleUpdateMemberRole}
          onRemove={handleRemoveMember}
        />
      )}

      {showEditClub && coordinatorClub && (
        <EditClubModal
          club={coordinatorClub}
          onClose={() => setShowEditClub(false)}
          onSubmit={async (clubId, updates) => {
            try {
              const updatedClubs = data.clubs.map(club =>
                club.id === clubId ? { ...club, ...updates } : club
              );

              const updatedData = {
                ...data,
                clubs: updatedClubs
              };

              await saveData(updatedData);
              setData(updatedData);
              setShowEditClub(false);
            } catch (err) {
              console.error('Error updating club:', err);
              setError('Failed to update club');
            }
          }}
        />
      )}
    </div>
  );
}