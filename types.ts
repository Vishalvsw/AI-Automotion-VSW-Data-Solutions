
export enum UserRole {
  FOUNDER = 'FOUNDER',
  BDA = 'BDA'
}

export interface UserPreferences {
  emailNotifications: boolean;
  appNotifications: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  commissionRate?: number;
  phoneNumber?: string;
  preferences?: UserPreferences;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'overdue' | 'approaching' | 'system';
  date: string;
  read: boolean;
  leadId?: string;
}

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  MEETING_SCHEDULED = 'Meeting Scheduled',
  PROPOSAL_SENT = 'Proposal Sent',
  CLOSED_WON = 'Closed Won',
  CLOSED_LOST = 'Closed Lost'
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
  DIRECT = 'Direct',
  VISIT = 'Visit',
  OUTBOUND = 'Outbound',
  INBOUND = 'Inbound'
}

export enum ActivityType {
  COLD_CALL = 'Cold Call',
  COLD_MESSAGE = 'WhatsApp Message',
  EMAIL = 'Email',
  MEETING = 'Client Meeting',
  QUOTATION = 'Quotation Sent',
  REQUIREMENTS = 'Requirement Gathering'
}

export interface Requirement {
  serviceType: ServiceType;
  details: any; 
  painPoints: string[];
  proposedSolutions: string[];
}

export interface Meeting {
  id: string;
  date: string;
  time: string;
  type: 'Discovery' | 'Demo' | 'Negotiation';
  notes: string;
  outcome: string;
}

export interface QuotationModule {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface QuotationPlan {
  name: string;
  price: number;
  timeline: string;
  idealFor: string;
  featureLevels: Record<string, string>;
}

export interface Quotation {
  id: string;
  leadId: string;
  projectOverview: string;
  objective: string;
  coreModules: QuotationModule[];
  plans: QuotationPlan[];
  benefits: string[];
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  value: number;
  status: LeadStatus;
  source: LeadSource;
  priority: LeadPriority;
  lastContact: string;
  nextFollowUp?: string;
  assignedTo: string;
  requirements?: Requirement;
  meetings?: Meeting[];
  activities?: { type: ActivityType; date: string; note: string }[];
  score?: number;
  tags?: string[];
  selectedModuleIds?: string[];
}

export enum ProjectStatus {
  REQUIREMENTS = 'Requirements',
  PRODUCTION = 'In Progress',
  DELIVERY = 'Ready',
  COMPLETED = 'Completed',
  RETAINER = 'Retainer/Support',
  DROPPED = 'Dropped'
}

export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  BLOCKED = 'Blocked',
  DONE = 'Done'
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

export interface TechMilestones {
  demo: boolean;
  frontend: boolean;
  backend: boolean;
  deployment: boolean;
  domain: boolean;
  api: boolean;
}

export interface Project {
  id: string;
  title: string;
  client: string;
  status: ProjectStatus;
  notes: string;
  dueDate: string;
  progress: number;
  financials: ProjectFinancials;
  techMilestones: TechMilestones;
  tasks: { id: string; title: string; assignee: string; priority: string; status: TaskStatus }[];
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
