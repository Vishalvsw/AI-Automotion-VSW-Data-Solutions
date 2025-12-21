
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ServiceType, LeadSource, LeadStatus, Lead, ActivityType, LeadPriority } from '../types';
import { CheckCircle, ChevronRight, Building, Phone, Mail, User as UserIcon, ShieldCheck, Zap, Target, IndianRupee, Share2 } from 'lucide-react';

const Onboarding: React.FC = () => {
  const { addLead } = useApp();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    source: LeadSource.WEBSITE, 
    priority: LeadPriority.WARM,
    serviceType: ServiceType.SOFTWARE,
    painPoints: '',
    timeline: 'Standard (1-3 months)',
    budget: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: formData.name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      source: formData.source,
      priority: formData.priority,
      value: Number(formData.budget) || 0,
      status: LeadStatus.NEW,
      lastContact: new Date().toISOString().split('T')[0],
      assignedTo: 'Unassigned',
      requirements: {
         serviceType: formData.serviceType,
         details: { timeline: formData.timeline },
         painPoints: formData.painPoints.split('\n').filter(p => p.trim() !== ''),
         proposedSolutions: []
      },
      activities: [{ type: ActivityType.REQUIREMENTS, date: new Date().toISOString(), note: 'Self-onboarded via Client Application Portal' }]
    };

    setTimeout(() => {
      addLead(newLead);
      setIsSubmitting(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center animate-in zoom-in duration-500">
         <div className="w-20 h-20 bg-green-100 text-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-100">
            <CheckCircle size={40} />
         </div>
         <h1 className="text-3xl font-black text-slate-900 mb-2">Application Received</h1>
         <p className="text-slate-500 font-medium mb-8">The lead has been injected into the VSW Pipeline. A BDA will be assigned shortly.</p>
         <button onClick={() => window.location.reload()} className="px-8 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all">Onboard Another</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="mb-10 text-center">
         <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 text-brand-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            <ShieldCheck size={14} /> VSW Secure Onboarding
         </div>
         <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Client Application Portal</h1>
         <p className="text-slate-500 mt-2 font-medium">Capture requirements and initiate the 4-Day closing protocol.</p>
      </div>

      <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden">
         <div className="flex border-b border-slate-100">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex-1 py-4 text-center text-[10px] font-black uppercase tracking-widest transition-all ${step === s ? 'text-brand-600 bg-brand-50/50' : 'text-slate-300'}`}>
                Step 0{s} {s === 1 ? 'Identity' : s === 2 ? 'Intelligence' : 'Review'}
              </div>
            ))}
         </div>

         <form onSubmit={handleSubmit} className="p-12">
            {step === 1 && (
               <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Company / Institution</label>
                        <div className="relative">
                           <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                           <input required name="company" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Enter Legal Entity Name" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Contact Person</label>
                        <div className="relative">
                           <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                           <input required name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Full Name" />
                        </div>
                     </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">WhatsApp Primary</label>
                        <div className="relative">
                           <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                           <input required name="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="+91" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Official Email</label>
                        <div className="relative">
                           <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                           <input required type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="client@domain.com" />
                        </div>
                     </div>
                  </div>
                  <button type="button" onClick={() => setStep(2)} className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                     Next: Service Intelligence <ChevronRight size={18} />
                  </button>
               </div>
            )}

            {step === 2 && (
               <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Interested Service</label>
                        <select name="serviceType" value={formData.serviceType} onChange={handleInputChange} className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none appearance-none cursor-pointer">
                           {Object.values(ServiceType).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Acquisition Source</label>
                        <div className="relative">
                           <Share2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                           <select name="source" value={formData.source} onChange={handleInputChange} className="w-full pl-11 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none appearance-none cursor-pointer">
                              {Object.values(LeadSource).map(s => <option key={s} value={s}>{s}</option>)}
                           </select>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Project Priority</label>
                        <select name="priority" value={formData.priority} onChange={handleInputChange} className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none appearance-none cursor-pointer">
                           <option value={LeadPriority.HOT}>🔥 Hot / Urgent</option>
                           <option value={LeadPriority.WARM}>☀️ Warm / Standard</option>
                           <option value={LeadPriority.COLD}>❄️ Cold / Discovery</option>
                        </select>
                     </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Target Timeline</label>
                        <select name="timeline" value={formData.timeline} onChange={handleInputChange} className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none appearance-none cursor-pointer">
                           <option>Urgent ({'<'} 1 month)</option>
                           <option>Standard (1-3 months)</option>
                           <option>Long-term (6 months +)</option>
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Est. Budget (₹)</label>
                        <div className="relative">
                            <IndianRupee size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                            <input name="budget" value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} type="number" className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="20000" />
                        </div>
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Core Objectives & Pain Points</label>
                     <textarea name="painPoints" value={formData.painPoints} onChange={handleInputChange} rows={4} className="w-full px-6 py-4 bg-slate-50 border-none rounded-3xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Describe the current bottleneck..."></textarea>
                  </div>
                  <div className="flex gap-4">
                     <button type="button" onClick={() => setStep(1)} className="flex-1 py-5 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all">Previous</button>
                     <button type="button" onClick={() => setStep(3)} className="flex-[2] py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all">Review Application</button>
                  </div>
               </div>
            )}

            {step === 3 && (
               <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                  <div className="p-8 bg-brand-50 rounded-[32px] border border-brand-100">
                     <h3 className="text-sm font-black text-brand-800 uppercase tracking-widest mb-6 border-b border-brand-200 pb-2">Technical Summary Review</h3>
                     <div className="grid grid-cols-2 gap-y-4 text-sm">
                        <div className="text-slate-400 font-bold uppercase text-[10px]">Company Node</div>
                        <div className="font-black text-slate-900">{formData.company}</div>
                        <div className="text-slate-400 font-bold uppercase text-[10px]">Direct Representative</div>
                        <div className="font-black text-slate-900">{formData.name}</div>
                        <div className="text-slate-400 font-bold uppercase text-[10px]">Sales Priority</div>
                        <div className="font-black text-slate-900 flex items-center gap-2">
                           {formData.priority === LeadPriority.HOT ? '🔥' : formData.priority === LeadPriority.WARM ? '☀️' : '❄️'} {formData.priority}
                        </div>
                        <div className="text-slate-400 font-bold uppercase text-[10px]">Architecture Service</div>
                        <div className="font-black text-slate-900">{formData.serviceType}</div>
                        <div className="text-slate-400 font-bold uppercase text-[10px]">Acquisition Origin</div>
                        <div className="font-black text-slate-900">{formData.source}</div>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <button type="button" onClick={() => setStep(2)} className="flex-1 py-5 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all">Edit Intelligence</button>
                     <button type="submit" disabled={isSubmitting} className="flex-[2] py-5 bg-brand-600 text-white font-black rounded-2xl shadow-xl shadow-brand-100 hover:bg-brand-700 transition-all flex items-center justify-center gap-2">
                        {isSubmitting ? 'Infecting Pipeline...' : 'Deploy Application'}
                     </button>
                  </div>
               </div>
            )}
         </form>
      </div>
    </div>
  );
};

export default Onboarding;
