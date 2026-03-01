import { 
  LayoutDashboard, 
  Users, 
  Receipt, 
  CreditCard, 
  FileText, 
  BarChart3, 
  Plus, 
  Search, 
  Bell, 
  Settings,
  TrendingUp,
  TrendingDown,
  Send,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Download,
  Filter,
  Mail,
  FileJson,
  History,
  Archive,
  Folder,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Eye,
  Calendar,
  DollarSign,
  Briefcase,
  Store,
  Laptop,
  Plane,
  Coffee,
  Building2,
  Megaphone,
  ShieldCheck,
  Link2
} from 'lucide-react';

export type View = 'dashboard' | 'invoices' | 'create-invoice' | 'expenses' | 'clients' | 'vault';

export interface NavItem {
  id: View;
  label: string;
  icon: any;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'invoices', label: 'Invoices', icon: Receipt },
  { id: 'expenses', label: 'Expenses', icon: CreditCard },
  { id: 'vault', label: 'Tax Vault', icon: ShieldCheck },
  { id: 'dashboard', label: 'Reports', icon: BarChart3 },
];

export interface Invoice {
  id: string;
  clientName: string;
  clientEmail: string;
  dueDate: string;
  amount: number;
  status: 'Paid' | 'Overdue' | 'Sent' | 'Draft';
}

export const MOCK_INVOICES: Invoice[] = [
  { id: '#INV-2024-001', clientName: 'Acme Global Industries', clientEmail: 'billing@acme.com', dueDate: 'Oct 24, 2023', amount: 1200, status: 'Paid' },
  { id: '#INV-2024-002', clientName: 'Nexus Tech Solutions', clientEmail: 'accounting@nexus.io', dueDate: 'Oct 25, 2023', amount: 850, status: 'Overdue' },
  { id: '#INV-2024-003', clientName: 'Starlight Co.', clientEmail: 'accounts@starlight.com', dueDate: 'Oct 26, 2023', amount: 2100, status: 'Sent' },
  { id: '#INV-2024-004', clientName: 'Global Logistics', clientEmail: 'finance@globallogistics.com', dueDate: 'Oct 27, 2023', amount: 450, status: 'Draft' },
  { id: '#INV-2024-005', clientName: 'Apex Marketing', clientEmail: 'billing@apex.agency', dueDate: 'Oct 28, 2023', amount: 3300, status: 'Paid' },
];

export interface Expense {
  id: string;
  vendor: string;
  date: string;
  category: string;
  amount: number;
  status: 'Verified' | 'Pending' | 'Flagged';
  icon: any;
}

export const MOCK_EXPENSES: Expense[] = [
  { id: '#EXP-99283-AMZ', vendor: 'Amazon Services', date: 'Oct 24, 2023', category: 'Software', amount: 129.99, status: 'Verified', icon: ShoppingCart },
  { id: '#EXP-99284-SBX', vendor: 'Starbucks', date: 'Oct 23, 2023', category: 'Travel', amount: 15.50, status: 'Pending', icon: Coffee },
  { id: '#EXP-99285-WWK', vendor: 'WeWork Office', date: 'Oct 20, 2023', category: 'Rent', amount: 450.00, status: 'Verified', icon: Building2 },
  { id: '#EXP-99286-FBK', vendor: 'Facebook Ads', date: 'Oct 18, 2023', category: 'Marketing', amount: 1200.00, status: 'Verified', icon: Megaphone },
  { id: '#EXP-99287-DLT', vendor: 'Delta Airlines', date: 'Oct 15, 2023', category: 'Travel', amount: 342.10, status: 'Flagged', icon: Plane },
];

export interface Client {
  id: string;
  name: string;
  contact: string;
  email: string;
  totalBilled: number;
  status: 'Active' | 'Pending' | 'Inactive';
  initials: string;
  color: string;
}

export const MOCK_CLIENTS: Client[] = [
  { id: '1', name: 'Acme Corp', contact: 'John Doe', email: 'john@acme.com', totalBilled: 12500, status: 'Active', initials: 'AC', color: 'bg-primary/10 text-primary' },
  { id: '2', name: 'Global Solutions', contact: 'Jane Smith', email: 'jane@global.com', totalBilled: 8200, status: 'Active', initials: 'GS', color: 'bg-blue-100 text-blue-600' },
  { id: '3', name: 'Tech Pioneers', contact: 'Mike Ross', email: 'mike@tech.com', totalBilled: 25000, status: 'Pending', initials: 'TP', color: 'bg-purple-100 text-purple-600' },
  { id: '4', name: 'Creative Studio', contact: 'Sara Lee', email: 'sara@creative.com', totalBilled: 4150, status: 'Active', initials: 'CS', color: 'bg-orange-100 text-orange-600' },
  { id: '5', name: 'Urban Builders', contact: 'Bob Vila', email: 'bob@urban.com', totalBilled: 19300, status: 'Active', initials: 'UB', color: 'bg-emerald-100 text-emerald-600' },
  { id: '6', name: 'Elite Services', contact: 'Alice Wong', email: 'alice@elite.com', totalBilled: 7800, status: 'Active', initials: 'ES', color: 'bg-rose-100 text-rose-600' },
  { id: '7', name: 'Nova Designs', contact: 'Chris P.', email: 'cp@nova.io', totalBilled: 2400, status: 'Inactive', initials: 'ND', color: 'bg-cyan-100 text-cyan-600' },
];
