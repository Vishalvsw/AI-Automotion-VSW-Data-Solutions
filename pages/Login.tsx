
import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { MOCK_USERS } from '../services/mockData';
import { Smartphone, ArrowRight, ShieldCheck, User as UserIcon, Mail, Loader2, Briefcase, Zap } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

type LoginStep = 'PHONE' | 'OTP' | 'SIGNUP';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [step, setStep] = useState<LoginStep>('PHONE');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Signup State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      setError('Enter valid 10-digit number');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('OTP');
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (otp !== '1234') {
        setError('Use OTP 1234');
        return;
      }
      const existingUser = MOCK_USERS.find(u => u.phoneNumber === phoneNumber);
      if (existingUser) onLogin(existingUser);
      else setStep('SIGNUP');
    }, 800);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const newUser: User = {
        id: `new-${Date.now()}`,
        name: fullName,
        email: email,
        phoneNumber: phoneNumber,
        role: UserRole.BDA, 
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`,
        commissionRate: 8
      };
      onLogin(newUser);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="mb-10 w-full max-w-sm">
         <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xl flex gap-2">
            <button 
              onClick={() => onLogin(MOCK_USERS.find(u => u.role === UserRole.FOUNDER)!)}
              className="flex-1 flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group"
            >
               <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                  <ShieldCheck size={20} />
               </div>
               <span className="text-xs font-bold text-slate-700">Founder Entry</span>
            </button>
            <div className="w-[1px] bg-slate-100 my-4"></div>
            <button 
              onClick={() => onLogin(MOCK_USERS.find(u => u.role === UserRole.BDA)!)}
              className="flex-1 flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group"
            >
               <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                  <Briefcase size={20} />
               </div>
               <span className="text-xs font-bold text-slate-700">BDA Entry</span>
            </button>
         </div>
         <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">System Identity Select</p>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 max-w-sm w-full text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 to-brand-800"></div>
        
        <div className="mb-8">
           <div className="w-12 h-12 bg-brand-600 rounded-2xl mx-auto flex items-center justify-center text-white font-black text-xl shadow-lg shadow-brand-200 mb-4">
            V
           </div>
           <h1 className="text-2xl font-black text-slate-900 tracking-tight">VSW AgencyOS</h1>
           <p className="text-sm text-slate-500 mt-1 font-medium">Enterprise Sales & Data Hub</p>
        </div>

        {step === 'PHONE' && (
          <form onSubmit={handleSendOtp} className="text-left space-y-5">
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 ml-1">Work Mobile</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold pr-2 border-r border-slate-100">+91</div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full pl-16 pr-4 py-3.5 border border-slate-200 rounded-2xl bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                  placeholder="9876543210"
                />
              </div>
            </div>
            {error && <div className="text-red-500 text-[11px] font-bold text-center">{error}</div>}
            <button type="submit" disabled={isLoading} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200">
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>Continue <ArrowRight size={18} /></>}
            </button>
          </form>
        )}

        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="text-left space-y-5">
            <div>
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2 ml-1">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 4))}
                className="w-full text-center py-4 border border-slate-200 rounded-2xl bg-slate-50 text-slate-900 text-3xl font-black tracking-[0.4em] focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="••••"
              />
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-brand-600 text-white font-bold py-4 rounded-2xl hover:bg-brand-700 transition-all flex items-center justify-center gap-2">
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>Verify Identity <ShieldCheck size={18} /></>}
            </button>
            <p className="text-[10px] text-center text-slate-400 font-bold">DEFAULT OTP: 1234</p>
          </form>
        )}

        <div className="mt-10 pt-6 border-t border-slate-50 text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">
          Secured by VSW Enterprise Node
        </div>
      </div>
    </div>
  );
};

export default Login;
