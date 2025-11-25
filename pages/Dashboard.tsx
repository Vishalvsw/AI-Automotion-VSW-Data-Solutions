import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, Legend } from 'recharts';
import DashboardCard from '../components/DashboardCard';
import { DASHBOARD_STATS } from '../services/mockData';
import { IndianRupee, Users, CheckSquare, AlertCircle } from 'lucide-react';

const data = [
  { name: 'Jan', revenue: 320000, leads: 24 },
  { name: 'Feb', revenue: 240000, leads: 13 },
  { name: 'Mar', revenue: 160000, leads: 38 },
  { name: 'Apr', revenue: 220000, leads: 39 },
  { name: 'May', revenue: 150000, leads: 48 },
  { name: 'Jun', revenue: 190000, leads: 38 },
  { name: 'Jul', revenue: 280000, leads: 43 },
];

const Dashboard: React.FC = () => {
  const icons = [
    <IndianRupee size={20} />,
    <Users size={20} />,
    <CheckSquare size={20} />,
    <AlertCircle size={20} />
  ];

  const formatRupee = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back, here is what's happening at your agency.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {DASHBOARD_STATS.map((stat, index) => (
          <DashboardCard 
            key={index} 
            {...stat} 
            icon={icons[index]} 
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="p-6 bg-white border border-slate-100 rounded-xl shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">Revenue Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b'}} 
                  tickFormatter={(value) => `₹${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [formatRupee(value), 'Revenue']}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#2563eb" 
                  strokeWidth={3} 
                  dot={{ fill: '#2563eb', strokeWidth: 2, r: 4, stroke: '#fff' }} 
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-100 rounded-xl shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">New Leads</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="leads" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;