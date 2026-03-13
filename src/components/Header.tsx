import React, { useEffect, useRef, useState } from 'react';
import { LogOut, Search, Bell, Settings } from 'lucide-react';
import { AUTH_EMAIL_KEY } from './LoginView';
import { useAppData } from '../context/AppDataContext';

interface HeaderProps {
  title: string;
  onOpenSettings: () => void;
  onSignOut: () => void;
  onOpenMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onOpenSettings, onSignOut, onOpenMenu }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const { state } = useAppData();
  const companyName = state.company?.name?.trim() || '';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(AUTH_EMAIL_KEY);
      if (stored) {
        setUserEmail(stored);
      }
    } catch {
      // ignore if sessionStorage is not available
    }
  }, []);

  return (
    <header className="h-14 sm:h-16 flex items-center justify-between gap-2 px-4 sm:px-6 md:px-8 bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        {onOpenMenu && (
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open menu"
            className="lg:hidden shrink-0 p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-lg sm:text-xl font-bold truncate">{title}</h2>
          {companyName && title.startsWith('Dashboard') && (
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 text-xs font-medium text-slate-700 max-w-[180px] truncate">
              {companyName}
            </span>
          )}
        </div>
        <div className="relative w-32 sm:w-48 md:w-64 hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" aria-hidden />
          <input
            className="w-full bg-slate-100 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary focus:outline-none"
            placeholder="Search transactions..."
            type="search"
            aria-label="Search transactions"
          />
        </div>
      </div>
      <div className="flex items-center gap-4" ref={menuRef}>
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg" type="button">
          <Bell className="w-5 h-5" />
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="max-w-xs flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-expanded={menuOpen}
            aria-haspopup="true"
            aria-controls="user-menu"
            id="user-menu-button"
          >
            <span className="truncate">
              {userEmail || 'Account'}
            </span>
          </button>
          {menuOpen && (
            <div id="user-menu" role="menu" aria-labelledby="user-menu-button" className="absolute right-0 top-full mt-2 w-48 py-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
              <button
                type="button"
                onClick={() => { setMenuOpen(false); onOpenSettings(); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 text-left"
              >
                <Settings className="w-4 h-4 text-slate-500" />
                Settings
              </button>
              <button
                type="button"
                onClick={() => { setMenuOpen(false); onSignOut(); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 text-left"
              >
                <LogOut className="w-4 h-4 text-slate-500" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
