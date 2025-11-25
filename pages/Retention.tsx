import React from 'react';
import { Heart, Clock, CheckCircle } from 'lucide-react';

const Retention: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Client Retention</h1>
        <p className="text-slate-500">Nurture existing clients, support tickets, and upselling.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold">
            <Clock size={20} className="text-pink-500" />
            <h3>Maintenance Tasks</h3>
          </div>
          <p className="text-sm text-slate-500 mb-4">Updates requested by clients post-delivery.</p>
          <div className="space-y-3">
             <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm">
               <div className="font-medium">TechStart India</div>
               <div className="text-slate-500 text-xs">Update homepage banner for Diwali</div>
             </div>
             <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm">
               <div className="font-medium">HealthPlus</div>
               <div className="text-slate-500 text-xs">Server security patch check</div>
             </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold">
            <Heart size={20} className="text-red-500" />
            <h3>Relationship Health</h3>
          </div>
          <div className="space-y-4">
             <div className="flex items-center justify-between">
               <span className="text-sm">Design Studio</span>
               <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Healthy</span>
             </div>
             <div className="flex items-center justify-between">
               <span className="text-sm">Logistics Express</span>
               <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">Needs Attention</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Retention;