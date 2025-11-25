
import React, { useState } from 'react';
import { MOCK_PROJECTS } from '../services/mockData';
import { ProjectStatus, Project, Task } from '../types';
import { MoreVertical, Calendar, X, User, CheckSquare, FileText, Send, Code, AlertTriangle, Clock } from 'lucide-react';

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const columns = [
    { id: ProjectStatus.REQUIREMENTS, title: 'Requirements', color: 'bg-purple-50 text-purple-700', icon: FileText },
    { id: ProjectStatus.PRODUCTION, title: 'Production', color: 'bg-blue-50 text-blue-700', icon: Code },
    { id: ProjectStatus.DELIVERY, title: 'Delivery', color: 'bg-indigo-50 text-indigo-700', icon: Send },
    { id: ProjectStatus.COMPLETED, title: 'Completed', color: 'bg-green-50 text-green-700', icon: CheckSquare },
  ];

  const getProjectsByStatus = (status: ProjectStatus) => {
    return MOCK_PROJECTS.filter(p => p.status === status);
  };

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const isOverdue = (dateString: string) => {
      return new Date(dateString) < new Date();
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch(priority) {
        case 'High': return 'text-red-700 bg-red-50 border-red-100';
        case 'Medium': return 'text-orange-700 bg-orange-50 border-orange-100';
        case 'Low': return 'text-green-700 bg-green-50 border-green-100';
        default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col relative">
      <div className="flex justify-between items-center mb-6">
         <div>
          <h1 className="text-2xl font-bold text-slate-900">Project Lifecycle</h1>
          <p className="text-slate-500">Track development, milestones, and delivery.</p>
        </div>
        <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50">Filter</button>
            <button className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">New Project</button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-2">
        <div className="flex h-full gap-6 min-w-[1024px]">
          {columns.map((col) => (
            <div key={col.id} className="flex-1 flex flex-col h-full min-w-[280px] bg-slate-50/50 rounded-2xl border border-slate-200">
              <div className="p-4 flex justify-between items-center">
                <h3 className={`font-bold text-sm flex items-center gap-2 px-3 py-1.5 rounded-lg ${col.color} bg-opacity-50`}>
                  <col.icon size={16} />
                  {col.title}
                </h3>
                <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">
                  {getProjectsByStatus(col.id).length}
                </span>
              </div>
              
              <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
                {getProjectsByStatus(col.id).map((project) => {
                  const overdue = isOverdue(project.dueDate) && project.status !== ProjectStatus.COMPLETED;
                  return (
                    <div 
                        key={project.id} 
                        onClick={() => setSelectedProject(project)}
                        className={`bg-white p-5 rounded-xl border cursor-pointer transition-all group relative hover:-translate-y-1 duration-200 ${overdue ? 'border-red-200 shadow-red-100' : 'border-slate-200 shadow-sm hover:shadow-lg hover:border-brand-200'}`}
                    >
                        {overdue && (
                            <div className="absolute top-4 right-4 text-red-500" title="Overdue">
                                <AlertTriangle size={16} />
                            </div>
                        )}
                        <div className="mb-3">
                            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                {project.client}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">{project.title}</h4>
                        </div>
                        
                        <div className="mb-4">
                            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                                <span>Progress</span>
                                <span className="font-medium">{project.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div 
                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                    project.progress === 100 ? 'bg-green-500' : 
                                    overdue ? 'bg-red-500' : 'bg-brand-500'
                                }`} 
                                style={{ width: `${project.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                            <div className={`flex items-center gap-1.5 text-xs font-medium ${overdue ? 'text-red-600' : 'text-slate-500'}`}>
                                <Clock size={14} />
                                <span>{new Date(project.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                            </div>
                            <div className="flex -space-x-2">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${project.id}`} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100" alt="" />
                                <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-500">
                                    +2
                                </div>
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

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{selectedProject.title}</h2>
                        <div className="text-sm text-slate-500">{selectedProject.client}</div>
                    </div>
                    <button 
                        onClick={() => setSelectedProject(null)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar bg-white">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</div>
                            <div className="font-semibold text-slate-900 text-sm">{selectedProject.status}</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                             <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Deadline</div>
                            <div className={`font-semibold text-sm ${isOverdue(selectedProject.dueDate) ? 'text-red-600' : 'text-slate-900'}`}>
                                {new Date(selectedProject.dueDate).toLocaleDateString()}
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Budget</div>
                            <div className="font-semibold text-slate-900 text-sm">{formatINR(selectedProject.budget)}</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Progress</div>
                            <div className="font-semibold text-brand-600 text-sm">{selectedProject.progress}%</div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <CheckSquare size={18} className="text-brand-500" />
                            Tasks & Milestones
                        </h3>
                        
                        <div className="space-y-3">
                            {selectedProject.tasks.length > 0 ? (
                                selectedProject.tasks.map((task) => (
                                    <div key={task.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-5 h-5 rounded border-2 border-slate-300 group-hover:border-brand-400 cursor-pointer"></div>
                                            <div>
                                                <div className="font-medium text-slate-900 text-sm">{task.title}</div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                    <User size={12} />
                                                    {task.assignee}
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                                    No tasks assigned yet
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <button className="w-full py-3 border border-dashed border-slate-300 rounded-xl text-slate-500 text-sm font-medium hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-2 group">
                        <span className="bg-slate-200 text-slate-600 rounded-full w-5 h-5 flex items-center justify-center text-xs group-hover:bg-slate-300 transition-colors">+</span> 
                        Add New Task
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
