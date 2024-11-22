import { User, Club, Event, ClubMembership, JoinRequest, CustomRole } from '../types';

interface MockData {
  users: User[];
  clubs: Club[];
  events: Event[];
  clubMemberships: ClubMembership[];
  joinRequests: JoinRequest[];
  customRoles: CustomRole[];
}

const mockData: MockData = {
  users: [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@college.edu',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'
    },
    {
      id: '2',
      name: 'John Tech',
      email: 'john.coordinator@college.edu',
      role: 'coordinator',
      regNo: 'COORD001',
      department: 'Computer Science',
      phone: '1234567890',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100'
    },
    {
      id: '3',
      name: 'Mike Student',
      email: 'mike.student@college.edu',
      role: 'student',
      regNo: 'STU001',
      department: 'Computer Science',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
    }
  ],
  clubs: [
    {
      id: '1',
      name: 'Tech Innovation Club',
      description: 'Exploring cutting-edge technologies and fostering innovation',
      coordinatorId: '2',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
      category: 'Technology',
      createdAt: new Date().toISOString(),
      createdBy: '1'
    }
  ],
  events: [
    {
      id: '1',
      title: 'Tech Workshop 2024',
      description: 'Learn about the latest technologies',
      date: '2024-03-15',
      time: '14:00',
      location: 'Main Auditorium',
      clubId: '1',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
      registeredUsers: ['3'],
      status: 'approved'
    }
  ],
  clubMemberships: [
    {
      userId: '3',
      clubId: '1',
      joinedAt: new Date().toISOString(),
      role: 'member'
    }
  ],
  joinRequests: [],
  customRoles: [
    {
      id: '1',
      clubId: '1',
      name: 'Tech Lead',
      description: 'Leads technical projects and mentors team members',
      createdAt: new Date().toISOString()
    }
  ]
};

export const { users, clubs, events, clubMemberships, joinRequests, customRoles } = mockData;
export default mockData;