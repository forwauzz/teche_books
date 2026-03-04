import React from 'react';
import { Mail, User, Shield, Building2 } from 'lucide-react';
import { AUTH_EMAIL_KEY } from './LoginView';

export const SettingsView: React.FC = () => {
  const loggedInEmail = typeof window !== 'undefined' ? sessionStorage.getItem(AUTH_EMAIL_KEY) || '' : '';

  const displayName = loggedInEmail === 'thetugian@gmail.com'
    ? 'The Tu Gian'
    : loggedInEmail === 'uzzielt@techehealthservices.com'
      ? 'Uzzielt (Teche Health Services)'
      : loggedInEmail || 'Signed-in user';

  const accountRole = loggedInEmail === 'uzzielt@techehealthservices.com'
    ? 'Teche Health Services'
    : 'SFM User';

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <header className="mb-10">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Settings</h1>
        <p className="mt-1 text-slate-500 text-sm">
          Manage your account and preferences for Service Finance Manager.
        </p>
        <div className="mt-6 h-px bg-slate-200" />
      </header>

      <section className="space-y-6">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
            Account
          </h2>
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              <div className="flex items-start gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <User className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Display name</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-900">{displayName}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Email address</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-900 break-all">{loggedInEmail || '—'}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Account type</p>
                  <p className="mt-0.5 text-sm font-semibold text-slate-900">{accountRole}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
            Security
          </h2>
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-start gap-4 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Shield className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">Session</p>
                <p className="mt-1 text-sm text-slate-500">
                  You are signed in to this device. Use Sign out in the header to end your session securely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
