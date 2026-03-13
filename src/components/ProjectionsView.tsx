import React, { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Pencil, Trash2 } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { makeId, useAppData } from '../context/AppDataContext';
import type { Projection } from '../types';

const MONTH_LABELS: Record<string, string> = {
  '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun',
  '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec',
};

function monthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}

function getNextMonths(count: number): { key: string; label: string }[] {
  const out: { key: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const key = monthKey(d.getFullYear(), d.getMonth() + 1);
    const m = String(d.getMonth() + 1).padStart(2, '0');
    out.push({ key, label: `${MONTH_LABELS[m]} ${d.getFullYear()}` });
  }
  return out;
}

export const ProjectionsView: React.FC = () => {
  const { state, scopedProjections, scopedInvoices, scopedExpenses, activeCompanyId, upsertProjection, deleteProjection } = useAppData();
  const months = useMemo(() => getNextMonths(12), []);
  const [editingId, setEditingId] = useState<string | null>(null);

  const byMonth = useMemo(() => {
    const map = new Map<string, Projection>();
    scopedProjections.forEach((p) => map.set(p.month, p));
    return map;
  }, [scopedProjections]);

  const chartData = useMemo(() => {
    return months.map(({ key, label }) => {
      const p = byMonth.get(key);
      const projectedRevenue = p?.projectedRevenue ?? 0;
      const projectedExpenses = p?.projectedExpenses ?? 0;
      const actualRevenue = scopedInvoices
        .filter((inv) => inv.issuedDate?.startsWith(key) && inv.status === 'Paid')
        .reduce((s, inv) => s + inv.amount, 0);
      const actualExpenses = scopedExpenses
        .filter((e) => e.date?.startsWith(key))
        .reduce((s, e) => s + e.amount, 0);
      return {
        month: label,
        key,
        projectedRevenue,
        projectedExpenses,
        projectedNet: projectedRevenue - projectedExpenses,
        actualRevenue,
        actualExpenses,
        actualNet: actualRevenue - actualExpenses,
      };
    });
  }, [byMonth, months, scopedExpenses, scopedInvoices]);

  const addOrEdit = (monthKey: string, projectedRevenue: number, projectedExpenses: number, notes?: string) => {
    const existing = byMonth.get(monthKey);
    const id = existing?.id ?? makeId('proj');
    upsertProjection({
      id,
      month: monthKey,
      projectedRevenue,
      projectedExpenses,
      notes,
      companyId: state.company?.id,
      updatedAt: new Date().toISOString(),
    });
    setEditingId(null);
  };

  return (
    <div className="flex-1 max-w-[1400px] mx-auto w-full px-4 sm:px-6 md:px-10 py-6 md:py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight text-slate-900">Projections</h1>
        <p className="text-slate-500 text-sm mt-1">Plan revenue and expenses by month and compare to actuals.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-4 md:p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]" role="table" aria-label="Monthly projections">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">Month</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Projected Revenue</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Projected Expenses</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Projected Net</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actual Revenue</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actual Expenses</th>
                <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500 text-right w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {chartData.map((row) => {
                const proj = byMonth.get(row.key);
                const isEditing = editingId === row.key;
                return (
                  <tr key={row.key} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-slate-900">{row.month}</td>
                    {isEditing ? (
                      <>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            min={0}
                            step="0.01"
                            defaultValue={proj?.projectedRevenue ?? 0}
                            className="w-full max-w-[120px] ml-auto block text-right border border-slate-200 rounded px-2 py-1 text-sm"
                            aria-label={`Projected revenue for ${row.month}`}
                            id={`proj-rev-${row.key}`}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            min={0}
                            step="0.01"
                            defaultValue={proj?.projectedExpenses ?? 0}
                            className="w-full max-w-[120px] ml-auto block text-right border border-slate-200 rounded px-2 py-1 text-sm"
                            aria-label={`Projected expenses for ${row.month}`}
                            id={`proj-exp-${row.key}`}
                          />
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-medium">{formatCurrency(row.projectedNet)}</td>
                        <td className="px-4 py-3 text-right text-sm text-slate-600">{formatCurrency(row.actualRevenue)}</td>
                        <td className="px-4 py-3 text-right text-sm text-slate-600">{formatCurrency(row.actualExpenses)}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              disabled={!activeCompanyId}
                              onClick={() => {
                                const revEl = document.getElementById(`proj-rev-${row.key}`) as HTMLInputElement | null;
                                const expEl = document.getElementById(`proj-exp-${row.key}`) as HTMLInputElement | null;
                                const rev = revEl ? Number(revEl.value) || 0 : 0;
                                const exp = expEl ? Number(expEl.value) || 0 : 0;
                                addOrEdit(row.key, rev, exp);
                              }}
                              className="text-xs font-semibold text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded disabled:opacity-50 disabled:pointer-events-none"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="text-xs text-slate-500 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 text-right font-medium">{formatCurrency(row.projectedRevenue)}</td>
                        <td className="px-4 py-3 text-right font-medium">{formatCurrency(row.projectedExpenses)}</td>
                        <td className="px-4 py-3 text-right font-medium">{formatCurrency(row.projectedNet)}</td>
                        <td className="px-4 py-3 text-right text-slate-600">{formatCurrency(row.actualRevenue)}</td>
                        <td className="px-4 py-3 text-right text-slate-600">{formatCurrency(row.actualExpenses)}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              disabled={!activeCompanyId}
                              onClick={() => setEditingId(row.key)}
                              className="p-1.5 rounded-lg hover:bg-primary/20 text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none"
                              aria-label={`Edit projections for ${row.month}`}
                              title={!activeCompanyId ? 'Select or create a company first' : undefined}
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            {proj && (
                              <button
                                type="button"
                                disabled={!activeCompanyId}
                                onClick={() => deleteProjection(proj.id)}
                                className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50 disabled:pointer-events-none"
                                aria-label={`Delete projection for ${row.month}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 md:p-6" aria-label="Projected vs actual chart">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Projected vs actual (next 12 months)</h2>
        <div className="h-64 sm:h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v >= 1000 ? (v / 1000) + 'k' : v}`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} labelFormatter={(l) => l} />
              <Bar dataKey="projectedRevenue" fill="#13ec49" name="Projected revenue" radius={[2, 2, 0, 0]} />
              <Bar dataKey="actualRevenue" fill="#0ea5e9" name="Actual revenue" radius={[2, 2, 0, 0]} />
              <Bar dataKey="projectedExpenses" fill="#f59e0b" name="Projected expenses" radius={[2, 2, 0, 0]} />
              <Bar dataKey="actualExpenses" fill="#64748b" name="Actual expenses" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
};
