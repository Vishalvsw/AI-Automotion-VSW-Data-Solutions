
import React, { useState, useEffect } from 'react';
import { LeadStatus, Lead, UserRole, User, Quotation, QuotationPlan, ProjectStatus, LeadSource, ActivityType, QuotationModule } from '../types';
// Fixed: Added missing CreditCard and Rocket imports from lucide-react
import { Search, List, LayoutGrid, X, ClipboardList, Zap, Send, Printer, ArrowRight, CheckCircle, AlertCircle, IndianRupee, Tag, ShieldCheck, Briefcase, Filter, Edit2, Plus, Calendar, Share2, Target, FileText, ChevronRight, Check, Minus, CreditCard, Rocket } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LeadsProps {
  user: User;
}

const Leads: React.FC<LeadsProps> = ({ user }) => {
  const { leads, updateLead, addLead, addProject, modules } = useApp();
  const isAdmin = user.role === UserRole.FOUNDER;
  
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [filterOverdue, setFilterOverdue] = useState(false);
  const [filterPriority, setFilterPriority] = useState<'All' | 'Hot' | 'Warm' | 'Cold'>('All');
  
  // Quotation Builder State
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quoteStep, setQuoteStep] = useState(1);
  const [quotePreview, setQuotePreview] = useState<Quotation | null>(null);
  const [builderData, setBuilderData] = useState<{
    overview: string;
    objective: string;
    selectedModuleIds: string[];
    plans: QuotationPlan[];
  }>({
    overview: '',
    objective: '',
    selectedModuleIds: [],
    plans: [
      { name: 'BASIC', price: 65000, timeline: '45-65 Days', idealFor: 'Single college, basic admission', featureLevels: {} },
      { name: 'STANDARD', price: 125000, timeline: '55-75 Days', idealFor: 'Multi-agents, exams & library', featureLevels: {} },
      { name: 'ENTERPRISE', price: 185000, timeline: '90-120 Days', idealFor: 'Full ERP + finance + scaling', featureLevels: {} }
    ]
  });

  const myLeads = user.role === UserRole.BDA 
    ? leads.filter(l => l.assignedTo?.toLowerCase().includes(user.name.split(' ')[0].toLowerCase()) || l.assignedTo === user.name)
    : leads;

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

  const filteredLeads = myLeads
    .filter(l => filterOverdue ? isOverdue(l.nextFollowUp) : true)
    .filter(l => filterPriority === 'All' ? true : l.priority === filterPriority);

  const handleOpenQuote = (lead: Lead) => {
    setSelectedLead(lead);
    setIsQuoteOpen(true);
    setQuoteStep(1);
    setQuotePreview(null);
    
    // Pre-populate from lead requirements
    setBuilderData({
      overview: `${lead.company} requires a centralized solution to manage ${lead.requirements?.serviceType || 'operations'} from one secure platform.`,
      objective: lead.requirements?.painPoints?.[0] ? `Address ${lead.requirements.painPoints[0]} and digitize the complete lifecycle.` : 'Digitize the complete business lifecycle and improve coordination.',
      selectedModuleIds: lead.selectedModuleIds || modules.slice(0, 6).map(m => m.id),
      plans: [
        { name: 'BASIC', price: 65000, timeline: '45-65 Days', idealFor: 'Single location, basic setup', featureLevels: {} },
        { name: 'STANDARD', price: 125000, timeline: '55-75 Days', idealFor: 'Multi-location, advanced modules', featureLevels: {} },
        { name: 'ENTERPRISE', price: 185000, timeline: '90-120 Days', idealFor: 'Full ERP + scaling + premium support', featureLevels: {} }
      ]
    });
  };

  const updatePlanField = (index: number, field: keyof QuotationPlan, value: any) => {
    const updatedPlans = [...builderData.plans];
    updatedPlans[index] = { ...updatedPlans[index], [field]: value };
    setBuilderData(prev => ({ ...prev, plans: updatedPlans }));
  };

  const setFeatureLevel = (planIndex: number, moduleId: string, level: string) => {
    const updatedPlans = [...builderData.plans];
    updatedPlans[planIndex] = {
      ...updatedPlans[planIndex],
      featureLevels: { ...updatedPlans[planIndex].featureLevels, [moduleId]: level }
    };
    setBuilderData(prev => ({ ...prev, plans: updatedPlans }));
  };

  const generateQuotation = () => {
    if (!selectedLead) return;
    
    const finalQuote: Quotation = {
      id: `VSW-Q-${Date.now().toString().slice(-4)}`,
      leadId: selectedLead.id,
      projectOverview: builderData.overview,
      objective: builderData.objective,
      coreModules: modules.filter(m => builderData.selectedModuleIds.includes(m.id)),
      plans: builderData.plans,
      benefits: [
        'Centralized administration & control',
        'Transparent tracking & reporting',
        'Reduced manual errors & automation',
        'Faster client/student onboarding',
        'Scalable for future growth'
      ],
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setQuotePreview(finalQuote);
  };

  const handleProjectHandover = (lead: Lead) => {
    const newProject = {
      id: `prj-${Date.now()}`,
      title: `${lead.company} - Platform Build`,
      client: lead.company,
      status: ProjectStatus.REQUIREMENTS,
      dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      progress: 0,
      budget: lead.value,
      tasks: [{ id: 't1', title: 'Onboarding & Scope Lock', assignee: 'Founder', priority: 'High' }]
    };
    addProject(newProject);
    updateLead(lead.id, { status: LeadStatus.CLOSED_WON });
  };

  const handleSaveLeadEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editLead) return;
    updateLead(editLead.id, editLead);
    setEditLead(null);
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: formData.get('name') as string,
      company: formData.get('company') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      value: Number(formData.get('value')),
      status: formData.get('status') as LeadStatus,
      source: formData.get('source') as LeadSource,
      priority: formData.get('priority') as 'Hot' | 'Warm' | 'Cold',
      lastContact: new Date().toISOString().split('T')[0],
      nextFollowUp: formData.get('nextFollowUp') as string,
      assignedTo: user.name,
      activities: [{ type: ActivityType.MEETING, date: new Date().toISOString(), note: 'Manually added to pipeline.' }]
    };

    addLead(newLead);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-6 relative h-full flex flex-col">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #quotation-print-area, #quotation-print-area * { visibility: visible; }
          #quotation-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
            box-shadow: none;
            border: none;
            background: white;
          }
          .page-break { page-break-after: always; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lead Intelligence</h1>
          <p className="text-slate-500 font-medium">Enterprise Acquisition Cockpit ({filteredLeads.length} active nodes)</p>
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
            <input type="text" placeholder="Search leads..." className="w-full pl-11 pr-4 py-3 text-sm border-none bg-slate-50 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none font-bold" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
             <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-400" />
                <select 
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value as any)}
                  className="bg-slate-50 border-none rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 focus:ring-2 focus:ring-brand-500 outline-none"
                >
                  <option value="All">All Priorities</option>
                  <option value="Hot">Hot</option>
                  <option value="Warm">Warm</option>
                  <option value="Cold">Cold</option>
                </select>
             </div>
             <button onClick={() => setFilterOverdue(!filterOverdue)} className={`flex items-center px-4 py-2 text-[10px] font-black uppercase tracking-widest border rounded-xl transition-all ${filterOverdue ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-100' : 'bg-white text-slate-600 border-slate-200'}`}>
              <AlertCircle size={14} className="mr-2" /> Overdue
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
                <th className="px-6 py-5 font-black">Priority</th>
                <th className="px-6 py-5 font-black">Agent</th>
                <th className="px-6 py-5 font-black">Next Follow-up</th>
                <th className="px-8 py-5 font-black text-right">Cockpit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLeads.map((lead) => {
                const overdue = isOverdue(lead.nextFollowUp);
                return (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold border shadow-sm ${lead.priority === 'Hot' ? 'bg-red-50 text-red-600 border-red-100' : lead.priority === 'Warm' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                          {lead.company.charAt(0)}
                        </div>
                        <div>
                          <div className="font-black text-slate-900 text-base">{lead.company}</div>
                          <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider">{lead.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-black text-slate-900">{formatINR(lead.value)}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter flex items-center gap-1">
                        <Share2 size={10} /> {lead.source}
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
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        lead.priority === 'Hot' ? 'bg-red-50 text-red-600 border-red-100' :
                        lead.priority === 'Warm' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-slate-50 text-slate-500 border-slate-100'
                      }`}>
                        {lead.priority === 'Hot' ? '🔥 ' : lead.priority === 'Warm' ? '☀️ ' : '❄️ '}
                        {lead.priority}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-xs font-bold text-slate-900">{lead.assignedTo}</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className={`flex items-center gap-2 text-xs font-bold ${overdue ? 'text-red-600' : 'text-slate-600'}`}>
                        {overdue && <AlertCircle size={14} className="animate-pulse" />}
                        {lead.nextFollowUp ? new Date(lead.nextFollowUp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setEditLead(lead)} className="p-3 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-2xl transition-all">
                            <Edit2 size={18} />
                        </button>
                        {lead.status === LeadStatus.PROPOSAL_SENT && isAdmin ? (
                            <button onClick={() => handleProjectHandover(lead)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-100">
                              <CheckCircle size={14} /> Final Handover
                            </button>
                        ) : (
                            <button onClick={() => handleOpenQuote(lead)} className="p-3 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                              <ClipboardList size={20} />
                            </button>
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
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
           <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Quick-Inject Lead</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Manual Acquisition Protocol</p>
                  </div>
                  <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2"><X size={24}/></button>
              </div>
              <form onSubmit={handleCreateLead} className="p-10 space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
                          <input required name="company" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. Acme Corp" />
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Name</label>
                          <input required name="name" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. John Doe" />
                      </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                          <input required name="email" type="email" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="client@domain.com" />
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                          <input required name="phone" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="+91" />
                      </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Estimated Value (₹)</label>
                          <input required name="value" type="number" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="50000" />
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Acquisition Source</label>
                          <select name="source" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none appearance-none cursor-pointer">
                              {Object.values(LeadSource).map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sales Priority</label>
                          <select name="priority" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none appearance-none cursor-pointer">
                              <option value="Hot">🔥 Hot</option>
                              <option value="Warm">☀️ Warm</option>
                              <option value="Cold">❄️ Cold</option>
                          </select>
                      </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Initial Status</label>
                          <select name="status" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none appearance-none cursor-pointer">
                              {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Next Follow-Up</label>
                          <input name="nextFollowUp" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                      </div>
                  </div>
                  <div className="pt-6 flex gap-4">
                       <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 py-5 text-slate-500 font-black text-sm hover:bg-slate-50 rounded-3xl transition-all uppercase tracking-widest">Abort</button>
                       <button type="submit" className="flex-[2] py-5 bg-slate-900 text-white font-black text-sm rounded-3xl hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                          <Zap size={18} className="text-brand-400" /> Inject Into Pipeline
                       </button>
                  </div>
              </form>
           </div>
        </div>
      )}

      {/* LEAD EDIT MODAL */}
      {editLead && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
           <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h2 className="text-xl font-black text-slate-900">Modify Lead Node</h2>
                  <button onClick={() => setEditLead(null)} className="text-slate-400 hover:text-slate-600 p-2"><X size={20}/></button>
              </div>
              <form onSubmit={handleSaveLeadEdit} className="p-8 space-y-6">
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lead Priority</label>
                      <select 
                        value={editLead.priority}
                        onChange={(e) => setEditLead({ ...editLead, priority: e.target.value as any })}
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer"
                      >
                         <option value="Hot">🔥 Hot</option>
                         <option value="Warm">☀️ Warm</option>
                         <option value="Cold">❄️ Cold</option>
                      </select>
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Acquisition Source</label>
                      <select 
                        value={editLead.source}
                        onChange={(e) => setEditLead({ ...editLead, source: e.target.value as any })}
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer"
                      >
                         {Object.values(LeadSource).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Agent</label>
                      <input 
                        value={editLead.assignedTo}
                        onChange={(e) => setEditLead({ ...editLead, assignedTo: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                      />
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Next Follow-Up</label>
                      <div className="relative">
                        <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                          type="date"
                          value={editLead.nextFollowUp || ''}
                          onChange={(e) => setEditLead({ ...editLead, nextFollowUp: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                        />
                      </div>
                  </div>
                  <div className="pt-4 flex gap-3">
                       <button type="button" onClick={() => setEditLead(null)} className="flex-1 py-4 text-slate-500 font-black text-sm hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                       <button type="submit" className="flex-1 py-4 bg-slate-900 text-white font-black text-sm rounded-2xl hover:bg-slate-800 shadow-xl shadow-slate-200">Apply Changes</button>
                  </div>
              </form>
           </div>
        </div>
      )}

      {/* STRATEGIC TIERED QUOTATION BUILDER MODAL */}
      {isQuoteOpen && selectedLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-xl animate-in fade-in duration-300">
           <div className={`bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 transition-all ${quotePreview ? 'max-w-6xl w-full h-[90vh]' : 'max-w-4xl w-full'}`}>
              {!quotePreview ? (
                <div className="flex flex-col h-[80vh]">
                   <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><ClipboardList size={24}/></div>
                         <div>
                            <h2 className="text-2xl font-black text-slate-900">Strategic Proposal Builder</h2>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Client: {selectedLead.company}</p>
                         </div>
                      </div>
                      <div className="flex gap-2">
                         {[1, 2, 3].map(s => (
                           <div key={s} className={`w-3 h-3 rounded-full ${quoteStep >= s ? 'bg-brand-600' : 'bg-slate-200'}`}></div>
                         ))}
                      </div>
                      <button onClick={() => setIsQuoteOpen(false)} className="text-slate-400 hover:text-slate-600 p-2"><X size={24}/></button>
                   </div>

                   <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                      {quoteStep === 1 && (
                         <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div>
                               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2"><Target size={18} className="text-brand-600"/> Phase 1: Strategic Alignment</h3>
                               <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">Define the high-level vision for this implementation. These fields will appear on page 1 of the official proposal.</p>
                            </div>
                            <div className="space-y-6">
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Overview</label>
                                  <textarea 
                                    value={builderData.overview}
                                    onChange={(e) => setBuilderData({...builderData, overview: e.target.value})}
                                    rows={4} 
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-3xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none" 
                                    placeholder="Summarize the client's current situation and the gap our system fills..." 
                                  />
                               </div>
                               <div className="space-y-2">
                                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Core Objective</label>
                                  <textarea 
                                    value={builderData.objective}
                                    onChange={(e) => setBuilderData({...builderData, objective: e.target.value})}
                                    rows={3} 
                                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-3xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none" 
                                    placeholder="What is the primary goal of this digitization?" 
                                  />
                               </div>
                            </div>
                         </div>
                      )}

                      {quoteStep === 2 && (
                         <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div>
                               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2"><LayoutGrid size={18} className="text-brand-600"/> Phase 2: Tier Matrix Architecture</h3>
                               <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">Map requested modules across our standard 3-plan structure. Define the "depth" of each feature per tier.</p>
                            </div>

                            <div className="overflow-x-auto border border-slate-100 rounded-[32px] shadow-sm">
                               <table className="w-full text-left">
                                  <thead className="bg-slate-50/50 border-b border-slate-100">
                                     <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Module Component</th>
                                        {builderData.plans.map((plan, i) => (
                                          <th key={i} className="px-6 py-4 text-[10px] font-black text-slate-900 uppercase text-center">{plan.name}</th>
                                        ))}
                                     </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                     {modules.filter(m => builderData.selectedModuleIds.includes(m.id)).map(m => (
                                       <tr key={m.id}>
                                          <td className="px-6 py-5">
                                             <div className="font-black text-slate-800 text-sm">{m.name}</div>
                                          </td>
                                          {builderData.plans.map((plan, pi) => (
                                            <td key={pi} className="px-6 py-5 text-center">
                                               <select 
                                                 value={plan.featureLevels[m.id] || 'N/A'}
                                                 onChange={(e) => setFeatureLevel(pi, m.id, e.target.value)}
                                                 className="text-[10px] font-black uppercase tracking-tighter bg-slate-100 border-none rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                                               >
                                                  <option value="N/A">X Not Included</option>
                                                  <option value="Basic">Basic</option>
                                                  <option value="Partial">Partial</option>
                                                  <option value="Standard">Standard</option>
                                                  <option value="Advanced">Advanced</option>
                                                  <option value="Full">Full Access</option>
                                               </select>
                                            </td>
                                          ))}
                                       </tr>
                                     ))}
                                  </tbody>
                               </table>
                            </div>
                         </div>
                      )}

                      {quoteStep === 3 && (
                         <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div>
                               <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2"><IndianRupee size={18} className="text-brand-600"/> Phase 3: Commercial Finalization</h3>
                               <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">Adjust pricing, timelines, and target segments for each tier to maximize conversion.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                               {builderData.plans.map((plan, i) => (
                                 <div key={i} className={`p-8 rounded-[40px] border-2 transition-all ${i === 1 ? 'border-brand-600 bg-brand-50/20 shadow-xl' : 'border-slate-100 bg-white'}`}>
                                    <h4 className="font-black text-slate-900 text-center mb-6">{plan.name}</h4>
                                    <div className="space-y-4">
                                       <div className="space-y-1">
                                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tier Price (₹)</label>
                                          <input 
                                            type="number" 
                                            value={plan.price}
                                            onChange={(e) => updatePlanField(i, 'price', Number(e.target.value))}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-brand-500" 
                                          />
                                       </div>
                                       <div className="space-y-1">
                                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Timeline</label>
                                          <input 
                                            value={plan.timeline}
                                            onChange={(e) => updatePlanField(i, 'timeline', e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-brand-500" 
                                          />
                                       </div>
                                       <div className="space-y-1">
                                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Ideal Client Segment</label>
                                          <input 
                                            value={plan.idealFor}
                                            onChange={(e) => updatePlanField(i, 'idealFor', e.target.value)}
                                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-brand-500" 
                                          />
                                       </div>
                                    </div>
                                 </div>
                               ))}
                            </div>
                         </div>
                      )}
                   </div>

                   <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                      <button 
                        disabled={quoteStep === 1}
                        onClick={() => setQuoteStep(s => s - 1)}
                        className="px-8 py-4 text-slate-400 font-black text-sm uppercase tracking-widest disabled:opacity-30"
                      >
                         Previous Phase
                      </button>
                      
                      {quoteStep < 3 ? (
                        <button 
                          onClick={() => setQuoteStep(s => s + 1)}
                          className="px-12 py-5 bg-slate-900 text-white font-black text-sm rounded-3xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center gap-3 uppercase tracking-[0.2em]"
                        >
                           Next Phase <ChevronRight size={18} />
                        </button>
                      ) : (
                        <button 
                          onClick={generateQuotation}
                          className="px-12 py-5 bg-brand-600 text-white font-black text-sm rounded-3xl hover:bg-brand-700 transition-all shadow-xl shadow-brand-100 flex items-center gap-3 uppercase tracking-[0.2em]"
                        >
                           Compile Proposal <Zap size={18} />
                        </button>
                      )}
                   </div>
                </div>
              ) : (
                <div className="flex h-[90vh]">
                   <div className="flex-1 bg-slate-100/50 p-10 overflow-y-auto custom-scrollbar no-print">
                      {/* FORMAL PROPOSAL PREVIEW - PDF STYLE */}
                      <div id="quotation-print-area" className="bg-white p-0 flex flex-col font-sans border border-slate-100 text-slate-900">
                         
                         {/* PAGE 1: STRATEGY & IDENTITY */}
                         <div className="p-16 min-h-[1100px] flex flex-col page-break relative">
                            <div className="flex justify-between items-start border-b-8 border-slate-900 pb-12 mb-12">
                               <div>
                                  <div className="w-16 h-16 bg-slate-900 text-white rounded-[18px] flex items-center justify-center font-black text-3xl mb-4 shadow-xl">V</div>
                                  <h1 className="text-3xl font-black tracking-tighter uppercase mb-0.5">VSW DATA SOLUTIONS</h1>
                                  <div className="flex items-center gap-2 text-brand-600 font-black text-[9px] uppercase tracking-[0.3em]">
                                     <Briefcase size={10} /> Enterprise Digital Architecture
                                  </div>
                               </div>
                               <div className="text-right">
                                  <h2 className="text-5xl font-black text-slate-900 mb-1 leading-none">PROPOSAL</h2>
                                  <p className="text-[9px] font-black text-slate-400 tracking-widest">PROPOSAL ID: {quotePreview.id}</p>
                                  <p className="text-[9px] font-black text-slate-400 mt-0.5 uppercase">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                               </div>
                            </div>

                            <div className="mb-12">
                               <div className="flex items-center gap-3 text-slate-900 mb-6">
                                  <FileText size={24} className="text-brand-600" />
                                  <h2 className="text-2xl font-black tracking-tight">{selectedLead.company} – Strategic Platform Proposal</h2>
                               </div>
                               <div className="grid grid-cols-2 gap-12 bg-slate-50 p-8 rounded-[32px] border border-slate-100 mb-12">
                                  <div>
                                     <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">Proposed By</p>
                                     <p className="font-black text-slate-900">VSW Data Solutions</p>
                                     <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">Bidar, Karnataka | 7090160422</p>
                                  </div>
                                  <div className="text-right">
                                     <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2">Prepared For</p>
                                     <p className="font-black text-slate-900">{selectedLead.company}</p>
                                     <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">{selectedLead.name} | {selectedLead.phone}</p>
                                  </div>
                               </div>

                               <div className="space-y-12">
                                  <div>
                                     <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-3 mb-6 flex items-center gap-2">
                                        <Zap size={14} className="text-brand-600" /> Project Overview
                                     </h3>
                                     <p className="text-sm text-slate-600 font-medium leading-relaxed">{quotePreview.projectOverview}</p>
                                     <div className="mt-6 flex items-start gap-4 p-6 bg-brand-50 rounded-2xl border border-brand-100">
                                        <Target size={20} className="text-brand-600 mt-1" />
                                        <div>
                                           <p className="text-[10px] font-black text-brand-800 uppercase tracking-widest mb-1">Objective</p>
                                           <p className="text-sm text-slate-900 font-bold leading-relaxed">{quotePreview.objective}</p>
                                        </div>
                                     </div>
                                  </div>

                                  <div>
                                     <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-3 mb-6 flex items-center gap-2">
                                        <LayoutGrid size={14} className="text-brand-600" /> Core Modules (Requested)
                                     </h3>
                                     <div className="grid grid-cols-2 gap-y-4 gap-x-12">
                                        {quotePreview.coreModules.map((m, i) => (
                                          <div key={m.id} className="flex items-center gap-3">
                                             <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">{i + 1}</div>
                                             <span className="text-sm font-bold text-slate-800">{m.name}</span>
                                          </div>
                                        ))}
                                     </div>
                                  </div>
                               </div>
                            </div>
                         </div>

                         {/* PAGE 2: COMPARISON & PRICING */}
                         <div className="p-16 min-h-[1100px] flex flex-col page-break relative">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-3 mb-8 flex items-center gap-2">
                               <CheckCircle size={14} className="text-brand-600" /> Plan Comparison Matrix
                            </h3>

                            <div className="overflow-hidden border border-slate-200 rounded-[32px] mb-12">
                               <table className="w-full text-left">
                                  <thead>
                                     <tr className="bg-slate-900 text-white">
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest">Module / Feature</th>
                                        {quotePreview.plans.map((p, i) => (
                                          <th key={i} className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-center">
                                             <div className="flex flex-col items-center gap-1">
                                                <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-green-400' : i === 1 ? 'bg-brand-400' : 'bg-purple-400'}`}></div>
                                                {p.name}
                                             </div>
                                          </th>
                                        ))}
                                     </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                     {quotePreview.coreModules.map(m => (
                                       <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                                          <td className="px-6 py-4">
                                             <div className="text-xs font-black text-slate-900">{m.name}</div>
                                          </td>
                                          {quotePreview.plans.map((plan, pi) => {
                                             const level = plan.featureLevels[m.id];
                                             return (
                                               <td key={pi} className="px-6 py-4 text-center">
                                                  {(!level || level === 'N/A') ? (
                                                    <X size={14} className="text-red-300 mx-auto" />
                                                  ) : (
                                                    <div className="flex flex-col items-center gap-0.5">
                                                       <Check size={14} className="text-green-500" />
                                                       <span className="text-[9px] font-black uppercase text-slate-400">{level}</span>
                                                    </div>
                                                  )}
                                               </td>
                                             );
                                          })}
                                       </tr>
                                     ))}
                                  </tbody>
                               </table>
                            </div>

                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-3 mb-8 flex items-center gap-2">
                               <IndianRupee size={14} className="text-brand-600" /> Investment Summary
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                               {quotePreview.plans.map((p, i) => (
                                 <div key={i} className={`p-8 rounded-[40px] border relative ${i === 1 ? 'bg-brand-900 text-white shadow-2xl border-brand-900' : 'bg-white border-slate-200 shadow-sm'}`}>
                                    {i === 1 && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1 rounded-full border border-brand-600">Recommended</div>}
                                    <div className="text-center">
                                       <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${i === 1 ? 'text-brand-300' : 'text-slate-400'}`}>{p.name}</div>
                                       <div className="text-xs font-bold mb-4 h-8 flex items-center justify-center">{p.idealFor}</div>
                                       <div className={`text-3xl font-black mb-6 ${i === 1 ? 'text-white' : 'text-slate-900'}`}>{formatINR(p.price)}</div>
                                       <div className={`text-[9px] font-black uppercase mb-4 py-2 border-y border-opacity-20 ${i === 1 ? 'border-white' : 'border-slate-200'}`}>Timeline: {p.timeline}</div>
                                    </div>
                                    <div className="space-y-3">
                                       <div className="flex items-center gap-2">
                                          <CheckCircle size={12} className={i === 1 ? 'text-brand-400' : 'text-green-500'} />
                                          <span className="text-[10px] font-bold">Design & Architecture</span>
                                       </div>
                                       <div className="flex items-center gap-2">
                                          <CheckCircle size={12} className={i === 1 ? 'text-brand-400' : 'text-green-500'} />
                                          <span className="text-[10px] font-bold">Core Dev & Testing</span>
                                       </div>
                                       <div className="flex items-center gap-2">
                                          <CheckCircle size={12} className={i === 1 ? 'text-brand-400' : 'text-green-500'} />
                                          <span className="text-[10px] font-bold">Deployment & Cloud</span>
                                       </div>
                                    </div>
                                 </div>
                               ))}
                            </div>
                         </div>

                         {/* PAGE 3: TERMS & CLOSING */}
                         <div className="p-16 min-h-[1100px] flex flex-col relative">
                            <div className="grid grid-cols-2 gap-16 mb-16">
                               <div>
                                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-3 mb-8 flex items-center gap-2">
                                     <CreditCard size={14} className="text-brand-600" /> Payment Terms
                                  </h3>
                                  <div className="space-y-6">
                                     <div className="flex justify-between items-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div>
                                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Advance (Start)</p>
                                           <p className="text-sm font-black text-slate-900 tracking-tight">Project Unlock</p>
                                        </div>
                                        <div className="text-xl font-black text-brand-600">30%</div>
                                     </div>
                                     <div className="flex justify-between items-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div>
                                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">After Review</p>
                                           <p className="text-sm font-black text-slate-900 tracking-tight">Functional Demo</p>
                                        </div>
                                        <div className="text-xl font-black text-brand-600">40%</div>
                                     </div>
                                     <div className="flex justify-between items-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div>
                                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Final Delivery</p>
                                           <p className="text-sm font-black text-slate-900 tracking-tight">Production Go-Live</p>
                                        </div>
                                        <div className="text-xl font-black text-brand-600">30%</div>
                                     </div>
                                  </div>
                               </div>

                               <div>
                                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-3 mb-8 flex items-center gap-2">
                                     <Rocket size={14} className="text-brand-600" /> Business Benefits
                                  </h3>
                                  <div className="space-y-4">
                                     {quotePreview.benefits.map((benefit, i) => (
                                       <div key={i} className="flex items-start gap-3">
                                          <div className="mt-1"><Check size={16} className="text-green-500" /></div>
                                          <span className="text-sm font-bold text-slate-700">{benefit}</span>
                                       </div>
                                     ))}
                                  </div>
                               </div>
                            </div>

                            <div className="mt-auto">
                               <div className="bg-slate-900 text-white p-16 rounded-[48px] mb-12">
                                  <div className="flex items-center gap-3 mb-6">
                                     <Share2 size={24} className="text-brand-400" />
                                     <h3 className="text-2xl font-black uppercase tracking-widest">Closing Note</h3>
                                  </div>
                                  <p className="text-sm font-medium leading-relaxed opacity-80 mb-8">
                                     This system is custom-designed for **{selectedLead.company}** to provide complete control over {selectedLead.requirements?.serviceType || 'operations'} with long-term scalability. 
                                     Once the plan is finalized, development will start immediately upon advance payment receipt.
                                  </p>
                                  <div className="flex justify-between items-end">
                                     <div>
                                        <p className="text-lg font-black tracking-tight">Thank you for the opportunity.</p>
                                        <p className="text-brand-400 font-black uppercase tracking-[0.3em] text-[10px] mt-2">VSW Data Solutions Executive Hub</p>
                                     </div>
                                     <div className="text-right">
                                        <div className="w-48 h-px bg-white/20 mb-2 ml-auto"></div>
                                        <p className="text-[10px] font-black uppercase tracking-widest">Authorized Digitized Release</p>
                                     </div>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* PROPOSAL ACTIONS CONTROL PANEL */}
                   <div className="w-full lg:w-[400px] bg-white p-12 flex flex-col border-l border-slate-100 shadow-2xl relative z-10 no-print">
                      <div className="mb-12">
                         <div className="flex items-center gap-2 text-brand-600 mb-2 font-black text-[10px] uppercase tracking-widest">
                            <Zap size={14} /> Control Actions
                         </div>
                         <h3 className="text-3xl font-black text-slate-900 tracking-tight">Dispatch Hub</h3>
                         <p className="text-sm text-slate-500 font-medium mt-1">Deploy this enterprise-grade proposal to {selectedLead.company}.</p>
                      </div>

                      <div className="space-y-4 flex-1">
                         <button 
                           onClick={() => {
                              updateLead(selectedLead.id, { 
                                 status: LeadStatus.PROPOSAL_SENT, 
                                 value: quotePreview.plans[1].price 
                              });
                              setIsQuoteOpen(false);
                           }} 
                           className="w-full py-6 bg-brand-600 text-white font-black rounded-[24px] hover:bg-brand-700 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-brand-100 active:scale-95"
                         >
                            <Send size={22} /> Push to Pipeline
                         </button>
                         <button onClick={() => window.print()} className="w-full py-6 bg-slate-900 text-white font-black rounded-[24px] hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95">
                            <Printer size={22} /> Export Official PDF
                         </button>
                         <button onClick={() => setQuotePreview(null)} className="w-full py-6 bg-slate-50 text-slate-500 font-black rounded-[24px] hover:bg-slate-100 transition-all active:scale-95">
                            Modify Strategic Mix
                         </button>
                      </div>

                      <div className="mt-8 p-6 bg-slate-50 rounded-[24px] border border-slate-100">
                         <div className="flex items-center gap-2 text-slate-400 mb-3 text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck size={14} /> System Security
                         </div>
                         <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">All enterprise proposals are stored in the VSW immutable cloud ledger for audit compliance.</p>
                      </div>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
