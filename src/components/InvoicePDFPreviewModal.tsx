import React, { useRef } from 'react';
import { FileDown, X } from 'lucide-react';
import { InvoicePDFPreview, type InvoicePreviewPayload } from './InvoicePDFPreview';

interface InvoicePDFPreviewModalProps {
  invoice: InvoicePreviewPayload | null;
  onClose: () => void;
}

export const InvoicePDFPreviewModal: React.FC<InvoicePDFPreviewModalProps> = ({ invoice, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  if (!invoice) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-100">
      <div className="no-print flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shrink-0">
        <h2 className="text-lg font-bold text-slate-900">Invoice Preview</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-slate-900 font-bold text-sm btn-primary"
          >
            <FileDown className="w-4 h-4" />
            Print / Save as PDF
          </button>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold btn-outline transition-colors"
          >
            <X className="w-4 h-4" />
            Close
          </button>
        </div>
      </div>
      <div ref={containerRef} className="flex-1 overflow-auto py-6">
        <InvoicePDFPreview invoice={invoice} />
      </div>
    </div>
  );
};
