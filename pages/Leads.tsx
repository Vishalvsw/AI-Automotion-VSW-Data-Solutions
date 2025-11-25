import React, { useState } from 'react';
import { MOCK_LEADS } from '../services/mockData';
import { LeadStatus } from '../types';
import { Search, Filter, Plus, MoreHorizontal, Phone, Mail } from 'lucide-react';

const Leads: React.FC = () => {
  const [filter, setFilter] = useState('All');

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW: return 'bg-blue-50 text-blue-700';
      case LeadStatus.CONTACTED: return 'bg-yellow-50 text-yellow-700';
      case LeadStatus.MEETING_SCHEDULED: return 'bg-purple-50 text-purple-700';
      case LeadStatus.PROPOSAL_SENT: return 'bg-indigo-50 text-indigo-700';
      case LeadStatus.CLOSED_WON: return 'bg-green-50 text-green-700';
      case LeadStatus.CLOSED_LOST: return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between sm:flex-row sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads & CRM</h1>
          <p className="text-slate-500">Manage your pipeline and sales activities.</p>
        </div>
        <button className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 transition-colors">
          <Plus size={16} className="mr-2" />
          Add New Lead
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search leads by name or company..." 
              className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
             <button className="flex items-center px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
              <Filter size={16} className="mr-2" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold">Name</th>
                <th className="px-6 py-3 font-semibold">Company</th>
                <th className="px-6 py-3 font-semibold">Value</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Last Contact</th>
                <th className="px-6 py-3 font-semibold">Assignee</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LEADS.map((lead) => (
                <tr key={lead.id} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-xs">
                        {lead.name.charAt(0)}
                      </div>
                      {lead.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">{lead.company}</td>
                  <td className="px-6 py-4 text-slate-900 font-medium">{formatINR(lead.value)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{new Date(lead.lastContact).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{lead.assignedTo}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1 text-slate-400 hover:text-brand-600 transition-colors">
                        <Mail size={16} />
                      </button>
                      <button className="p-1 text-slate-400 hover:text-green-600 transition-colors">
                        <Phone size={16} />
                      </button>
                      <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
           <span>Showing 5 of 24 leads</span>
           <div className="flex gap-2">
             <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Previous</button>
             <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">Next</button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Leads;