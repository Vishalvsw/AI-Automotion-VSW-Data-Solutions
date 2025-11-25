
import React from 'react';
import { MOCK_CAMPAIGNS } from '../services/mockData';
import { Megaphone, Plus, TrendingUp, Users, Target } from 'lucide-react';

const Marketing: React.FC = () => {
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
          <h1 className="text-2xl font-bold text-slate-900">Marketing Channels</h1>
          <p className="text-slate-500">Track ROI and ad spend across platforms.</p>
        </div>
        <button className="flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-brand-600 rounded-xl hover:bg-brand-700 transition-colors shadow-sm shadow-brand-200">
          <Plus size={16} className="mr-2" />
          New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_CAMPAIGNS.map((campaign) => (
          <div key={campaign.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-md
                   ${campaign.platform === 'Instagram' ? 'bg-gradient-to-tr from-yellow-400 to-purple-600' : 
                     campaign.platform === 'LinkedIn' ? 'bg-blue-700' : 'bg-slate-700'}
                `}>
                  <Megaphone size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 leading-tight">{campaign.name}</h3>
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{campaign.platform}</span>
                </div>
              </div>
              <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${
                campaign.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-50 text-slate-500 border-slate-100'
              }`}>
                {campaign.status}
              </span>
            </div>
            
            <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-xs mb-1">
                     <span className="text-slate-500">Budget Usage</span>
                     <span className="text-slate-900 font-bold">{formatINR(campaign.budget)}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                     <div className="bg-slate-900 h-2 rounded-full" style={{width: '75%'}}></div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-3 pt-2">
                 <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                   <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-wide mb-1">
                     <Users size={12} /> Leads
                   </div>
                   <div className="text-xl font-bold text-slate-900">{campaign.leadsGenerated}</div>
                 </div>
                 <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                   <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-wide mb-1">
                     <Target size={12} /> CPL
                   </div>
                   <div className="text-xl font-bold text-slate-900">₹{(campaign.budget / campaign.leadsGenerated).toFixed(0)}</div>
                 </div>
               </div>
            </div>
          </div>
        ))}
        
        <button className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-brand-300 hover:text-brand-500 hover:bg-brand-50/10 transition-all min-h-[250px]">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
             <Plus size={24} />
          </div>
          <span className="font-bold text-sm">Launch New Campaign</span>
        </button>
      </div>
    </div>
  );
};

export default Marketing;
