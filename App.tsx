
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import LeadProfile from './pages/LeadProfile';
import Onboarding from './pages/Onboarding';
import Projects from './pages/Projects';
import Finance from './pages/Finance';
import Login from './pages/Login';
import Marketing from './pages/Marketing';
import Retention from './pages/Retention';
import Settings from './pages/Settings';
import NotificationCenter from './components/NotificationCenter'; 
import Copilot from './components/Copilot';
import { User, UserRole } from './types';
import { Menu, Bell, Search } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false); 
  
  const { notifications } = useApp();
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const handleLogin = (selectedUser: User) => {
    setUser(selectedUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const isFounder = user.role === UserRole.FOUNDER;
  const isFinance = user.role === UserRole.FINANCE;

  return (
    <Router>
      <div className="flex h-screen bg-slate-50 overflow-hidden relative text-slate-900">
        <div 
          className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[90] lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
          onClick={() => setSidebarOpen(false)}
        />

        <Sidebar role={user.role} onLogout={handleLogout} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-20 lg:h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 relative z-[250]">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-3 text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <Menu size={22} />
              </button>
              <div className="hidden lg:flex items-center flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search Lead, Project or Task..." 
                    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-100 transition-all outline-none font-medium"
                  />
                </div>
              </div>
              <div className="lg:hidden">
                <span className="text-sm font-black tracking-tighter uppercase text-slate-900">AgencyOS</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative">
                <button 
                  onClick={() => setNotifOpen(!notifOpen)}
                  className={`relative p-3 rounded-xl transition-all ${notifOpen ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  <Bell size={20} />
                  {unreadNotifCount > 0 && (
                    <span className="absolute top-2 right-2 w-3 h-3 bg-red-600 border-2 border-white rounded-full animate-pulse">
                    </span>
                  )}
                </button>
                {notifOpen && <NotificationCenter onClose={() => setNotifOpen(false)} />}
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 leading-none">{user.name}</div>
                  <div className="text-[10px] font-bold text-brand-600 uppercase mt-0.5 tracking-tighter">{user.role}</div>
                </div>
                <img 
                  src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                  alt="Profile" 
                  className="w-10 h-10 lg:w-8 lg:h-8 rounded-full bg-slate-100 border border-slate-200 shadow-sm"
                />
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard user={user} />} />
                <Route path="/leads" element={<Leads user={user} />} />
                <Route path="/leads/:id" element={<LeadProfile user={user} />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/projects" element={<Projects user={user} />} />
                <Route path="/finance" element={isFounder || isFinance ? <Finance /> : <Navigate to="/" />} />
                <Route path="/marketing" element={isFounder ? <Marketing /> : <Navigate to="/" />} />
                <Route path="/retention" element={isFounder ? <Retention /> : <Navigate to="/" />} />
                <Route path="/settings" element={<Settings user={user} />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
      <Copilot />
    </Router>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default App;
