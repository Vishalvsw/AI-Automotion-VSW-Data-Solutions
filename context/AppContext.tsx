
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Lead, Project, Invoice, User, QuotationModule, Notification, UserRole, CandidateStatus } from '../types';
import { MOCK_LEADS, MOCK_PROJECTS, MOCK_INVOICES, MOCK_USERS } from '../services/mockData';

interface AppContextType {
  leads: Lead[];
  projects: Project[];
  invoices: Invoice[];
  modules: QuotationModule[];
  notifications: Notification[];
  users: User[]; // Add users to context
  candidates: User[]; // Track pending candidates
  updateLead: (id: string, updates: Partial<Lead>) => void;
  addLead: (lead: Lead) => void;
  deleteLead: (id: string) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  updateModule: (id: string, updates: Partial<QuotationModule>) => void;
  addModule: (module: QuotationModule) => void;
  deleteModule: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  // User/Candidate Management
  addCandidate: (candidate: User) => void;
  approveCandidate: (id: string) => void;
  rejectCandidate: (id: string) => void;
  loginUser: (phone: string) => User | undefined;
}

const DEFAULT_MODULES: QuotationModule[] = [
  { id: 'm1', name: 'User Auth Hub', description: 'RBAC, Auth0, Shield nodes', price: 25000 },
  { id: 'm2', name: 'Real-time Analytics', description: 'BI charts and export protocols', price: 45000 },
  { id: 'm3', name: 'Payment Gateway', description: 'Razorpay and UPI integration', price: 15000 },
  { id: 'm4', name: 'Admin Control OS', description: 'Full system management panel', price: 35000 },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS as any);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS as any);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [modules, setModules] = useState<QuotationModule[]>(() => {
    const s = localStorage.getItem('vsw_lib'); return s ? JSON.parse(s) : DEFAULT_MODULES;
  });
  
  // User Management State
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [candidates, setCandidates] = useState<User[]>([
    // Mock candidate for immediate visibility
    { 
      id: 'cand-mock-1', 
      name: 'Rohan (Applicant)', 
      email: 'rohan.app@gmail.com', 
      phoneNumber: '9000090000', 
      role: UserRole.BDA_CANDIDATE, 
      candidateStatus: CandidateStatus.PENDING,
      appliedDate: new Date().toISOString()
    }
  ]);

  useEffect(() => { localStorage.setItem('vsw_lib', JSON.stringify(modules)); }, [modules]);

  const updateLead = (id: string, updates: Partial<Lead>) => setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  const addLead = (l: Lead) => setLeads(p => [l, ...p]);
  const deleteLead = (id: string) => setLeads(p => p.filter(l => l.id !== id));
  const updateProject = (id: string, u: any) => setProjects(p => p.map(pr => pr.id === id ? { ...pr, ...u } : pr));
  const updateModule = (id: string, u: any) => setModules(m => m.map(mo => mo.id === id ? { ...mo, ...u } : mo));
  const addModule = (m: QuotationModule) => setModules(p => [...p, m]);
  const deleteModule = (id: string) => setModules(p => p.filter(m => m.id !== id));
  const markNotificationAsRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const clearAllNotifications = () => setNotifications([]);

  // User/Candidate Methods
  const addCandidate = (candidate: User) => {
    // Check if user exists in active users or candidates
    const exists = users.find(u => u.phoneNumber === candidate.phoneNumber) || candidates.find(c => c.phoneNumber === candidate.phoneNumber);
    if (!exists) {
      setCandidates(prev => [...prev, candidate]);
    }
  };

  const approveCandidate = (id: string) => {
    const candidate = candidates.find(c => c.id === id);
    if (candidate) {
      const newUser: User = {
        ...candidate,
        role: UserRole.BDA,
        candidateStatus: CandidateStatus.APPROVED,
        commissionRate: 8 // Default BDA Commission
      };
      setUsers(prev => [...prev, newUser]);
      setCandidates(prev => prev.filter(c => c.id !== id)); // Remove from pending
    }
  };

  const rejectCandidate = (id: string) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
  };

  const loginUser = (phone: string) => {
    // Check active users first
    let user = users.find(u => u.phoneNumber === phone);
    if (user) return user;
    
    // Check candidates (even pending ones can "login" but see the blocking screen)
    user = candidates.find(c => c.phoneNumber === phone);
    return user;
  };

  return (
    <AppContext.Provider value={{ 
      leads, 
      projects, 
      invoices, 
      modules, 
      notifications,
      users,
      candidates,
      updateLead, 
      addLead, 
      deleteLead, 
      updateProject, 
      updateModule, 
      addModule, 
      deleteModule,
      markNotificationAsRead,
      clearAllNotifications,
      addCandidate,
      approveCandidate,
      rejectCandidate,
      loginUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const c = useContext(AppContext); if (!c) throw new Error('App Error'); return c;
};
