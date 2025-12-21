
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Onboarding from './pages/Onboarding';
import Projects from './pages/Projects';
import Finance from './pages/Finance';
import Login from './pages/Login';
import Marketing from './pages/Marketing';
import Retention from './pages/Retention';
import Settings from './pages/Settings';
import NotificationCenter from './components/NotificationCenter'; 
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

  return (
    <Router>
      <div className="flex h-screen bg-slate-50 overflow-hidden relative text-slate-900">
        <div 
          className={`fixed inset-0 bg-gray-900/50 z-40 lg:hidden transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
          onClick={() => setSidebarOpen(false)}
        />

        <Sidebar role={user.role} onLogout={handleLogout} isOpen={sidebarOpen} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 relative z-[250]">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <Menu size={20} />
              </button>
              <div className="hidden md:flex items-center flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search Lead, Project or Task..." 
                    className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-100 transition-all outline-none font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button 
                  onClick={() => setNotifOpen(!notifOpen)}
                  className={`relative p-2 rounded-full transition-all ${notifOpen ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  <Bell size={18} />
                  {unreadNotifCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 border-2 border-white rounded-full flex items-center justify-center animate-pulse">
                    </span>
                  )}
                </button>
                {notifOpen && <NotificationCenter onClose={() => setNotifOpen(false)} />}
              </div>
              
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-slate-900 leading-none">{user.name}</div>
                  <div className="text-[10px] font-bold text-brand-600 uppercase mt-0.5 tracking-tighter">{user.role}</div>
                </div>
                <img 
                  src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 shadow-sm"
                />
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard user={user} />} />
                <Route path="/leads" element={<Leads user={user} />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/projects" element={<Projects user={user} />} />
                <Route path="/finance" element={isFounder ? <Finance /> : <Navigate to="/" />} />
                <Route path="/marketing" element={isFounder ? <Marketing /> : <Navigate to="/" />} />
                <Route path="/retention" element={isFounder ? <Retention /> : <Navigate to="/" />} />
                <Route path="/settings" element={<Settings user={user} />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default App;
