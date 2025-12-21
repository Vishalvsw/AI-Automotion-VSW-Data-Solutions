
import React, { useState } from 'react';
import { LeadStatus, Lead, UserRole, User, LeadSource, LeadPriority } from '../types';
import { Search, List, LayoutGrid, Plus, Download, Filter, MessageSquare, Globe, UserCheck, Megaphone, Phone, AlertCircle, Sparkles, Edit2, Trash2, Lock, ArrowRight, IndianRupee } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';

interface LeadsProps { user: User; }

const Leads: React.FC<LeadsProps> = ({ user }) => {
  const { leads, deleteLead } = useApp();
  const isAdmin = user.role === UserRole.FOUNDER;
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');

  const myLeads = isAdmin ? leads : leads.filter(l => l.assignedTo === user.name);
  const filteredLeads = myLeads.filter(l => (filterPriority === 'All' ? true : l.priority === filterPriority) && (l.company.toLowerCase().includes(searchQuery.toLowerCase()) || l.name.toLowerCase().includes(searchQuery.toLowerCase())));

  const exportToExcel = () => {
    const headers = ['Company', 'Name', 'Email', 'Phone', 'Value', 'Status', 'Priority', 'Agent'];
    const rows = filteredLeads.map(l => [l.company, l.name, l.email, l.phone, l.value, l.status, l.priority, l.assignedTo]);
    const csv = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `VSW_Pipeline_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  const formatINR = (v: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-3xl font-black text-slate-900 tracking-tight">Lead Intelligence</h1><p className="text-slate-500 font-medium">{isAdmin ? 'Global Pipeline Visibility' : 'My Active Portfolio'}</p></div>
        <div className="flex gap-3">
           <button onClick={exportToExcel} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 text-slate-600 transition-all shadow-sm" title="Export Excel/Sheets"><Download size={18} /></button>
           <button className="px-5 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center gap-2 shadow-xl"><Plus size={16} /> Quick-Inject</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
         <div className="relative flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="text" placeholder="Filter entities..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl text-sm font-bold outline-none border-none"/></div>
         <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="px-6 py-3 bg-slate-50 border-none rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none cursor-pointer"><option value="All">All Tiers</option><option value="Hot">🔥 Hot</option><option value="Warm">☀️ Warm</option><option value="Cold">❄️ Cold</option></select>
      </div>

      <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
         <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 text-[10px] text-slate-400 font-black uppercase tracking-widest border-b border-slate-100">
               <tr><th className="px-8 py-5">Node Identity</th><th className="px-6 py-5">Value Index</th><th className="px-6 py-5">Protocol Status</th><th className="px-8 py-5 text-right">Command</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {filteredLeads.map(l => (
                 <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${l.priority === 'Hot' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-400'}`}>{l.company.charAt(0)}</div>
                          <div><div className="font-black text-slate-900">{l.company}</div><div className="text-[10px] text-slate-400 font-bold uppercase">{l.name}</div></div>
                       </div>
                    </td>
                    <td className="px-6 py-5 font-black text-slate-900">{formatINR(l.value)}</td>
                    <td className="px-6 py-5"><span className="px-3 py-1 bg-slate-50 text-[9px] font-black uppercase tracking-widest rounded-full border border-slate-100">{l.status}</span></td>
                    <td className="px-8 py-5 text-right"><Link to={`/leads/${l.id}`} className="p-3 text-brand-600 hover:bg-brand-50 rounded-2xl transition-all inline-block"><ArrowRight size={18}/></Link></td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
};

export default Leads;
