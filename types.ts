
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
  details: any; // Dynamic based on service
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
  phone: string;
  value: number;
  status: LeadStatus;
  source: LeadSource;
  priority: 'Hot' | 'Warm' | 'Cold';
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
  PRODUCTION = 'Production',
  DELIVERY = 'Delivery',
  COMPLETED = 'Completed',
  RETAINER = 'Retainer/Support'
}

export interface Project {
  id: string;
  title: string;
  client: string;
  status: ProjectStatus;
  dueDate: string;
  progress: number;
  budget: number;
  tasks: { id: string; title: string; assignee: string; priority: string }[];
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
