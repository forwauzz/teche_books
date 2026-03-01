import React from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  SortAsc, 
  ChevronLeft, 
  ChevronRight,
  UserPlus,
  MoreVertical
} from 'lucide-react';
import { MOCK_CLIENTS } from '../types';
import { cn, formatCurrency } from '../lib/utils';

export const ClientsView: React.FC = () => {
  return (
    <main className="flex flex-1 justify-center py-8">
      <div className="layout-content-container flex flex-col w-full max-w-[1200px] px-6 lg:px-10">
        {/* Header Section */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-slate-900 text-4xl font-black tracking-tight">Client Directory</h1>
            <p className="text-slate-500 text-base font-medium">Manage and track your service business clients and billing history.</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </button>
            <button className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              <SortAsc className="w-4 h-4 mr-2" /> Sort
            </button>
          </div>
        </div>

        {/* Grid of Client Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_CLIENTS.map((client) => (
            <div key={client.id} className="group cursor-pointer flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all hover:border-primary/50">
              <div className="h-32 w-full bg-slate-100 flex items-center justify-center relative">
                <div className={cn("size-16 rounded-full flex items-center justify-center font-bold text-2xl border-2 border-white shadow-sm", client.color)}>
                  {client.initials}
                </div>
                <div className={cn(
                  "absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                  client.status === 'Active' ? "bg-primary/20 text-emerald-800" : 
                  client.status === 'Pending' ? "bg-slate-200 text-slate-500" : "bg-red-100 text-red-600"
                )}>
                  {client.status}
                </div>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <div>
                  <h3 className="text-slate-900 text-lg font-bold leading-tight group-hover:text-primary transition-colors">{client.name}</h3>
                  <p className="text-slate-500 text-sm font-medium mt-1">{client.contact} • {client.email}</p>
                </div>
                <div className="flex flex-col pt-3 border-t border-slate-100">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Total Billed</p>
                  <p className="text-slate-900 text-xl font-black mt-0.5">{formatCurrency(client.totalBilled)}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Placeholder */}
          <div className="group cursor-pointer flex flex-col bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 overflow-hidden hover:bg-white hover:border-primary transition-all items-center justify-center min-h-[320px]">
            <div className="size-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
              <Plus className="w-8 h-8" />
            </div>
            <p className="mt-4 text-slate-500 font-bold text-sm">Add New Client</p>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center mt-12 gap-2">
          <button className="flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="text-sm font-bold flex size-10 items-center justify-center text-slate-900 bg-primary rounded-lg">1</button>
          <button className="text-sm font-semibold flex size-10 items-center justify-center text-slate-600 rounded-lg hover:bg-slate-100">2</button>
          <button className="text-sm font-semibold flex size-10 items-center justify-center text-slate-600 rounded-lg hover:bg-slate-100">3</button>
          <div className="text-slate-400 px-2">...</div>
          <button className="text-sm font-semibold flex size-10 items-center justify-center text-slate-600 rounded-lg hover:bg-slate-100">12</button>
          <button className="flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  );
};
