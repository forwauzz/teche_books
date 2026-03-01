import React from 'react';
import { 
  Plus, 
  Search, 
  Download, 
  Filter, 
  Edit, 
  FileText, 
  Mail, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileEdit
} from 'lucide-react';
import { MOCK_INVOICES } from '../types';
import { cn, formatCurrency } from '../lib/utils';

export const InvoicesView: React.FC = () => {
  return (
    <div className="flex-1 max-w-[1400px] mx-auto w-full px-10 py-8">
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 text-3xl font-black leading-tight tracking-tight">Invoice Management</h1>
          <p className="text-slate-500 text-base font-normal">Track your business revenue and pending client payments.</p>
        </div>
        <button className="flex items-center gap-2 h-11 px-6 bg-primary text-slate-900 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
          <Plus className="w-5 h-5" />
          <span>Create New Invoice</span>
        </button>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          label="Total Outstanding" 
          value="CA$12,450.00" 
          trend="+12.5% vs last month" 
          trendUp={true} 
          icon={<Clock className="w-5 h-5" />} 
        />
        <StatCard 
          label="Paid This Month" 
          value="CA$45,200.00" 
          trend="-4.2% vs last month" 
          trendUp={false} 
          icon={<CheckCircle2 className="w-5 h-5" />} 
        />
        <StatCard 
          label="Overdue" 
          value="CA$3,100.00" 
          trend="8 invoices pending" 
          trendUp={null} 
          icon={<AlertCircle className="w-5 h-5 text-red-400" />} 
        />
        <StatCard 
          label="Drafts" 
          value="CA$1,200.00" 
          trend="4 unsent items" 
          trendUp={null} 
          icon={<FileEdit className="w-5 h-5" />} 
        />
      </div>

      {/* Filter and Table Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Header Filters */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 gap-4 flex-wrap">
          <div className="flex gap-2 overflow-x-auto">
            <button className="px-4 py-2 bg-primary/10 text-slate-900 border border-primary/20 rounded-lg text-sm font-bold whitespace-nowrap">All Invoices</button>
            <button className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm font-medium whitespace-nowrap transition-colors">Paid</button>
            <button className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm font-medium whitespace-nowrap transition-colors">Overdue</button>
            <button className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm font-medium whitespace-nowrap transition-colors">Sent</button>
            <button className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg text-sm font-medium whitespace-nowrap transition-colors">Draft</button>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Advanced Filters</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export All</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">Invoice ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">Client Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">Due Date</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 text-right">Amount</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {MOCK_INVOICES.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-900">{invoice.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900">{invoice.clientName}</span>
                      <span className="text-xs text-slate-500">{invoice.clientEmail}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{invoice.dueDate}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">{formatCurrency(invoice.amount)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={invoice.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-primary/20 hover:text-primary rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-primary/20 hover:text-primary rounded-lg transition-colors">
                        <FileText className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-primary/20 hover:text-primary rounded-lg transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-sm text-slate-500">Showing <span className="font-bold text-slate-900">1-5</span> of 48 invoices</span>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-slate-200 rounded hover:bg-slate-50 text-slate-500">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-primary text-slate-900 rounded font-bold text-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 text-slate-600 rounded text-sm">2</button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 text-slate-600 rounded text-sm">3</button>
            <span className="text-slate-400 px-1">...</span>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-slate-50 text-slate-600 rounded text-sm">10</button>
            <button className="p-2 border border-slate-200 rounded hover:bg-slate-50 text-slate-500">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, trend, trendUp, icon }: any) => (
  <div className="flex flex-col gap-2 rounded-xl bg-white p-6 border border-slate-200 shadow-sm">
    <div className="flex items-center justify-between mb-1">
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{label}</p>
      <div className="text-slate-400">{icon}</div>
    </div>
    <p className="text-slate-900 text-3xl font-black leading-tight">{value}</p>
    <div className={cn(
      "flex items-center gap-1.5 text-sm font-semibold",
      trendUp === true ? "text-primary" : trendUp === false ? "text-red-500" : "text-slate-500"
    )}>
      {trendUp === true && <TrendingUp className="w-3 h-3" />}
      {trendUp === false && <TrendingDown className="w-3 h-3" />}
      <span>{trend}</span>
    </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    Paid: "bg-green-100 text-green-700",
    Overdue: "bg-red-100 text-red-700",
    Sent: "bg-blue-100 text-blue-700",
    Draft: "bg-slate-100 text-slate-700",
  };
  const dotStyles: any = {
    Paid: "bg-green-500",
    Overdue: "bg-red-500",
    Sent: "bg-blue-500",
    Draft: "bg-slate-500",
  };

  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold", styles[status])}>
      <span className={cn("h-1 w-1 rounded-full mr-2", dotStyles[status])}></span>
      {status}
    </span>
  );
};
