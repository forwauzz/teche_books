import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
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
      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
          <Settings className="w-5 h-5" />
        </button>
        <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden border border-slate-300">
          <img 
            alt="Avatar" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMt9vA6kd3Ai3ZgIRAQ1kaOE9Iqf85XsYZ9_dtjZFeQw_eXjzHqNVDZNspEydmAmYpMoZmAnnKl4j2jgoY622VtqiOPPNjqx3ti2n9d8gQOrPQ399dHsDT4rbDV0XgxXG2-J62s2LvhxUjjh1ce-7MxcCBty-JTY9IOZwtnfnj0d9CdP2rV55InQb-3Vj5DQbjMIC7kYe7u8KMF7-kav6ffqXAGpCSCVYH9PLxcf0TllC3cKZYQEp_WYZnZMyDud57B8aO1ve4lg"
          />
        </div>
      </div>
    </header>
  );
};
