
import React, { useState, useMemo } from 'react';
import { ProjectStatus, Project, User, TechMilestones, ProjectFinancials, UserRole, TaskStatus } from '../types';
import { X, CheckSquare, FileText, Send, Code, AlertTriangle, Clock, Edit3, DollarSign, Target, Table, LayoutGrid, Check, Minus, Zap, Globe, ShieldCheck, Database, Server, Monitor, IndianRupee, Lock, ListTodo, Plus, Sparkles, User as UserIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_USERS } from '../services/mockData';

interface ProjectsProps {
  user: User;
}

const Projects: React.FC<ProjectsProps> = ({ user }) => {
  const { projects, updateProject, addProject } = useApp();
  const isAdmin = user.role === UserRole.FOUNDER;
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'ledger'>('ledger');
  
  // New Task State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
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

    const newTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      assignee: smartAssignment,
      priority: 'Medium',
      status: TaskStatus.TODO
    };

    const updatedTasks = [...project.tasks, newTask];
    updateProject(projectId, { tasks: updatedTasks });
    
    // Sync local selected project if open
    if (selectedProject?.id === projectId) {
      setSelectedProject({ ...selectedProject, tasks: updatedTasks });
    }

    setNewTaskTitle('');
  };

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(amount);
  };

  const isOverdue = (dateString: string) => new Date(dateString) < new Date();

  const handleUpdateMilestone = (id: string, milestone: keyof TechMilestones, val: boolean) => {
    if (!isAdmin) return;
    const project = projects.find(p => p.id === id);
    if (!project) return;
    const newMilestones = { ...project.techMilestones, [milestone]: val };
    updateProject(id, { techMilestones: newMilestones });
    if (selectedProject?.id === id) {
      setSelectedProject({ ...selectedProject, techMilestones: newMilestones });
    }
  };

  const handleUpdateFinancials = (id: string, field: keyof ProjectFinancials, val: number) => {
    if (!isAdmin) return;
    const project = projects.find(p => p.id === id);
    if (!project) return;
    const newFinancials = { ...project.financials, [field]: val };
    
    newFinancials.totalPaid = (newFinancials.advance || 0) + (newFinancials.stage1 || 0) + (newFinancials.stage2 || 0) + (newFinancials.stage3 || 0);
    newFinancials.balance = newFinancials.totalPaid - newFinancials.total;

    updateProject(id, { financials: newFinancials });
    if (selectedProject?.id === id) {
      setSelectedProject({ ...selectedProject, financials: newFinancials });
    }
  };

  const handleUpdateTaskStatus = (projectId: string, taskId: string, newStatus: TaskStatus) => {
    if (!isAdmin) return;
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    
    const updatedTasks = project.tasks.map(t => 
      t.id === taskId ? { ...t, status: newStatus } : t
    );
    
    updateProject(projectId, { tasks: updatedTasks });
    if (selectedProject?.id === projectId) {
      setSelectedProject({ ...selectedProject, tasks: updatedTasks });
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Production Intelligence</h1>
          <p className="text-slate-500 font-medium">Cycle 2026-27 | Financial & Technical Command</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              <button onClick={() => setViewMode('kanban')} className={`p-2 rounded-lg transition-all ${viewMode === 'kanban' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}><LayoutGrid size={18} /></button>
              <button onClick={() => setViewMode('ledger')} className={`p-2 rounded-lg transition-all ${viewMode === 'ledger' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}><Table size={18} /></button>
           </div>
           {isAdmin && (
             <button className="px-6 py-3 bg-brand-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-brand-700 transition-all shadow-xl shadow-brand-100">Deploy New Node</button>
           )}
        </div>
      </div>

      {viewMode === 'kanban' ? (
        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-2 no-scrollbar">
          <div className="flex h-full gap-6 min-w-[1200px]">
            {columns.map((col) => (
              <div key={col.id} className="flex-1 flex flex-col h-full min-w-[300px] bg-slate-50/50 rounded-[32px] border border-slate-200">
                <div className="p-6 flex justify-between items-center">
                  <h3 className={`font-black text-[10px] uppercase tracking-widest flex items-center gap-2 px-3 py-1.5 rounded-xl ${col.color}`}>
                    <col.icon size={14} />
                    {col.title}
                  </h3>
                </div>
                
                <div className="flex-1 px-4 pb-4 overflow-y-auto space-y-4 custom-scrollbar">
                  {projects.filter(p => p.status === col.id).map((project) => {
                    const overdue = isOverdue(project.dueDate) && project.status !== ProjectStatus.COMPLETED;
                    return (
                      <div 
                          key={project.id} 
                          onClick={() => setSelectedProject(project)}
                          className={`bg-white p-6 rounded-[24px] border cursor-pointer transition-all hover:-translate-y-1 group relative ${overdue ? 'border-red-200 shadow-xl shadow-red-100' : 'border-slate-200 shadow-sm hover:shadow-xl hover:border-brand-300'}`}
                      >
                          <div className="mb-4">
                              <span className="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase">{project.client}</span>
                              <h4 className="text-sm font-black text-slate-900 mt-1 leading-snug">{project.title}</h4>
                          </div>
                          
                          <div className="grid grid-cols-6 gap-1 mb-4">
                             {Object.entries(project.techMilestones).map(([key, val]) => (
                               <div key={key} className={`h-1.5 rounded-full ${val ? 'bg-green-500' : 'bg-slate-100'}`} title={key}></div>
                             ))}
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                              <div className="text-[10px] font-black text-slate-900">{formatINR(project.financials.total)}</div>
                              <div className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${project.financials.balance < 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                 {project.financials.balance === 0 ? 'Cleared' : `Bal: ${formatINR(Math.abs(project.financials.balance))}`}
                              </div>
                          </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white border border-slate-200 rounded-[32px] shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] sticky top-0 z-20">
                <tr>
                  <th className="px-6 py-5 border-r border-slate-800">Project / Node</th>
                  <th className="px-4 py-5 border-r border-slate-800 text-center">Base</th>
                  <th className="px-4 py-5 border-r border-slate-800 text-center">Total</th>
                  <th className="px-4 py-5 border-r border-slate-800 text-center">Paid</th>
                  <th className="px-4 py-5 border-r border-slate-800 text-center bg-brand-600">Balance</th>
                  <th className="px-4 py-5 border-r border-slate-800 text-center">Dmo</th>
                  <th className="px-4 py-5 border-r border-slate-800 text-center">FE</th>
                  <th className="px-4 py-5 border-r border-slate-800 text-center">BE</th>
                  <th className="px-6 py-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((p) => (
                  <tr key={p.id} onClick={() => setSelectedProject(p)} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                    <td className="px-6 py-4 border-r border-slate-50">
                       <div className="font-black text-slate-900 text-xs">{p.client}</div>
                       <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{p.title}</div>
                    </td>
                    <td className="px-4 py-4 border-r border-slate-50 text-center font-bold text-slate-500">{formatINR(p.financials.basePrice)}</td>
                    <td className="px-4 py-4 border-r border-slate-50 text-center font-black text-slate-900">{formatINR(p.financials.total)}</td>
                    <td className="px-4 py-4 border-r border-slate-50 text-center text-xs font-black text-brand-600">{formatINR(p.financials.totalPaid)}</td>
                    <td className={`px-4 py-4 border-r border-slate-50 text-center text-xs font-black ${p.financials.balance < 0 ? 'text-red-600 bg-red-50' : 'text-green-600 bg-green-50'}`}>
                       {formatINR(p.financials.balance)}
                    </td>
                    <td className="px-4 py-4 border-r border-slate-50 text-center">
                       {p.techMilestones.demo ? <Check size={16} className="text-green-500 mx-auto" /> : <Minus size={14} className="text-slate-200 mx-auto" />}
                    </td>
                    <td className="px-4 py-4 border-r border-slate-50 text-center">
                       {p.techMilestones.frontend ? <Check size={16} className="text-green-500 mx-auto" /> : <Minus size={14} className="text-slate-200 mx-auto" />}
                    </td>
                    <td className="px-4 py-4 border-r border-slate-50 text-center">
                       {p.techMilestones.backend ? <Check size={16} className="text-green-500 mx-auto" /> : <Minus size={14} className="text-slate-200 mx-auto" />}
                    </td>
                    <td className="px-6 py-4 text-center">
                       <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                         p.status === ProjectStatus.DELIVERY ? 'bg-green-50 text-green-600' :
                         p.status === ProjectStatus.PRODUCTION ? 'bg-blue-50 text-blue-600' :
                         p.status === ProjectStatus.DROPPED ? 'bg-slate-50 text-slate-400' :
                         'bg-slate-50 text-slate-500'
                       }`}>
                         {p.status}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="w-full max-w-xl h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
              <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <div>
                    <h2 className="text-2xl font-black text-slate-900">{selectedProject.client}</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Ref ID: {selectedProject.id} | Cycle 2026-27</p>
                 </div>
                 <button onClick={() => setSelectedProject(null)} className="p-3 bg-white hover:bg-slate-100 rounded-2xl shadow-sm transition-all"><X size={24}/></button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
                 {/* Financial Flow */}
                 <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2"><IndianRupee size={18} className="text-brand-600" /> Financial Flow</h3>
                    {!isAdmin && (
                      <div className="p-4 bg-amber-50 text-amber-700 rounded-2xl border border-amber-100 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-4">
                        <Lock size={14} /> Read-only access for BDAs
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-5 bg-slate-50 rounded-2xl">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Grand Total</label>
                          <input 
                            disabled={!isAdmin}
                            type="number" 
                            className={`w-full bg-transparent border-none p-0 font-black text-lg outline-none ${isAdmin ? 'text-slate-900' : 'text-slate-400'}`} 
                            value={selectedProject.financials.total}
                            onChange={(e) => handleUpdateFinancials(selectedProject.id, 'total', Number(e.target.value))}
                          />
                       </div>
                       <div className="p-5 bg-green-50 rounded-2xl">
                          <label className="text-[9px] font-black text-green-400 uppercase tracking-widest">Advance Paid</label>
                          <input 
                            disabled={!isAdmin}
                            type="number" 
                            className={`w-full bg-transparent border-none p-0 font-black text-lg outline-none ${isAdmin ? 'text-green-700' : 'text-green-400'}`} 
                            value={selectedProject.financials.advance}
                            onChange={(e) => handleUpdateFinancials(selectedProject.id, 'advance', Number(e.target.value))}
                          />
                       </div>
                    </div>
                 </div>

                 {/* MILESTONE TASKS with Smart Auto-Assign */}
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                          <ListTodo size={18} className="text-brand-600" /> 
                          Milestone Tasks
                       </h3>
                    </div>

                    {isAdmin && (
                      <div className="relative group">
                         <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                            <Plus size={16} className="text-slate-300" />
                            {newTaskTitle && smartAssignment !== 'Unassigned' && (
                              <div className="bg-brand-50 text-brand-600 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase flex items-center gap-1 animate-in zoom-in">
                                <Sparkles size={10} /> {smartAssignment}
                              </div>
                            )}
                         </div>
                         <input 
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTask(selectedProject.id)}
                            className="w-full pl-32 pr-20 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xs font-bold outline-none focus:bg-white focus:border-brand-500 transition-all"
                            placeholder="Type 'Design homepage' or 'API setup'..."
                         />
                         <button 
                            onClick={() => handleAddTask(selectedProject.id)}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-slate-900 text-white text-[9px] font-black uppercase rounded-xl transition-all ${newTaskTitle ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                         >
                            Add
                         </button>
                      </div>
                    )}

                    <div className="space-y-3 pt-2">
                       {selectedProject.tasks.length > 0 ? selectedProject.tasks.map((task) => (
                         <div key={task.id} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between group hover:shadow-md transition-all">
                            <div className="flex-1">
                               <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xs font-black text-slate-900">{task.title}</span>
                                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                                    task.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                                  }`}>
                                    {task.priority}
                                  </span>
                               </div>
                               <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                                  <UserIcon size={10} className="text-brand-500" />
                                  {task.assignee}
                               </div>
                            </div>
                            <div className="flex items-center gap-2">
                               {isAdmin ? (
                                 <select 
                                   value={task.status}
                                   onChange={(e) => handleUpdateTaskStatus(selectedProject.id, task.id, e.target.value as TaskStatus)}
                                   className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-none outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer ${
                                     task.status === TaskStatus.DONE ? 'bg-green-50 text-green-700' :
                                     task.status === TaskStatus.BLOCKED ? 'bg-red-50 text-red-700' :
                                     task.status === TaskStatus.IN_PROGRESS ? 'bg-blue-50 text-blue-700' :
                                     'bg-slate-100 text-slate-600'
                                   }`}
                                 >
                                    {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                 </select>
                               ) : (
                                 <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                                   task.status === TaskStatus.DONE ? 'bg-green-50 text-green-700' :
                                   task.status === TaskStatus.BLOCKED ? 'bg-red-50 text-red-700' :
                                   task.status === TaskStatus.IN_PROGRESS ? 'bg-blue-50 text-blue-700' :
                                   'bg-slate-100 text-slate-600'
                                 }`}>
                                    {task.status}
                                 </span>
                               )}
                            </div>
                         </div>
                       )) : (
                         <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Strategic Tasks Defined</p>
                         </div>
                       )}
                    </div>
                 </div>

                 {/* Technical Architecture */}
                 <div className="space-y-4 pb-10">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2"><Server size={18} className="text-brand-600" /> Technical Architecture</h3>
                    <div className="grid grid-cols-2 gap-4">
                       {Object.entries(selectedProject.techMilestones).map(([key, val]) => (
                         <button 
                            key={key}
                            disabled={!isAdmin}
                            onClick={() => handleUpdateMilestone(selectedProject.id, key as any, !val)}
                            className={`p-5 rounded-3xl border-2 transition-all flex items-center justify-between group ${val ? 'border-green-600 bg-green-50/50' : 'border-slate-100 bg-white hover:border-slate-200'} ${!isAdmin && 'cursor-default'}`}
                         >
                            <span className={`text-xs font-black uppercase tracking-widest ${val ? 'text-green-700' : 'text-slate-400 group-hover:text-slate-600'}`}>{key}</span>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${val ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-200'}`}>
                               {val ? <Check size={14} /> : <Minus size={14} />}
                            </div>
                         </button>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="p-10 border-t border-slate-100 bg-white flex gap-4">
                 <button onClick={() => setSelectedProject(null)} className="flex-1 py-5 border-2 border-slate-100 text-slate-500 font-black rounded-3xl text-sm uppercase tracking-widest hover:bg-slate-50 transition-all">Dismiss</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
