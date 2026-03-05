import React, { useMemo, useState } from 'react';
import { CheckCircle2, Clock, FileEdit, FileDown, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { Invoice, InvoiceStatus } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { toTitleDate, useAppData } from '../context/AppDataContext';
import { InvoicePDFPreviewModal } from './InvoicePDFPreviewModal';
import type { InvoicePreviewPayload } from './InvoicePDFPreview';

interface InvoicesViewProps {
  onCreateInvoice: () => void;
}

const statuses: (InvoiceStatus | 'All')[] = ['All', 'Paid', 'Overdue', 'Sent', 'Draft'];

export const InvoicesView: React.FC<InvoicesViewProps> = ({ onCreateInvoice }) => {
  const { state, deleteInvoice, setInvoiceStatus, upsertInvoice } = useAppData();
  const [statusFilter, setStatusFilter] = useState<(typeof statuses)[number]>('All');
  const [query, setQuery] = useState('');
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [pdfPreviewInvoice, setPdfPreviewInvoice] = useState<InvoicePreviewPayload | null>(null);

  const filtered = useMemo(
    () =>
      state.invoices.filter((invoice) => {
        const byStatus = statusFilter === 'All' ? true : invoice.status === statusFilter;
        const q = query.toLowerCase();
        const byQuery =
          !q ||
          invoice.id.toLowerCase().includes(q) ||
          invoice.clientName.toLowerCase().includes(q) ||
          invoice.clientEmail.toLowerCase().includes(q);
        return byStatus && byQuery;
      }),
    [query, state.invoices, statusFilter],
  );

  const stats = useMemo(() => {
    const outstanding = state.invoices.filter((invoice) => invoice.status !== 'Paid').reduce((sum, invoice) => sum + invoice.amount, 0);
    const paid = state.invoices.filter((invoice) => invoice.status === 'Paid').reduce((sum, invoice) => sum + invoice.amount, 0);
    const overdue = state.invoices.filter((invoice) => invoice.status === 'Overdue').reduce((sum, invoice) => sum + invoice.amount, 0);
    const drafts = state.invoices.filter((invoice) => invoice.status === 'Draft').reduce((sum, invoice) => sum + invoice.amount, 0);
    return { outstanding, paid, overdue, drafts };
  }, [state.invoices]);

  const startEdit = (invoice: Invoice) => setEditingInvoice(invoice);
  const saveEdit = () => {
    if (!editingInvoice) return;
    upsertInvoice(editingInvoice);
    setEditingInvoice(null);
  };

  return (
    <div className="flex-1 max-w-[1400px] mx-auto w-full px-10 py-8 space-y-6">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 text-3xl font-black leading-tight tracking-tight">Invoice Management</h1>
          <p className="text-slate-500 text-base font-normal">Track, edit, and manage invoice lifecycle.</p>
        </div>
        <button onClick={onCreateInvoice} className="flex items-center gap-2 h-11 px-6 bg-primary text-slate-900 rounded-lg font-bold text-sm btn-primary">
          <Plus className="w-5 h-5" />
          <span>Create New Invoice</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Outstanding" value={formatCurrency(stats.outstanding)} trend={`${state.invoices.filter((i) => i.status !== 'Paid').length} unpaid`} icon={<Clock className="w-5 h-5" />} />
        <StatCard label="Paid Total" value={formatCurrency(stats.paid)} trend={`${state.invoices.filter((i) => i.status === 'Paid').length} paid`} icon={<CheckCircle2 className="w-5 h-5" />} />
        <StatCard label="Overdue" value={formatCurrency(stats.overdue)} trend={`${state.invoices.filter((i) => i.status === 'Overdue').length} overdue`} icon={<Clock className="w-5 h-5" />} />
        <StatCard label="Drafts" value={formatCurrency(stats.drafts)} trend={`${state.invoices.filter((i) => i.status === 'Draft').length} drafts`} icon={<FileEdit className="w-5 h-5" />} />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 gap-4 flex-wrap">
          <div className="flex gap-2 overflow-x-auto">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                  statusFilter === status ? 'bg-primary/10 text-slate-900 border border-primary/20 font-bold' : 'text-slate-500 hover:bg-slate-100',
                )}
              >
                {status}
              </button>
            ))}
          </div>
          <label className="relative w-full max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search invoices..."
              className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-sm"
            />
          </label>
        </div>

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
              {filtered.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-900">{invoice.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900">{invoice.clientName}</span>
                      <span className="text-xs text-slate-500">{invoice.clientEmail}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{toTitleDate(invoice.dueDate)}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900 text-right">{formatCurrency(invoice.amount)}</td>
                  <td className="px-6 py-4">
                    <select
                      value={invoice.status}
                      onChange={(event) => setInvoiceStatus(invoice.id, event.target.value as InvoiceStatus)}
                      className="text-xs border border-slate-200 rounded px-2 py-1"
                    >
                      {statuses
                        .filter((status) => status !== 'All')
                        .map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-1">
                      <button
                        onClick={() => setPdfPreviewInvoice(invoice)}
                        className="p-2 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition-colors"
                        title="Preview PDF"
                      >
                        <FileDown className="w-4 h-4" />
                      </button>
                      <button onClick={() => startEdit(invoice)} className="p-2 hover:bg-primary/20 hover:text-primary rounded-lg transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteInvoice(invoice.id)} className="p-2 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-500">
                    No invoices match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingInvoice && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50" role="presentation">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-invoice-title"
            className="bg-white rounded-xl border border-slate-200 shadow-xl w-full max-w-xl p-6 space-y-4"
          >
            <h3 id="edit-invoice-title" className="text-xl font-bold">Edit Invoice</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm" value={editingInvoice.clientName} onChange={(event) => setEditingInvoice({ ...editingInvoice, clientName: event.target.value })} placeholder="Client name" />
              <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm" value={editingInvoice.clientEmail} onChange={(event) => setEditingInvoice({ ...editingInvoice, clientEmail: event.target.value })} placeholder="Client email" />
              <input className="border border-slate-200 rounded-lg px-3 py-2 text-sm" type="date" value={editingInvoice.dueDate} onChange={(event) => setEditingInvoice({ ...editingInvoice, dueDate: event.target.value })} />
              <input
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm"
                type="number"
                min={0}
                step="0.01"
                value={editingInvoice.amount}
                onChange={(event) => setEditingInvoice({ ...editingInvoice, amount: Number(event.target.value) || 0 })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingInvoice(null)} className="px-4 py-2 rounded-lg border border-slate-200 text-sm btn-outline transition-colors">
                Cancel
              </button>
              <button onClick={saveEdit} className="px-4 py-2 rounded-lg bg-primary text-slate-900 font-bold text-sm btn-primary">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <InvoicePDFPreviewModal invoice={pdfPreviewInvoice} onClose={() => setPdfPreviewInvoice(null)} />
    </div>
  );
};

const StatCard = ({ label, value, trend, icon }: { label: string; value: string; trend: string; icon: React.ReactNode }) => (
  <div className="flex flex-col gap-2 rounded-xl bg-white p-6 border border-slate-200 shadow-sm">
    <div className="flex items-center justify-between mb-1">
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{label}</p>
      <div className="text-slate-400">{icon}</div>
    </div>
    <p className="text-slate-900 text-2xl font-black leading-tight">{value}</p>
    <div className="text-sm text-slate-500">{trend}</div>
  </div>
);
