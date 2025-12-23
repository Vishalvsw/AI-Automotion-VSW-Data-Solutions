
import React from 'react';
import { ResponsiveContainer, XAxis, CartesianGrid, Tooltip, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import { 
  IndianRupee, Briefcase, Zap, 
  Target, ArrowRight, Wallet, Clock, 
  TrendingUp, CheckCircle, 
  ArrowUpRight, ListTodo,
  ShieldCheck, Layers, ChevronRight, Sparkles, Trophy, AlertOctagon, UserCheck, PhoneCall, Mail, UserPlus
} from 'lucide-react';
import { UserRole, LeadStatus, User, ProjectStatus, TaskStatus, Lead } from '../types';
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
    const totalPipelineValue = leads.reduce((acc, curr) => acc + (curr.value || 0), 0);
    const collectedRevenue = invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
    const projectBalanceDue = projects.reduce((acc, curr) => acc + Math.abs(curr.financials.balance), 0);
    
    const closedWonCount = leads.filter(l => l.status === LeadStatus.CLOSED_WON).length;
    const conversionRate = leads.length > 0 ? Math.round((closedWonCount / leads.length) * 100) : 0;

    const projectStats = Object.values(ProjectStatus).map(status => ({
      name: status,
      value: projects.filter(p => p.status === status).length
    })).filter(s => s.value > 0);

    const COLORS = ['#3b82f6', '#8b5cf6', '#6366f1', '#10b981', '#f59e0b', '#ef4444'];

    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
            {/* New Pending HR Applications Alert */}
            <Link to="/settings" className="bg-brand-50 border border-brand-100 px-6 py-4 rounded-3xl min-w-[160px] flex flex-col justify-center group hover:bg-brand-100 transition-colors cursor-pointer">
              <div className="text-[10px] text-brand-600 font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                 <UserPlus size={14} /> HR Action
              </div>
              <div className="text-2xl font-black text-brand-900">2 Pending</div>
              <div className="text-[9px] font-bold text-brand-500 mt-1 group-hover:underline">Review Applications</div>
            </Link>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <DashboardCard title="Active Ops" value={projects.length.toString()} change="Nodes" positive={true} icon={<Briefcase size={20} />} />
           <DashboardCard title="Conversion" value={`${conversionRate}%`} change="Efficiency" positive={true} icon={<Target size={20} />} />
           <DashboardCard title="AR Balance" value={formatRupee(projectBalanceDue)} change="Uncollected" positive={false} icon={<IndianRupee size={20} />} />
           <DashboardCard title="Lead Velocity" value={leads.length.toString()} change="Inbound" positive={true} icon={<Zap size={20} />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
      </div>
    );
  };

  const renderFinanceDashboard = () => {
    const collectedRevenue = invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
    const pendingAmount = invoices.filter(i => i.status === 'Pending' || i.status === 'Overdue').reduce((acc, curr) => acc + curr.amount, 0);
    const totalPipelineValue = leads.reduce((acc, curr) => acc + (curr.value || 0), 0);

    return (
      <div className="space-y-10 animate-in fade-in duration-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50/50 blur-[100px] rounded-full -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
                Finance Intelligence
              </div>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Fiscal Dashboard</h1>
            <p className="text-slate-500 mt-1 font-medium max-w-md">Monitoring agency financial health and cash flow velocity.</p>
          </div>
          
          <div className="flex flex-wrap gap-4 relative z-10">
            <div className="bg-green-600 text-white px-8 py-5 rounded-3xl shadow-xl shadow-green-100">
              <div className="text-[10px] text-green-200 font-black uppercase tracking-widest mb-1">Settled Funds</div>
              <div className="text-3xl font-black">{formatRupee(collectedRevenue)}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <DashboardCard title="Revenue Collected" value={formatRupee(collectedRevenue)} change="Liquid" positive={true} icon={<Wallet size={20} />} />
           <DashboardCard title="Pending AR" value={formatRupee(pendingAmount)} change="Overdue" positive={false} icon={<Clock size={20} />} />
           <DashboardCard title="Pipeline Mass" value={formatRupee(totalPipelineValue)} change="Potential" positive={true} icon={<TrendingUp size={20} />} />
        </div>

        <div className="p-8 bg-white border border-slate-100 rounded-[40px] shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-black text-slate-900">Ledger Distribution</h3>
           </div>
           <div className="h-64 flex flex-col items-center justify-center text-slate-300 font-black uppercase tracking-widest italic gap-4">
              <IndianRupee size={48} className="opacity-20" />
              <span>Full fiscal ledger available in the Financials cockpit.</span>
           </div>
        </div>
      </div>
    );
  };

  const renderBDADashboard = () => {
    // STRICT ISOLATION: BDA only sees leads assigned to them.
    const bdaLeads = leads.filter(l => 
      l.assignedTo?.toLowerCase().includes(user.name.split(' ')[0].toLowerCase()) || 
      l.assignedTo === user.name
    );
    
    // Financials restricted to personal commission and earned portfolio
    const pipelineValue = bdaLeads.reduce((acc, curr) => acc + (curr.value || 0), 0);
    const myClientNames = new Set(bdaLeads.map(l => l.company));
    const myPaidInvoices = invoices.filter(i => i.status === 'Paid' && myClientNames.has(i.client));
    
    const realizedRevenue = myPaidInvoices.reduce((acc, curr) => acc + curr.amount, 0);
    // BDA Commission = 8% of realized (paid) revenue
    const realizedComm = (realizedRevenue * (user.commissionRate || 8)) / 100;
    // Potential Commission = 8% of total pipeline value (leads that are won or pending)
    const potentialComm = (pipelineValue * (user.commissionRate || 8)) / 100;

    const today = new Date();
    today.setHours(0,0,0,0);
    
    const overdueLeads = bdaLeads.filter(l => 
      l.nextFollowUp && new Date(l.nextFollowUp) < today && 
      l.status !== LeadStatus.CLOSED_WON && l.status !== LeadStatus.CLOSED_LOST
    );

    const wonLeads = bdaLeads.filter(l => l.status === LeadStatus.CLOSED_WON);
    const conversionRate = bdaLeads.length > 0 ? Math.round((wonLeads.length / bdaLeads.length) * 100) : 0;
    const targetProgress = user.salesTarget ? Math.min(Math.round((realizedRevenue / user.salesTarget) * 100), 100) : 0;

    const allPendingTasks = bdaLeads.flatMap(l => (l.tasks || []).filter(t => t.status === TaskStatus.TODO));

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-50/40 blur-[80px] rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
               <div className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-full">Growth Operative Access</div>
               <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                 <ShieldCheck size={12} className="text-brand-500" /> Identity: {user.name} (8% Commission Tier)
               </div>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Growth Command</h1>
            <p className="text-slate-500 mt-1 font-medium">Monitoring personal earnings and active sales pipeline mass.</p>
          </div>
          <div className="flex gap-4 relative z-10">
             <div className="bg-green-600 text-white px-10 py-6 rounded-3xl shadow-2xl shadow-green-100 text-center">
                <div className="text-[10px] text-green-200 font-black uppercase tracking-widest mb-1">Settled Commissions</div>
                <div className="text-3xl font-black">{formatRupee(realizedComm)}</div>
                <div className="text-[9px] text-green-200/60 font-black uppercase mt-1 tracking-tighter">8% of collected funds</div>
             </div>
          </div>
        </div>

        {overdueLeads.length > 0 && (
          <div className="bg-red-50 border-2 border-red-100 p-8 rounded-[40px] shadow-xl shadow-red-50/50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-red-600 text-white rounded-[24px] flex items-center justify-center shadow-xl">
                <AlertOctagon size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-red-900 uppercase tracking-tight">{overdueLeads.length} CRITICAL LEAKAGE NODES</h3>
                <p className="text-sm text-red-600 font-bold opacity-80 uppercase tracking-widest">Pipeline drop detected. Execute follow-up protocols immediately.</p>
              </div>
            </div>
            <Link to="/leads" className="bg-red-600 text-white px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-3">
               Secure Nodes <ArrowRight size={18} />
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between group">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl"><Target size={24} /></div>
                <div className="flex flex-col">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Sales Achievement Index</h3>
                  {user.salesTarget && <span className="text-[9px] font-black text-slate-900 mt-1">Goal: {formatRupee(user.salesTarget)}</span>}
                </div>
              </div>
              <div className="space-y-4">
                 <div className="flex justify-between items-end">
                    <span className="text-3xl font-black text-slate-900">{targetProgress}%</span>
                    <span className="text-[9px] font-black text-brand-600 uppercase tracking-widest">{formatRupee(realizedRevenue)} Paid</span>
                 </div>
                 <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-600 rounded-full transition-all duration-1000" style={{ width: `${targetProgress}%` }}></div>
                 </div>
              </div>
           </div>

           <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col justify-between border border-slate-800">
              <div className="absolute -bottom-4 -right-4 p-8 opacity-10"><Wallet size={120} /></div>
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-white/10 text-brand-400 rounded-2xl"><Zap size={24} /></div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Strategic Pipeline</h3>
                 </div>
                 <div className="text-4xl font-black text-white mt-4">{formatRupee(pipelineValue)}</div>
                 <p className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mt-2">Unrealized Revenue Value</p>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><TrendingUp size={24} /></div>
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Closing Velocity</h3>
              </div>
              <div className="flex flex-col items-center">
                 <div className="text-5xl font-black text-slate-900 mb-1">{conversionRate}%</div>
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Winning Ratio</div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-8 px-2">
                 <h3 className="font-black text-slate-900 flex items-center gap-3 text-lg uppercase">
                    <ListTodo size={24} className="text-brand-600" />
                    Actionable BDA Nodes
                 </h3>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{allPendingTasks.length} Pending High-Impact Actions</span>
              </div>
              <div className="space-y-4 flex-1">
                 {allPendingTasks.map(task => {
                    const leadId = leads.find(l => l.company === task.client)?.id;
                    return (
                      <div key={task.id} className="p-5 bg-slate-50 border border-slate-100 rounded-[32px] hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-600 shadow-sm border border-slate-100 group-hover:bg-brand-600 group-hover:text-white transition-all">
                                 {task.title.toLowerCase().includes('call') ? <PhoneCall size={20} /> : <Zap size={20} />}
                              </div>
                              <div>
                                 <div className="font-black text-slate-900 group-hover:text-brand-700 transition-colors">{task.title}</div>
                                 <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{task.client}</div>
                              </div>
                           </div>
                           <Link to={`/leads/${leadId}`} className="p-3 bg-white text-brand-600 hover:bg-brand-600 hover:text-white rounded-xl transition-all shadow-sm">
                              <ArrowRight size={16} />
                           </Link>
                        </div>
                        <div className="mt-4 flex items-center justify-between pt-4 border-t border-slate-200/50">
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <Clock size={12} /> Target: {task.dueDate}
                           </span>
                           <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase ${task.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-slate-200 text-slate-500'}`}>
                              {task.priority}
                           </span>
                        </div>
                      </div>
                    );
                 })}
                 {allPendingTasks.length === 0 && (
                   <div className="p-12 text-center text-slate-300 font-black uppercase tracking-widest italic flex flex-col items-center gap-4">
                      <CheckCircle size={48} className="opacity-20" />
                      Zero pending actions. Pipeline optimized.
                   </div>
                 )}
              </div>
           </div>

           <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8 px-2">
                 <h3 className="font-black text-slate-900 flex items-center gap-3 text-lg uppercase">
                    <Sparkles size={24} className="text-brand-600" />
                    In-Cycle Commission
                 </h3>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Predicted Earnings</span>
              </div>
              <div className="p-10 text-center bg-brand-50 rounded-[32px] border border-brand-100">
                 <div className="text-[10px] font-black text-brand-400 uppercase tracking-[0.3em] mb-2">Total Cycle Bonus Potential</div>
                 <div className="text-5xl font-black text-brand-700 mb-2">{formatRupee(potentialComm)}</div>
                 <p className="text-[11px] font-bold text-brand-600 uppercase tracking-widest">Base Rate: 8.00% across all project nodes</p>
                 <div className="mt-10 grid grid-cols-2 gap-6">
                    <div className="bg-white p-5 rounded-[24px] shadow-sm border border-brand-100">
                       <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Hot Targets</div>
                       <div className="text-xl font-black text-red-600">{bdaLeads.filter(l => l.priority === 'Hot').length}</div>
                    </div>
                    <div className="bg-white p-5 rounded-[24px] shadow-sm border border-brand-100">
                       <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Warm Flows</div>
                       <div className="text-xl font-black text-brand-600">{bdaLeads.filter(l => l.priority === 'Warm').length}</div>
                    </div>
                 </div>
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
