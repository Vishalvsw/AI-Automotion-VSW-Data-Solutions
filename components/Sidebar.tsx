import React from 'react';
import { LayoutDashboard, Users, Briefcase, IndianRupee, Settings, LogOut, Megaphone, HeartHandshake, ShieldCheck, Rocket, PieChart } from 'lucide-react';
import { UserRole } from '../types';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  role: UserRole;
  onLogout: () => void;
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ role, onLogout, isOpen }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const getLinks = () => {
    const links = [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    ];

    const isExec = role === UserRole.CEO || role === UserRole.FOUNDER || role === UserRole.CTO;
    const isSales = role === UserRole.BDA || role === UserRole.MARKETING_MANAGER;
    const isFinance = role === UserRole.FINANCE_MANAGER;
    const isAdmin = role === UserRole.ADMIN || role === UserRole.HR_MANAGER;

    // Leads / CRM - Accessible to Sales, Execs, Admin
    if (isExec || isSales || isAdmin) {
      links.push({ icon: Users, label: 'Acquisition (CRM)', path: '/leads' });
      links.push({ icon: Rocket, label: 'Onboarding', path: '/onboarding' });
    }

    // Marketing - Accessible to Marketing, Execs, Admin
    // BDAs usually don't manage campaigns, just leads, but we'll leave it if they need to see sources
    if (isExec || role === UserRole.MARKETING_MANAGER || role === UserRole.ADMIN) {
      links.push({ icon: Megaphone, label: 'Marketing', path: '/marketing' });
    }

    // Projects - Accessible to everyone EXCEPT Finance and BDA (BDAs usually hand off after Onboarding)
    // If you want BDA to track status, remove the check. But "not for others user" implies strictness.
    if (role !== UserRole.CLIENT && role !== UserRole.FINANCE_MANAGER && role !== UserRole.BDA) {
      links.push({ icon: Briefcase, label: 'Projects', path: '/projects' });
    } else if (role === UserRole.CLIENT) {
      links.push({ icon: Briefcase, label: 'My Projects', path: '/projects' });
    }

    // Retention - Execs, PMs, Admins only
    if (isExec || role === UserRole.PROJECT_MANAGER || role === UserRole.ADMIN) {
      links.push({ icon: HeartHandshake, label: 'Retention', path: '/retention' });
    }

    // Finance - Execs, Finance, Admin, Client
    if (isExec || isFinance || role === UserRole.ADMIN || role === UserRole.CLIENT) {
      links.push({ icon: IndianRupee, label: 'Finance', path: '/finance' });
    }

    // Recruitment - Execs, HR, Admin
    if (isExec || role === UserRole.HR_MANAGER || role === UserRole.ADMIN) {
       links.push({ icon: Users, label: 'Recruitment', path: '/recruitment' });
    }

    return links;
  };

  const linkClasses = (active: boolean) => `
    flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group
    ${active 
      ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-md shadow-brand-200' 
      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }
  `;

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}
    >
        <div className="flex items-center h-20 px-8 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold">
              VSW
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              AgencyOS
            </span>
          </div>
        </div>

        <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="mb-3 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Main Menu
          </div>
          {getLinks().map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={linkClasses(isActive(link.path))}
            >
              <link.icon size={20} className={isActive(link.path) ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
              {link.label}
            </Link>
          ))}

          <div className="mt-8 mb-3 px-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Administration
          </div>
          {(role === UserRole.ADMIN || role === UserRole.HR_MANAGER || role === UserRole.CEO || role === UserRole.FOUNDER) && (
             <Link to="/settings" className={linkClasses(isActive('/settings/admin'))}>
              <ShieldCheck size={20} className={isActive('/settings/admin') ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
              Admin Panel
            </Link>
          )}
          {/* BDA shouldn't see System Settings in a strict environment, usually just Profile */}
          {role !== UserRole.BDA && (
            <Link to="/settings" className={linkClasses(isActive('/settings'))}>
              <Settings size={20} className={isActive('/settings') ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
              System Settings
            </Link>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button 
            onClick={onLogout}
            className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium text-slate-600 transition-colors rounded-xl hover:bg-white hover:shadow-sm hover:text-red-600 border border-transparent hover:border-slate-200"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
    </aside>
  );
};

export default Sidebar;