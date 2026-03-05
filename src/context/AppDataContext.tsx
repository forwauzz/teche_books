import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import {
  Client,
  Expense,
  Invoice,
  InvoiceStatus,
  Projection,
  VaultDocument,
  VaultFolder,
} from '../types';

const STORAGE_KEY = 'sfm-app-state-v2';

export interface AppDataState {
  invoices: Invoice[];
  expenses: Expense[];
  clients: Client[];
  vaultFolders: VaultFolder[];
  vaultDocuments: VaultDocument[];
  projections: Projection[];
}

type UpsertInvoicePayload = Omit<Invoice, 'updatedAt'> & { updatedAt?: string };
type UpsertExpensePayload = Omit<Expense, 'updatedAt'> & { updatedAt?: string };
type UpsertClientPayload = Omit<Client, 'updatedAt'> & { updatedAt?: string };
type UpsertProjectionPayload = Omit<Projection, 'updatedAt'> & { updatedAt?: string };

type Action =
  | { type: 'UPSERT_INVOICE'; payload: UpsertInvoicePayload }
  | { type: 'DELETE_INVOICE'; payload: string }
  | { type: 'SET_INVOICE_STATUS'; payload: { id: string; status: InvoiceStatus } }
  | { type: 'UPSERT_EXPENSE'; payload: UpsertExpensePayload }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'SET_EXPENSE_STATUS'; payload: { id: string; status: Expense['status'] } }
  | { type: 'UPSERT_CLIENT'; payload: UpsertClientPayload }
  | { type: 'DELETE_CLIENT'; payload: string }
  | { type: 'ADD_VAULT_FOLDER'; payload: VaultFolder }
  | { type: 'DELETE_VAULT_FOLDER'; payload: string }
  | { type: 'ADD_VAULT_DOCUMENT'; payload: VaultDocument }
  | { type: 'UPDATE_VAULT_DOCUMENT'; payload: VaultDocument }
  | { type: 'DELETE_VAULT_DOCUMENT'; payload: string }
  | { type: 'UPSERT_PROJECTION'; payload: UpsertProjectionPayload }
  | { type: 'DELETE_PROJECTION'; payload: string };

const defaultState: AppDataState = {
  invoices: [],
  expenses: [],
  clients: [],
  vaultFolders: [],
  vaultDocuments: [],
  projections: [],
};

function withTimestamp<T extends { updatedAt?: string }>(item: T): T & { updatedAt: string } {
  return { ...item, updatedAt: new Date().toISOString() };
}

function upsertById<T extends { id: string }>(list: T[], item: T): T[] {
  const exists = list.some((entry) => entry.id === item.id);
  if (!exists) return [item, ...list];
  return list.map((entry) => (entry.id === item.id ? item : entry));
}

function reducer(state: AppDataState, action: Action): AppDataState {
  switch (action.type) {
    case 'UPSERT_INVOICE': {
      const invoice = withTimestamp(action.payload);
      return { ...state, invoices: upsertById(state.invoices, invoice) };
    }
    case 'DELETE_INVOICE':
      return { ...state, invoices: state.invoices.filter((invoice) => invoice.id !== action.payload) };
    case 'SET_INVOICE_STATUS':
      return {
        ...state,
        invoices: state.invoices.map((invoice) =>
          invoice.id === action.payload.id
            ? { ...invoice, status: action.payload.status, updatedAt: new Date().toISOString() }
            : invoice,
        ),
      };
    case 'UPSERT_EXPENSE': {
      const expense = withTimestamp(action.payload);
      return { ...state, expenses: upsertById(state.expenses, expense) };
    }
    case 'DELETE_EXPENSE':
      return { ...state, expenses: state.expenses.filter((expense) => expense.id !== action.payload) };
    case 'SET_EXPENSE_STATUS':
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense.id === action.payload.id
            ? { ...expense, status: action.payload.status, updatedAt: new Date().toISOString() }
            : expense,
        ),
      };
    case 'UPSERT_CLIENT': {
      const client = withTimestamp(action.payload);
      return { ...state, clients: upsertById(state.clients, client) };
    }
    case 'DELETE_CLIENT':
      return { ...state, clients: state.clients.filter((client) => client.id !== action.payload) };
    case 'ADD_VAULT_FOLDER':
      return { ...state, vaultFolders: upsertById(state.vaultFolders, action.payload) };
    case 'DELETE_VAULT_FOLDER':
      return {
        ...state,
        vaultFolders: state.vaultFolders.filter((folder) => folder.id !== action.payload),
        vaultDocuments: state.vaultDocuments.filter((doc) => doc.folderId !== action.payload),
      };
    case 'ADD_VAULT_DOCUMENT':
      return { ...state, vaultDocuments: [action.payload, ...state.vaultDocuments] };
    case 'UPDATE_VAULT_DOCUMENT':
      return { ...state, vaultDocuments: upsertById(state.vaultDocuments, action.payload) };
    case 'DELETE_VAULT_DOCUMENT':
      return { ...state, vaultDocuments: state.vaultDocuments.filter((doc) => doc.id !== action.payload) };
    case 'UPSERT_PROJECTION': {
      const projection = withTimestamp(action.payload);
      return { ...state, projections: upsertById(state.projections, projection) };
    }
    case 'DELETE_PROJECTION':
      return { ...state, projections: state.projections.filter((p) => p.id !== action.payload) };
    default:
      return state;
  }
}

