
import React, { useState, useMemo } from 'react';
import { MOCK_USERS } from '../services/mockData';
import { UserRole, User, QuotationModule } from '../types';
import { 
  Shield, User as UserIcon, CheckSquare, Bell, Lock, 
  UserPlus, CheckCircle, XCircle, X, Trash2, Tag, 
  Plus, Edit2, IndianRupee, LayoutGrid, List, 
  TrendingUp, BarChart3, Database, Coins, ArrowUpRight,
  Mail, Smartphone, BellRing, Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SettingsProps {
  user: User;
}

const Settings: React.FC<SettingsProps> = ({ user: currentUser }) => {
  const { modules, addModule, updateModule, deleteModule } = useApp();
  const isAdmin = currentUser.role === UserRole.FOUNDER;
  
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<QuotationModule | null>(null);
  const [libraryView, setLibraryView] = useState<'grid' | 'ledger'>('grid');
  
  // Notification Prefs State
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [appNotifsEnabled, setAppNotifsEnabled] = useState(true);

  const [approvals, setApprovals] = useState([
    { id: 1, type: 'Invoice Approval', desc: 'Approve Invoice #INV-2024-002 for ₹12,50,000', requester: 'Karan (Finance)', status: 'Pending' },
    { id: 2, type: 'New Hire', desc: 'Approve Hiring of Sr. React Developer', requester: 'Priya (HR)', status: 'Pending' },
    { id: 3, type: 'Project Budget', desc: 'Increase budget for Food Delivery App by 10%', requester: 'Rahul (PM)', status: 'Pending' },
  ]);

  const catalogStats = useMemo(() => {
    const total = modules.reduce((acc, m) => acc + m.price, 0);
    const avg = modules.length > 0 ? total / modules.length : 0;
    return {
      count: modules.length,
      avgValue: avg,
      suiteValue: total
    };
  }, [modules]);

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(amount);
  };

  const handleApprove = (id: number) => {
    if (!isAdmin) return;
    setApprovals(approvals.map(a => a.id === id ? { ...a, status: 'Approved' } : a));
  };

  const handleReject = (id: number) => {
    if (!isAdmin) return;
    setApprovals(approvals.map(a => a.id === id ? { ...a, status: 'Rejected' } : a));
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
      if (!isAdmin) return;
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const handleRemoveUser = (userId: string) => {
      if (!isAdmin) return;
      if (confirm('Are you sure you want to remove this user?')) {
          setUsers(users.filter(u => u.id !== userId));
      }
  };

  const handleInviteUser = (e: React.FormEvent) => {
      e.preventDefault();
      if (!isAdmin) return;
      const formData = new FormData(e.target as HTMLFormElement);
      const newUser: User = {
          id: `u-${Date.now()}`,
          name: formData.get('name') as string,
          email: formData.get('email') as string,
          role: formData.get('role') as UserRole,
          phoneNumber: formData.get('phone') as string,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.get('name')}`
      };
      setUsers([...users, newUser]);
      setIsInviteModalOpen(false);
  };

  const handleModuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    const formData = new FormData(e.target as HTMLFormElement);
    const moduleData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
    };

    if (editingModule) {
      updateModule(editingModule.id, moduleData);
    } else {
      addModule({
        id: `mod-${Date.now()}`,
        ...moduleData
      });
    }
    setIsModuleModalOpen(false);
    setEditingModule(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <Shield size={20} className="text-brand-600" />
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Infrastructure</h1>
          </div>
          <p className="text-slate-500 font-medium">Global governance, pricing strategy, and team orchestration.</p>
        </div>
        {!isAdmin && (
           <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl border border-amber-100 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
             <Lock size={14} /> Intelligence Restricted
           </div>
        )}
      </div>

      <div className="flex border-b border-slate-200 space-x-8">
        {[
          { id: 'users', label: 'Identity & Access' },
          { id: 'library', label: 'Solution Strategy' },
          { id: 'notifs', label: 'Communications' },
          { id: 'approvals', label: 'Governance Queue' }
        ].map((tab) => (
          (tab.id !== 'approvals' || isAdmin) && (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === tab.id ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              {tab.label}
              {tab.id === 'approvals' && approvals.filter(a => a.status === 'Pending').length > 0 && (
                <span className="ml-2 bg-red-600 text-white px-2 py-0.5 rounded-full text-[10px] font-black animate-pulse">
                  {approvals.filter(a => a.status === 'Pending').length}
                </span>
              )}
            </button>
          )
        ))}
      </div>

      {activeTab === 'users' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Active Operatives</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Authorized system users and their permission tiers.</p>
              </div>
              {isAdmin && (
                <button onClick={() => setIsInviteModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                  <UserPlus size={16} />
                  Provision Operative
                </button>
              )}
            </div>
            <div className="divide-y divide-slate-50">
              {users.map(u => (
                <div key={u.id} className="p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-5">
                    <img src={u.avatarUrl} alt={u.name} className="w-12 h-12 rounded-2xl bg-slate-100 shadow-sm object-cover" />
                    <div>
                      <div className="font-black text-slate-900">{u.name}</div>
                      <div className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">{u.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                       <select 
                         disabled={!isAdmin}
                         className="text-[10px] font-black uppercase tracking-widest border border-slate-200 rounded-xl px-4 py-2.5 text-slate-600 bg-white focus:ring-2 focus:ring-brand-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed appearance-none" 
                         value={u.role}
                         onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                       >
                          {Object.values(UserRole).map(role => (
                              <option key={role} value={role}>{role}</option>
                          ))}
                      </select>
                    {isAdmin && (
                      <button onClick={() => handleRemoveUser(u.id)} className="text-slate-300 hover:text-red-600 p-3 hover:bg-red-50 rounded-2xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'library' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
                  <BarChart3 size={14} className="text-brand-500" /> Catalog Depth
                </div>
                <div className="text-2xl font-black text-slate-900">{catalogStats.count} Solutions</div>
             </div>
             <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
                  <TrendingUp size={14} className="text-green-500" /> Avg Unit Price
                </div>
                <div className="text-2xl font-black text-slate-900">{formatINR(catalogStats.avgValue)}</div>
             </div>
             <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-800 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                   <Coins size={60} />
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 relative z-10">
                  <Coins size={14} className="text-brand-400" /> Full Suite Value
                </div>
                <div className="text-2xl font-black relative z-10">{formatINR(catalogStats.suiteValue)}</div>
             </div>
          </div>

          <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3">
               <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest ml-4">Module Repository</h3>
               <div className="flex bg-slate-100 p-1 rounded-xl">
                 <button onClick={() => setLibraryView('grid')} className={`p-1.5 rounded-lg transition-all ${libraryView === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}><LayoutGrid size={16} /></button>
                 <button onClick={() => setLibraryView('ledger')} className={`p-1.5 rounded-lg transition-all ${libraryView === 'ledger' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}><List size={16} /></button>
               </div>
            </div>
            {isAdmin && (
              <button 
                onClick={() => { setEditingModule(null); setIsModuleModalOpen(true); }}
                className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-brand-700 transition-all shadow-xl shadow-brand-100"
              >
                <Plus size={16} /> Define Solution
              </button>
            )}
          </div>

          {libraryView === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modules.map(module => (
                <div key={module.id} className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm flex justify-between items-start group hover:border-brand-200 hover:shadow-xl hover:shadow-slate-100 transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-brand-50 text-brand-600 rounded-xl">
                         {module.name.toLowerCase().includes('auth') ? <Shield size={16} /> : 
                          module.name.toLowerCase().includes('bi') || module.name.toLowerCase().includes('analytics') ? <BarChart3 size={16} /> :
                          module.name.toLowerCase().includes('storage') || module.name.toLowerCase().includes('data') ? <Database size={16} /> :
                          <Tag size={16} />}
                      </div>
                      <h4 className="font-black text-slate-900 text-base">{module.name}</h4>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[240px]">{module.description}</p>
                    <div className="flex items-baseline gap-2 pt-2">
                       <span className="text-2xl font-black text-brand-600">{formatINR(module.price)}</span>
                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Base Rate</span>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1">
                      <button 
                        onClick={() => { setEditingModule(module); setIsModuleModalOpen(true); }}
                        className="p-3 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-2xl transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => deleteModule(module.id)}
                        className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-[32px] shadow-sm overflow-hidden">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                        <th className="px-8 py-5">Solution Module</th>
                        <th className="px-8 py-5 text-right">Unit Price (₹)</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {modules.map(module => (
                        <tr key={module.id} className="hover:bg-slate-50/50 transition-colors group">
                           <td className="px-8 py-5">
                              <div className="font-black text-slate-900">{module.name}</div>
                              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{module.description}</div>
                           </td>
                           <td className="px-8 py-5 text-right">
                              <span className="text-sm font-black text-brand-600">{formatINR(module.price)}</span>
                           </td>
                           <td className="px-8 py-5 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingModule(module); setIsModuleModalOpen(true); }} className="p-2 text-slate-400 hover:text-brand-600 rounded-lg"><Edit2 size={16} /></button>
                              <button onClick={() => deleteModule(module.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg"><Trash2 size={16} /></button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'notifs' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
           <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden p-8 space-y-8">
              <div>
                <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Communication Protocol</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Automated BDA follow-up triggers and alert distribution.</p>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 transition-all">
                    <div className="flex items-center gap-5">
                       <div className="p-4 bg-brand-50 text-brand-600 rounded-2xl">
                          <Mail size={24} />
                       </div>
                       <div>
                          <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Email Reminders</h4>
                          <p className="text-[10px] font-bold text-slate-400">Receive external alerts for approaching follow-up deadlines.</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setEmailEnabled(!emailEnabled)}
                      className={`w-14 h-8 rounded-full relative transition-all duration-300 ${emailEnabled ? 'bg-brand-600' : 'bg-slate-200'}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${emailEnabled ? 'left-7' : 'left-1'}`}></div>
                    </button>
                 </div>

                 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 transition-all">
                    <div className="flex items-center gap-5">
                       <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
                          <BellRing size={24} />
                       </div>
                       <div>
                          <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">App Notifications</h4>
                          <p className="text-[10px] font-bold text-slate-400">Trigger real-time alerts within the OS command center.</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setAppNotifsEnabled(!appNotifsEnabled)}
                      className={`w-14 h-8 rounded-full relative transition-all duration-300 ${appNotifsEnabled ? 'bg-brand-600' : 'bg-slate-200'}`}
                    >
                      <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${appNotifsEnabled ? 'left-7' : 'left-1'}`}></div>
                    </button>
                 </div>

                 <div className="flex items-center justify-between p-6 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-200 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-all">
                       <Smartphone size={80} />
                    </div>
                    <div className="flex items-center gap-5 relative z-10">
                       <div className="p-4 bg-white/10 text-white rounded-2xl">
                          <Zap size={24} />
                       </div>
                       <div>
                          <h4 className="text-sm font-black uppercase tracking-tight">High-Priority Sweep</h4>
                          <p className="text-[10px] font-bold text-slate-400">Automated hourly scans for priority leakage detection.</p>
                       </div>
                    </div>
                    <span className="bg-green-600 text-[8px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest relative z-10 animate-pulse">Running</span>
                 </div>
              </div>
           </div>
        </div>
      )}

      {activeTab === 'approvals' && isAdmin && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
           {approvals.map(approval => (
              <div key={approval.id} className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-brand-200 transition-all">
                 <div className="flex items-start gap-5">
                    <div className={`p-4 rounded-2xl shadow-sm ${approval.status === 'Pending' ? 'bg-orange-50 text-orange-600' : approval.status === 'Approved' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                       {approval.status === 'Pending' ? <Bell size={24} /> : approval.status === 'Approved' ? <CheckCircle size={24} /> : <XCircle size={24} />}
                    </div>
                    <div>
                       <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">{approval.type}</h4>
                       <p className="text-sm text-slate-600 font-bold mt-1">{approval.desc}</p>
                       <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                          <UserIcon size={12} /> {approval.requester}
                       </p>
                    </div>
                 </div>
                 {approval.status === 'Pending' ? (
                   <div className="flex gap-3">
                      <button onClick={() => handleReject(approval.id)} className="px-6 py-3 border border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all">Reject</button>
                      <button onClick={() => handleApprove(approval.id)} className="px-6 py-3 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all">Authorize</button>
                   </div>
                 ) : (
                    <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${approval.status === 'Approved' ? 'bg-green-600 text-white border-green-600' : 'bg-red-600 text-white border-red-600'}`}>
                       {approval.status}
                    </span>
                 )}
              </div>
           ))}
        </div>
      )}

      {/* MODULE MODAL */}
      {isModuleModalOpen && isAdmin && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-500 border border-white">
              <div className="px-10 py-8 bg-slate-900 text-white flex justify-between items-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-[100px] rounded-full"></div>
                  <div className="relative z-10">
                     <h2 className="text-2xl font-black tracking-tight">{editingModule ? 'Recalibrate Module' : 'Architect Solution'}</h2>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Solution Catalog Optimization</p>
                  </div>
                  <button onClick={() => { setIsModuleModalOpen(false); setEditingModule(null); }} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all relative z-10"><X size={24}/></button>
              </div>
              <form onSubmit={handleModuleSubmit} className="p-10 space-y-8 bg-white">
                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Module Identity</label>
                      <input required name="name" defaultValue={editingModule?.name} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-brand-500 focus:bg-white rounded-2xl font-black text-sm outline-none transition-all" placeholder="e.g. Auth System V3" />
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Capability Description</label>
                      <textarea required name="description" defaultValue={editingModule?.description} rows={3} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-brand-500 focus:bg-white rounded-2xl font-bold text-sm outline-none resize-none transition-all" placeholder="Quantify the value proposition..." />
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Numerical Price Index (₹)</label>
                      <div className="relative group">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 p-1.5 bg-brand-100 text-brand-700 rounded-lg">
                           <IndianRupee size={16} />
                        </div>
                        <input required name="price" type="number" defaultValue={editingModule?.price} className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-brand-500 focus:bg-white rounded-[24px] font-black text-xl outline-none transition-all" placeholder="25000" />
                      </div>
                  </div>
                  <div className="pt-4 flex gap-4">
                       <button type="button" onClick={() => { setIsModuleModalOpen(false); setEditingModule(null); }} className="flex-1 py-5 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                       <button type="submit" className="flex-[2] py-5 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-800 shadow-2xl shadow-slate-200 transition-all">Finalize Solution</button>
                  </div>
              </form>
           </div>
        </div>
      )}

      {/* INVITE USER MODAL */}
      {isInviteModalOpen && isAdmin && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-500 border border-white">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                       <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Provision Access</h2>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Authorized Team Invitation</p>
                    </div>
                    <button onClick={() => setIsInviteModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600"><X size={20}/></button>
                </div>
                <form onSubmit={handleInviteUser} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                        <input required name="name" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Sara Smith" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                        <input required name="email" type="email" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="sara@vswdata.in" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Tier</label>
                        <select name="role" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none appearance-none cursor-pointer">
                            {Object.values(UserRole).map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                    <div className="pt-4 flex gap-3">
                         <button type="button" onClick={() => setIsInviteModalOpen(false)} className="flex-1 py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 rounded-xl transition-all">Cancel</button>
                         <button type="submit" className="flex-[2] py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg">Provision Access</button>
                    </div>
                </form>
            </div>
          </div>
      )}
    </div>
  );
};

export default Settings;
