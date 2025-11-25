
import React from 'react';
import { MOCK_INVOICES } from '../services/mockData';
import { Download, Plus, FileText, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const Finance: React.FC = () => {
  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalRevenue = MOCK_INVOICES.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
  const pendingAmount = MOCK_INVOICES.filter(i => i.status === 'Pending' || i.status === 'Overdue').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between sm:flex-row sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Finance & Billing</h1>
          <p className="text-slate-500">Manage invoices, payments, and agency revenue.</p>
        </div>
        <button className="flex items-center justify-center px-4 py-2.5 text-sm font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
          <Plus size={18} className="mr-2" />
          Create Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-green-50 text-green-600 rounded-lg"><CheckCircle size={20} /></div>
               <span className="text-sm font-medium text-slate-500">Collected Revenue</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{formatINR(totalRevenue)}</div>
         </div>
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg"><TrendingUp size={20} /></div>
               <span className="text-sm font-medium text-slate-500">Outstanding</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{formatINR(pendingAmount)}</div>
         </div>
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText size={20} /></div>
               <span className="text-sm font-medium text-slate-500">Invoices Sent</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{MOCK_INVOICES.length}</div>
         </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Recent Invoices</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold">Invoice Details</th>
                <th className="px-6 py-3 font-semibold">Date Issued</th>
                <th className="px-6 py-3 font-semibold">Amount</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_INVOICES.map((invoice) => (
                <tr key={invoice.id} className="bg-white hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded text-slate-500"><FileText size={18} /></div>
                        <div>
                            <div className="font-bold text-slate-900">{invoice.client}</div>
                            <div className="text-xs text-slate-400 font-mono">{invoice.id}</div>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{new Date(invoice.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{formatINR(invoice.amount)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      invoice.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-100' :
                      invoice.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-500 hover:text-brand-600 font-medium text-xs flex items-center justify-end gap-1 ml-auto transition-colors">
                      <Download size={16} />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Finance;
