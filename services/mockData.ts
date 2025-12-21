
import { Lead, LeadStatus, Project, ProjectStatus, Invoice, UserRole, User, MarketingCampaign, LeadSource } from '../types';

const getDate = (diffDays: number) => {
  const date = new Date();
  date.setDate(date.getDate() + diffDays);
  return date.toISOString().split('T')[0];
};

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Vishal (Founder)', email: 'vishal@vswdata.in', role: UserRole.FOUNDER, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vishal', phoneNumber: '9876543210' },
  { id: '2', name: 'Sneha (BDA)', email: 'sneha@vswdata.in', role: UserRole.BDA, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha', commissionRate: 8, phoneNumber: '9876543212' },
];

export const MOCK_LEADS: Lead[] = [
  { id: 'l1', name: 'Satish', company: 'CNC-Satish', email: 'satish@cnc.com', phone: '9123456780', value: 16000, status: LeadStatus.CONTACTED, lastContact: getDate(-1), nextFollowUp: '2024-11-24', assignedTo: 'Sneha', score: 30, tags: ['Still not ready'], source: LeadSource.REFERRAL, priority: 'Cold' },
  { id: 'l2', name: 'Shiva', company: 'CCTV Shiva - Bharath Digital', email: 'shiva@cctv.com', phone: '9123456781', value: 158000, status: LeadStatus.PROPOSAL_SENT, lastContact: getDate(-1), nextFollowUp: getDate(2), assignedTo: 'Sneha', score: 85, tags: ['WAITING FOR ADVANCE'], source: LeadSource.DIRECT, priority: 'Hot' },
];

export const MOCK_PROJECTS: Project[] = [
  { 
    id: 'p1', 
    title: 'School Management', 
    client: 'Iqbal patel school', 
    status: ProjectStatus.PRODUCTION, 
    notes: 'meeting fix 24 nov',
    dueDate: getDate(20), 
    progress: 15, 
    financials: { basePrice: 15000, total: 18000, advance: 3000, stage1: 0, stage2: 0, stage3: 0, totalPaid: 3000, balance: -15000 },
    techMilestones: { demo: true, frontend: false, backend: false, deployment: false, domain: false, api: false },
    tasks: [] 
  },
  { 
    id: 'p2', 
    title: 'Food Pre-booking', 
    client: 'Food Pre-booking', 
    status: ProjectStatus.PRODUCTION, 
    notes: '2 vendor and user end is ready',
    dueDate: getDate(30), 
    progress: 40, 
    financials: { basePrice: 122000, total: 122000, advance: 24600, stage1: 25000, stage2: 0, stage3: 0, totalPaid: 49600, balance: -72400 },
    techMilestones: { demo: true, frontend: true, backend: true, deployment: false, domain: false, api: false },
    tasks: [] 
  },
  { 
    id: 'p3', 
    title: 'Hotel,bar Billing App', 
    client: 'Hotel,bar Billing App', 
    status: ProjectStatus.REQUIREMENTS, 
    notes: 'demogetting ready',
    dueDate: getDate(45), 
    progress: 5, 
    financials: { basePrice: 160000, total: 160000, advance: 0, stage1: 0, stage2: 0, stage3: 0, totalPaid: 0, balance: -160000 },
    techMilestones: { demo: false, frontend: false, backend: false, deployment: false, domain: false, api: false },
    tasks: [] 
  },
  { 
    id: 'p4', 
    title: 'BMS Platform', 
    client: 'BMS', 
    status: ProjectStatus.DELIVERY, 
    notes: 'project is ready but make not paid',
    dueDate: getDate(-5), 
    progress: 95, 
    financials: { basePrice: 22000, total: 22000, advance: 0, stage1: 0, stage2: 0, stage3: 0, totalPaid: 0, balance: -22000 },
    techMilestones: { demo: true, frontend: true, backend: true, deployment: true, domain: true, api: true },
    tasks: [] 
  },
  { 
    id: 'p5', 
    title: 'EduLink Integration', 
    client: 'AMKA EduLlink', 
    status: ProjectStatus.REQUIREMENTS, 
    notes: 'meeting 15 december',
    dueDate: getDate(60), 
    progress: 0, 
    financials: { basePrice: 45000, total: 45000, advance: 0, stage1: 0, stage2: 0, stage3: 0, totalPaid: 0, balance: -45000 },
    techMilestones: { demo: false, frontend: false, backend: false, deployment: false, domain: false, api: false },
    tasks: [] 
  }
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-2024-001', client: 'Iqbal patel school', amount: 3000, date: getDate(-10), status: 'Paid' },
  { id: 'INV-2024-002', client: 'Food Pre-booking', amount: 49600, date: getDate(-5), status: 'Paid' },
];

export const MOCK_CAMPAIGNS: MarketingCampaign[] = [
  { id: 'c1', name: 'Instagram Reach - Tech', platform: 'Instagram', status: 'Active', budget: 25000, leadsGenerated: 45 },
];

export const DASHBOARD_STATS = [
  { title: 'Pipeline Value', value: '₹6,48,000', change: '+₹1.2L', positive: true },
  { title: 'Pending Advance', value: '₹2,58,000', change: 'Critical', positive: false },
  { title: 'Active Dev', value: '4 Projects', change: 'Steady', positive: true },
  { title: 'Invoices Paid', value: '₹1,31,000', change: '+22%', positive: true },
];
