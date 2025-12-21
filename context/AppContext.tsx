
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Lead, Project, Invoice, MarketingCampaign, User, QuotationModule, Notification, UserPreferences } from '../types';
import { MOCK_LEADS, MOCK_PROJECTS, MOCK_INVOICES, MOCK_CAMPAIGNS } from '../services/mockData';

interface AppContextType {
  leads: Lead[];
  projects: Project[];
  invoices: Invoice[];
  campaigns: MarketingCampaign[];
  modules: QuotationModule[];
  notifications: Notification[];
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
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
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
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    localStorage.setItem('vsw_modules', JSON.stringify(modules));
  }, [modules]);

  // Lead Follow-up Scanning Logic
  useEffect(() => {
    const scanLeads = () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().split('T')[0];
      
      const newNotifications: Notification[] = [];
      
      leads.forEach(lead => {
        if (!lead.nextFollowUp) return;
        
        const followUpDate = new Date(lead.nextFollowUp);
        followUpDate.setHours(0, 0, 0, 0);
        
        const isOverdue = followUpDate < today;
        const isToday = lead.nextFollowUp === todayStr;

        if (isOverdue || isToday) {
          const notificationId = `notif-${lead.id}-${isOverdue ? 'overdue' : 'today'}`;
          
          // Only add if not already in state
          if (!notifications.some(n => n.id === notificationId)) {
            newNotifications.push({
              id: notificationId,
              title: isOverdue ? 'CRITICAL: Lead Overdue' : 'Follow-up Approaching',
              message: isOverdue 
                ? `${lead.company} follow-up was scheduled for ${lead.nextFollowUp}. Immediate action required.` 
                : `You have a scheduled follow-up with ${lead.company} today.`,
              type: isOverdue ? 'overdue' : 'approaching',
              date: new Date().toISOString(),
              read: false,
              leadId: lead.id
            });

            // Simulate Email Sending
            console.log(`%c[SYSTEM] Simulating Email to BDA: Follow-up needed for ${lead.company}`, 'color: #3b82f6; font-weight: bold;');
          }
        }
      });

      if (newNotifications.length > 0) {
        setNotifications(prev => [...newNotifications, ...prev]);
      }
    };

    scanLeads();
    // Scan every hour
    const interval = setInterval(scanLeads, 3600000);
    return () => clearInterval(interval);
  }, [leads, notifications]);

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

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <AppContext.Provider value={{
      leads, projects, invoices, campaigns, modules, notifications,
      updateLead, addLead, deleteLead, updateProject, addProject, updateInvoice, addInvoice,
      addModule, updateModule, deleteModule, markNotificationAsRead, clearAllNotifications
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
