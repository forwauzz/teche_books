import { Calculator, CreditCard, LayoutDashboard, Receipt, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import type { ComponentType } from 'react';

export type View = 'dashboard' | 'invoices' | 'create-invoice' | 'expenses' | 'clients' | 'vault' | 'accountant' | 'projections' | 'settings';

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
  { id: 'projections', label: 'Projections', icon: TrendingUp },
  { id: 'vault', label: 'Tax Vault', icon: ShieldCheck },
  { id: 'accountant', label: 'Accountant', icon: Calculator },
];

export interface Projection {
  id: string;
  month: string; // YYYY-MM
  projectedRevenue: number;
  projectedExpenses: number;
  notes?: string;
  updatedAt: string;
}

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

