import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, change, positive, icon }) => {
  return (
    <div className="p-6 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        {icon && <div className="text-brand-500">{icon}</div>}
      </div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        <div className={`flex items-center text-sm font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}>
          {positive ? <ArrowUpRight size={16} className="mr-1" /> : <ArrowDownRight size={16} className="mr-1" />}
          {change}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;