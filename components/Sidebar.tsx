
import React from 'react';
import { LayoutDashboard, Users, Briefcase, IndianRupee, Settings, LogOut, Megaphone, ShieldCheck, Rocket, Zap } from 'lucide-react';
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
    // Fix: Removed reference to non-existent UserRole.ADMIN
    const isFounder = role === UserRole.FOUNDER;
    const isBDA = role === UserRole.BDA;

    const links = [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    ];

    if (isFounder || isBDA) {
      links.push({ icon: Users, label: 'CRM (Leads)', path: '/leads' });
      links.push({ icon: Rocket, label: 'Onboarding', path: '/onboarding' });
    }

    if (isFounder) {
      links.push({ icon: Briefcase, label: 'Production', path: '/projects' });
      links.push({ icon: IndianRupee, label: 'Finance', path: '/finance' });
      links.push({ icon: Megaphone, label: 'Marketing', path: '/marketing' });
    }

    return links;
  };

  const linkClasses = (active: boolean) => `
    flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group
    ${active 
      ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
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
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900 leading-none">AgencyOS</span>
              <span className="text-[10px] font-bold text-brand-600 uppercase tracking-tighter">Data Solutions</span>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="mb-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {role === UserRole.FOUNDER ? 'Founder Menu' : 'BDA Workspace'}
          </div>
          {getLinks().map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={linkClasses(isActive(link.path))}
            >
              <link.icon size={18} className={isActive(link.path) ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
              {link.label}
            </Link>
          ))}

          {role === UserRole.FOUNDER && (
            <>
              <div className="mt-8 mb-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                System Admin
              </div>
              <Link to="/settings" className={linkClasses(isActive('/settings'))}>
                <ShieldCheck size={18} className={isActive('/settings') ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
                Admin Panel
              </Link>
              <Link to="/settings" className={linkClasses(isActive('/settings/config'))}>
                <Settings size={18} className={isActive('/settings/config') ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'} />
                Global Config
              </Link>
            </>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="mb-4 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
             <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
                <Zap size={14} className="text-amber-500" />
                Quick Status
             </div>
             <div className="text-[10px] text-slate-500">System Live • 12 Active Projects</div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center w-full gap-3 px-4 py-3 text-sm font-bold text-slate-600 transition-colors rounded-xl hover:bg-red-50 hover:text-red-600 group"
          >
            <LogOut size={18} className="text-slate-400 group-hover:text-red-500" />
            Sign Out
          </button>
        </div>
    </aside>
  );
};

export default Sidebar;
