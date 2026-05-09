import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { TrendingUp, Users, Target, DollarSign } from 'lucide-react';

const data = [
  { name: 'Jan', leads: 45, customers: 20 },
  { name: 'Feb', leads: 52, customers: 25 },
  { name: 'Mar', leads: 48, customers: 22 },
  { name: 'Apr', leads: 61, customers: 30 },
  { name: 'May', leads: 55, customers: 28 },
];

const pieData = [
  { name: 'New Lead', value: 40 },
  { name: 'Qualified', value: 30 },
  { name: 'Negotiation', value: 20 },
  { name: 'Converted', value: 10 },
];

const COLORS = ['#4f46e5', '#312e81', '#1e1b4b', '#171717'];

export default function Analytics() {
  const { organization } = useAuth();

  return (
    <div className="space-y-10 max-w-[1400px] mx-auto min-h-screen pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Intelligence Dashboard</h1>
          <p className="text-sm text-neutral-500">Predictive insights and engagement metrics for {organization?.name}.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 rounded-full">
           <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
           <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Global Compute Ready</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-indigo-500/20 shadow-2xl bg-indigo-600/10 border backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-bold opacity-60 uppercase tracking-[0.2em] text-indigo-400 text-center">Efficiency Rating</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-4xl font-black text-white italic tracking-tighter">24.8%</div>
            <p className="text-[10px] mt-2 text-emerald-400 font-bold uppercase">↑ 2.4% Optimal</p>
          </CardContent>
        </Card>
        
        {[
          { label: 'Avg Deal Value', val: '$4.2k', sub: 'Baseline shift: +$200' },
          { label: 'Active Pipeline', val: '$1.2M', sub: '82% High probability' },
          { label: 'Churn Risk', val: '0.8%', sub: 'Critically Low' },
        ].map(m => (
          <Card key={m.label} className="rounded-2xl border-neutral-800 bg-[#0a0a0a] shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 text-center">{m.label}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-black text-white tracking-tighter">{m.val}</div>
              <p className="text-[10px] mt-2 text-neutral-600 font-bold uppercase tracking-wider">{m.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-6 mt-8">
        <Card className="lg:col-span-4 rounded-2xl shadow-2xl border-neutral-800 bg-[#0a0a0a] p-2">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              Temporal Volume Growth
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#171717" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#525252', fontWeight: 700 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#525252', fontWeight: 700 }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', borderRadius: '12px', border: '1px solid #262626', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)' }}
                  itemStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 800 }}
                  cursor={{ fill: '#171717' }}
                />
                <Bar dataKey="leads" fill="#4f46e5" radius={[2, 2, 0, 0]} barSize={24} />
                <Bar dataKey="customers" fill="#171717" stroke="#262626" radius={[2, 2, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 rounded-2xl shadow-2xl border-neutral-800 bg-[#0a0a0a] p-2">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-500" />
              Segmentation
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] flex flex-col items-center justify-center">
            <div className="w-full h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', borderRadius: '12px', border: '1px solid #262626' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-6 w-full px-4">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ color: COLORS[i], backgroundColor: COLORS[i] }} />
                    <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest transition-colors group-hover:text-white">{d.name}</span>
                  </div>
                  <span className="font-mono text-xs text-white text-bold">{d.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
