
export enum UserRole {
  FOUNDER = 'FOUNDER',
  BDA = 'BDA'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  commissionRate?: number; // e.g., 8 for 8%
  phoneNumber?: string;
}

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  MEETING_SCHEDULED = 'Meeting Scheduled',
  PROPOSAL_SENT = 'Proposal Sent',
  CLOSED_WON = 'Closed Won',
  CLOSED_LOST = 'Closed Lost'
}

export enum ActivityType {
  COLD_CALL = 'Cold Call',
  COLD_MESSAGE = 'Cold Message',
  EMAIL = 'Email',
  VISIT = 'Business Visit',
  QUOTATION = 'Quotation Sent',
  REQUIREMENTS = 'Requirements Gathering'
}

export interface QuotationModule {
  id: string;
  name: string;
  description: string;
  price: number; // Fixed at 20000
}

export interface Quotation {
  id: string;
  leadId: string;
  modules: QuotationModule[];
  totalAmount: number;
  tax: number;
  grandTotal: number;
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  value: number;
  status: LeadStatus;
  lastContact: string;
  nextFollowUp?: string;
  assignedTo: string;
  activities?: { type: ActivityType; date: string; note: string }[];
  score?: number;
  tags?: string[];
  source?: string;
}

export enum ProjectStatus {
  REQUIREMENTS = 'Requirements',
  PRODUCTION = 'Production',
  DELIVERY = 'Delivery',
  COMPLETED = 'Completed',
  RETAINER = 'Retainer/Support'
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

export interface MarketingCampaign {
  id: string;
  name: string;
  platform: 'Facebook' | 'LinkedIn' | 'Email' | 'Instagram';
  status: 'Active' | 'Paused' | 'Draft';
  budget: number;
  leadsGenerated: number;
}
