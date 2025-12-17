
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Lead, Project, Invoice, MarketingCampaign, User, UserRole, LeadStatus } from '../types';
import { MOCK_LEADS, MOCK_PROJECTS, MOCK_INVOICES, MOCK_CAMPAIGNS } from '../services/mockData';

interface AppContextType {
  leads: Lead[];
  projects: Project[];
  invoices: Invoice[];
  campaigns: MarketingCampaign[];
  updateLead: (id: string, updates: Partial<Lead>) => void;
  addLead: (lead: Lead) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  addProject: (project: Project) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  addInvoice: (invoice: Invoice) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [campaigns] = useState<MarketingCampaign[]>(MOCK_CAMPAIGNS);

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const addLead = (lead: Lead) => {
    setLeads(prev => [lead, ...prev]);
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

  return (
    <AppContext.Provider value={{
      leads, projects, invoices, campaigns,
      updateLead, addLead, updateProject, addProject, updateInvoice, addInvoice
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
