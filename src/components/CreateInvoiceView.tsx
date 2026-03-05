import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, FileText, FileDown, PlusCircle, Save, Send, Trash2 } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { makeId, useAppData } from '../context/AppDataContext';
import { InvoiceLineItem } from '../types';
import { InvoicePDFPreviewModal } from './InvoicePDFPreviewModal';
import type { InvoicePreviewPayload } from './InvoicePDFPreview';

interface CreateInvoiceViewProps {
  onDone: () => void;
  onNavigateToClients?: () => void;
}

export const CreateInvoiceView: React.FC<CreateInvoiceViewProps> = ({ onDone, onNavigateToClients }) => {
  const { state, upsertInvoice } = useAppData();
  const [selectedClientEmail, setSelectedClientEmail] = useState(state.clients[0]?.email ?? '');
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [taxRate, setTaxRate] = useState(0.1);
  const [notes, setNotes] = useState('');
  const [pdfPreview, setPdfPreview] = useState<InvoicePreviewPayload | null>(null);
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    { id: makeId('line'), service: 'Service Item', description: 'Description', qty: 1, rate: 0 },
  ]);

  const selectedClient = state.clients.find((client) => client.email === selectedClientEmail);

  useEffect(() => {
    if (state.clients.length > 0) {
      const found = state.clients.some((c) => c.email === selectedClientEmail);
      if (!found) setSelectedClientEmail(state.clients[0].email);
    }
  }, [state.clients]);

  const subtotal = useMemo(() => lineItems.reduce((sum, item) => sum + item.qty * item.rate, 0), [lineItems]);
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  const updateLine = (lineId: string, patch: Partial<InvoiceLineItem>) => {
    setLineItems((current) => current.map((item) => (item.id === lineId ? { ...item, ...patch } : item)));
  };

  const createInvoice = (status: 'Draft' | 'Sent') => {
    if (!selectedClient) return;
    const nextNumber = state.invoices.length + 1;
    const id = `#INV-${new Date().getFullYear()}-${String(nextNumber).padStart(3, '0')}`;
    upsertInvoice({
      id,
      clientName: selectedClient.name,
      clientEmail: selectedClient.email,
      issuedDate: new Date().toISOString().slice(0, 10),
      dueDate,
      amount: total,
      status,
      taxRate,
      notes,
      lineItems,
    });
    onDone();
  };

  const openPdfPreview = () => {
    if (!selectedClient) return;
    const nextNumber = state.invoices.length + 1;
    const id = `#INV-${new Date().getFullYear()}-${String(nextNumber).padStart(3, '0')}`;
    setPdfPreview({
      id,
      clientName: selectedClient.name,
      clientEmail: selectedClient.email,
      issuedDate: new Date().toISOString().slice(0, 10),
      dueDate,
      amount: total,
      taxRate,
      notes,
      lineItems,
    });
  };

  const hasClients = state.clients.length > 0;

  if (!hasClients) {
    return (
      <div className="flex flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-md mx-auto flex flex-col items-center justify-center text-center space-y-4 py-12">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">No clients yet</h1>
          <p className="text-slate-500">Add at least one client before creating an invoice. You can manage clients from the Clients page.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {onNavigateToClients && (
              <button
                type="button"
                onClick={onNavigateToClients}
                className="px-6 py-2.5 rounded-lg bg-primary text-slate-900 font-bold text-sm btn-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Go to Clients
              </button>
            )}
            <button
              type="button"
              onClick={onDone}
              className="px-6 py-2.5 rounded-lg border border-slate-200 font-medium text-sm btn-outline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Back to Invoices
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
          <div className="flex justify-between items-end border-b border-slate-200 pb-4 md:pb-6">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">Create New Invoice</h1>
              <p className="text-slate-500 text-sm">Build a real invoice and store it in your app data.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 bg-white p-4 md:p-6 rounded-xl border border-slate-200">
            <div className="space-y-2">
              <label htmlFor="create-invoice-client" className="text-sm font-bold text-slate-700">Bill To</label>
              <select
                id="create-invoice-client"
                aria-label="Select client to bill"
                className="w-full rounded-lg border border-slate-200 bg-white text-sm py-3 px-4"
                value={selectedClientEmail}
                onChange={(event) => setSelectedClientEmail(event.target.value)}
              >
                {state.clients.map((client) => (
                  <option key={client.id} value={client.email}>
                    {client.name} - {client.contact}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500">{selectedClient?.email ?? 'No client selected'}</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="create-invoice-due" className="text-sm font-bold text-slate-700">Due Date</label>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <Calendar className="w-4 h-4 text-slate-400" />
                <input id="create-invoice-due" className="flex-1 bg-transparent border-none text-sm p-0 focus:ring-0" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} aria-label="Due date" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-400">
                  <th className="py-4 px-2 w-1/4">Service</th>
                  <th className="py-4 px-2">Description</th>
                  <th className="py-4 px-2 w-20">Qty</th>
                  <th className="py-4 px-2 w-28">Rate</th>
                  <th className="py-4 px-2 w-32 text-right">Amount</th>
                  <th className="py-4 px-2 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lineItems.map((item) => (
                  <tr key={item.id}>
                    <td className="py-4 px-2">
                      <input className="w-full rounded border border-slate-200 px-2 py-1 text-sm" value={item.service} onChange={(event) => updateLine(item.id, { service: event.target.value })} />
                    </td>
                    <td className="py-4 px-2">
                      <input className="w-full rounded border border-slate-200 px-2 py-1 text-sm" value={item.description} onChange={(event) => updateLine(item.id, { description: event.target.value })} />
                    </td>
                    <td className="py-4 px-2">
                      <input className="w-full rounded border border-slate-200 px-2 py-1 text-sm" type="number" min={1} value={item.qty} onChange={(event) => updateLine(item.id, { qty: Number(event.target.value) || 1 })} />
                    </td>
                    <td className="py-4 px-2">
                      <input className="w-full rounded border border-slate-200 px-2 py-1 text-sm" type="number" min={0} step="0.01" value={item.rate} onChange={(event) => updateLine(item.id, { rate: Number(event.target.value) || 0 })} />
                    </td>
                    <td className="py-4 px-2 text-right font-bold text-sm">{formatCurrency(item.qty * item.rate)}</td>
                    <td className="py-4 px-2">
                      <button onClick={() => setLineItems((current) => current.filter((line) => line.id !== item.id))} className="text-slate-300 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={() =>
                setLineItems((current) => [...current, { id: makeId('line'), service: '', description: '', qty: 1, rate: 0 }])
              }
              className="mt-4 flex items-center gap-2 text-primary font-bold text-sm px-2 py-1 rounded hover:bg-primary/10 transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> Add Line Item
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="text-sm font-bold text-slate-700">Notes</label>
              <textarea className="w-full mt-2 rounded-lg border border-slate-200 p-3 text-sm min-h-32" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Optional invoice notes..." />
            </div>
            <div className="w-full max-w-xs space-y-3 ml-auto">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-bold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Tax</span>
                  <select value={taxRate} onChange={(event) => setTaxRate(Number(event.target.value))} className="bg-slate-100 rounded text-[10px] py-1 px-2 font-bold uppercase">
                    <option value={0}>No Tax (0%)</option>
                    <option value={0.05}>GST (5%)</option>
                    <option value={0.13}>HST (13%)</option>
                    <option value={0.15}>Sales Tax (15%)</option>
                  </select>
                </div>
                <span className="font-bold">{formatCurrency(taxAmount)}</span>
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                <span className="text-lg font-bold">Total Amount</span>
                <span className="text-3xl font-black text-primary">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside className="w-80 border-l border-slate-200 bg-white p-6 flex flex-col gap-4">
        <h3 className="text-base font-bold">Invoice Actions</h3>
        <button onClick={openPdfPreview} className="w-full flex items-center justify-center gap-2 rounded-lg h-11 border border-slate-200 font-bold btn-outline transition-colors">
          <FileDown className="w-4 h-4" /> Preview PDF
        </button>
        <button onClick={() => createInvoice('Sent')} className="w-full flex items-center justify-center gap-2 rounded-lg h-11 bg-primary text-slate-900 font-bold btn-primary">
          <Send className="w-4 h-4" /> Save & Send
        </button>
        <button onClick={() => createInvoice('Draft')} className="w-full flex items-center justify-center gap-2 rounded-lg h-11 border border-slate-200 font-bold btn-outline transition-colors">
          <Save className="w-4 h-4" /> Save as Draft
        </button>
        <button onClick={onDone} className="w-full flex items-center justify-center gap-2 rounded-lg h-11 bg-slate-100 font-bold btn-secondary transition-colors">
          <FileText className="w-4 h-4" /> Back to Invoices
        </button>
      </aside>

      <InvoicePDFPreviewModal invoice={pdfPreview} onClose={() => setPdfPreview(null)} />
    </div>
  );
};
