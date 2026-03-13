import React, { useEffect, useMemo, useState } from 'react';
import { Mail, User, Shield, Building2, Save, Eye, Edit2, Image, AlertTriangle } from 'lucide-react';
import { AUTH_EMAIL_KEY } from './LoginView';
import { useAppData } from '../context/AppDataContext';
import type { Company } from '../types';

function emptyCompany(): Company {
  return {
    id: '',
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
    logoFileName: '',
    updatedAt: new Date().toISOString(),
  };
}

export const SettingsView: React.FC = () => {
  const { state, setCompany } = useAppData();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    state.company?.id ?? state.companies[0]?.id ?? null,
  );
  const [mode, setMode] = useState<'view' | 'edit' | 'create'>(
    (state.company || state.companies[0]) ? 'view' : 'create',
  );
  const [companyForm, setCompanyForm] = useState<Company>(() => state.company ?? state.companies[0] ?? emptyCompany());
  const [companySaved, setCompanySaved] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loggedInEmail = typeof window !== 'undefined' ? sessionStorage.getItem(AUTH_EMAIL_KEY) || '' : '';

  const displayName = loggedInEmail === 'thetugian@gmail.com'
    ? 'The Tu Gian'
    : loggedInEmail === 'uzzielt@techehealthservices.com'
      ? 'Uzzielt (Teche Health Services)'
      : loggedInEmail || 'Signed-in user';

  const accountRole = loggedInEmail === 'uzzielt@techehealthservices.com'
    ? 'Teche Health Services'
    : 'SFM User';

  const companiesSorted = useMemo(
    () =>
      [...state.companies].sort((a, b) => {
        const aDate = a.createdAt ?? a.updatedAt;
        const bDate = b.createdAt ?? b.updatedAt;
        return aDate < bDate ? 1 : -1;
      }),
    [state.companies],
  );

  const selectedCompany = useMemo(
    () =>
      (selectedCompanyId && state.companies.find((c) => c.id === selectedCompanyId)) ||
      state.company ||
      state.companies[0] ||
      null,
    [selectedCompanyId, state.companies, state.company],
  );

  useEffect(() => {
    if (mode === 'create') {
      setCompanyForm(emptyCompany());
      return;
    }
    if (selectedCompany) {
      setCompanyForm(selectedCompany);
    } else if (state.company || state.companies[0]) {
      setCompanyForm(state.company ?? state.companies[0] ?? emptyCompany());
    }
  }, [mode, selectedCompany, state.company, state.companies]);

  const updateCompany = (patch: Partial<Company>) => {
    setCompanyForm((prev) => ({ ...prev, ...patch }));
    setCompanySaved(false);
    setFormError(null);
  };

  const saveCompany = () => {
    const trimmedName = (companyForm.name || '').trim();
    if (!trimmedName) {
      setFormError('Company name is required.');
      return;
    }
    const duplicate = state.companies.find(
      (c) => c.id !== companyForm.id && c.name.trim().toLowerCase() === trimmedName.toLowerCase(),
    );
    if (duplicate) {
      setFormError('A company with this name already exists.');
      return;
    }

    const toSave: Company = {
      ...companyForm,
      name: trimmedName,
      updatedAt: new Date().toISOString(),
    };

    setCompany(toSave);
    setCompanySaved(true);
    setFormError(null);
    setMode('view');
    if (toSave.id) {
      setSelectedCompanyId(toSave.id);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Settings</h1>
        <p className="mt-1 text-slate-500 text-sm">
          Manage your account and company profile.
        </p>
        <div className="mt-6 h-px bg-slate-200" />
      </header>

      <section className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Companies list */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Companies
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  View and manage all companies on this account.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMode('create');
                  setCompanyForm(emptyCompany());
                  setFormError(null);
                  setCompanySaved(false);
                  setSelectedCompanyId(null);
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Building2 className="w-4 h-4" />
                New company
              </button>
            </div>
            {companiesSorted.length === 0 ? (
              <div className="px-5 py-6 text-sm text-slate-500">
                No companies yet. Create your first company to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Company
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Address
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Email
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Date created
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {companiesSorted.map((company) => {
                      const isActive = selectedCompany && company.id === selectedCompany.id;
                      const created = company.createdAt ?? company.updatedAt;
                      const addressParts = [
                        company.addressLine1,
                        company.addressLine2,
                        [company.city, company.province].filter(Boolean).join(', '),
                        company.postalCode,
                      ].filter(Boolean);
                      const address = addressParts.join(', ');
                      return (
                        <tr key={company.id} className={isActive ? 'bg-primary/5' : undefined}>
                          <td className="px-4 py-3 align-top">
                            <div className="flex flex-col">
                              <span className="font-semibold text-slate-900">{company.name || 'Untitled company'}</span>
                              {company.legalName && (
                                <span className="text-xs text-slate-500">{company.legalName}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 align-top text-slate-700">
                            {address || '—'}
                          </td>
                          <td className="px-4 py-3 align-top text-slate-700">
                            {company.email || '—'}
                          </td>
                          <td className="px-4 py-3 align-top text-slate-700 whitespace-nowrap">
                            {created ? new Date(created).toLocaleDateString('en-CA') : '—'}
                          </td>
                          <td className="px-4 py-3 align-top">
                            <div className="flex justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCompanyId(company.id);
                                  setMode('view');
                                  setFormError(null);
                                  setCompanySaved(false);
                                }}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 text-xs text-slate-700 hover:bg-slate-50"
                              >
                                <Eye className="w-3 h-3" />
                                View
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedCompanyId(company.id);
                                  setMode('edit');
                                  setCompanyForm(company);
                                  setFormError(null);
                                  setCompanySaved(false);
                                }}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-slate-200 text-xs text-slate-700 hover:bg-slate-50"
                              >
                                <Edit2 className="w-3 h-3" />
                                Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Company detail / edit panel */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {mode === 'create' ? 'New company' : mode === 'edit' ? 'Edit company' : 'Company profile'}
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  {mode === 'view'
                    ? 'View details for the selected company.'
                    : 'Update the business details used across your dashboard.'}
                </p>
              </div>
              {mode === 'view' && selectedCompany && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Use Edit to change company information.</span>
                </div>
              )}
            </div>

            {mode === 'view' && selectedCompany ? (
              <div className="p-5 sm:p-6 space-y-3 text-sm text-slate-700">
                <p>
                  <span className="font-semibold">Company name:</span>{' '}
                  {selectedCompany.name || 'Untitled company'}
                </p>
                {selectedCompany.legalName && (
                  <p>
                    <span className="font-semibold">Legal name:</span> {selectedCompany.legalName}
                  </p>
                )}
                <p>
                  <span className="font-semibold">Address:</span>{' '}
                  {[
                    selectedCompany.addressLine1,
                    selectedCompany.addressLine2,
                    [selectedCompany.city, selectedCompany.province].filter(Boolean).join(', '),
                    selectedCompany.postalCode,
                    selectedCompany.country,
                  ]
                    .filter(Boolean)
                    .join(', ') || '—'}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {selectedCompany.email || '—'}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {selectedCompany.phone || '—'}
                </p>
                <p>
                  <span className="font-semibold">Website:</span> {selectedCompany.website || '—'}
                </p>
                <p>
                  <span className="font-semibold">Tax ID:</span> {selectedCompany.taxId || '—'}
                </p>
                <p>
                  <span className="font-semibold">Created:</span>{' '}
                  {(selectedCompany.createdAt &&
                    new Date(selectedCompany.createdAt).toLocaleString('en-CA')) ||
                    '—'}
                </p>
                <p>
                  <span className="font-semibold">Last updated:</span>{' '}
                  {selectedCompany.updatedAt
                    ? new Date(selectedCompany.updatedAt).toLocaleString('en-CA')
                    : '—'}
                </p>
              </div>
            ) : (
              <div className="p-5 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label htmlFor="company-name" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Company name</label>
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
                    <label htmlFor="company-address1" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Billing address</label>
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
                    <input
                      id="company-address2"
                      type="text"
                      value={companyForm.addressLine2 ?? ''}
                      onChange={(e) => updateCompany({ addressLine2: e.target.value })}
                      placeholder="Suite, unit, etc. (optional)"
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
                    <label htmlFor="company-phone" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">Phone number</label>
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
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                      Logo (optional)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          updateCompany({ logoFileName: file.name });
                        }}
                        className="text-xs text-slate-600 file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-slate-100 file:text-slate-700 file:text-xs hover:file:bg-slate-200"
                      />
                      {companyForm.logoFileName && (
                        <div className="flex items-center gap-1 text-xs text-slate-600">
                          <Image className="w-3 h-3" />
                          <span className="truncate max-w-[160px]">
                            {companyForm.logoFileName}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {formError && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    {formError}
                  </p>
                )}
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <AlertTriangle className="w-3 h-3" />
                    <span>Changes apply to this company only.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(mode === 'edit' || mode === 'create') && (
                      <button
                        type="button"
                        onClick={() => {
                          if (mode === 'create' && !selectedCompany) {
                            setCompanyForm(emptyCompany());
                          } else if (selectedCompany) {
                            setCompanyForm(selectedCompany);
                          }
                          setFormError(null);
                          setCompanySaved(false);
                          setMode(selectedCompany ? 'view' : 'create');
                        }}
                        className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={saveCompany}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-slate-900 font-bold text-xs sm:text-sm btn-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    >
                      <Save className="w-4 h-4" />
                      {mode === 'create' ? 'Create company' : 'Save changes'}
                    </button>
                  </div>
                </div>
                {companySaved && !formError && (
                  <p className="text-xs text-slate-500 mt-2">Company saved successfully.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Account & Security sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>
      </section>
    </div>
  );
};

