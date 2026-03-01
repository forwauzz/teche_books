import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, TrendingDown, Send, ShoppingCart, CreditCard, FileText } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';

const data = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 9800 },
  { name: 'Apr', revenue: 2780, expenses: 3908 },
  { name: 'May', revenue: 1890, expenses: 4800 },
  { name: 'Jun', revenue: 2390, expenses: 3800 },
];

const pieData = [
  { name: 'HVAC Services', value: 45, color: '#13ec49' },
  { name: 'Plumbing', value: 25, color: '#64748b' },
  { name: 'Electrical', value: 20, color: '#13ec4966' },
];

export const DashboardView: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      {/* KPI Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Revenue" value="CA$128,430.00" trend="+12.5%" trendUp={true} />
        <StatCard title="Outstanding Invoices" value="CA$12,250.00" trend="-5.2%" trendUp={false} />
        <StatCard title="Monthly Expenses" value="CA$45,210.00" trend="+2.1%" trendUp={false} />
      </section>

      {/* Charts and Feed Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Expenses Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg">Revenue vs Expenses</h3>
              <p className="text-xs text-slate-500">Overview of the last 6 months</p>
            </div>
            <select className="text-xs border-slate-200 bg-transparent rounded-lg focus:ring-primary">
              <option>Last 6 Months</option>
              <option>Last 12 Months</option>
            </select>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#13ec49" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#13ec49" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#13ec49" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Line type="monotone" dataKey="expenses" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-lg mb-6">Recent Activity</h3>
          <div className="space-y-6 flex-1">
            <ActivityItem 
              icon={<Send className="w-5 h-5" />} 
              title="Invoice Sent" 
              subtitle="To Acme Corp • #INV-2024-001" 
              amount="CA$2,450.00" 
              time="2h ago" 
              iconBg="bg-primary/20 text-primary"
            />
            <ActivityItem 
              icon={<ShoppingCart className="w-5 h-5" />} 
              title="Expense Logged" 
              subtitle="Supplies • Home Depot" 
              amount="CA$420.00" 
              time="5h ago" 
              iconBg="bg-slate-100 text-slate-500"
            />
            <ActivityItem 
              icon={<CreditCard className="w-5 h-5" />} 
              title="Payment Received" 
              subtitle="From Global Tech Ltd" 
              amount="CA$1,800.00" 
              time="Yesterday" 
              iconBg="bg-primary/20 text-primary"
            />
            <ActivityItem 
              icon={<FileText className="w-5 h-5" />} 
              title="New Contract" 
              subtitle="Signed by Johnson Inc" 
              amount="--" 
              time="1d ago" 
              iconBg="bg-slate-100 text-slate-500"
            />
          </div>
          <button className="mt-6 w-full text-center text-xs font-bold text-primary hover:underline">View All Activity</button>
        </div>
      </div>

      {/* Secondary Charts / Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Revenue by Service Doughnut Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-6">Revenue by Service</h3>
          <div className="flex items-center justify-center py-4 relative">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold">CA$128k</span>
              <span className="text-[10px] text-slate-500 uppercase font-bold">Total</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                  <span>{item.name}</span>
                </div>
                <span className="font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Client Summary Card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-6">Top Clients</h3>
          <div className="space-y-5">
            <ClientItem initials="AC" name="Acme Corporation" projects={12} amount="CA$42,300" />
            <ClientItem initials="GT" name="Global Tech" projects={8} amount="CA$38,150" />
            <ClientItem initials="JI" name="Johnson Inc" projects={5} amount="CA$12,400" />
          </div>
          <button className="mt-6 w-full py-2 bg-slate-100 text-xs font-bold rounded-lg hover:bg-slate-200 transition-colors">Manage All Clients</button>
        </div>

        {/* Upcoming Expenses / Reminder */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-6">Upcoming Payments</h3>
          <div className="p-4 rounded-lg bg-red-50 border border-red-100 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-red-600 uppercase">Overdue</span>
              <span className="text-xs font-bold text-red-600">CA$1,200</span>
            </div>
            <p className="text-sm font-semibold">Office Rent - Q1</p>
            <p className="text-xs text-slate-500">Due 3 days ago</p>
          </div>
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-amber-600 uppercase">Due Soon</span>
              <span className="text-xs font-bold text-amber-600">CA$850</span>
            </div>
            <p className="text-sm font-semibold">Cloud Services</p>
            <p className="text-xs text-slate-500">Due in 5 days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, trend, trendUp }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <p className="text-sm text-slate-500 font-medium">{title}</p>
    <div className="mt-2 flex items-baseline gap-2">
      <span className="text-2xl font-bold">{value}</span>
      <span className={cn("text-xs font-bold flex items-center", trendUp ? "text-primary" : "text-red-500")}>
        {trendUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
        {trend}
      </span>
    </div>
  </div>
);

const ActivityItem = ({ icon, title, subtitle, amount, time, iconBg }: any) => (
  <div className="flex gap-4">
    <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0", iconBg)}>
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
    <div className="text-right">
      <p className="text-sm font-bold">{amount}</p>
      <p className="text-[10px] text-slate-400">{time}</p>
    </div>
  </div>
);

const ClientItem = ({ initials, name, projects, amount }: any) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">{initials}</div>
    <div className="flex-1">
      <p className="text-sm font-semibold">{name}</p>
      <p className="text-xs text-slate-500">{projects} Projects</p>
    </div>
    <p className="text-sm font-bold">{amount}</p>
  </div>
);
