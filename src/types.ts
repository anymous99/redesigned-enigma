export type Role = 'admin' | 'coordinator' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  regNo?: string;
  avatar?: string;
  department?: string;
  phone?: string;
}

export interface Club {
  id: string;
  name: string;
  description: string;
  coordinatorId: string;
  image: string;
  category: string;
  createdAt: string;
  createdBy: string;
}

export interface ClubMembership {
  userId: string;
  clubId: string;
  joinedAt: string;
  role: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  clubId: string;
  image: string;
  registeredUsers: string[];
  status: 'proposed' | 'approved' | 'rejected';
  proposedBy?: string;
  approvedAt?: string;
  rejectedAt?: string;
}

export interface CustomRole {
  id: string;
  clubId: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface JoinRequest {
  id: string;
  userId: string;
  clubId: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  message?: string;
  responseMessage?: string;
  respondedAt?: string;
  assignedRole?: string;
}