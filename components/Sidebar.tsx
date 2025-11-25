import React from 'react';
import { LayoutDashboard, Users, Briefcase, IndianRupee, FileText, Settings, LogOut } from 'lucide-react';
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

    if (role === UserRole.ADMIN || role === UserRole.BDA) {
      links.push({ icon: Users, label: 'Leads (CRM)', path: '/leads' });
    }

    if (role !== UserRole.CLIENT) {
      links.push({ icon: Briefcase, label: 'Projects', path: '/projects' });
    } else {
      // Client view
      links.push({ icon: Briefcase, label: 'My Projects', path: '/projects' });
    }

    if (role === UserRole.ADMIN || role === UserRole.PROJECT_MANAGER || role === UserRole.CLIENT) {
      links.push({ icon: IndianRupee, label: 'Finance', path: '/finance' });
    }

    if (role === UserRole.BDA || role === UserRole.ADMIN) {
       links.push({ icon: FileText, label: 'Reports', path: '/reports' });
    }

    return links;
  };

  const linkClasses = (active: boolean) => `
    flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
    ${active 
      ? 'bg-brand-50 text-brand-700' 
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }
  `;

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 px-6 border-b border-slate-200">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-900">
            AgencyOS
          </span>
        </div>

        <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <div className="mb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Menu
          </div>
          {getLinks().map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              className={linkClasses(isActive(link.path))}
            >
              <link.icon size={20} />
              {link.label}
            </Link>
          ))}

          <div className="mt-8 mb-2 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            System
          </div>
          <Link to="/settings" className={linkClasses(isActive('/settings'))}>
            <Settings size={20} />
            Settings
          </Link>
        </div>

        <div className="p-4 border-t border-slate-200">
          <button 
            onClick={onLogout}
            className="flex items-center justify-center w-full gap-2 px-4 py-2 text-sm font-medium text-red-600 transition-colors rounded-lg hover:bg-red-50"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;