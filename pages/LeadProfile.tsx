
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LeadStatus, LeadPriority, ActivityType, UserRole, User, Activity } from '../types';
import { 
  ArrowLeft, Phone, Mail, Calendar, IndianRupee, Zap, Target, Sparkles, 
  MessageSquare, Send, Trash2, Edit3, CheckCircle, Clock, History, 
  Layers, Video, Download, ExternalLink, FileSpreadsheet, FileText, Plus, X, Printer, Copy, Loader2, User as UserIcon
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
  
  // State: AI Outreach
  const [isGenerating, setIsGenerating] = useState(false);
  const [outreachType, setOutreachType] = useState<'whatsapp' | 'email'>('whatsapp');
  const [generatedScript, setGeneratedScript] = useState('');
  
  // State: Quotation
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>(lead?.selectedModuleIds || []);

  // State: Activity Log
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [activityFormData, setActivityFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: ActivityType.COLD_CALL,
    note: '',
    nextFollowUp: ''
  });

  if (!lead) return null;

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const selectedModules = useMemo(() => modules.filter(m => selectedModuleIds.includes(m.id)), [selectedModuleIds, modules]);
  const totalPrice = selectedModules.reduce((acc, m) => acc + m.price, 0);

  const toggleModule = (moduleId: string) => {
    const nextIds = selectedModuleIds.includes(moduleId) ? selectedModuleIds.filter(id => id !== moduleId) : [...selectedModuleIds, moduleId];
    setSelectedModuleIds(nextIds);
    updateLead(lead.id, { selectedModuleIds: nextIds });
  };

  // --- External Integrations ---
  const scheduleMeet = () => {
    const title = `Discovery: VSW x ${lead.company}`;
    const start = new Date(); start.setDate(start.getDate() + 1); start.setHours(11,0,0);
    const end = new Date(start); end.setHours(12,0,0);
    const format = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, "");
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${format(start)}/${format(end)}&add=${encodeURIComponent(lead.email)}`;
    window.open(url, '_blank');
  };

  const openWhatsApp = () => {
    const text = generatedScript || `Hi ${lead.name}, checking in from VSW Enterprise regarding our proposal for ${lead.company}.`;
    window.open(`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handlePrint = () => window.print();

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const newActivity: Activity = { ...activityFormData };
    const updatedActivities = [newActivity, ...(lead.activities || [])];
    const updates: any = { activities: updatedActivities };
    if (activityFormData.nextFollowUp) updates.nextFollowUp = activityFormData.nextFollowUp;
    updateLead(lead.id, updates);
    setIsActivityModalOpen(false);
    setActivityFormData({ date: new Date().toISOString().split('T')[0], type: ActivityType.COLD_CALL, note: '', nextFollowUp: '' });
  };

  const generateOutreach = async () => {
    setIsGenerating(true); setGeneratedScript('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Lead: ${lead.name} from ${lead.company}. Chosen Solutions: ${selectedModules.map(m => m.name).join(', ')}. Value: ${formatINR(totalPrice)}. Task: Draft a professional ${outreachType} follow-up under 120 words.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { systemInstruction: "You are the VSW Growth Strategist. Be concise and bold.", temperature: 0.7 }
      });
      setGeneratedScript(response.text || "");
    } catch (err) { setGeneratedScript("Connection to intelligence layer timed out."); }
    finally { setIsGenerating(false); }
  };

  const sortedActivities = useMemo(() => [...(lead.activities || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [lead.activities]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      {/* HEADER COMMAND */}
      <div className="flex items-center justify-between print:hidden">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-all group">
          <div className="p-2 bg-white rounded-xl border border-slate-200 group-hover:shadow-md"><ArrowLeft size={16} /></div>
          Return to Cockpit
        </button>
        <div className="flex gap-3">
          <button onClick={() => setIsQuoteModalOpen(true)} className="flex items-center gap-2 px-5 py-3 bg-brand-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-brand-700 shadow-xl shadow-brand-100 transition-all">
            <FileText size={18} /> Strategic Proposal
          </button>
          {isAdmin && <button onClick={() => { if(confirm('Purge node?')) { deleteLead(lead.id); navigate('/leads'); } }} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-red-600 transition-all"><Trash2 size={20}/></button>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:hidden">
        {/* LEFT COLUMN: IDENTITY & INTEGRATIONS */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm text-center">
            <div className={`w-24 h-24 rounded-[32px] mx-auto flex items-center justify-center text-4xl font-black mb-6 shadow-2xl ${lead.priority === LeadPriority.HOT ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-50 text-slate-400'}`}>
              {lead.company.charAt(0)}
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{lead.company}</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{lead.name}</p>
            <div className="mt-8 pt-8 border-t border-slate-50 space-y-3">
               <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400"><Mail size={14}/></div>
                  <span className="text-xs font-bold text-slate-600 truncate">{lead.email}</span>
               </div>
               <div className="flex items-center gap-3 text-left">
                  <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400"><Phone size={14}/></div>
                  <span className="text-xs font-bold text-slate-600">{lead.phone}</span>
               </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-4">
             <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4">Integration Matrix</h3>
             <button onClick={openWhatsApp} className="w-full flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-100 group">
                <div className="flex items-center gap-3"><MessageSquare size={18} className="text-green-600" /><span className="text-xs font-black text-green-900 uppercase">WhatsApp</span></div>
                <ExternalLink size={14} className="text-green-300" />
             </button>
             <button onClick={scheduleMeet} className="w-full flex items-center justify-between p-4 bg-brand-50 rounded-2xl border border-brand-100 group">
                <div className="flex items-center gap-3"><Video size={18} className="text-brand-600" /><span className="text-xs font-black text-brand-900 uppercase">Google Meet</span></div>
                <ExternalLink size={14} className="text-brand-300" />
             </button>
             <button onClick={() => window.location.href=`mailto:${lead.email}`} className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                <div className="flex items-center gap-3"><Mail size={18} className="text-slate-600" /><span className="text-xs font-black text-slate-900 uppercase">Office Email</span></div>
                <ExternalLink size={14} className="text-slate-300" />
             </button>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Activity Intelligence</h3>
                <button onClick={() => setIsActivityModalOpen(true)} className="p-2 bg-slate-900 text-white rounded-xl hover:bg-brand-600 transition-all"><Plus size={16}/></button>
             </div>
             <div className="space-y-6 relative pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {sortedActivities.slice(0, 4).map((act, idx) => (
                   <div key={idx} className="relative">
                      <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-brand-500 border-2 border-white ring-4 ring-slate-50"></div>
                      <div className="text-[8px] font-black text-slate-400 uppercase mb-1">{new Date(act.date).toLocaleDateString()}</div>
                      <div className="text-[11px] font-black text-slate-900">{act.type}</div>
                      <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1 line-clamp-2">{act.note}</p>
                   </div>
                ))}
                {sortedActivities.length === 0 && <p className="text-[10px] font-black text-slate-300 uppercase italic">Zero logs detected</p>}
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SOLUTION ARCHITECT & AI */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                 <div>
                   <h3 className="text-lg font-black text-slate-900 flex items-center gap-3"><Layers size={24} className="text-brand-600" /> Strategic Solution Architect</h3>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Configure active nodes for {lead.company}</p>
                 </div>
                 <div className="px-4 py-2 bg-slate-900 text-white rounded-xl font-black text-xs">{formatINR(totalPrice)}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {modules.map(module => (
                   <div key={module.id} onClick={() => toggleModule(module.id)} className={`p-5 rounded-[32px] border-2 cursor-pointer transition-all group ${selectedModuleIds.includes(module.id) ? 'border-brand-600 bg-brand-50/50' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                      <div className="flex justify-between items-start mb-2">
                         <div className={`p-2 rounded-xl ${selectedModuleIds.includes(module.id) ? 'bg-brand-600 text-white' : 'bg-slate-50 text-slate-400'}`}><Zap size={16}/></div>
                         {selectedModuleIds.includes(module.id) ? <CheckCircle className="text-brand-600" size={18}/> : <Plus className="text-slate-200" size={18}/>}
                      </div>
                      <h4 className="text-sm font-black text-slate-900">{module.name}</h4>
                      <p className="text-[10px] text-slate-500 font-bold mt-1 line-clamp-1">{module.description}</p>
                      <div className="mt-4 text-xs font-black text-brand-600">{formatINR(module.price)}</div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-lg font-black text-slate-900 flex items-center gap-3"><Sparkles size={24} className="text-brand-600" /> Neural Outreach Pilot</h3>
                 <div className="flex bg-slate-50 p-1.5 rounded-2xl">
                    <button onClick={() => setOutreachType('whatsapp')} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${outreachType === 'whatsapp' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>WhatsApp</button>
                    <button onClick={() => setOutreachType('email')} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${outreachType === 'email' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>Email</button>
                 </div>
              </div>
              {!generatedScript ? (
                <button onClick={generateOutreach} disabled={isGenerating} className="w-full py-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center gap-4 hover:bg-brand-50 hover:border-brand-200 transition-all group">
                   {isGenerating ? <><Loader2 className="animate-spin text-brand-600" size={32} /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Synthesizing Copy...</p></> : <><div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"><Zap size={24} className="text-brand-500"/></div><p className="text-xs font-black text-slate-900 uppercase">Deploy AI Strategist</p></>}
                </button>
              ) : (
                <div className="space-y-4 animate-in slide-in-from-bottom-2">
                   <div className="p-8 bg-slate-50 border-2 border-slate-100 rounded-[32px] text-sm font-semibold leading-relaxed text-slate-800">{generatedScript}</div>
                   <div className="flex gap-2">
                      <button onClick={() => { navigator.clipboard.writeText(generatedScript); alert('Copied for Doc!'); }} className="flex-1 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"><Copy size={14}/> Buffer for Doc</button>
                      <button onClick={outreachType === 'whatsapp' ? openWhatsApp : () => window.location.href=`mailto:${lead.email}?body=${encodeURIComponent(generatedScript)}`} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"><Send size={14}/> Dispatch Now</button>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* ACTIVITY MODAL */}
      {isActivityModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
           <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden border border-white">
              <div className="px-10 py-8 bg-slate-900 text-white flex justify-between items-center">
                 <div><h2 className="text-xl font-black uppercase tracking-tight">Log Interaction</h2><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Historical Node Tracking</p></div>
                 <button onClick={() => setIsActivityModalOpen(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"><X size={24}/></button>
              </div>
              <form onSubmit={handleAddActivity} className="p-10 space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label><input type="date" required value={activityFormData.date} onChange={e => setActivityFormData({...activityFormData, date: e.target.value})} className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-brand-500" /></div>
                    <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label><select value={activityFormData.type} onChange={e => setActivityFormData({...activityFormData, type: e.target.value as any})} className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl font-black text-sm outline-none cursor-pointer appearance-none">{Object.values(ActivityType).map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                 </div>
                 <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Notes</label><textarea required rows={3} value={activityFormData.note} onChange={e => setActivityFormData({...activityFormData, note: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-[24px] font-bold text-sm outline-none focus:ring-2 focus:ring-brand-500 resize-none" placeholder="Details of interaction..."/></div>
                 <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Next Follow-up</label><input type="date" value={activityFormData.nextFollowUp} onChange={e => setActivityFormData({...activityFormData, nextFollowUp: e.target.value})} className="w-full px-4 py-4 bg-slate-50 border-none rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-brand-500" /></div>
                 <div className="pt-4 flex gap-4"><button type="button" onClick={() => setIsActivityModalOpen(false)} className="flex-1 py-5 text-slate-400 font-black text-xs uppercase hover:bg-slate-50 rounded-2xl">Cancel</button><button type="submit" className="flex-[2] py-5 bg-slate-900 text-white font-black text-xs uppercase rounded-2xl shadow-xl shadow-slate-200">Append Log</button></div>
              </form>
           </div>
        </div>
      )}

      {/* PROPOSAL MODAL (PDF View) */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md print:bg-white print:p-0">
           <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden border border-white print:h-auto print:rounded-none print:shadow-none print:max-w-none">
              <div className="px-10 py-8 bg-slate-900 text-white flex justify-between items-center print:hidden">
                 <div className="flex items-center gap-4"><div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center"><FileText size={24} /></div><div><h2 className="text-xl font-black tracking-tight uppercase">Strategic Proposal Artifact</h2><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Generated: {new Date().toLocaleDateString()}</p></div></div>
                 <div className="flex gap-3"><button onClick={handlePrint} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl"><Printer size={20}/></button><button onClick={() => setIsQuoteModalOpen(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl"><X size={20}/></button></div>
              </div>
              <div className="flex-1 overflow-y-auto p-16 space-y-12 bg-white print:p-8">
                 <div className="flex justify-between items-start border-b-4 border-slate-900 pb-10">
                    <div className="flex items-center gap-4"><div className="w-16 h-16 bg-slate-900 text-white rounded-[24px] flex items-center justify-center font-black text-3xl">V</div><div><h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">VSW ENTERPRISE</h1><p className="text-[11px] font-black text-brand-600 uppercase tracking-[0.4em] mt-1">Data & Systems Logistics</p></div></div>
                    <div className="text-right"><div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Proposal Ref</div><div className="text-sm font-black text-slate-900">#VSW-{lead.id.slice(-6).toUpperCase()}</div></div>
                 </div>
                 <div className="grid grid-cols-2 gap-10">
                    <div><h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Client Entity</h3><div className="space-y-1"><p className="text-lg font-black text-slate-900">{lead.name}</p><p className="text-sm font-bold text-slate-600">{lead.company}</p><p className="text-xs text-slate-500 font-medium">{lead.email}</p></div></div>
                    <div><h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Strategic Scope</h3><div className="space-y-2"><div className="flex items-center gap-2"><div className="w-2 h-2 bg-brand-600 rounded-full"></div><span className="text-xs font-black text-slate-900 uppercase">Architecture: {lead.requirements?.serviceType || 'Technology'}</span></div><div className="flex items-center gap-2"><div className="w-2 h-2 bg-slate-300 rounded-full"></div><span className="text-xs font-bold text-slate-500 uppercase">Lifecycle: New Deployment</span></div></div></div>
                 </div>
                 <div className="border border-slate-100 rounded-[24px] overflow-hidden">
                    <table className="w-full text-left">
                       <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100"><tr className="px-8 py-5"><th>Capability Node</th><th className="text-right">Investment (₹)</th></tr></thead>
                       <tbody className="divide-y divide-slate-50">
                          {selectedModules.map(m => (
                            <tr key={m.id} className="px-8 py-6">
                               <td className="px-8 py-6 font-black text-slate-900 text-sm">{m.name}<br/><span className="text-[10px] font-bold text-slate-400 italic font-normal">{m.description}</span></td>
                               <td className="px-8 py-6 text-right font-black text-slate-900">{formatINR(m.price)}</td>
                            </tr>
                          ))}
                       </tbody>
                       <tfoot className="bg-slate-900 text-white"><tr className="px-8 py-6"><td className="px-8 py-6 font-black uppercase text-xs">Total Strategic Investment</td><td className="px-8 py-6 text-right font-black text-2xl">{formatINR(totalPrice)}</td></tr></tfoot>
                    </table>
                 </div>
                 <div className="grid grid-cols-2 gap-20 pt-10">
                    <div className="space-y-4"><h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Technical Terms</h3><ul className="space-y-2 text-[10px] font-bold text-slate-500 list-disc pl-4"><li>Validity: 15 business days.</li><li>Initiation: Cycles begin upon node settlement.</li></ul></div>
                    <div className="flex flex-col justify-end items-end space-y-8"><div className="w-48 h-20 border-b-2 border-slate-200"></div><p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Authorized Signature</p></div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default LeadProfile;
