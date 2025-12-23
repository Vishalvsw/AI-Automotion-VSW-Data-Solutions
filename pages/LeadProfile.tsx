
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LeadStatus, LeadPriority, ActivityType, UserRole, User, Activity, QuoteStatus, TaskStatus, Task, TaskPriority } from '../types';
import { 
  ArrowLeft, Phone, Mail, Calendar, IndianRupee, Zap, Target, Sparkles, 
  MessageSquare, Send, Trash2, Edit3, CheckCircle, Clock, History, 
  Layers, Video, Download, ExternalLink, FileSpreadsheet, FileText, Plus, X, Printer, Copy, Loader2, User as UserIcon, ListTodo, AlertCircle, Info, ChevronDown, MapPin, PhoneCall, MailSearch
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface LeadProfileProps {
  user: User;
}

const LeadProfile: React.FC<LeadProfileProps> = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leads, updateLead, deleteLead, modules } = useApp();
  const isAdmin = user.role === UserRole.FOUNDER;
  const isBDA = user.role === UserRole.BDA;

  const lead = leads.find(l => l.id === id);
  
  // State: AI Controls
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMappingQuote, setIsMappingQuote] = useState(false);
  const [outreachType, setOutreachType] = useState<'whatsapp' | 'email'>('whatsapp');
  const [generatedScript, setGeneratedScript] = useState('');
  
  // State: Quotation Builder
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>(lead?.selectedModuleIds || []);

  // State: Interaction Logger
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [activityFormData, setActivityFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: ActivityType.COLD_CALL,
    note: '',
    nextFollowUp: ''
  });

  // State: Tasks
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<'Call' | 'Email' | 'Visit' | 'LeadGen' | 'General'>('General');

  if (!lead) return null;

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const selectedModules = useMemo(() => modules.filter(m => selectedModuleIds.includes(m.id)), [selectedModuleIds, modules]);
  const totalPrice = selectedModules.reduce((acc, m) => acc + m.price, 0);

  const toggleModule = (moduleId: string) => {
    const nextIds = selectedModuleIds.includes(moduleId) ? selectedModuleIds.filter(id => id !== moduleId) : [...selectedModuleIds, moduleId];
    setSelectedModuleIds(nextIds);
    updateLead(lead.id, { selectedModuleIds: nextIds, quoteStatus: QuoteStatus.DRAFT });
  };

  const mapQuotationNeural = async (note: string) => {
    setIsMappingQuote(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const availableModules = modules.map(m => `ID:${m.id} | Name:${m.name} | Desc:${m.description}`).join('\n');
      const prompt = `CLIENT DISCOVERY NOTE: "${note}"\nSERVICE CATEGORY: ${lead.requirements?.serviceType || 'General Tech'}\nARCHITECTURE LIBRARY:\n${availableModules}\nTASK: Analyze the note and return a JSON array of Module IDs that solve the client's needs. Only return the array, no text.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "You are the VSW Lead Solution Architect. You map business problems to technical modules with 99% accuracy.",
          responseMimeType: "application/json",
          responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      });
      const mappedIds = JSON.parse(response.text || "[]");
      if (mappedIds.length > 0) {
        setSelectedModuleIds(mappedIds);
        updateLead(lead.id, { selectedModuleIds: mappedIds, quoteStatus: QuoteStatus.DRAFT, value: modules.filter(m => mappedIds.includes(m.id)).reduce((acc, m) => acc + m.price, 0) });
      }
    } catch (err) { console.error("Neural mapping failed", err); }
    finally { setIsMappingQuote(false); }
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    const newActivity: Activity = { ...activityFormData };
    const updatedActivities = [newActivity, ...(lead.activities || [])];
    const updates: any = { activities: updatedActivities };
    if (activityFormData.nextFollowUp) updates.nextFollowUp = activityFormData.nextFollowUp;
    updateLead(lead.id, updates);
    setIsActivityModalOpen(false);
    if (activityFormData.type === ActivityType.REQUIREMENTS) await mapQuotationNeural(activityFormData.note);
    setActivityFormData({ date: new Date().toISOString().split('T')[0], type: ActivityType.COLD_CALL, note: '', nextFollowUp: '' });
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const prefix = newTaskCategory === 'Visit' ? '📍 SITE VISIT: ' : 
                   newTaskCategory === 'Call' ? '📞 CALL: ' : 
                   newTaskCategory === 'Email' ? '📧 EMAIL: ' : 
                   newTaskCategory === 'LeadGen' ? '🚀 LEAD GEN: ' : '';
    
    const newTask: Task = {
      id: `lt-${Date.now()}`,
      title: `${prefix}${newTaskTitle}`,
      assignee: user.name,
      priority: newTaskCategory === 'Visit' ? 'High' : 'Medium',
      status: TaskStatus.TODO,
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      client: lead.company
    };
    updateLead(lead.id, { tasks: [...(lead.tasks || []), newTask] });
    setNewTaskTitle('');
  };

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = (lead.tasks || []).map(t => 
      t.id === taskId ? { ...t, status: t.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE } : t
    );
    updateLead(lead.id, { tasks: updatedTasks });
  };

  const openWhatsApp = () => {
    const text = generatedScript || `Hi ${lead.name}, checking in from VSW regarding ${lead.company}.`;
    window.open(`https://wa.me/${lead.phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handlePrint = () => {
    updateLead(lead.id, { quoteStatus: QuoteStatus.SENT });
    window.print();
  };

  const generateOutreach = async () => {
    setIsGenerating(true); setGeneratedScript('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Lead: ${lead.name} (${lead.company}). Solutions: ${selectedModules.map(m => m.name).join(', ')}. Value: ${formatINR(totalPrice)}. Draft a high-impact ${outreachType} follow-up under 100 words.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { systemInstruction: "You are the VSW Growth Strategist. Be bold, elite, and professional.", temperature: 0.7 }
      });
      setGeneratedScript(response.text || "");
    } catch (err) { setGeneratedScript("Connection to intelligence layer timed out."); }
    finally { setIsGenerating(false); }
  };

  const sortedActivities = useMemo(() => [...(lead.activities || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [lead.activities]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      {isMappingQuote && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[2000] bg-slate-900 text-white px-8 py-5 rounded-[24px] shadow-2xl flex items-center gap-4 animate-in slide-in-from-top-8 border border-white/20">
           <Loader2 className="animate-spin text-brand-400" size={24} />
           <div className="flex flex-col"><span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">AI Architect Node</span><span className="text-xs font-black">Mapping Solutions from Discovery Note...</span></div>
        </div>
      )}

      <div className="flex items-center justify-between print:hidden">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-all group">
          <div className="p-2 bg-white rounded-xl border border-slate-200 group-hover:shadow-md"><ArrowLeft size={16} /></div>
          Return to Cockpit
        </button>
        <div className="flex gap-3">
          <button onClick={() => setIsQuoteModalOpen(true)} className="flex items-center gap-2 px-6 py-4 bg-brand-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-brand-700 shadow-xl shadow-brand-100 transition-all"><FileText size={18} /> Strategic Proposal</button>
          {isAdmin && <button onClick={() => { if(confirm('Purge node?')) { deleteLead(lead.id); navigate('/leads'); } }} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-red-600 transition-all"><Trash2 size={20}/></button>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:hidden">
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm text-center">
            <div className={`w-24 h-24 rounded-[32px] mx-auto flex items-center justify-center text-4xl font-black mb-6 shadow-2xl ${lead.priority === LeadPriority.HOT ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-50 text-slate-400'}`}>{lead.company.charAt(0)}</div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{lead.company}</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{lead.name}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
               <span className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl border ${lead.quoteStatus === QuoteStatus.SENT ? 'bg-green-50 text-green-600 border-green-100' : lead.quoteStatus === QuoteStatus.DRAFT ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>Quote: {lead.quoteStatus || 'Not Generated'}</span>
               <span className="px-3 py-1.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl">{lead.status}</span>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-50 space-y-3">
               <div className="flex items-center gap-3 text-left"><div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400"><Mail size={14}/></div><span className="text-xs font-bold text-slate-600 truncate">{lead.email}</span></div>
               <div className="flex items-center gap-3 text-left"><div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400"><Phone size={14}/></div><span className="text-xs font-bold text-slate-600">{lead.phone}</span></div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-4">
             <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4">Engagement Matrix</h3>
             <button onClick={openWhatsApp} className="w-full flex items-center justify-between p-4 bg-green-50 rounded-2xl border border-green-100 group"><div className="flex items-center gap-3"><MessageSquare size={18} className="text-green-600" /><span className="text-xs font-black text-green-900 uppercase">WhatsApp Flow</span></div><ExternalLink size={14} className="text-green-300" /></button>
             <button onClick={() => window.location.href=`mailto:${lead.email}`} className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group"><div className="flex items-center gap-3"><MailSearch size={18} className="text-slate-600" /><span className="text-xs font-black text-slate-900 uppercase">Email Outreach</span></div><ExternalLink size={14} className="text-slate-300" /></button>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
             <div className="flex justify-between items-center mb-6"><h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Activity Intelligence</h3><button onClick={() => setIsActivityModalOpen(true)} className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-brand-600 transition-all shadow-lg shadow-slate-200"><Plus size={16}/></button></div>
             <div className="space-y-6 relative pl-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {sortedActivities.slice(0, 4).map((act, idx) => (
                   <div key={idx} className="relative">
                      <div className={`absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ring-4 ${act.type === ActivityType.REQUIREMENTS ? 'bg-purple-600 ring-purple-50' : 'bg-brand-500 ring-slate-50'}`}></div>
                      <div className="text-[8px] font-black text-slate-400 uppercase mb-1">{new Date(act.date).toLocaleDateString()}</div>
                      <div className="text-[11px] font-black text-slate-900">{act.type}</div>
                      <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1 line-clamp-2">{act.note}</p>
                   </div>
                ))}
             </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                 <div><h3 className="text-lg font-black text-slate-900 flex items-center gap-3"><Layers size={24} className="text-brand-600" /> Strategic Architecture Mapping</h3><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Select project modules to determine 8% commission floor.</p></div>
                 <div className="px-5 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-200">{formatINR(totalPrice)}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {modules.map(module => (
                   <div key={module.id} onClick={() => toggleModule(module.id)} className={`p-6 rounded-[32px] border-2 cursor-pointer transition-all group ${selectedModuleIds.includes(module.id) ? 'border-brand-600 bg-brand-50/50' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                      <div className="flex justify-between items-start mb-3">
                         <div className={`p-2.5 rounded-xl ${selectedModuleIds.includes(module.id) ? 'bg-brand-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}><Zap size={18}/></div>
                         {selectedModuleIds.includes(module.id) ? <CheckCircle className="text-brand-600" size={20}/> : <Plus className="text-slate-200" size={20}/>}
                      </div>
                      <h4 className="text-sm font-black text-slate-900">{module.name}</h4>
                      <p className="text-[11px] text-slate-500 font-bold mt-1 leading-relaxed line-clamp-2">{module.description}</p>
                      <div className="mt-4 pt-4 border-t border-slate-50 text-xs font-black text-brand-600">{formatINR(module.price)}</div>
                   </div>
                 ))}
              </div>
           </div>

           {/* REFINED BDA TASKS SECTION */}
           <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-lg font-black text-slate-900 flex items-center gap-3"><Target size={24} className="text-brand-600" /> BDA Pipeline Actions</h3>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Immediate Growth Tasks</span>
              </div>
              
              <div className="space-y-6 mb-10 bg-slate-50 p-8 rounded-[32px] border border-slate-100">
                <div className="flex flex-wrap gap-2 mb-4">
                   {[
                     { id: 'Call', icon: PhoneCall, label: 'Cold Call' },
                     { id: 'Visit', icon: MapPin, label: 'Site Visit' },
                     { id: 'Email', icon: Mail, label: 'Email Outreach' },
                     { id: 'LeadGen', icon: Sparkles, label: 'Lead Generation' },
                     { id: 'General', icon: Target, label: 'General Task' }
                   ].map(cat => (
                     <button 
                       key={cat.id}
                       onClick={() => setNewTaskCategory(cat.id as any)}
                       className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${newTaskCategory === cat.id ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'}`}
                     >
                       <cat.icon size={12} />
                       {cat.label}
                     </button>
                   ))}
                </div>
                <div className="flex gap-3">
                  <input 
                    value={newTaskTitle} 
                    onChange={e => setNewTaskTitle(e.target.value)} 
                    onKeyDown={e => e.key === 'Enter' && handleAddTask()} 
                    className="flex-1 px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all shadow-sm" 
                    placeholder={`e.g. ${newTaskCategory === 'Visit' ? 'Schedule office demo' : 'Follow up on proposal node'}`} 
                  />
                  <button onClick={handleAddTask} className="px-8 py-4 bg-brand-600 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-brand-700 transition-all shadow-xl shadow-brand-100">Inject Node</button>
                </div>
              </div>

              <div className="space-y-4">
                 {(lead.tasks || []).map(task => (
                    <div key={task.id} className={`flex items-center justify-between p-6 rounded-[28px] border transition-all ${task.status === TaskStatus.DONE ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200 shadow-sm hover:border-brand-200'}`}>
                       <div className="flex items-center gap-5">
                          <button onClick={() => handleToggleTask(task.id)} className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${task.status === TaskStatus.DONE ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-200 hover:border-brand-500'}`}>
                             {task.status === TaskStatus.DONE && <CheckCircle size={18} />}
                          </button>
                          <div>
                            <div className={`text-base font-black ${task.status === TaskStatus.DONE ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.title}</div>
                            <div className="flex items-center gap-3 mt-1">
                               <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest flex items-center gap-1"><Clock size={12} /> Target: {task.dueDate}</span>
                            </div>
                          </div>
                       </div>
                       <div className={`px-4 py-1.5 text-[9px] font-black uppercase rounded-xl ${task.priority === 'High' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>{task.priority} Tier</div>
                    </div>
                 ))}
                 {(!lead.tasks || lead.tasks.length === 0) && <div className="p-16 text-center bg-slate-50/50 rounded-[40px] text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] border-2 border-dashed border-slate-200">Zero active pipeline tasks.</div>}
              </div>
           </div>
        </div>
      </div>

      {isActivityModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
           <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg overflow-hidden border border-white">
              <div className="px-10 py-8 bg-slate-900 text-white flex justify-between items-center"><div><h2 className="text-xl font-black uppercase tracking-tight">Log Growth Interaction</h2><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pipeline Velocity Tracking</p></div><button onClick={() => setIsActivityModalOpen(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"><X size={24}/></button></div>
              <form onSubmit={handleAddActivity} className="p-10 space-y-6">
                 <div className="grid grid-cols-2 gap-6"><div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Protocol Date</label><input type="date" required value={activityFormData.date} onChange={e => setActivityFormData({...activityFormData, date: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-brand-500" /></div><div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Protocol Type</label><select value={activityFormData.type} onChange={e => setActivityFormData({...activityFormData, type: e.target.value as any})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-black text-sm outline-none cursor-pointer appearance-none">{Object.values(ActivityType).map(t => <option key={t} value={t}>{t}</option>)}</select></div></div>
                 <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{activityFormData.type === ActivityType.REQUIREMENTS ? 'Discovery Notes (AI Map)' : 'Growth Session Notes'}</label><textarea required rows={4} value={activityFormData.note} onChange={e => setActivityFormData({...activityFormData, note: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border-none rounded-[24px] font-bold text-sm outline-none focus:ring-2 focus:ring-brand-500 resize-none" placeholder="Details of the lead engagement..."/></div>
                 <div className="space-y-2"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Next Contact</label><input type="date" value={activityFormData.nextFollowUp} onChange={e => setActivityFormData({...activityFormData, nextFollowUp: e.target.value})} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-brand-500" /></div>
                 <div className="pt-4 flex gap-4"><button type="button" onClick={() => setIsActivityModalOpen(false)} className="flex-1 py-5 text-slate-400 font-black text-xs uppercase hover:bg-slate-50 rounded-2xl transition-all">Abort</button><button type="submit" className="flex-[2] py-5 bg-slate-900 text-white font-black text-xs uppercase rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all">Log & Map Nodes</button></div>
              </form>
           </div>
        </div>
      )}

      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md print:bg-white print:p-0">
           <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden border border-white print:h-auto print:rounded-none print:shadow-none print:max-w-none">
              <div className="px-10 py-8 bg-slate-900 text-white flex justify-between items-center print:hidden"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center shadow-xl"><FileText size={24} /></div><div><h2 className="text-xl font-black tracking-tight uppercase">Strategic Proposal Artifact</h2><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Generated: {new Date().toLocaleDateString()}</p></div></div><div className="flex gap-3"><button onClick={handlePrint} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all" title="Print to PDF"><Printer size={20}/></button><button onClick={() => setIsQuoteModalOpen(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"><X size={20}/></button></div></div>
              <div className="flex-1 overflow-y-auto p-16 space-y-12 bg-white print:p-8">
                 <div className="flex justify-between items-start border-b-4 border-slate-900 pb-10"><div className="flex items-center gap-5"><div className="w-20 h-20 bg-slate-900 text-white rounded-[28px] flex items-center justify-center font-black text-4xl">V</div><div><h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">VSW ENTERPRISE</h1><p className="text-[11px] font-black text-brand-600 uppercase tracking-[0.5em] mt-2">Elite System Architectures</p></div></div><div className="text-right"><div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Proposal Ref</div><div className="text-lg font-black text-slate-900">#VSW-{lead.id.slice(-6).toUpperCase()}</div></div></div>
                 <div className="grid grid-cols-2 gap-10"><div><h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Client Representative</h3><div className="space-y-1"><p className="text-2xl font-black text-slate-900">{lead.name}</p><p className="text-base font-bold text-slate-600">{lead.company}</p><p className="text-sm text-slate-500 font-medium">{lead.email}</p></div></div><div><h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Tactical Scope</h3><div className="space-y-3"><div className="flex items-center gap-3"><div className="w-2 h-2 bg-brand-600 rounded-full"></div><span className="text-sm font-black text-slate-900 uppercase">Architecture: {lead.requirements?.serviceType || 'Technology'}</span></div><div className="flex items-center gap-3"><div className="w-2 h-2 bg-slate-300 rounded-full"></div><span className="text-sm font-bold text-slate-500 uppercase">Lifecycle: Phase 1 Deployment</span></div></div></div></div>
                 <div className="border-2 border-slate-900 rounded-[32px] overflow-hidden"><table className="w-full text-left"><thead className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em]"><tr className="px-8 py-5"><th className="px-8 py-6">Capability Node</th><th className="px-8 py-6 text-right">Investment (₹)</th></tr></thead><tbody className="divide-y divide-slate-100">{selectedModules.map(m => (<tr key={m.id} className="px-8 py-6"><td className="px-8 py-6"><div className="font-black text-slate-900 text-base">{m.name}</div><div className="text-[11px] font-bold text-slate-400 italic mt-1">{m.description}</div></td><td className="px-8 py-6 text-right font-black text-slate-900 text-base">{formatINR(m.price)}</td></tr>))}</tbody><tfoot className="bg-slate-50"><tr className="px-8 py-6"><td className="px-8 py-8 font-black uppercase tracking-widest text-sm text-slate-900">Total Strategic Investment</td><td className="px-8 py-8 text-right font-black text-3xl text-brand-600">{formatINR(totalPrice)}</td></tr></tfoot></table></div>
                 <div className="grid grid-cols-2 gap-20 pt-10"><div className="space-y-6"><h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Technical Terms</h3><ul className="space-y-3 text-[11px] font-bold text-slate-500 list-disc pl-4"><li>Artifact Validity: 15 business days from issuance.</li><li>Activation: Lifecycle triggers upon 30% node settlement.</li><li>Maintenance: Standard 3-month support included.</li></ul></div><div className="flex flex-col justify-end items-end space-y-10"><div className="w-56 h-24 border-b-4 border-slate-900"></div><p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em]">Authorized Signatory</p></div></div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default LeadProfile;
