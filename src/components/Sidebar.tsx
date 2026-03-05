import React, { useEffect } from 'react';
import { cn } from '../lib/utils';
import { NAV_ITEMS, View } from '../types';
import { Menu, Plus, Wallet, X } from 'lucide-react';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onViewChange,
  isOpen = true,
  onOpen,
  onClose,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const navContent = (
    <>
      <div className="p-4 sm:p-6 flex items-center gap-3">
        <div className="bg-primary p-2 rounded-lg flex items-center justify-center shrink-0">
          <Wallet className="w-6 h-6 text-slate-900" aria-hidden />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-bold leading-tight truncate">SFM Dashboard</h2>
          <p className="text-xs text-slate-500">Service Finance Manager</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onViewChange(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-left',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-600 hover:bg-slate-100'
              )}
            >
              <Icon className="w-5 h-5 shrink-0" aria-hidden />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        {currentView !== 'accountant' && (
          <button
            type="button"
            onClick={() => onViewChange('create-invoice')}
            className="w-full bg-primary text-slate-900 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 btn-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            <Plus className="w-4 h-4" aria-hidden />
            <span>New Invoice</span>
          </button>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile: hamburger when sidebar closed */}
      {onOpen && onClose && (
        <button
          type="button"
          onClick={onOpen}
          aria-label="Open menu"
          className={cn(
            'lg:hidden fixed top-4 left-4 z-20 p-2 rounded-lg bg-white border border-slate-200 shadow-sm text-slate-700 hover:bg-slate-50',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            isOpen && 'invisible'
          )}
        >
          <Menu className="w-6 h-6" aria-hidden />
        </button>
      )}

      {/* Desktop: always-visible sidebar */}
      <aside
        className={cn(
          'hidden lg:flex w-64 flex-col border-r border-slate-200 bg-white h-screen shrink-0',
          'flex-col'
        )}
        aria-label="App navigation"
      >
        {navContent}
      </aside>

      {/* Mobile: overlay + drawer when open */}
      {onOpen && onClose && (
        <>
          <div
            role="presentation"
            aria-hidden
            onClick={onClose}
            className={cn(
              'lg:hidden fixed inset-0 bg-black/40 z-30 transition-opacity',
              isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
          />
          <aside
            className={cn(
              'lg:hidden fixed inset-y-0 left-0 w-64 max-w-[85vw] flex flex-col border-r border-slate-200 bg-white z-40 shadow-xl transition-transform duration-200 ease-out',
              isOpen ? 'translate-x-0' : '-translate-x-full'
            )}
            aria-label="App navigation"
            aria-modal="true"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <span className="font-bold text-slate-900">Menu</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X className="w-5 h-5" aria-hidden />
              </button>
            </div>
            {navContent}
          </aside>
        </>
      )}
    </>
  );
};
