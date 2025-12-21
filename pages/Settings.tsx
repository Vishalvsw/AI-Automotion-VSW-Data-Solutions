
import React, { useState } from 'react';
import { MOCK_USERS } from '../services/mockData';
import { UserRole, User, QuotationModule } from '../types';
import { Shield, User as UserIcon, CheckSquare, Bell, Lock, UserPlus, CheckCircle, XCircle, X, Trash2, Tag, Plus, Edit2, IndianRupee } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Settings: React.FC = () => {
  const { modules, addModule, updateModule, deleteModule } = useApp();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<QuotationModule | null>(null);
  
  const [approvals, setApprovals] = useState([
    { id: 1, type: 'Invoice Approval', desc: 'Approve Invoice #INV-2024-002 for ₹12,50,000', requester: 'Karan (Finance)', status: 'Pending' },
    { id: 2, type: 'New Hire', desc: 'Approve Hiring of Sr. React Developer', requester: 'Priya (HR)', status: 'Pending' },
    { id: 3, type: 'Project Budget', desc: 'Increase budget for Food Delivery App by 10%', requester: 'Rahul (PM)', status: 'Pending' },
  ]);

  const handleApprove = (id: number) => {
    setApprovals(approvals.map(a => a.id === id ? { ...a, status: 'Approved' } : a));
  };

  const handleReject = (id: number) => {
    setApprovals(approvals.map(a => a.id === id ? { ...a, status: 'Rejected' } : a));
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const handleRemoveUser = (userId: string) => {
      if (confirm('Are you sure you want to remove this user?')) {
          setUsers(users.filter(u => u.id !== userId));
      }
  };

  const handleInviteUser = (e: React.FormEvent) => {
      e.preventDefault();
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

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings & Admin</h1>
        <p className="text-slate-500">Manage users, library of solution modules, and system approvals.</p>
      </div>

      <div className="flex border-b border-slate-200 space-x-6">
        <button 
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'users' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          User Access
        </button>
        <button 
          onClick={() => setActiveTab('library')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'library' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Price Library
        </button>
        <button 
          onClick={() => setActiveTab('approvals')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'approvals' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Approvals
          {approvals.filter(a => a.status === 'Pending').length > 0 && (
             <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-bold">
               {approvals.filter(a => a.status === 'Pending').length}
             </span>
          )}
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-700">Team Members</h3>
              <button onClick={() => setIsInviteModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-100">
                <UserPlus size={14} />
                Invite User
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {users.map(user => (
                <div key={user.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full bg-slate-100" />
                    <div>
                      <div className="font-bold text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                       <select 
                         className="text-xs font-bold border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 bg-white focus:ring-2 focus:ring-brand-500 outline-none" 
                         value={user.role}
                         onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                       >
                          {Object.values(UserRole).map(role => (
                              <option key={role} value={role}>{role}</option>
                          ))}
                      </select>
                    <button onClick={() => handleRemoveUser(user.id)} className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'library' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Module Library</h3>
            <button 
              onClick={() => { setEditingModule(null); setIsModuleModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
            >
              <Plus size={16} /> Add Module
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map(module => (
              <div key={module.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-start group hover:border-brand-300 transition-all">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-brand-500" />
                    <h4 className="font-black text-slate-900">{module.name}</h4>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">{module.description}</p>
                  <div className="text-lg font-black text-brand-600 pt-2">{formatINR(module.price)}</div>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => { setEditingModule(module); setIsModuleModalOpen(true); }}
                    className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => deleteModule(module.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'approvals' && (
        <div className="space-y-4">
           {approvals.map(approval => (
              <div key={approval.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                 <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${approval.status === 'Pending' ? 'bg-orange-100 text-orange-600' : approval.status === 'Approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                       {approval.status === 'Pending' ? <Bell size={24} /> : approval.status === 'Approved' ? <CheckCircle size={24} /> : <XCircle size={24} />}
                    </div>
                    <div>
                       <h4 className="font-bold text-slate-900">{approval.type}</h4>
                       <p className="text-sm text-slate-600 mb-1">{approval.desc}</p>
                       <p className="text-xs text-slate-400">Requested by: {approval.requester}</p>
                    </div>
                 </div>
                 {approval.status === 'Pending' ? (
                   <div className="flex gap-2">
                      <button onClick={() => handleReject(approval.id)} className="px-4 py-2 border border-slate-200 text-slate-600 font-bold text-sm rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200">Reject</button>
                      <button onClick={() => handleApprove(approval.id)} className="px-4 py-2 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800 shadow-lg shadow-slate-200">Approve</button>
                   </div>
                 ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${approval.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                       {approval.status}
                    </span>
                 )}
              </div>
           ))}
        </div>
      )}

      {/* MODULE MODAL */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h2 className="text-lg font-black text-slate-900">{editingModule ? 'Edit Module' : 'Add New Module'}</h2>
                  <button onClick={() => setIsModuleModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2"><X size={20}/></button>
              </div>
              <form onSubmit={handleModuleSubmit} className="p-8 space-y-6">
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Module Name</label>
                      <input required name="name" defaultValue={editingModule?.name} className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. Auth System" />
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                      <textarea required name="description" defaultValue={editingModule?.description} rows={3} className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none" placeholder="What does this module include?" />
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (₹)</label>
                      <div className="relative">
                        <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input required name="price" type="number" defaultValue={editingModule?.price} className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="20000" />
                      </div>
                  </div>
                  <div className="pt-4 flex gap-3">
                       <button type="button" onClick={() => setIsModuleModalOpen(false)} className="flex-1 py-4 text-slate-500 font-black text-sm hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                       <button type="submit" className="flex-1 py-4 bg-slate-900 text-white font-black text-sm rounded-2xl hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all">Save Changes</button>
                  </div>
              </form>
           </div>
        </div>
      )}

      {/* INVITE USER MODAL */}
      {isInviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-lg font-black text-slate-900">Invite Team Member</h2>
                    <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                </div>
                <form onSubmit={handleInviteUser} className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                        <input required name="name" className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. Sara Smith" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</label>
                        <input required name="email" type="email" className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="sara@vswdata.in" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</label>
                        <select name="role" className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none appearance-none">
                            {Object.values(UserRole).map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                    <div className="pt-4 flex gap-2">
                         <button type="button" onClick={() => setIsInviteModalOpen(false)} className="flex-1 py-4 text-slate-500 font-black text-sm hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                         <button type="submit" className="flex-1 py-4 bg-slate-900 text-white font-black text-sm rounded-2xl hover:bg-slate-800 transition-all">Send Invite</button>
                    </div>
                </form>
            </div>
          </div>
      )}
    </div>
  );
};

export default Settings;
