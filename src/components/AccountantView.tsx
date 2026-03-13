import React, { useEffect, useMemo, useState } from 'react';
import { Lock, LogOut } from 'lucide-react';
import { useAppData, toTitleDate } from '../context/AppDataContext';
import { formatCurrency } from '../lib/utils';

const ACCESS_KEY = 'sfm-accountant-unlocked';
const ACCOUNTANT_PASSCODE = 'techeservice';

export const AccountantView: React.FC = () => {
  const { scopedInvoices, scopedExpenses } = useAppData();
  const [passcode, setPasscode] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(ACCESS_KEY) === 'true');
  }, []);

  const stats = useMemo(() => {
    const totalRevenue = scopedInvoices.filter((invoice) => invoice.status === 'Paid').reduce((sum, invoice) => sum + invoice.amount, 0);
    const totalExpenses = scopedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const taxEstimate = Math.max(0, (totalRevenue - totalExpenses) * 0.2);
    return {
      totalRevenue,
      totalExpenses,
      netIncome: totalRevenue - totalExpenses,
      taxEstimate,
    };
  }, [scopedExpenses, scopedInvoices]);

  const latestInvoices = useMemo(
    () =>
      [...scopedInvoices]
        .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
        .slice(0, 8),
    [scopedInvoices],
  );

  const latestExpenses = useMemo(
    () =>
      [...scopedExpenses]
        .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
        .slice(0, 8),
    [scopedExpenses],
  );

  const submitPasscode = () => {
    if (passcode === ACCOUNTANT_PASSCODE) {
      sessionStorage.setItem(ACCESS_KEY, 'true');
      setUnlocked(true);
      setPasscode('');
      setError('');
      return;
    }
    setError('Incorrect passcode.');
  };

  const lockPortal = () => {
    sessionStorage.removeItem(ACCESS_KEY);
    setUnlocked(false);
    setPasscode('');
    setError('');
  };

  if (!unlocked) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
              <Lock className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Accountant Access</h2>
              <p className="text-sm text-slate-500">Enter passcode to view read-only financial records.</p>
            </div>
          </div>
          <input
            type="password"
            value={passcode}
            onChange={(event) => {
              setPasscode(event.target.value);
              if (error) setError('');
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') submitPasscode();
            }}
            placeholder="Enter passcode"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
          />
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button onClick={submitPasscode} className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-slate-900 btn-primary">
            Unlock Accountant Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Accountant View</h1>
          <p className="text-slate-500 text-sm">Read-only financial summary and transaction records.</p>
        </div>
        <button onClick={lockPortal} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold btn-outline transition-colors">
          <LogOut className="w-4 h-4" />
          Lock
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Revenue (Paid)" value={formatCurrency(stats.totalRevenue)} />
        <StatCard title="Expenses" value={formatCurrency(stats.totalExpenses)} />
        <StatCard title="Net Income" value={formatCurrency(stats.netIncome)} />
        <StatCard title="Tax Estimate (20%)" value={formatCurrency(stats.taxEstimate)} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200">
            <h3 className="font-bold">Recent Invoices</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left px-4 py-2">Invoice</th>
                <th className="text-left px-4 py-2">Client</th>
                <th className="text-left px-4 py-2">Due</th>
                <th className="text-right px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {latestInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-t border-slate-100">
                  <td className="px-4 py-2 font-semibold">{invoice.id}</td>
                  <td className="px-4 py-2">{invoice.clientName}</td>
                  <td className="px-4 py-2">{toTitleDate(invoice.dueDate)}</td>
                  <td className="px-4 py-2 text-right font-semibold">{formatCurrency(invoice.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200">
            <h3 className="font-bold">Recent Expenses</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left px-4 py-2">Vendor</th>
                <th className="text-left px-4 py-2">Category</th>
                <th className="text-left px-4 py-2">Date</th>
                <th className="text-right px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {latestExpenses.map((expense) => (
                <tr key={expense.id} className="border-t border-slate-100">
                  <td className="px-4 py-2 font-semibold">{expense.vendor}</td>
                  <td className="px-4 py-2">{expense.category}</td>
                  <td className="px-4 py-2">{toTitleDate(expense.date)}</td>
                  <td className="px-4 py-2 text-right font-semibold">{formatCurrency(expense.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }: { title: string; value: string }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-4">
    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{title}</p>
    <p className="text-2xl font-black mt-2">{value}</p>
  </div>
);
