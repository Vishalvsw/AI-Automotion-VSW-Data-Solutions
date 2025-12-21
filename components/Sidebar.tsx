
import React from 'react';
import { LayoutDashboard, Users, Briefcase, IndianRupee, Settings, LogOut, Megaphone, ShieldCheck, Rocket, Zap, Target, Layers, X } from 'lucide-react';
import { UserRole } from '../types';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  role: UserRole;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, onLogout, isOpen, setIsOpen }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const getLinks = () => {
    const isFounder = role === UserRole.FOUNDER;
    const isFinance = role === UserRole.FINANCE;
    const isBDA = role === UserRole.BDA;
    const isDevOrDesigner = role === UserRole.DEVELOPER || role === UserRole.DESIGNER;

    const links = [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    ];

    if (isFounder || isBDA) {
      links.push({ icon: Target, label: 'BDA Cockpit', path: '/leads' });
      links.push({ icon: Layers, label: 'Onboarding', path: '/onboarding' });
    }

    if (isFounder || isFinance || isDevOrDesigner) {
      links.push({ icon: Briefcase, label: 'Operations', path: '/projects' });
    }

    if (isFounder || isFinance) {
      links.push({ icon: IndianRupee, label: 'Financials', path: '/finance' });
    }

    if (isFounder) {
      links.push({ icon: Megaphone, label: 'Marketing', path: '/marketing' });
    }

    return links;
  };

  const linkClasses = (active: boolean) => `
    flex items-center gap-3 px-5 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300 group
    ${active 
      ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 translate-x-1' 
      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
    }
  `;

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-[100] w-72 bg-white border-r border-slate-100 transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col shadow-2xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}
    >
        <div className="flex items-center justify-between h-24 px-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg">
              V
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-slate-900 leading-none tracking-tighter">AgencyOS</span>
              <span className="text-[10px] font-black text-brand-600 uppercase tracking-[0.2em] mt-1">VSW Enterprise</span>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          <div className="mb-4 px-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
            {role === UserRole.FOUNDER ? 'Main Intelligence' : 
             role === UserRole.FINANCE ? 'Finance Command' : 'Operational Command'}
          </div>
          {getLinks().map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              onClick={() => setIsOpen(false)}
              className={linkClasses(isActive(link.path))}
            >
              <link.icon size={20} className={isActive(link.path) ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-900'} />
              {link.label}
            </Link>
          ))}

          {role === UserRole.FOUNDER && (
            <>
              <div className="mt-10 mb-4 px-6 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                Control Tower
              </div>
              <Link to="/settings" onClick={() => setIsOpen(false)} className={linkClasses(isActive('/settings'))}>
                <ShieldCheck size={20} className={isActive('/settings') ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-900'} />
                Global Admin
              </Link>
            </>
          )}
        </div>

        <div className="p-6 border-t border-slate-50 bg-slate-50/30">
          <button 
            onClick={onLogout}
            className="flex items-center w-full gap-4 px-5 py-4 text-sm font-black text-slate-500 transition-all rounded-2xl hover:bg-red-50 hover:text-red-600 group"
          >
            <LogOut size={20} className="text-slate-400 group-hover:text-red-600" />
            Sign Out
          </button>
        </div>
    </aside>
  );
};

export default Sidebar;
