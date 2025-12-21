
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Lead, Project, Invoice, User, QuotationModule, Notification } from '../types';
import { MOCK_LEADS, MOCK_PROJECTS, MOCK_INVOICES } from '../services/mockData';

interface AppContextType {
  leads: Lead[];
  projects: Project[];
  invoices: Invoice[];
  modules: QuotationModule[];
  notifications: Notification[];
  updateLead: (id: string, updates: Partial<Lead>) => void;
  addLead: (lead: Lead) => void;
  deleteLead: (id: string) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  updateModule: (id: string, updates: Partial<QuotationModule>) => void;
  addModule: (module: QuotationModule) => void;
  deleteModule: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
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

  return (
    <AppContext.Provider value={{ 
      leads, 
      projects, 
      invoices, 
      modules, 
      notifications,
      updateLead, 
      addLead, 
      deleteLead, 
      updateProject, 
      updateModule, 
      addModule, 
      deleteModule,
      markNotificationAsRead,
      clearAllNotifications
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const c = useContext(AppContext); if (!c) throw new Error('App Error'); return c;
};
