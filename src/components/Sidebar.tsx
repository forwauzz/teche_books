import React, { useEffect, useState } from 'react';
import { cn } from '../lib/utils';
import { NAV_ITEMS, View } from '../types';
import { ChevronDown, Check, Menu, Plus, Wallet, X } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

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
  const { state, setCompany } = useAppData();
  const [companyMenuOpen, setCompanyMenuOpen] = useState(false);
  const companySelectorRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (companyMenuOpen) setCompanyMenuOpen(false);
        else onClose?.();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, companyMenuOpen]);

  useEffect(() => {
    if (!companyMenuOpen) return;
    // Defer adding listener so the click that opened the menu doesn't immediately close it.
    let remove: (() => void) | undefined;
    const id = setTimeout(() => {
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Node;
        // Check both desktop and mobile company selector areas (navContent is rendered twice).
        const containers = document.querySelectorAll('[data-company-selector]');
        const isInside = Array.from(containers).some((el) => el.contains(target));
        if (!isInside) setCompanyMenuOpen(false);
      };
      document.addEventListener('click', handleClickOutside);
      remove = () => document.removeEventListener('click', handleClickOutside);
    }, 0);
    return () => {
      clearTimeout(id);
      remove?.();
    };
  }, [companyMenuOpen]);

  const activeCompany = state.company ?? state.companies[0] ?? null;
  const hasCompanies = state.companies.length > 0;

  const navContent = (
    <>
      <div className="p-4 sm:p-6 flex flex-col gap-3 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-lg flex items-center justify-center shrink-0">
            <Wallet className="w-6 h-6 text-slate-900" aria-hidden />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold leading-tight truncate">SFM Dashboard</h2>
            <p className="text-xs text-slate-500">Service Finance Manager</p>
          </div>
        </div>

        {/* Company selector – card-style, responsive, QuickBooks-like */}
        <div ref={companySelectorRef} data-company-selector className="relative w-full">
          <button
            type="button"
            onClick={() => setCompanyMenuOpen((open) => !open)}
            className={cn(
              'w-full flex items-center justify-between gap-3 rounded-xl border bg-white text-left transition-all duration-150',
              'min-h-[52px] sm:min-h-[56px] px-3 py-2.5 sm:px-4 sm:py-3',
              'border-slate-200 shadow-sm',
              'hover:border-slate-300 hover:shadow hover:bg-slate-50/50',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white',
              companyMenuOpen && 'border-primary/40 shadow-md bg-slate-50/50',
              !hasCompanies && 'opacity-90'
            )}
            aria-haspopup="listbox"
            aria-expanded={companyMenuOpen}
            aria-label={activeCompany ? `Company: ${activeCompany.name}. Click to switch company.` : 'Select a company'}
          >
            <span className="flex flex-col min-w-0 flex-1 text-left">
              {/* Label: hidden on very small screens to save space */}
              <span className="hidden sm:block text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-0.5">
                Company
              </span>
              <span
                className={cn(
                  'font-bold text-slate-900 truncate',
                  'text-sm sm:text-base'
                )}
                title={activeCompany?.name || 'No company selected'}
              >
                {activeCompany?.name || 'No company selected'}
              </span>
            </span>
            <ChevronDown
              className={cn(
                'w-5 h-5 sm:w-4 sm:h-4 text-slate-500 shrink-0 transition-transform duration-200',
                companyMenuOpen && 'rotate-180'
              )}
              aria-hidden
            />
          </button>

          {companyMenuOpen && (
            <div
              className="absolute z-20 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg py-1 max-h-[min(60vh,280px)] overflow-y-auto"
              role="listbox"
              aria-label="Saved companies"
            >
              {hasCompanies ? (
                state.companies.map((company) => {
                  const isActive = activeCompany && company.id === activeCompany.id;
                  return (
                    <button
                      key={company.id}
                      type="button"
                      onClick={() => {
                        setCompany(company);
                        setCompanyMenuOpen(false);
                      }}
                      className={cn(
                        'w-full flex items-center justify-between gap-2 px-3 py-2.5 sm:py-2 text-left transition-colors',
                        'text-sm min-h-[44px] sm:min-h-0 touch-manipulation',
                        isActive
                          ? 'bg-primary/10 text-slate-900 font-semibold'
                          : 'hover:bg-slate-50 text-slate-700 active:bg-slate-100'
                      )}
                      role="option"
                      aria-selected={isActive}
                    >
                      <span className="truncate">{company.name || 'Untitled company'}</span>
                      {isActive && <Check className="w-4 h-4 text-primary shrink-0" aria-hidden />}
                    </button>
                  );
                })
              ) : (
                <p className="px-3 py-3 text-sm text-slate-500">No companies. Add one in Settings.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-4 pt-4 space-y-1" aria-label="Main navigation">
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
