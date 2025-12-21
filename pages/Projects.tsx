
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ProjectStatus, Project, User, TechMilestones, ProjectFinancials, UserRole, TaskStatus, Task, QuoteStatus, TaskPriority } from '../types';
import { X, CheckSquare, FileText, Send, Code, AlertTriangle, Clock, Edit3, DollarSign, Target, Table, LayoutGrid, Check, Minus, Zap, Globe, ShieldCheck, Database, Server, Monitor, IndianRupee, Lock, ListTodo, Plus, Sparkles, User as UserIcon, Calendar, Eye, ChevronDown, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_USERS } from '../services/mockData';

interface ProjectsProps {
  user: User;
}

const Projects: React.FC<ProjectsProps> = ({ user }) => {
  const { projects, updateProject, addProject, leads } = useApp();
  const canEditFinance = user.role === UserRole.FOUNDER || user.role === UserRole.FINANCE;
  const canManageNodes = user.role === UserRole.FOUNDER || user.role === UserRole.FINANCE || user.role === UserRole.DEVELOPER || user.role === UserRole.DESIGNER;
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'ledger'>('ledger');
  
  // New Task State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDate, setNewTaskDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('Medium');
  
  const columns = [
    { id: ProjectStatus.REQUIREMENTS, title: 'Requirements', color: 'bg-purple-50 text-purple-700', icon: FileText },
    { id: ProjectStatus.PRODUCTION, title: 'In Progress', color: 'bg-blue-50 text-blue-700', icon: Code },
    { id: ProjectStatus.DELIVERY, title: 'Ready', color: 'bg-indigo-50 text-indigo-700', icon: Send },
    { id: ProjectStatus.COMPLETED, title: 'Completed', color: 'bg-green-50 text-green-700', icon: CheckSquare },
    { id: ProjectStatus.RETAINER, title: 'Retainer', color: 'bg-orange-50 text-orange-700', icon: Clock },
    { id: ProjectStatus.DROPPED, title: 'Dropped', color: 'bg-slate-50 text-slate-500', icon: Minus },
  ];

  // Auto-assignment Logic
  const smartAssignment = useMemo(() => {
    const title = newTaskTitle.toLowerCase();
    const rules = [
      { keywords: ['api', 'backend', 'database', 'server', 'logic', 'integration'], role: UserRole.DEVELOPER },
      { keywords: ['ui', 'ux', 'design', 'logo', 'frontend', 'layout', 'figma', 'css'], role: UserRole.DESIGNER },
      { keywords: ['sales', 'lead', 'client', 'meeting', 'requirements', 'bda'], role: UserRole.BDA }
    ];
    const matchedRule = rules.find(rule => rule.keywords.some(k => title.includes(k)));
    if (matchedRule) {
      const suggestedUser = MOCK_USERS.find(u => u.role === matchedRule.role);
      return suggestedUser ? suggestedUser.name : 'Unassigned';
    }
    return 'Unassigned';
  }, [newTaskTitle]);

  const handleAddTask = (projectId: string) => {
    if (!newTaskTitle.trim()) return;
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      assignee: smartAssignment,
      priority: newTaskPriority, // Uses user selected or default 'Medium'
      status: TaskStatus.TODO,
      dueDate: newTaskDate || undefined
    };
    const updatedTasks = [...project.tasks, newTask];
    updateProject(projectId, { tasks: updatedTasks });
    if (selectedProject?.id === projectId) setSelectedProject({ ...selectedProject, tasks: updatedTasks });
    
    // Reset Form
    setNewTaskTitle('');
    setNewTaskDate('');
    setNewTaskPriority('Medium');
  };

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const handleUpdateFinancials = (id: string, field: keyof ProjectFinancials, val: number) => {
    if (!canEditFinance) return;
    const project = projects.find(p => p.id === id);
    if (!project) return;
    const newFinancials = { ...project.financials, [field]: val };
    newFinancials.totalPaid = (newFinancials.advance || 0) + (newFinancials.stage1 || 0) + (newFinancials.stage2 || 0) + (newFinancials.stage3 || 0);
    newFinancials.balance = newFinancials.totalPaid - newFinancials.total;
    updateProject(id, { financials: newFinancials });
    if (selectedProject?.id === id) setSelectedProject({ ...selectedProject, financials: newFinancials });
  };

  const handleUpdateTaskStatus = (projectId: string, taskId: string, newStatus: TaskStatus) => {
    if (!canManageNodes) return;
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    const updatedTasks = project.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
    updateProject(projectId, { tasks: updatedTasks });
    if (selectedProject?.id === projectId) setSelectedProject({ ...selectedProject, tasks: updatedTasks });
  };

  const handleUpdateTaskPriority = (projectId: string, taskId: string, newPriority: TaskPriority) => {
    if (!canManageNodes) return;
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    const updatedTasks = project.tasks.map(t => t.id === taskId ? { ...t, priority: newPriority } : t);
    updateProject(projectId, { tasks: updatedTasks });
    if (selectedProject?.id === projectId) setSelectedProject({ ...selectedProject, tasks: updatedTasks });
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-100';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Low': return 'text-slate-500 bg-slate-50 border-slate-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  const getPriorityIcon = (priority: TaskPriority) => {
    switch (priority) {
      case 'High': return <AlertCircle size={14} />;
      case 'Medium': return <Info size={14} />;
      case 'Low': return <Clock size={14} />;
      default: return null;
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Production Intelligence</h1>
          <p className="text-sm text-slate-500 font-medium">Cycle 2026-27 | Global Operations Command</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
           <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              <button onClick={() => setViewMode('kanban')} className={`p-2 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}><LayoutGrid size={18} /></button>
              <button onClick={() => setViewMode('ledger')} className={`p-2 rounded-lg transition-all ${viewMode === 'ledger' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}><Table size={18} /></button>
           </div>
           {(user.role === UserRole.FOUNDER || user.role === UserRole.FINANCE) && (
             <button className="flex-1 sm:flex-none px-4 sm:px-6 py-3 bg-brand-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl sm:rounded-2xl hover:bg-brand-700 transition-all shadow-xl shadow-brand-100">Deploy Node</button>
           )}
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 no-scrollbar">
          <div className="flex h-full gap-4 sm:gap-6 min-w-max px-1">
            {columns.map((col) => (
              <div key={col.id} className="flex-1 flex flex-col h-full w-[280px] sm:w-[320px] bg-slate-50/50 rounded-[32px] sm:rounded-[40px] border border-slate-200 shadow-inner">
                <div className="p-6 sm:p-8 flex justify-between items-center">
                  <h3 className={`font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-sm ${col.color}`}>
                    <col.icon size={12} />
                    {col.title}
                  </h3>
                  <span className="text-[9px] sm:text-[10px] font-black text-slate-300">{projects.filter(p => p.status === col.id).length} Nodes</span>
                </div>
                <div className="flex-1 px-4 sm:px-5 pb-6 overflow-y-auto space-y-4 custom-scrollbar">
                  {projects.filter(p => p.status === col.id).map((project) => (
                    <div key={project.id} onClick={() => setSelectedProject(project)} className={`bg-white p-5 sm:p-7 rounded-[24px] sm:rounded-[32px] border cursor-pointer transition-all hover:-translate-y-1 border-slate-200 shadow-sm hover:shadow-xl group`}>
                        <div className="mb-3 sm:mb-4">
                            <span className="text-[8px] sm:text-[9px] font-black tracking-[0.3em] text-slate-400 uppercase">{project.client}</span>
                            <h4 className="text-xs sm:text-sm font-black text-slate-900 mt-1 leading-snug group-hover:text-brand-600 transition-colors">{project.title}</h4>
                        </div>
                        <div className="flex justify-between items-center mb-4 sm:mb-5">
                           <span className={`text-[7px] sm:text-[8px] font-black uppercase px-2 sm:px-3 py-1 rounded-lg border shadow-sm ${
                             project.quoteStatus === QuoteStatus.APPROVED ? 'bg-green-50 text-green-600 border-green-100' : 
                             project.quoteStatus === QuoteStatus.SENT ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                           }`}>
                             Quote: {project.quoteStatus || 'Draft'}
                           </span>
                           <div className="flex -space-x-1">
                              {Object.values(project.techMilestones).map((v, i) => (
                                <div key={i} className={`w-2 h-1 sm:w-3 sm:h-1.5 rounded-full ${v ? 'bg-green-500' : 'bg-slate-100'}`}></div>
                              ))}
                           </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 sm:pt-5 border-t border-slate-50">
                            <div className="text-[10px] sm:text-[11px] font-black text-slate-900">{formatINR(project.financials.total)}</div>
                            <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${project.financials.balance < 0 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                               {project.financials.balance === 0 ? 'Settled' : `Bal: ${formatINR(Math.abs(project.financials.balance))}`}
                            </div>
                        </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white border border-slate-200 rounded-[32px] sm:rounded-[40px] shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto custom-scrollbar h-full">
            <table className="w-full text-sm text-left border-collapse min-w-[1000px]">
              <thead className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.3em] sticky top-0 z-20">
                <tr>
                  <th className="px-8 sm:px-10 py-5 sm:py-6 border-r border-slate-800">Project / Operational Node</th>
                  <th className="px-6 py-6 border-r border-slate-800 text-center">Grand Total</th>
                  <th className="px-6 py-6 border-r border-slate-800 text-center bg-brand-600">Ar Balance</th>
                  <th className="px-6 py-6 border-r border-slate-800 text-center">Quotation Hub</th>
                  <th className="px-6 py-6 border-r border-slate-800 text-center">Production FE</th>
                  <th className="px-6 py-6 border-r border-slate-800 text-center">Production BE</th>
                  <th className="px-8 py-6 text-center">Status Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((p) => {
                   const matchingLead = leads.find(l => l.company === p.client);
                   const currentQuoteStatus = p.quoteStatus || matchingLead?.quoteStatus || QuoteStatus.DRAFT;
                   return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td onClick={() => setSelectedProject(p)} className="px-8 sm:px-10 py-5 sm:py-6 border-r border-slate-50 cursor-pointer">
                         <div className="font-black text-slate-900 text-xs group-hover:text-brand-600 transition-colors">{p.client}</div>
                         <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{p.title}</div>
                      </td>
                      <td className="px-6 py-6 border-r border-slate-50 text-center font-black text-slate-900">{formatINR(p.financials.total)}</td>
                      <td className={`px-6 py-6 border-r border-slate-50 text-center text-xs font-black ${p.financials.balance < 0 ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'}`}>
                         {formatINR(p.financials.balance)}
                      </td>
                      <td className="px-6 py-6 border-r border-slate-50 text-center">
                         <Link 
                            to={matchingLead ? `/leads/${matchingLead.id}` : '#'} 
                            className={`px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm ${
                              currentQuoteStatus === QuoteStatus.APPROVED ? 'bg-green-600 text-white shadow-green-100' : 
                              currentQuoteStatus === QuoteStatus.SENT ? 'bg-blue-600 text-white shadow-blue-100' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                            }`}
                         >
                           <FileText size={12} /> {currentQuoteStatus}
                         </Link>
                      </td>
                      <td className="px-6 py-6 border-r border-slate-50 text-center">
                         {p.techMilestones.frontend ? <Check size={18} className="text-green-500 mx-auto" /> : <Minus size={16} className="text-slate-200 mx-auto" />}
                      </td>
                      <td className="px-6 py-6 border-r border-slate-50 text-center">
                         {p.techMilestones.backend ? <Check size={18} className="text-green-500 mx-auto" /> : <Minus size={16} className="text-slate-200 mx-auto" />}
                      </td>
                      <td className="px-8 py-6 text-center">
                         <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm ${
                           p.status === ProjectStatus.DELIVERY ? 'bg-green-50 text-green-600 border-green-100' :
                           p.status === ProjectStatus.PRODUCTION ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                         }`}>
                           {p.status}
                         </span>
                      </td>
                    </tr>
                   );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PROJECT DETAIL SLIDEOVER */}
      {selectedProject && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-end bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-xl h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
              <div className="p-6 sm:p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <div className="flex items-center gap-4 sm:gap-5">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-900 text-white rounded-[20px] sm:rounded-[24px] flex items-center justify-center font-black text-xl sm:text-2xl shadow-xl">{selectedProject.client.charAt(0)}</div>
                    <div>
                       <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{selectedProject.client}</h2>
                       <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Node: {selectedProject.id.slice(-8)}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedProject(null)} className="p-3 sm:p-4 bg-white hover:bg-slate-100 rounded-xl sm:rounded-2xl shadow-sm transition-all text-slate-400 hover:text-slate-900 border border-slate-100"><X size={20}/></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 sm:space-y-12 custom-scrollbar">
                 <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3"><IndianRupee size={20} className="text-brand-600" /> Operational Financials</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       <div className="p-5 sm:p-6 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-100">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-2">Grand Total</label>
                          <input disabled={!canEditFinance} type="number" className="w-full bg-transparent border-none p-0 font-black text-lg sm:text-xl outline-none text-slate-900" value={selectedProject.financials.total} onChange={(e) => handleUpdateFinancials(selectedProject.id, 'total', Number(e.target.value))} />
                       </div>
                       <div className="p-5 sm:p-6 bg-green-50 rounded-2xl sm:rounded-3xl border border-green-100">
                          <label className="text-[9px] font-black text-green-400 uppercase tracking-widest block mb-2">Advance Settled</label>
                          <input disabled={!canEditFinance} type="number" className="w-full bg-transparent border-none p-0 font-black text-lg sm:text-xl outline-none text-green-700" value={selectedProject.financials.advance} onChange={(e) => handleUpdateFinancials(selectedProject.id, 'advance', Number(e.target.value))} />
                       </div>
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div className="flex justify-between items-center">
                       <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3"><ListTodo size={20} className="text-brand-600" /> Production Tasks</h3>
                       <span className="text-[10px] font-black text-slate-400 uppercase">{selectedProject.tasks.length} Modules</span>
                    </div>
                    {canManageNodes && (
                      <div className="space-y-4 bg-slate-50/50 p-6 rounded-[32px] border border-slate-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                           <div className="relative group sm:col-span-2">
                             <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 sm:gap-3 pointer-events-none">
                                 <Plus size={16} className="text-slate-300" />
                             </div>
                             <input value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} className="w-full pl-12 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-sm outline-none focus:border-brand-500 transition-all shadow-sm" placeholder="Inject task node title..." />
                           </div>
                           
                           <div className="relative">
                              <select 
                                 value={newTaskPriority}
                                 onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                                 className="w-full pl-10 pr-8 py-3 bg-white border-2 border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:border-brand-500 appearance-none shadow-sm"
                              >
                                 <option value="High">High Priority</option>
                                 <option value="Medium">Medium Priority</option>
                                 <option value="Low">Low Priority</option>
                              </select>
                              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                 {getPriorityIcon(newTaskPriority)}
                              </div>
                              <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300" />
                           </div>

                           <div className="relative">
                              <input 
                                 type="date" 
                                 value={newTaskDate} 
                                 onChange={(e) => setNewTaskDate(e.target.value)} 
                                 className="w-full px-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-[10px] font-black uppercase outline-none focus:border-brand-500 shadow-sm" 
                              />
                           </div>
                        </div>
                        <button onClick={() => handleAddTask(selectedProject.id)} disabled={!newTaskTitle.trim()} className="w-full py-4 bg-slate-900 text-white text-[10px] sm:text-[11px] font-black uppercase rounded-2xl transition-all hover:bg-slate-800 disabled:opacity-50 shadow-xl shadow-slate-200">Deploy Module Node</button>
                      </div>
                    )}
                    <div className="space-y-3">
                       {selectedProject.tasks.map((task) => (
                           <div key={task.id} className="p-4 sm:p-5 bg-white border border-slate-100 rounded-2xl sm:rounded-3xl flex flex-col gap-3 sm:gap-4 shadow-sm hover:shadow-md transition-all">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                 <div className="flex-1">
                                    <div className="text-sm font-black text-slate-900">{task.title}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                       <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">{task.assignee}</span>
                                       {task.dueDate && <span className="text-[9px] text-brand-600 font-black uppercase tracking-widest">• Due {task.dueDate}</span>}
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <div className="relative flex-1 sm:flex-none">
                                       <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-80">
                                          {getPriorityIcon(task.priority)}
                                       </div>
                                       <select 
                                          value={task.priority} 
                                          onChange={(e) => handleUpdateTaskPriority(selectedProject.id, task.id, e.target.value as TaskPriority)} 
                                          className={`w-full sm:w-auto pl-8 pr-8 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-transparent outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer transition-all appearance-none ${getPriorityColor(task.priority)}`}
                                       >
                                          <option value="High">High</option>
                                          <option value="Medium">Medium</option>
                                          <option value="Low">Low</option>
                                       </select>
                                       <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                                    </div>
                                    
                                    <div className="relative flex-1 sm:flex-none">
                                       <select 
                                          value={task.status} 
                                          onChange={(e) => handleUpdateTaskStatus(selectedProject.id, task.id, e.target.value as TaskStatus)} 
                                          className="w-full sm:w-auto pl-3 pr-8 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border-none outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors appearance-none"
                                       >
                                          {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                       </select>
                                       <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                                    </div>
                                 </div>
                              </div>
                           </div>
                       ))}
                    </div>
                 </div>
              </div>
              <div className="p-6 sm:p-10 border-t border-slate-100 bg-white flex gap-4"><button onClick={() => setSelectedProject(null)} className="flex-1 py-4 sm:py-5 border-2 border-slate-100 text-slate-500 font-black rounded-2xl sm:rounded-[32px] text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all">Terminate View</button></div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
