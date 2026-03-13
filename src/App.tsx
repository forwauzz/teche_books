/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { InvoicesView } from './components/InvoicesView';
import { CreateInvoiceView } from './components/CreateInvoiceView';
import { ExpensesView } from './components/ExpensesView';
import { ClientsView } from './components/ClientsView';
import { VaultView } from './components/VaultView';
import { AccountantView } from './components/AccountantView';
import { ProjectionsView } from './components/ProjectionsView';
import { LoginView } from './components/LoginView';
import { SettingsView } from './components/SettingsView';
import { View } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { useAppData } from './context/AppDataContext';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { state, activeCompanyId } = useAppData();

  useEffect(() => {
    if (sessionStorage.getItem('sfm-auth-logged-in') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleViewChange = (view: View) => {
    setCurrentView(view);
    setSidebarOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <LoginView
        onAuthenticated={() => {
          sessionStorage.setItem('sfm-auth-logged-in', 'true');
          setIsAuthenticated(true);
        }}
      />
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'invoices':
        return <InvoicesView onCreateInvoice={() => setCurrentView('create-invoice')} />;
      case 'create-invoice':
        return (
          <CreateInvoiceView
            onDone={() => setCurrentView('invoices')}
            onNavigateToClients={() => setCurrentView('clients')}
            onNavigateToSettings={() => setCurrentView('settings')}
          />
        );
      case 'expenses':
        return <ExpensesView />;
      case 'clients':
        return <ClientsView />;
      case 'vault':
        return <VaultView />;
      case 'accountant':
        return <AccountantView />;
      case 'projections':
        return <ProjectionsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case 'dashboard': return 'Dashboard Overview';
      case 'invoices': return 'Invoices';
      case 'create-invoice': return 'Create Invoice';
      case 'expenses': return 'Expenses';
      case 'clients': return 'Clients';
      case 'vault': return 'Tax Vault';
      case 'accountant': return 'Accountant';
      case 'projections': return 'Projections';
      case 'settings': return 'Settings';
      default: return 'SFM Manager';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Sidebar
        currentView={currentView}
        onViewChange={handleViewChange}
        isOpen={sidebarOpen}
        onOpen={() => setSidebarOpen(true)}
        onClose={() => setSidebarOpen(false)}
      />
      
      <main id="main-content" className="flex-1 flex flex-col overflow-hidden min-w-0" role="main">
        {!activeCompanyId && currentView !== 'settings' && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm text-amber-800 font-medium">
              Select or create a company to view and manage data.
            </p>
            <button
              type="button"
              onClick={() => handleViewChange('settings')}
              className="text-sm font-bold text-amber-800 underline hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
            >
              Go to Settings
            </button>
          </div>
        )}
        {currentView !== 'vault' && currentView !== 'expenses' && currentView !== 'create-invoice' && (
          <Header
            title={getTitle()}
            onOpenSettings={() => setCurrentView('settings')}
            onSignOut={() => {
              sessionStorage.removeItem('sfm-auth-logged-in');
              sessionStorage.removeItem('sfm-auth-email');
              setIsAuthenticated(false);
            }}
            onOpenMenu={() => setSidebarOpen(true)}
          />
        )}
        
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="border-t border-slate-200 bg-white py-4 px-4 sm:px-10 text-center shrink-0" role="contentinfo">
          <p className="text-slate-500 text-xs">© 2024 Service Finance Manager (SFM). All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
