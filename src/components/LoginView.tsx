import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface LoginViewProps {
  onAuthenticated: () => void;
}

const AUTH_EMAILS = ['thetugian@gmail.com', 'uzzielt@techehealthservices.com'];
const AUTH_PASSWORD = 'Techeservice';
const AUTH_STORAGE_KEY = 'sfm-auth-logged-in';
export const AUTH_EMAIL_KEY = 'sfm-auth-email';

export const LoginView: React.FC<LoginViewProps> = ({ onAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (AUTH_EMAILS.map((value) => value.toLowerCase()).includes(trimmed) && password === AUTH_PASSWORD) {
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      sessionStorage.setItem(AUTH_EMAIL_KEY, trimmed);
      onAuthenticated();
      setError('');
      return;
    }
    setError('Invalid email or password.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light px-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">Sign in to SFM</h1>
            <p className="text-xs text-slate-500">Secure access to your finance dashboard.</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Email</label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (error) setError('');
              }}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (error) setError('');
              }}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            className="w-full h-10 rounded-lg bg-primary text-slate-900 font-bold text-sm btn-primary"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};
