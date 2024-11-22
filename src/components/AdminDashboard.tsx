import React, { useState, useEffect } from 'react';
import { Users, Calendar, Plus, Download } from 'lucide-react';
import { User, Club, Event } from '../types';
import { Header } from './Header';
import { ProfileModal } from './ProfileModal';
import { CreateClubModal } from './CreateClubModal';
import { CreateCoordinatorModal } from './CreateCoordinatorModal';
import { CreateStudentModal } from './CreateStudentModal';
import { EditClubModal } from './EditClubModal';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';
import { loadData, saveData } from '../services/dataService';

interface DashboardData {
  users: User[];
  clubs: Club[];
  events: Event[];
  clubMemberships: any[];
  joinRequests: any[];
  credentials: Record<string, string>;
}

const initialDashboardData: DashboardData = {
  users: [],
  clubs: [],
  events: [],
  clubMemberships: [],
  joinRequests: [],
  credentials: {}
};

export function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData>(initialDashboardData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showCreateCoordinator, setShowCreateCoordinator] = useState(false);
  const [showCreateStudent, setShowCreateStudent] = useState(false);
  const [showCreateClub, setShowCreateClub] = useState(false);
  const [showEditClub, setShowEditClub] = useState(false);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loadedData = await loadData();
        if (loadedData) {
          setData(loadedData);
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

  // Ensure data exists before filtering
  const students = data?.users?.filter(u => u.role === 'student') || [];
  const coordinators = data?.users?.filter(u => u.role === 'coordinator') || [];
  const pendingEvents = data?.events?.filter(e => e.status === 'proposed') || [];

  const handleExportData = () => {
    try {
      const exportData = {
        clubs: data.clubs || [],
        events: data.events || [],
        members: data.clubMemberships || [],
        users: (data.users || []).map(u => ({
          name: u.name,
          email: u.email,
          role: u.role,
          department: u.department,
          regNo: u.regNo
        }))
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `campus_life_export_${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting data:', err);
      setError('Failed to export data');
    }
  };

  const handleCreateCoordinator = async (coordinatorData: any) => {
    try {
      const newUser: User = {
        id: String((data.users || []).length + 1),
        ...coordinatorData,
        role: 'coordinator',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(coordinatorData.name)}&background=random`
      };

      const updatedData = {
        ...data,
        users: [...(data.users || []), newUser],
        credentials: {
          ...(data.credentials || {}),
          [coordinatorData.email]: coordinatorData.password
        }
      };

      await saveData(updatedData);
      setData(updatedData);
      setShowCreateCoordinator(false);
    } catch (err) {
      console.error('Error creating coordinator:', err);
      setError('Failed to create coordinator');
    }
  };

  const handleCreateStudent = async (studentData: any) => {
    try {
      const newUser: User = {
        id: String((data.users || []).length + 1),
        ...studentData,
        role: 'student',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(studentData.name)}&background=random`
      };

      const updatedData = {
        ...data,
        users: [...(data.users || []), newUser],
        credentials: {
          ...(data.credentials || {}),
          [studentData.email]: studentData.password
        }
      };

      await saveData(updatedData);
      setData(updatedData);
      setShowCreateStudent(false);
    } catch (err) {
      console.error('Error creating student:', err);
      setError('Failed to create student');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onViewProfile={() => setShowProfile(true)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Total Students</h3>
            <p className="text-3xl font-bold text-indigo-600">{students.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Coordinators</h3>
            <p className="text-3xl font-bold text-indigo-600">{coordinators.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Total Clubs</h3>
            <p className="text-3xl font-bold text-indigo-600">{data.clubs?.length || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Pending Events</h3>
            <p className="text-3xl font-bold text-indigo-600">{pendingEvents.length}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowCreateCoordinator(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Coordinator
          </button>
          <button
            onClick={() => setShowCreateStudent(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Student
          </button>
          <button
            onClick={() => setShowCreateClub(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Club
          </button>
          <button
            onClick={handleExportData}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download className="w-5 h-5 mr-2" />
            Export Data
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Coordinators List */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Coordinators</h2>
            <div className="space-y-4">
              {coordinators.map((coordinator) => {
                const coordinatorClub = data.clubs?.find(c => c.coordinatorId === coordinator.id);
                return (
                  <div key={coordinator.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <img
                        src={coordinator.avatar}
                        alt={coordinator.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-medium">{coordinator.name}</p>
                        <p className="text-sm text-gray-500">
                          {coordinatorClub ? coordinatorClub.name : 'No club assigned'}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{coordinator.department}</span>
                  </div>
                );
              })}
              {coordinators.length === 0 && (
                <p className="text-center text-gray-500 py-4">No coordinators found</p>
              )}
            </div>
          </div>

          {/* Students List */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Students</h2>
            <div className="space-y-4">
              {students.map((student) => {
                const studentClubs = data.clubMemberships
                  ?.filter(m => m.userId === student.id)
                  .map(m => data.clubs?.find(c => c.id === m.clubId)?.name)
                  .filter(Boolean) || [];

                return (
                  <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-gray-500">
                          {student.regNo} • {studentClubs.length} clubs
                        </p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">{student.department}</span>
                  </div>
                );
              })}
              {students.length === 0 && (
                <p className="text-center text-gray-500 py-4">No students found</p>
              )}
            </div>
          </div>
        </div>
      </main>

      {showProfile && user && (
        <ProfileModal user={user} onClose={() => setShowProfile(false)} />
      )}

      {showCreateCoordinator && (
        <CreateCoordinatorModal
          onClose={() => setShowCreateCoordinator(false)}
          onSubmit={handleCreateCoordinator}
        />
      )}

      {showCreateStudent && (
        <CreateStudentModal
          onClose={() => setShowCreateStudent(false)}
          onSubmit={handleCreateStudent}
        />
      )}

      {showCreateClub && (
        <CreateClubModal
          coordinators={coordinators}
          onClose={() => setShowCreateClub(false)}
          onSubmit={async (clubData) => {
            try {
              const newClub = {
                id: String((data.clubs || []).length + 1),
                ...clubData,
                createdAt: new Date().toISOString(),
                createdBy: user?.id
              };

              const updatedData = {
                ...data,
                clubs: [...(data.clubs || []), newClub]
              };

              await saveData(updatedData);
              setData(updatedData);
              setShowCreateClub(false);
            } catch (err) {
              console.error('Error creating club:', err);
              setError('Failed to create club');
            }
          }}
        />
      )}

      {showEditClub && selectedClub && (
        <EditClubModal
          club={selectedClub}
          onClose={() => {
            setShowEditClub(false);
            setSelectedClub(null);
          }}
          onSubmit={async (clubId, updates) => {
            try {
              const updatedClubs = (data.clubs || []).map(club =>
                club.id === clubId ? { ...club, ...updates } : club
              );

              const updatedData = {
                ...data,
                clubs: updatedClubs
              };

              await saveData(updatedData);
              setData(updatedData);
              setShowEditClub(false);
              setSelectedClub(null);
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