
import React, { useState, useRef, useEffect } from 'react';
import { UserRole, User, CandidateStatus } from '../types';
import { useApp } from '../context/AppContext';
import { Smartphone, ArrowRight, ShieldCheck, User as UserIcon, Mail, Loader2, Briefcase, Zap, ChevronLeft, Shield, Coins, Users as UsersIcon, PlusCircle, Building2, CheckCircle2 } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

type AuthMode = 'LOGIN' | 'APPLY';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { loginUser, addCandidate } = useApp();
  const [mode, setMode] = useState<AuthMode>('LOGIN');
  const [step, setStep] = useState<'INPUT' | 'OTP'>('INPUT');
  
  // Login State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  
  // Application State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // --- Handlers ---

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      setError('Enter valid 10-digit number');
      return;
    }
    setError('');
    setIsLoading(true);
    // Simulate Network
    setTimeout(() => {
      setIsLoading(false);
      setStep('OTP');
    }, 1000);
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (otp.join('').length < 4) return;
    
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      if (otp.join('') !== '1234') {
        setError('Invalid Code (Try 1234)');
        return;
      }

      if (mode === 'LOGIN') {
        const user = loginUser(phoneNumber);
        if (user) {
          onLogin(user);
        } else {
          setError('Node Identity Not Found. Please apply first.');
          setStep('INPUT'); // Reset to input to let them switch to apply
        }
      } else {
        // APPLICATION MODE SUBMIT
        const newUser: User = {
          id: `cand-${Date.now()}`,
          name: fullName,
          email: email,
          phoneNumber: phoneNumber,
          role: UserRole.BDA_CANDIDATE,
          candidateStatus: CandidateStatus.PENDING,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`,
          appliedDate: new Date().toISOString()
        };
        addCandidate(newUser);
        setApplySuccess(true);
      }
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 3) otpRefs[index + 1].current?.focus();
    if (index === 3 && value) handleVerifyOtp(); // Auto submit on last digit
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs[index - 1].current?.focus();
  };

  // Quick Login for Demo
  const quickLogin = (phone: string) => {
    setPhoneNumber(phone);
    setMode('LOGIN');
    setStep('OTP');
    setOtp(['1','2','3','4']);
    // Trigger login in next tick
    setTimeout(() => {
      const user = loginUser(phone);
      if (user) onLogin(user);
    }, 500);
  };

  if (applySuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100 max-w-sm w-full text-center animate-in zoom-in duration-500">
           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-xl shadow-green-50">
             <CheckCircle2 size={40} />
           </div>
           <h2 className="text-2xl font-black text-slate-900 mb-2">Application Transmitted</h2>
           <p className="text-sm text-slate-500 font-medium mb-8">Your credentials have been securely routed to the VSW HR Command Node.</p>
           <div className="bg-slate-50 p-4 rounded-2xl mb-8 border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Next Protocol</p>
              <p className="text-xs font-bold text-slate-700 mt-1">Wait for HR Authorization before logging in.</p>
           </div>
           <button onClick={() => { setApplySuccess(false); setMode('LOGIN'); setStep('INPUT'); setPhoneNumber(''); setOtp(['','','','']); }} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl uppercase text-xs tracking-widest hover:bg-slate-800 transition-all">Return to Terminal</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl p-2 rounded-[32px] border border-white shadow-xl mb-8 flex gap-1 relative z-10">
         <button onClick={() => { setMode('LOGIN'); setStep('INPUT'); setError(''); }} className={`px-8 py-3 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all ${mode === 'LOGIN' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Access Terminal</button>
         <button onClick={() => { setMode('APPLY'); setStep('INPUT'); setError(''); }} className={`px-8 py-3 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all ${mode === 'APPLY' ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Recruitment</button>
      </div>

      <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-white max-w-sm w-full text-center relative overflow-hidden animate-in fade-in zoom-in duration-500 z-10">
        
        {step === 'OTP' && (
          <button onClick={() => setStep('INPUT')} className="absolute top-8 left-8 text-slate-300 hover:text-slate-900 transition-colors"><ChevronLeft size={24} /></button>
        )}

        <div className="mb-8">
           <div className={`w-16 h-16 rounded-[24px] mx-auto flex items-center justify-center text-white font-black text-2xl shadow-2xl mb-6 transition-all duration-500 ${mode === 'LOGIN' ? 'bg-slate-900 rotate-0' : 'bg-brand-600 rotate-12'}`}>
            {mode === 'LOGIN' ? 'V' : <Briefcase size={28} />}
           </div>
           <h1 className="text-2xl font-black text-slate-900 tracking-tight">VSW Enterprise</h1>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2">
             {mode === 'LOGIN' ? 'Authorized Personnel Only' : 'Career Node Application'}
           </p>
        </div>

        {step === 'INPUT' ? (
          <form onSubmit={handleSendOtp} className="space-y-5 text-left">
             {mode === 'APPLY' && (
               <>
                 <div className="space-y-2 animate-in slide-in-from-bottom-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                    <div className="relative">
                       <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                       <input required value={fullName} onChange={e => setFullName(e.target.value)} className="w-full pl-10 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="John Doe" />
                    </div>
                 </div>
                 <div className="space-y-2 animate-in slide-in-from-bottom-4">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Email</label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                       <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="email@domain.com" />
                    </div>
                 </div>
               </>
             )}

             <div className="space-y-2 animate-in slide-in-from-bottom-6">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Uplink</label>
                <div className="relative">
                   <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                   <input autoFocus required type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))} className="w-full pl-10 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="9876543210" />
                </div>
             </div>

             {error && <div className="text-red-500 text-[10px] font-black text-center pt-2 animate-bounce">{error}</div>}

             <button type="submit" disabled={isLoading} className={`w-full py-5 text-white font-black rounded-[24px] flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] ${mode === 'LOGIN' ? 'bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-200' : 'bg-brand-600 hover:bg-brand-700 shadow-xl shadow-brand-200'}`}>
                {isLoading ? <Loader2 className="animate-spin" size={18} /> : (mode === 'LOGIN' ? 'Authenticate Node' : 'Submit Application')} <ArrowRight size={18} />
             </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-8 animate-in zoom-in-95">
             <div className="space-y-4">
                <p className="text-xs font-bold text-slate-500">Enter the secure artifact sent to <br/><span className="text-slate-900 font-black">+91 {phoneNumber}</span></p>
                <div className="flex justify-center gap-3">
                   {otp.map((digit, i) => (
                      <input key={i} ref={otpRefs[i]} type="text" maxLength={1} value={digit} onChange={e => handleOtpChange(i, e.target.value)} onKeyDown={e => handleKeyDown(i, e)} className="w-14 h-16 text-center text-2xl font-black bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-brand-500 focus:bg-white outline-none transition-all" />
                   ))}
                </div>
             </div>
             {error && <div className="text-red-500 text-[10px] font-black text-center animate-bounce">{error}</div>}
             <div className="text-center">
               {isLoading ? <Loader2 className="animate-spin text-brand-600 mx-auto" size={24} /> : <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Dev Protocol: 1234</p>}
             </div>
          </form>
        )}

        {/* Quick Links Only in Login Mode */}
        {mode === 'LOGIN' && step === 'INPUT' && (
           <div className="mt-8 pt-8 border-t border-slate-50">
              <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-4">Fast Track Access</div>
              <div className="flex justify-center gap-4">
                 <button onClick={() => quickLogin('9876543210')} className="flex flex-col items-center gap-1 group"><div className="p-3 bg-slate-50 rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-all text-slate-400"><Shield size={16} /></div><span className="text-[8px] font-bold text-slate-400">Admin</span></button>
                 <button onClick={() => quickLogin('9876543217')} className="flex flex-col items-center gap-1 group"><div className="p-3 bg-slate-50 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-all text-slate-400"><Coins size={16} /></div><span className="text-[8px] font-bold text-slate-400">Finance</span></button>
                 <button onClick={() => quickLogin('9876543212')} className="flex flex-col items-center gap-1 group"><div className="p-3 bg-slate-50 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all text-slate-400"><UsersIcon size={16} /></div><span className="text-[8px] font-bold text-slate-400">BDA</span></button>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default Login;
