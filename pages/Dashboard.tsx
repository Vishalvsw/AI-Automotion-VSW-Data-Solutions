
import React from 'react';
import { ResponsiveContainer, XAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import { Link } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
// Added CheckCircle to imports
import { IndianRupee, Users, AlertCircle, Briefcase, Zap, ShieldAlert, Target, ArrowRight, Wallet, Clock, Activity, Globe, TrendingUp, DollarSign, CheckCircle } from 'lucide-react';
import { UserRole, LeadStatus, User } from '../types';
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
    const totalPipelineValue = leads.reduce((acc, curr) => acc + (curr.value || 0), 0);
    const collectedRevenue = invoices.filter(i => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
    const pendingInvoices = invoices.filter(i => i.status !== 'Paid').reduce((acc, curr) => acc + curr.amount, 0);

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-brand-600 mb-1 uppercase tracking-widest flex items-center gap-2">
              <Globe size={14} /> Global Enterprise Dashboard
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome, Founder</h1>
            <p className="text-slate-500 mt-1 font-medium">Monitoring real-time agency performance metrics.</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white border border-slate-200 px-5 py-3 rounded-2xl shadow-sm">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Cash In Hand</div>
              <div className="text-xl font-bold text-slate-900">{formatRupee(collectedRevenue)}</div>
            </div>
            <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl">
              <div className="text-[10px] text-slate-300 font-bold uppercase tracking-wider mb-1">Total Pipeline</div>
              <div className="text-xl font-bold">{formatRupee(totalPipelineValue)}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <DashboardCard title="Active Projects" value={projects.length.toString()} change="Real-time" positive={true} icon={<Briefcase />} />
           <DashboardCard title="Active Leads" value={leads.length.toString()} change="Sales Funnel" positive={true} icon={<Users />} />
           <DashboardCard title="Outstanding" value={formatRupee(pendingInvoices)} change="Action Req" positive={false} icon={<AlertCircle />} />
           <DashboardCard title="Conversion" value="28%" change="+4%" positive={true} icon={<Target />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900">Revenue Velocity</h3>
                <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-md">Live</span>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[
                    { name: 'Jan', r: 300000 }, { name: 'Feb', r: 450000 }, { name: 'Mar', r: 380000 },
                    { name: 'Apr', r: 600000 }, { name: 'May', r: 850000 }, { name: 'Jun', r: collectedRevenue || 1200000 }
                  ]}>
                    <defs>
                      <linearGradient id="colorR" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                    <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    <Area type="monotone" dataKey="r" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorR)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
             <h3 className="font-bold text-slate-900 mb-6">Production Queue Health</h3>
             <div className="space-y-5">
               {projects.slice(0, 5).map(p => (
                 <div key={p.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                       <Briefcase size={20} />
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-900">{p.client}</span>
                          <span className="text-brand-600">{p.progress}%</span>
                       </div>
                       <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-700 ${p.progress > 80 ? 'bg-green-500' : 'bg-brand-500'}`} style={{width: `${p.progress}%`}}></div>
                       </div>
                    </div>
                 </div>
               ))}
             </div>
             <Link to="/projects" className="mt-8 text-xs font-bold text-slate-400 flex items-center gap-1 hover:text-brand-600 transition-colors uppercase tracking-widest">
                Go to Production Control <ArrowRight size={14} />
             </Link>
           </div>
        </div>
      </div>
    );
  };

  const renderBDADashboard = () => {
    // 1. Strictly isolate leads assigned to this BDA
    const bdaLeads = leads.filter(l => 
      l.assignedTo?.toLowerCase().includes(user.name.split(' ')[0].toLowerCase()) || 
      l.assignedTo === user.name
    );
    
    // 2. Performance Metrics (Personalized)
    const pipelineValue = bdaLeads.reduce((acc, curr) => acc + (curr.value || 0), 0);
    const potentialComm = (pipelineValue * (user.commissionRate || 8)) / 100;
    
    // 3. Realized Performance (Paid Invoices for my leads)
    const myClientNames = new Set(bdaLeads.map(l => l.company));
    const myPaidInvoices = invoices.filter(i => i.status === 'Paid' && myClientNames.has(i.client));
    const realizedRevenue = myPaidInvoices.reduce((acc, curr) => acc + curr.amount, 0);
    const realizedComm = (realizedRevenue * (user.commissionRate || 8)) / 100;

    // 4. Critical Follow-ups
    const todaysFollowUps = bdaLeads.filter(l => {
       if(!l.nextFollowUp) return false;
       const today = new Date().toISOString().split('T')[0];
       return l.nextFollowUp <= today && l.status !== LeadStatus.CLOSED_WON && l.status !== LeadStatus.CLOSED_LOST;
    });

    const conversionRate = bdaLeads.length > 0 
      ? Math.round((bdaLeads.filter(l => l.status === LeadStatus.CLOSED_WON).length / bdaLeads.length) * 100) 
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

        {todaysFollowUps.length > 0 && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center justify-between border-l-8">
            <div className="flex items-center gap-4">
              <div className="bg-red-500 p-2 rounded-full text-white animate-pulse"><ShieldAlert size={20} /></div>
              <div>
                <h4 className="font-bold text-red-900">{todaysFollowUps.length} ACTIONABLE FOLLOW-UPS</h4>
                <p className="text-xs text-red-700 font-bold">Priority nodes are cooling down. Re-engage immediately.</p>
              </div>
            </div>
            <Link to="/leads" className="px-6 py-2.5 bg-red-600 text-white text-sm font-extrabold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200">View Queue</Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <DashboardCard title="Personal Pipeline" value={formatRupee(pipelineValue)} change="Active Leads" positive={true} icon={<Wallet size={20} />} />
           <DashboardCard title="Conversion Rate" value={`${conversionRate}%`} change="Closed Won" positive={true} icon={<Target size={20} />} />
           <DashboardCard title="Assigned Nodes" value={bdaLeads.length.toString()} change="Portfolio" positive={true} icon={<Users size={20} />} />
           <DashboardCard title="Potential Bonus" value={formatRupee(potentialComm)} change="Projection" positive={true} icon={<TrendingUp size={20} />} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm h-full flex flex-col">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
                    <Clock size={20} className="text-brand-500" />
                    Strategic Follow-up Queue
                 </h3>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">Top 5 Priority</span>
               </div>
               <div className="space-y-3 flex-1">
                  {bdaLeads.length > 0 ? bdaLeads.sort((a, b) => (a.priority === 'Hot' ? -1 : 1)).slice(0, 5).map(lead => (
                    <div key={lead.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-xl hover:border-brand-200 transition-all group cursor-pointer">
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border shadow-sm ${
                            lead.priority === 'Hot' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-white text-slate-600 border-slate-100'
                          }`}>
                             {lead.company.charAt(0)}
                          </div>
                          <div>
                             <div className="text-sm font-black text-slate-900 group-hover:text-brand-600 transition-colors">{lead.company}</div>
                             <div className="text-[10px] text-slate-400 font-black uppercase tracking-tight">{lead.status}</div>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className={`text-[10px] font-black uppercase tracking-wider ${new Date(lead.nextFollowUp || '') <= new Date() ? 'text-red-500' : 'text-slate-400'}`}>
                             {lead.nextFollowUp || 'No Date'}
                          </div>
                          <div className="text-sm font-black text-slate-900">{formatRupee(lead.value)}</div>
                       </div>
                    </div>
                  )) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-40">
                      <Target size={40} className="mb-2" />
                      <p className="font-bold text-sm uppercase tracking-widest">No active leads assigned</p>
                    </div>
                  )}
               </div>
               <Link to="/leads" className="mt-8 text-xs font-black text-slate-400 flex items-center justify-center gap-2 hover:text-brand-600 transition-colors uppercase tracking-widest p-4 border-2 border-dashed border-slate-100 rounded-2xl hover:bg-brand-50/50 hover:border-brand-100">
                  Access Full BDA Cockpit <ArrowRight size={14} />
               </Link>
          </div>

          <div className="lg:col-span-1 bg-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-700">
               <Zap size={100} className="text-brand-400" />
            </div>
            <h3 className="text-xl font-black mb-8 flex items-center gap-3">
              <Activity size={24} className="text-brand-400" />
              Sales Performance
            </h3>
            <div className="space-y-8 relative z-10">
              <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Weekly Target Progress</div>
                 <div className="flex justify-between items-end mb-2">
                    <span className="text-2xl font-black">{conversionRate}%</span>
                    <span className="text-[10px] font-bold text-brand-400">Target: 30%</span>
                 </div>
                 <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 rounded-full transition-all duration-1000" style={{ width: `${Math.min(conversionRate, 100)}%` }}></div>
                 </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Objectives</h4>
                {[
                  { label: "Hot Lead Conversion", sub: "Convert 2 priority nodes", done: realizedRevenue > 50000 },
                  { label: "Follow-up Hygiene", sub: "No overdue tasks > 24h", done: todaysFollowUps.length === 0 },
                  { label: "Revenue Milestone", sub: "Achieve ₹1L realized", done: realizedRevenue >= 100000 },
                ].map((obj, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center ${obj.done ? 'bg-green-500 text-slate-900' : 'bg-white/10 text-white/20'}`}>
                      <CheckCircle size={12} />
                    </div>
                    <div>
                      <div className={`text-xs font-bold ${obj.done ? 'text-white' : 'text-slate-400'}`}>{obj.label}</div>
                      <div className="text-[9px] text-slate-500 uppercase tracking-tighter">{obj.sub}</div>
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
