import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Projects from './pages/Projects';
import Finance from './pages/Finance';
import Login from './pages/Login';
import Marketing from './pages/Marketing';
import Retention from './pages/Retention';
import Settings from './pages/Settings';
import { User, UserRole } from './types';
import { Menu, Bell, Search } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = (selectedUser: User) => {
    setUser(selectedUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <div 
          className={`fixed inset-0 bg-gray-900/50 z-40 lg:hidden transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
          onClick={() => setSidebarOpen(false)}
        />

        <Sidebar role={user.role} onLogout={handleLogout} isOpen={sidebarOpen} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={24} />
            </button>

            <div className="hidden md:flex items-center flex-1 max-w-md ml-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Global Search..." 
                  className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-transparent rounded-lg focus:bg-white focus:border-brand-300 focus:ring-2 focus:ring-brand-100 transition-all outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-slate-900">{user.name}</div>
                  <div className="text-xs text-slate-500">{user.role}</div>
                </div>
                <img 
                  src={user.avatarUrl || "https://via.placeholder.com/40"} 
                  alt="Profile" 
                  className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white shadow-sm"
                />
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/leads" element={user.role === UserRole.ADMIN || user.role === UserRole.BDA ? <Leads /> : <Navigate to="/" />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/finance" element={user.role !== UserRole.BDA && user.role !== UserRole.DEVELOPER ? <Finance /> : <Navigate to="/" />} />
                <Route path="/marketing" element={<Marketing />} />
                <Route path="/retention" element={<Retention />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;