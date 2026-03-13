import React, { useMemo, useState } from 'react';
import { Filter, Pencil, Plus, Search, SortAsc, Trash2 } from 'lucide-react';
import { Client, ClientStatus } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { makeId, useAppData } from '../context/AppDataContext';

const statuses: Array<ClientStatus | 'All'> = ['All', 'Active', 'Pending', 'Inactive'];

function makeInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export const ClientsView: React.FC = () => {
  const { scopedClients, scopedInvoices, activeCompanyId, upsertClient, deleteClient } = useAppData();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<(typeof statuses)[number]>('All');
  const [sort, setSort] = useState<'name' | 'revenue'>('name');
  const [editing, setEditing] = useState<Client | null>(null);

  const clientRevenue = useMemo(() => {
    const map: Record<string, number> = {};
    scopedInvoices.forEach((invoice) => {
      map[invoice.clientEmail] = (map[invoice.clientEmail] ?? 0) + invoice.amount;
    });
    return map;
  }, [scopedInvoices]);

  const clients = useMemo(() => {
    const filtered = scopedClients.filter((client) => {
      const byStatus = statusFilter === 'All' ? true : client.status === statusFilter;
      const q = query.toLowerCase();
      const byQuery = !q || client.name.toLowerCase().includes(q) || client.email.toLowerCase().includes(q) || client.contact.toLowerCase().includes(q);
      return byStatus && byQuery;
    });

    if (sort === 'name') return filtered.sort((a, b) => a.name.localeCompare(b.name));
    return filtered.sort((a, b) => (clientRevenue[b.email] ?? 0) - (clientRevenue[a.email] ?? 0));
  }, [clientRevenue, query, sort, scopedClients, statusFilter]);

  const saveClient = () => {
    if (!editing) return;
    const initials = makeInitials(editing.name);
    upsertClient({ ...editing, initials, color: editing.color || 'bg-primary/10 text-primary' });
    setEditing(null);
  };

  return (
    <main className="flex flex-1 justify-center py-8">
      <div className="layout-content-container flex flex-col w-full max-w-[1200px] px-6 lg:px-10 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-slate-900 text-4xl font-black tracking-tight">Client Directory</h1>
            <p className="text-slate-500 text-base font-medium">Manage clients with editable records and revenue rollups.</p>
          </div>
          <button
            onClick={() =>
              setEditing({
                id: makeId('client'),
                name: '',
                contact: '',
                email: '',
                status: 'Pending',
                initials: 'NC',
                color: 'bg-primary/10 text-primary',
                updatedAt: new Date().toISOString(),
              })
            }
            disabled={!activeCompanyId}
            title={!activeCompanyId ? 'Select or create a company first' : undefined}
            className="flex items-center px-4 py-2 bg-primary rounded-lg text-sm font-bold btn-primary disabled:opacity-50 disabled:pointer-events-none"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Client
          </button>
        </div>

        <div className="flex gap-3 flex-wrap items-center">
          <label className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm" placeholder="Search clients..." />
          </label>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn('px-3 py-1 rounded-full text-xs', statusFilter === status ? 'bg-primary/20 text-primary font-bold' : 'bg-slate-100 text-slate-500')}
              >
                {status}
              </button>
            ))}
          </div>
          <button onClick={() => setSort((current) => (current === 'name' ? 'revenue' : 'name'))} className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm btn-outline transition-colors">
            <SortAsc className="w-4 h-4 mr-2" /> Sort: {sort === 'name' ? 'Name' : 'Revenue'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {clients.map((client) => (
            <div key={client.id} className="group flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="h-28 w-full bg-slate-100 flex items-center justify-center relative">
                <div className={cn('size-16 rounded-full flex items-center justify-center font-bold text-2xl border-2 border-white shadow-sm', client.color)}>{client.initials}</div>
                <span className={cn('absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase', client.status === 'Active' ? 'bg-primary/20 text-emerald-800' : client.status === 'Pending' ? 'bg-slate-200 text-slate-500' : 'bg-red-100 text-red-600')}>{client.status}</span>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <div>
                  <h3 className="text-slate-900 text-lg font-bold leading-tight">{client.name}</h3>
                  <p className="text-slate-500 text-sm font-medium mt-1">
                    {client.contact} • {client.email}
                  </p>
                </div>
                <div className="flex flex-col pt-3 border-t border-slate-100">
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Total Billed</p>
                  <p className="text-slate-900 text-xl font-black mt-0.5">{formatCurrency(clientRevenue[client.email] ?? 0)}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(client)} className="flex-1 text-xs border border-slate-200 rounded-lg py-2 font-semibold inline-flex items-center justify-center gap-1 hover:bg-slate-100 transition-colors">
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => deleteClient(client.id)} className="px-3 border border-red-200 text-red-600 rounded-lg inline-flex items-center justify-center hover:bg-red-50 transition-colors">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 w-full max-w-xl p-6 space-y-4">
            <h3 className="text-xl font-bold">{scopedClients.some((client) => client.id === editing.id) ? 'Edit Client' : 'Add Client'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} className="border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Company Name" />
              <input value={editing.contact} onChange={(event) => setEditing({ ...editing, contact: event.target.value })} className="border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Contact Name" />
              <input value={editing.email} onChange={(event) => setEditing({ ...editing, email: event.target.value })} className="border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Email" />
              <select value={editing.status} onChange={(event) => setEditing({ ...editing, status: event.target.value as ClientStatus })} className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg border border-slate-200 text-sm btn-outline transition-colors">
                Cancel
              </button>
              <button onClick={saveClient} className="px-4 py-2 rounded-lg bg-primary text-slate-900 font-bold text-sm btn-primary">
                Save Client
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
