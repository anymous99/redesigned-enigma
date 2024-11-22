import React, { useState, useEffect } from 'react';
import { Users, Calendar, Plus, Search, History, UserPlus } from 'lucide-react';
import { Club, Event, ClubMembership, JoinRequest } from '../types';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { Header } from './Header';
import { ProfileModal } from './ProfileModal';
import { ClubModal } from './ClubModal';
import { ProposeEventModal } from './ProposeEventModal';
import { EventModal } from './EventModal';
import { JoinRequestModal } from './JoinRequestModal';
import { loadData, saveData } from '../services/dataService';

interface DashboardData {
  users: any[];
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

export function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [showProposeEvent, setShowProposeEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'my-clubs'>('all');
  const [showPastEvents, setShowPastEvents] = useState(false);
  const [showJoinRequest, setShowJoinRequest] = useState(false);
  const [clubToJoin, setClubToJoin] = useState<Club | null>(null);

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

  // Get user's clubs with safe array operations
  const userClubs = data.clubMemberships
    .filter(m => m.userId === user.id)
    .map(membership => ({
      club: data.clubs.find(c => c.id === membership.clubId)!,
      role: membership.role || 'Member',
      joinedAt: membership.joinedAt
    }))
    .filter(uc => uc.club); // Filter out any undefined clubs

  // Filter clubs based on search and active tab with safe array operations
  const filteredClubs = data.clubs.filter(club => {
    const matchesSearch = 
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'my-clubs') {
      return matchesSearch && userClubs.some(uc => uc.club.id === club.id);
    }
    return matchesSearch;
  });

  // Get upcoming events with safe array operations
  const now = new Date();
  const upcomingEvents = data.events
    .filter(event => 
      event.status === 'approved' &&
      new Date(event.date) >= now &&
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Get past events from user's clubs with safe array operations
  const pastEvents = data.events
    .filter(event => 
      event.status === 'approved' &&
      new Date(event.date) < now &&
      userClubs.some(uc => uc.club.id === event.clubId)
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleJoinRequest = async (message: string) => {
    if (!clubToJoin || !user) return;

    try {
      const newRequest: JoinRequest = {
        id: String(data.joinRequests.length + 1),
        userId: user.id,
        clubId: clubToJoin.id,
        status: 'pending',
        requestedAt: new Date().toISOString(),
        message
      };

      const updatedData = {
        ...data,
        joinRequests: [...data.joinRequests, newRequest]
      };

      await saveData(updatedData);
      setData(updatedData);
      setShowJoinRequest(false);
      setClubToJoin(null);
    } catch (err) {
      console.error('Error creating join request:', err);
      setError('Failed to create join request');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onViewProfile={() => setShowProfile(true)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-lg w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Search clubs and events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex rounded-lg border border-gray-300 p-1">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('all')}
              >
                All Clubs
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeTab === 'my-clubs'
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('my-clubs')}
              >
                My Clubs
              </button>
            </div>
            {userClubs.length > 0 && (
              <button
                onClick={() => setShowProposeEvent(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Propose Event
              </button>
            )}
          </div>
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredClubs.map(club => {
            const coordinator = data.users.find(u => u.id === club.coordinatorId);
            const memberCount = data.clubMemberships.filter(m => m.clubId === club.id).length;
            const userMembership = userClubs.find(uc => uc.club.id === club.id);
            const hasPendingRequest = data.joinRequests.some(
              req => req.clubId === club.id && 
              req.userId === user.id && 
              req.status === 'pending'
            );

            return (
              <div key={club.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
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
                  <h3 className="text-xl font-bold mb-2">{club.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{club.description}</p>
                  
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{memberCount} members</span>
                    </div>
                    <span className="text-gray-600">
                      Coordinator: {coordinator?.name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => setSelectedClub(club)}
                      className="text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      View Details
                    </button>
                    {!userMembership && !hasPendingRequest && (
                      <button
                        onClick={() => {
                          setClubToJoin(club);
                          setShowJoinRequest(true);
                        }}
                        className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Join Club
                      </button>
                    )}
                    {hasPendingRequest && (
                      <span className="text-sm text-yellow-600">Request Pending</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {filteredClubs.length === 0 && (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No clubs found</p>
            </div>
          )}
        </div>

        {/* Events Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <div className="space-y-4">
              {upcomingEvents.map(event => {
                const eventClub = data.clubs.find(c => c.id === event.clubId);
                return (
                  <div 
                    key={event.id} 
                    className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <Calendar className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-gray-600 mb-1">{eventClub?.name}</p>
                      <div className="text-sm text-gray-500">
                        {format(new Date(event.date), 'MMMM d, yyyy')} at {event.time}
                      </div>
                    </div>
                  </div>
                );
              })}
              {upcomingEvents.length === 0 && (
                <p className="text-center text-gray-500 py-4">No upcoming events</p>
              )}
            </div>
          </div>

          {/* Past Events */}
          {userClubs.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Past Events</h2>
              <div className="space-y-4">
                {pastEvents.slice(0, showPastEvents ? undefined : 3).map(event => {
                  const eventClub = data.clubs.find(c => c.id === event.clubId);
                  return (
                    <div 
                      key={event.id} 
                      className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <History className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-gray-600 mb-1">{eventClub?.name}</p>
                        <div className="text-sm text-gray-500">
                          {format(new Date(event.date), 'MMMM d, yyyy')} at {event.time}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {pastEvents.length === 0 && (
                  <p className="text-center text-gray-500 py-4">No past events</p>
                )}
                {pastEvents.length > 3 && (
                  <button
                    onClick={() => setShowPastEvents(!showPastEvents)}
                    className="text-sm text-indigo-600 hover:text-indigo-700"
                  >
                    {showPastEvents ? 'Show Less' : 'Show More'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {showProfile && user && (
        <ProfileModal user={user} onClose={() => setShowProfile(false)} />
      )}

      {selectedClub && (
        <ClubModal
          club={selectedClub}
          onClose={() => setSelectedClub(null)}
        />
      )}

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      {showJoinRequest && clubToJoin && (
        <JoinRequestModal
          onClose={() => {
            setShowJoinRequest(false);
            setClubToJoin(null);
          }}
          onSubmit={handleJoinRequest}
        />
      )}
    </div>
  );
}