import React from 'react';
import { UserRole, User } from '../types';
import { MOCK_USERS } from '../services/mockData';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 max-w-md w-full text-center">
        <div className="mb-8">
           <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-900 mb-2">
            AgencyOS
          </h1>
          <p className="text-slate-500">Select a role to simulate login</p>
        </div>

        <div className="space-y-3">
          {MOCK_USERS.map((user) => (
            <button
              key={user.id}
              onClick={() => onLogin(user)}
              className="w-full flex items-center p-3 border border-slate-200 rounded-xl hover:border-brand-500 hover:bg-brand-50 transition-all group text-left"
            >
              <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full mr-4" />
              <div>
                <div className="font-semibold text-slate-900 group-hover:text-brand-700">{user.name}</div>
                <div className="text-xs text-slate-500 uppercase tracking-wider">{user.role.replace('_', ' ')}</div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-400">
          Protected by Enterprise Security
        </div>
      </div>
    </div>
  );
};

export default Login;