
import React, { useState } from 'react';
import { ProjectStatus, Project, Task, User } from '../types';
import { X, CheckSquare, FileText, Send, Code, AlertTriangle, Clock, Edit3, DollarSign, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ProjectsProps {
  user: User;
}

const Projects: React.FC<ProjectsProps> = ({ user }) => {
  const { projects, updateProject, addProject } = useApp();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isEditDetailsMode, setIsEditDetailsMode] = useState(false);
  
  const columns = [
    { id: ProjectStatus.REQUIREMENTS, title: 'Requirements', color: 'bg-purple-50 text-purple-700', icon: FileText },
    { id: ProjectStatus.PRODUCTION, title: 'Production', color: 'bg-blue-50 text-blue-700', icon: Code },
    { id: ProjectStatus.DELIVERY, title: 'Delivery', color: 'bg-indigo-50 text-indigo-700', icon: Send },
    { id: ProjectStatus.COMPLETED, title: 'Completed', color: 'bg-green-50 text-green-700', icon: CheckSquare },
    { id: ProjectStatus.RETAINER, title: 'Retainer', color: 'bg-orange-50 text-orange-700', icon: Clock },
  ];

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(amount);
  };

  const isOverdue = (dateString: string) => new Date(dateString) < new Date();

  const handleUpdateProgress = (id: string, progress: number) => {
    updateProject(id, { progress });
    if (selectedProject?.id === id) {
      setSelectedProject({ ...selectedProject, progress });
    }
  };

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    const formData = new FormData(e.target as HTMLFormElement);
    const updates = {
      title: formData.get('title') as string,
      budget: Number(formData.get('budget')),
      status: formData.get('status') as ProjectStatus,
      progress: Number(formData.get('progress')),
    };
    updateProject(selectedProject.id, updates);
    setSelectedProject({ ...selectedProject, ...updates });
    setIsEditDetailsMode(false);
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col relative">
      <div className="flex justify-between items-center mb-6">
         <div>
          <h1 className="text-2xl font-bold text-slate-900">Project Operations</h1>
          <p className="text-slate-500">Managing global production workflows.</p>
        </div>
        <button onClick={() => setIsAddProjectModalOpen(true)} className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-200">Start New Project</button>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-2 no-scrollbar">
        <div className="flex h-full gap-6 min-w-[1024px]">
          {columns.map((col) => (
            <div key={col.id} className="flex-1 flex flex-col h-full min-w-[280px] bg-slate-50/50 rounded-2xl border border-slate-200">
              <div className="p-4 flex justify-between items-center sticky top-0 bg-slate-50/50 backdrop-blur-sm z-10">
                <h3 className={`font-bold text-xs flex items-center gap-2 px-3 py-1.5 rounded-lg ${col.color}`}>
                  <col.icon size={16} />
                  {col.title}
                </h3>
                <span className="text-[10px] font-black text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">
                  {projects.filter(p => p.status === col.id).length}
                </span>
              </div>
              
              <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
                {projects.filter(p => p.status === col.id).map((project) => {
                  const overdue = isOverdue(project.dueDate) && project.status !== ProjectStatus.COMPLETED;
                  return (
                    <div 
                        key={project.id} 
                        onClick={() => setSelectedProject(project)}
                        className={`bg-white p-5 rounded-2xl border cursor-pointer transition-all group relative hover:-translate-y-1 duration-200 ${overdue ? 'border-red-200 shadow-red-50' : 'border-slate-200 shadow-sm hover:shadow-lg hover:border-brand-200'}`}
                    >
                        {overdue && (
                            <div className="absolute top-4 right-4 text-red-500"><AlertTriangle size={16} /></div>
                        )}
                        <div className="mb-3">
                            <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{project.client}</span>
                            <h4 className="text-sm font-black text-slate-900 mt-0.5 leading-snug">{project.title}</h4>
                        </div>
                        
                        <div className="mb-4">
                            <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1.5">
                                <span>Production Health</span>
                                <span className="text-brand-600">{project.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div 
                                className={`h-2 rounded-full transition-all duration-500 ${project.progress === 100 ? 'bg-green-500' : overdue ? 'bg-red-500' : 'bg-brand-500'}`} 
                                style={{ width: `${project.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                            <div className={`flex items-center gap-1.5 text-[10px] font-bold ${overdue ? 'text-red-600' : 'text-slate-400'}`}>
                                <Clock size={14} />
                                <span>{new Date(project.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                            </div>
                            <span className="text-[10px] font-black text-slate-900">{formatINR(project.budget)}</span>
                        </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PROJECT DETAILS & DYNAMIC EDIT MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">{selectedProject.title}</h2>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedProject.client}</div>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => setIsEditDetailsMode(!isEditDetailsMode)} className={`p-2 rounded-xl transition-all ${isEditDetailsMode ? 'bg-brand-600 text-white' : 'hover:bg-slate-100 text-slate-400'}`}><Edit3 size={20} /></button>
                       <button onClick={() => setSelectedProject(null)} className="p-2 hover:bg-slate-100 text-slate-400 rounded-xl"><X size={20}/></button>
                    </div>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar">
                    {isEditDetailsMode ? (
                       <form onSubmit={handleSaveDetails} className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Project Title</label>
                                <input name="title" defaultValue={selectedProject.title} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                             </div>
                             <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Budget (₹)</label>
                                <input name="budget" type="number" defaultValue={selectedProject.budget} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                             </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Current Status</label>
                                <select name="status" defaultValue={selectedProject.status} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none bg-white">
                                   {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                             </div>
                             <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Completion Progress (%)</label>
                                <input name="progress" type="number" min="0" max="100" defaultValue={selectedProject.progress} className="w-full px-4 py-3 border border-slate-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-brand-500 outline-none" />
                             </div>
                          </div>
                          <div className="pt-4 flex gap-3">
                             <button type="button" onClick={() => setIsEditDetailsMode(false)} className="flex-1 py-3 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl">Cancel</button>
                             <button type="submit" className="flex-1 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 shadow-xl shadow-slate-200">Save System Changes</button>
                          </div>
                       </form>
                    ) : (
                       <div className="space-y-8">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                             <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="text-[10px] font-black text-slate-400 uppercase mb-1"><Target size={14} className="mb-1"/> Status</div>
                                <div className="font-bold text-slate-900 text-xs">{selectedProject.status}</div>
                             </div>
                             <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="text-[10px] font-black text-slate-400 uppercase mb-1"><DollarSign size={14} className="mb-1"/> Budget</div>
                                <div className="font-bold text-slate-900 text-xs">{formatINR(selectedProject.budget)}</div>
                             </div>
                             <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="text-[10px] font-black text-slate-400 uppercase mb-1"><Clock size={14} className="mb-1"/> Delivery</div>
                                <div className="font-bold text-slate-900 text-xs">{new Date(selectedProject.dueDate).toLocaleDateString()}</div>
                             </div>
                             <div className="p-5 bg-brand-600 text-white rounded-2xl shadow-lg shadow-brand-100">
                                <div className="text-[10px] font-black text-brand-100 uppercase mb-1">Progress</div>
                                <div className="font-black text-xl">{selectedProject.progress}%</div>
                             </div>
                          </div>

                          <div>
                             <h3 className="text-sm font-black text-slate-900 mb-4 flex items-center gap-2">
                                <CheckSquare size={18} className="text-brand-500" />
                                Critical Milestones
                             </h3>
                             <div className="space-y-2">
                                {selectedProject.tasks.map(t => (
                                   <div key={t.id} className="p-4 bg-white border border-slate-100 rounded-xl flex items-center justify-between shadow-sm">
                                      <div className="flex items-center gap-3">
                                         <div className="w-5 h-5 rounded border-2 border-slate-300"></div>
                                         <span className="text-sm font-bold text-slate-700">{t.title}</span>
                                      </div>
                                      <span className="text-[10px] font-black text-slate-400 uppercase">{t.priority}</span>
                                   </div>
                                ))}
                             </div>
                          </div>
                       </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
