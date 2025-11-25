
import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, AreaChart, Area } from 'recharts';
import { Link } from 'react-router-dom';
import DashboardCard from '../components/DashboardCard';
import { DASHBOARD_STATS, MOCK_LEADS, MOCK_USERS } from '../services/mockData';
import { IndianRupee, Users, CheckSquare, AlertCircle, Phone, Code, Truck, Heart, Megaphone, Target, Briefcase, UserCheck, FileText, ArrowRight, Rocket } from 'lucide-react';
import { UserRole, LeadStatus } from '../types';

const data = [
  { name: 'Jan', revenue: 320000, leads: 24, activity: 120 },
  { name: 'Feb', revenue: 240000, leads: 13, activity: 90 },
  { name: 'Mar', revenue: 160000, leads: 38, activity: 150 },
  { name: 'Apr', revenue: 220000, leads: 39, activity: 180 },
  { name: 'May', revenue: 150000, leads: 48, activity: 200 },
  { name: 'Jun', revenue: 190000, leads: 38, activity: 170 },
  { name: 'Jul', revenue: 280000, leads: 43, activity: 220 },
];

const Dashboard: React.FC = () => {
  const [currentUser, setCurrentUser] = useState(MOCK_USERS.find(u => u.role === UserRole.BDA) || MOCK_USERS[0]);

  useEffect(() => {
     // Mock effect
  }, []);

  const icons = [
    <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><IndianRupee size={20} /></div>,
    <div className="bg-purple-50 p-2 rounded-lg text-purple-600"><Users size={20} /></div>,
    <div className="bg-orange-50 p-2 rounded-lg text-orange-600"><CheckSquare size={20} /></div>,
    <div className="bg-red-50 p-2 rounded-lg text-red-600"><AlertCircle size={20} /></div>
  ];

  const formatRupee = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const processes = [
    { title: 'Acquisition', icon: Phone, color: 'bg-blue-100 text-blue-600', link: '/leads', desc: 'Cold calls, outreach, onboarding' },
    { title: 'Production', icon: Code, color: 'bg-purple-100 text-purple-600', link: '/projects', desc: 'Requirements & Development' },
    { title: 'Delivery', icon: Truck, color: 'bg-green-100 text-green-600', link: '/projects', desc: 'Deploy & Handover' },
    { title: 'Retention', icon: Heart, color: 'bg-pink-100 text-pink-600', link: '/retention', desc: 'Nurturing & Support' },
    { title: 'Marketing', icon: Megaphone, color: 'bg-orange-100 text-orange-600', link: '/marketing', desc: 'Campaigns & Ads' },
  ];

  // --- BDA SPECIFIC LOGIC ---
  const isBDA = currentUser.role === UserRole.BDA;
  
  const bdaLeads = MOCK_LEADS.filter(l => l.assignedTo.includes('Sneha'));
  const bdaClosedValue = bdaLeads
    .filter(l => l.status === LeadStatus.CLOSED_WON)
    .reduce((sum, lead) => sum + lead.value, 0);
  
  const commissionRate = currentUser.commissionRate || 8;
  const estimatedCommission = (bdaClosedValue * commissionRate) / 100;
  
  const todaysFollowUps = bdaLeads.filter(l => {
     if(!l.nextFollowUp) return false;
     const today = new Date().toISOString().split('T')[0];
     return l.nextFollowUp <= today && l.status !== LeadStatus.CLOSED_WON && l.status !== LeadStatus.CLOSED_LOST;
  }).length;

  if (isBDA) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-brand-600 mb-1 uppercase tracking-wider">Business Development Dashboard</div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome back, {currentUser.name.split(' ')[0]} 👋</h1>
            <p className="text-slate-500 mt-2 max-w-2xl">
              You have <strong className="text-slate-900">{todaysFollowUps} follow-ups</strong> pending today. 
              Your current pipeline value is <strong className="text-slate-900">{formatRupee(bdaLeads.reduce((acc, curr) => acc + curr.value, 0))}</strong>.
            </p>
          </div>
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-4">
             <div className="p-3 bg-white/10 rounded-lg">
               <IndianRupee size={24} />
             </div>
             <div>
               <div className="text-xs text-slate-300 font-medium uppercase tracking-wider">Total Commission</div>
               <div className="text-2xl font-bold">{formatRupee(estimatedCommission)}</div>
             </div>
          </div>
        </div>

        {todaysFollowUps > 0 && (
          <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-full text-red-600"><AlertCircle size={20} /></div>
              <div>
                <h4 className="font-bold text-red-900">Action Required: {todaysFollowUps} Overdue Follow-ups</h4>
                <p className="text-sm text-red-700">Clear these tasks to keep your pipeline healthy.</p>
              </div>
            </div>
            <Link to="/leads" className="px-4 py-2 bg-white text-red-700 text-sm font-bold rounded-lg border border-red-200 hover:bg-red-50 transition-colors shadow-sm">
              View Leads
            </Link>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <DashboardCard 
             title="Active Leads" 
             value={bdaLeads.length.toString()} 
             change="Keep pushing!" 
             positive={true} 
             icon={<div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Users size={20}/></div>} 
           />
           <DashboardCard 
             title="Calls Made (Month)" 
             value="142" 
             change="+12% vs last month" 
             positive={true} 
             icon={<div className="bg-green-50 p-2 rounded-lg text-green-600"><Phone size={20}/></div>} 
           />
           <DashboardCard 
             title="Conversion Rate" 
             value="18.5%" 
             change="+2.1% improvement" 
             positive={true} 
             icon={<div className="bg-purple-50 p-2 rounded-lg text-purple-600"><Target size={20}/></div>} 
           />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Left Column: Quick Actions & Pipeline */}
           <div className="lg:col-span-2 space-y-8">
             {/* Quick Actions */}
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
               <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link to="/leads" className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-100 text-slate-700 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all group">
                     <Phone size={24} className="mb-3 text-slate-400 group-hover:text-blue-600" />
                     <span className="font-semibold text-sm">Cold Call Mode</span>
                  </Link>
                  <Link to="/leads" className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-100 text-slate-700 rounded-xl hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-all group">
                     <Megaphone size={24} className="mb-3 text-slate-400 group-hover:text-green-600" />
                     <span className="font-semibold text-sm">WhatsApp Blast</span>
                  </Link>
                  <button className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-100 text-slate-700 rounded-xl hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-all group">
                     <FileText size={24} className="mb-3 text-slate-400 group-hover:text-purple-600" />
                     <span className="font-semibold text-sm">Draft Proposal</span>
                  </button>
                  <Link to="/onboarding" className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-100 text-slate-700 rounded-xl hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition-all group">
                     <Rocket size={24} className="mb-3 text-slate-400 group-hover:text-orange-600" />
                     <span className="font-semibold text-sm">Onboard Client</span>
                  </Link>
               </div>
             </div>

             {/* Activity Chart */}
             <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-900">Activity Volume</h3>
                  <select className="text-sm bg-slate-50 border-none rounded-lg py-1 px-3 text-slate-600">
                    <option>Last 6 Months</option>
                  </select>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                      <defs>
                        <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                      />
                      <Area type="monotone" dataKey="activity" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorActivity)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
             </div>
           </div>

           {/* Right Column: Role Card */}
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
                   <li className="flex items-start gap-3">
                     <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                       <CheckSquare size={12} className="text-green-400" />
                     </div>
                     <span className="text-sm text-slate-300 leading-relaxed">Log all WhatsApp conversations in CRM.</span>
                   </li>
                 </ul>
               </div>

               <div>
                 <h4 className="text-xs font-bold text-brand-300 uppercase tracking-widest mb-3">Targets</h4>
                 <div className="space-y-4">
                   <div>
                     <div className="flex justify-between text-xs text-slate-300 mb-1">
                       <span>Weekly Meetings</span>
                       <span>8 / 12</span>
                     </div>
                     <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                       <div className="bg-green-400 h-1.5 rounded-full" style={{width: '66%'}}></div>
                     </div>
                   </div>
                   <div>
                     <div className="flex justify-between text-xs text-slate-300 mb-1">
                       <span>Monthly Closures</span>
                       <span>1 / 3</span>
                     </div>
                     <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                       <div className="bg-brand-400 h-1.5 rounded-full" style={{width: '33%'}}></div>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
        </div>
      </div>
    );
  }

  // --- ADMIN / MANAGER DASHBOARD ---
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Agency Control Center</h1>
        <p className="text-slate-500 mt-2">Real-time overview of your agency's performance.</p>
      </div>

      {/* Process Hub */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {processes.map((proc, idx) => (
          <Link to={proc.link} key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group text-center cursor-pointer">
            <div className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-4 ${proc.color} group-hover:scale-110 transition-transform shadow-inner`}>
              <proc.icon size={26} />
            </div>
            <h3 className="font-bold text-slate-800 text-sm mb-1">{proc.title}</h3>
            <p className="text-[11px] text-slate-400 leading-tight">{proc.desc}</p>
          </Link>
        ))}
      </div>

      {/* Key Metrics */}
      <div>
         <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            Overview
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-xs font-normal">Last 30 Days</span>
         </h2>
         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {DASHBOARD_STATS.map((stat, index) => (
            <DashboardCard 
                key={index} 
                {...stat} 
                icon={icons[index]} 
            />
            ))}
         </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
             <div>
                <h3 className="text-lg font-bold text-slate-800">Revenue Growth</h3>
                <p className="text-sm text-slate-400">Monthly breakdown</p>
             </div>
             <button className="text-sm text-brand-600 font-medium hover:bg-brand-50 px-3 py-1 rounded-lg transition-colors">View Report</button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}} 
                  tickFormatter={(value) => `₹${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [formatRupee(value), 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#2563eb" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Chart */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center mb-6">
             <div>
                <h3 className="text-lg font-bold text-slate-800">Lead Acquisition</h3>
                <p className="text-sm text-slate-400">New opportunities over time</p>
             </div>
             <button className="text-sm text-brand-600 font-medium hover:bg-brand-50 px-3 py-1 rounded-lg transition-colors">View CRM</button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                   cursor={{fill: '#f8fafc'}} 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                />
                <Bar dataKey="leads" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
