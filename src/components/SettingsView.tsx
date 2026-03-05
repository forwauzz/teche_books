import React, { useEffect, useState } from 'react';
import { Mail, User, Shield, Building2, Save } from 'lucide-react';
import { AUTH_EMAIL_KEY } from './LoginView';
import { useAppData } from '../context/AppDataContext';
import type { Company } from '../types';

const COMPANY_ID = 'company';

function emptyCompany(): Company {
  return {
    id: COMPANY_ID,
    name: '',
    legalName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Canada',
    phone: '',
    email: '',
    website: '',
    taxId: '',
    updatedAt: new Date().toISOString(),
  };
}

export const SettingsView: React.FC = () => {
  const { state, setCompany } = useAppData();
  const [companyForm, setCompanyForm] = useState<Company>(() => state.company ?? emptyCompany());
  const [companySaved, setCompanySaved] = useState(false);

  useEffect(() => {
    setCompanyForm(state.company ?? emptyCompany());
  }, [state.company]);

  const loggedInEmail = typeof window !== 'undefined' ? sessionStorage.getItem(AUTH_EMAIL_KEY) || '' : '';

  const displayName = loggedInEmail === 'thetugian@gmail.com'
    ? 'The Tu Gian'
    : loggedInEmail === 'uzzielt@techehealthservices.com'
      ? 'Uzzielt (Teche Health Services)'
      : loggedInEmail || 'Signed-in user';

  const accountRole = loggedInEmail === 'uzzielt@techehealthservices.com'
    ? 'Teche Health Services'
    : 'SFM User';

  const updateCompany = (patch: Partial<Company>) => {
    setCompanyForm((prev) => ({ ...prev, ...patch }));
    setCompanySaved(false);
  };

  const saveCompany = () => {
    const toSave: Company = {
      ...companyForm,
      id: COMPANY_ID,
      updatedAt: new Date().toISOString(),
    };
    setCompany(toSave);
    setCompanySaved(true);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto">
      <header className="mb-10">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Settings</h1>
        <p className="mt-1 text-slate-500 text-sm">
          Manage your account and company profile. Company details appear on invoices (like QuickBooks).
        </p>
        <div className="mt-6 h-px bg-slate-200" />
      </header>

      <section className="space-y-6">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
            Company profile
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            This is your business information shown as &quot;From&quot; on invoices and in reports.
          </p>
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-5 sm:p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="company-name" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Business name</label>
                <input
                  id="company-name"
                  type="text"
                  value={companyForm.name}
                  onChange={(e) => updateCompany({ name: e.target.value })}
                  placeholder="e.g. Acme Services Inc."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="company-legal" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Legal name (optional)</label>
                <input
                  id="company-legal"
                  type="text"
                  value={companyForm.legalName ?? ''}
                  onChange={(e) => updateCompany({ legalName: e.target.value })}
                  placeholder="Legal entity name for contracts/tax"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="company-address1" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Address line 1</label>
                <input
                  id="company-address1"
                  type="text"
                  value={companyForm.addressLine1 ?? ''}
                  onChange={(e) => updateCompany({ addressLine1: e.target.value })}
                  placeholder="Street address"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="company-address2" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Address line 2 (optional)</label>
                <input
                  id="company-address2"
                  type="text"
                  value={companyForm.addressLine2 ?? ''}
                  onChange={(e) => updateCompany({ addressLine2: e.target.value })}
                  placeholder="Suite, unit, etc."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="company-city" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">City</label>
                <input
                  id="company-city"
                  type="text"
                  value={companyForm.city ?? ''}
                  onChange={(e) => updateCompany({ city: e.target.value })}
                  placeholder="City"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="company-province" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Province / State</label>
                <input
                  id="company-province"
                  type="text"
                  value={companyForm.province ?? ''}
                  onChange={(e) => updateCompany({ province: e.target.value })}
                  placeholder="ON"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="company-postal" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Postal code</label>
                <input
                  id="company-postal"
                  type="text"
                  value={companyForm.postalCode ?? ''}
                  onChange={(e) => updateCompany({ postalCode: e.target.value })}
                  placeholder="A1A 1A1"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="company-country" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Country</label>
                <input
                  id="company-country"
                  type="text"
                  value={companyForm.country ?? ''}
                  onChange={(e) => updateCompany({ country: e.target.value })}
                  placeholder="Canada"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="company-phone" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Phone</label>
                <input
                  id="company-phone"
                  type="tel"
                  value={companyForm.phone ?? ''}
                  onChange={(e) => updateCompany({ phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="company-email" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Email</label>
                <input
                  id="company-email"
                  type="email"
                  value={companyForm.email ?? ''}
                  onChange={(e) => updateCompany({ email: e.target.value })}
                  placeholder="billing@company.com"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="company-website" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Website (optional)</label>
                <input
                  id="company-website"
                  type="url"
                  value={companyForm.website ?? ''}
                  onChange={(e) => updateCompany({ website: e.target.value })}
                  placeholder="https://"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="company-taxid" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Tax ID / GST number (optional)</label>
                <input
                  id="company-taxid"
                  type="text"
                  value={companyForm.taxId ?? ''}
                  onChange={(e) => updateCompany({ taxId: e.target.value })}
                  placeholder="123456789 RT0001"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={saveCompany}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-slate-900 font-bold text-sm btn-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <Save className="w-4 h-4" />
                Save company profile
              </button>
              {companySaved && <span className="text-sm text-slate-500">Saved.</span>}
            </div>
          </div>
        </div>

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
