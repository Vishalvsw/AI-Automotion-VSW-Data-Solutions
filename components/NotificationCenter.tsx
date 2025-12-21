
import React from 'react';
import { Bell, X, Check, Trash2, AlertCircle, Clock, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Notification } from '../types';

interface NotificationCenterProps {
  onClose: () => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ onClose }) => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="absolute top-16 right-0 w-[380px] bg-white rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden animate-in slide-in-from-top-4 fade-in duration-300 z-[300]">
      <div className="p-6 bg-slate-900 text-white flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 blur-[60px] rounded-full"></div>
        <div className="relative z-10">
          <h3 className="text-sm font-black uppercase tracking-widest">Notification Hub</h3>
          <p className="text-[10px] font-bold text-slate-400 mt-0.5">{unreadCount} UNREAD ALERTS</p>
        </div>
        <div className="flex items-center gap-2 relative z-10">
          <button 
            onClick={clearAllNotifications}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
            title="Clear All"
          >
            <Trash2 size={16} />
          </button>
          <button 
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-slate-50/50">
        {notifications.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className={`p-5 transition-all relative group ${n.read ? 'opacity-60' : 'bg-white shadow-sm'}`}
              >
                {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-600"></div>}
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                    n.type === 'overdue' ? 'bg-red-50 text-red-600 border-red-100' :
                    n.type === 'approaching' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    'bg-slate-50 text-slate-600 border-slate-100'
                  }`}>
                    {n.type === 'overdue' ? <AlertCircle size={20} /> : <Clock size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight truncate pr-2">{n.title}</h4>
                      <span className="text-[8px] font-black text-slate-400 uppercase whitespace-nowrap">
                        {new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-500 leading-relaxed mb-3">{n.message}</p>
                    
                    {!n.read && (
                      <button 
                        onClick={() => markNotificationAsRead(n.id)}
                        className="flex items-center gap-1.5 text-[9px] font-black text-brand-600 uppercase tracking-widest hover:text-brand-800 transition-colors"
                      >
                        <Check size={12} /> Acknowledge Alert
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center opacity-40">
            <Zap size={40} className="mb-3 text-slate-300" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational silence.</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-white text-center">
        <button 
          onClick={onClose}
          className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
        >
          Close Command Center
        </button>
      </div>
    </div>
  );
};

export default NotificationCenter;
