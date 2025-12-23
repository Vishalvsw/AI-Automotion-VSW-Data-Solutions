
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LeadStatus, LeadPriority, ActivityType, UserRole, User, Activity, QuoteStatus, TaskStatus, Task, TaskPriority } from '../types';
import { 
  ArrowLeft, Phone, Mail, Calendar, IndianRupee, Zap, Target, Sparkles, 
  MessageSquare, Send, Trash2, Edit3, CheckCircle, Clock, History, 
  Layers, Video, Download, ExternalLink, FileSpreadsheet, FileText, Plus, X, Printer, Copy, Loader2, User as UserIcon, ListTodo, AlertCircle, Info, ChevronDown, MapPin, PhoneCall, MailSearch, CalendarDays
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { MOCK_USERS } from '../services/mockData';

interface LeadProfileProps {
  user: User;
}

const LeadProfile: React.FC<LeadProfileProps> = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leads, updateLead, deleteLead, modules } = useApp();
  const isAdmin = user.role === UserRole.FOUNDER;

  const lead = leads.find(l => l.id === id);
  
  // State: AI Controls
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMappingQuote, setIsMappingQuote] = useState(false);
  const [outreachType, setOutreachType] = useState<'whatsapp' | 'email'>('whatsapp');
  const [generatedScript, setGeneratedScript] = useState('');
  
  // State: Quotation Builder
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>(lead?.selectedModuleIds || []);

  // State: Interaction Logger
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [activityFormData, setActivityFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: ActivityType.COLD_CALL,
    note: '',
    nextFollowUp: ''
  });

  // State: Advanced Task Management
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<'Call' | 'Email' | 'Visit' | 'LeadGen' | 'General'>('General');
  const [newTaskAssignee, setNewTaskAssignee] = useState(user.name);
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('Medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  if (!lead) return null;

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const selectedModules = useMemo(() => modules.filter(m => selectedModuleIds.includes(m.id)), [selectedModuleIds, modules]);
  const totalPrice = selectedModules.reduce((acc, m) => acc + m.price, 0);

  const toggleModule = (moduleId: string) => {
    const nextIds = selectedModuleIds.includes(moduleId) ? selectedModuleIds.filter(id => id !== moduleId) : [...selectedModuleIds, moduleId];
    setSelectedModuleIds(nextIds);
    updateLead(lead.id, { selectedModuleIds: nextIds, quoteStatus: QuoteStatus.DRAFT });
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const prefix = newTaskCategory === 'Visit' ? '📍 SITE VISIT: ' : 
                   newTaskCategory === 'Call' ? '📞 CALL: ' : 
                   newTaskCategory === 'Email' ? '📧 EMAIL: ' : 
                   newTaskCategory === 'LeadGen' ? '🚀 LEAD GEN: ' : '';
    
    const newTask: Task = {
      id: `lt-${Date.now()}`,
      title: `${prefix}${newTaskTitle}`,
      assignee: newTaskAssignee,
      priority: newTaskPriority,
      status: TaskStatus.TODO,
      dueDate: newTaskDueDate,
      client: lead.company
    };
    updateLead(lead.id, { tasks: [...(lead.tasks || []), newTask] });
    setNewTaskTitle('');
  };

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = (lead.tasks || []).map(t => 
      t.id === taskId ? { ...t, status: t.status === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE } : t
    );
    updateLead(lead.id, { tasks: updatedTasks });
  };

  const handleUpdateTaskPriority = (taskId: string, priority: TaskPriority) => {
    const updatedTasks = (lead.tasks || []).map(t => 
      t.id === taskId ? { ...t, priority } : t
    );
    updateLead(lead.id, { tasks: updatedTasks });
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = (lead.tasks || []).filter(t => t.id !== taskId);
    updateLead(lead.id, { tasks: updatedTasks });
  };

  const getPriorityColor = (p: TaskPriority) => {
    switch (p) {
      case 'High': return 'text-red-600 bg-red-50 border-red-100';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Low': return 'text-slate-500 bg-slate-50 border-slate-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div className="flex items-center justify-between print:hidden">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-widest transition-all group">
          <div className="p-2 bg-white rounded-xl border border-slate-200 group-hover:shadow-md"><ArrowLeft size={16} /></div>
          Return to Cockpit
        </button>
        <div className="flex gap-3">
          <button onClick={() => setIsQuoteModalOpen(true)} className="flex items-center gap-2 px-6 py-4 bg-brand-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-brand-700 shadow-xl shadow-brand-100 transition-all"><FileText size={18} /> Strategic Proposal</button>
          {isAdmin && <button onClick={() => { if(confirm('Purge node?')) { deleteLead(lead.id); navigate('/leads'); } }} className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-red-600 transition-all"><Trash2 size={20}/></button>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:hidden">
        {/* Profile Sidebar */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm text-center">
            <div className={`w-24 h-24 rounded-[32px] mx-auto flex items-center justify-center text-4xl font-black mb-6 shadow-2xl ${lead.priority === LeadPriority.HOT ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-50 text-slate-400'}`}>{lead.company.charAt(0)}</div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{lead.company}</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{lead.name}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
               <span className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl border ${lead.quoteStatus === QuoteStatus.SENT ? 'bg-green-50 text-green-600 border-green-100' : lead.quoteStatus === QuoteStatus.DRAFT ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>Quote: {lead.quoteStatus || 'Not Generated'}</span>
               <span className="px-3 py-1.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl">{lead.status}</span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-4">
             <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4 text-center">Engagement Matrix</h3>
             <div className="flex flex-col gap-3">
               <a href={`tel:${lead.phone}`} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-brand-50 hover:border-brand-100 transition-all">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-brand-600"><PhoneCall size={18}/></div>
                  <span className="text-xs font-black uppercase tracking-widest">Dial Operative</span>
               </a>
               <a href={`mailto:${lead.email}`} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-brand-50 hover:border-brand-100 transition-all">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-brand-600"><MailSearch size={18}/></div>
                  <span className="text-xs font-black uppercase tracking-widest">Email Uplink</span>
               </a>
             </div>
          </div>
        </div>

        {/* Main Console */}
        <div className="lg:col-span-2 space-y-8">
           {/* Task Management Section */}
           <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-lg font-black text-slate-900 flex items-center gap-3"><Target size={24} className="text-brand-600" /> Pipeline Action Items</h3>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tactical Node Injection</span>
              </div>
              
              {/* Task Creation Console */}
              <div className="space-y-6 mb-12 bg-slate-50 p-8 rounded-[40px] border border-slate-200 shadow-inner">
                <div className="flex flex-wrap gap-2 mb-2">
                   {[
                     { id: 'Call', icon: PhoneCall, label: 'Call' },
                     { id: 'Visit', icon: MapPin, label: 'Visit' },
                     { id: 'Email', icon: Mail, label: 'Email' },
                     { id: 'LeadGen', icon: Sparkles, label: 'Lead Gen' },
                     { id: 'General', icon: Target, label: 'Other' }
                   ].map(cat => (
                     <button 
                       key={cat.id}
                       onClick={() => setNewTaskCategory(cat.id as any)}
                       className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${newTaskCategory === cat.id ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'}`}
                     >
                       <cat.icon size={12} />
                       {cat.label}
                     </button>
                   ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 relative">
                    <input 
                      value={newTaskTitle} 
                      onChange={e => setNewTaskTitle(e.target.value)} 
                      onKeyDown={e => e.key === 'Enter' && handleAddTask()} 
                      className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-brand-500 transition-all shadow-sm" 
                      placeholder="Define the tactical objective..." 
                    />
                  </div>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <select 
                      value={newTaskAssignee}
                      onChange={e => setNewTaskAssignee(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest outline-none focus:ring-2 focus:ring-brand-500 appearance-none cursor-pointer"
                    >
                      {MOCK_USERS.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="relative">
                        <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                        <input 
                          type="date"
                          value={newTaskDueDate}
                          onChange={e => setNewTaskDueDate(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase outline-none focus:ring-2 focus:ring-brand-500" 
                        />
                     </div>
                     <div className="relative">
                        <select 
                          value={newTaskPriority}
                          onChange={e => setNewTaskPriority(e.target.value as TaskPriority)}
                          className="w-full pl-6 pr-4 py-4 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest outline-none focus:ring-2 focus:ring-brand-500 appearance-none cursor-pointer"
                        >
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                     </div>
                  </div>
                </div>

                <button onClick={handleAddTask} className="w-full py-5 bg-brand-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-brand-700 transition-all shadow-2xl shadow-brand-100 flex items-center justify-center gap-3">
                  <Zap size={18} /> Inject Task Node
                </button>
              </div>

              {/* Task List */}
              <div className="space-y-4">
                 {(lead.tasks || []).map(task => (
                    <div key={task.id} className={`p-6 rounded-[32px] border transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group ${task.status === TaskStatus.DONE ? 'bg-slate-50/80 border-slate-100 opacity-60' : 'bg-white border-slate-200 shadow-sm hover:border-brand-200 hover:shadow-xl'}`}>
                       <div className="flex items-center gap-5">
                          <button onClick={() => handleToggleTask(task.id)} className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${task.status === TaskStatus.DONE ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-200 bg-white hover:border-brand-500'}`}>
                             {task.status === TaskStatus.DONE && <CheckCircle size={24} />}
                          </button>
                          <div>
                            <div className={`text-base font-black ${task.status === TaskStatus.DONE ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.title}</div>
                            <div className="flex flex-wrap gap-4 mt-2">
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar size={12} className="text-brand-500" /> {task.dueDate}</span>
                               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><UserIcon size={12} className="text-slate-400" /> {task.assignee}</span>
                            </div>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <select 
                            value={task.priority}
                            onChange={(e) => handleUpdateTaskPriority(task.id, e.target.value as TaskPriority)}
                            className={`px-4 py-2 text-[9px] font-black uppercase rounded-xl border appearance-none outline-none cursor-pointer transition-all ${getPriorityColor(task.priority)}`}
                          >
                             <option value="High">High</option>
                             <option value="Medium">Medium</option>
                             <option value="Low">Low</option>
                          </select>
                          <button onClick={() => handleDeleteTask(task.id)} className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>
                       </div>
                    </div>
                 ))}
                 {(!lead.tasks || lead.tasks.length === 0) && (
                   <div className="p-20 text-center bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                      <Zap size={48} className="mx-auto text-slate-200 mb-4" />
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Zero Active Tasks</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LeadProfile;
