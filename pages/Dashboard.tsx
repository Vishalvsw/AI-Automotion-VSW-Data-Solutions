
import React from 'react';
import { ResponsiveContainer, XAxis, CartesianGrid, Tooltip, AreaChart, Area, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { Link } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import { 
  IndianRupee, Users, AlertCircle, Briefcase, Zap, 
  Target, ArrowRight, Wallet, Clock, Activity, 
  Globe, TrendingUp, DollarSign, CheckCircle, 
  AlertTriangle, ArrowUpRight, BarChart3, PieChart as PieIcon,
  ShieldCheck, Layers, ChevronRight, PhoneCall, AlertOctagon, Sparkles, ListTodo
} from 'lucide-react';
import { UserRole, LeadStatus, User, ProjectStatus, TaskStatus } from '../types';
import { useApp } from '../context/AppContext';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const { leads, projects, invoices } = useApp();
  const isFounder = user.role === UserRole.FOUNDER;
  const isFinance = user.role === UserRole.FINANCE;
  
  const formatRupee = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(value);
  };

  const renderFounderDashboard = () => {
    // Financial Analytics
    const totalPipelineValue = leads.reduce((acc, curr) => acc + (curr.value || 0), 0);
    const collectedRevenue = invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
    const projectBalanceDue = projects.reduce((acc, curr) => acc + Math.abs(curr.financials.balance), 0);
    
    // Lead Analytics
    const hotLeadsCount = leads.filter(l => l.priority === 'Hot').length;
    const closedWonCount = leads.filter(l => l.status === LeadStatus.CLOSED_WON).length;
    const conversionRate = leads.length > 0 ? Math.round((closedWonCount / leads.length) * 100) : 0;

    // Project Distribution
    const projectStats = Object.values(ProjectStatus).map(status => ({
      name: status,
      value: projects.filter(p => p.status === status).length
    })).filter(s => s.value > 0);

    const COLORS = ['#3b82f6', '#8b5cf6', '#6366f1', '#10b981', '#f59e0b', '#ef4444'];

    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50/50 blur-[100px] rounded-full -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="px-3 py-1 bg-brand-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-brand-200">
                Global Admin Control
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <ShieldCheck size={14} className="text-brand-500" /> System Integrity: Optimal
              </div>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Enterprise Intelligence</h1>
            <p className="text-slate-500 mt-1 font-medium max-w-md">Aggregate visibility into VSW Enterprise production nodes and financial velocity.</p>
          </div>
          
          <div className="flex flex-wrap gap-4 relative z-10">
            <div className="bg-slate-50 border border-slate-100 px-6 py-4 rounded-3xl min-w-[160px]">
              <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Liquid Assets</div>
              <div className="text-2xl font-black text-slate-900">{formatRupee(collectedRevenue)}</div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 mt-1">
                <ArrowUpRight size={12} /> +12.5% vs Prev
              </div>
            </div>
            <div className="bg-slate-900 text-white px-6 py-4 rounded-3xl min-w-[160px] shadow-2xl shadow-slate-200">
              <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Pipeline Mass</div>
              <div className="text-2xl font-black text-white">{formatRupee(totalPipelineValue)}</div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-brand-400 mt-1 uppercase tracking-tighter">
                Potential Growth
              </div>
            </div>
          </div>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <DashboardCard title="Active Ops" value={projects.length.toString()} change="Nodes" positive={true} icon={<Briefcase size={20} />} />
           <DashboardCard title="Conversion" value={`${conversionRate}%`} change="Efficiency" positive={true} icon={<Target size={20} />} />
           <DashboardCard title="AR Balance" value={formatRupee(projectBalanceDue)} change="Uncollected" positive={false} icon={<AlertCircle size={20} />} />
           <DashboardCard title="Lead Velocity" value={leads.length.toString()} change="Inbound" positive={true} icon={<Zap size={20} />} />
        </div>

        {/* Deep Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Revenue Forecast Chart */}
           <div className="lg:col-span-2 p-8 bg-white border border-slate-100 rounded-[40px] shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Revenue Velocity Projection</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Cash Flow vs Pipeline Potential</p>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { name: 'Jan', r: 300000, p: 450000 }, 
                    { name: 'Feb', r: 450000, p: 600000 }, 
                    { name: 'Mar', r: 380000, p: 800000 },
                    { name: 'Apr', r: 600000, p: 1000000 }, 
                    { name: 'May', r: 850000, p: 1200000 }, 
                    { name: 'Jun', r: collectedRevenue || 1200000, p: totalPipelineValue }
                  ]}>
                    <defs>
                      <linearGradient id="colorR" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 'bold'}} />
                    <Tooltip 
                      contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', padding: '16px'}}
                      labelStyle={{fontWeight: '900', color: '#1e293b', marginBottom: '8px'}}
                    />
                    <Area type="monotone" dataKey="p" stroke="#e2e8f0" strokeWidth={2} fillOpacity={0} />
                    <Area type="monotone" dataKey="r" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorR)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Production Distribution */}
           <div className="p-8 bg-slate-900 text-white border border-slate-800 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Layers size={120} />
              </div>
              <div className="relative z-10 mb-8">
                <h3 className="text-lg font-black">Node Distribution</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Lifecycle Analysis</p>
              </div>
              
              <div className="flex-1 flex flex-col justify-center items-center py-6 relative">
                 <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={projectStats}
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={8}
                        dataKey="value"
                      >
                        {projectStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-6">
                    <span className="text-3xl font-black">{projects.length}</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nodes</span>
                 </div>
              </div>

              <div className="space-y-2 mt-4">
                 {projectStats.map((stat, i) => (
                   <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded-xl text-[10px] font-black uppercase">
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                         {stat.name}
                      </div>
                      <span>{stat.value}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Operational Intelligence Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
           {/* Priority Pipeline */}
           <div className="p-8 bg-white border border-slate-100 rounded-[40px] shadow-sm">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                  <TrendingUp size={24} className="text-red-500" />
                  Priority Engagement
               </h3>
               <Link to="/leads" className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Full Funnel &rarr;</Link>
             </div>
             <div className="space-y-4">
               {leads.filter(l => l.priority === 'Hot').slice(0, 4).map(l => (
                 <div key={l.id} className="p-5 bg-slate-50/50 rounded-3xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black">{l.company.charAt(0)}</div>
                       <div>
                          <div className="font-black text-slate-900 text-sm">{l.company}</div>
                          <div className="text-[9px] text-slate-400 font-bold uppercase">{l.status}</div>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="text-sm font-black text-slate-900">{formatRupee(l.value)}</div>
                    </div>
                 </div>
               ))}
             </div>
           </div>

           {/* Upcoming Project Deadlines */}
           <div className="p-8 bg-white border border-slate-100 rounded-[40px] shadow-sm">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                  <ListTodo size={24} className="text-brand-600" />
                  Critical Task Queue
               </h3>
               <Link to="/projects" className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Operations &rarr;</Link>
             </div>
             <div className="space-y-4">
               {projects.flatMap(p => p.tasks.map(t => ({ ...t, projectTitle: p.title, client: p.client })))
                 .filter(t => t.status !== TaskStatus.DONE && t.dueDate)
                 .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
                 .slice(0, 4)
                 .map(t => {
                   const isUrgent = new Date(t.dueDate!) <= new Date();
                   return (
                     <div key={t.id} className={`p-5 rounded-3xl border flex items-center justify-between transition-all ${isUrgent ? 'bg-red-50/50 border-red-100 shadow-lg shadow-red-50' : 'bg-slate-50/50 border-slate-100'}`}>
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isUrgent ? 'bg-red-600 text-white' : 'bg-slate-900 text-white'}`}>
                              <Clock size={18} />
                           </div>
                           <div>
                              <div className="font-black text-slate-900 text-sm">{t.title}</div>
                              <div className="text-[9px] text-slate-400 font-bold uppercase">{t.client}</div>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className={`text-[10px] font-black uppercase tracking-widest ${isUrgent ? 'text-red-600 animate-pulse' : 'text-slate-500'}`}>{t.dueDate}</div>
                           <div className="text-[9px] font-bold text-slate-300 uppercase">{t.assignee}</div>
                        </div>
                     </div>
                   );
                 })}
             </div>
           </div>
        </div>
      </div>
    );
  };

  const renderBDADashboard = () => {
    // Strictly isolate BDA data: only leads assigned to this user
    const bdaLeads = leads.filter(l => 
      l.assignedTo?.toLowerCase().includes(user.name.split(' ')[0].toLowerCase()) || 
      l.assignedTo === user.name
    );
    
    // Performance Metrics restricted to BDA's scope
    const pipelineValue = bdaLeads.reduce((acc, curr) => acc + (curr.value || 0), 0);
    const realizedRevenue = invoices.filter(i => i.status === 'Paid' && bdaLeads.some(l => l.company === i.client)).reduce((acc, curr) => acc + curr.amount, 0);
    const realizedComm = (realizedRevenue * (user.commissionRate || 8)) / 100;

    const today = new Date();
    today.setHours(0,0,0,0);
    
    // Task Queue isolation: only tasks for this BDA (usually discovery/requirement tasks)
    const bdaTasks = projects.flatMap(p => p.tasks.map(t => ({ ...t, client: p.client })))
      .filter(t => (t.assignee?.toLowerCase().includes(user.name.split(' ')[0].toLowerCase()) || t.assignee === user.name) && t.status !== TaskStatus.DONE);

    const overdueLeads = bdaLeads.filter(l => 
      l.nextFollowUp && new Date(l.nextFollowUp) < today && 
      l.status !== LeadStatus.CLOSED_WON && l.status !== LeadStatus.CLOSED_LOST
    );

    const conversionRate = bdaLeads.length > 0 
      ? Math.round((bdaLeads.filter(l => l.status === LeadStatus.CLOSED_WON).length / bdaLeads.length) * 100) 
      : 0;

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Isolated BDA Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50/50 blur-[60px] rounded-full -mr-10 -mt-10"></div>
          <div>
            <div className="flex items-center gap-2 mb-2">
               <div className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full">Personal Command</div>
               <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Growth Node Active</div>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Focus Node: {user.name.split(' ')[0]}</h1>
            <p className="text-slate-500 mt-1 font-medium">Monitoring your assigned pipeline and conversion velocity.</p>
          </div>
          <div className="flex gap-4 relative z-10">
             <div className="bg-slate-50 border border-slate-100 px-8 py-5 rounded-3xl">
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Commission Earned</div>
                <div className="text-2xl font-black text-green-600">{formatRupee(realizedComm)}</div>
             </div>
          </div>
        </div>

        {/* Priority Intervention Alert */}
        {overdueLeads.length > 0 && (
          <div className="bg-red-50 border-2 border-red-200 p-8 rounded-[40px] shadow-2xl shadow-red-50 flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-red-600 text-white rounded-[24px] flex items-center justify-center shadow-xl shadow-red-200 animate-pulse">
                <AlertOctagon size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-red-900 uppercase tracking-tight">{overdueLeads.length} LEAD STAGNATIONS</h3>
                <p className="text-sm text-red-600 font-bold opacity-80 uppercase tracking-widest">Immediate follow-up required to prevent pipeline leakage.</p>
              </div>
            </div>
            <Link to="/leads" className="bg-red-600 text-white px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-900/20">Execute Follow-ups</Link>
          </div>
        )}

        {/* Restricted Performance Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <DashboardCard title="My Pipeline" value={formatRupee(pipelineValue)} change="Portfolio" positive={true} icon={<Wallet size={20} />} />
           <DashboardCard title="Conversion" value={`${conversionRate}%`} change="Yield" positive={true} icon={<Target size={20} />} />
           <DashboardCard title="Assigned Nodes" value={bdaLeads.length.toString()} change="Entities" positive={true} icon={<Users size={20} />} />
           <DashboardCard title="Est. Revenue" value={formatRupee(realizedRevenue)} change="Closing" positive={true} icon={<TrendingUp size={20} />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Personal Priority Contact Queue */}
           <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8 px-2">
                 <h3 className="font-black text-slate-900 flex items-center gap-3 text-lg uppercase">
                    <Clock size={24} className="text-brand-500" />
                    Pending Engagement
                 </h3>
                 <Link to="/leads" className="text-[10px] font-black text-brand-600 uppercase tracking-widest">View All Leads &rarr;</Link>
              </div>
              <div className="space-y-4">
                 {bdaLeads.filter(l => l.status !== LeadStatus.CLOSED_WON && l.status !== LeadStatus.CLOSED_LOST).slice(0, 5).map(l => (
                    <Link to={`/leads/${l.id}`} key={l.id} className="flex items-center justify-between p-6 bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:border-brand-200 border border-slate-100 rounded-[32px] transition-all group">
                       <div className="flex items-center gap-5">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base border ${l.priority === 'Hot' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-white text-slate-400'}`}>
                             {l.company.charAt(0)}
                          </div>
                          <div>
                             <div className="font-black text-slate-900 group-hover:text-brand-600 transition-colors">{l.company}</div>
                             <div className="text-[10px] text-slate-400 font-bold uppercase">{l.status}</div>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="text-sm font-black text-slate-900">{formatRupee(l.value)}</div>
                          <div className={`text-[9px] font-black uppercase ${new Date(l.nextFollowUp!) < today ? 'text-red-500' : 'text-slate-300'}`}>{l.nextFollowUp}</div>
                       </div>
                    </Link>
                 ))}
                 {bdaLeads.length === 0 && (
                   <div className="p-10 text-center text-slate-400 font-black uppercase tracking-widest">No active nodes assigned.</div>
                 )}
              </div>
           </div>

           {/* Personal Task Queue */}
           <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8 px-2">
                 <h3 className="font-black text-slate-900 flex items-center gap-3 text-lg uppercase">
                    <ListTodo size={24} className="text-brand-600" />
                    My Action Items
                 </h3>
                 <Link to="/projects" className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Operational Ops &rarr;</Link>
              </div>
              <div className="space-y-4">
                 {bdaTasks.slice(0, 5).map(t => (
                    <div key={t.id} className="flex items-center justify-between p-6 bg-slate-50/50 border border-slate-100 rounded-[32px]">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                             <Zap size={18} />
                          </div>
                          <div>
                             <div className="font-black text-slate-900 text-sm">{t.title}</div>
                             <div className="text-[9px] text-slate-400 font-bold uppercase">{t.client}</div>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="text-[10px] font-black uppercase text-slate-500">{t.dueDate || 'No Deadline'}</div>
                          <span className="text-[8px] font-black bg-brand-50 text-brand-600 px-2 py-0.5 rounded uppercase">{t.status}</span>
                       </div>
                    </div>
                 ))}
                 {bdaTasks.length === 0 && (
                   <div className="p-10 text-center text-slate-400 font-black uppercase tracking-widest">Operational queue clear.</div>
                 )}
              </div>
           </div>
        </div>
      </div>
    );
  };

  const renderFinanceDashboard = () => {
    const collectedRevenue = invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
    const outstandingRevenue = invoices.filter(i => i.status !== 'Paid').reduce((acc, curr) => acc + curr.amount, 0);

    return (
      <div className="space-y-10 animate-in fade-in duration-500">
         <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Finance Command Node</h1>
            <p className="text-slate-500 mt-1 font-medium">Monitoring global agency liquidity and account receivables.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-green-600 text-white p-10 rounded-[40px] shadow-2xl">
               <div className="text-[10px] font-black text-green-200 uppercase tracking-widest mb-2">Total Collections</div>
               <div className="text-5xl font-black">{formatRupee(collectedRevenue)}</div>
               <div className="mt-6 flex items-center gap-2 text-sm font-bold">
                  <ArrowUpRight size={18} /> Cycle Integrity: High
               </div>
            </div>
            <div className="bg-slate-900 text-white p-10 rounded-[40px] shadow-2xl">
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Account Receivables</div>
               <div className="text-5xl font-black">{formatRupee(outstandingRevenue)}</div>
               <div className="mt-6 flex items-center gap-2 text-sm font-bold">
                  <Clock size={18} /> Maturing Portfolio
               </div>
            </div>
         </div>
      </div>
    );
  };

  return (
    <div className="pb-10">
      {isFounder ? renderFounderDashboard() : isFinance ? renderFinanceDashboard() : renderBDADashboard()}
    </div>
  );
};

export default Dashboard;
