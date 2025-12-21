
import React, { useState, useEffect } from 'react';
import { LeadStatus, Lead, UserRole, User, Quotation, QuotationPlan, ProjectStatus, LeadSource, ActivityType, QuotationModule } from '../types';
import { Search, List, LayoutGrid, X, ClipboardList, Zap, Send, Printer, ArrowRight, CheckCircle, AlertCircle, IndianRupee, Tag, ShieldCheck, Briefcase, Filter, Edit2, Plus, Calendar, Share2, Target, FileText, ChevronRight, Check, Minus, CreditCard, Rocket, Trash2, Lock } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LeadsProps {
  user: User;
}

const Leads: React.FC<LeadsProps> = ({ user }) => {
  const { leads, updateLead, addLead, deleteLead, addProject, modules } = useApp();
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
    .filter(l => filterPriority === 'All' ? true : l.priority === filterPriority);

  const handleOpenQuote = (lead: Lead) => {
    if (!canEditLead(lead)) return;
    setSelectedLead(lead);
    setIsQuoteOpen(true);
    setQuoteStep(1);
    setQuotePreview(null);
    
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
    if (!isAdmin) return;
    const newProject = {
      id: `prj-${Date.now()}`,
      title: `${lead.company} - Platform Build`,
      client: lead.company,
      status: ProjectStatus.REQUIREMENTS,
      dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      progress: 0,
      notes: 'Handed over from sales funnel.',
      financials: { basePrice: lead.value, total: lead.value, advance: 0, stage1: 0, stage2: 0, stage3: 0, totalPaid: 0, balance: -lead.value },
      techMilestones: { demo: false, frontend: false, backend: false, deployment: false, domain: false, api: false },
      tasks: [{ id: 't1', title: 'Onboarding & Scope Lock', assignee: 'Founder', priority: 'High' }]
    };
    addProject(newProject);
    updateLead(lead.id, { status: LeadStatus.CLOSED_WON });
  };

  const handleDeleteLead = (id: string) => {
    if (isAdmin && confirm('System Override: Permanent node deletion?')) {
      deleteLead(id);
    }
  };

  return (
    <div className="space-y-6 relative h-full flex flex-col">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #quotation-print-area, #quotation-print-area * { visibility: visible; }
          #quotation-print-area { position: absolute; left: 0; top: 0; width: 100%; padding: 0; margin: 0; box-shadow: none; border: none; background: white; }
          .page-break { page-break-after: always; }
          .no-print { display: none !important; }
        }
      `}</style>

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
                const isEditable = canEditLead(lead);
                
                return (
                  <tr key={lead.id} className={`transition-all group ${isEditable ? 'hover:bg-slate-50/80' : 'opacity-60 grayscale-[0.5]'}`}>
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
                        {!isEditable ? (
                          <div className="p-3 text-slate-300 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2" title="Locked to Owner">
                             <Lock size={16} />
                             <span className="text-[9px] font-black uppercase tracking-widest">Locked</span>
                          </div>
                        ) : (
                          <>
                            <button onClick={() => setEditLead(lead)} className="p-3 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-2xl transition-all">
                                <Edit2 size={18} />
                            </button>
                            {lead.status === LeadStatus.PROPOSAL_SENT && isAdmin ? (
                                <button onClick={() => handleProjectHandover(lead)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-100">
                                  <CheckCircle size={14} /> Handover
                                </button>
                            ) : (
                                <button onClick={() => handleOpenQuote(lead)} className="p-3 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                  <ClipboardList size={20} />
                                </button>
                            )}
                            {isAdmin && (
                               <button onClick={() => handleDeleteLead(lead.id)} className="p-3 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all">
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
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
           <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Quick-Inject Lead</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Manual Acquisition Protocol</p>
                  </div>
                  <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2"><X size={24}/></button>
              </div>
              <form onSubmit={(e) => {
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
                  assignedTo: isAdmin ? formData.get('assignedTo') as string : user.name,
                  activities: [{ type: ActivityType.MEETING, date: new Date().toISOString(), note: 'Injected into pipeline.' }]
                };
                addLead(newLead);
                setIsCreateModalOpen(false);
              }} className="p-10 space-y-8">
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
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign Agent</label>
                          {isAdmin ? (
                            <input name="assignedTo" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Enter BDA Name" />
                          ) : (
                            <input readOnly value={user.name} className="w-full px-5 py-4 bg-slate-100 border-none rounded-2xl font-bold text-sm text-slate-400 outline-none" />
                          )}
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
              <form onSubmit={(e) => {
                e.preventDefault();
                updateLead(editLead.id, editLead);
                setEditLead(null);
              }} className="p-8 space-y-6">
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
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assigned Agent</label>
                      <input 
                        disabled={!isAdmin}
                        value={editLead.assignedTo}
                        onChange={(e) => setEditLead({ ...editLead, assignedTo: e.target.value })}
                        className={`w-full px-4 py-3 border-none rounded-2xl font-bold text-sm outline-none ${isAdmin ? 'bg-slate-50 focus:ring-2 focus:ring-brand-500' : 'bg-slate-100 text-slate-400'}`}
                      />
                  </div>
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status Protocol</label>
                      <select 
                        value={editLead.status}
                        onChange={(e) => setEditLead({ ...editLead, status: e.target.value as LeadStatus })}
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none cursor-pointer"
                      >
                         {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                  </div>
                  <div className="pt-4 flex gap-3">
                       <button type="button" onClick={() => setEditLead(null)} className="flex-1 py-4 text-slate-500 font-black text-sm hover:bg-slate-50 rounded-2xl transition-all">Cancel</button>
                       <button type="submit" className="flex-1 py-4 bg-slate-900 text-white font-black text-sm rounded-2xl hover:bg-slate-800 shadow-xl shadow-slate-200">Apply Changes</button>
                  </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
