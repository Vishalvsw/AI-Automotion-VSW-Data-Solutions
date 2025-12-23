
import React, { useState, useMemo } from 'react';
import { UserRole, User, QuotationModule } from '../types';
import { 
  Shield, User as UserIcon, Bell, Lock, 
  UserPlus, Trash2, Tag, 
  Plus, Edit2, IndianRupee, LayoutGrid, List, 
  TrendingUp, BarChart3, Database, Coins,
  Mail, BellRing, Zap, X, CheckCircle, XCircle, UserCheck, Briefcase
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SettingsProps {
  user: User;
}

const Settings: React.FC<SettingsProps> = ({ user: currentUser }) => {
  const { 
    modules, addModule, updateModule, deleteModule, 
    users: contextUsers, // Get active users from context
    candidates: contextCandidates, // Get candidates from context
    approveCandidate, rejectCandidate
  } = useApp();
  
  const isAdmin = currentUser.role === UserRole.FOUNDER;
  const isFinance = currentUser.role === UserRole.FINANCE;
  const isBDA = currentUser.role === UserRole.BDA;
  
  const [activeTab, setActiveTab] = useState(isBDA ? 'library' : 'users');
  
  // UI States
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<QuotationModule | null>(null);
  const [libraryView, setLibraryView] = useState<'grid' | 'ledger'>('grid');
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [appNotifsEnabled, setAppNotifsEnabled] = useState(true);

  // Use Users from context to display active operatives
  // Note: We are using contextUsers for display, but for role changing/deleting we might need context methods
  // For this demo, we assume the context users are the source of truth for display.

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

  const handleAuthorizeCandidate = (candidateId: string) => {
    if (!isAdmin) return;
    approveCandidate(candidateId);
  };

  const handleRejectCandidate = (candidateId: string) => {
    if (!isAdmin) return;
    rejectCandidate(candidateId);
  };

  // Module Handlers
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
          <p className="text-slate-500 font-medium">Configuration for agency nodes, service catalogs, and team access.</p>
        </div>
        {!isAdmin && !isFinance && (
           <div className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl border border-amber-100 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
             <Lock size={14} /> Elevated Access Required
           </div>
        )}
      </div>

      <div className="flex border-b border-slate-200 space-x-8 overflow-x-auto">
        {[
          { id: 'users', label: 'Identity & Access', restricted: !isAdmin },
          { id: 'recruitment', label: 'Recruitment Protocol', restricted: !isAdmin },
          { id: 'library', label: 'Solution Strategy', restricted: false },
          { id: 'notifs', label: 'Communications', restricted: false },
        ].map((tab) => (
          !tab.restricted && (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              {tab.label}
              {tab.id === 'recruitment' && contextCandidates.length > 0 && (
                <span className="ml-2 bg-brand-600 text-white px-2 py-0.5 rounded-full text-[10px] font-black animate-pulse">
                  {contextCandidates.length}
                </span>
              )}
            </button>
          )
        ))}
      </div>

      {activeTab === 'users' && isAdmin && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Active Operatives</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Authorized system users and their permission tiers.</p>
              </div>
              <button onClick={() => setIsInviteModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                <UserPlus size={16} />
                Provision Operative
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {contextUsers.map(u => (
                <div key={u.id} className="p-6 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-5">
                    <img src={u.avatarUrl} alt={u.name} className="w-12 h-12 rounded-2xl bg-slate-100 shadow-sm object-cover" />
                    <div>
                      <div className="font-black text-slate-900">{u.name}</div>
                      <div className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">{u.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-widest">{u.role}</span>
                      {u.role !== UserRole.FOUNDER && (
                        <button className="text-slate-300 hover:text-red-600 p-3 hover:bg-red-50 rounded-2xl transition-all">
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

      {/* RECRUITMENT TAB */}
      {activeTab === 'recruitment' && isAdmin && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
           <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 min-h-[400px]">
              <div className="mb-8 flex items-center justify-between">
                 <div>
                    <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest flex items-center gap-2">
                        <Briefcase size={16} className="text-brand-600" />
                        Pending Identity Nodes
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 mt-1">Authorize new BDA candidates to grant system access and commission tracking.</p>
                 </div>
                 <div className="px-4 py-2 bg-brand-50 text-brand-700 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    Queue Depth: {contextCandidates.length}
                 </div>
              </div>
              
              <div className="space-y-4">
                 {contextCandidates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                        <UserCheck size={48} className="mb-4 opacity-20" />
                        <p className="font-black uppercase tracking-widest text-xs">No Pending Applications</p>
                    </div>
                 ) : (
                    contextCandidates.map(candidate => (
                        <div key={candidate.id} className="p-6 rounded-[24px] border-2 border-slate-100 bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-brand-200 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-white shadow-lg bg-slate-900 text-xl">
                                {candidate.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 text-sm">{candidate.name}</h4>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="text-[9px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 uppercase tracking-wide">{candidate.email}</span>
                                    <span className="text-[9px] font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 uppercase tracking-wide">{candidate.phoneNumber}</span>
                                    {candidate.appliedDate && (
                                        <span className="text-[9px] font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-lg border border-brand-100 uppercase tracking-wide">
                                            Applied: {new Date(candidate.appliedDate).toLocaleDateString()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
                            <button onClick={() => handleRejectCandidate(candidate.id)} className="flex-1 md:flex-none px-6 py-4 border border-slate-200 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all">
                                Reject
                            </button>
                            <button onClick={() => handleAuthorizeCandidate(candidate.id)} className="flex-1 md:flex-none px-6 py-4 bg-brand-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-brand-700 shadow-xl shadow-brand-100 transition-all flex items-center justify-center gap-2">
                                <UserCheck size={16} /> Authorize Node
                            </button>
                        </div>
                        </div>
                    ))
                 )}
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
                  <TrendingUp size={14} className="text-green-500" /> Avg Solution Price
                </div>
                <div className="text-2xl font-black text-slate-900">{formatINR(catalogStats.avgValue)}</div>
             </div>
             <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-800 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Coins size={60} /></div>
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1 relative z-10">
                  <Coins size={14} className="text-brand-400" /> Full Suite Value
                </div>
                <div className="text-2xl font-black relative z-10">{isAdmin ? formatINR(catalogStats.suiteValue) : 'Restricted'}</div>
             </div>
          </div>

          <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3">
               <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest ml-4">Service Offering Strategy</h3>
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

          <div className={libraryView === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'bg-white border border-slate-100 rounded-[32px] shadow-sm overflow-hidden'}>
            {libraryView === 'grid' ? (
              modules.map(module => (
                <div key={module.id} className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm flex justify-between items-start group hover:border-brand-200 hover:shadow-xl transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-brand-50 text-brand-600 rounded-xl">
                         {module.name.toLowerCase().includes('auth') ? <Shield size={16} /> : 
                          module.name.toLowerCase().includes('bi') ? <BarChart3 size={16} /> :
                          module.name.toLowerCase().includes('data') ? <Database size={16} /> :
                          <Tag size={16} />}
                      </div>
                      <h4 className="font-black text-slate-900 text-base">{module.name}</h4>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[240px]">{module.description}</p>
                    <div className="flex items-baseline gap-2 pt-2">
                       <span className="text-2xl font-black text-brand-600">{formatINR(module.price)}</span>
                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Unit Rate</span>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1">
                      <button onClick={() => { setEditingModule(module); setIsModuleModalOpen(true); }} className="p-3 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-2xl transition-all"><Edit2 size={18} /></button>
                      <button onClick={() => deleteModule(module.id)} className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"><Trash2 size={18} /></button>
                    </div>
                  )}
                </div>
              ))
            ) : (
               <table className="w-full text-left">
                  <thead>
                     <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100">
                        <th className="px-8 py-5">Solution Module</th>
                        <th className="px-8 py-5 text-right">Unit Price (₹)</th>
                        {isAdmin && <th className="px-8 py-5 text-right">Actions</th>}
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {modules.map(module => (
                        <tr key={module.id} className="hover:bg-slate-50/50 transition-colors group">
                           <td className="px-8 py-5">
                              <div className="font-black text-slate-900">{module.name}</div>
                              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{module.description}</div>
                           </td>
                           <td className="px-8 py-5 text-right font-black text-brand-600">{formatINR(module.price)}</td>
                           {isAdmin && (
                             <td className="px-8 py-5 text-right flex justify-end gap-2">
                                <button onClick={() => { setEditingModule(module); setIsModuleModalOpen(true); }} className="p-2 text-slate-400 hover:text-brand-600 rounded-lg"><Edit2 size={16} /></button>
                                <button onClick={() => deleteModule(module.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg"><Trash2 size={16} /></button>
                             </td>
                           )}
                        </tr>
                     ))}
                  </tbody>
               </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'notifs' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
           <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden p-8 space-y-8">
              <div>
                <h3 className="font-black text-slate-900 uppercase text-xs tracking-widest">Communication Protocol</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Automated follow-up triggers and alert distribution for operatives.</p>
              </div>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-5">
                       <div className="p-4 bg-brand-50 text-brand-600 rounded-2xl"><Mail size={24} /></div>
                       <div><h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Email Alerts</h4><p className="text-[10px] font-bold text-slate-400">Receive external notifications for CRM follow-ups.</p></div>
                    </div>
                    <button onClick={() => setEmailEnabled(!emailEnabled)} className={`w-14 h-8 rounded-full relative transition-all duration-300 ${emailEnabled ? 'bg-brand-600' : 'bg-slate-200'}`}><div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${emailEnabled ? 'left-7' : 'left-1'}`}></div></button>
                 </div>
                 <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-5">
                       <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl"><BellRing size={24} /></div>
                       <div><h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">App Notifications</h4><p className="text-[10px] font-bold text-slate-400">Trigger real-time alerts within the OS command center.</p></div>
                    </div>
                    <button onClick={() => setAppNotifsEnabled(!appNotifsEnabled)} className={`w-14 h-8 rounded-full relative transition-all duration-300 ${appNotifsEnabled ? 'bg-brand-600' : 'bg-slate-200'}`}><div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${appNotifsEnabled ? 'left-7' : 'left-1'}`}></div></button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* MODALS REMAIND UNCHANGED */}
      {isModuleModalOpen && isAdmin && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-500 border border-white">
              <div className="px-10 py-8 bg-slate-900 text-white flex justify-between items-center">
                  <div><h2 className="text-2xl font-black tracking-tight">{editingModule ? 'Recalibrate Module' : 'Architect Solution'}</h2><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Solution Catalog Optimization</p></div>
                  <button onClick={() => { setIsModuleModalOpen(false); setEditingModule(null); }} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"><X size={24}/></button>
              </div>
              <form onSubmit={handleModuleSubmit} className="p-10 space-y-8 bg-white">
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Module Identity</label><input required name="name" defaultValue={editingModule?.name} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-brand-500 focus:bg-white rounded-2xl font-black text-sm outline-none transition-all" placeholder="e.g. Auth System V3" /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Capability Description</label><textarea required name="description" defaultValue={editingModule?.description} rows={3} className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-brand-500 focus:bg-white rounded-2xl font-bold text-sm outline-none resize-none transition-all" placeholder="Quantify the value proposition..." /></div>
                  <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price Index (₹)</label><div className="relative group"><div className="absolute left-6 top-1/2 -translate-y-1/2 p-1.5 bg-brand-100 text-brand-700 rounded-lg"><IndianRupee size={16} /></div><input required name="price" type="number" defaultValue={editingModule?.price} className="w-full pl-16 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-brand-500 focus:bg-white rounded-[24px] font-black text-xl outline-none transition-all" placeholder="25000" /></div></div>
                  <div className="pt-4 flex gap-4"><button type="button" onClick={() => { setIsModuleModalOpen(false); setEditingModule(null); }} className="flex-1 py-5 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all">Cancel</button><button type="submit" className="flex-[2] py-5 bg-slate-900 text-white font-black text-xs uppercase rounded-2xl hover:bg-slate-800 shadow-2xl transition-all">Finalize Solution</button></div>
              </form>
           </div>
        </div>
      )}

      {isInviteModalOpen && isAdmin && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-500 border border-white">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div><h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Provision Access</h2><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Authorized Team Invitation</p></div>
                    <button onClick={() => setIsInviteModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600"><X size={20}/></button>
                </div>
                <form className="p-8 space-y-6">
                   <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                     Manual provisioning is active.
                   </div>
                   <button type="button" onClick={() => setIsInviteModalOpen(false)} className="w-full py-4 bg-slate-900 text-white font-black rounded-xl">Close</button>
                </form>
            </div>
          </div>
      )}
    </div>
  );
};

export default Settings;
