
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { Sparkles, X, MessageSquare, Send, Loader2, Zap, Target, Briefcase, TrendingUp, Volume2, VolumeX, Mic, MicOff, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { User, UserRole } from '../types';
import { useLocation } from 'react-router-dom';

interface CopilotProps {
  user: User;
}

const Copilot: React.FC<CopilotProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: `Systems online. Hello ${user.name.split(' ')[0]}, I'm your OS Intelligence layer. Ready to optimize your workflow.` }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const { leads, projects, invoices } = useApp();
  const location = useLocation();

  // Audio helper functions for PCM decoding
  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
      channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
  };

  const speakResponse = async (text: string) => {
    if (!isVoiceEnabled) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Read this concisely and professionally: ${text}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Zephyr' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.start();
      }
    } catch (err) {
      console.error("Speech synthesis failed", err);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (textOverride?: string) => {
    const query = textOverride || input;
    if (!query.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: query }]);
    if (!textOverride) setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const today = new Date().toISOString().split('T')[0];
      const overdue = leads.filter(l => l.nextFollowUp && l.nextFollowUp < today).map(l => `${l.company} (₹${l.value})`);

      // Build Contextual Snapshot
      const contextSnapshot = {
        role: user.role,
        currentPage: location.pathname,
        stats: {
          totalLeads: leads.length,
          overdueLeads: overdue,
          pipelineValue: leads.reduce((a, b) => a + (b.value || 0), 0),
          activeProjects: projects.filter(p => p.progress < 100).length,
          pendingRevenue: invoices.filter(i => i.status !== 'Paid').reduce((a, b) => a + b.amount, 0)
        }
      };

      const systemInstruction = `
        You are AgencyOS Copilot, the AI brain of VSW Enterprise.
        Current App Data: ${JSON.stringify(contextSnapshot)}.
        
        Rules:
        1. Be incredibly precise. If asked about leads, reference the specific overdue counts if relevant.
        2. Format numbers as Indian Rupees (e.g. ₹1,50,000).
        3. If the user is on /leads, focus on follow-up tactics.
        4. If the user is on /finance, focus on cash flow and AR.
        5. Keep responses under 45 words. 
        6. Act like a world-class COO/CFO.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: query,
        config: {
          systemInstruction,
          temperature: 0.6,
        },
      });

      const aiText = response.text || "Operational data currently inaccessible.";
      setMessages(prev => [...prev, { role: 'ai', text: aiText }]);
      
      if (isVoiceEnabled) {
        speakResponse(aiText);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Systems offline. Check API connectivity." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const getSuggestions = () => {
    const isFounder = user.role === UserRole.FOUNDER;
    
    if (location.pathname === '/leads') {
        return ["Analyze pipeline health", "Draft hot lead follow-up", "Who is overdue?"];
    }
    if (location.pathname === '/finance') {
        return ["Project revenue for Q3", "Identify collection risks", "Summarize paid invoices"];
    }
    
    return isFounder 
      ? ["Daily agency briefing", "Project bottleneck report", "Financial health check"]
      : ["My pending commission", "Next 3 priority nodes", "Summarize my leads"];
  };

  return (
    <div className="fixed bottom-6 right-6 z-[200]">
      {isOpen ? (
        <div className="bg-white/95 backdrop-blur-2xl w-[400px] h-[600px] rounded-[36px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-white flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 fade-in duration-500">
          {/* Header */}
          <div className="p-7 bg-slate-900 text-white flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 blur-[60px] rounded-full"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 bg-brand-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/20">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-tight uppercase">Intelligence Hub</h3>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Context Aware</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 relative z-10">
              <button 
                onClick={() => setIsVoiceEnabled(!isVoiceEnabled)} 
                className={`p-2.5 rounded-xl transition-all ${isVoiceEnabled ? 'bg-brand-500 text-white shadow-lg' : 'bg-white/10 text-white/50 hover:bg-white/20'}`}
                title={isVoiceEnabled ? "Voice Enabled" : "Enable Voice Response"}
              >
                {isVoiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
              <button onClick={() => setIsOpen(false)} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-7 space-y-5 custom-scrollbar bg-slate-50/30">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] p-5 rounded-3xl text-sm leading-relaxed font-semibold shadow-sm ${
                  m.role === 'user' 
                    ? 'bg-slate-900 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none ring-1 ring-slate-100/50'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-5 rounded-3xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Suggestions */}
          <div className="px-7 py-4 flex gap-2 overflow-x-auto no-scrollbar border-t border-slate-100 bg-white">
            {getSuggestions().map((s, i) => (
              <button 
                key={i} 
                onClick={() => handleSend(s)}
                className="whitespace-nowrap px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black text-slate-500 hover:bg-brand-600 hover:text-white hover:border-brand-600 hover:shadow-lg hover:shadow-brand-200 transition-all uppercase tracking-widest"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-7 bg-white pt-2">
            <div className="relative group">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Query system intelligence..."
                className="w-full pl-6 pr-14 py-4.5 bg-slate-50 border-2 border-transparent rounded-[24px] text-sm font-bold text-slate-900 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/5 transition-all outline-none"
              />
              <button 
                onClick={() => handleSend()}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-11 h-11 bg-slate-900 text-white rounded-[18px] flex items-center justify-center hover:bg-brand-600 active:scale-90 transition-all shadow-lg"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[9px] text-slate-400 font-bold text-center mt-4 uppercase tracking-[0.2em]">AgencyOS Core Intelligence Layer v3.2</p>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-18 h-18 bg-slate-900 text-white rounded-[28px] flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:scale-110 active:scale-95 transition-all group relative border-4 border-white"
        >
          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-brand-500 rounded-xl border-4 border-white flex items-center justify-center animate-bounce">
             <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
          <Sparkles size={32} className="group-hover:rotate-12 transition-transform duration-500" />
        </button>
      )}
    </div>
  );
};

export default Copilot;
