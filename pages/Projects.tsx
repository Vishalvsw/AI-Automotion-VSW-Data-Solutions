
import React, { useState } from 'react';
import { MOCK_PROJECTS } from '../services/mockData';
import { ProjectStatus, Project, Task, User } from '../types';
import { MoreVertical, Calendar, X, User as UserIcon, CheckSquare, FileText, Send, Code, AlertTriangle, Clock, Plus } from 'lucide-react';

interface ProjectsProps {
  user: User;
}

const Projects: React.FC<ProjectsProps> = ({ user }) => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('Medium');

  const columns = [
    { id: ProjectStatus.REQUIREMENTS, title: 'Requirements', color: 'bg-purple-50 text-purple-700', icon: FileText },
    { id: ProjectStatus.PRODUCTION, title: 'Production', color: 'bg-blue-50 text-blue-700', icon: Code },
    { id: ProjectStatus.DELIVERY, title: 'Delivery', color: 'bg-indigo-50 text-indigo-700', icon: Send },
    { id: ProjectStatus.COMPLETED, title: 'Completed', color: 'bg-green-50 text-green-700', icon: CheckSquare },
    { id: ProjectStatus.RETAINER, title: 'Retainer', color: 'bg-orange-50 text-orange-700', icon: Clock },
  ];

  const getProjectsByStatus = (status: ProjectStatus) => {
    return projects.filter(p => p.status === status);
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
        case 'High': return 'text-red-700 bg-red-50 border-red-100 ring-red-200';
        case 'Medium': return 'text-orange-700 bg-orange-50 border-orange-100 ring-orange-200';
        case 'Low': return 'text-green-700 bg-green-50 border-green-100 ring-green-200';
        default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      
      const newProject: Project = {
          id: `proj-${Date.now()}`,
          title: formData.get('title') as string,
          client: formData.get('client') as string,
          status: formData.get('status') as ProjectStatus,
          dueDate: formData.get('dueDate') as string,
          budget: Number(formData.get('budget')),
          progress: 0,
          tasks: []
      };

      setProjects([newProject, ...projects]);
      setIsAddProjectModalOpen(false);
  };

  const handleAddTask = () => {
      if (!selectedProject || !newTaskTitle.trim()) return;

      const newTask: Task = {
          id: `t-${Date.now()}`,
          title: newTaskTitle,
          assignee: 'Unassigned',
          priority: newTaskPriority
      };

      const updatedProject = {
          ...selectedProject,
          tasks: [...selectedProject.tasks, newTask]
      };

      setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
      setSelectedProject(updatedProject);
      setNewTaskTitle('');
      setNewTaskPriority('Medium'); // Reset to default
  };

  const handleToggleTask = (taskId: string) => {
      if (!selectedProject) return;
      // Simulate deleting/completing task
      const updatedTasks = selectedProject.tasks.filter(t => t.id !== taskId);
      const updatedProject = { ...selectedProject, tasks: updatedTasks };
      
      setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
      setSelectedProject(updatedProject);
  };

  const handlePriorityChange = (taskId: string, newPriority: Task['priority']) => {
      if (!selectedProject) return;
      
      const updatedTasks = selectedProject.tasks.map(t => 
        t.id === taskId ? { ...t, priority: newPriority } : t
      );
      const updatedProject = { ...selectedProject, tasks: updatedTasks };
      
      setProjects(projects.map(p => p.id === selectedProject.id ? updatedProject : p));
      setSelectedProject(updatedProject);
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
            <button onClick={() => setIsAddProjectModalOpen(true)} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800">New Project</button>
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
                  const overdue = isOverdue(project.dueDate) && project.status !== ProjectStatus.COMPLETED && project.status !== ProjectStatus.RETAINER;
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
                                    +
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

      {/* Add Project Modal */}
      {isAddProjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-900">Start New Project</h2>
                    <button onClick={() => setIsAddProjectModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
                </div>
                <form onSubmit={handleAddProject} className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase">Project Title</label>
                        <input required name="title" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="e.g. E-Commerce App" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Client</label>
                            <input required name="client" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Client Name" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Budget (₹)</label>
                            <input required name="budget" type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" placeholder="500000" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Due Date</label>
                            <input required name="dueDate" type="date" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Initial Status</label>
                            <select name="status" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
                                {Object.values(ProjectStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-2">
                        <button type="button" onClick={() => setIsAddProjectModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium text-sm hover:bg-slate-50 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800">Create Project</button>
                    </div>
                </form>
            </div>
          </div>
      )}

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
                            <div className={`font-semibold text-sm ${isOverdue(selectedProject.dueDate) && selectedProject.status !== ProjectStatus.RETAINER ? 'text-red-600' : 'text-slate-900'}`}>
                                {selectedProject.dueDate ? new Date(selectedProject.dueDate).toLocaleDateString() : 'N/A'}
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
                        
                        <div className="space-y-3 mb-4">
                            {selectedProject.tasks.length > 0 ? (
                                selectedProject.tasks.map((task) => (
                                    <div key={task.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div onClick={() => handleToggleTask(task.id)} className="w-5 h-5 rounded border-2 border-slate-300 group-hover:border-brand-400 cursor-pointer flex items-center justify-center text-transparent hover:text-brand-400">
                                                <div className="w-2.5 h-2.5 bg-current rounded-sm opacity-0 group-hover:opacity-100"></div>
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900 text-sm">{task.title}</div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                    <UserIcon size={12} />
                                                    {task.assignee}
                                                </div>
                                            </div>
                                        </div>
                                        <select 
                                            value={task.priority}
                                            onChange={(e) => handlePriorityChange(task.id, e.target.value as any)}
                                            className={`text-[10px] font-bold uppercase tracking-wider rounded-md border py-1 px-2 outline-none cursor-pointer hover:bg-white transition-all ${getPriorityColor(task.priority)}`}
                                        >
                                            <option value="Low">Low</option>
                                            <option value="Medium">Medium</option>
                                            <option value="High">High</option>
                                        </select>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                                    No tasks assigned yet
                                </div>
                            )}
                        </div>

                        {/* Add Task Input */}
                        <div className="flex gap-2">
                             <div className="flex-1 relative">
                                <input 
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    placeholder="New task title..."
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none pr-24"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                                />
                                <div className="absolute right-1 top-1 bottom-1">
                                    <select 
                                        value={newTaskPriority}
                                        onChange={(e) => setNewTaskPriority(e.target.value as any)}
                                        className="h-full text-xs bg-slate-50 border-none rounded-md text-slate-600 font-medium focus:ring-0 cursor-pointer hover:bg-slate-100"
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>
                             </div>
                             <button onClick={handleAddTask} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800">Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
