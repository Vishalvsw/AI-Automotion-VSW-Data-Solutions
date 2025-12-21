
import React, { useState, useEffect } from 'react';
import { LeadStatus, Lead, UserRole, User, LeadSource, LeadPriority, ActivityType } from '../types';
import { Search, List, LayoutGrid, X, ClipboardList, Zap, Send, Printer, ArrowRight, CheckCircle, AlertCircle, IndianRupee, Tag, ShieldCheck, Briefcase, Filter, Edit2, Plus, Calendar, Share2, Target, FileText, ChevronRight, Check, Minus, CreditCard, Rocket, Trash2, Lock, AlertTriangle, Sparkles, Copy, MessageSquare, Mail, Linkedin, Loader2, UserPlus, Phone, Globe, UserCheck, Megaphone, Building } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GoogleGenAI } from "@google/genai";

interface LeadsProps {
  user: User;
}

const Leads: React.FC<LeadsProps> = ({ user }) => {
  const { leads, updateLead, addLead, deleteLead, modules } = useApp();
  const isAdmin = user.role === UserRole.FOUNDER;
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [filterOverdue, setFilterOverdue] = useState(false);
  const [filterPriority, setFilterPriority] = useState<'All' | LeadPriority>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // AI Outreach State
  const [outreachLead, setOutreachLead] = useState<Lead | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [outreachType, setOutreachType] = useState<'email' | 'whatsapp' | 'linkedin'>('whatsapp');

  const myLeads = isAdmin 
    ? leads 
    : leads.filter(l => l.assignedTo?.toLowerCase().includes(user.name.split(' ')[0].toLowerCase()) || l.assignedTo === user.name);

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(amount);
  };

  const isOverdue = (dateString?: string) => {
    if (!dateString) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateString) < today;
  };

  const canEditLead = (lead: Lead) => {
    if (isAdmin) return true;
    return lead.assignedTo?.toLowerCase().includes(user.name.split(' ')[0].toLowerCase()) || lead.assignedTo === user.name;
  };

  const filteredLeads = myLeads
    .filter(l => filterOverdue ? isOverdue(l.nextFollowUp) : true)
    .filter(l => filterPriority === 'All' ? true : l.priority === filterPriority)
    .filter(l => 
        l.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
        l.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const generateOutreach = async () => {
    if (!outreachLead) return;
    setIsGenerating(true);
    setGeneratedScript('');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Lead Name: ${outreachLead.name}
        Company: ${outreachLead.company}
        Pain Points: ${outreachLead.requirements?.painPoints.join(', ') || 'General growth needs'}
        Industry: ${outreachLead.requirements?.serviceType || 'Technology'}
        Priority Level: ${outreachLead.priority}
        Our Available Modules: ${modules.map(m => m.name).join(', ')}
        
        Task: Draft a high-conversion ${outreachType} message. 
        Tone: Professional yet bold, focusing on how our specific modules solve their exact pain points.
        Format: ${outreachType === 'whatsapp' ? 'Short, punchy with emojis' : 'Structured with a clear CTA'}
        Length: Under 150 words.
        Constraint: Do not use placeholders like [Your Name], use "VSW Enterprise".
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

  useEffect(() => {
    if (outreachLead) {
      generateOutreach();
    }
  }, [outreachType, outreachLead?.id]);

  const handleCreateSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const newLead: Lead = {
          id: `lead-${Date.now()}`,
          name: formData.get('name') as string,
          company: formData.get('company') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
          value: Number(formData.get('value')),
          status: LeadStatus.NEW,
          source: formData.get('source') as LeadSource,
          priority: formData.get('priority') as LeadPriority,
          lastContact: new Date().toISOString().split('T')[0],
          assignedTo: isAdmin ? (formData.get('assignedTo') as string) : user.name,
          nextFollowUp: formData.get('nextFollowUp') as string,
          requirements: {
              serviceType: formData.get('service') as any,
              details: {},
              painPoints: [],
              proposedSolutions: []
          }
      };
      addLead(newLead);
      setIsCreateModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!editLead) return;
      const formData = new FormData(e.target as HTMLFormElement);
      const updates = {
          name: formData.get('name') as string,
          company: formData.get('company') as string,
          email: formData.get('email') as string,
          phone: formData.get('phone') as string,
          value: Number(formData.get('value')),
          source: formData.get('source') as LeadSource,
          priority: formData.get('priority') as LeadPriority,
          nextFollowUp: formData.get('nextFollowUp') as string,
          status: formData.get('status') as LeadStatus,
          assignedTo: formData.get('assignedTo') as string,
      };
      updateLead(editLead.id, updates);
      setEditLead(null);
  };

  const getSourceIcon = (source: LeadSource) => {
      switch(source) {
          case LeadSource.WEBSITE: return <Globe size={14} />;
          case LeadSource.WHATSAPP: return <MessageSquare size={14} />;
          case LeadSource.REFERRAL: return <UserCheck size={14} />;
          case LeadSource.ADS: return <Megaphone size={14} />;
          case LeadSource.COLD_CALL: return <Phone size={14} />;
          default: return <Share2 size={14} />;
      }
  };

  return (
    <div className="space-y-6 relative h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lead Intelligence</h1>
             {isAdmin && <span className="bg-slate-900 text-white text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-[0.2em] shadow-lg">Admin View</span>}
          </div>
          <p className="text-slate-500 font-medium">{isAdmin ? 'Global Portfolio Access' : 'My Personal Funnel'} ({filteredLeads.length} nodes)</p>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={() => setIsCreateModalOpen(true)} className="px-5 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center gap-2">
              <Plus size={16} /> Quick-Inject Lead
           </button>
           <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}><List size={18} /></button>
              <button onClick={() => setViewMode('kanban')} className={`p-2 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}><LayoutGrid size={18} /></button>
           </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search leads..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-sm border-none bg-slate-50 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none font-bold" 
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
             <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-400" />
                <select 
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value as any)}
                  className="bg-slate-50 border-none rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer"
                >
                  <option value="All">All Priorities</option>
                  <option value={LeadPriority.HOT}>Hot</option>
                  <option value={LeadPriority.WARM}>Warm</option>
                  <option value={LeadPriority.COLD}>Cold</option>
                </select>
             </div>
             <button onClick={() => setFilterOverdue(!filterOverdue)} className={`flex items-center px-4 py-2 text-[10px] font-black uppercase tracking-widest border rounded-xl transition-all ${filterOverdue ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-100' : 'bg-white text-slate-600 border-slate-200'}`}>
              <AlertCircle size={14} className="mr-2" /> Overdue Only
            </button>
          </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-[10px] text-slate-400 uppercase tracking-widest bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 font-black">Lead Profile</th>
                <th className="px-6 py-5 font-black">Current Value</th>
                <th className="px-6 py-5 font-black">Status</th>
                <th className="px-6 py-5 font-black text-center">Priority</th>
                <th className="px-6 py-5 font-black">Agent</th>
                <th className="px-6 py-5 font-black">Next Follow-up</th>
                <th className="px-8 py-5 font-black text-right">Cockpit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLeads.map((lead) => {
                const overdue = isOverdue(lead.nextFollowUp);
                const isEditable = canEditLead(lead);
                
                return (
                  <tr 
                    key={lead.id} 
                    className={`transition-all group relative ${isEditable ? 'hover:bg-slate-50/80' : 'opacity-60 grayscale-[0.5]'} 
                    ${overdue ? 'bg-red-50/40' : ''}`}
                  >
                    <td className="px-8 py-5 relative">
                      {overdue && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>}
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold border shadow-sm transition-all ${lead.priority === LeadPriority.HOT ? 'bg-red-50 text-red-600 border-red-100 ring-2 ring-red-50' : lead.priority === LeadPriority.WARM ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                          {lead.company.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="font-black text-slate-900 text-base">{lead.company}</div>
                            {overdue && (
                              <span className="bg-red-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest animate-pulse">Overdue</span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{lead.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-black text-slate-900">{formatINR(lead.value)}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter flex items-center gap-1.5 mt-1">
                        <span className="text-brand-500">{getSourceIcon(lead.source)}</span> {lead.source}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1.5 w-fit ${
                        lead.status === LeadStatus.CLOSED_WON ? 'bg-green-50 text-green-700 border-green-200' :
                        lead.status === LeadStatus.CLOSED_LOST ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-slate-50 text-slate-600 border-slate-100'
                      }`}>
                        <Zap size={10} /> {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        lead.priority === LeadPriority.HOT ? 'bg-red-50 text-red-600 border-red-100' :
                        lead.priority === LeadPriority.WARM ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-slate-50 text-slate-500 border-slate-100'
                      }`}>
                        {lead.priority === LeadPriority.HOT ? '🔥 ' : lead.priority === LeadPriority.WARM ? '☀️ ' : '❄️ '}
                        {lead.priority}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-xs font-bold text-slate-900">{lead.assignedTo}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className={`flex items-center gap-2 text-xs font-bold ${overdue ? 'text-red-600' : 'text-slate-600'}`}>
                        {overdue && <AlertTriangle size={14} className="animate-pulse" />}
                        {lead.nextFollowUp ? new Date(lead.nextFollowUp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!isEditable ? (
                          <div className="p-3 text-slate-300 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2" title="Locked to Owner">
                             <Lock size={16} />
                             <span className="text-[9px] font-black uppercase tracking-widest">Locked</span>
                          </div>
                        ) : (
                          <>
                            <button 
                              onClick={() => setOutreachLead(lead)} 
                              className="p-3 text-brand-600 hover:bg-brand-50 rounded-2xl transition-all group"
                              title="AI Outreach Strategist"
                            >
                                <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                            </button>
                            <button onClick={() => setEditLead(lead)} className="p-3 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-2xl transition-all">
                                <Edit2 size={18} />
                            </button>
                            {isAdmin && (
                               <button onClick={() => deleteLead(lead.id)} className="p-3 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all">
                                  <Trash2 size={18} />
                               </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE LEAD MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-white">
              <div className="px-10 py-8 bg-slate-900 text-white flex justify-between items-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-[100px] rounded-full"></div>
                  <div className="relative z-10">
                     <h2 className="text-2xl font-black tracking-tight">Quick-Inject Lead</h2>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Initiating Sales Protocol</p>
                  </div>
                  <button onClick={() => setIsCreateModalOpen(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all relative z-10"><X size={24}/></button>
              </div>
              <form onSubmit={handleCreateSubmit} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Node</label>
                      <div className="relative">
                        {/* Fix: Icon now correctly imported from lucide-react */}
                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input required name="company" className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-black text-sm outline-none" placeholder="Target Corporation" />
                      </div>
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Contact</label>
                      <div className="relative">
                        <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input required name="name" className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-black text-sm outline-none" placeholder="Full Name" />
                      </div>
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Acquisition Source</label>
                      <select name="source" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-black text-sm outline-none cursor-pointer appearance-none">
                          {Object.values(LeadSource).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Urgency Priority</label>
                      <select name="priority" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-black text-sm outline-none cursor-pointer appearance-none">
                          {Object.values(LeadPriority).map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Value Index (₹)</label>
                      <div className="relative">
                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input required type="number" name="value" className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-black text-sm outline-none" placeholder="50000" />
                      </div>
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Next Follow-up</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input required type="date" name="nextFollowUp" className="w-full pl-12 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-black text-sm outline-none" />
                      </div>
                  </div>
                  <div className="md:col-span-2 pt-4 flex gap-4">
                       <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 py-5 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                       <button type="submit" className="flex-[2] py-5 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-800 shadow-2xl shadow-slate-200 transition-all flex items-center justify-center gap-2">
                          <Rocket size={18} /> Deploy Lead to Funnel
                       </button>
                  </div>
              </form>
           </div>
        </div>
      )}

      {/* EDIT LEAD MODAL */}
      {editLead && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-white">
              <div className="px-10 py-8 bg-brand-600 text-white flex justify-between items-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full"></div>
                  <div className="relative z-10">
                     <h2 className="text-2xl font-black tracking-tight">Recalibrate Node</h2>
                     <p className="text-[10px] font-black text-brand-100 uppercase tracking-widest mt-1">Ref ID: {editLead.id}</p>
                  </div>
                  <button onClick={() => setEditLead(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all relative z-10"><X size={24}/></button>
              </div>
              <form onSubmit={handleEditSubmit} className="p-10 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Node</label>
                      <input required name="company" defaultValue={editLead.company} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-black text-sm outline-none" />
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Name</label>
                      <input required name="name" defaultValue={editLead.name} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-black text-sm outline-none" />
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Acquisition Source</label>
                      <select name="source" defaultValue={editLead.source} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-black text-sm outline-none cursor-pointer">
                          {Object.values(LeadSource).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Urgency Priority</label>
                      <select name="priority" defaultValue={editLead.priority} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-black text-sm outline-none cursor-pointer">
                          {Object.values(LeadPriority).map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pipeline Status</label>
                      <select name="status" defaultValue={editLead.status} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-black text-sm outline-none cursor-pointer">
                          {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Agent</label>
                      <input name="assignedTo" defaultValue={editLead.assignedTo} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-black text-sm outline-none" />
                  </div>
                  <div className="md:col-span-2 pt-4 flex gap-4">
                       <button type="button" onClick={() => setEditLead(null)} className="flex-1 py-5 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                       <button type="submit" className="flex-[2] py-5 bg-brand-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-brand-700 shadow-2xl shadow-brand-100 transition-all">Apply Recalibration</button>
                  </div>
              </form>
           </div>
        </div>
      )}

      {/* AI OUTREACH MODAL */}
      {outreachLead && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border border-white flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
             <div className="p-8 bg-slate-900 text-white flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/20 blur-[100px] rounded-full"></div>
                <div className="flex items-center gap-4 relative z-10">
                   <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center shadow-2xl">
                      <Sparkles size={24} className="text-white animate-pulse" />
                   </div>
                   <div>
                      <h3 className="text-lg font-black uppercase tracking-tight">AI Outreach Strategist</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Generating pitch for {outreachLead.company}</p>
                   </div>
                </div>
                <button onClick={() => setOutreachLead(null)} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all relative z-10"><X size={24} /></button>
             </div>

             <div className="flex-1 p-8 space-y-6 overflow-y-auto custom-scrollbar">
                <div className="flex bg-slate-50 p-2 rounded-2xl border border-slate-100">
                   <button 
                    onClick={() => setOutreachType('whatsapp')} 
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${outreachType === 'whatsapp' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     <MessageSquare size={14} /> WhatsApp
                   </button>
                   <button 
                    onClick={() => setOutreachType('email')} 
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${outreachType === 'email' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     <Mail size={14} /> Email
                   </button>
                   <button 
                    onClick={() => setOutreachType('linkedin')} 
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${outreachType === 'linkedin' ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     <Linkedin size={14} /> LinkedIn
                   </button>
                </div>

                <div className="relative group">
                   <div className={`w-full min-h-[300px] p-8 bg-slate-50 border-2 border-slate-100 rounded-[32px] text-slate-800 text-sm font-semibold leading-relaxed transition-all ${isGenerating ? 'animate-pulse opacity-50' : 'group-hover:bg-white group-hover:border-brand-100 group-hover:shadow-xl group-hover:shadow-brand-50'}`}>
                      {isGenerating ? (
                        <div className="flex flex-col items-center justify-center h-full pt-20">
                           <Loader2 className="animate-spin text-brand-600 mb-4" size={32} />
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Synthesizing personalized pitch...</p>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">{generatedScript}</div>
                      )}
                   </div>
                   {!isGenerating && generatedScript && (
                     <button 
                      onClick={() => navigator.clipboard.writeText(generatedScript)}
                      className="absolute bottom-4 right-4 flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-[10px] font-black text-slate-900 rounded-2xl shadow-lg hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all uppercase tracking-widest"
                     >
                       <Copy size={14} /> Copy Script
                     </button>
                   )}
                </div>
             </div>

             <div className="p-8 border-t border-slate-50 bg-white flex gap-4">
                <button 
                  onClick={generateOutreach}
                  disabled={isGenerating}
                  className="flex-1 py-5 bg-slate-900 text-white font-black rounded-3xl text-sm uppercase tracking-widest shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  <Zap size={18} /> Regenerate Intelligent Copy
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
