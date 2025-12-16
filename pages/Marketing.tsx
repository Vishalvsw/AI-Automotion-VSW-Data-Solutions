
import React, { useState } from 'react';
import { MOCK_CAMPAIGNS } from '../services/mockData';
import { MarketingCampaign } from '../types';
import { Megaphone, Plus, TrendingUp, Users, Target, X } from 'lucide-react';

const Marketing: React.FC = () => {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(MOCK_CAMPAIGNS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleAddCampaign = (e: React.FormEvent) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const newCampaign: MarketingCampaign = {
          id: String(Date.now()),
          name: formData.get('name') as string,
          platform: formData.get('platform') as any,
          status: 'Active',
          budget: Number(formData.get('budget')),
          leadsGenerated: 0
      };
      setCampaigns([...campaigns, newCampaign]);
      setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between sm:flex-row sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Marketing Channels</h1>
          <p className="text-slate-500">Track ROI and ad spend across platforms.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-brand-600 rounded-xl hover:bg-brand-700 transition-colors shadow-sm shadow-brand-200">
          <Plus size={16} className="mr-2" />
          New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
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
                   <div className="text-xl font-bold text-slate-900">₹{(campaign.leadsGenerated > 0 ? campaign.budget / campaign.leadsGenerated : 0).toFixed(0)}</div>
                 </div>
               </div>
            </div>
          </div>
        ))}
        
        <button onClick={() => setIsModalOpen(true)} className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-brand-300 hover:text-brand-500 hover:bg-brand-50/10 transition-all min-h-[250px]">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
             <Plus size={24} />
          </div>
          <span className="font-bold text-sm">Launch New Campaign</span>
        </button>
      </div>

      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-900">New Campaign</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                </div>
                <form onSubmit={handleAddCampaign} className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Campaign Name</label>
                        <input required name="name" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="e.g. Summer Promo" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Platform</label>
                        <select name="platform" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                            <option value="Facebook">Facebook</option>
                            <option value="Instagram">Instagram</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Email">Email</option>
                        </select>
                    </div>
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Budget (₹)</label>
                        <input required name="budget" type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="50000" />
                    </div>
                    <div className="pt-2 flex justify-end gap-2">
                         <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium text-sm hover:bg-slate-50 rounded-lg">Cancel</button>
                         <button type="submit" className="px-4 py-2 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800">Launch</button>
                    </div>
                </form>
            </div>
          </div>
      )}
    </div>
  );
};

export default Marketing;
