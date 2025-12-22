
import { Lead, LeadStatus, LeadPriority, Project, ProjectStatus, TaskStatus, Invoice, UserRole, User, MarketingCampaign, LeadSource, QuoteStatus } from '../types';

const getDate = (diffDays: number) => {
  const date = new Date();
  date.setDate(date.getDate() + diffDays);
  return date.toISOString().split('T')[0];
};

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Vishal (Founder)', email: 'vishal@vswdata.in', role: UserRole.FOUNDER, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vishal', phoneNumber: '9876543210' },
  { id: '2', name: 'Sneha (BDA)', email: 'sneha@vswdata.in', role: UserRole.BDA, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha', commissionRate: 8, phoneNumber: '9876543212' },
  { id: '3', name: 'Rahul (Dev)', email: 'rahul@vswdata.in', role: UserRole.DEVELOPER, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul', phoneNumber: '9876543215' },
  { id: '4', name: 'Priya (Designer)', email: 'priya@vswdata.in', role: UserRole.DESIGNER, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', phoneNumber: '9876543216' },
  { id: '5', name: 'Karan (Finance)', email: 'karan@vswdata.in', role: UserRole.FINANCE, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karan', phoneNumber: '9876543217' },
];

export const MOCK_LEADS: Lead[] = [
  // Adding assignedTo to satisfy Lead interface requirement
  { id: 'l1', name: 'Iqbal', company: 'Iqbal patel school', email: 'contact@iqbalpatel.edu', phone: '9800011122', value: 18000, status: LeadStatus.CLOSED_WON, lastContact: '2025-12-01', source: LeadSource.DIRECT, priority: LeadPriority.HOT, assignedTo: 'Vishal (Founder)' },
  { id: 'l2', name: 'Vendor End', company: 'Food Pre-booking', email: 'admin@foodprebook.com', phone: '9800011123', value: 122000, status: LeadStatus.CLOSED_WON, lastContact: '2025-12-25', source: LeadSource.ADS, priority: LeadPriority.HOT, assignedTo: 'Sneha (BDA)' },
  { id: 'l3', name: 'Shiva', company: 'CCTV Shiva - Bharath Digital', email: 'shiva@bharath.com', phone: '9800011124', value: 158000, status: LeadStatus.CLOSED_WON, lastContact: '2026-01-10', source: LeadSource.REFERRAL, priority: LeadPriority.HOT, assignedTo: 'Sneha (BDA)' },
  { id: 'l4', name: 'Luminos', company: 'Luminos precision technology', email: 'info@luminos.com', phone: '9800011125', value: 16000, status: LeadStatus.PROPOSAL_SENT, lastContact: '2025-12-21', source: LeadSource.WHATSAPP, priority: LeadPriority.WARM, assignedTo: 'Sneha (BDA)' },
  { id: 'l5', name: 'Billing App', company: 'Hotel,bar Billing App', email: 'admin@hotelbar.com', phone: '9800011126', value: 160000, status: LeadStatus.MEETING_SCHEDULED, lastContact: '2025-12-22', source: LeadSource.DIRECT, priority: LeadPriority.HOT, assignedTo: 'Sneha (BDA)' },
  { id: 'l6', name: 'Shiva Sai', company: 'Medical Billing App (shiva sai )', email: 'shivsai@med.com', phone: '9800011127', value: 40000, status: LeadStatus.CONTACTED, lastContact: '2025-12-22', source: LeadSource.REFERRAL, priority: LeadPriority.WARM, assignedTo: 'Unassigned' },
];

export const MOCK_PROJECTS: Project[] = [
  { 
    id: 'p1', 
    title: 'School CRM', 
    client: 'Iqbal patel school', 
    status: ProjectStatus.PRODUCTION, 
    dueDate: '2025-12-23', 
    financials: { basePrice: 18000, total: 18000, advance: 3000, stage1: 0, stage2: 0, stage3: 0, totalPaid: 3000, balance: -15000 },
    techMilestones: { demo: true, frontend: true, backend: false, deployment: false, domain: false, api: false },
    tasks: [{ id: 't1', title: 'Database Configuration', assignee: 'Rahul (Dev)', priority: 'High', status: TaskStatus.DONE }] 
  },
  { 
    id: 'p2', 
    title: 'Food Booking System', 
    client: 'Food Pre-booking', 
    status: ProjectStatus.PRODUCTION, 
    dueDate: '2025-12-25', 
    financials: { basePrice: 122000, total: 122000, advance: 24600, stage1: 25000, stage2: 0, stage3: 0, totalPaid: 49600, balance: -72400 },
    techMilestones: { demo: true, frontend: false, backend: false, deployment: false, domain: false, api: false },
    tasks: [{ id: 't2', title: 'Frontend Layout', assignee: 'Priya (Designer)', priority: 'Medium', status: TaskStatus.IN_PROGRESS }] 
  },
  { 
    id: 'p3', 
    title: 'CCTV Monitoring App', 
    client: 'CCTV Shiva - Bharath Digital', 
    status: ProjectStatus.REQUIREMENTS, 
    dueDate: '2026-01-10', 
    financials: { basePrice: 158000, total: 158000, advance: 0, stage1: 0, stage2: 0, stage3: 0, totalPaid: 0, balance: -158000 },
    techMilestones: { demo: true, frontend: false, backend: false, deployment: false, domain: false, api: false },
    tasks: [{ id: 't3', title: 'Requirement Specification', assignee: 'Sneha (BDA)', priority: 'High', status: TaskStatus.DONE }] 
  },
  { 
    id: 'p4', 
    title: 'Precision Tech Portal', 
    client: 'Luminos precision technology', 
    status: ProjectStatus.REQUIREMENTS, 
    dueDate: '2025-12-21', 
    financials: { basePrice: 16000, total: 16000, advance: 0, stage1: 0, stage2: 0, stage3: 0, totalPaid: 0, balance: -16000 },
    techMilestones: { demo: false, frontend: false, backend: false, deployment: false, domain: false, api: false },
    tasks: [] 
  },
  { 
    id: 'p5', 
    title: 'Hospitality Billing', 
    client: 'Hotel,bar Billing App', 
    status: ProjectStatus.REQUIREMENTS, 
    dueDate: '2025-12-22', 
    financials: { basePrice: 160000, total: 160000, advance: 0, stage1: 0, stage2: 0, stage3: 0, totalPaid: 0, balance: -160000 },
    techMilestones: { demo: false, frontend: false, backend: false, deployment: false, domain: false, api: false },
    tasks: [] 
  },
  { 
    id: 'p6', 
    title: 'Medical Billing App', 
    client: 'Medical Billing App (shiva sai )', 
    status: ProjectStatus.REQUIREMENTS, 
    dueDate: '2025-12-22', 
    financials: { basePrice: 40000, total: 40000, advance: 0, stage1: 0, stage2: 0, stage3: 0, totalPaid: 0, balance: -40000 },
    techMilestones: { demo: false, frontend: false, backend: false, deployment: false, domain: false, api: false },
    tasks: [] 
  },
  { 
    id: 'p7', 
    title: 'BDR Portal', 
    client: 'Akash BDR', 
    status: ProjectStatus.REQUIREMENTS, 
    dueDate: '2025-12-23', 
    financials: { basePrice: 45000, total: 45000, advance: 0, stage1: 0, stage2: 0, stage3: 0, totalPaid: 0, balance: -45000 },
    techMilestones: { demo: false, frontend: false, backend: false, deployment: false, domain: false, api: false },
    tasks: [] 
  },
  { 
    id: 'p8', 
    title: 'Pharmacy College System', 
    client: 'Akash Pharmacy college', 
    status: ProjectStatus.REQUIREMENTS, 
    dueDate: '2025-12-23', 
    financials: { basePrice: 45000, total: 45000, advance: 0, stage1: 0, stage2: 0, stage3: 0, totalPaid: 0, balance: -45000 },
    techMilestones: { demo: false, frontend: false, backend: false, deployment: false, domain: false, api: false },
    tasks: [] 
  },
  { 
    id: 'p9', 
    title: 'Dhaba Management', 
    client: 'SHURAYWADA DHABA', 
    status: ProjectStatus.REQUIREMENTS, 
    dueDate: '2025-12-23', 
    financials: { basePrice: 45000, total: 45000, advance: 0, stage1: 0, stage2: 0, stage3: 0, totalPaid: 0, balance: -45000 },
    techMilestones: { demo: false, frontend: false, backend: false, deployment: false, domain: false, api: false },
    tasks: [] 
  },
  { 
    id: 'p10', 
    title: 'EduLink Platform', 
    client: 'AMKA EduLlink', 
    status: ProjectStatus.REQUIREMENTS, 
    dueDate: '2025-12-22', 
    financials: { basePrice: 45000, total: 45000, advance: 0, stage1: 0, stage2: 0, stage3: 0, totalPaid: 0, balance: -45000 },
    techMilestones: { demo: false, frontend: false, backend: false, deployment: false, domain: false, api: false },
    tasks: [] 
  },
  { 
    id: 'p11', 
    title: 'Stock Analytics', 
    client: 'UMESH - FIN STOCKS', 
    status: ProjectStatus.REQUIREMENTS, 
    dueDate: '2025-12-22', 
    financials: { basePrice: 45000, total: 45000, advance: 0, stage1: 0, stage2: 0, stage3: 0, totalPaid: 0, balance: -45000 },
    techMilestones: { demo: false, frontend: false, backend: false, deployment: false, domain: false, api: false },
    tasks: [] 
  },
  { 
    id: 'p12', 
    title: 'Jewellers Website', 
    client: 'jwellers website Samrth', 
    status: ProjectStatus.REQUIREMENTS, 
    dueDate: '2025-12-14', 
    financials: { basePrice: 16000, total: 16000, advance: 0, stage1: 0, stage2: 0, stage3: 0, totalPaid: 0, balance: -16000 },
    techMilestones: { demo: false, frontend: false, backend: false, deployment: false, domain: false, api: false },
    tasks: [] 
  },
  { 
    id: 'p13', 
    title: 'Finstock Web App', 
    client: 'NK finstock Website', 
    status: ProjectStatus.REQUIREMENTS, 
    dueDate: '2025-12-22', 
    financials: { basePrice: 45000, total: 45000, advance: 0, stage1: 0, stage2: 0, stage3: 0, totalPaid: 0, balance: -45000 },
    techMilestones: { demo: false, frontend: false, backend: false, deployment: false, domain: false, api: false },
    tasks: [] 
  },
  { 
    id: 'p14', 
    title: 'Home Services App', 
    client: 'Shoba - Home servies', 
    status: ProjectStatus.REQUIREMENTS, 
    dueDate: '2025-12-20', 
    financials: { basePrice: 90000, total: 90000, advance: 0, stage1: 0, stage2: 0, stage3: 0, totalPaid: 0, balance: -90000 },
    techMilestones: { demo: false, frontend: false, backend: false, deployment: false, domain: false, api: false },
    tasks: [] 
  },
  { 
    id: 'p15', 
    title: 'E-commerce Engine', 
    client: 'Youtech solutions - e-commerce application', 
    status: ProjectStatus.REQUIREMENTS, 
    dueDate: '2025-12-23', 
    financials: { basePrice: 150000, total: 150000, advance: 0, stage1: 0, stage2: 0, stage3: 0, totalPaid: 0, balance: -150000 },
    techMilestones: { demo: false, frontend: false, backend: false, deployment: false, domain: false, api: false },
    tasks: [] 
  },
  { 
    id: 'p16', 
    title: 'Dhaba Digital Portal', 
    client: 'Thakur dhaba', 
    status: ProjectStatus.REQUIREMENTS, 
    dueDate: '2025-12-22', 
    financials: { basePrice: 180000, total: 180000, advance: 0, stage1: 0, stage2: 0, stage3: 0, totalPaid: 0, balance: -180000 },
    techMilestones: { demo: false, frontend: false, backend: false, deployment: false, domain: false, api: false },
    tasks: [] 
  },
  { 
    id: 'p17', 
    title: 'Bricks ERP', 
    client: 'venkatesh VSk Briks', 
    status: ProjectStatus.REQUIREMENTS, 
    dueDate: '2025-12-23', 
    financials: { basePrice: 6000, total: 6000, advance: 0, stage1: 0, stage2: 0, stage3: 0, totalPaid: 0, balance: -6000 },
    techMilestones: { demo: false, frontend: false, backend: false, deployment: false, domain: false, api: false },
    tasks: [] 
  }
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-2025-001', client: 'Iqbal patel school', amount: 3000, date: '2025-12-01', status: 'Paid' },
  { id: 'INV-2025-002', client: 'Food Pre-booking', amount: 49600, date: '2025-12-20', status: 'Paid' },
];

export const MOCK_CAMPAIGNS: MarketingCampaign[] = [
  { id: 'c1', name: 'Strategic Search - VSW', platform: 'Google Search', status: 'Active', budget: 50000, leadsGenerated: 120 },
];

export const DASHBOARD_STATS = [
  { title: 'Pipeline Value', value: '₹12,26,000', change: 'Total Cycle', positive: true },
  { title: 'Collections', value: '₹52,600', change: 'Paid Invoices', positive: true },
  { title: 'AR Balance', value: '₹11,73,400', change: 'Pending Rec.', positive: false },
  { title: 'Node Count', value: '17 Projects', change: 'Active Cycle', positive: true },
];
