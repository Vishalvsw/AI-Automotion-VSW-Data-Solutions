
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
  { id: '1', name: 'Dr. Amit Patel', company: 'City Care Hospital (HMS)', email: 'amit@citycare.in', value: 450000, status: LeadStatus.NEW, lastContact: getDate(-2), nextFollowUp: getDate(-1), assignedTo: 'Sneha', score: 45, tags: ['Cold', 'HMS'], source: 'Google Maps' },
  { id: '2', name: 'Anjali Gupta', company: 'Tasty Bites Delivery', email: 'anjali@tastybites.in', value: 1200000, status: LeadStatus.MEETING_SCHEDULED, lastContact: getDate(-1), nextFollowUp: getDate(2), assignedTo: 'Sneha', score: 85, tags: ['Hot', 'Referral'], source: 'LinkedIn' },
  { id: '3', name: 'Vikram Singh', company: 'SecureView CCTV', email: 'vikram@secureview.in', value: 850000, status: LeadStatus.PROPOSAL_SENT, lastContact: getDate(-5), nextFollowUp: getDate(-2), assignedTo: 'Sneha', score: 70, tags: ['Warm', 'CCTV'], source: 'Website' },
  { id: '4', name: 'Neha Reddy', company: 'HealthPlus Clinic', email: 'neha@healthplus.in', value: 1500000, status: LeadStatus.CLOSED_WON, lastContact: getDate(-10), nextFollowUp: getDate(60), assignedTo: 'Sneha', score: 95, tags: ['Closed'], source: 'Referral' },
  { id: '5', name: 'Arjun Mehta', company: 'EduLearn Systems', email: 'arjun@edulearn.in', value: 300000, status: LeadStatus.CONTACTED, lastContact: getDate(0), nextFollowUp: getDate(3), assignedTo: 'Sneha', score: 55, tags: ['Warm'], source: 'Facebook' },
  { id: '6', name: 'Rajesh Kumar', company: 'Kumar Logistics', email: 'rajesh@kumarlogistics.in', value: 2200000, status: LeadStatus.NEW, lastContact: getDate(-1), nextFollowUp: getDate(1), assignedTo: 'Sneha', score: 30, tags: ['Cold'], source: 'Cold Call' },
];

export const MOCK_MEETINGS: Meeting[] = [
  { id: 'm1', leadId: '2', leadName: 'Anjali Gupta', date: getDate(1), time: '14:00', type: 'Demo', status: 'Scheduled' },
  { id: 'm2', leadId: '3', leadName: 'Vikram Singh', date: getDate(2), time: '11:00', type: 'Discovery', status: 'Scheduled' },
];

export const MOCK_PROJECTS: Project[] = [
  { 
    id: '1', 
    title: 'Hospital Management System', 
    client: 'City Care Hospital', 
    status: ProjectStatus.PRODUCTION, 
    dueDate: getDate(15), 
    progress: 65, 
    budget: 1200000,
    tasks: [
      { id: 't1', title: 'Design Patient Portal', assignee: 'Dev', priority: 'High' },
      { id: 't2', title: 'Setup Doctor Database', assignee: 'Dev', priority: 'High' },
      { id: 't2b', title: 'Integrate Payment Gateway', assignee: 'Dev', priority: 'Medium' }
    ]
  },
  { 
    id: '2', 
    title: 'Food Delivery App MVP', 
    client: 'Tasty Bites', 
    status: ProjectStatus.REQUIREMENTS, 
    dueDate: getDate(30), 
    progress: 10, 
    budget: 2500000,
    tasks: [
      { id: 't3', title: 'Wireframing Order Flow', assignee: 'Designer', priority: 'Medium' }
    ] 
  },
  { 
    id: '3', 
    title: 'SEO & Marketing Dashboard', 
    client: 'SecureView CCTV', 
    status: ProjectStatus.COMPLETED, 
    dueDate: getDate(-10), 
    progress: 100, 
    budget: 300000,
    tasks: [] 
  },
  { 
    id: '4', 
    title: 'EduLearn LMS Platform', 
    client: 'EduLearn', 
    status: ProjectStatus.DELIVERY, 
    dueDate: getDate(5), 
    progress: 90, 
    budget: 1800000,
    tasks: [
        { id: 't4', title: 'Final QA Testing', assignee: 'QA', priority: 'High' }
    ] 
  },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-2024-001', client: 'City Care Hospital', amount: 500000, date: getDate(-30), status: 'Paid' },
  { id: 'INV-2024-002', client: 'Tasty Bites', amount: 1250000, date: getDate(-5), status: 'Pending' },
  { id: 'INV-2024-003', client: 'SecureView CCTV', amount: 350000, date: getDate(-45), status: 'Overdue' },
  { id: 'INV-2024-004', client: 'EduLearn Systems', amount: 900000, date: getDate(0), status: 'Pending' },
];

export const MOCK_CAMPAIGNS: MarketingCampaign[] = [
  { id: '1', name: 'Hospital HMS Promo', platform: 'Instagram', status: 'Active', budget: 50000, leadsGenerated: 145 },
  { id: '2', name: 'Restaurant B2B Outreach', platform: 'LinkedIn', status: 'Active', budget: 120000, leadsGenerated: 42 },
  { id: '3', name: 'Logistics Cold Email', platform: 'Email', status: 'Paused', budget: 15000, leadsGenerated: 12 },
];

export const MOCK_APPLICATIONS: JobApplication[] = [
  { id: 'a1', applicantName: 'Ravi Verma', email: 'ravi@gmail.com', role: 'Business Development Associate', appliedDate: getDate(-2), status: ApplicationStatus.NEW, phone: '9898989898', resumeUrl: '#' },
  { id: 'a2', applicantName: 'Sita Sharma', email: 'sita@yahoo.com', role: 'Business Development Associate', appliedDate: getDate(-5), status: ApplicationStatus.SCREENING, phone: '9797979797', resumeUrl: '#' },
  { id: 'a3', applicantName: 'Manoj Kumar', email: 'manoj@outlook.com', role: 'Frontend Developer', appliedDate: getDate(-10), status: ApplicationStatus.INTERVIEW, phone: '9696969696', resumeUrl: '#' },
];

export const DASHBOARD_STATS = [
  { title: 'Total Revenue', value: '₹68,50,000', change: '+12.5%', positive: true },
  { title: 'Active Leads', value: '24', change: '+4 this week', positive: true },
  { title: 'Projects Active', value: '8', change: '-1 completed', positive: false },
  { title: 'Pending Invoices', value: '₹21,50,000', change: '1 overdue', positive: false },
];
