
import { Lead, LeadStatus, Project, ProjectStatus, Invoice, UserRole, User, MarketingCampaign, Meeting, JobApplication, ApplicationStatus } from '../types';

// Helper to get dates relative to today
const getDate = (diffDays: number) => {
  const date = new Date();
  date.setDate(date.getDate() + diffDays);
  return date.toISOString().split('T')[0];
};

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Vishal (Founder)', email: 'vishal@vswdata.in', role: UserRole.ADMIN, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vishal', phoneNumber: '9876543210' },
  { id: '2', name: 'Rahul (PM)', email: 'rahul@vswdata.in', role: UserRole.PROJECT_MANAGER, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul', phoneNumber: '9876543211' },
  { id: '3', name: 'Sneha (BDA)', email: 'sneha@vswdata.in', role: UserRole.BDA, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha', commissionRate: 8, phoneNumber: '9876543212' },
  { id: '4', name: 'Rohan (Client)', email: 'contact@cityhospital.in', role: UserRole.CLIENT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan', phoneNumber: '9876543213' },
  { id: '5', name: 'Priya (HR Manager)', email: 'hr@vswdata.in', role: UserRole.HR_MANAGER, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', phoneNumber: '9876543214' },
  { id: '6', name: 'Amit (Dev)', email: 'dev@vswdata.in', role: UserRole.DEVELOPER, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit', phoneNumber: '9876543215' },
];

export const MOCK_LEADS: Lead[] = [
  { id: 'l1', name: 'Satish', company: 'CNC-Satish', email: 'satish@cnc.com', value: 16000, status: LeadStatus.NEW, lastContact: getDate(-1), nextFollowUp: getDate(2), assignedTo: 'Sneha', score: 20, tags: ['Cold'], source: 'Referral' },
  { id: 'l2', name: 'Raj', company: 'CNC - Raj', email: 'raj@cnc.com', value: 16000, status: LeadStatus.NEW, lastContact: getDate(-2), nextFollowUp: getDate(1), assignedTo: 'Sneha', score: 20, tags: ['Cold'], source: 'Referral' },
  { id: 'l3', name: 'Vishwa', company: 'CNC - Vishwa', email: 'vishwa@cnc.com', value: 16000, status: LeadStatus.NEW, lastContact: getDate(-3), nextFollowUp: getDate(3), assignedTo: 'Sneha', score: 20, tags: ['Cold'], source: 'Referral' },
  { id: 'l4', name: 'SMS Client', company: 'SMS', email: 'contact@sms.com', value: 3000, status: LeadStatus.CONTACTED, lastContact: getDate(0), nextFollowUp: getDate(2), assignedTo: 'Sneha', score: 60, tags: ['Negotiation'], source: 'Inbound' },
  { id: 'l5', name: 'Shiva', company: 'CCTV Shiva - Bharath Digital', email: 'shiva@bharathdigital.in', value: 158000, status: LeadStatus.PROPOSAL_SENT, lastContact: getDate(-1), nextFollowUp: getDate(2), assignedTo: 'Sneha', score: 75, tags: ['Quote Sent', 'Advance Pending'], source: 'Direct' },
  { id: 'l6', name: 'Paper Website', company: 'Paper Submit Website', email: 'info@papersubmit.com', value: 40000, status: LeadStatus.MEETING_SCHEDULED, lastContact: getDate(-1), nextFollowUp: getDate(1), assignedTo: 'Sneha', score: 50, tags: ['Meeting Fix'], source: 'Outbound' },
  { id: 'l7', name: 'Briks Owner', company: 'Briks Website', email: 'owner@briks.com', value: 15000, status: LeadStatus.MEETING_SCHEDULED, lastContact: getDate(-2), nextFollowUp: getDate(1), assignedTo: 'Sneha', score: 50, tags: ['Meeting Fix'], source: 'Outbound' },
  { id: 'l8', name: 'Editor', company: 'News Paper Portal', email: 'editor@newsportal.com', value: 40000, status: LeadStatus.MEETING_SCHEDULED, lastContact: getDate(-1), nextFollowUp: getDate(3), assignedTo: 'Sneha', score: 55, tags: ['Meeting Fix'], source: 'Outbound' },
  { id: 'l9', name: 'Hospital Admin', company: 'HMS and Pharmacy MS', email: 'admin@hms.com', value: 40000, status: LeadStatus.MEETING_SCHEDULED, lastContact: getDate(-1), nextFollowUp: getDate(2), assignedTo: 'Sneha', score: 60, tags: ['Meeting Fix', 'Healthcare'], source: 'Outbound' },
  { id: 'l10', name: 'Tech Lead', company: 'Luminos precision technology', email: 'info@luminos.com', value: 16000, status: LeadStatus.NEW, lastContact: getDate(0), nextFollowUp: getDate(1), assignedTo: 'Sneha', score: 30, tags: ['Today'], source: 'Cold Call' },
  { id: 'l11', name: 'Manager', company: 'Hotel, Bar Billing App', email: 'manager@hotelbar.com', value: 160000, status: LeadStatus.MEETING_SCHEDULED, lastContact: getDate(-1), nextFollowUp: getDate(2), assignedTo: 'Sneha', score: 70, tags: ['Demo Ready'], source: 'Inbound' },
  { id: 'l12', name: 'Shiva Sai', company: 'Medical Billing App', email: 'shiva@medical.com', value: 40000, status: LeadStatus.MEETING_SCHEDULED, lastContact: getDate(-1), nextFollowUp: getDate(2), assignedTo: 'Sneha', score: 70, tags: ['Demo Ready'], source: 'Referral' },
  { id: 'l13', name: 'Owner', company: 'DotPe Replace Client', email: 'owner@dotpe-replace.com', value: 40000, status: LeadStatus.MEETING_SCHEDULED, lastContact: getDate(-2), nextFollowUp: getDate(2), assignedTo: 'Sneha', score: 60, tags: ['Meeting Fix'], source: 'Outbound' },
  { id: 'l14', name: 'Analyst', company: 'CDR Analysis', email: 'analyst@cdr.com', value: 1500000, status: LeadStatus.CONTACTED, lastContact: getDate(-5), nextFollowUp: getDate(5), assignedTo: 'Sneha', score: 40, tags: ['Waiting'], source: 'Referral' },
  { id: 'l15', name: 'Admin', company: 'Pragnya education & society', email: 'admin@pragnya.edu', value: 0, status: LeadStatus.NEW, lastContact: getDate(-3), nextFollowUp: getDate(0), assignedTo: 'Sneha', score: 10, tags: ['Need Call'], source: 'List' },
  { id: 'l16', name: 'Akash', company: 'Akash BDR', email: 'akash@bdr.com', value: 0, status: LeadStatus.NEW, lastContact: getDate(-3), nextFollowUp: getDate(0), assignedTo: 'Sneha', score: 10, tags: ['Need Call'], source: 'List' },
  { id: 'l17', name: 'Principal', company: 'Akash Pharmacy college', email: 'principal@akash.edu', value: 0, status: LeadStatus.NEW, lastContact: getDate(-3), nextFollowUp: getDate(0), assignedTo: 'Sneha', score: 10, tags: ['Need Call'], source: 'List' },
  { id: 'l18', name: 'Owner', company: 'SHURAYWADA DHABA', email: 'contact@dhaba.com', value: 0, status: LeadStatus.NEW, lastContact: getDate(-3), nextFollowUp: getDate(0), assignedTo: 'Sneha', score: 10, tags: ['Need Call'], source: 'List' },
  { id: 'l19', name: 'Coordinator', company: 'AMKA EduLlink', email: 'info@amka.com', value: 0, status: LeadStatus.MEETING_SCHEDULED, lastContact: getDate(-1), nextFollowUp: '2024-12-15', assignedTo: 'Sneha', score: 50, tags: ['Meeting 15 Dec'], source: 'Outbound' },
  { id: 'l20', name: 'Umesh', company: 'UMESH - FIN STOCKS', email: 'umesh@finstocks.com', value: 0, status: LeadStatus.MEETING_SCHEDULED, lastContact: getDate(-1), nextFollowUp: '2024-12-15', assignedTo: 'Sneha', score: 50, tags: ['Meeting 15 Dec'], source: 'Outbound' },
  { id: 'l21', name: 'Samrth', company: 'Jwellers website Samrth', email: 'samrth@jwellers.com', value: 0, status: LeadStatus.MEETING_SCHEDULED, lastContact: getDate(-1), nextFollowUp: '2024-12-14', assignedTo: 'Sneha', score: 50, tags: ['Meeting 14 Dec'], source: 'Outbound' },
  { id: 'l22', name: 'Manager', company: 'NK finstock Website', email: 'manager@nkfinstock.com', value: 0, status: LeadStatus.MEETING_SCHEDULED, lastContact: getDate(-1), nextFollowUp: '2024-12-15', assignedTo: 'Sneha', score: 50, tags: ['Meeting 15 Dec'], source: 'Outbound' },
  { id: 'l23', name: 'Shoba', company: 'Shoba services', email: 'shoba@services.com', value: 0, status: LeadStatus.NEW, lastContact: getDate(0), nextFollowUp: '2025-12-18', assignedTo: 'Sneha', score: 10, tags: ['Future'], source: 'Outbound' },
  { id: 'l24', name: 'Client', company: 'Youtech solutions', email: 'contact@youtech.com', value: 0, status: LeadStatus.NEW, lastContact: getDate(0), nextFollowUp: '2025-12-17', assignedTo: 'Sneha', score: 10, tags: ['Future'], source: 'Outbound' },
  { id: 'l25', name: 'Client', company: 'arryaemps', email: 'contact@arryaemps.com', value: 1000, status: LeadStatus.CLOSED_LOST, lastContact: getDate(-30), nextFollowUp: getDate(0), assignedTo: 'Sneha', score: 0, tags: ['Dropped'], source: 'Old' },

];

export const MOCK_MEETINGS: Meeting[] = [
  { id: 'm1', leadId: 'l11', leadName: 'Hotel, Bar App', date: getDate(2), time: '14:00', type: 'Demo', status: 'Scheduled' },
  { id: 'm2', leadId: 'l6', leadName: 'Paper Website', date: getDate(1), time: '11:00', type: 'Discovery', status: 'Scheduled' },
];

export const MOCK_PROJECTS: Project[] = [
  { 
    id: 'p1', 
    title: 'School Management System', 
    client: 'Iqbal Patel School', 
    status: ProjectStatus.COMPLETED, 
    dueDate: getDate(-20), 
    progress: 100, 
    budget: 15000,
    tasks: [
      { id: 't1', title: 'Deployment', assignee: 'Dev', priority: 'High' }
    ]
  },
  { 
    id: 'p2', 
    title: 'Yearly Retainer', 
    client: 'Croptell Crop Science', 
    status: ProjectStatus.RETAINER, 
    dueDate: getDate(300), 
    progress: 100, 
    budget: 8000,
    tasks: [] 
  },
  { 
    id: 'p3', 
    title: 'Yearly Maintenance', 
    client: 'Vishwashanthi', 
    status: ProjectStatus.RETAINER, 
    dueDate: getDate(250), 
    progress: 100, 
    budget: 10000,
    tasks: [] 
  },
  { 
    id: 'p4', 
    title: 'Yearly Support', 
    client: 'Magamanikaya', 
    status: ProjectStatus.RETAINER, 
    dueDate: getDate(180), 
    progress: 100, 
    budget: 6000,
    tasks: [] 
  },
  { 
    id: 'p5', 
    title: 'BMS Project', 
    client: 'BMS', 
    status: ProjectStatus.DELIVERY, 
    dueDate: getDate(5), 
    progress: 95, 
    budget: 22000,
    tasks: [
        { id: 't5', title: 'Payment Pending', assignee: 'Account', priority: 'High' }
    ] 
  },
  { 
    id: 'p6', 
    title: 'Food Pre-booking App', 
    client: 'Food Pre-booking Client', 
    status: ProjectStatus.PRODUCTION, 
    dueDate: getDate(45), 
    progress: 40, 
    budget: 122000,
    tasks: [
        { id: 't6a', title: 'Vendor Module', assignee: 'Dev', priority: 'High' },
        { id: 't6b', title: 'User End', assignee: 'Dev', priority: 'Medium' }
    ] 
  },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-001', client: 'Iqbal Patel School', amount: 15000, date: getDate(-30), status: 'Paid' },
  { id: 'INV-002', client: 'Croptell Crop Science', amount: 8000, date: getDate(-60), status: 'Paid' },
  { id: 'INV-003', client: 'Food Pre-booking Client', amount: 24400, date: getDate(-10), status: 'Paid' }, // 20% advance
  { id: 'INV-004', client: 'BMS', amount: 22000, date: getDate(-5), status: 'Pending' },
];

export const MOCK_CAMPAIGNS: MarketingCampaign[] = [
  { id: '1', name: 'Hospital HMS Promo', platform: 'Instagram', status: 'Active', budget: 50000, leadsGenerated: 145 },
  { id: '2', name: 'Restaurant B2B Outreach', platform: 'LinkedIn', status: 'Active', budget: 120000, leadsGenerated: 42 },
  { id: '3', name: 'Logistics Cold Email', platform: 'Email', status: 'Paused', budget: 15000, leadsGenerated: 12 },
];

export const MOCK_APPLICATIONS: JobApplication[] = [
  { id: 'a1', applicantName: 'Ravi Verma', email: 'ravi@gmail.com', role: 'Business Development Associate', appliedDate: getDate(-2), status: ApplicationStatus.NEW, phone: '9898989898', resumeUrl: '#' },
  { id: 'a2', applicantName: 'Sita Sharma', email: 'sita@yahoo.com', role: 'Business Development Associate', appliedDate: getDate(-5), status: ApplicationStatus.SCREENING, phone: '9797979797', resumeUrl: '#' },
];

export const DASHBOARD_STATS = [
  { title: 'Total Revenue', value: '₹68,50,000', change: '+12.5%', positive: true },
  { title: 'Active Leads', value: '24', change: '+4 this week', positive: true },
  { title: 'Projects Active', value: '6', change: '-1 completed', positive: false },
  { title: 'Pending Invoices', value: '₹22,000', change: '1 overdue', positive: false },
];
