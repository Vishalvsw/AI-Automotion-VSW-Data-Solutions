import { Lead, LeadStatus, Project, ProjectStatus, Invoice, UserRole, User } from '../types';

export const MOCK_USERS: User[] = [
  { id: '1', name: 'Vishal (Founder)', email: 'vishal@agency.in', role: UserRole.ADMIN, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vishal' },
  { id: '2', name: 'Rahul (PM)', email: 'rahul@agency.in', role: UserRole.PROJECT_MANAGER, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul' },
  { id: '3', name: 'Sneha (BDA)', email: 'sneha@agency.in', role: UserRole.BDA, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha' },
  { id: '4', name: 'Rohan (Client)', email: 'contact@techindia.in', role: UserRole.CLIENT, avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan' },
];

export const MOCK_LEADS: Lead[] = [
  { id: '1', name: 'Amit Patel', company: 'TechStart India', email: 'amit@techstart.in', value: 450000, status: LeadStatus.NEW, lastContact: '2023-10-25', assignedTo: 'Sneha' },
  { id: '2', name: 'Anjali Gupta', company: 'Design Studio', email: 'anjali@designstudio.in', value: 1200000, status: LeadStatus.MEETING_SCHEDULED, lastContact: '2023-10-24', assignedTo: 'Sneha' },
  { id: '3', name: 'Vikram Singh', company: 'Logistics Express', email: 'vikram@logistics.in', value: 850000, status: LeadStatus.PROPOSAL_SENT, lastContact: '2023-10-22', assignedTo: 'Sneha' },
  { id: '4', name: 'Neha Reddy', company: 'HealthPlus India', email: 'neha@healthplus.in', value: 1500000, status: LeadStatus.CLOSED_WON, lastContact: '2023-10-20', assignedTo: 'Sneha' },
  { id: '5', name: 'Arjun Mehta', company: 'EduLearn', email: 'arjun@edulearn.in', value: 300000, status: LeadStatus.CONTACTED, lastContact: '2023-10-26', assignedTo: 'Sneha' },
];

export const MOCK_PROJECTS: Project[] = [
  { 
    id: '1', 
    title: 'E-commerce Revamp', 
    client: 'TechStart India', 
    status: ProjectStatus.IN_PROGRESS, 
    dueDate: '2023-11-15', 
    progress: 65, 
    budget: 1200000,
    tasks: [
      { id: 't1', title: 'Design Homepage', assignee: 'Dev', priority: 'High' },
      { id: 't2', title: 'Setup Database', assignee: 'Dev', priority: 'High' }
    ]
  },
  { 
    id: '2', 
    title: 'Mobile App MVP', 
    client: 'HealthPlus India', 
    status: ProjectStatus.PLANNING, 
    dueDate: '2023-12-01', 
    progress: 10, 
    budget: 2500000,
    tasks: [
      { id: 't3', title: 'Wireframing', assignee: 'Designer', priority: 'Medium' }
    ] 
  },
  { 
    id: '3', 
    title: 'SEO Optimization', 
    client: 'Design Studio', 
    status: ProjectStatus.COMPLETED, 
    dueDate: '2023-10-10', 
    progress: 100, 
    budget: 300000,
    tasks: [] 
  },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-2023-001', client: 'TechStart India', amount: 500000, date: '2023-10-01', status: 'Paid' },
  { id: 'INV-2023-002', client: 'HealthPlus India', amount: 1250000, date: '2023-10-15', status: 'Pending' },
  { id: 'INV-2023-003', client: 'Logistics Express', amount: 350000, date: '2023-09-28', status: 'Overdue' },
];

export const DASHBOARD_STATS = [
  { title: 'Total Revenue', value: '₹68,50,000', change: '+12.5%', positive: true },
  { title: 'Active Leads', value: '24', change: '+4', positive: true },
  { title: 'Projects Active', value: '8', change: '-1', positive: false },
  { title: 'Pending Invoices', value: '₹16,00,000', change: '3 overdue', positive: false },
];