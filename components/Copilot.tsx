
import React, { useState, useRef, useEffect } from 'react';
import { 
  Zap, X, Send, Sparkles, MessageSquare, Bot, 
  ChevronDown, Loader2, Mic, MicOff, Volume2, 
  VolumeX, Headphones, Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GoogleGenAI, Modality, LiveServerMessage } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function Copilot() {
  const { leads, projects, user } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "VSW Strategic Intelligence online. How can I assist with your infrastructure today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const liveSessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateContextPrompt = () => {
    const totalValue = leads.reduce((acc, l) => acc + l.value, 0);
    return `
      You are the VSW Enterprise AI Strategist. 
      Total Leads: ${leads.length}
      Pipeline: ₹${totalValue}
      User: ${user?.name || 'Operative'} (${user?.role})
      Rules: Be concise, strategic, and use high-end agency terminology.
    `;
  };

  // --- Audio Utilities ---
  function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  const startVoiceMode = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: generateContextPrompt(),
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setIsListening(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' } });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
              const base64 = msg.serverContent.modelTurn.parts[0].inlineData.data;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const buffer = await decodeAudioData(decode(base64), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(outputCtx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
            }
            if (msg.serverContent?.outputTranscription) {
              setMessages(prev => [...prev, { role: 'model', text: msg.serverContent?.outputTranscription?.text || '' }]);
            }
          },
          onerror: (e) => { console.error(e); stopVoiceMode(); },
          onclose: () => stopVoiceMode(),
        }
      });

      liveSessionRef.current = await sessionPromise;
      setIsVoiceMode(true);
    } catch (err) {
      console.error(err);
      setIsVoiceMode(false);
    }
  };

  const stopVoiceMode = () => {
    liveSessionRef.current?.close();
    liveSessionRef.current = null;
    setIsVoiceMode(false);
    setIsListening(false);
    if (audioContextRef.current) audioContextRef.current.close();
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [{ parts: [{ text: `${generateContextPrompt()}\n\nQuestion: ${userMessage}` }] }],
      });
      setMessages(prev => [...prev, { role: 'model', text: response.text || "Error" }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Layer connection error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 lg:bottom-6 lg:right-6 z-[1000] flex flex-col items-end">
      {isOpen && (
        <div className="w-[calc(100vw-2rem)] sm:w-[420px] h-[70vh] sm:h-[650px] bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-500 mb-4">
          <div className="p-6 sm:p-8 bg-slate-900 text-white flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 blur-[60px] rounded-full"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Zap size={20} className={isVoiceMode ? 'animate-bounce' : 'animate-pulse'} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black uppercase tracking-tight">AI Strategist</h3>
                <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {isVoiceMode ? 'Live Voice Active' : 'Neural Link Ready'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 relative z-10">
               <button 
                onClick={isVoiceMode ? stopVoiceMode : startVoiceMode}
                className={`p-2.5 sm:p-3 rounded-2xl transition-all ${isVoiceMode ? 'bg-red-600 text-white animate-pulse' : 'bg-white/10 text-white hover:bg-white/20'}`}
               >
                 {isVoiceMode ? <MicOff size={16} /> : <Mic size={16} />}
               </button>
               <button onClick={() => setIsOpen(false)} className="p-2.5 sm:p-3 bg-white/10 hover:bg-white/20 rounded-2xl"><ChevronDown size={18}/></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
                <div className={`max-w-[85%] p-4 sm:p-5 rounded-3xl text-sm font-semibold leading-relaxed shadow-sm ${
                  m.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start"><div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 animate-pulse"><Loader2 className="animate-spin text-brand-600" size={18} /></div></div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 sm:p-6 bg-white border-t border-slate-100">
             <div className="relative">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isVoiceMode ? "Voice mode active..." : "Query the pipeline..."}
                  disabled={isVoiceMode}
                  className="w-full pl-5 pr-12 py-4 sm:py-5 bg-slate-50 border-2 border-transparent rounded-[24px] sm:rounded-[32px] text-sm font-bold outline-none focus:bg-white focus:border-brand-500 transition-all shadow-inner disabled:opacity-50"
                />
                {!isVoiceMode && (
                  <button onClick={handleSend} disabled={!input.trim() || isLoading} className={`absolute right-2 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all ${input.trim() ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-300'}`}>
                    <Send size={16} />
                  </button>
                )}
             </div>
          </div>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] sm:rounded-[24px] flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group ${isOpen ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}>
        {isOpen ? <ChevronDown size={28} /> : <Zap size={28} />}
      </button>
    </div>
  );
}
