import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import { DASHBOARD_STATS, MOCK_LEADS, MOCK_PROJECTS, MOCK_INVOICES } from '../services/mockData';
import { IndianRupee, Users, CheckSquare, AlertCircle, Phone, Code, Truck, Heart, Megaphone, Target, Briefcase, TrendingUp, Activity } from 'lucide-react';
import { UserRole, LeadStatus, User } from '../types';

interface DashboardProps {
  user: User;
}

const data = [
  { name: 'Jan', revenue: 320000, leads: 24, activity: 120 },
  { name: 'Feb', revenue: 240000, leads: 13, activity: 90 },
  { name: 'Mar', revenue: 160000, leads: 38, activity: 150 },
  { name: 'Apr', revenue: 220000, leads: 39, activity: 180 },
  { name: 'May', revenue: 150000, leads: 48, activity: 200 },
  { name: 'Jun', revenue: 190000, leads: 38, activity: 170 },
  { name: 'Jul', revenue: 280000, leads: 43, activity: 220 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  // Use the passed user prop for role determination
  // Default to user's actual role, but allow switching ONLY if not BDA/Client
  const [currentViewRole, setCurrentViewRole] = useState<UserRole>(user.role);

  // Sync state if user prop changes
  useEffect(() => {
    setCurrentViewRole(user.role);
  }, [user]);

  const formatRupee = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const renderContent = () => {
    switch (currentViewRole) {
      case UserRole.BDA:
        return renderBDADashboard();
      case UserRole.CEO:
      case UserRole.FOUNDER:
        return renderExecutiveDashboard();
      case UserRole.CTO:
        return renderTechDashboard();
      case UserRole.FINANCE_MANAGER:
        return renderFinanceDashboard();
      case UserRole.MARKETING_MANAGER:
        return renderMarketingDashboard();
      default:
        // Admin or others fall back to Executive view usually, or BDA view if they are BDA
        return user.role === UserRole.BDA ? renderBDADashboard() : renderExecutiveDashboard();
    }
  };

  const renderBDADashboard = () => {
    // FILTER DATA FOR LOGGED IN BDA ONLY
    // We match by first name or full name match in 'assignedTo'
    const bdaLeads = MOCK_LEADS.filter(l => 
      l.assignedTo.toLowerCase().includes(user.name.split(' ')[0].toLowerCase()) || 
      l.assignedTo === user.name
    );
    
    const todaysFollowUps = bdaLeads.filter(l => {
       if(!l.nextFollowUp) return false;
       const today = new Date().toISOString().split('T')[0];
       return l.nextFollowUp <= today && l.status !== LeadStatus.CLOSED_WON && l.status !== LeadStatus.CLOSED_LOST;
    }).length;

    const bdaClosedValue = bdaLeads
      .filter(l => l.status === LeadStatus.CLOSED_WON)
      .reduce((sum, lead) => sum + lead.value, 0);
    
    const commissionRate = user.commissionRate || 8;
    const estimatedCommission = (bdaClosedValue * commissionRate) / 100;

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
         <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-brand-600 mb-1 uppercase tracking-wider">Sales Dashboard</div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome back, {user.name.split(' ')[0]} 👋</h1>
            <p className="text-slate-500 mt-2 max-w-2xl">
              You have <strong className="text-slate-900">{todaysFollowUps} follow-ups</strong> pending today. 
            </p>
          </div>
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-4">
             <div className="p-3 bg-white/10 rounded-lg"><IndianRupee size={24} /></div>
             <div>
               <div className="text-xs text-slate-300 font-medium uppercase tracking-wider">My Commission</div>
               <div className="text-2xl font-bold">{formatRupee(estimatedCommission)}</div>
             </div>
          </div>
        </div>

        {todaysFollowUps > 0 && (
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-full text-red-600"><AlertCircle size={20} /></div>
              <div><h4 className="font-bold text-red-900">{todaysFollowUps} Overdue Follow-ups</h4></div>
            </div>
            <Link to="/leads" className="px-4 py-2 bg-white text-red-700 text-sm font-bold rounded-lg border border-red-200">View Leads</Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <DashboardCard title="My Active Leads" value={bdaLeads.length.toString()} change="Pipeline" positive={true} icon={<Users className="text-blue-500"/>} />
           <DashboardCard title="Pipeline Value" value={formatRupee(bdaLeads.reduce((acc, curr) => acc + curr.value, 0))} change="Potential" positive={true} icon={<IndianRupee className="text-green-500"/>} />
           <DashboardCard title="Conversion Rate" value="15%" change="Avg" positive={true} icon={<Target className="text-purple-500"/>} />
        </div>

        {/* Role Card for BDA */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
             
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
               <Briefcase size={24} className="text-brand-400" />
               Daily Focus
             </h3>
             
             <div className="space-y-8 relative z-10">
               <div>
                 <h4 className="text-xs font-bold text-brand-300 uppercase tracking-widest mb-3">Core Responsibilities</h4>
                 <ul className="space-y-3">
                   <li className="flex items-start gap-3">
                     <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                       <CheckSquare size={12} className="text-green-400" />
                     </div>
                     <span className="text-sm text-slate-300 leading-relaxed">Prospect 20 new HMS/Food App clients daily.</span>
                   </li>
                   <li className="flex items-start gap-3">
                     <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                       <CheckSquare size={12} className="text-green-400" />
                     </div>
                     <span className="text-sm text-slate-300 leading-relaxed">Follow up with <span className="text-white font-semibold">3 warm leads</span> before noon.</span>
                   </li>
                 </ul>
               </div>
             </div>
           </div>
      </div>
    );
  };

  const renderExecutiveDashboard = () => {
     return (
        <div className="space-y-8 animate-in fade-in">
           <div>
              <div className="text-sm font-semibold text-indigo-600 mb-1 uppercase tracking-wider">Executive Overview</div>
              <h1 className="text-3xl font-bold text-slate-900">Agency Performance</h1>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl text-white shadow-xl">
                 <div className="text-indigo-200 text-sm font-medium mb-1">Total Revenue</div>
                 <div className="text-3xl font-bold">{formatRupee(6850000)}</div>
                 <div className="mt-4 text-sm flex items-center gap-2 text-indigo-100 bg-white/10 w-fit px-2 py-1 rounded-lg">
                    <TrendingUp size={14} /> +12.5% vs last month
                 </div>
              </div>
              <DashboardCard title="Net Profit" value={formatRupee(2450000)} change="+8.2%" positive={true} icon={<IndianRupee className="text-green-500"/>} />
              <DashboardCard title="Total Clients" value="18" change="+2 new" positive={true} icon={<Briefcase className="text-orange-500"/>} />
              <DashboardCard title="Team Size" value="14" change="All Active" positive={true} icon={<Users className="text-blue-500"/>} />
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                 <h3 className="font-bold text-slate-900 mb-6">Revenue vs Expenses</h3>
                 <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={data}>
                          <defs>
                             <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/><stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/></linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} />
                          <YAxis axisLine={false} tickLine={false} />
                          <Tooltip />
                          <Area type="monotone" dataKey="revenue" stroke="#4f46e5" fillOpacity={1} fill="url(#colorRev)" />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                 <h3 className="font-bold text-slate-900 mb-6">Revenue Distribution</h3>
                 <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie data={[{name: 'HMS', value: 400}, {name: 'Apps', value: 300}, {name: 'Marketing', value: 300}, {name: 'Retainer', value: 200}]} innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                             {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                          </Pie>
                          <Tooltip />
                       </PieChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>
        </div>
     )
  };

  const renderTechDashboard = () => {
      return (
         <div className="space-y-8 animate-in fade-in">
            <div>
               <div className="text-sm font-semibold text-purple-600 mb-1 uppercase tracking-wider">Technology & Delivery</div>
               <h1 className="text-3xl font-bold text-slate-900">System Health</h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <DashboardCard title="Active Projects" value="4" change="On Track" positive={true} icon={<Code className="text-purple-500"/>} />
               <DashboardCard title="Open Issues" value="12" change="-3 this week" positive={true} icon={<AlertCircle className="text-red-500"/>} />
               <DashboardCard title="Avg Uptime" value="99.9%" change="Stable" positive={true} icon={<Activity className="text-green-500"/>} />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 font-semibold">Active Development Sprints</div>
               <div className="divide-y divide-slate-100">
                  {MOCK_PROJECTS.map(p => (
                     <div key={p.id} className="p-4 flex items-center justify-between">
                        <div>
                           <div className="font-bold text-slate-900">{p.title}</div>
                           <div className="text-xs text-slate-500">Client: {p.client}</div>
                        </div>
                        <div className="flex items-center gap-4">
                           <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-purple-600" style={{width: `${p.progress}%`}}></div>
                           </div>
                           <span className="text-sm font-bold text-slate-700">{p.progress}%</span>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      );
  };

  const renderFinanceDashboard = () => {
      return (
         <div className="space-y-8 animate-in fade-in">
            <div>
               <div className="text-sm font-semibold text-green-600 mb-1 uppercase tracking-wider">Financial Overview</div>
               <h1 className="text-3xl font-bold text-slate-900">Cash Flow</h1>
            </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <DashboardCard title="Collections (MoM)" value={formatRupee(1250000)} change="+15%" positive={true} icon={<IndianRupee className="text-green-500"/>} />
               <DashboardCard title="Outstanding" value={formatRupee(850000)} change="High Risk" positive={false} icon={<AlertCircle className="text-red-500"/>} />
               <DashboardCard title="Expenses" value={formatRupee(450000)} change="Stable" positive={true} icon={<TrendingUp className="text-slate-500"/>} />
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-bold text-slate-900 mb-4">Recent Invoices</h3>
                <table className="w-full text-sm text-left">
                   <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                      <tr>
                         <th className="px-4 py-3">Invoice ID</th>
                         <th className="px-4 py-3">Client</th>
                         <th className="px-4 py-3">Amount</th>
                         <th className="px-4 py-3">Status</th>
                      </tr>
                   </thead>
                   <tbody>
                      {MOCK_INVOICES.map(inv => (
                         <tr key={inv.id} className="border-b border-slate-50">
                            <td className="px-4 py-3 font-mono text-slate-600">{inv.id}</td>
                            <td className="px-4 py-3 font-bold">{inv.client}</td>
                            <td className="px-4 py-3">{formatRupee(inv.amount)}</td>
                            <td className="px-4 py-3">
                               <span className={`px-2 py-1 rounded text-xs font-bold ${inv.status === 'Paid' ? 'bg-green-100 text-green-700' : inv.status === 'Overdue' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{inv.status}</span>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
            </div>
         </div>
      );
  };

  const renderMarketingDashboard = () => {
      return (
         <div className="space-y-8 animate-in fade-in">
             <div>
               <div className="text-sm font-semibold text-orange-600 mb-1 uppercase tracking-wider">Marketing & Growth</div>
               <h1 className="text-3xl font-bold text-slate-900">Campaign ROI</h1>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <DashboardCard title="Total Leads" value="184" change="+22 this week" positive={true} icon={<Users className="text-orange-500"/>} />
               <DashboardCard title="Cost Per Lead" value="₹340" change="-5% (Good)" positive={true} icon={<Target className="text-blue-500"/>} />
               <DashboardCard title="Ad Spend" value={formatRupee(65000)} change="Within budget" positive={true} icon={<IndianRupee className="text-slate-500"/>} />
            </div>
         </div>
      );
  };

  return (
    <div>
      {/* Dev Tool to Toggle Views - Only show if user is NOT a BDA or Client */}
      {user.role !== UserRole.BDA && user.role !== UserRole.CLIENT && (
        <div className="mb-6 p-2 bg-slate-100 rounded-lg flex gap-2 overflow-x-auto">
           {[UserRole.FOUNDER, UserRole.CTO, UserRole.FINANCE_MANAGER, UserRole.MARKETING_MANAGER, UserRole.BDA].map(role => (
              <button 
                 key={role}
                 onClick={() => setCurrentViewRole(role)}
                 className={`px-3 py-1 text-xs font-bold rounded-md whitespace-nowrap transition-colors ${currentViewRole === role ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-200'}`}
              >
                 View as {role}
              </button>
           ))}
        </div>
      )}
      {renderContent()}
    </div>
  );
};

export default Dashboard;