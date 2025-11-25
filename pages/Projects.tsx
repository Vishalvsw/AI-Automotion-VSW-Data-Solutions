import React, { useState } from 'react';
import { MOCK_PROJECTS } from '../services/mockData';
import { ProjectStatus, Project, Task } from '../types';
import { MoreVertical, Calendar, X, User, CheckSquare } from 'lucide-react';

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const columns = [
    { id: ProjectStatus.PLANNING, title: 'Planning', color: 'bg-slate-100' },
    { id: ProjectStatus.IN_PROGRESS, title: 'In Progress', color: 'bg-blue-50' },
    { id: ProjectStatus.REVIEW, title: 'Review', color: 'bg-yellow-50' },
    { id: ProjectStatus.COMPLETED, title: 'Completed', color: 'bg-green-50' },
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

  const getPriorityColor = (priority: Task['priority']) => {
    switch(priority) {
        case 'High': return 'text-red-600 bg-red-50 border-red-100';
        case 'Medium': return 'text-orange-600 bg-orange-50 border-orange-100';
        case 'Low': return 'text-green-600 bg-green-50 border-green-100';
        default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col relative">
      <div className="flex justify-between items-center mb-6">
         <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-500">Track ongoing deliverables and milestones.</p>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex h-full gap-6 min-w-[1024px]">
          {columns.map((col) => (
            <div key={col.id} className="flex-1 flex flex-col h-full min-w-[280px] bg-slate-50 rounded-xl border border-slate-200">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    col.id === ProjectStatus.COMPLETED ? 'bg-green-500' : 
                    col.id === ProjectStatus.IN_PROGRESS ? 'bg-blue-500' : 
                    col.id === ProjectStatus.REVIEW ? 'bg-yellow-500' : 'bg-slate-400'
                  }`}></span>
                  {col.title}
                </h3>
                <span className="px-2 py-1 bg-white text-xs font-bold text-slate-500 rounded border border-slate-100">
                  {getProjectsByStatus(col.id).length}
                </span>
              </div>
              
              <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scrollbar">
                {getProjectsByStatus(col.id).map((project) => (
                  <div 
                    key={project.id} 
                    onClick={() => setSelectedProject(project)}
                    className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-all group hover:border-brand-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-1 rounded">
                        {project.client}
                      </span>
                      <button className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mb-2">{project.title}</h4>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-slate-500 mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${project.progress === 100 ? 'bg-green-500' : 'bg-brand-500'}`} 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-50 pt-3">
                      <div className="flex items-center gap-1">
                         <Calendar size={14} />
                         <span>{new Date(project.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                      </div>
                       <div className="flex -space-x-2">
                        {[...Array(2)].map((_, i) => (
                          <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-medium">
                            {String.fromCharCode(65+i)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                {getProjectsByStatus(col.id).length === 0 && (
                   <div className="flex flex-col items-center justify-center h-32 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                     <span className="text-sm">No projects</span>
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{selectedProject.title}</h2>
                        <div className="text-sm text-slate-500">{selectedProject.client}</div>
                    </div>
                    <button 
                        onClick={() => setSelectedProject(null)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="text-xs text-slate-500 mb-1">Status</div>
                            <div className="font-semibold text-slate-900 text-sm">{selectedProject.status}</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                             <div className="text-xs text-slate-500 mb-1">Due Date</div>
                            <div className="font-semibold text-slate-900 text-sm">
                                {new Date(selectedProject.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="text-xs text-slate-500 mb-1">Budget</div>
                            <div className="font-semibold text-slate-900 text-sm">{formatINR(selectedProject.budget)}</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="text-xs text-slate-500 mb-1">Progress</div>
                            <div className="font-semibold text-brand-600 text-sm">{selectedProject.progress}%</div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <CheckSquare size={16} />
                            Project Tasks
                        </h3>
                        
                        <div className="space-y-3">
                            {selectedProject.tasks.length > 0 ? (
                                selectedProject.tasks.map((task) => (
                                    <div key={task.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:border-slate-200 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1">
                                                <div className="w-5 h-5 rounded border-2 border-slate-300"></div>
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900 text-sm">{task.title}</div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                    <User size={12} />
                                                    {task.assignee}
                                                </div>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-100 rounded-lg">
                                    No tasks assigned yet
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <button className="w-full py-2.5 border border-dashed border-slate-300 rounded-lg text-slate-500 text-sm font-medium hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-2">
                        <span className="text-xl leading-none">+</span> Add New Task
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Projects;