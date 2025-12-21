
import React, { useState } from 'react';
import { MOCK_INVOICES } from '../services/mockData';
import { Invoice } from '../types';
// Added missing IndianRupee and Zap icons to imports from lucide-react
import { Download, Plus, FileText, TrendingUp, AlertCircle, CheckCircle, CreditCard, Smartphone, X, Loader2, QrCode, Lock, FileSpreadsheet, IndianRupee, Zap } from 'lucide-react';

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

  const exportInvoicesToCSV = () => {
    const headers = ['Invoice ID', 'Client', 'Amount', 'Date', 'Status'];
    const rows = invoices.map(i => [i.id, i.client, i.amount, i.date, i.status]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `AgencyOS_Invoices_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Finance Ledger</h1>
          <p className="text-slate-500 font-medium">Manage liquidity nodes and invoice infrastructure.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportInvoicesToCSV} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-slate-600 flex items-center gap-2 font-bold text-xs" title="Export Ledger to Excel/Sheets">
             <FileSpreadsheet size={18} />
          </button>
          <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center justify-center px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white bg-slate-900 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
            <Plus size={18} className="mr-2" />
            Issue Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-all"><CheckCircle size={60}/></div>
            <div className="flex items-center gap-3 mb-2 relative z-10">
               <div className="p-2 bg-green-50 text-green-600 rounded-lg"><CheckCircle size={20} /></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Collected Node</span>
            </div>
            <div className="text-2xl font-black text-slate-900 relative z-10">{formatINR(totalRevenue)}</div>
         </div>
         <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-all"><TrendingUp size={60}/></div>
            <div className="flex items-center gap-3 mb-2 relative z-10">
               <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><TrendingUp size={20} /></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Accounts Receivable</span>
            </div>
            <div className="text-2xl font-black text-slate-900 relative z-10">{formatINR(pendingAmount)}</div>
         </div>
         <div className="bg-slate-900 text-white p-6 rounded-[24px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-all"><FileText size={60}/></div>
            <div className="flex items-center gap-3 mb-2 relative z-10">
               <div className="p-2 bg-white/10 text-white rounded-lg"><FileText size={20} /></div>
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ledger Count</span>
            </div>
            <div className="text-2xl font-black relative z-10">{invoices.length} Invoices</div>
         </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Maturing Ledger Nodes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-600">
            <thead className="text-[10px] text-slate-400 uppercase tracking-widest bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 font-black">Invoice Infrastructure</th>
                <th className="px-6 py-5 font-black">Issuance Date</th>
                <th className="px-6 py-5 font-black text-center">Protocol Amount</th>
                <th className="px-6 py-5 font-black text-center">Lifecycle</th>
                <th className="px-8 py-5 font-black text-right">Action Cockpit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="bg-white hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-5">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center border border-slate-100 group-hover:bg-brand-50 group-hover:text-brand-600 transition-all"><FileText size={18} /></div>
                        <div>
                            <div className="font-black text-slate-900 text-sm">{invoice.client}</div>
                            <div className="text-[9px] text-slate-400 font-mono font-bold uppercase">{invoice.id}</div>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-5 text-slate-500 font-bold">{new Date(invoice.date).toLocaleDateString()}</td>
                  <td className="px-6 py-5 font-black text-slate-900 text-center">{formatINR(invoice.amount)}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      invoice.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-100' :
                      invoice.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      'bg-red-50 text-red-700 border-red-100'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-3">
                        {invoice.status !== 'Paid' && (
                            <button 
                                onClick={() => handlePayNow(invoice)}
                                className="px-4 py-2 bg-brand-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-100"
                            >
                                Settle Node
                            </button>
                        )}
                        <button className="p-2.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all">
                           <Download size={18} />
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
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-white">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-900 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 blur-[60px] rounded-full"></div>
                    <div className="relative z-10">
                       <h2 className="text-lg font-black uppercase tracking-tight">Issue Protocol</h2>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">New Financial Ledger Entry</p>
                    </div>
                    <button onClick={() => setIsCreateModalOpen(false)} className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all relative z-10"><X size={20}/></button>
                </div>
                <form onSubmit={handleCreateInvoice} className="p-8 space-y-6 bg-white">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Client Entity</label>
                        <input required name="client" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all" placeholder="Legal Entity Name" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Settle Amount (₹)</label>
                        <input required name="amount" type="number" className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl font-black text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all" placeholder="250000" />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                         <button type="button" onClick={() => setIsCreateModalOpen(false)} className="flex-1 py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 rounded-xl transition-all">Abort</button>
                         <button type="submit" className="flex-[2] py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">Generate Ledger Node</button>
                    </div>
                </form>
            </div>
          </div>
      )}

      {/* PAYMENT MODAL */}
      {paymentModalOpen && selectedInvoice && (
         <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-white">
               {paymentSuccess ? (
                   <div className="p-12 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                       <div className="w-20 h-20 bg-green-100 rounded-[32px] flex items-center justify-center text-green-600 mb-6 shadow-xl shadow-green-100">
                           <CheckCircle size={32} />
                       </div>
                       <h2 className="text-3xl font-black text-slate-900 mb-2">Node Settled</h2>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Protocol successful. Revenue established.</p>
                       <p className="font-black text-brand-600 mt-6 text-3xl">{formatINR(selectedInvoice.amount)}</p>
                   </div>
               ) : (
                   <>
                    <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Complete Settlement</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedInvoice.client}</p>
                        </div>
                        <button onClick={() => setPaymentModalOpen(false)} className="p-3 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-slate-600 shadow-sm transition-all">
                            <X size={20} />
                        </button>
                    </div>
                    
                    <div className="p-10 bg-white">
                        <div className="mb-8 bg-slate-900 p-8 rounded-[32px] shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-all"><IndianRupee size={80}/></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Settlement Figure</span>
                            <span className="text-4xl font-black text-white relative z-10">{formatINR(selectedInvoice.amount)}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button 
                                onClick={() => setPaymentMethod('RAZORPAY')}
                                className={`flex flex-col items-center justify-center p-6 rounded-[32px] border-2 transition-all group ${paymentMethod === 'RAZORPAY' ? 'border-brand-600 bg-brand-50/50 text-brand-700 shadow-xl shadow-brand-50' : 'border-slate-50 hover:border-slate-200 text-slate-400'}`}
                            >
                                <CreditCard size={24} className={`mb-3 ${paymentMethod === 'RAZORPAY' ? 'text-brand-600' : 'text-slate-300'}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Cards/Bank</span>
                            </button>
                            <button 
                                onClick={() => setPaymentMethod('UPI')}
                                className={`flex flex-col items-center justify-center p-6 rounded-[32px] border-2 transition-all group ${paymentMethod === 'UPI' ? 'border-brand-600 bg-brand-50/50 text-brand-700 shadow-xl shadow-brand-50' : 'border-slate-50 hover:border-slate-200 text-slate-400'}`}
                            >
                                <Smartphone size={24} className={`mb-3 ${paymentMethod === 'UPI' ? 'text-brand-600' : 'text-slate-300'}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest">UPI/QR Node</span>
                            </button>
                        </div>

                        {paymentMethod === 'RAZORPAY' ? (
                            <div className="space-y-6">
                                <div className="p-4 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest rounded-2xl border border-blue-100 leading-relaxed">
                                    <strong>Razorpay Secure Gateway:</strong> Initializing encrypted bridge for transaction settlement.
                                </div>
                                <button 
                                    onClick={handleProcessPayment}
                                    disabled={isProcessing}
                                    className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl text-sm uppercase tracking-widest shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
                                >
                                    {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <><Zap size={18} /> Authorize Payment</>}
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center space-y-6 animate-in zoom-in-95 duration-300">
                                <div className="bg-white p-4 rounded-[32px] border-2 border-slate-100 shadow-xl">
                                    <img src={qrCodeUrl} alt="UPI QR" className="w-48 h-48 object-contain" />
                                </div>
                                <div className="text-center">
                                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-1">Scan to Settle Node</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase">PhonePe • GPay • BHIM • Office Pay</p>
                                </div>
                                <button 
                                    onClick={handleProcessPayment}
                                    disabled={isProcessing}
                                    className="w-full py-5 bg-slate-900 text-white font-black rounded-3xl text-sm uppercase tracking-widest shadow-2xl shadow-slate-200 transition-all flex items-center justify-center gap-3"
                                >
                                    {isProcessing ? <Loader2 className="animate-spin" size={20} /> : 'Confirm Local Settlement'}
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div className="px-10 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-3 text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">
                        <Lock size={12} /> VSW Encrypted Link • Node: Secure
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
