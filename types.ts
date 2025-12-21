
// @google/genai types are imported where needed in components.
// Internal application types.

export enum UserRole {
  FOUNDER = 'FOUNDER',
  FINANCE = 'FINANCE',
  BDA = 'BDA',
  DEVELOPER = 'DEVELOPER',
  DESIGNER = 'DESIGNER'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  commissionRate?: number;
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

export enum QuoteStatus {
  DRAFT = 'Draft',
  SENT = 'Sent',
  APPROVED = 'Approved'
}

export enum LeadPriority {
  HOT = 'Hot',
  WARM = 'Warm',
  COLD = 'Cold'
}

export enum ServiceType {
  SOFTWARE = 'Software Development',
  RECRUITMENT = 'Recruitment / HR',
  MARKETING = 'Digital Marketing',
  CONSULTING = 'Business Consulting'
}

export enum LeadSource {
  WEBSITE = 'Website',
  WHATSAPP = 'WhatsApp',
  COLD_CALL = 'Cold Call',
  REFERRAL = 'Referral',
  ADS = 'Ads',
  DIRECT = 'Direct'
}

export enum ActivityType {
  COLD_CALL = 'Phone Call',
  EMAIL = 'Official Email',
  MEETING = 'Client Meeting',
  WHATSAPP = 'WhatsApp Message',
  QUOTATION = 'Quotation Delivery',
  REQUIREMENTS = 'Discovery Session'
}

export interface Activity {
  type: ActivityType;
  date: string;
  note: string;
  nextFollowUp?: string;
}

export interface Requirement {
  serviceType: ServiceType;
  details: any; 
  painPoints: string[];
  proposedSolutions?: string[];
}

export interface QuotationModule {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  value: number;
  status: LeadStatus;
  quoteStatus?: QuoteStatus;
  source: LeadSource;
  priority: LeadPriority;
  lastContact: string;
  nextFollowUp?: string;
  assignedTo: string;
  requirements?: Requirement;
  activities?: Activity[];
  selectedModuleIds?: string[];
  score?: number;
  tags?: string[];
}

export enum ProjectStatus {
  REQUIREMENTS = 'Requirements',
  PRODUCTION = 'In Progress',
  DELIVERY = 'Ready',
  COMPLETED = 'Completed',
  RETAINER = 'Retainer',
  DROPPED = 'Dropped'
}

export enum TaskStatus {
  TODO = 'Todo',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
  BLOCKED = 'Blocked'
}

export interface Task {
  id: string;
  title: string;
  assignee: string;
  priority: string;
  status: TaskStatus;
  dueDate?: string;
  projectTitle?: string;
  client?: string;
}

export interface TechMilestones {
  demo: boolean;
  frontend: boolean;
  backend: boolean;
  deployment: boolean;
  domain: boolean;
  api: boolean;
}

export interface ProjectFinancials {
  basePrice: number;
  total: number;
  advance: number;
  stage1: number;
  stage2: number;
  stage3: number;
  totalPaid: number;
  balance: number;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  status: ProjectStatus;
  quoteStatus?: QuoteStatus;
  dueDate: string;
  financials: ProjectFinancials;
  techMilestones: TechMilestones;
  tasks: Task[];
  notes?: string;
  progress?: number;
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
  platform: string;
  status: string;
  budget: number;
  leadsGenerated: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'overdue' | 'approaching' | 'info';
}
