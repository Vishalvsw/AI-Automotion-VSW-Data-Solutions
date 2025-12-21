
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LeadStatus, LeadPriority, ActivityType, LeadSource, UserRole, User } from '../types';
import { 
  ArrowLeft, Building, Phone, Mail, Globe, Calendar, 
  IndianRupee, Zap, Target, ShieldCheck, Sparkles, 
  MessageSquare, Linkedin, Send, Trash2, Edit3, 
  CheckCircle, Clock, AlertTriangle, User as UserIcon,
  ChevronRight, Copy, Loader2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface LeadProfileProps {
  user: User;
}

const LeadProfile: React.FC<LeadProfileProps> = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leads, updateLead, deleteLead, modules } = useApp();
  const isAdmin = user.role === UserRole.FOUNDER;

  const lead = leads.find(l => l.id === id);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [outreachType, setOutreachType] = useState<'whatsapp' | 'email' | 'linkedin'>('whatsapp');
  const [generatedScript, setGeneratedScript] = useState('');

  if (!lead) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 opacity-50">
        <Target size={48} className="mb-4" />
        <p className="text-sm font-black uppercase tracking-widest text-slate-400">Node Not Found in Infrastructure</p>
        <Link to="/leads" className="mt-4 text-brand-600 font-bold hover:underline">Return to Cockpit</Link>
      </div>
    );
  }

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(amount);
  };

  const generateOutreach = async () => {
    setIsGenerating(true);
    setGeneratedScript('');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Lead Name: ${lead.name}
        Company: ${lead.company}
        Service: ${lead.requirements?.serviceType || 'Technology'}
        Priority: ${lead.priority}
        
        Task: Draft a high-conversion ${outreachType} message. 
        Tone: Professional, bold, and strategic.
        Format: ${outreachType === 'whatsapp' ? 'Short, punchy with emojis' : 'Structured with a clear CTA'}
        Constraint: Under 120 words.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "You are the head of growth at VSW Enterprise. You craft bespoke outreach that feels personal and high-value.",
          temperature: 0.7,
        }
      });

      setGeneratedScript(response.text || "Failed to generate script.");
    } catch (err) {
      setGeneratedScript("Intelligence layer timeout. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateStatus = (newStatus: LeadStatus) => {
    updateLead(lead.id, { status: newStatus });
  };

  const isOverdue = lead.nextFollowUp && new Date(lead.nextFollowUp) < new Date();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-all group"
        >
          <div className="p-2 bg-white rounded-xl border border-slate-200 group-hover:shadow-md transition-all">
            <ArrowLeft size={16} />
          </div>
          Return to Cockpit
        </button>
        <div className="flex gap-3">
          <button className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-brand-600 hover:shadow-md transition-all"><Edit3 size={20}/></button>
          {isAdmin && (
            <button onClick={() => { if(confirm('Purge node?')) { deleteLead(lead.id); navigate('/leads'); } }} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-red-600 hover:shadow-md transition-all"><Trash2 size={20}/></button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
                <Target size={120} />
             </div>
             <div className="relative z-10 flex flex-col items-center text-center">
                <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center text-4xl font-black mb-6 shadow-2xl ${
                  lead.priority === LeadPriority.HOT ? 'bg-red-50 text-red-600 border border-red-100 ring-4 ring-red-50' : 
                  lead.priority === LeadPriority.WARM ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                  'bg-slate-50 text-slate-400 border border-slate-100'
                }`}>
                  {lead.company.charAt(0)}
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">{lead.company}</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 mb-6">{lead.name}</p>
                
                <div className="flex flex-wrap justify-center gap-2">
                   <span className="px-3 py-1.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-slate-200">{lead.status}</span>
                   <span className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl border ${
                     lead.priority === LeadPriority.HOT ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-400 border-slate-200'
                   }`}>{lead.priority} PRIORITY</span>
                </div>
             </div>

             <div className="mt-10 space-y-4 relative z-10 pt-8 border-t border-slate-50">
                <div className="flex items-center gap-4 group">
                   <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-brand-600 transition-colors"><Mail size={18} /></div>
                   <div className="flex-1 min-w-0">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Official Email</div>
                      <div className="text-sm font-bold text-slate-900 truncate">{lead.email}</div>
                   </div>
                </div>
                <div className="flex items-center gap-4 group">
                   <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-green-600 transition-colors"><Phone size={18} /></div>
                   <div className="flex-1 min-w-0">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">WhatsApp Line</div>
                      <div className="text-sm font-bold text-slate-900 truncate">{lead.phone}</div>
                   </div>
                </div>
                <div className="flex items-center gap-4 group">
                   <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-amber-600 transition-colors"><Globe size={18} /></div>
                   <div className="flex-1 min-w-0">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Acquisition Origin</div>
                      <div className="text-sm font-bold text-slate-900 truncate">{lead.source}</div>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-125 transition-transform duration-700">
                <IndianRupee size={80} />
             </div>
             <div className="relative z-10">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Strategic Valuation</div>
                <div className="text-4xl font-black">{formatINR(lead.value)}</div>
                <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10">
                   <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-black text-brand-400 uppercase tracking-widest">Potential ROI</span>
                      <span className="text-[10px] font-black text-green-400">High Growth</span>
                   </div>
                   <p className="text-[11px] font-bold text-slate-300 leading-relaxed">This node represents a primary growth opportunity for VSW Enterprise in the {lead.requirements?.serviceType} sector.</p>
                </div>
             </div>
          </div>
        </div>

        {/* Action Center */}
        <div className="lg:col-span-2 space-y-8">
           {/* Overdue Warning */}
           {isOverdue && (
             <div className="bg-red-50 border-2 border-red-200 p-6 rounded-[32px] flex items-center justify-between shadow-xl shadow-red-100 animate-pulse">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-200">
                      <AlertTriangle size={24} />
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-red-700 uppercase tracking-tight">Immediate Intervention Required</h3>
                      <p className="text-xs text-red-600 font-bold opacity-80 uppercase tracking-widest">Follow-up was scheduled for {lead.nextFollowUp}</p>
                   </div>
                </div>
                <button className="px-6 py-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-700 transition-all shadow-xl shadow-red-200">Execute Contact</button>
             </div>
           )}

           {/* Intelligence Section */}
           <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                    <Sparkles size={24} className="text-brand-600" />
                    AI Outreach Strategist
                 </h3>
                 <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                    <button onClick={() => setOutreachType('whatsapp')} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${outreachType === 'whatsapp' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>WhatsApp</button>
                    <button onClick={() => setOutreachType('email')} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${outreachType === 'email' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Email</button>
                 </div>
              </div>

              <div className="space-y-6">
                 {!generatedScript ? (
                   <button 
                    onClick={generateOutreach}
                    disabled={isGenerating}
                    className="w-full py-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center gap-4 hover:bg-brand-50 hover:border-brand-200 transition-all group"
                   >
                      {isGenerating ? (
                        <>
                          <Loader2 className="animate-spin text-brand-600" size={32} />
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Synthesizing Tactical Pitch...</p>
                        </>
                      ) : (
                        <>
                          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                             <Zap size={24} className="text-brand-500" />
                          </div>
                          <div className="text-center">
                             <p className="text-sm font-black text-slate-900 uppercase">Initialize Intelligence Layer</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Generate personalized high-conversion {outreachType} copy</p>
                          </div>
                        </>
                      )}
                   </button>
                 ) : (
                   <div className="relative group">
                      <div className="w-full p-8 bg-slate-50 border-2 border-slate-100 rounded-[32px] text-slate-800 text-sm font-semibold leading-relaxed animate-in zoom-in duration-300">
                         {generatedScript}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button onClick={() => { navigator.clipboard.writeText(generatedScript); alert('Copied!'); }} className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"><Copy size={14}/> Copy Strategy</button>
                        <button onClick={generateOutreach} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"><Zap size={14}/> Regenerate</button>
                      </div>
                   </div>
                 )}
              </div>
           </div>

           {/* Follow-up Management */}
           <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-3 mb-8">
                 <Calendar size={24} className="text-amber-500" />
                 Tactical Timeline
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Next Engagement Window</label>
                    <input 
                      type="date" 
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                      defaultValue={lead.nextFollowUp}
                      onChange={(e) => updateLead(lead.id, { nextFollowUp: e.target.value })}
                    />
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Engagement Agent</label>
                    <div className="px-6 py-4 bg-slate-50 border-none rounded-2xl font-black text-sm flex items-center gap-3">
                       <div className="w-6 h-6 bg-brand-600 rounded-lg flex items-center justify-center text-[10px] text-white">
                          <UserIcon size={12} />
                       </div>
                       {lead.assignedTo}
                    </div>
                 </div>
              </div>

              <div className="mt-10 pt-10 border-t border-slate-50 flex flex-wrap gap-4">
                 <button onClick={() => handleUpdateStatus(LeadStatus.CLOSED_WON)} className="flex-1 px-6 py-4 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-green-700 transition-all shadow-xl shadow-green-100">Establish Win</button>
                 <button onClick={() => handleUpdateStatus(LeadStatus.CLOSED_LOST)} className="flex-1 px-6 py-4 bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all">Node Lost</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LeadProfile;
