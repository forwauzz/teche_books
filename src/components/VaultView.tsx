import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight, FileText, Folder, Link2, Plus, Search, Trash2, UploadCloud } from 'lucide-react';
import { cn } from '../lib/utils';
import { makeId, toTitleDate, useAppData } from '../context/AppDataContext';
import { VaultDocument } from '../types';

export const VaultView: React.FC = () => {
  const { state, addVaultFolder, deleteVaultFolder, addVaultDocument, deleteVaultDocument, updateVaultDocument } = useAppData();
  const [selectedFolderId, setSelectedFolderId] = useState(state.vaultFolders[0]?.id ?? '');
  const [folderName, setFolderName] = useState('');
  const [folderError, setFolderError] = useState('');
  const [query, setQuery] = useState('');
  const [draftDoc, setDraftDoc] = useState<VaultDocument | null>(null);

  const selectedFolder = state.vaultFolders.find((folder) => folder.id === selectedFolderId);

  const documents = useMemo(
    () =>
      state.vaultDocuments.filter((doc) => {
        const inFolder = doc.folderId === selectedFolderId;
        const q = query.toLowerCase();
        const byQuery = !q || doc.name.toLowerCase().includes(q) || doc.type.toLowerCase().includes(q) || (doc.linkedTransaction ?? '').toLowerCase().includes(q);
        return inFolder && byQuery;
      }),
    [query, selectedFolderId, state.vaultDocuments],
  );

  useEffect(() => {
    if (!selectedFolderId && state.vaultFolders.length > 0) {
      setSelectedFolderId(state.vaultFolders[0].id);
    }
  }, [selectedFolderId, state.vaultFolders]);

  const createFolder = (nameOverride?: string) => {
    const label = (nameOverride ?? folderName).trim();
    if (!label) {
      setFolderError('Folder name is required.');
      return;
    }
    setFolderError('');
    const yearMatch = label.match(/\d{4}/)?.[0] ?? `${new Date().getFullYear()}`;
    const folder = {
      id: makeId('folder'),
      label,
      year: yearMatch,
      isCurrent: false,
    };
    addVaultFolder(folder);
    setSelectedFolderId(folder.id);
    setFolderName('');
  };

  const createDocument = () => {
    if (!selectedFolderId) return;
    setDraftDoc({
      id: makeId('doc'),
      folderId: selectedFolderId,
      name: '',
      type: '',
      uploadDate: new Date().toISOString().slice(0, 10),
      linkedTransaction: '',
      size: '',
    });
  };

  const saveDocument = () => {
    if (!draftDoc || !draftDoc.name.trim()) return;
    const exists = state.vaultDocuments.some((doc) => doc.id === draftDoc.id);
    if (exists) {
      updateVaultDocument(draftDoc);
    } else {
      addVaultDocument(draftDoc);
    }
    setDraftDoc(null);
  };

  const removeFolder = (folderId: string, folderLabel: string) => {
    const isLastFolder = state.vaultFolders.length <= 1;
    if (isLastFolder) {
      setFolderError('You need at least one folder.');
      return;
    }

    const linkedDocs = state.vaultDocuments.filter((doc) => doc.folderId === folderId).length;
    const confirmed = window.confirm(
      linkedDocs > 0
        ? `Delete "${folderLabel}" and its ${linkedDocs} document(s)? This cannot be undone.`
        : `Delete "${folderLabel}"?`,
    );
    if (!confirmed) return;

    deleteVaultFolder(folderId);
    if (selectedFolderId === folderId) {
      const fallback = state.vaultFolders.find((folder) => folder.id !== folderId);
      setSelectedFolderId(fallback?.id ?? '');
    }
  };

  return (
    <div className="flex flex-1">
      <aside className="w-72 border-r border-emerald-100 p-4 flex flex-col gap-4 bg-white">
        <div className="flex flex-col">
          <h1 className="text-slate-900 text-base font-bold">Secure Vault</h1>
          <p className="text-emerald-600 text-xs font-medium uppercase tracking-wider mt-1">Storage Management</p>
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-emerald-600/70 uppercase">Folders</p>
          {state.vaultFolders.map((folder) => (
            <div
              key={folder.id}
              className={cn('w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors', selectedFolderId === folder.id ? 'bg-primary/10 text-emerald-900' : 'hover:bg-emerald-50')}
            >
              <button onClick={() => setSelectedFolderId(folder.id)} className="flex-1 min-w-0 text-left flex items-center gap-3">
                <Folder className={cn('w-4 h-4 shrink-0', selectedFolderId === folder.id ? 'text-primary' : 'text-emerald-600')} />
                <span className="text-sm font-medium truncate">{folder.label}</span>
              </button>
              {folder.isCurrent && <span className="text-[10px] bg-primary/20 px-1.5 py-0.5 rounded text-emerald-800">Current</span>}
              <button
                onClick={() => removeFolder(folder.id, folder.label)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded p-0.5 transition-colors"
                aria-label={`Delete ${folder.label}`}
                title="Delete folder"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="pt-2 border-t border-emerald-100 space-y-2">
          <input
            value={folderName}
            onChange={(event) => {
              setFolderName(event.target.value);
              if (folderError) setFolderError('');
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') createFolder();
            }}
            placeholder="New folder name"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          {folderError && <p className="text-xs text-red-600">{folderError}</p>}
          <button
            onClick={() => createFolder()}
            disabled={!folderName.trim()}
            className="w-full rounded-lg bg-primary py-2 text-sm font-bold text-slate-900 inline-flex items-center justify-center gap-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" /> Create Folder
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-white">
        <div className="flex items-center gap-2 px-8 py-4 text-sm font-medium">
          <span className="text-emerald-600">Financial Documents</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900">{selectedFolder?.label ?? 'No Folder Selected'}</span>
        </div>

        <div className="px-8 pb-8 flex flex-col gap-6">
          <div className="flex flex-wrap justify-between items-end gap-3">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-black tracking-tight text-slate-900">{selectedFolder?.label ?? 'Documents'}</h1>
              <p className="text-emerald-600 text-sm">Upload, edit metadata, and link transactions for tax records.</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => createFolder(`Tax Year ${new Date().getFullYear()}`)}
                className="flex items-center gap-2 rounded-lg h-10 px-4 border border-emerald-200 text-emerald-900 text-sm font-bold bg-emerald-50 hover:bg-emerald-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Folder
              </button>
              <button onClick={createDocument} className="flex items-center gap-2 rounded-lg h-10 px-4 bg-primary text-emerald-950 text-sm font-bold btn-primary">
                <Plus className="w-4 h-4" />
                New Document
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-sm" placeholder="Search document name, type, or linked txn..." />
          </div>

          {draftDoc && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-6 gap-2">
              <input value={draftDoc.name} onChange={(event) => setDraftDoc({ ...draftDoc, name: event.target.value })} placeholder="Document name" className="rounded border border-slate-200 px-2 py-2 text-sm md:col-span-2" />
              <input value={draftDoc.type} onChange={(event) => setDraftDoc({ ...draftDoc, type: event.target.value })} placeholder="Type" className="rounded border border-slate-200 px-2 py-2 text-sm" />
              <input value={draftDoc.uploadDate} type="date" onChange={(event) => setDraftDoc({ ...draftDoc, uploadDate: event.target.value })} className="rounded border border-slate-200 px-2 py-2 text-sm" />
              <input value={draftDoc.linkedTransaction ?? ''} onChange={(event) => setDraftDoc({ ...draftDoc, linkedTransaction: event.target.value })} placeholder="Linked txn" className="rounded border border-slate-200 px-2 py-2 text-sm" />
              <input value={draftDoc.size} onChange={(event) => setDraftDoc({ ...draftDoc, size: event.target.value })} placeholder="Size (e.g. 1.2 MB)" className="rounded border border-slate-200 px-2 py-2 text-sm" />
              <div className="md:col-span-6 flex justify-end gap-2">
                <button onClick={() => setDraftDoc(null)} className="px-3 py-2 text-sm rounded border border-slate-200 btn-outline transition-colors">
                  Cancel
                </button>
                <button onClick={saveDocument} className="px-3 py-2 text-sm rounded bg-primary font-bold text-slate-900 inline-flex items-center gap-1 btn-primary">
                  <UploadCloud className="w-4 h-4" /> Save Document
                </button>
              </div>
            </div>
          )}

          <div className="bg-white border border-emerald-100 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-emerald-50/50 text-xs font-bold uppercase text-emerald-800">
                  <th className="px-6 py-4">Document Name</th>
                  <th className="px-6 py-4">Upload Date</th>
                  <th className="px-6 py-4">Linked Transaction</th>
                  <th className="px-6 py-4">Size</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-emerald-50/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded flex items-center justify-center bg-red-100">
                          <FileText className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{doc.name}</p>
                          <p className="text-xs text-slate-500">{doc.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{toTitleDate(doc.uploadDate)}</td>
                    <td className="px-6 py-4">
                      {doc.linkedTransaction ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          <Link2 className="w-3 h-3" />
                          {doc.linkedTransaction}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400 italic">Unlinked</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{doc.size || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setDraftDoc(doc)} className="text-slate-400 hover:text-primary transition-colors text-sm mr-3">
                        Edit
                      </button>
                      <button onClick={() => deleteVaultDocument(doc.id)} className="text-red-500 hover:text-red-700 transition-colors">
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
                {documents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-500">
                      No documents found in this folder.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="px-6 py-4 border-t border-emerald-50 bg-emerald-50/20">
              <p className="text-xs text-slate-500 font-medium">Showing {documents.length} document(s)</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
