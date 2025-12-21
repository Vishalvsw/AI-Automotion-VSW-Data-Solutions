
import React, { useState } from 'react';
import { LeadStatus, Lead, UserRole, User, Quotation, ProjectStatus, LeadSource, ActivityType } from '../types';
import { Search, List, LayoutGrid, X, ClipboardList, Zap, Send, Printer, ArrowRight, CheckCircle, AlertCircle, IndianRupee, Tag, ShieldCheck, Briefcase, Filter, Edit2, Plus, Calendar } from 'lucide-react';
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
  
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [quotePreview, setQuotePreview] = useState<Quotation | null>(null);
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([]);

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
    setQuotePreview(null);
    setSelectedModuleIds([]);
  };

  const handleToggleModule = (moduleId: string) => {
    setSelectedModuleIds(prev => 
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  };

  const calculateTotal = (moduleIds: string[]) => {
    return modules
      .filter(m => moduleIds.includes(m.id))
      .reduce((sum, m) => sum + m.price, 0);
  };

  const generateQuotation = () => {
    if (!selectedLead) return;
    const selectedModules = modules.filter(m => selectedModuleIds.includes(m.id));
    const total = calculateTotal(selectedModuleIds);
    
    setQuotePreview({
      id: `VSW-Q-${Date.now().toString().slice(-4)}`,
      leadId: selectedLead.id,
      modules: selectedModules,
      totalAmount: total,
      tax: total * 0.18,
      grandTotal: total * 1.18,
      createdAt: new Date().toISOString().split('T')[0]
    });
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
          }
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
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{lead.source}</div>
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
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Source</label>
                          <select name="source" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none appearance-none">
                              {Object.values(LeadSource).map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                      </div>
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority</label>
                          <select name="priority" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none appearance-none">
                              <option value="Hot">🔥 Hot</option>
                              <option value="Warm">☀️ Warm</option>
                              <option value="Cold">❄️ Cold</option>
                          </select>
                      </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Initial Status</label>
                          <select name="status" className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none appearance-none">
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
                  <h2 className="text-xl font-black text-slate-900">Edit Lead Node</h2>
                  <button onClick={() => setEditLead(null)} className="text-slate-400 hover:text-slate-600 p-2"><X size={20}/></button>
              </div>
              <form onSubmit={handleSaveLeadEdit} className="p-8 space-y-6">
                  <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lead Priority</label>
                      <select 
                        value={editLead.priority}
                        onChange={(e) => setEditLead({ ...editLead, priority: e.target.value as any })}
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none"
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
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none"
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
                       <button type="submit" className="flex-1 py-4 bg-slate-900 text-white font-black text-sm rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">Save Intelligence</button>
                  </div>
              </form>
           </div>
        </div>
      )}

      {/* QUOTATION BUILDER MODAL */}
      {isQuoteOpen && selectedLead && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-xl animate-in fade-in duration-300">
           <div className={`bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 transition-all ${quotePreview ? 'max-w-6xl w-full h-[90vh]' : 'max-w-3xl w-full'}`}>
              {!quotePreview ? (
                <div className="p-12 space-y-10">
                   <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 text-brand-600 mb-2">
                           <ShieldCheck size={20} />
                           <span className="text-[10px] font-black uppercase tracking-[0.2em]">Solution Architecture Node</span>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Quote Builder</h2>
                        <p className="text-slate-400 font-medium text-sm mt-1">Selecting high-performance modules for {selectedLead.company}</p>
                      </div>
                      <button onClick={() => setIsQuoteOpen(false)} className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={24}/></button>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                      {modules.map(m => {
                        const isSelected = selectedModuleIds.includes(m.id);
                        return (
                          <button 
                            key={m.id}
                            onClick={() => handleToggleModule(m.id)}
                            className={`p-6 rounded-3xl border-2 text-left transition-all relative ${
                               isSelected 
                               ? 'border-brand-600 bg-brand-50 shadow-lg shadow-brand-50' 
                               : 'border-slate-50 hover:border-slate-200 bg-slate-50/50'
                            }`}
                          >
                             {isSelected && <div className="absolute top-4 right-4 text-brand-600"><CheckCircle size={20} fill="currentColor" className="text-white" /></div>}
                             <div className="font-black text-slate-900 text-sm mb-1">{m.name}</div>
                             <div className="text-[11px] text-slate-500 font-medium leading-relaxed mb-3 line-clamp-2">{m.description}</div>
                             <div className="text-brand-600 font-black text-xs flex items-center gap-1">
                                <IndianRupee size={12} /> {m.price.toLocaleString()}
                             </div>
                          </button>
                        );
                      })}
                   </div>

                   <div className="pt-10 border-t border-slate-100 flex items-center justify-between">
                      <div className="bg-slate-50 px-8 py-5 rounded-[32px] border border-slate-100">
                         <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Architecture Valuation</div>
                         <div className="text-3xl font-black text-slate-900">
                           {formatINR(calculateTotal(selectedModuleIds))}
                         </div>
                      </div>
                      <button 
                        disabled={selectedModuleIds.length === 0}
                        onClick={generateQuotation}
                        className="px-12 py-6 bg-slate-900 text-white font-black rounded-[32px] shadow-2xl shadow-slate-200 hover:bg-slate-800 disabled:opacity-30 transition-all flex items-center gap-3 active:scale-95"
                      >
                         Generate Proposal <ArrowRight size={20} />
                      </button>
                   </div>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row h-full">
                   <div className="flex-1 bg-slate-100/50 p-10 overflow-y-auto custom-scrollbar">
                      {/* FORMAL PDF PRINT AREA */}
                      <div id="quotation-print-area" className="bg-white rounded-[24px] shadow-2xl p-16 max-w-[850px] mx-auto min-h-[1100px] flex flex-col font-sans border border-slate-100 text-slate-900">
                         <div className="flex justify-between items-start border-b-8 border-slate-900 pb-12 mb-12">
                            <div>
                               <div className="w-16 h-16 bg-slate-900 text-white rounded-[18px] flex items-center justify-center font-black text-3xl mb-4 shadow-xl">V</div>
                               <h1 className="text-3xl font-black tracking-tighter uppercase mb-0.5">VSW DATA SOLUTIONS</h1>
                               <div className="flex items-center gap-2 text-brand-600 font-black text-[9px] uppercase tracking-[0.3em]">
                                  <Briefcase size={10} /> Enterprise Digital Architecture
                               </div>
                            </div>
                            <div className="text-right">
                               <h2 className="text-5xl font-black text-slate-900 mb-1 leading-none">QUOTE</h2>
                               <p className="text-[9px] font-black text-slate-400 tracking-widest">PROPOSAL ID: {quotePreview.id}</p>
                               <p className="text-[9px] font-black text-slate-400 mt-0.5 uppercase">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                            </div>
                         </div>

                         <div className="grid grid-cols-2 gap-12 mb-12">
                            <div>
                               <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3">Client Representative</p>
                               <p className="text-xl font-black text-slate-900 leading-tight">{selectedLead.company}</p>
                               <p className="text-sm font-bold text-slate-500 mt-0.5">{selectedLead.name}</p>
                               <div className="mt-3 pt-3 border-t border-slate-100 text-[9px] font-bold text-slate-400 uppercase">Registered Client Node</div>
                            </div>
                            <div className="text-right">
                               <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3">VSW Solution Node</p>
                               <p className="text-xl font-black text-slate-900">Strategy & Data Hub</p>
                               <p className="text-sm font-bold text-slate-500 mt-0.5">Architect: {user.name}</p>
                               <div className="mt-3 pt-3 border-t border-slate-100 text-[9px] font-bold text-slate-400 uppercase">Authorized VSW Associate</div>
                            </div>
                         </div>

                         <div className="mb-12">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3 mb-5 flex items-center gap-2">
                               <Tag size={14} className="text-brand-600" /> Technical Specifications & Scope
                            </h3>
                            <table className="w-full">
                               <thead>
                                  <tr className="border-b-2 border-slate-900">
                                     <th className="text-left py-4 text-[10px] font-black text-slate-900 uppercase">Module Component</th>
                                     <th className="text-right py-4 text-[10px] font-black text-slate-900 uppercase">Investment</th>
                                  </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-100">
                                  {quotePreview.modules.map((m: any) => (
                                    <tr key={m.id}>
                                       <td className="py-6 pr-8">
                                          <div className="font-black text-slate-800 text-base mb-1">{m.name}</div>
                                          <div className="text-xs text-slate-500 font-medium leading-relaxed">{m.description}</div>
                                       </td>
                                       <td className="py-6 text-right font-black text-slate-900 text-base align-top">{formatINR(m.price)}</td>
                                    </tr>
                                  ))}
                               </tbody>
                            </table>
                         </div>

                         <div className="mt-auto pt-10 border-t-4 border-slate-900 flex justify-end">
                            <div className="w-80 space-y-4">
                               <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                  <span>Solutions Total</span>
                                  <span>{formatINR(quotePreview.totalAmount)}</span>
                               </div>
                               <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                  <span>Tax (GST 18%)</span>
                                  <span>{formatINR(quotePreview.tax)}</span>
                               </div>
                               <div className="flex justify-between text-3xl font-black text-slate-900 pt-6 border-t border-slate-100">
                                  <span>Total</span>
                                  <span>{formatINR(quotePreview.grandTotal)}</span>
                               </div>
                            </div>
                         </div>
                         
                         <div className="mt-16 flex justify-between items-end">
                            <div className="max-w-[280px]">
                               <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-3">Legal Terms</p>
                               <p className="text-[9px] text-slate-400 leading-relaxed font-bold uppercase">Validity: 15 Days. Delivery subject to VSW SDLC schedule. Terms and conditions of service apply.</p>
                            </div>
                            <div className="text-right">
                               <div className="w-40 h-px bg-slate-900 mb-2 ml-auto"></div>
                               <p className="text-[9px] font-black text-slate-900 uppercase">VSW Authorized Authorization</p>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* CONTROL PANEL */}
                   <div className="w-full lg:w-[400px] bg-white p-10 flex flex-col border-l border-slate-100 shadow-2xl relative z-10">
                      <div className="mb-10">
                         <div className="flex items-center gap-2 text-brand-600 mb-2 font-black text-[10px] uppercase tracking-widest">
                            <Zap size={14} /> Proposal Control
                         </div>
                         <h3 className="text-3xl font-black text-slate-900 tracking-tight">Transmission Hub</h3>
                         <p className="text-sm text-slate-500 font-medium mt-1">Finalize and dispatch the enterprise proposal.</p>
                      </div>

                      <div className="space-y-4 flex-1">
                         <button 
                           onClick={() => {
                              updateLead(selectedLead.id, { 
                                 status: LeadStatus.PROPOSAL_SENT, 
                                 value: quotePreview.grandTotal 
                              });
                              setIsQuoteOpen(false);
                           }} 
                           className="w-full py-5 bg-brand-600 text-white font-black rounded-[20px] hover:bg-brand-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-100 active:scale-95"
                         >
                            <Send size={20} /> Deploy to Pipeline
                         </button>
                         <button onClick={() => window.print()} className="w-full py-5 bg-slate-900 text-white font-black rounded-[20px] hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-95">
                            <Printer size={20} /> Export Official PDF
                         </button>
                         <button onClick={() => setQuotePreview(null)} className="w-full py-5 bg-slate-50 text-slate-500 font-black rounded-[20px] hover:bg-slate-100 transition-all active:scale-95">
                            Modify Architect Mix
                         </button>
                      </div>

                      <div className="mt-8 p-6 bg-slate-50 rounded-[20px] border border-slate-100">
                         <div className="flex items-center gap-2 text-slate-400 mb-3 text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck size={14} /> Intelligence Sync
                         </div>
                         <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">All quotations are stored in the VSW immutable audit log for compliance.</p>
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
