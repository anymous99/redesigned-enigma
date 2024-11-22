import { User, Club, Event, ClubMembership, CustomRole, JoinRequest } from '../types';

interface InitialData {
  users: User[];
  credentials: Record<string, string>;
  clubs: Club[];
  events: Event[];
  clubMemberships: ClubMembership[];
  joinRequests: JoinRequest[];
  customRoles: CustomRole[];
}

export const initialData: InitialData = {
  users: [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@college.edu',
      role: 'admin',
      department: 'Administration',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'
    },
    {
      id: '2',
      name: 'John Tech',
      email: 'john@college.edu',
      role: 'coordinator',
      regNo: 'COORD001',
      department: 'Computer Science',
      phone: '1234567890',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100'
    },
    {
      id: '3',
      name: 'Sarah Arts',
      email: 'sarah@college.edu',
      role: 'coordinator',
      regNo: 'COORD002',
      department: 'Fine Arts',
      phone: '0987654321',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
    },
    {
      id: '4',
      name: 'Mike Student',
      email: 'mike@college.edu',
      role: 'student',
      regNo: 'STU001',
      department: 'Computer Science',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
    },
    {
      id: '5',
      name: 'Alice Johnson',
      email: 'alice@college.edu',
      role: 'student',
      regNo: 'STU002',
      department: 'Fine Arts',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100'
    },
    {
      id: '6',
      name: 'David Chen',
      email: 'david@college.edu',
      role: 'student',
      regNo: 'STU003',
      department: 'Computer Science',
      avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=100'
    }
  ],
  credentials: {
    'admin@college.edu': 'abc123',
    'john@college.edu': 'abc123',
    'sarah@college.edu': 'abc123',
    'mike@college.edu': 'abc123',
    'alice@college.edu': 'abc123',
    'david@college.edu': 'abc123'
  },
  clubs: [
    {
      id: '1',
      name: 'Tech Innovation Club',
      description: 'Exploring cutting-edge technologies and fostering innovation through hands-on projects, workshops, and tech talks.',
      coordinatorId: '2', // John Tech
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
      category: 'Technology',
      createdAt: '2024-01-01T00:00:00Z',
      createdBy: '1'
    },
    {
      id: '2',
      name: 'Arts & Music Society',
      description: 'A creative hub for artists and musicians to collaborate, perform, and showcase their talents through exhibitions and concerts.',
      coordinatorId: '3', // Sarah Arts
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=1200',
      category: 'Arts',
      createdAt: '2024-01-15T00:00:00Z',
      createdBy: '1'
    },
    {
      id: '3',
      name: 'Robotics Club',
      description: 'Building and programming robots, participating in competitions, and exploring automation technologies.',
      coordinatorId: '2', // John Tech
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200',
      category: 'Technology',
      createdAt: '2024-02-01T00:00:00Z',
      createdBy: '1'
    }
  ],
  events: [
    {
      id: '1',
      title: 'Tech Workshop 2024',
      description: 'Learn about AI and Machine Learning through hands-on projects and expert sessions.',
      date: '2024-03-15',
      time: '14:00',
      location: 'Main Auditorium',
      clubId: '1',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
      registeredUsers: ['4', '6'],
      status: 'approved'
    },
    {
      id: '2',
      title: 'Spring Music Festival',
      description: 'Annual music festival featuring student performances, live bands, and artistic exhibitions.',
      date: '2024-04-01',
      time: '18:00',
      location: 'Campus Amphitheater',
      clubId: '2',
      image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=1200',
      registeredUsers: ['5'],
      status: 'approved'
    },
    {
      id: '3',
      title: 'Robotics Competition',
      description: 'Inter-college robotics competition showcasing autonomous robots and innovative designs.',
      date: '2024-03-30',
      time: '09:00',
      location: 'Engineering Block',
      clubId: '3',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200',
      registeredUsers: ['4', '6'],
      status: 'proposed',
      proposedBy: '4'
    }
  ],
  clubMemberships: [
    {
      userId: '4', // Mike Student
      clubId: '1', // Tech Innovation Club
      joinedAt: '2024-01-15T00:00:00Z',
      role: 'Tech Lead'
    },
    {
      userId: '5', // Alice Johnson
      clubId: '2', // Arts & Music Society
      joinedAt: '2024-01-20T00:00:00Z',
      role: 'Performance Director'
    },
    {
      userId: '6', // David Chen
      clubId: '1', // Tech Innovation Club
      joinedAt: '2024-02-01T00:00:00Z',
      role: 'member'
    },
    {
      userId: '6', // David Chen
      clubId: '3', // Robotics Club
      joinedAt: '2024-02-15T00:00:00Z',
      role: 'member'
    }
  ],
  customRoles: [
    {
      id: '1',
      clubId: '1',
      name: 'Tech Lead',
      description: 'Leads technical projects and mentors team members',
      createdAt: '2024-02-01T00:00:00Z'
    },
    {
      id: '2',
      clubId: '2',
      name: 'Performance Director',
      description: 'Coordinates and directs club performances',
      createdAt: '2024-02-01T00:00:00Z'
    },
    {
      id: '3',
      clubId: '3',
      name: 'Project Manager',
      description: 'Manages robotics projects and team coordination',
      createdAt: '2024-02-15T00:00:00Z'
    }
  ],
  joinRequests: [
    {
      id: '1',
      userId: '5', // Alice Johnson
      clubId: '1', // Tech Innovation Club
      status: 'pending',
      requestedAt: '2024-03-01T00:00:00Z',
      message: 'I would love to learn more about technology and contribute to the club\'s activities.'
    },
    {
      id: '2',
      userId: '4', // Mike Student
      clubId: '3', // Robotics Club
      status: 'pending',
      requestedAt: '2024-03-02T00:00:00Z',
      message: 'Interested in joining the robotics team and participating in competitions.'
    }
  ]
};