import React from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  Edit, 
  ShoppingCart, 
  Coffee, 
  Building2, 
  Megaphone, 
  Plane,
  Store,
  Laptop,
  CreditCard,
  Verified,
  CloudUpload,
  X
} from 'lucide-react';
import { MOCK_EXPENSES } from '../types';
import { cn, formatCurrency } from '../lib/utils';

export const ExpensesView: React.FC = () => {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden">
      <main className="flex flex-1 overflow-hidden">
        <aside className="w-1/3 min-w-[380px] flex flex-col border-r border-slate-200 bg-white">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold">Recent Expenses</h1>
              <button className="text-slate-500 hover:text-primary">
                <Filter className="w-5 h-5" />
              </button>
            </div>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full">All</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-medium rounded-full">Pending</span>
              <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-medium rounded-full">Verified</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-slate-100">
              {MOCK_EXPENSES.map((expense, idx) => {
                const Icon = expense.icon;
                const isSelected = idx === 0;
                return (
                  <div 
                    key={expense.id} 
                    className={cn(
                      "p-4 flex items-center gap-4 cursor-pointer transition-colors",
                      isSelected ? "bg-primary/5 border-l-4 border-primary" : "hover:bg-slate-50"
                    )}
                  >
                    <div className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center",
                      isSelected ? "bg-primary/20 text-primary" : "bg-slate-100 text-slate-500"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm">{expense.vendor}</h3>
                      <p className="text-xs text-slate-500">{expense.date} • {expense.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{formatCurrency(expense.amount)}</p>
                      <span className={cn(
                        "text-[10px] uppercase font-bold",
                        expense.status === 'Verified' ? "text-primary" : 
                        expense.status === 'Pending' ? "text-amber-500" : "text-red-500"
                      )}>
                        {expense.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        <section className="flex-1 bg-background-light p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black tracking-tight">Expense Details</h2>
                <p className="text-slate-500 text-sm">Reference ID: #EXP-99283-AMZ</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
                  <Download className="w-4 h-4" />
                  <span>Download Receipt</span>
                </button>
                <button className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:opacity-90 transition-all">
                  <Edit className="w-4 h-4" />
                  <span>Edit Expense</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-6">General Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Vendor Name</label>
                      <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg font-semibold">
                        <Store className="w-4 h-4 text-primary" />
                        Amazon Services
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Amount</label>
                        <div className="p-3 bg-slate-50 rounded-lg font-semibold text-lg text-primary">
                          CA$129.99
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
                        <div className="p-3 bg-slate-50 rounded-lg font-semibold">
                          Oct 24, 2023
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
                      <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg font-semibold">
                        <Laptop className="w-4 h-4 text-primary" />
                        Software & Subscriptions
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-500 mb-1">Notes</label>
                      <p className="p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
                        Monthly AWS hosting fees for the client management portal and database backup services.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Payment Method</h3>
                    <CreditCard className="w-4 h-4 text-slate-300" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-16 bg-slate-100 rounded flex items-center justify-center font-bold italic text-slate-400">VISA</div>
                    <div>
                      <p className="font-bold text-sm">Business Platinum Card</p>
                      <p className="text-xs text-slate-500">Ends in •••• 4492</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Receipt Preview</h3>
                    <button className="text-primary text-xs font-bold hover:underline">View Full Screen</button>
                  </div>
                  <div className="flex-1 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center min-h-[400px]">
                    <div className="relative w-full h-full p-4">
                      <div className="w-full h-full bg-white shadow-xl flex flex-col p-6 text-[10px] text-slate-800 uppercase tracking-tight overflow-hidden">
                        <div className="text-center mb-4 border-b pb-4">
                          <div className="font-black text-lg">AMAZON.COM</div>
                          <div>Order # 112-9928311-33291</div>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span>Oct 24, 2023</span>
                          <span>14:32 PM</span>
                        </div>
                        <div className="flex justify-between font-bold mb-4">
                          <span>AWS MONTHLY BILLING</span>
                          <span>CA$129.99</span>
                        </div>
                        <div className="mt-auto border-t pt-4">
                          <div className="flex justify-between text-xs font-bold">
                            <span>TOTAL</span>
                            <span>CA$129.99</span>
                          </div>
                          <div className="mt-4 flex justify-center">
                            <div className="h-12 w-3/4 bg-[repeating-linear-gradient(90deg,#000,#000_2px,transparent_2px,transparent_4px)]"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 px-2 py-2 bg-primary/10 rounded-lg">
                    <Verified className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-slate-700">OCR successfully extracted all data points.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
