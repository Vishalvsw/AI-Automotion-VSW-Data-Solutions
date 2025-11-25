
import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { MOCK_USERS } from '../services/mockData';
import { Smartphone, ArrowRight, ShieldCheck, User as UserIcon, Mail, Phone, Loader2 } from 'lucide-react';

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
    setError('');
    
    // Basic validation
    if (phoneNumber.length < 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep('OTP');
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      // Mock OTP Check
      if (otp !== '1234') {
        setError('Invalid OTP. Please enter 1234');
        return;
      }

      // Check if user exists in MOCK_USERS
      const existingUser = MOCK_USERS.find(u => u.phoneNumber === phoneNumber);

      if (existingUser) {
        onLogin(existingUser);
      } else {
        // User does not exist, go to signup
        setStep('SIGNUP');
      }
    }, 1000);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      setError('Please fill in all details');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Create new user
      const newUser: User = {
        id: `new-${Date.now()}`,
        name: fullName,
        email: email,
        phoneNumber: phoneNumber,
        role: UserRole.BDA, // Default role as requested
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`,
        commissionRate: 8 // Default commission for BDA
      };

      // In a real app, we would POST to backend here.
      // For now, we just log them in directly.
      onLogin(newUser);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 max-w-md w-full text-center">
        <div className="mb-6">
           <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-900 mb-2">
            AgencyOS
          </h1>
          <p className="text-slate-500">
            {step === 'PHONE' && 'Login to access your dashboard'}
            {step === 'OTP' && 'Verify your mobile number'}
            {step === 'SIGNUP' && 'Complete your profile'}
          </p>
        </div>

        {/* STEP 1: PHONE NUMBER */}
        {step === 'PHONE' && (
          <form onSubmit={handleSendOtp} className="text-left space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium pr-2 border-r border-slate-200">
                  +91
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full pl-14 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                  placeholder="98765 43210"
                  autoFocus
                />
              </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  Get OTP <ArrowRight size={18} />
                </>
              )}
            </button>
            <div className="text-xs text-center text-slate-400 mt-4">
              Try with <span className="font-mono bg-slate-100 px-1 rounded">9876543212</span> for Demo BDA
            </div>
          </form>
        )}

        {/* STEP 2: OTP */}
        {step === 'OTP' && (
          <form onSubmit={handleVerifyOtp} className="text-left space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                One Time Password
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 4))}
                className="w-full text-center py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 text-2xl font-bold tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
                placeholder="••••"
                autoFocus
              />
              <div className="flex justify-between mt-2">
                <button type="button" onClick={() => setStep('PHONE')} className="text-xs text-slate-500 hover:text-slate-800">
                  Change Number
                </button>
                <span className="text-xs text-brand-600 font-medium cursor-pointer">Resend OTP</span>
              </div>
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  Verify & Login <ShieldCheck size={18} />
                </>
              )}
            </button>
            <div className="text-xs text-center text-slate-400 mt-4">
              Use OTP <span className="font-mono bg-slate-100 px-1 rounded">1234</span>
            </div>
          </form>
        )}

        {/* STEP 3: SIGNUP DETAILS */}
        {step === 'SIGNUP' && (
          <form onSubmit={handleSignup} className="text-left space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
              <p className="text-sm text-blue-800">
                New number detected! Please create your profile.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g. Rahul Sharma"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="rahul@example.com"
                />
              </div>
            </div>

            <div className="pt-2">
               <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                 <Smartphone className="text-slate-400" size={16} />
                 <span className="text-sm text-slate-600 font-mono">+91 {phoneNumber}</span>
               </div>
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  Complete Signup <ArrowRight size={18} />
                </>
              )}
            </button>
            <p className="text-xs text-center text-slate-400">
               By signing up, you agree to join as a <span className="font-bold text-slate-600">BDA</span>.
               <br/>Role changes require HR approval.
            </p>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-slate-400">
          Protected by VSW Enterprise Security
        </div>
      </div>
    </div>
  );
};

export default Login;
