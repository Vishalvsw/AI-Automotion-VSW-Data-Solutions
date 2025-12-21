
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Lead, Project, Invoice, MarketingCampaign, User, QuotationModule } from '../types';
import { MOCK_LEADS, MOCK_PROJECTS, MOCK_INVOICES, MOCK_CAMPAIGNS } from '../services/mockData';

interface AppContextType {
  leads: Lead[];
  projects: Project[];
  invoices: Invoice[];
  campaigns: MarketingCampaign[];
  modules: QuotationModule[];
  updateLead: (id: string, updates: Partial<Lead>) => void;
  addLead: (lead: Lead) => void;
  deleteLead: (id: string) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  addProject: (project: Project) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  addInvoice: (invoice: Invoice) => void;
  addModule: (module: QuotationModule) => void;
  updateModule: (id: string, updates: Partial<QuotationModule>) => void;
  deleteModule: (id: string) => void;
}

const DEFAULT_MODULES: QuotationModule[] = [
  { id: 'm1', name: 'Enterprise User Engine', description: 'RBAC, Auth0, Multi-tenancy', price: 20000 },
  { id: 'm2', name: 'BI Analytics Dashboard', description: 'Real-time charts & data exports', price: 25000 },
  { id: 'm3', name: 'Digital Asset Storage', description: 'S3 storage & file versioning', price: 15000 },
  { id: 'm4', name: 'Omnichannel CRM', description: 'Lead, Contact & Pipeline sync', price: 30000 },
  { id: 'm5', name: 'Fintech Gateway', description: 'Unified Razorpay/UPI integration', price: 20000 },
  { id: 'm6', name: 'AI Form Automator', description: 'Logic-driven data collection', price: 18000 },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS as any);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [campaigns] = useState<MarketingCampaign[]>(MOCK_CAMPAIGNS);
  const [modules, setModules] = useState<QuotationModule[]>(() => {
    const saved = localStorage.getItem('vsw_modules');
    return saved ? JSON.parse(saved) : DEFAULT_MODULES;
  });

  useEffect(() => {
    localStorage.setItem('vsw_modules', JSON.stringify(modules));
  }, [modules]);

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const addLead = (lead: Lead) => {
    setLeads(prev => [lead, ...prev]);
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const addProject = (project: Project) => {
    setProjects(prev => [project, ...prev]);
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  const addInvoice = (invoice: Invoice) => {
    setInvoices(prev => [invoice, ...prev]);
  };

  const addModule = (module: QuotationModule) => {
    setModules(prev => [module, ...prev]);
  };

  const updateModule = (id: string, updates: Partial<QuotationModule>) => {
    setModules(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const deleteModule = (id: string) => {
    setModules(prev => prev.filter(m => m.id !== id));
  };

  return (
    <AppContext.Provider value={{
      leads, projects, invoices, campaigns, modules,
      updateLead, addLead, deleteLead, updateProject, addProject, updateInvoice, addInvoice,
      addModule, updateModule, deleteModule
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
