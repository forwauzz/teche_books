import React, { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CreditCard, Send, ShoppingCart, TrendingDown, TrendingUp } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { useAppData } from '../context/AppDataContext';

const chartColors = ['#13ec49', '#64748b', '#0ea5e9', '#f59e0b'];

function monthBuckets() {
  const result: { key: string; label: string; revenue: number; expenses: number }[] = [];
  const now = new Date();
  for (let idx = 5; idx >= 0; idx -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - idx, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    result.push({
      key,
      label: date.toLocaleDateString('en-CA', { month: 'short' }),
      revenue: 0,
      expenses: 0,
    });
  }
  return result;
}

export const DashboardView: React.FC = () => {
  const { state } = useAppData();

  const stats = useMemo(() => {
    const totalRevenue = state.invoices.filter((invoice) => invoice.status === 'Paid').reduce((acc, invoice) => acc + invoice.amount, 0);
    const outstanding = state.invoices.filter((invoice) => invoice.status !== 'Paid').reduce((acc, invoice) => acc + invoice.amount, 0);
    const monthlyExpenses = state.expenses.reduce((acc, expense) => acc + expense.amount, 0);
    return { totalRevenue, outstanding, monthlyExpenses };
  }, [state.expenses, state.invoices]);

  const chartData = useMemo(() => {
    const buckets = monthBuckets();
    const indexed = new Map(buckets.map((entry) => [entry.key, entry]));

    state.invoices.forEach((invoice) => {
      const key = invoice.issuedDate?.slice(0, 7);
      const target = key ? indexed.get(key) : null;
      if (target) target.revenue += invoice.amount;
    });

    state.expenses.forEach((expense) => {
      const key = expense.date?.slice(0, 7);
      const target = key ? indexed.get(key) : null;
      if (target) target.expenses += expense.amount;
    });

    return buckets.map(({ key: _key, ...rest }) => rest);
  }, [state.expenses, state.invoices]);

  const revenueByClient = useMemo(() => {
    const groups: Record<string, number> = {};
    state.invoices.forEach((invoice) => {
      groups[invoice.clientName] = (groups[invoice.clientName] ?? 0) + invoice.amount;
    });
    return Object.entries(groups)
      .map(([name, value], index) => ({ name, value, color: chartColors[index % chartColors.length] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);
  }, [state.invoices]);

  const recentActivity = useMemo(() => {
    const invoices = state.invoices.map((invoice) => ({
      id: `invoice-${invoice.id}`,
      title: invoice.status === 'Paid' ? 'Payment Received' : 'Invoice Updated',
      subtitle: `${invoice.clientName} • ${invoice.id}`,
      amount: formatCurrency(invoice.amount),
      time: new Date(invoice.updatedAt).toLocaleDateString('en-CA'),
      icon: invoice.status === 'Paid' ? <CreditCard className="w-5 h-5" /> : <Send className="w-5 h-5" />,
      iconBg: 'bg-primary/20 text-primary',
    }));

    const expenses = state.expenses.map((expense) => ({
      id: `expense-${expense.id}`,
      title: 'Expense Logged',
      subtitle: `${expense.vendor} • ${expense.category}`,
      amount: formatCurrency(expense.amount),
      time: new Date(expense.updatedAt).toLocaleDateString('en-CA'),
      icon: <ShoppingCart className="w-5 h-5" />,
      iconBg: 'bg-slate-100 text-slate-500',
    }));

    return [...invoices, ...expenses]
      .sort((a, b) => (a.time < b.time ? 1 : -1))
      .slice(0, 5);
  }, [state.expenses, state.invoices]);

  const topClients = useMemo(
    () =>
      state.clients
        .map((client) => ({
          ...client,
          billed: state.invoices
            .filter((invoice) => invoice.clientEmail === client.email)
            .reduce((sum, invoice) => sum + invoice.amount, 0),
          projectCount: state.invoices.filter((invoice) => invoice.clientEmail === client.email).length,
        }))
        .sort((a, b) => b.billed - a.billed)
        .slice(0, 3),
    [state.clients, state.invoices],
  );

  return (
    <div className="p-8 space-y-8">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} trend="+Paid invoices" trendUp />
        <StatCard title="Outstanding Invoices" value={formatCurrency(stats.outstanding)} trend="Unpaid total" trendUp={false} />
        <StatCard title="Monthly Expenses" value={formatCurrency(stats.monthlyExpenses)} trend={`${state.expenses.length} expenses`} trendUp={false} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-lg">Revenue vs Expenses</h3>
              <p className="text-xs text-slate-500">Live data from invoices and expenses</p>
            </div>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#13ec49" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#13ec49" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis hide />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Area type="monotone" dataKey="revenue" stroke="#13ec49" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Line type="monotone" dataKey="expenses" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-lg mb-6">Recent Activity</h3>
          <div className="space-y-4 flex-1">
            {recentActivity.map((item) => (
              <ActivityItem key={item.id} icon={item.icon} title={item.title} subtitle={item.subtitle} amount={item.amount} time={item.time} iconBg={item.iconBg} />
            ))}
            {recentActivity.length === 0 && <p className="text-sm text-slate-500">No activity yet.</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-6">Revenue by Client</h3>
          <div className="flex items-center justify-center py-4 relative">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={revenueByClient} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {revenueByClient.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-bold">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-6">Top Clients</h3>
          <div className="space-y-5">
            {topClients.map((client) => (
              <ClientItem key={client.id} initials={client.initials} name={client.name} projects={client.projectCount} amount={formatCurrency(client.billed)} />
            ))}
            {topClients.length === 0 && <p className="text-sm text-slate-500">No clients yet.</p>}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-lg mb-6">Payment Snapshot</h3>
          <div className="p-4 rounded-lg bg-red-50 border border-red-100 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-red-600 uppercase">Overdue</span>
              <span className="text-xs font-bold text-red-600">
                {formatCurrency(state.invoices.filter((invoice) => invoice.status === 'Overdue').reduce((sum, invoice) => sum + invoice.amount, 0))}
              </span>
            </div>
            <p className="text-sm font-semibold">{state.invoices.filter((invoice) => invoice.status === 'Overdue').length} overdue invoices</p>
          </div>
          <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-amber-600 uppercase">Draft</span>
              <span className="text-xs font-bold text-amber-600">
                {formatCurrency(state.invoices.filter((invoice) => invoice.status === 'Draft').reduce((sum, invoice) => sum + invoice.amount, 0))}
              </span>
            </div>
            <p className="text-sm font-semibold">{state.invoices.filter((invoice) => invoice.status === 'Draft').length} draft invoices</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  trend,
  trendUp,
}: {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
}) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <p className="text-sm text-slate-500 font-medium">{title}</p>
    <div className="mt-2 flex items-baseline gap-2">
      <span className="text-2xl font-bold">{value}</span>
      <span className={cn('text-xs font-bold flex items-center', trendUp ? 'text-primary' : 'text-red-500')}>
        {trendUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
        {trend}
      </span>
    </div>
  </div>
);

const ActivityItem: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  amount: string;
  time: string;
  iconBg: string;
}> = ({
  icon,
  title,
  subtitle,
  amount,
  time,
  iconBg,
}) => (
  <div className="flex gap-4">
    <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center shrink-0', iconBg)}>{icon}</div>
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

const ClientItem: React.FC<{
  initials: string;
  name: string;
  projects: number;
  amount: string;
}> = ({
  initials,
  name,
  projects,
  amount,
}) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">{initials}</div>
    <div className="flex-1">
      <p className="text-sm font-semibold">{name}</p>
      <p className="text-xs text-slate-500">{projects} Projects</p>
    </div>
    <p className="text-sm font-bold">{amount}</p>
  </div>
);
