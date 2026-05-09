import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, Users, Target, CheckSquare, TrendingUp, ArrowUpRight, ArrowDownRight, Clock } from 'lucide-react';

const stats = [
  { name: 'Active Leads', value: '142', change: '↑ 12%', icon: Target, color: 'text-indigo-400', sub: 'from last week' },
  { name: 'Conversion Rate', value: '24.8%', change: 'Target: 30%', icon: TrendingUp, color: 'text-emerald-400', sub: 'optimized' },
  { name: 'Task Completion', value: '92%', change: '8 pending', icon: CheckSquare, color: 'text-amber-400', sub: 'today' },
  { name: 'Avg Response', value: '4.2h', change: '↓ 0.8h', icon: Clock, color: 'text-blue-400', sub: 'yesterday' },
];

export default function Dashboard() {
  const { profile, organization } = useAuth();

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Operational Overview</h1>
          <p className="text-sm text-neutral-500">Real-time activity across {organization?.name}'s pipeline.</p>
        </div>
        <button className="hidden sm:block px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold shadow-lg shadow-indigo-600/20 transition-all active:scale-95">
          + New Lead Assignment
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="p-6 bg-[#0e0e0e] border border-neutral-800 rounded-2xl transition-all hover:border-neutral-700 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`text-xs text-neutral-500 uppercase tracking-widest font-bold`}>{stat.name}</div>
              <div className={`p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-black text-white tracking-tighter">{stat.value}</h3>
              <div className="mt-2 flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase tracking-tight ${stat.color}`}>
                  {stat.change}
                </span>
                <span className="text-[10px] text-neutral-600 font-medium">{stat.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-8">
           <div className="flex justify-between items-center mb-10">
            <h3 className="text-sm font-bold text-neutral-300 flex items-center gap-2 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              Lead Management Workflow
            </h3>
            <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">Real-time signalR stream</span>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
             {['New Lead', 'Contacted', 'Qualified', 'Negotiation'].map((stage, idx) => (
                <div key={stage} className="bg-neutral-900/30 border border-neutral-800/50 rounded-xl p-5 hover:bg-neutral-900/50 transition-colors">
                  <div className="text-[10px] text-neutral-500 font-bold uppercase mb-3 tracking-widest">{stage}</div>
                  <div className="text-3xl font-black text-white leading-none">{(idx + 1) * 7}</div>
                  <div className="mt-5 w-full bg-neutral-800/50 h-1 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full" style={{ width: `${80 - (idx * 15)}%` }}></div>
                  </div>
                </div>
             ))}
          </div>
        </div>

        <div className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl p-8 flex flex-col">
          <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-8">Recent Audit Trail</h4>
          <div className="space-y-6 flex-1">
            {[
              { type: 'blue', text: 'j.wilson updated lead status #LD-9023 to Qualified', time: '2m' },
              { type: 'emerald', text: 'Aurora Tech Solutions successfully onboarded', time: '14m' },
              { type: 'amber', text: 'm.thorne modified role permissions for Support', time: '1h' },
              { type: 'blue', text: 'Daily task report generated automatically', time: '3h' },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4 items-start border-b border-neutral-900/50 pb-5 last:border-0 last:pb-0">
                <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                  activity.type === 'blue' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' :
                  activity.type === 'emerald' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' :
                  'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                }`} />
                <div className="flex-1">
                  <p className="text-xs font-medium text-neutral-300 leading-normal">
                    {activity.text}
                  </p>
                  <p className="text-[10px] text-neutral-600 mt-1 font-bold uppercase tracking-wider">{activity.time} ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
