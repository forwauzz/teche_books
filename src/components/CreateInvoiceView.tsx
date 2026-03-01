import React from 'react';
import { 
  Plus, 
  Settings, 
  Bell, 
  Building2, 
  ChevronDown, 
  PlusCircle, 
  Trash2, 
  Send, 
  FileText, 
  Save, 
  HelpCircle,
  Calendar,
  DollarSign,
  Percent
} from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';

export const CreateInvoiceView: React.FC = () => {
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Page Title & Header */}
          <div className="flex justify-between items-end border-b border-slate-200 pb-6">
            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tight">Create New Invoice</h1>
              <p className="text-slate-500">Draft your professional invoice for client billing.</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Invoice Number</p>
              <p className="text-xl font-mono font-bold">INV-2023-001</p>
            </div>
          </div>

          {/* Business Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-xl border border-slate-200">
            <div className="flex gap-4">
              <div className="bg-primary/10 rounded-lg min-h-24 w-24 flex items-center justify-center text-primary border border-primary/20">
                <Building2 className="w-10 h-10" />
              </div>
              <div className="flex flex-col">
                <p className="text-lg font-bold">Service Finance Manager Inc.</p>
                <p className="text-slate-500 text-sm">123 Business Rd, Tech City, 10101</p>
                <p className="text-slate-500 text-sm">contact@sfm.com</p>
                <p className="text-slate-500 text-sm">+1 234 567 890</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">Bill To:</label>
              <div className="relative">
                <select className="w-full rounded-lg border-slate-200 bg-white text-sm focus:ring-primary focus:border-primary py-3 pl-4 pr-10 appearance-none">
                  <option>Select a client...</option>
                  <option>Acme Corp - David Miller</option>
                  <option>Global Logistics - Sarah Jenkins</option>
                  <option>Starlight Creative - Leo Wong</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
              <button className="text-primary text-xs font-bold flex items-center gap-1 hover:underline">
                <Plus className="w-3 h-3" /> Add New Client
              </button>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-400">
                  <th className="py-4 px-2 w-1/3">Service / Product</th>
                  <th className="py-4 px-2">Description</th>
                  <th className="py-4 px-2 w-20">Qty</th>
                  <th className="py-4 px-2 w-32">Rate</th>
                  <th className="py-4 px-2 w-32 text-right">Amount</th>
                  <th className="py-4 px-2 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <LineItemRow 
                  service="Web Design" 
                  description="Custom landing page development" 
                  qty={1} 
                  rate={1200} 
                />
                <LineItemRow 
                  service="SEO Optimization" 
                  description="Monthly retainer for keyword tracking" 
                  qty={2} 
                  rate={250} 
                />
              </tbody>
            </table>
            <button className="mt-4 flex items-center gap-2 text-primary font-bold text-sm px-2 hover:opacity-80">
              <PlusCircle className="w-4 h-4" /> Add Line Item
            </button>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end pt-8">
            <div className="w-full max-w-xs space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-bold">{formatCurrency(1700)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Tax</span>
                  <select className="bg-slate-100 border-none rounded text-[10px] py-1 px-2 font-bold uppercase tracking-tighter">
                    <option>No Tax (0%)</option>
                    <option selected>VAT (10%)</option>
                    <option>Sales Tax (8%)</option>
                  </select>
                </div>
                <span className="font-bold">{formatCurrency(170)}</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                <span className="text-lg font-bold">Total Amount</span>
                <span className="text-3xl font-black text-primary">{formatCurrency(1870)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar Settings */}
      <aside className="w-80 border-l border-slate-200 bg-white p-6 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h3 className="text-base font-bold flex items-center gap-2">
            <Settings className="w-4 h-4 text-primary" />
            Invoice Settings
          </h3>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-slate-400">Currency</label>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <DollarSign className="w-4 h-4 text-slate-400" />
                <select className="flex-1 bg-transparent border-none text-sm p-0 focus:ring-0">
                  <option>CAD - Canadian Dollar</option>
                  <option>USD - US Dollar</option>
                  <option>EUR - Euro</option>
                  <option>GBP - British Pound</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-slate-400">Due Date</label>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <Calendar className="w-4 h-4 text-slate-400" />
                <input className="flex-1 bg-transparent border-none text-sm p-0 focus:ring-0" type="date" defaultValue="2023-12-31" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-slate-400">Tax Rules</label>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <Percent className="w-4 h-4 text-slate-400" />
                <span className="text-sm">Standard VAT (10%)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-auto">
          <button className="w-full flex items-center justify-center gap-2 rounded-lg h-11 bg-primary text-slate-900 font-bold hover:brightness-95 transition-all">
            <Send className="w-4 h-4" /> Send to Client
          </button>
          <button className="w-full flex items-center justify-center gap-2 rounded-lg h-11 bg-slate-100 font-bold hover:bg-slate-200 transition-all">
            <FileText className="w-4 h-4" /> Preview PDF
          </button>
          <button className="w-full flex items-center justify-center gap-2 rounded-lg h-11 border border-slate-200 font-bold hover:bg-slate-50 transition-all">
            <Save className="w-4 h-4" /> Save as Draft
          </button>
          <div className="mt-4 flex items-center justify-center gap-2 text-slate-400 text-sm cursor-pointer hover:text-slate-600 transition-colors">
            <HelpCircle className="w-4 h-4" />
            Need help?
          </div>
        </div>
      </aside>
    </div>
  );
};

const LineItemRow = ({ service, description, qty, rate }: any) => (
  <tr>
    <td className="py-4 px-2">
      <input className="w-full bg-transparent border-none focus:ring-0 p-0 font-medium" defaultValue={service} />
    </td>
    <td className="py-4 px-2">
      <input className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm text-slate-500" defaultValue={description} />
    </td>
    <td className="py-4 px-2">
      <input className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm" type="number" defaultValue={qty} />
    </td>
    <td className="py-4 px-2">
      <input
        className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm"
        defaultValue={formatCurrency(rate)}
      />
    </td>
    <td className="py-4 px-2 text-right font-bold text-sm">
      {formatCurrency(qty * rate)}
    </td>
    <td className="py-4 px-2 text-slate-300 hover:text-red-500 cursor-pointer">
      <Trash2 className="w-4 h-4" />
    </td>
  </tr>
);
