import React from 'react';
import { MOCK_INVOICES } from '../services/mockData';
import { Download, Plus, FileText } from 'lucide-react';

const Finance: React.FC = () => {
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
          <h1 className="text-2xl font-bold text-slate-900">Finance</h1>
          <p className="text-slate-500">Invoices, payments, and revenue tracking.</p>
        </div>
        <button className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors">
          <Plus size={16} className="mr-2" />
          Create Invoice
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 font-semibold">Invoice ID</th>
                <th className="px-6 py-3 font-semibold">Client</th>
                <th className="px-6 py-3 font-semibold">Date Issued</th>
                <th className="px-6 py-3 font-semibold">Amount</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_INVOICES.map((invoice) => (
                <tr key={invoice.id} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                    <FileText size={16} className="text-slate-400" />
                    {invoice.id}
                  </td>
                  <td className="px-6 py-4">{invoice.client}</td>
                  <td className="px-6 py-4">{new Date(invoice.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{formatINR(invoice.amount)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      invoice.status === 'Paid' ? 'bg-green-50 text-green-700' :
                      invoice.status === 'Pending' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-brand-600 hover:text-brand-700 font-medium text-xs flex items-center justify-end gap-1 ml-auto">
                      <Download size={14} />
                      PDF
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