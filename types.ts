export enum UserRole {
  ADMIN = 'ADMIN',
  PROJECT_MANAGER = 'PROJECT_MANAGER',
  BDA = 'BDA',
  DEVELOPER = 'DEVELOPER',
  CLIENT = 'CLIENT'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  MEETING_SCHEDULED = 'Meeting Scheduled',
  PROPOSAL_SENT = 'Proposal Sent',
  CLOSED_WON = 'Closed Won',
  CLOSED_LOST = 'Closed Lost'
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  value: number;
  status: LeadStatus;
  lastContact: string;
  assignedTo: string;
}

export enum ProjectStatus {
  PLANNING = 'Planning',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  COMPLETED = 'Completed'
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface Project {
  id: string;
  title: string;
  client: string;
  status: ProjectStatus;
  dueDate: string;
  progress: number;
  budget: number;
  tasks: Task[];
}

export interface Invoice {
  id: string;
  client: string;
  amount: number;
  date: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}