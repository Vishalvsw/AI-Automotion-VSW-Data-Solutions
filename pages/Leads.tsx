
import React, { useState } from 'react';
import { LeadStatus, Lead, UserRole, ActivityType, User, QuotationModule, Quotation } from '../types';
import { Search, Filter, Plus, Phone, Mail, FileText, CheckCircle, Calendar, AlertCircle, LayoutGrid, List, MoreHorizontal, X, User as UserIcon, Tag, DollarSign, Send, Printer, ShieldCheck, Edit3 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface LeadsProps {
  user: User;
}

const MODULE_PRICE = 20000;

const STANDARD_MODULES: QuotationModule[] = [
  { id: 'm1', name: 'User Authentication & RBAC', description: 'Login, Signup, JWT, Roles', price: MODULE_PRICE },
  { id: 'm2', name: 'Admin Dashboard', description: 'Analytics, User Management, Reports', price: MODULE_PRICE },
  { id: 'm3', name: 'Payment Gateway Integration', description: 'Razorpay / Stripe / UPI', price: MODULE_PRICE },
  { id: 'm4', name: 'CRM Module', description: 'Leads, Contacts, Pipeline Tracking', price: MODULE_PRICE },
  { id: 'm5', name: 'Inventory Management', description: 'Stock, SKU, Warehouse sync', price: MODULE_PRICE },
  { id: 'm6', name: 'Custom API Development', description: 'REST/GraphQL Third-party sync', price: MODULE_PRICE },
];

const Leads: React.FC<LeadsProps> = ({ user }) => {
  const { leads, updateLead, addLead } = useApp();
  
  // Filter leads based on BDA assignment
  const myLeads = user.role === UserRole.BDA 
    ? leads.filter(l => l.assignedTo.toLowerCase().includes(user.name.split(' ')[0].toLowerCase()) || l.assignedTo === user.name)
    : leads;

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [filterOverdue, setFilterOverdue] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Quotation State
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [customModuleName, setCustomModuleName] = useState('');
  const [quotePreview, setQuotePreview] = useState<Quotation | null>(null);

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

  const filteredLeads = filterOverdue ? myLeads.filter(l => isOverdue(l.nextFollowUp)) : myLeads;

  const handleOpenQuoteGenerator = (lead: Lead) => {
    setSelectedLead(lead);
    setIsQuoteModalOpen(true);
    setSelectedModules([]);
    setQuotePreview(null);
  };

  const handleOpenEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsEditModalOpen(true);
  };

  const handleSaveLeadEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    const formData = new FormData(e.target as HTMLFormElement);
    const updates = {
      name: formData.get('name') as string,
      company: formData.get('company') as string,
      email: formData.get('email') as string,
      value: Number(formData.get('value')),
      status: formData.get('status') as LeadStatus,
      nextFollowUp: formData.get('nextFollowUp') as string,
    };
    updateLead(selectedLead.id, updates);
    setIsEditModalOpen(false);
    setSelectedLead(null);
  };

  const toggleModule = (moduleId: string) => {
    setSelectedModules(prev => 
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  };

  const generateQuotePreview = () => {
    if (!selectedLead) return;
    const modules = STANDARD_MODULES.filter(m => selectedModules.includes(m.id));
    
    // Support for custom module if name is provided
    if (customModuleName) {
      modules.push({ 
        id: `custom-${Date.now()}`, 
        name: customModuleName, 
        description: 'Special project requirement', 
        price: MODULE_PRICE 
      });
    }

    const total = modules.length * MODULE_PRICE;
    const tax = total * 0.18; 

    const quote: Quotation = {
      id: `QTN-${Date.now().toString().slice(-6)}`,
      leadId: selectedLead.id,
      modules,
      totalAmount: total,
      tax: tax,
      grandTotal: total + tax,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setQuotePreview(quote);
  };

  const handleFinalizeQuote = () => {
    if (!selectedLead || !quotePreview) return;
    updateLead(selectedLead.id, {
      status: LeadStatus.PROPOSAL_SENT,
      value: quotePreview.grandTotal,
      activities: [...(selectedLead.activities || []), {
        type: ActivityType.QUOTATION,
        date: new Date().toISOString().split('T')[0],
        note: `Generated Quote ${quotePreview.id} for ${formatINR(quotePreview.grandTotal)}`
      }]
    });
    setIsQuoteModalOpen(false);
    setQuotePreview(null);
  };

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW: return 'bg-blue-100 text-blue-700 border-blue-200';
      case LeadStatus.CONTACTED: return 'bg-amber-100 text-amber-700 border-amber-200';
      case LeadStatus.MEETING_SCHEDULED: return 'bg-purple-100 text-purple-700 border-purple-200';
      case LeadStatus.PROPOSAL_SENT: return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case LeadStatus.CLOSED_WON: return 'bg-green-100 text-green-700 border-green-200';
      case LeadStatus.CLOSED_LOST: return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6 relative h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">CRM & Pipeline</h1>
          <p className="text-slate-500">Day 1-4 Closing Engine • {myLeads.length} Total Accounts</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
              <button onClick={() => setViewMode('list')} className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}><List size={18} /></button>
              <button onClick={() => setViewMode('kanban')} className={`p-2 rounded-md ${viewMode === 'kanban' ? 'bg-slate-100 text-slate-900' : 'text-slate-400'}`}><LayoutGrid size={18} /></button>
           </div>
           <button onClick={() => setIsAddModalOpen(true)} className="flex items-center px-4 py-2.5 text-sm font-bold text-white bg-brand-600 rounded-xl hover:bg-brand-700 shadow-lg shadow-brand-200">
            <Plus size={18} className="mr-2" /> New Lead
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search accounts..." className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" />
          </div>
          <div className="flex gap-2">
             <button onClick={() => setFilterOverdue(!filterOverdue)} className={`flex items-center px-4 py-2 text-xs font-bold border rounded-xl transition-all ${filterOverdue ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-600 border-slate-200'}`}>
              <AlertCircle size={14} className="mr-2" /> Overdue
            </button>
             <button className="flex items-center px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl">
              <Filter size={14} className="mr-2" /> Filter
            </button>
          </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-[10px] text-slate-400 uppercase tracking-widest bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-black">Account</th>
                <th className="px-6 py-4 font-black">Pipeline Value</th>
                <th className="px-6 py-4 font-black">Closing Stage</th>
                <th className="px-6 py-4 font-black">Next Action</th>
                <th className="px-6 py-4 font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 font-bold border border-brand-100">
                        {lead.company.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                           {lead.company}
                           <button onClick={() => handleOpenEditLead(lead)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-brand-600 transition-all"><Edit3 size={12}/></button>
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">{lead.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">{formatINR(lead.value)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center gap-2 text-[10px] font-bold px-2 py-1 rounded-lg w-fit ${isOverdue(lead.nextFollowUp) ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-500'}`}>
                      <Calendar size={12} /> {lead.nextFollowUp || 'TBD'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenQuoteGenerator(lead)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-50 text-brand-600 rounded-lg text-xs font-bold hover:bg-brand-600 hover:text-white transition-all shadow-sm"
                      >
                        <FileText size={14} /> Quotation
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QUICK EDIT LEAD MODAL */}
      {isEditModalOpen && selectedLead && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <h2 className="text-xl font-bold text-slate-900">Edit Lead Record</h2>
                 <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full"><X size={20}/></button>
              </div>
              <form onSubmit={handleSaveLeadEdit} className="p-8 space-y-4">
                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Company Name</label>
                    <input name="company" defaultValue={selectedLead.company} required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm font-bold" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Primary Contact</label>
                        <input name="name" defaultValue={selectedLead.name} required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm font-bold" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Deal Value (₹)</label>
                        <input name="value" type="number" defaultValue={selectedLead.value} required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm font-bold" />
                    </div>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Status</label>
                    <select name="status" defaultValue={selectedLead.status} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm font-bold bg-white">
                        {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Next Follow-up</label>
                    <input name="nextFollowUp" type="date" defaultValue={selectedLead.nextFollowUp} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none text-sm font-bold" />
                 </div>
                 <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl">Cancel</button>
                    <button type="submit" className="flex-1 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all">Update Lead</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* QUOTATION GENERATOR MODAL */}
      {isQuoteModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300">
           <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 transition-all ${quotePreview ? 'max-w-4xl w-full' : 'max-w-xl w-full'}`}>
              {!quotePreview ? (
                <div className="flex flex-col h-full">
                  <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                     <div>
                        <h2 className="text-xl font-bold text-slate-900">Configure Quotation</h2>
                        <p className="text-xs text-slate-500 font-medium">Auto-pricing: ₹20,000 / Module</p>
                     </div>
                     <button onClick={() => setIsQuoteModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full"><X size={20}/></button>
                  </div>
                  <div className="p-8 space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {STANDARD_MODULES.map(module => (
                           <button 
                             key={module.id}
                             onClick={() => toggleModule(module.id)}
                             className={`p-4 rounded-2xl border-2 text-left transition-all group ${selectedModules.includes(module.id) ? 'border-brand-600 bg-brand-50 ring-4 ring-brand-50' : 'border-slate-100 hover:border-slate-200'}`}
                           >
                              <div className="flex justify-between items-start mb-1">
                                 <span className={`text-sm font-bold ${selectedModules.includes(module.id) ? 'text-brand-700' : 'text-slate-800'}`}>{module.name}</span>
                                 {selectedModules.includes(module.id) && <CheckCircle size={16} className="text-brand-600" />}
                              </div>
                              <p className="text-[10px] text-slate-400 font-medium leading-tight">{module.description}</p>
                           </button>
                        ))}
                     </div>
                     
                     <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Add Custom Module (Dynamic Price: ₹20k)</label>
                        <input 
                           type="text" 
                           placeholder="Enter custom requirement name..." 
                           value={customModuleName}
                           onChange={(e) => setCustomModuleName(e.target.value)}
                           className="w-full px-4 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                        />
                     </div>
                     
                     <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                        <div>
                           <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Est. Base Total</div>
                           <div className="text-2xl font-black text-slate-900">{formatINR((selectedModules.length + (customModuleName ? 1 : 0)) * MODULE_PRICE)}</div>
                        </div>
                        <button 
                          disabled={selectedModules.length === 0 && !customModuleName}
                          onClick={generateQuotePreview}
                          className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-200 flex items-center gap-2"
                        >
                           Preview Quote <Plus size={18} />
                        </button>
                     </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
                   <div className="flex-1 bg-slate-100 p-8 overflow-y-auto custom-scrollbar">
                      <div className="bg-white rounded-lg shadow-2xl p-10 max-w-[800px] mx-auto min-h-[1000px] flex flex-col font-sans">
                         <div className="flex justify-between items-start border-b-4 border-slate-900 pb-8 mb-10">
                            <div>
                               <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-2xl mb-4">V</div>
                               <h1 className="text-2xl font-black text-slate-900 tracking-tighter">VSW DATA SOLUTIONS</h1>
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Enterprise Application Hub</p>
                            </div>
                            <div className="text-right">
                               <h2 className="text-3xl font-black text-slate-900 mb-2">QUOTATION</h2>
                               <p className="text-xs font-bold text-slate-400">#{quotePreview.id}</p>
                               <p className="text-xs font-bold text-slate-400">Date: {quotePreview.createdAt}</p>
                            </div>
                         </div>

                         <div className="grid grid-cols-2 gap-10 mb-12">
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Client Profile</p>
                               <p className="font-black text-slate-900">{selectedLead.company}</p>
                               <p className="text-sm font-bold text-slate-500">{selectedLead.name}</p>
                               <p className="text-sm text-slate-500">{selectedLead.email}</p>
                            </div>
                            <div className="text-right">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Prepared By</p>
                               <p className="font-black text-slate-900">VSW Sales Engine</p>
                               <p className="text-sm font-bold text-slate-500">{user.name}</p>
                            </div>
                         </div>

                         <table className="w-full mb-12">
                            <thead>
                               <tr className="border-b-2 border-slate-900">
                                  <th className="text-left py-4 text-[10px] font-black text-slate-900 uppercase">Module Component</th>
                                  <th className="text-right py-4 text-[10px] font-black text-slate-900 uppercase">Unit Price</th>
                               </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                               {quotePreview.modules.map(m => (
                                 <tr key={m.id}>
                                    <td className="py-4">
                                       <div className="font-bold text-slate-900">{m.name}</div>
                                       <div className="text-[10px] text-slate-400 font-medium">{m.description}</div>
                                    </td>
                                    <td className="py-4 text-right font-bold text-slate-900">{formatINR(m.price)}</td>
                                 </tr>
                               ))}
                            </tbody>
                         </table>

                         <div className="mt-auto border-t-2 border-slate-900 pt-8 flex justify-end">
                            <div className="w-64 space-y-3">
                               <div className="flex justify-between text-sm font-bold text-slate-500">
                                  <span>Subtotal</span>
                                  <span>{formatINR(quotePreview.totalAmount)}</span>
                               </div>
                               <div className="flex justify-between text-sm font-bold text-slate-500">
                                  <span>GST (18%)</span>
                                  <span>{formatINR(quotePreview.tax)}</span>
                               </div>
                               <div className="flex justify-between text-xl font-black text-slate-900 pt-3 border-t border-slate-100">
                                  <span>Total</span>
                                  <span>{formatINR(quotePreview.grandTotal)}</span>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>

                   <div className="w-full lg:w-80 bg-white p-8 flex flex-col border-l border-slate-100 shadow-xl">
                      <div className="mb-8">
                         <h3 className="font-black text-slate-900 mb-2">Actions</h3>
                         <p className="text-xs text-slate-500 font-medium leading-relaxed">Generated quote will update the lead value in the pipeline.</p>
                      </div>
                      <div className="space-y-3 flex-1">
                         <button onClick={handleFinalizeQuote} className="w-full py-4 bg-brand-600 text-white font-black rounded-2xl hover:bg-brand-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-brand-100">
                            <Send size={18} /> Send & Update
                         </button>
                         <button onClick={() => window.print()} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                            <Printer size={18} /> Print Preview
                         </button>
                         <button onClick={() => setQuotePreview(null)} className="w-full py-4 bg-slate-50 text-slate-600 font-black rounded-2xl hover:bg-slate-100 transition-all">
                            Edit Modules
                         </button>
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
