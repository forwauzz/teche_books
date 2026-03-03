import React from 'react';
import { formatCurrency } from '../lib/utils';
import type { InvoiceLineItem } from '../types';

const COMPANY_NAME = 'Service Finance Manager Inc.';
const COMPANY_ADDRESS = '123 Business Rd, Tech City, ON';
const COMPANY_EMAIL = 'contact@sfm.com';
const COMPANY_PHONE = '+1 234 567 890';

export interface InvoicePreviewPayload {
  id: string;
  clientName: string;
  clientEmail: string;
  issuedDate: string;
  dueDate: string;
  amount: number;
  lineItems: InvoiceLineItem[];
  taxRate: number;
  notes?: string;
}

function toDateLabel(iso: string) {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
}

export const InvoicePDFPreview: React.FC<{ invoice: InvoicePreviewPayload }> = ({ invoice }) => {
  const subtotal = invoice.lineItems.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const taxAmount = subtotal * invoice.taxRate;
  const total = subtotal + taxAmount;

  return (
    <div className="invoice-print-root bg-white text-slate-900 p-8 max-w-3xl mx-auto" id="invoice-pdf-content">
      <div className="flex justify-between items-start border-b border-slate-300 pb-6 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">{COMPANY_NAME}</h1>
          <p className="text-sm text-slate-600 mt-1">{COMPANY_ADDRESS}</p>
          <p className="text-sm text-slate-600">{COMPANY_EMAIL}</p>
          <p className="text-sm text-slate-600">{COMPANY_PHONE}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">Invoice</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{invoice.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <p className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">Bill To</p>
          <p className="font-semibold text-slate-900">{invoice.clientName}</p>
          <p className="text-sm text-slate-600">{invoice.clientEmail}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-1">Dates</p>
          <p className="text-sm text-slate-700"><span className="text-slate-500">Issued:</span> {toDateLabel(invoice.issuedDate)}</p>
          <p className="text-sm text-slate-700"><span className="text-slate-500">Due:</span> {toDateLabel(invoice.dueDate)}</p>
        </div>
      </div>

      <table className="w-full text-left border-collapse mb-6">
        <thead>
          <tr className="border-b-2 border-slate-200">
            <th className="py-3 text-xs font-bold uppercase text-slate-500">Service</th>
            <th className="py-3 text-xs font-bold uppercase text-slate-500">Description</th>
            <th className="py-3 text-xs font-bold uppercase text-slate-500 w-20 text-center">Qty</th>
            <th className="py-3 text-xs font-bold uppercase text-slate-500 w-28 text-right">Rate</th>
            <th className="py-3 text-xs font-bold uppercase text-slate-500 w-32 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.lineItems.map((item) => (
            <tr key={item.id} className="border-b border-slate-100">
              <td className="py-3 font-medium text-slate-900">{item.service || '—'}</td>
              <td className="py-3 text-sm text-slate-600">{item.description || '—'}</td>
              <td className="py-3 text-center text-slate-700">{item.qty}</td>
              <td className="py-3 text-right text-slate-700">{formatCurrency(item.rate)}</td>
              <td className="py-3 text-right font-semibold text-slate-900">{formatCurrency(item.qty * item.rate)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span className="font-semibold">{formatCurrency(subtotal)}</span>
          </div>
          {invoice.taxRate > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Tax ({(invoice.taxRate * 100).toFixed(0)}%)</span>
              <span className="font-semibold">{formatCurrency(taxAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold border-t border-slate-200 pt-2 mt-2">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {invoice.notes && (
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-2">Notes</p>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">{invoice.notes}</p>
        </div>
      )}

      <p className="mt-10 text-xs text-slate-400 text-center">Thank you for your business. Payment in CAD.</p>
    </div>
  );
};
