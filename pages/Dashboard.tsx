
import React from 'react';
import { ResponsiveContainer, XAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import { Link } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import { IndianRupee, Users, AlertCircle, Briefcase, Zap, ShieldAlert, Target, ArrowRight, Wallet, Clock, Activity, Globe } from 'lucide-react';
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
    const bdaLeads = leads.filter(l => 
      l.assignedTo.toLowerCase().includes(user.name.split(' ')[0].toLowerCase()) || 
      l.assignedTo === user.name
    );
    
    const todaysFollowUps = bdaLeads.filter(l => {
       if(!l.nextFollowUp) return false;
       const today = new Date().toISOString().split('T')[0];
       return l.nextFollowUp <= today && l.status !== LeadStatus.CLOSED_WON;
    }).length;

    const pipelineValue = bdaLeads.reduce((acc, curr) => acc + curr.value, 0);
    const estimatedComm = (pipelineValue * (user.commissionRate || 8)) / 100;

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-amber-600 mb-1 uppercase tracking-widest flex items-center gap-2">
              <Zap size={14} /> Sales Cockpit (BDA)
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Go get 'em, {user.name.split(' ')[0]}</h1>
            <p className="text-slate-500 mt-1 font-medium">4-Day closing system active. Check follow-ups.</p>
          </div>
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 border border-indigo-500/20">
             <div className="p-3 bg-white/10 rounded-xl"><IndianRupee size={24} className="text-brand-400" /></div>
             <div>
               <div className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">My Comm. (Est.)</div>
               <div className="text-2xl font-bold tracking-tighter">{formatRupee(estimatedComm)}</div>
             </div>
          </div>
        </div>

        {todaysFollowUps > 0 && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center justify-between border-l-8">
            <div className="flex items-center gap-4">
              <div className="bg-red-500 p-2 rounded-full text-white animate-pulse"><ShieldAlert size={20} /></div>
              <div>
                <h4 className="font-bold text-red-900">{todaysFollowUps} CRITICAL FOLLOW-UPS TODAY</h4>
                <p className="text-xs text-red-700 font-bold">Lost momentum = Lost money. Do not let these go cold.</p>
              </div>
            </div>
            <Link to="/leads" className="px-6 py-2.5 bg-red-600 text-white text-sm font-extrabold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200">Start Calling</Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
               <Zap size={80} className="text-brand-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Activity size={20} className="text-brand-500" />
              Closing Playbook
            </h3>
            <div className="space-y-5 relative z-10">
              {[
                { d: 1, t: "Budget Filter", s: "Verify spending power first." },
                { d: 2, t: "Paid Discovery", s: "₹2k-5k fee confirms intent." },
                { d: 3, t: "3-Tier Proposal", s: "Show options, not just prices." },
                { d: 4, t: "40% Advance", s: "Collect to unlock developers." },
              ].map((step, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center font-bold text-xs text-white">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{step.t}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{step.s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <DashboardCard title="My Pipeline" value={formatRupee(pipelineValue)} change="Active Value" positive={true} icon={<Wallet className="text-green-500" />} />
               <DashboardCard title="Assigned Leads" value={bdaLeads.length.toString()} change="In Stack" positive={true} icon={<Users className="text-indigo-500" />} />
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-full">
               <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
                  <Clock size={18} className="text-brand-500" />
                  Next Up (Follow-ups)
               </h3>
               <div className="space-y-3">
                  {bdaLeads.slice(0, 5).map(lead => (
                    <div key={lead.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all group cursor-pointer">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center font-bold text-slate-900 text-xs shadow-sm">
                             {lead.company.charAt(0)}
                          </div>
                          <div>
                             <div className="text-xs font-bold text-slate-900">{lead.company}</div>
                             <div className="text-[10px] text-slate-400">{lead.status}</div>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{lead.nextFollowUp}</div>
                          <div className="text-xs font-extrabold text-brand-600">{formatRupee(lead.value)}</div>
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
