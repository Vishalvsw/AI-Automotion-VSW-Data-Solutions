
import React, { useState, useRef, useEffect } from 'react';
import { UserRole, User } from '../types';
import { MOCK_USERS } from '../services/mockData';
import { Smartphone, ArrowRight, ShieldCheck, User as UserIcon, Mail, Loader2, Briefcase, Zap, IndianRupee, ChevronLeft, CheckCircle2, Shield, Coins, Users as UsersIcon } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

type LoginStep = 'PHONE' | 'OTP' | 'SIGNUP';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [step, setStep] = useState<LoginStep>('PHONE');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Signup State for BDA Candidates
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      setError('Enter valid 10-digit number');
      return;
    }
    setError('');
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      setStep('OTP');
    }, 1200);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullOtp = otp.join('');
    
    if (fullOtp.length < 4) return;
    
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      setIsLoading(false);
      if (fullOtp !== '1234') {
        setError('Invalid Verification Code (Use 1234)');
        return;
      }

      const existingUser = MOCK_USERS.find(u => u.phoneNumber === phoneNumber);
      if (existingUser) {
        onLogin(existingUser);
      } else {
        setStep('SIGNUP');
      }
    }, 1500);
  };

  // Quick Access Helper
  const handleQuickLogin = (num: string) => {
    setPhoneNumber(num);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('OTP');
      // Autofill OTP for quick demo access
      setOtp(['1', '2', '3', '4']);
    }, 800);
  };

  // Auto-verify when all digits are filled
  useEffect(() => {
    if (otp.every(digit => digit !== '') && step === 'OTP') {
      handleVerifyOtp();
    }
  }, [otp]);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      setError('Please complete all fields');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      const newUser: User = {
        id: `bda-cand-${Date.now()}`,
        name: fullName,
        email: email,
        phoneNumber: phoneNumber,
        role: UserRole.BDA, // Force BDA role for mobile candidates
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`,
        commissionRate: 8
      };
      onLogin(newUser);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100 max-w-sm w-full text-center relative overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-600 to-slate-900"></div>
        
        {/* Step-specific Back Buttons */}
        {step !== 'PHONE' && !isLoading && (
          <button 
            onClick={() => { setStep('PHONE'); setError(''); setOtp(['','','','']); }}
            className="absolute top-8 left-8 p-2 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        <div className="mb-10">
           <div className="w-16 h-16 bg-slate-900 rounded-[24px] mx-auto flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-slate-200 mb-6 group-hover:rotate-12 transition-transform">
            V
           </div>
           <h1 className="text-2xl font-black text-slate-900 tracking-tight">AgencyOS</h1>
           <p className="text-sm text-slate-500 mt-1 font-bold uppercase tracking-widest text-[10px]">Strategic Node Login</p>
        </div>

        {step === 'PHONE' && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <form onSubmit={handleSendOtp} className="text-left space-y-6">
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Work Mobile Network</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black pr-3 border-r-2 border-slate-100 text-sm">
                    +91
                  </div>
                  <input
                    type="tel"
                    autoFocus
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full pl-20 pr-6 py-5 border-2 border-slate-50 rounded-[24px] bg-slate-50 text-slate-900 font-black text-lg focus:bg-white focus:border-brand-500 outline-none transition-all shadow-inner"
                    placeholder="9876543210"
                  />
                </div>
              </div>
              {error && <div className="text-red-500 text-[11px] font-black text-center animate-bounce">{error}</div>}
              <button type="submit" disabled={isLoading} className="w-full bg-slate-900 text-white font-black py-5 rounded-[24px] hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-slate-200 disabled:opacity-50">
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>Generate OTP <ArrowRight size={18} /></>}
              </button>
            </form>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-slate-100"></div>
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Identity Pulse</span>
                <div className="h-px flex-1 bg-slate-100"></div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => handleQuickLogin('9876543210')}
                  className="flex flex-col items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-brand-50 hover:border-brand-200 transition-all group"
                >
                  <Shield size={20} className="text-brand-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[8px] font-black text-slate-400 uppercase">Admin</span>
                </button>
                <button 
                  onClick={() => handleQuickLogin('9876543217')}
                  className="flex flex-col items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-green-50 hover:border-green-200 transition-all group"
                >
                  <Coins size={20} className="text-green-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[8px] font-black text-slate-400 uppercase">Finance</span>
                </button>
                <button 
                  onClick={() => handleQuickLogin('9876543212')}
                  className="flex flex-col items-center gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-blue-50 hover:border-blue-200 transition-all group"
                >
                  <UsersIcon size={20} className="text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="text-[8px] font-black text-slate-400 uppercase">BDA</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="text-left space-y-8">
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Verification Artifact Sent</label>
                <div className="flex gap-4 justify-center">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={otpRefs[idx]}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-14 h-18 text-center bg-slate-50 border-2 border-slate-100 rounded-2xl text-2xl font-black focus:border-brand-600 focus:bg-white outline-none transition-all"
                    />
                  ))}
                </div>
              </div>
            </div>
            {error && <div className="text-red-500 text-[11px] font-black text-center">{error}</div>}
            
            <div className="text-center">
              {isLoading ? (
                <div className="flex flex-col items-center gap-3">
                   <Loader2 className="animate-spin text-brand-600" size={32} />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Validating Crypt Node...</span>
                </div>
              ) : (
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Default Dev Code: <span className="text-brand-600">1234</span></p>
              )}
            </div>
          </form>
        )}

        {step === 'SIGNUP' && (
          <form onSubmit={handleSignup} className="text-left space-y-6">
            <div className="bg-brand-50 p-6 rounded-[28px] border border-brand-100 mb-4 text-center">
               <div className="w-12 h-12 bg-white rounded-full mx-auto mb-3 flex items-center justify-center shadow-sm">
                  <Briefcase size={20} className="text-brand-600" />
               </div>
               <h3 className="text-sm font-black text-slate-900 uppercase">BDA Candidate Node</h3>
               <p className="text-[10px] font-bold text-brand-600 uppercase tracking-widest mt-1">Identity Protocol Initiation</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    required
                    autoFocus
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none shadow-inner"
                    placeholder="Candidate Name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Communications</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none shadow-inner"
                    placeholder="name@agency.com"
                  />
                </div>
              </div>
            </div>

            {error && <div className="text-red-500 text-[11px] font-black text-center">{error}</div>}

            <button type="submit" disabled={isLoading} className="w-full bg-brand-600 text-white font-black py-5 rounded-[24px] hover:bg-brand-700 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-brand-100 disabled:opacity-50">
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>Initialize Profile <CheckCircle2 size={18} /></>}
            </button>
          </form>
        )}

        <div className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-center gap-2">
          <ShieldCheck size={12} className="text-brand-600" />
          <span className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em]">VSW Encrypted Protocol</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
