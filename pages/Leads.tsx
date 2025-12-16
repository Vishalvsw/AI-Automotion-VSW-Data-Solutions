import React, { useState, useEffect } from 'react';
import { MOCK_LEADS, MOCK_USERS } from '../services/mockData';
import { LeadStatus, Lead, UserRole, ActivityType, User } from '../types';
import { Search, Filter, Plus, Phone, Mail, MapPin, MessageSquare, FileText, CheckCircle, Calendar, AlertCircle, LayoutGrid, List, MoreHorizontal, Sparkles, X, User as UserIcon, Tag, DollarSign, Clock, Users } from 'lucide-react';

interface LeadsProps {
  user: User;
}

const Leads: React.FC<LeadsProps> = ({ user }) => {
  // If user is BDA, filter initial leads. Else show all.
  const getInitialLeads = () => {
    if (user.role === UserRole.BDA) {
       return MOCK_LEADS.filter(l => 
          l.assignedTo.toLowerCase().includes(user.name.split(' ')[0].toLowerCase()) ||
          l.assignedTo === user.name
       );
    }
    return MOCK_LEADS;
  };

  const [leads, setLeads] = useState<Lead[]>(getInitialLeads());
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [filterOverdue, setFilterOverdue] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Re-filter if user prop changes (though usually component remounts)
  useEffect(() => {
    setLeads(getInitialLeads());
  }, [user]);

  // Activity Log State
  const [activityNote, setActivityNote] = useState('');
  const [activityType, setActivityType] = useState<ActivityType>(ActivityType.COLD_CALL);
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');

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

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const isOverdue = (dateString?: string) => {
    if (!dateString) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateString) < today;
  };

  const filteredLeads = filterOverdue 
    ? leads.filter(l => isOverdue(l.nextFollowUp)) 
    : leads;

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    // Auto-assign to self if BDA
    const assignedToVal = user.role === UserRole.BDA ? user.name.split(' ')[0] : (formData.get('assignedTo') as string);

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: formData.get('name') as string,
      company: formData.get('company') as string,
      email: formData.get('email') as string,
      value: Number(formData.get('value')),
      status: formData.get('status') as LeadStatus,
      lastContact: new Date().toISOString().split('T')[0],
      nextFollowUp: formData.get('nextFollowUp') as string,
      assignedTo: assignedToVal,
      score: 10, // Default starting score
      tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(t => t),
      source: 'Manual Entry',
      activities: []
    };

    setLeads([newLead, ...leads]);
    setIsAddModalOpen(false);
  };

  const handleOpenActivityModal = (lead: Lead) => {
      setSelectedLead(lead);
      setNextFollowUpDate(lead.nextFollowUp || '');
      setActivityNote('');
      setActivityType(ActivityType.COLD_CALL);
  };

  const handleDateQuickAction = (days: number) => {
      const date = new Date();
      date.setDate(date.getDate() + days);
      setNextFollowUpDate(date.toISOString().split('T')[0]);
  };

  const handleSaveActivity = () => {
      if (!selectedLead) return;

      const newActivity = {
          type: activityType,
          date: new Date().toISOString().split('T')[0],
          note: activityNote || 'No notes added.'
      };

      const updatedLeads = leads.map(l => {
          if (l.id === selectedLead.id) {
              return {
                  ...l,
                  lastContact: new Date().toISOString().split('T')[0],
                  nextFollowUp: nextFollowUpDate,
                  activities: [...(l.activities || []), newActivity]
              };
          }
          return l;
      });

      setLeads(updatedLeads);
      setSelectedLead(null);
  };

  const ActivityButton = ({ icon: Icon, label, type, onClick }: { icon: any, label: string, type?: ActivityType, onClick: () => void }) => (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all gap-2 group ${activityType === type ? 'bg-brand-50 border-brand-500 text-brand-700 ring-1 ring-brand-500' : 'border-slate-200 hover:bg-slate-50 hover:border-brand-200 hover:text-brand-600'}`}
    >
      <Icon size={20} className={activityType === type ? 'text-brand-600' : 'text-slate-400 group-hover:text-brand-600'} />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  return (
    <div className="space-y-6 relative h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {user.role === UserRole.BDA ? 'My Leads' : 'Acquisition & Sales'}
          </h1>
          <p className="text-slate-500">
             {user.role === UserRole.BDA ? 'Manage your assigned pipeline.' : 'Manage company pipeline.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex bg-white border border-slate-200 rounded-lg p-1">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List size={18} />
              </button>
              <button 
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'kanban' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGrid size={18} />
              </button>
           </div>
           <button 
             onClick={() => setIsAddModalOpen(true)}
             className="flex items-center justify-center px-4 py-2.5 text-sm font-bold text-white bg-brand-600 rounded-xl hover:bg-brand-700 transition-all shadow-sm shadow-brand-200"
           >
            <Plus size={18} className="mr-2" />
            Add Lead
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search leads by name, company or tag..." 
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex gap-2">
             <button 
               onClick={() => setFilterOverdue(!filterOverdue)}
               className={`flex items-center px-3 py-2 text-sm font-medium border rounded-lg transition-colors ${filterOverdue ? 'bg-red-50 text-red-700 border-red-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
             >
              <AlertCircle size={16} className="mr-2" />
              Overdue
            </button>
             <button className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
              <Filter size={16} className="mr-2" />
              Filter
            </button>
          </div>
      </div>

      {filteredLeads.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-white border border-slate-200 border-dashed rounded-xl p-10 text-center">
             <div className="bg-slate-50 p-4 rounded-full mb-4"><Users size={32} className="text-slate-400" /></div>
             <h3 className="text-lg font-bold text-slate-900">No leads found</h3>
             <p className="text-slate-500 max-w-sm mx-auto mb-6">
                 {filterOverdue ? 'Good job! No overdue leads.' : 'Your pipeline is empty. Start by adding a new lead.'}
             </p>
             <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg text-sm">Create Lead</button>
          </div>
      ) : (
        <>
        {viewMode === 'list' ? (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Lead Details</th>
                  <th className="px-6 py-4 font-semibold">Value & Score</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Contact Info</th>
                  <th className="px-6 py-4 font-semibold">Next Action</th>
                  {user.role !== UserRole.BDA && <th className="px-6 py-4 font-semibold">Assigned To</th>}
                  <th className="px-6 py-4 font-semibold text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => {
                  const overdue = isOverdue(lead.nextFollowUp);
                  return (
                    <tr key={lead.id} className="bg-white hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-brand-100 to-brand-50 rounded-full flex items-center justify-center text-brand-700 font-bold text-sm border border-brand-100">
                            {lead.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900">{lead.name}</div>
                            <div className="text-xs text-slate-500">{lead.company}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{formatINR(lead.value)}</div>
                        <div className="flex items-center gap-1 mt-1">
                           <div className="flex-1 h-1.5 bg-slate-100 rounded-full w-16">
                              <div className={`h-1.5 rounded-full ${lead.score && lead.score > 70 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{width: `${lead.score}%`}}></div>
                           </div>
                           <span className="text-xs text-slate-400">{lead.score}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs">
                         <div className="flex flex-col gap-1">
                           <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-slate-600 hover:text-brand-600 transition-colors">
                              <Mail size={14} /> {lead.email}
                           </a>
                           {/* Using static phone for now as it's not on Lead type yet, but implying functionality */}
                           <span className="flex items-center gap-2 text-slate-500">
                              <Phone size={14} /> +91 98765 XXXXX
                           </span>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                        {lead.nextFollowUp ? (
                          <div className={`flex items-center gap-2 text-xs font-medium px-2 py-1 rounded-lg w-fit ${overdue ? 'bg-red-50 text-red-700' : 'bg-slate-50 text-slate-600'}`}>
                            {overdue ? <AlertCircle size={14} /> : <Calendar size={14} />}
                            {new Date(lead.nextFollowUp).toLocaleDateString()}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs italic">Not set</span>
                        )}
                      </td>
                      {user.role !== UserRole.BDA && (
                        <td className="px-6 py-4 text-xs font-medium text-slate-500">
                           {lead.assignedTo}
                        </td>
                      )}
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleOpenActivityModal(lead)}
                          className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                        >
                          <MoreHorizontal size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* KANBAN VIEW */
        <div className="flex overflow-x-auto gap-4 pb-4 h-full">
           {[LeadStatus.NEW, LeadStatus.CONTACTED, LeadStatus.MEETING_SCHEDULED, LeadStatus.PROPOSAL_SENT, LeadStatus.CLOSED_WON].map((status) => {
              const leadsInStatus = filteredLeads.filter(l => l.status === status);
              return (
                 <div key={status} className="min-w-[280px] bg-slate-50 rounded-xl border border-slate-200 flex flex-col h-full">
                    <div className="p-3 border-b border-slate-200 font-bold text-sm text-slate-700 flex justify-between items-center sticky top-0 bg-slate-50 rounded-t-xl z-10">
                       {status}
                       <span className="bg-white px-2 py-0.5 rounded text-xs border border-slate-200">{leadsInStatus.length}</span>
                    </div>
                    <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                       {leadsInStatus.map(lead => (
                          <div key={lead.id} onClick={() => handleOpenActivityModal(lead)} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md cursor-pointer transition-all hover:border-brand-300 group">
                             <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{lead.source}</span>
                                {isOverdue(lead.nextFollowUp) && <AlertCircle size={16} className="text-red-500" />}
                             </div>
                             <h4 className="font-bold text-slate-900 text-sm mb-0.5">{lead.name}</h4>
                             <p className="text-xs text-slate-500 mb-3">{lead.company}</p>
                             <div className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-brand-600">{formatINR(lead.value)}</span>
                                <div className={`w-2 h-2 rounded-full ${lead.score && lead.score > 70 ? 'bg-green-500' : 'bg-amber-400'}`}></div>
                             </div>
                             {user.role !== UserRole.BDA && (
                                <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1 border-t border-slate-50 pt-2">
                                   <UserIcon size={10} /> {lead.assignedTo}
                                </div>
                             )}
                          </div>
                       ))}
                    </div>
                 </div>
              )
           })}
        </div>
      )}
      </>
      )}

      {/* CREATE LEAD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <h2 className="text-lg font-bold text-slate-900">Add New Lead</h2>
                 <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={20} />
                 </button>
              </div>
              <form onSubmit={handleAddLead} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-500 uppercase">Lead Name</label>
                       <div className="relative">
                          <UserIcon size={16} className="absolute left-3 top-2.5 text-slate-400" />
                          <input required name="name" type="text" placeholder="John Doe" className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                       </div>
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-500 uppercase">Company</label>
                       <div className="relative">
                          <input required name="company" type="text" placeholder="Acme Corp" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                    <div className="relative">
                       <Mail size={16} className="absolute left-3 top-2.5 text-slate-400" />
                       <input required name="email" type="email" placeholder="john@example.com" className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-500 uppercase">Deal Value (₹)</label>
                       <div className="relative">
                          <DollarSign size={16} className="absolute left-3 top-2.5 text-slate-400" />
                          <input required name="value" type="number" placeholder="500000" className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                       </div>
                    </div>
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                       <select name="status" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white">
                          {Object.values(LeadStatus).map(status => (
                             <option key={status} value={status}>{status}</option>
                          ))}
                       </select>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Next Follow-up</label>
                        <div className="relative">
                           <Calendar size={16} className="absolute left-3 top-2.5 text-slate-400" />
                           <input name="nextFollowUp" type="date" className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                        </div>
                     </div>
                     {/* Only show Assign To if user is NOT BDA */}
                     {user.role !== UserRole.BDA && (
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Assigned To</label>
                            <select name="assignedTo" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none bg-white">
                            {MOCK_USERS.filter(u => u.role === UserRole.BDA || u.role === UserRole.ADMIN).map(u => (
                                <option key={u.id} value={u.name.split(' ')[0]}>{u.name}</option>
                            ))}
                            </select>
                        </div>
                     )}
                 </div>

                 <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Tags</label>
                    <div className="relative">
                       <Tag size={16} className="absolute left-3 top-2.5 text-slate-400" />
                       <input name="tags" type="text" placeholder="Cold, HMS, Urgent (comma separated)" className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" />
                    </div>
                 </div>

                 <div className="pt-4 flex justify-end gap-3">
                    <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-lg transition-all">Cancel</button>
                    <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm shadow-brand-200 transition-all">Create Lead</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Activity Log Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-0 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center text-brand-700 font-bold text-xl">
                    {selectedLead.name.charAt(0)}
                 </div>
                 <div>
                    <h2 className="text-xl font-bold text-slate-900">{selectedLead.name}</h2>
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                       {selectedLead.company} • <span className={`w-2 h-2 rounded-full ${selectedLead.score && selectedLead.score > 70 ? 'bg-green-50' : 'bg-yellow-500'}`}></span> {selectedLead.score} Score
                    </p>
                 </div>
              </div>
              <button onClick={() => setSelectedLead(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <span className="text-2xl leading-none">&times;</span>
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8">
                <ActivityButton type={ActivityType.COLD_CALL} icon={Phone} label="Cold Call" onClick={() => setActivityType(ActivityType.COLD_CALL)} />
                <ActivityButton type={ActivityType.COLD_MESSAGE} icon={MessageSquare} label="WhatsApp" onClick={() => setActivityType(ActivityType.COLD_MESSAGE)} />
                <ActivityButton type={ActivityType.EMAIL} icon={Mail} label="Email" onClick={() => setActivityType(ActivityType.EMAIL)} />
                <ActivityButton type={ActivityType.REQUIREMENTS} icon={Sparkles} label="AI Draft" onClick={() => setActivityType(ActivityType.REQUIREMENTS)} />
                <ActivityButton type={ActivityType.VISIT} icon={MapPin} label="Visit" onClick={() => setActivityType(ActivityType.VISIT)} />
                <ActivityButton type={ActivityType.QUOTATION} icon={FileText} label="Proposal" onClick={() => setActivityType(ActivityType.QUOTATION)} />
                <ActivityButton type={ActivityType.COLD_CALL} icon={Calendar} label="Book Meeting" onClick={() => console.log('Book meeting')} />
                <ActivityButton type={ActivityType.COLD_CALL} icon={CheckCircle} label="Onboard" onClick={() => console.log('Onboard logged')} />
              </div>

              <div className="space-y-5">
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Next Follow-up</label>
                    <div className="flex gap-4">
                       <div className="relative flex-1">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            type="date" 
                            value={nextFollowUpDate}
                            onChange={(e) => setNextFollowUpDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-white" 
                          />
                       </div>
                       <button onClick={() => handleDateQuickAction(2)} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                          +2 Days
                       </button>
                       <button onClick={() => handleDateQuickAction(7)} className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                          +1 Week
                       </button>
                    </div>
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Interaction Notes</label>
                   <textarea 
                     className="w-full p-4 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none shadow-sm"
                     rows={4}
                     value={activityNote}
                     onChange={(e) => setActivityNote(e.target.value)}
                     placeholder={`Enter ${activityType} notes, client objections, or requirements gathered...`}
                   ></textarea>
                </div>

                {selectedLead.activities && selectedLead.activities.length > 0 && (
                   <div className="pt-4 border-t border-slate-100">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Recent Activity</label>
                      <div className="space-y-3">
                         {selectedLead.activities.slice().reverse().map((act, i) => (
                             <div key={i} className="flex gap-3 text-sm">
                                <div className="mt-0.5 text-slate-400"><Clock size={14} /></div>
                                <div>
                                   <div className="font-semibold text-slate-700">{act.type} <span className="text-slate-400 font-normal">• {act.date}</span></div>
                                   <div className="text-slate-600">{act.note}</div>
                                </div>
                             </div>
                         ))}
                      </div>
                   </div>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button 
                onClick={() => setSelectedLead(null)}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveActivity}
                className="px-5 py-2.5 text-sm font-bold bg-brand-600 text-white rounded-xl hover:bg-brand-700 shadow-md shadow-brand-200 transition-all"
              >
                Save Log
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;