function loadInitialState(): AppDataState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as AppDataState;
    if (!parsed || !Array.isArray(parsed.invoices) || !Array.isArray(parsed.expenses) || !Array.isArray(parsed.clients)) {
      return defaultState;
    }
    return {
      ...defaultState,
      ...parsed,
      vaultFolders: Array.isArray(parsed.vaultFolders) ? parsed.vaultFolders : defaultState.vaultFolders,
      vaultDocuments: Array.isArray(parsed.vaultDocuments) ? parsed.vaultDocuments : defaultState.vaultDocuments,
      projections: Array.isArray(parsed.projections) ? parsed.projections : defaultState.projections,
    };
  } catch {
    return defaultState;
  }
}

type AppDataContextValue = {
  state: AppDataState;
  upsertInvoice: (invoice: UpsertInvoicePayload) => void;
  deleteInvoice: (id: string) => void;
  setInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  upsertExpense: (expense: UpsertExpensePayload) => void;
  deleteExpense: (id: string) => void;
  setExpenseStatus: (id: string, status: Expense['status']) => void;
  upsertClient: (client: UpsertClientPayload) => void;
  deleteClient: (id: string) => void;
  addVaultFolder: (folder: VaultFolder) => void;
  deleteVaultFolder: (id: string) => void;
  addVaultDocument: (document: VaultDocument) => void;
  updateVaultDocument: (document: VaultDocument) => void;
  deleteVaultDocument: (id: string) => void;
  upsertProjection: (projection: UpsertProjectionPayload) => void;
  deleteProjection: (id: string) => void;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultState, loadInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<AppDataContextValue>(
    () => ({
      state,
      upsertInvoice: (invoice) => dispatch({ type: 'UPSERT_INVOICE', payload: invoice }),
      deleteInvoice: (id) => dispatch({ type: 'DELETE_INVOICE', payload: id }),
      setInvoiceStatus: (id, status) => dispatch({ type: 'SET_INVOICE_STATUS', payload: { id, status } }),
      upsertExpense: (expense) => dispatch({ type: 'UPSERT_EXPENSE', payload: expense }),
      deleteExpense: (id) => dispatch({ type: 'DELETE_EXPENSE', payload: id }),
      setExpenseStatus: (id, status) => dispatch({ type: 'SET_EXPENSE_STATUS', payload: { id, status } }),
      upsertClient: (client) => dispatch({ type: 'UPSERT_CLIENT', payload: client }),
      deleteClient: (id) => dispatch({ type: 'DELETE_CLIENT', payload: id }),
      addVaultFolder: (folder) => dispatch({ type: 'ADD_VAULT_FOLDER', payload: folder }),
      deleteVaultFolder: (id) => dispatch({ type: 'DELETE_VAULT_FOLDER', payload: id }),
      addVaultDocument: (document) => dispatch({ type: 'ADD_VAULT_DOCUMENT', payload: document }),
      updateVaultDocument: (document) => dispatch({ type: 'UPDATE_VAULT_DOCUMENT', payload: document }),
      deleteVaultDocument: (id) => dispatch({ type: 'DELETE_VAULT_DOCUMENT', payload: id }),
      upsertProjection: (projection) => dispatch({ type: 'UPSERT_PROJECTION', payload: projection }),
      deleteProjection: (id) => dispatch({ type: 'DELETE_PROJECTION', payload: id }),
    }),
    [state],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
};

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used inside AppDataProvider');
  }
  return context;
}

export function makeId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function toTitleDate(isoDate: string) {
  if (!isoDate) return '-';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString('en-CA', { month: 'short', day: '2-digit', year: 'numeric' });
}

