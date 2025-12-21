
import { Lead, LeadStatus, Project, ProjectStatus, Invoice, UserRole, User, MarketingCampaign, LeadSource } from '../types';

// Helper to get dates relative to today
const getDate = (diffDays: number) => {
  const date = new Date();
  date.setDate(date.getDate() + diffDays);
  return date.toISOString().split('T')[0];
};

export const MOCK_USERS: User[] = [
  { 
    id: '1', 
    name: 'Vishal (Founder)', 
    email: 'vishal@vswdata.in', 
    role: UserRole.FOUNDER, 
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vishal', 
    phoneNumber: '9876543210' 
  },
  { 
    id: '2', 
    name: 'Sneha (BDA)', 
    email: 'sneha@vswdata.in', 
    role: UserRole.BDA, 
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha', 
    commissionRate: 8, 
    phoneNumber: '9876543212' 
  },
];

export const MOCK_LEADS: Lead[] = [
  // Fixed: Added missing 'phone' and 'priority' properties to satisfy the Lead interface
  { id: 'l1', name: 'Satish', company: 'CNC-Satish', email: 'satish@cnc.com', phone: '9123456780', value: 16000, status: LeadStatus.CONTACTED, lastContact: getDate(-1), nextFollowUp: '2024-11-24', assignedTo: 'Sneha', score: 30, tags: ['Still not ready'], source: LeadSource.REFERRAL, priority: 'Cold' },
  { id: 'l2', name: 'Shiva', company: 'CCTV Shiva - Bharath Digital', email: 'shiva@cctv.com', phone: '9123456781', value: 158000, status: LeadStatus.PROPOSAL_SENT, lastContact: getDate(-1), nextFollowUp: getDate(2), assignedTo: 'Sneha', score: 85, tags: ['WAITING FOR ADVANCE'], source: LeadSource.DIRECT, priority: 'Hot' },
  { id: 'l3', name: 'Owner', company: 'Thakur Dhaba', email: 'thakur@dhaba.com', phone: '9123456782', value: 35000, status: LeadStatus.NEW, lastContact: getDate(0), nextFollowUp: getDate(1), assignedTo: 'Sneha', score: 15, tags: ['Day 1 Filter'], source: LeadSource.VISIT, priority: 'Cold' },
  { id: 'l4', name: 'Manager', company: 'NK Fintech', email: 'manager@nk.com', phone: '9123456783', value: 60000, status: LeadStatus.MEETING_SCHEDULED, lastContact: getDate(-1), nextFollowUp: getDate(3), assignedTo: 'Sneha', score: 55, tags: ['Discovery Paid'], source: LeadSource.OUTBOUND, priority: 'Warm' },
  { id: 'l5', name: 'Client', company: 'Shoba Home Services', email: 'shoba@services.com', phone: '9123456784', value: 40000, status: LeadStatus.PROPOSAL_SENT, lastContact: getDate(-2), nextFollowUp: getDate(1), assignedTo: 'Sneha', score: 70, tags: ['Day 3 Proposal'], source: LeadSource.REFERRAL, priority: 'Warm' },
  { id: 'l6', name: 'Tech Lead', company: 'Yutech - ecommerce', email: 'info@yutech.com', phone: '9123456785', value: 250000, status: LeadStatus.CLOSED_WON, lastContact: getDate(-5), nextFollowUp: getDate(0), assignedTo: 'Sneha', score: 100, tags: ['Advance Paid'], source: LeadSource.INBOUND, priority: 'Hot' },
  { id: 'l24', name: 'Iqbal', company: 'Iqbal patel school', email: 'iqbal@school.edu', phone: '9123456786', value: 15000, status: LeadStatus.CLOSED_WON, lastContact: getDate(-10), nextFollowUp: getDate(0), assignedTo: 'Sneha', score: 100, tags: ['Paid'], source: LeadSource.DIRECT, priority: 'Hot' },
];

export const MOCK_PROJECTS: Project[] = [
  { 
    id: 'ip1', 
    title: 'Hotel, Bar & Billing App', 
    client: 'Billing application', 
    status: ProjectStatus.REQUIREMENTS, 
    dueDate: getDate(20), 
    progress: 10, 
    budget: 160000, 
    tasks: [{id: 't1', title: 'Wait for Advance', assignee: 'Account', priority: 'High'}] 
  },
  { 
    id: 'ip3', 
    title: 'Shuryadhba ERP', 
    client: 'Shuryadhba', 
    status: ProjectStatus.PRODUCTION, 
    dueDate: getDate(15), 
    progress: 30, 
    budget: 40000, 
    tasks: [{id: 't3', title: 'Backend API', assignee: 'Dev', priority: 'Medium'}] 
  },
  { 
    id: 'ip5', 
    title: 'Edu Pink Portal', 
    client: 'Edu pink', 
    status: ProjectStatus.PRODUCTION, 
    dueDate: getDate(10), 
    progress: 60, 
    budget: 45000, 
    tasks: [{id: 't5', title: 'Frontend Components', assignee: 'Dev', priority: 'Medium'}] 
  },
  { 
    id: 'ip6', 
    title: 'Yutech - Ecommerce', 
    client: 'Yutech - ecommerce', 
    status: ProjectStatus.PRODUCTION, 
    dueDate: getDate(40), 
    progress: 20, 
    budget: 250000, 
    tasks: [{id: 't6', title: 'Product Catalog', assignee: 'Dev', priority: 'Medium'}] 
  },
  { 
    id: 'p_done1', 
    title: 'School Management', 
    client: 'Iqbal patel school', 
    status: ProjectStatus.COMPLETED, 
    dueDate: getDate(-2), 
    progress: 100, 
    budget: 15000, 
    tasks: [] 
  }
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-2024-001', client: 'Iqbal patel school', amount: 15000, date: getDate(-10), status: 'Paid' },
  { id: 'INV-2024-002', client: 'Shuryadhba', amount: 16000, date: getDate(-5), status: 'Paid' },
  { id: 'INV-2024-003', client: 'Yutech - ecommerce', amount: 100000, date: getDate(-2), status: 'Paid' },
  { id: 'INV-2024-004', client: 'Billing application', amount: 64000, date: getDate(-1), status: 'Pending' },
];

export const MOCK_CAMPAIGNS: MarketingCampaign[] = [
  { id: 'c1', name: 'Instagram Reach - Tech', platform: 'Instagram', status: 'Active', budget: 25000, leadsGenerated: 45 },
  { id: 'c2', name: 'LinkedIn B2B Lead Gen', platform: 'LinkedIn', status: 'Active', budget: 50000, leadsGenerated: 12 },
];

export const DASHBOARD_STATS = [
  { title: 'Pipeline Value', value: '₹6,48,000', change: '+₹1.2L', positive: true },
  { title: 'Pending Advance', value: '₹2,58,000', change: 'Critical', positive: false },
  { title: 'Active Dev', value: '4 Projects', change: 'Steady', positive: true },
  { title: 'Invoices Paid', value: '₹1,31,000', change: '+22%', positive: true },
];