
import React, { useState } from 'react';
import { MOCK_INVOICES } from '../services/mockData';
import { Invoice } from '../types';
import { Download, Plus, FileText, TrendingUp, AlertCircle, CheckCircle, CreditCard, Smartphone, X, Loader2, QrCode, Lock } from 'lucide-react';

const Finance: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'UPI'>('RAZORPAY');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
  const pendingAmount = invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue').reduce((acc, curr) => acc + curr.amount, 0);

  const handlePayNow = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentSuccess(false);
    setPaymentMethod('RAZORPAY'); // Default
    setPaymentModalOpen(true);
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    
    // Simulate Payment Gateway interaction
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      // Update local state to show as Paid
      if (selectedInvoice) {
        setInvoices(prev => prev.map(inv => 
          inv.id === selectedInvoice.id ? { ...inv, status: 'Paid' } : inv
        ));
      }

      // Close modal after showing success for a moment
      setTimeout(() => {
        setPaymentModalOpen(false);
        setSelectedInvoice(null);
      }, 2000);
    }, 2000);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const newInvoice: Invoice = {
          id: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
          client: formData.get('client') as string,
          amount: Number(formData.get('amount')),
          date: new Date().toISOString().split('T')[0],
          status: 'Pending'
      };
      setInvoices([newInvoice, ...invoices]);
      setIsCreateModalOpen(false);
  };

  // UPI QR Data generation (Standard UPI String format)
  const getUPIString = () => {
    if (!selectedInvoice) return '';
    const merchantVPA = 'vswdatasolutions@upi'; 
    const merchantName = 'VSW Data Solutions';
    return `upi://pay?pa=${merchantVPA}&pn=${encodeURIComponent(merchantName)}&am=${selectedInvoice.amount}&cu=INR&tn=Inv-${selectedInvoice.id}`;
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(getUPIString())}`;

  return (
    <div className="space-y-8 relative">
      <div className="flex flex-col justify-between sm:flex-row sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Finance & Billing</h1>
          <p className="text-slate-500">Manage invoices, payments, and agency revenue.</p>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center justify-center px-4 py-2.5 text-sm font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
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
            <div className="text-2xl font-bold text-slate-900">{invoices.length}</div>
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
              {invoices.map((invoice) => (
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
                    <div className="flex items-center justify-end gap-3">
                        {invoice.status !== 'Paid' && (
                            <button 
                                onClick={() => handlePayNow(invoice)}
                                className="px-3 py-1.5 bg-brand-600 text-white text-xs font-bold rounded-lg hover:bg-brand-700 transition-colors shadow-sm shadow-brand-100"
                            >
                                Pay Now
                            </button>
                        )}
                        <button className="text-slate-500 hover:text-brand-600 font-medium text-xs flex items-center justify-end gap-1 transition-colors">
                        <Download size={16} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE INVOICE MODAL */}
      {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-900">New Invoice</h2>
                    <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                </div>
                <form onSubmit={handleCreateInvoice} className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Client Name</label>
                        <input required name="client" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="e.g. City Hospital" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Amount (₹)</label>
                        <input required name="amount" type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="250000" />
                    </div>
                    <div className="pt-2 flex justify-end gap-2">
                         <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium text-sm hover:bg-slate-50 rounded-lg">Cancel</button>
                         <button type="submit" className="px-4 py-2 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800">Generate</button>
                    </div>
                </form>
            </div>
          </div>
      )}

      {/* PAYMENT MODAL */}
      {paymentModalOpen && selectedInvoice && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
               {paymentSuccess ? (
                   <div className="p-8 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                       <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                           <CheckCircle size={32} />
                       </div>
                       <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h2>
                       <p className="text-slate-500">Invoice {selectedInvoice.id} has been marked as paid.</p>
                       <p className="font-bold text-slate-900 mt-2 text-xl">{formatINR(selectedInvoice.amount)}</p>
                   </div>
               ) : (
                   <>
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Complete Payment</h2>
                            <p className="text-xs text-slate-500">{selectedInvoice.client}</p>
                        </div>
                        <button onClick={() => setPaymentModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className="p-6">
                        <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                            <span className="text-sm font-medium text-slate-500">Total Amount</span>
                            <span className="text-2xl font-bold text-slate-900">{formatINR(selectedInvoice.amount)}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <button 
                                onClick={() => setPaymentMethod('RAZORPAY')}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'RAZORPAY' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
                            >
                                <CreditCard size={24} className="mb-2" />
                                <span className="text-xs font-bold">Cards / Netbanking</span>
                            </button>
                            <button 
                                onClick={() => setPaymentMethod('UPI')}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${paymentMethod === 'UPI' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
                            >
                                <Smartphone size={24} className="mb-2" />
                                <span className="text-xs font-bold">UPI / QR</span>
                            </button>
                        </div>

                        {paymentMethod === 'RAZORPAY' ? (
                            <div className="space-y-4">
                                <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded-lg">
                                    <strong>Razorpay Secure:</strong> You will be redirected to the secure gateway to complete your transaction via Credit Card, Debit Card, or Netbanking.
                                </div>
                                <button 
                                    onClick={handleProcessPayment}
                                    disabled={isProcessing}
                                    className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-200 transition-all flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? <Loader2 className="animate-spin" size={20} /> : 'Pay via Razorpay'}
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center space-y-4">
                                <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                                    <img src={qrCodeUrl} alt="UPI QR" className="w-48 h-48 object-contain" />
                                </div>
                                <div className="text-center">
                                    <p className="text-xs font-bold text-slate-900 mb-1">Scan to Pay {formatINR(selectedInvoice.amount)}</p>
                                    <p className="text-[10px] text-slate-400">Supported by PhonePe, GPay, Paytm</p>
                                </div>
                                <button 
                                    onClick={handleProcessPayment}
                                    disabled={isProcessing}
                                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? <Loader2 className="animate-spin" size={20} /> : 'I have completed payment'}
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                        <Lock size={12} /> Encrypted & Secure
                    </div>
                   </>
               )}
            </div>
         </div>
      )}
    </div>
  );
};

export default Finance;
