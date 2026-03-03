/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { InvoicesView } from './components/InvoicesView';
import { CreateInvoiceView } from './components/CreateInvoiceView';
import { ExpensesView } from './components/ExpensesView';
import { ClientsView } from './components/ClientsView';
import { VaultView } from './components/VaultView';
import { AccountantView } from './components/AccountantView';
import { View } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'invoices':
        return <InvoicesView onCreateInvoice={() => setCurrentView('create-invoice')} />;
      case 'create-invoice':
        return <CreateInvoiceView onDone={() => setCurrentView('invoices')} />;
      case 'expenses':
        return <ExpensesView />;
      case 'clients':
        return <ClientsView />;
      case 'vault':
        return <VaultView />;
      case 'accountant':
        return <AccountantView />;
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
      default: return 'SFM Manager';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        {currentView !== 'vault' && currentView !== 'expenses' && currentView !== 'create-invoice' && (
          <Header title={getTitle()} />
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

        <footer className="border-t border-slate-200 bg-white py-4 px-10 text-center shrink-0">
          <p className="text-slate-500 text-xs">© 2024 Service Finance Manager (SFM). All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
