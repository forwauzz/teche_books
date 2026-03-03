import React from 'react';
import { cn } from '../lib/utils';
import { NAV_ITEMS, View } from '../types';
import { Plus, Wallet } from 'lucide-react';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  return (
    <aside className="w-64 flex flex-col border-r border-slate-200 bg-white h-screen">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary p-2 rounded-lg flex items-center justify-center">
          <Wallet className="w-6 h-6 text-slate-900" />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight">SFM Dashboard</h1>
          <p className="text-xs text-slate-500">Service Finance Manager</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.label}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        {currentView !== 'accountant' && (
          <button 
            onClick={() => onViewChange('create-invoice')}
            className="w-full bg-primary text-slate-900 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 btn-primary"
          >
            <Plus className="w-4 h-4" />
            <span>New Invoice</span>
          </button>
        )}
      </div>
    </aside>
  );
};
