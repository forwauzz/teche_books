import React from 'react';
import { 
  Search, 
  Plus, 
  Download, 
  Folder, 
  FolderPlus, 
  FileText, 
  Image as ImageIcon, 
  MoreVertical, 
  ChevronRight, 
  UploadCloud,
  Grid,
  History,
  Archive,
  ShieldCheck,
  Link2,
  File
} from 'lucide-react';
import { cn } from '../lib/utils';

export const VaultView: React.FC = () => {
  return (
    <div className="flex flex-1">
      {/* Sidebar */}
      <aside className="w-64 border-r border-emerald-100 p-4 flex flex-col gap-6 bg-white">
        <div className="flex flex-col">
          <h1 className="text-slate-900 text-base font-bold">Secure Vault</h1>
          <p className="text-emerald-600 text-xs font-medium uppercase tracking-wider mt-1">Storage Management</p>
        </div>
        <nav className="flex flex-col gap-1">
          <SidebarItem icon={<Grid className="w-4 h-4" />} label="Overview" />
          <SidebarItem icon={<ShieldCheck className="w-4 h-4" />} label="Tax Documents" active />
          <SidebarItem icon={<History className="w-4 h-4" />} label="Audit Trail" />
          <SidebarItem icon={<Archive className="w-4 h-4" />} label="Archive" />
          
          <div className="my-4 border-t border-emerald-100"></div>
          <p className="px-3 text-[10px] font-bold text-emerald-600/50 uppercase mb-2">Years</p>
          <SidebarItem 
            icon={<Folder className="w-4 h-4 text-emerald-400" />} 
            label="Tax Year 2024" 
            badge="Current" 
          />
          <SidebarItem 
            icon={<Folder className="w-4 h-4 text-emerald-400" />} 
            label="Tax Year 2023" 
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-white">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 px-8 py-4 text-sm font-medium">
          <a className="text-emerald-600 hover:text-primary" href="#">Financial Documents</a>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900">Tax Year 2024</span>
        </div>

        <div className="px-8 pb-8 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-wrap justify-between items-end gap-3">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Tax Documents 2024</h1>
              <p className="text-emerald-600 text-sm">Manage and review your service business tax filings for the current fiscal year.</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 rounded-lg h-10 px-4 bg-emerald-50 text-emerald-900 text-sm font-bold hover:bg-emerald-100 transition-colors">
                <Download className="w-4 h-4" />
                Download Zip
              </button>
              <button className="flex items-center gap-2 rounded-lg h-10 px-4 bg-primary text-emerald-950 text-sm font-bold hover:opacity-90 transition-opacity">
                <Plus className="w-4 h-4" />
                New Folder
              </button>
            </div>
          </div>

          {/* Upload Zone */}
          <div className="relative group">
            <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/30 px-6 py-10 transition-all group-hover:border-primary group-hover:bg-emerald-50/50">
              <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center">
                <UploadCloud className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-slate-900">Upload Document</p>
                <p className="text-sm text-slate-500 mt-1">
                  Drag and drop your tax files here, or <span className="text-primary font-semibold cursor-pointer underline">browse computer</span>.
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-4">Supports PDF, JPG, PNG (Max 25MB)</p>
              </div>
            </div>
          </div>

          {/* Documents List */}
          <div className="bg-white border border-emerald-100 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-emerald-50/50 text-xs font-bold uppercase text-emerald-800">
                  <th className="px-6 py-4">Document Name</th>
                  <th className="px-6 py-4">Upload Date</th>
                  <th className="px-6 py-4">Linked Transaction</th>
                  <th className="px-6 py-4">Size</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                <DocumentRow 
                  name="Q1_Sales_Tax_Report.pdf" 
                  type="Sales Tax Return" 
                  date="Apr 12, 2024" 
                  txn="TXN-88219" 
                  size="1.2 MB" 
                  icon={<FileText className="w-5 h-5 text-red-600" />}
                  iconBg="bg-red-100"
                />
                <DocumentRow 
                  name="Equipment_Receipt_04.jpg" 
                  type="Capital Expenditure" 
                  date="May 05, 2024" 
                  txn="TXN-90123" 
                  size="4.5 MB" 
                  icon={<ImageIcon className="w-5 h-5 text-blue-600" />}
                  iconBg="bg-blue-100"
                />
                <DocumentRow 
                  name="W9_Contractor_Smith.pdf" 
                  type="Vendor Onboarding" 
                  date="May 10, 2024" 
                  txn={null} 
                  size="850 KB" 
                  icon={<FileText className="w-5 h-5 text-red-600" />}
                  iconBg="bg-red-100"
                />
                <DocumentRow 
                  name="Annual_Property_Tax_2024.pdf" 
                  type="Property Tax" 
                  date="Jun 02, 2024" 
                  txn="TXN-91102" 
                  size="2.1 MB" 
                  icon={<File className="w-5 h-5 text-emerald-600" />}
                  iconBg="bg-emerald-100"
                />
              </tbody>
            </table>
            <div className="px-6 py-4 border-t border-emerald-50 flex justify-between items-center bg-emerald-50/20">
              <p className="text-xs text-slate-500 font-medium">Showing 4 of 4 documents in this directory</p>
            </div>
          </div>

          {/* Quick Access Folders */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-slate-900">Quick Access Folders</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FolderCard label="Invoices" count="124 files" />
              <FolderCard label="Payroll Tax" count="48 files" />
              <FolderCard label="Audits" count="12 files" />
              <div className="p-4 rounded-lg bg-white border border-emerald-100 flex items-center gap-3 hover:shadow-md transition-shadow cursor-pointer">
                <PlusCircle className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-xs font-bold text-emerald-600">New Category</p>
                  <p className="text-[10px] text-slate-500">Create folder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, badge }: any) => (
  <a className={cn(
    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
    active ? "bg-primary/10 text-emerald-900" : "hover:bg-emerald-50"
  )} href="#">
    <div className={cn(active ? "text-primary" : "text-emerald-600 group-hover:text-primary")}>
      {icon}
    </div>
    <p className={cn("text-sm", active ? "font-bold" : "font-medium")}>{label}</p>
    {badge && (
      <span className="ml-auto text-[10px] bg-primary/20 px-1.5 py-0.5 rounded text-emerald-800">{badge}</span>
    )}
  </a>
);

const DocumentRow = ({ name, type, date, txn, size, icon, iconBg }: any) => (
  <tr className="hover:bg-emerald-50/20 transition-colors group">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className={cn("size-10 rounded flex items-center justify-center", iconBg)}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{name}</p>
          <p className="text-xs text-slate-500">{type}</p>
        </div>
      </div>
    </td>
    <td className="px-6 py-4 text-sm text-slate-600">{date}</td>
    <td className="px-6 py-4">
      {txn ? (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
          <Link2 className="w-3 h-3" />
          {txn}
        </span>
      ) : (
        <span className="text-sm text-slate-400 italic">Unlinked</span>
      )}
    </td>
    <td className="px-6 py-4 text-sm text-slate-500">{size}</td>
    <td className="px-6 py-4 text-right">
      <button className="text-slate-400 hover:text-primary transition-colors">
        <MoreVertical className="w-4 h-4" />
      </button>
    </td>
  </tr>
);

const FolderCard = ({ label, count }: any) => (
  <div className="p-4 rounded-lg bg-white border border-emerald-100 flex items-center gap-3 hover:shadow-md transition-shadow cursor-pointer">
    <Folder className="w-5 h-5 text-amber-500" />
    <div>
      <p className="text-xs font-bold">{label}</p>
      <p className="text-[10px] text-slate-500">{count}</p>
    </div>
  </div>
);

const PlusCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="16"/><line x1="8" x2="16" y1="12" y2="12"/>
  </svg>
);
