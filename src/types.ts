import { Calculator, CreditCard, LayoutDashboard, Receipt, ShieldCheck, Users } from 'lucide-react';
import type { ComponentType } from 'react';

export type View = 'dashboard' | 'invoices' | 'create-invoice' | 'expenses' | 'clients' | 'vault' | 'accountant';

export interface NavItem {
  id: View;
  label: string;
  icon: ComponentType<any>;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'invoices', label: 'Invoices', icon: Receipt },
  { id: 'expenses', label: 'Expenses', icon: CreditCard },
  { id: 'vault', label: 'Tax Vault', icon: ShieldCheck },
  { id: 'accountant', label: 'Accountant', icon: Calculator },
];

export type InvoiceStatus = 'Paid' | 'Overdue' | 'Sent' | 'Draft';

export interface InvoiceLineItem {
  id: string;
  service: string;
  description: string;
  qty: number;
  rate: number;
}

export interface Invoice {
  id: string;
  clientName: string;
  clientEmail: string;
  issuedDate: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
  lineItems: InvoiceLineItem[];
  taxRate: number;
  notes?: string;
  updatedAt: string;
}

export const MOCK_INVOICES: Invoice[] = [
  {
    id: '#INV-2024-001',
    clientName: 'Acme Global Industries',
    clientEmail: 'billing@acme.com',
    issuedDate: '2024-10-01',
    dueDate: '2024-10-24',
    amount: 1200,
    status: 'Paid',
    lineItems: [{ id: 'li-1', service: 'Maintenance', description: 'Monthly maintenance', qty: 1, rate: 1200 }],
    taxRate: 0.1,
    updatedAt: new Date().toISOString(),
  },
  {
    id: '#INV-2024-002',
    clientName: 'Nexus Tech Solutions',
    clientEmail: 'accounting@nexus.io',
    issuedDate: '2024-10-05',
    dueDate: '2024-10-25',
    amount: 850,
    status: 'Overdue',
    lineItems: [{ id: 'li-2', service: 'Support', description: 'Support retainer', qty: 1, rate: 850 }],
    taxRate: 0.1,
    updatedAt: new Date().toISOString(),
  },
  {
    id: '#INV-2024-003',
    clientName: 'Starlight Co.',
    clientEmail: 'accounts@starlight.com',
    issuedDate: '2024-10-10',
    dueDate: '2024-10-26',
    amount: 2100,
    status: 'Sent',
    lineItems: [{ id: 'li-3', service: 'Web build', description: 'Landing page and CMS', qty: 1, rate: 2100 }],
    taxRate: 0.1,
    updatedAt: new Date().toISOString(),
  },
  {
    id: '#INV-2024-004',
    clientName: 'Global Logistics',
    clientEmail: 'finance@globallogistics.com',
    issuedDate: '2024-10-12',
    dueDate: '2024-10-27',
    amount: 450,
    status: 'Draft',
    lineItems: [{ id: 'li-4', service: 'Inspection', description: 'Safety inspection', qty: 1, rate: 450 }],
    taxRate: 0.1,
    updatedAt: new Date().toISOString(),
  },
  {
    id: '#INV-2024-005',
    clientName: 'Apex Marketing',
    clientEmail: 'billing@apex.agency',
    issuedDate: '2024-10-15',
    dueDate: '2024-10-28',
    amount: 3300,
    status: 'Paid',
    lineItems: [{ id: 'li-5', service: 'Campaign setup', description: 'Ads strategy + setup', qty: 1, rate: 3300 }],
    taxRate: 0.1,
    updatedAt: new Date().toISOString(),
  },
];

export type ExpenseStatus = 'Verified' | 'Pending' | 'Flagged';

export interface Expense {
  id: string;
  vendor: string;
  date: string; // ISO date
  category: string;
  amount: number;
  status: ExpenseStatus;
  notes?: string;
  paymentMethod?: string;
  receiptName?: string;
  updatedAt: string;
}

export const MOCK_EXPENSES: Expense[] = [
  {
    id: '#EXP-99283-AMZ',
    vendor: 'Amazon Services',
    date: '2024-10-24',
    category: 'Software',
    amount: 129.99,
    status: 'Verified',
    notes: 'Monthly AWS hosting fees.',
    paymentMethod: 'Business Platinum Card',
    receiptName: 'Equipment_Receipt_04.jpg',
    updatedAt: new Date().toISOString(),
  },
  {
    id: '#EXP-99284-SBX',
    vendor: 'Starbucks',
    date: '2024-10-23',
    category: 'Travel',
    amount: 15.5,
    status: 'Pending',
    notes: 'Coffee with prospect.',
    paymentMethod: 'Business Visa',
    updatedAt: new Date().toISOString(),
  },
  {
    id: '#EXP-99285-WWK',
    vendor: 'WeWork Office',
    date: '2024-10-20',
    category: 'Rent',
    amount: 450,
    status: 'Verified',
    notes: 'Office membership.',
    paymentMethod: 'Business ACH',
    updatedAt: new Date().toISOString(),
  },
];

export type ClientStatus = 'Active' | 'Pending' | 'Inactive';

export interface Client {
  id: string;
  name: string;
  contact: string;
  email: string;
  status: ClientStatus;
  initials: string;
  color: string;
  updatedAt: string;
}

export const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'Acme Corp', contact: 'John Doe', email: 'john@acme.com', status: 'Active', initials: 'AC', color: 'bg-primary/10 text-primary', updatedAt: new Date().toISOString() },
  { id: '2', name: 'Global Solutions', contact: 'Jane Smith', email: 'jane@global.com', status: 'Active', initials: 'GS', color: 'bg-blue-100 text-blue-600', updatedAt: new Date().toISOString() },
  { id: '3', name: 'Tech Pioneers', contact: 'Mike Ross', email: 'mike@tech.com', status: 'Pending', initials: 'TP', color: 'bg-purple-100 text-purple-600', updatedAt: new Date().toISOString() },
  { id: '4', name: 'Creative Studio', contact: 'Sara Lee', email: 'sara@creative.com', status: 'Active', initials: 'CS', color: 'bg-orange-100 text-orange-600', updatedAt: new Date().toISOString() },
];

export interface VaultFolder {
  id: string;
  label: string;
  year: string;
  isCurrent?: boolean;
}

export interface VaultDocument {
  id: string;
  folderId: string;
  name: string;
  type: string;
  uploadDate: string;
  linkedTransaction?: string;
  size: string;
}

export const MOCK_VAULT_FOLDERS: VaultFolder[] = [
  { id: 'folder-2024', label: 'Tax Year 2024', year: '2024', isCurrent: true },
  { id: 'folder-2023', label: 'Tax Year 2023', year: '2023' },
];

export const MOCK_VAULT_DOCUMENTS: VaultDocument[] = [
  {
    id: 'doc-1',
    folderId: 'folder-2024',
    name: 'Q1_Sales_Tax_Report.pdf',
    type: 'Sales Tax Return',
    uploadDate: '2024-04-12',
    linkedTransaction: 'TXN-88219',
    size: '1.2 MB',
  },
  {
    id: 'doc-2',
    folderId: 'folder-2024',
    name: 'Equipment_Receipt_04.jpg',
    type: 'Capital Expenditure',
    uploadDate: '2024-05-05',
    linkedTransaction: 'TXN-90123',
    size: '4.5 MB',
  },
];
