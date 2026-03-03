import React, { useMemo, useState } from 'react';
import { Building2, Coffee, Megaphone, Plane, Plus, Save, Search, ShoppingCart, Trash2 } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { makeId, toTitleDate, useAppData } from '../context/AppDataContext';
import { Expense } from '../types';

const expenseIcons = {
  Software: ShoppingCart,
  Travel: Plane,
  Rent: Building2,
  Marketing: Megaphone,
  Meals: Coffee,
} as const;

const statuses: Array<Expense['status'] | 'All'> = ['All', 'Pending', 'Verified', 'Flagged'];

function getIcon(category: string) {
  const key = category as keyof typeof expenseIcons;
  return expenseIcons[key] ?? ShoppingCart;
}

export const ExpensesView: React.FC = () => {
  const { state, upsertExpense, deleteExpense, setExpenseStatus } = useAppData();
  const [statusFilter, setStatusFilter] = useState<(typeof statuses)[number]>('All');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(state.expenses[0]?.id ?? null);
  const [draft, setDraft] = useState<Expense | null>(null);

  const filtered = useMemo(
    () =>
      state.expenses.filter((expense) => {
        const byStatus = statusFilter === 'All' ? true : expense.status === statusFilter;
        const q = query.toLowerCase();
        const byQuery = !q || expense.vendor.toLowerCase().includes(q) || expense.category.toLowerCase().includes(q);
        return byStatus && byQuery;
      }),
    [query, state.expenses, statusFilter],
  );

  const selectedExpense = state.expenses.find((expense) => expense.id === selectedId) ?? null;

  const startCreate = () => {
    const newExpense: Expense = {
      id: `#EXP-${makeId('new').toUpperCase()}`,
      vendor: 'New Vendor',
      date: new Date().toISOString().slice(0, 10),
      category: 'Software',
      amount: 0,
      status: 'Pending',
      notes: '',
      paymentMethod: '',
      receiptName: '',
      updatedAt: new Date().toISOString(),
    };
    setDraft(newExpense);
  };

  const startEdit = () => {
    if (!selectedExpense) return;
    setDraft(selectedExpense);
  };

  const saveDraft = () => {
    if (!draft) return;
    upsertExpense(draft);
    setSelectedId(draft.id);
    setDraft(null);
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden">
      <main className="flex flex-1 overflow-hidden">
        <aside className="w-1/3 min-w-[380px] flex flex-col border-r border-slate-200 bg-white">
          <div className="p-6 border-b border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Recent Expenses</h1>
              <button onClick={startCreate} className="inline-flex items-center gap-1 text-sm font-bold text-primary hover:bg-primary/10 rounded px-2 py-1 transition-colors">
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <label className="relative block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search expenses..." className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-sm" />
            </label>
            <div className="flex gap-2 flex-wrap">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    'px-3 py-1 text-xs rounded-full',
                    statusFilter === status ? 'bg-primary/20 text-primary font-bold' : 'bg-slate-100 text-slate-500',
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-slate-100">
              {filtered.map((expense) => {
                const Icon = getIcon(expense.category);
                const isSelected = expense.id === selectedId;
                return (
                  <button
                    key={expense.id}
                    onClick={() => setSelectedId(expense.id)}
                    className={cn(
                      'w-full text-left p-4 flex items-center gap-4 cursor-pointer transition-colors',
                      isSelected ? 'bg-primary/5 border-l-4 border-primary' : 'hover:bg-slate-50',
                    )}
                  >
                    <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', isSelected ? 'bg-primary/20 text-primary' : 'bg-slate-100 text-slate-500')}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm">{expense.vendor}</h3>
                      <p className="text-xs text-slate-500">
                        {toTitleDate(expense.date)} • {expense.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{formatCurrency(expense.amount)}</p>
                      <span className={cn('text-[10px] uppercase font-bold', expense.status === 'Verified' ? 'text-primary' : expense.status === 'Pending' ? 'text-amber-500' : 'text-red-500')}>
                        {expense.status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <section className="flex-1 bg-background-light p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {draft ? (
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <h2 className="text-2xl font-black tracking-tight">{state.expenses.some((expense) => expense.id === draft.id) ? 'Edit Expense' : 'Add Expense'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input value={draft.vendor} onChange={(event) => setDraft({ ...draft, vendor: event.target.value })} className="border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Vendor" />
                  <input value={draft.date} type="date" onChange={(event) => setDraft({ ...draft, date: event.target.value })} className="border border-slate-200 rounded-lg px-3 py-2 text-sm" />
                  <input value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} className="border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Category" />
                  <input value={draft.amount} type="number" min={0} step="0.01" onChange={(event) => setDraft({ ...draft, amount: Number(event.target.value) || 0 })} className="border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Amount" />
                  <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as Expense['status'] })} className="border border-slate-200 rounded-lg px-3 py-2 text-sm">
                    <option value="Pending">Pending</option>
                    <option value="Verified">Verified</option>
                    <option value="Flagged">Flagged</option>
                  </select>
                  <input value={draft.paymentMethod ?? ''} onChange={(event) => setDraft({ ...draft, paymentMethod: event.target.value })} className="border border-slate-200 rounded-lg px-3 py-2 text-sm" placeholder="Payment method" />
                </div>
                <textarea value={draft.notes ?? ''} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm min-h-24" placeholder="Notes" />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setDraft(null)} className="px-4 py-2 rounded-lg border border-slate-200 text-sm btn-outline transition-colors">
                    Cancel
                  </button>
                  <button onClick={saveDraft} className="px-4 py-2 rounded-lg bg-primary text-slate-900 font-bold text-sm inline-flex items-center gap-1 btn-primary">
                    <Save className="w-4 h-4" /> Save Expense
                  </button>
                </div>
              </div>
            ) : selectedExpense ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight">Expense Details</h2>
                    <p className="text-slate-500 text-sm">Reference ID: {selectedExpense.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={startEdit} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white btn-dark transition-colors">
                      Edit Expense
                    </button>
                    <button
                      onClick={() => {
                        deleteExpense(selectedExpense.id);
                        setSelectedId(filtered[0]?.id ?? null);
                      }}
                      className="rounded-lg border border-red-200 text-red-600 px-4 py-2 text-sm font-bold inline-flex items-center gap-1 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3">
                  <p className="text-sm">
                    <b>Vendor:</b> {selectedExpense.vendor}
                  </p>
                  <p className="text-sm">
                    <b>Date:</b> {toTitleDate(selectedExpense.date)}
                  </p>
                  <p className="text-sm">
                    <b>Category:</b> {selectedExpense.category}
                  </p>
                  <p className="text-sm">
                    <b>Amount:</b> {formatCurrency(selectedExpense.amount)}
                  </p>
                  <p className="text-sm">
                    <b>Payment Method:</b> {selectedExpense.paymentMethod || '-'}
                  </p>
                  <p className="text-sm">
                    <b>Notes:</b> {selectedExpense.notes || '-'}
                  </p>
                  <div className="pt-2">
                    <label className="text-xs font-bold uppercase text-slate-400">Status</label>
                    <select
                      value={selectedExpense.status}
                      onChange={(event) => setExpenseStatus(selectedExpense.id, event.target.value as Expense['status'])}
                      className="mt-1 block border border-slate-200 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Verified">Verified</option>
                      <option value="Flagged">Flagged</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-slate-500">No expense selected.</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
