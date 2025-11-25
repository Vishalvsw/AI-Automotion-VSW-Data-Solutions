
import React, { useState } from 'react';
import { MOCK_USERS } from '../services/mockData';
import { UserRole } from '../types';
import { Shield, User as UserIcon, CheckSquare, Bell, Lock, UserPlus } from 'lucide-react';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');
  
  // In a real app, this comes from context/auth. 
  // We'll simulate checking the current user from localStorage or just assume role based on MOCK_USERS usage elsewhere
  // For UI logic here, let's assume we are viewing as the logged in user.
  // Note: Since this is a view component, we'll check permission visually for the demo.
  // We'll simulate that we are looking at this AS an HR Manager for demonstration if we want to show controls,
  // or hide them if not. 
  // IMPORTANT: To make this robust, passing `currentUser` prop to Settings would be better, but for now we'll 
  // add a visual toggle or just show the restriction message if you aren't HR.
  
  // Let's assume for this specific view we need to know who is looking. 
  // I will add a helper to simulate 'Am I HR?'. 
  // For the purpose of the prototype, I'll allow viewing but disable buttons if not HR.
  // We can grab the user from localStorage if we stored it in Login, but let's just add a disclaimer UI.
  
  const isHRManager = (userRole?: UserRole) => userRole === UserRole.HR_MANAGER;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings & Admin</h1>
        <p className="text-slate-500">Manage users, roles, and system approvals.</p>
      </div>

      <div className="flex border-b border-slate-200 space-x-6">
        <button 
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'users' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          User Access
        </button>
        <button 
          onClick={() => setActiveTab('approvals')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'approvals' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Pending Approvals
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
             <Lock className="text-blue-600 mt-0.5" size={18} />
             <div>
               <h4 className="font-semibold text-blue-900 text-sm">Role Management Restricted</h4>
               <p className="text-xs text-blue-700 mt-1">
                 Only <strong>HR Managers</strong> can invite new users, remove members, or change role assignments. 
                 All other users have read-only access to the team list.
               </p>
             </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-semibold text-slate-700">Team Members</h3>
              {/* Only show Invite button visually, usually disabled if not HR */}
              <button className="flex items-center gap-2 px-3 py-1.5 bg-brand-600 text-white text-xs font-bold rounded hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <UserPlus size={14} />
                Invite User
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {MOCK_USERS.map(user => (
                <div key={user.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                    <div>
                      <div className="font-medium text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-2">
                        {user.email}
                        <span className="text-slate-300">•</span>
                        {user.phoneNumber || 'No phone'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                       <span className="text-xs font-bold uppercase text-slate-500 mb-1">Role</span>
                       {/* This select should be disabled for non-HR */}
                       <select 
                         className="text-sm border border-slate-200 rounded px-2 py-1 text-slate-600 bg-white focus:ring-2 focus:ring-brand-500 outline-none" 
                         defaultValue={user.role}
                       >
                        <option value="ADMIN">Admin</option>
                        <option value="PROJECT_MANAGER">Manager</option>
                        <option value="BDA">Sales (BDA)</option>
                        <option value="DEVELOPER">Developer</option>
                        <option value="CLIENT">Client</option>
                        <option value="HR_MANAGER">HR Manager</option>
                      </select>
                    </div>
                    {/* Remove button */}
                    <button className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded">
                      <Shield size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'approvals' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="p-6 text-center">
             <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
               <CheckSquare size={24} />
             </div>
             <h3 className="text-lg font-medium text-slate-900">No Pending Approvals</h3>
             <p className="text-slate-500">All invoices and project milestones have been processed.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
