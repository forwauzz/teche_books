import React, { useEffect, useRef, useState } from 'react';
import { LogOut, Search, Bell, Settings } from 'lucide-react';
import { AUTH_EMAIL_KEY } from './LoginView';

interface HeaderProps {
  title: string;
  onOpenSettings: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onOpenSettings, onSignOut }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

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
    <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            className="w-full bg-slate-100 border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary"
            placeholder="Search transactions..."
            type="text"
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
            className="max-w-xs flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-expanded={menuOpen}
            aria-haspopup="true"
          >
            <span className="truncate">
              {userEmail || 'Account'}
            </span>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 py-1 bg-white border border-slate-200 rounded-lg shadow-lg z-20">
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
