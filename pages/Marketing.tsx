
import React, { useState } from 'react';
import { MOCK_CAMPAIGNS } from '../services/mockData';
import { MarketingCampaign } from '../types';
import { Megaphone, Plus, TrendingUp, Users, Target, X, Sparkles, Image as ImageIcon, Loader2, Download, Zap } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const Marketing: React.FC = () => {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(MOCK_CAMPAIGNS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'campaigns' | 'creative'>('campaigns');
  
  // AI Creative State
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const handleGenerateCreative = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: `High-end professional advertising creative for: ${prompt}. Professional lighting, 4k, marketing aesthetic.` }] },
        config: { imageConfig: { aspectRatio: "1:1" } }
      });

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col justify-between sm:flex-row sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Market Intelligence</h1>
          <p className="text-slate-500 font-medium">Growth nodes and creative infrastructure.</p>
        </div>
        <div className="flex bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm">
           <button onClick={() => setActiveTab('campaigns')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'campaigns' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Active Campaigns</button>
           <button onClick={() => setActiveTab('creative')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'creative' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>AI Creative Engine</button>
        </div>
      </div>

      {activeTab === 'campaigns' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl ${campaign.platform === 'Instagram' ? 'bg-gradient-to-tr from-yellow-400 to-purple-600' : 'bg-slate-900'}`}>
                    <Megaphone size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-lg leading-tight">{campaign.name}</h3>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{campaign.platform}</span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-50 text-green-600 text-[8px] font-black uppercase tracking-widest rounded-full border border-green-100">Active</span>
              </div>
              
              <div className="space-y-6">
                 <div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                       <span>Allocation</span>
                       <span className="text-slate-900">{formatINR(campaign.budget)}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                       <div className="bg-slate-900 h-full rounded-full transition-all duration-1000" style={{width: '65%'}}></div>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Generated</div>
                     <div className="text-2xl font-black text-slate-900">{campaign.leadsGenerated}</div>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Unit Cost</div>
                     <div className="text-xl font-black text-slate-900">₹{(campaign.leadsGenerated > 0 ? campaign.budget / campaign.leadsGenerated : 0).toFixed(0)}</div>
                   </div>
                 </div>
              </div>
            </div>
          ))}
          <button onClick={() => setIsModalOpen(true)} className="border-4 border-dashed border-slate-100 rounded-[40px] p-8 flex flex-col items-center justify-center text-slate-300 hover:border-brand-200 hover:bg-brand-50/20 transition-all min-h-[300px] group">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Plus size={32} /></div>
            <span className="font-black text-xs uppercase tracking-widest">New Growth Node</span>
          </button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           <div className="bg-white p-12 rounded-[50px] border border-slate-100 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5"><Zap size={150} /></div>
              <div className="relative z-10">
                 <h2 className="text-2xl font-black text-slate-900 flex items-center gap-4 mb-2">
                    <Sparkles className="text-brand-500" size={32} />
                    Neural Creative Architect
                 </h2>
                 <p className="text-slate-500 font-medium mb-10 max-w-lg">Describe your ad vision, and the Intelligence layer will synthesize a high-conversion visual concept.</p>
                 
                 <div className="space-y-6">
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g. Minimalist software dashboard for a logistics enterprise, vibrant blue accents, professional photography..."
                      className="w-full p-8 bg-slate-50 border-2 border-transparent focus:border-brand-500 focus:bg-white rounded-[32px] font-bold text-lg outline-none transition-all shadow-inner resize-none h-40"
                    />
                    <button 
                      onClick={handleGenerateCreative}
                      disabled={isGenerating || !prompt.trim()}
                      className="w-full py-6 bg-slate-900 text-white font-black text-sm uppercase tracking-[0.2em] rounded-[24px] shadow-2xl shadow-slate-200 hover:bg-brand-600 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                    >
                      {isGenerating ? <Loader2 className="animate-spin" size={24} /> : <><Sparkles size={20} /> Synthesize Visual Node</>}
                    </button>
                 </div>
              </div>
           </div>

           {generatedImage && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in zoom-in duration-500">
                <div className="bg-white p-4 rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden group">
                   <img src={generatedImage} alt="Generated Creative" className="w-full h-auto rounded-[32px] group-hover:scale-105 transition-transform duration-1000" />
                </div>
                <div className="bg-slate-900 text-white p-10 rounded-[40px] shadow-2xl flex flex-col justify-center">
                   <div className="px-4 py-2 bg-brand-500/20 text-brand-400 rounded-xl text-[10px] font-black uppercase tracking-widest w-fit mb-6">Generated Concept 01</div>
                   <h3 className="text-2xl font-black mb-4">Tactical Visual Analysis</h3>
                   <p className="text-slate-400 font-medium leading-relaxed mb-8">This asset is optimized for high-conversion Instagram feeds. The color palette targets enterprise trust while maintaining modern aesthetic velocity.</p>
                   <div className="flex gap-4">
                      <button onClick={() => { const link = document.createElement('a'); link.href = generatedImage!; link.download = 'vsw-creative.png'; link.click(); }} className="flex-1 py-4 bg-white text-slate-900 font-black rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-50 transition-all"><Download size={16} /> Asset Storage</button>
                      <button className="flex-1 py-4 bg-brand-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-brand-700 transition-all"><Zap size={16} /> Deploy to Ads</button>
                   </div>
                </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default Marketing;
