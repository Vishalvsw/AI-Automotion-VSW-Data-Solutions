
import React from 'react';
import { ResponsiveContainer, XAxis, CartesianGrid, Tooltip, AreaChart, Area, BarChart, Bar, Cell, PieChart, Pie } from 'recharts';
import { Link } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import { 
  IndianRupee, Users, AlertCircle, Briefcase, Zap, 
  Target, ArrowRight, Wallet, Clock, Activity, 
  Globe, TrendingUp, DollarSign, CheckCircle, 
  AlertTriangle, ArrowUpRight, BarChart3, PieChart as PieIcon,
  ShieldCheck, Layers, ChevronRight, PhoneCall, AlertOctagon, Sparkles
} from 'lucide-react';
import { UserRole, LeadStatus, User, ProjectStatus } from '../types';
import { useApp } from '../context/AppContext';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const { leads, projects, invoices } = useApp();
  const isFounder = user.role === UserRole.FOUNDER;
  
  const formatRupee = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(value);
  };

  const renderFounderDashboard = () => {
    // Financial Analytics
    const totalPipelineValue = leads.reduce((acc, curr) => acc + (curr.value || 0), 0);
    const collectedRevenue = invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
    const pendingInvoices = invoices.filter(i => i.status !== 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
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
           <div className="group bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-brand-100 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl group-hover:scale-110 transition-transform"><Briefcase size={24} /></div>
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Active Ops</div>
              </div>
              <div className="text-3xl font-black text-slate-900">{projects.length}</div>
              <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-tight">Strategic Nodes</p>
           </div>

           <div className="group bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-amber-100 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:scale-110 transition-transform"><Target size={24} /></div>
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Conversion</div>
              </div>
              <div className="text-3xl font-black text-slate-900">{conversionRate}%</div>
              <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-tight">Closing Efficiency</p>
           </div>

           <div className="group bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-red-100 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-red-50 text-red-600 rounded-2xl group-hover:scale-110 transition-transform"><AlertCircle size={24} /></div>
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">AR Balance</div>
              </div>
              <div className="text-2xl font-black text-slate-900 truncate">{formatRupee(projectBalanceDue)}</div>
              <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-tight">Total Uncollected</p>
           </div>

           <div className="group bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-green-100 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-2xl group-hover:scale-110 transition-transform"><Zap size={24} /></div>
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Lead Velocity</div>
              </div>
              <div className="text-3xl font-black text-slate-900">{leads.length}</div>
              <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-tight">Incoming Inbound</p>
           </div>
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
                <div className="flex gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl">
                    <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                    <span className="text-[9px] font-black uppercase text-slate-500">Realized</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-xl">
                    <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                    <span className="text-[9px] font-black uppercase text-slate-500">Pipeline</span>
                  </div>
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
                <h3 className="text-lg font-black">Node Status Distribution</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Operational Lifecycle Analysis</p>
              </div>
              
              <div className="flex-1 flex flex-col justify-center items-center py-6 relative">
                 <ResponsiveContainer width="100%" height={200}>
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
                      <Tooltip 
                        contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', fontSize: '10px'}}
                        itemStyle={{color: '#fff', fontWeight: 'bold'}}
                      />
                    </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pt-6">
                    <span className="text-3xl font-black">{projects.length}</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Nodes</span>
                 </div>
              </div>

              <div className="space-y-3 relative z-10 pt-4">
                 {projectStats.map((stat, i) => (
                   <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                         <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{stat.name}</span>
                      </div>
                      <span className="text-sm font-black text-white">{stat.value}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Detailed Operations Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
           {/* Hot Leads Intelligence */}
           <div className="p-8 bg-white border border-slate-100 rounded-[40px] shadow-sm">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                  <TrendingUp size={24} className="text-red-500" />
                  Priority Pipeline Nodes
               </h3>
               <Link to="/leads" className="text-[10px] font-black text-brand-600 uppercase tracking-widest hover:translate-x-1 transition-transform">Audit Funnel &rarr;</Link>
             </div>
             <div className="space-y-4">
               {leads.filter(l => l.priority === 'Hot').slice(0, 5).map(l => (
                 <Link to={`/leads/${l.id}`} key={l.id} className="p-5 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-brand-100 transition-all rounded-[28px] border border-slate-100 flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black border border-red-100 group-hover:bg-red-600 group-hover:text-white transition-all">
                          {l.company.charAt(0)}
                       </div>
                       <div>
                          <div className="font-black text-slate-900">{l.company}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{l.status}</div>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="text-sm font-black text-slate-900">{formatRupee(l.value)}</div>
                       <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{l.assignedTo}</div>
                    </div>
                 </Link>
               ))}
             </div>
           </div>

           {/* Production Health Check */}
           <div className="p-8 bg-white border border-slate-100 rounded-[40px] shadow-sm">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-lg font-black text-slate-900 flex items-center gap-3">
                  <Activity size={24} className="text-amber-500" />
                  Production Queue Health
               </h3>
               <Link to="/projects" className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Global Control &rarr;</Link>
             </div>
             <div className="space-y-6">
               {projects.slice(0, 5).map(p => (
                 <div key={p.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                       <div className="flex items-center gap-3">
                          <div className="text-xs font-black text-slate-900">{p.client}</div>
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                            p.status === ProjectStatus.PRODUCTION ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                          }`}>{p.status}</span>
                       </div>
                       <span className="text-[10px] font-black text-brand-600 tracking-tighter">{p.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                       <div 
                         className={`h-full rounded-full transition-all duration-1000 ${p.progress > 80 ? 'bg-green-500' : p.progress > 40 ? 'bg-brand-500' : 'bg-amber-500'}`} 
                         style={{width: `${p.progress}%`}}
                       ></div>
                    </div>
                    <div className="flex justify-between text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] pt-1">
                       <span>Due: {new Date(p.dueDate).toLocaleDateString()}</span>
                       <span>Bal: {formatRupee(Math.abs(p.financials.balance))}</span>
                    </div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    );
  };

  const renderBDADashboard = () => {
    const bdaLeads = leads.filter(l => 
      l.assignedTo?.toLowerCase().includes(user.name.split(' ')[0].toLowerCase()) || 
      l.assignedTo === user.name
    );
    
    const pipelineValue = bdaLeads.reduce((acc, curr) => acc + (curr.value || 0), 0);
    const potentialComm = (pipelineValue * (user.commissionRate || 8)) / 100;
    
    const myClientNames = new Set(bdaLeads.map(l => l.company));
    const myPaidInvoices = invoices.filter(i => i.status === 'Paid' && myClientNames.has(i.client));
    const realizedRevenue = myPaidInvoices.reduce((acc, curr) => acc + curr.amount, 0);
    const realizedComm = (realizedRevenue * (user.commissionRate || 8)) / 100;

    const today = new Date();
    today.setHours(0,0,0,0);
    const todayStr = today.toISOString().split('T')[0];

    const overdueLeads = bdaLeads.filter(l => 
      l.nextFollowUp && new Date(l.nextFollowUp) < today && 
      l.status !== LeadStatus.CLOSED_WON && l.status !== LeadStatus.CLOSED_LOST
    );

    const todaysFollowUps = bdaLeads.filter(l => 
      l.nextFollowUp === todayStr && 
      l.status !== LeadStatus.CLOSED_WON && l.status !== LeadStatus.CLOSED_LOST
    );

    const conversionRate = bdaLeads.length > 0 
      ? Math.round((bdaLeads.filter(l => l.status === LeadStatus.CLOSED_WON).length / bdaLeads.length) * 100) 
      : 0;

    const targetProgress = user.salesTarget 
      ? Math.round((realizedRevenue / user.salesTarget) * 100) 
      : 0;

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-amber-600 mb-1 uppercase tracking-widest flex items-center gap-2">
              <Zap size={14} /> My Performance Cockpit
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Hello, {user.name.split(' ')[0]}</h1>
            <p className="text-slate-500 mt-1 font-medium">Tracking your personal sales targets and earnings.</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-white border border-slate-200 px-6 py-4 rounded-2xl shadow-sm text-right">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Commission Earned</div>
                <div className="text-2xl font-black text-green-600">{formatRupee(realizedComm)}</div>
             </div>
             <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-xl border border-slate-800 text-right">
                <div className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">In My Pipeline</div>
                <div className="text-2xl font-black">{formatRupee(pipelineValue)}</div>
             </div>
          </div>
        </div>

        {/* PROMINENT OVERDUE WIDGET SECTION - CRITICAL INTERVENTION */}
        {overdueLeads.length > 0 && (
          <div className="grid grid-cols-1 gap-6 animate-in slide-in-from-top-4 duration-700">
            <div className="bg-white border-2 border-red-100 rounded-[40px] overflow-hidden shadow-2xl shadow-red-50 relative">
              <div className="bg-gradient-to-r from-red-600 to-rose-700 p-8 flex items-center justify-between text-white relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <AlertOctagon size={120} />
                </div>
                <div className="flex items-center gap-6 relative z-10">
                   <div className="w-16 h-16 bg-white/20 rounded-[24px] flex items-center justify-center backdrop-blur-md animate-pulse border border-white/30">
                      <AlertTriangle size={32} />
                   </div>
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-white/20 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest backdrop-blur-sm">System Priority 1</span>
                        <h2 className="text-2xl font-black uppercase tracking-tight">STAGNANT NODE ALERT</h2>
                      </div>
                      <p className="text-sm text-red-100 font-bold opacity-80 uppercase tracking-widest flex items-center gap-2">
                        <Sparkles size={14} className="animate-spin duration-[3000ms]" /> Intelligence detects {overdueLeads.length} critical lapses in engagement strategy
                      </p>
                   </div>
                </div>
                <Link to="/leads" className="bg-white text-red-600 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-2xl shadow-red-900/40 relative z-10">
                   Audit Cockpit
                </Link>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-red-50/20">
                {overdueLeads.map(lead => {
                  const daysLate = Math.floor((today.getTime() - new Date(lead.nextFollowUp!).getTime()) / (1000 * 3600 * 24));
                  return (
                    <Link 
                      to={`/leads/${lead.id}`} 
                      key={lead.id} 
                      className="bg-white p-6 rounded-[32px] border border-red-100 hover:border-red-500 hover:shadow-2xl hover:-translate-y-1 transition-all group flex flex-col justify-between min-h-[180px] relative overflow-hidden"
                    >
                      <div className="absolute -right-4 -top-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                         <Target size={80} />
                      </div>
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg border transition-all ${
                            lead.priority === 'Hot' ? 'bg-red-50 text-red-600 border-red-100 group-hover:bg-red-600 group-hover:text-white' : 'bg-slate-50 text-slate-400 border-slate-100 group-hover:bg-slate-900 group-hover:text-white'
                          }`}>
                            {lead.company.charAt(0)}
                          </div>
                          <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest animate-pulse ${
                            daysLate > 3 ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700'
                          }`}>
                            {daysLate} Days Stagnant
                          </div>
                        </div>
                        <h4 className="font-black text-slate-900 group-hover:text-red-600 transition-colors text-lg leading-tight mb-1">{lead.company}</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lead.name}</p>
                      </div>
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-red-50/50">
                         <span className="text-base font-black text-slate-900">{formatRupee(lead.value)}</span>
                         <div className="flex items-center gap-1.5 text-[9px] font-black text-red-600 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                            Intervene <ChevronRight size={14} />
                         </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {todaysFollowUps.length > 0 && overdueLeads.length === 0 && (
          <div className="bg-brand-50 border border-brand-200 p-6 rounded-[32px] flex items-center justify-between border-l-8 border-brand-500 shadow-xl shadow-brand-100 animate-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-6">
              <div className="bg-brand-500 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brand-200"><Clock size={28} /></div>
              <div>
                <h4 className="text-xl font-black text-brand-900 uppercase tracking-tight">{todaysFollowUps.length} SCHEDULED FOR TODAY</h4>
                <p className="text-xs text-brand-700 font-bold uppercase tracking-widest opacity-80">Cycle Intelligence suggests immediate strategic contact.</p>
              </div>
            </div>
            <Link to="/leads" className="px-8 py-4 bg-brand-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-brand-700 shadow-xl shadow-brand-200">Execute Schedule</Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
           <DashboardCard title="Personal Pipeline" value={formatRupee(pipelineValue)} change="Active Leads" positive={true} icon={<Wallet size={20} />} />
           <DashboardCard title="Conversion Rate" value={`${conversionRate}%`} change="Closed Won" positive={true} icon={<Target size={20} />} />
           <DashboardCard title="Assigned Nodes" value={bdaLeads.length.toString()} change="Portfolio" positive={true} icon={<Users size={20} />} />
           <DashboardCard title="Potential Bonus" value={formatRupee(potentialComm)} change="Projection" positive={true} icon={<TrendingUp size={20} />} />
           <DashboardCard 
              title="Sales Target" 
              value={formatRupee(user.salesTarget || 0)} 
              change={`${targetProgress}% Achieved`} 
              positive={targetProgress >= 40} 
              icon={<Target size={20} className="text-brand-600" />} 
           />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-200 p-8 shadow-sm h-full flex flex-col">
               <div className="flex justify-between items-center mb-8 px-2">
                 <h3 className="font-black text-slate-900 flex items-center gap-3 text-lg uppercase tracking-tight">
                    <Clock size={24} className="text-brand-500" />
                    Priority Engagement Queue
                 </h3>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">Intelligent Sort</span>
               </div>
               <div className="space-y-4 flex-1">
                  {bdaLeads.length > 0 ? bdaLeads.sort((a, b) => (a.priority === 'Hot' ? -1 : 1)).slice(0, 5).map(lead => {
                    const isLate = lead.nextFollowUp && new Date(lead.nextFollowUp) < today;
                    return (
                      <Link to={`/leads/${lead.id}`} key={lead.id} className={`flex items-center justify-between p-6 rounded-[32px] border transition-all group cursor-pointer ${
                        isLate ? 'bg-red-50/30 border-red-100 hover:shadow-xl hover:shadow-red-50' : 'bg-slate-50/30 border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-slate-100 hover:border-brand-200'
                      }`}>
                         <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-base border shadow-sm transition-all ${
                              lead.priority === 'Hot' ? 'bg-red-50 text-red-600 border-red-100 group-hover:bg-red-600 group-hover:text-white' : 'bg-white text-slate-600 border-slate-100 group-hover:bg-slate-900 group-hover:text-white'
                            }`}>
                               {lead.company.charAt(0)}
                            </div>
                            <div>
                               <div className="text-base font-black text-slate-900 group-hover:text-brand-600 transition-colors flex items-center gap-3">
                                 {lead.company}
                                 {isLate && <span className="bg-red-600 text-white text-[7px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest animate-pulse">Critical Delay</span>}
                               </div>
                               <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{lead.status}</div>
                            </div>
                         </div>
                         <div className="text-right">
                            <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isLate ? 'text-red-500' : 'text-slate-400'}`}>
                               {lead.nextFollowUp || 'No Date'}
                            </div>
                            <div className="text-base font-black text-slate-900">{formatRupee(lead.value)}</div>
                         </div>
                      </Link>
                    );
                  }) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-40">
                      <Target size={40} className="mb-2" />
                      <p className="font-bold text-sm uppercase tracking-widest">No active leads assigned</p>
                    </div>
                  )}
               </div>
               <Link to="/leads" className="mt-8 text-[10px] font-black text-slate-400 flex items-center justify-center gap-3 hover:text-brand-600 transition-colors uppercase tracking-widest p-6 border-2 border-dashed border-slate-100 rounded-[32px] hover:bg-brand-50/50 hover:border-brand-100">
                  Access Full BDA Infrastructure Cockpit <ArrowRight size={14} />
               </Link>
          </div>

          <div className="lg:col-span-1 bg-slate-900 text-white rounded-[40px] p-10 shadow-2xl relative overflow-hidden group flex flex-col">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
               <Zap size={100} className="text-brand-400" />
            </div>
            <h3 className="text-xl font-black mb-10 flex items-center gap-3 relative z-10 uppercase tracking-tight">
              <Activity size={24} className="text-brand-400" />
              Sales Velocity
            </h3>
            <div className="space-y-10 relative z-10 flex-1">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
                 <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Cycle Conversion Efficiency</div>
                 <div className="flex justify-between items-end mb-3">
                    <span className="text-3xl font-black">{conversionRate}%</span>
                    <span className="text-[10px] font-black text-brand-400 uppercase">Goal: 30%</span>
                 </div>
                 <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.5)]" style={{ width: `${Math.min(conversionRate, 100)}%` }}></div>
                 </div>
              </div>

              <div className="space-y-5">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Strategic Objectives</h4>
                {[
                  { label: "Hot Lead Conversion", sub: "Convert 2 priority nodes", done: realizedRevenue > 50000 },
                  { label: "Follow-up Hygiene", sub: "No overdue tasks", done: overdueLeads.length === 0 },
                  { label: "Revenue Milestone", sub: "Achieve ₹1L realized", done: realizedRevenue >= 100000 },
                ].map((obj, i) => (
                  <div key={i} className="flex items-center gap-4 group/item">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${obj.done ? 'bg-green-500 text-slate-900 scale-110' : 'bg-white/10 text-white/20 group-hover/item:bg-white/20'}`}>
                      <CheckCircle size={14} />
                    </div>
                    <div>
                      <div className={`text-xs font-black uppercase tracking-tight ${obj.done ? 'text-white' : 'text-slate-400'}`}>{obj.label}</div>
                      <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{obj.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pb-10">
      {isFounder ? renderFounderDashboard() : renderBDADashboard()}
    </div>
  );
};

export default Dashboard;
