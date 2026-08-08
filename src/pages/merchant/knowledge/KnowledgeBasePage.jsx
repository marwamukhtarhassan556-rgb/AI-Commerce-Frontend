import { useEffect, useState } from 'react';
import { Bot, CheckCircle2, FileText, Pencil, Search, Sparkles, Trash2, Upload, X } from 'lucide-react';
import { knowledgeApi } from '../../../api/integrationApi';

/* Loading remote knowledge data updates component state from an effect. */
/* eslint-disable react-hooks/set-state-in-effect */

const errorMessage = (error, fallback) => {
  if (error.response?.status === 401) return 'AI service authentication failed. Please sign in again after the AI token is configured.';
  return error.response?.data?.detail || error.response?.data?.message || fallback;
};

export default function KnowledgeBasePage() {
  const storeId = localStorage.getItem('currentStoreId') || localStorage.getItem('storeId');
  const organizationId = localStorage.getItem('organizationId') || localStorage.getItem('orgId');
  const uploadedBy = localStorage.getItem('userId') || localStorage.getItem('userEmail');
  const [documents, setDocuments] = useState([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(Boolean(storeId));
  const [busy, setBusy] = useState('');
  const [message, setMessage] = useState(storeId ? '' : 'Select a store before managing its AI knowledge.');
  const [messageType, setMessageType] = useState(storeId ? 'error' : 'error');
  const [editingDocument, setEditingDocument] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });
  const [deletingDocument, setDeletingDocument] = useState(null);

  const loadDocuments = async () => {
    if (!storeId) return;
    setLoading(true); setMessage('');
    try {
      const { data } = await knowledgeApi.listDocuments(storeId);
      setDocuments(Array.isArray(data) ? data : data?.items || []);
    } catch (error) { setMessageType('error'); setMessage(errorMessage(error, 'Knowledge-base documents could not be loaded.')); }
    finally { setLoading(false); }
  };

  // loadDocuments intentionally refreshes only when the selected store changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { void loadDocuments(); }, [storeId]);

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !storeId || !organizationId || !uploadedBy) return;
    setBusy('upload'); setMessage('');
    try {
      const { data: uploadedDocument } = await knowledgeApi.upload(file, { storeId, organizationId, uploadedBy });
      const documentId = uploadedDocument?.document_id || uploadedDocument?.id;
      const filePath = uploadedDocument?.file_path || uploadedDocument?.storage_path || uploadedDocument?.path;
      if (!documentId || !filePath) throw new Error('Upload completed without the document metadata required for processing.');
      await knowledgeApi.processDocument({ documentId, filePath, mimeType: uploadedDocument?.mime_type || file.type });
      await loadDocuments();
      setMessageType('success'); setMessage('Document uploaded. Processing may take a few moments.');
    } catch (error) { setMessageType('error'); setMessage(errorMessage(error, 'Document upload failed.')); }
    finally { setBusy(''); event.target.value = ''; }
  };

  const generateSummary = async () => {
    if (!storeId) return;
    setBusy('summary'); setMessage('');
    try {
      const { data } = await knowledgeApi.generateSummary(storeId);
      setSummary(data);
    } catch (error) { setMessageType('error'); setMessage(errorMessage(error, 'Business summary could not be generated.')); }
    finally { setBusy(''); }
  };

  const search = async (event) => {
    event.preventDefault();
    if (!query.trim() || !storeId) return;
    setBusy('search'); setMessage('');
    try {
      const { data } = await knowledgeApi.search({ query, storeId });
      setResults(data?.results || []);
    } catch (error) { setMessageType('error'); setMessage(errorMessage(error, 'Knowledge search could not be completed.')); }
    finally { setBusy(''); }
  };

  const openUpdate = (document) => {
    setEditingDocument(document);
    setEditForm({ title: document.title || document.filename || '', description: document.description || '' });
  };

  const updateDocument = async (event) => {
    event.preventDefault();
    const documentId = editingDocument?.id || editingDocument?.document_id;
    if (!documentId || !editForm.title.trim()) return;
    setBusy(`update-${documentId}`); setMessage('');
    try {
      await knowledgeApi.updateDocument(documentId, { store_id: storeId, title: editForm.title.trim(), description: editForm.description.trim() || null });
      setEditingDocument(null);
      await loadDocuments();
      setMessageType('success'); setMessage('Document updated successfully.');
    } catch (error) { setMessageType('error'); setMessage(errorMessage(error, 'Document could not be updated.')); }
    finally { setBusy(''); }
  };

  const deleteDocument = async () => {
    const documentId = deletingDocument?.id || deletingDocument?.document_id;
    if (!documentId) return;
    setBusy(`delete-${documentId}`); setMessage('');
    try {
      await knowledgeApi.deleteDocument(documentId);
      setDeletingDocument(null);
      await loadDocuments();
      setMessageType('success'); setMessage('Document deleted successfully.');
    } catch (error) { setMessageType('error'); setMessage(errorMessage(error, 'Document could not be deleted.')); }
    finally { setBusy(''); }
  };

  return <div className="mx-auto max-w-6xl space-y-6 p-6 lg:p-10">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div><h2 className="text-3xl font-extrabold tracking-tight">AI Knowledge</h2><p className="mt-1 text-sm text-on-surface-variant">Give your AI assistant accurate store policies, FAQs, and product information.</p></div><button onClick={generateSummary} disabled={busy || !storeId} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"><Sparkles className="h-4 w-4" />{busy === 'summary' ? 'Generating…' : 'Generate Summary'}</button></div>
    {message && <p className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm ${messageType === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`} role={messageType === 'error' ? 'alert' : 'status'}>{messageType === 'success' && <CheckCircle2 className="h-4 w-4 shrink-0" />}{message}</p>}
    <section className="rounded-2xl border border-outline-variant/40 bg-white shadow-sm"><div className="flex items-center justify-between gap-4 border-b border-outline-variant/30 px-6 py-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100 text-primary"><FileText className="h-5 w-5" /></span><div><h3 className="font-bold">Store documents</h3><p className="text-xs text-on-surface-variant">Policies, FAQs, product guides, and other trusted sources.</p></div></div><label className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border border-primary px-3 py-2 text-xs font-bold text-primary ${(!organizationId || !uploadedBy || busy) ? 'cursor-not-allowed opacity-50' : ''}`} title={!organizationId || !uploadedBy ? 'The login response must provide organizationId and userId before files can be uploaded.' : ''}><Upload className="h-4 w-4" />{busy === 'upload' ? 'Uploading…' : 'Upload file'}<input type="file" className="hidden" disabled={!organizationId || !uploadedBy || Boolean(busy)} onChange={upload} /></label></div>
      {!organizationId || !uploadedBy ? <p className="mx-6 mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">Upload is waiting for <b>organizationId</b> and <b>userId</b> in the login response.</p> : null}
      <div className="divide-y divide-outline-variant/20">{loading ? <p className="p-6 text-sm text-on-surface-variant">Loading documents…</p> : documents.length ? documents.map((document) => <div key={document.id || document.document_id} className="flex items-center justify-between gap-4 px-6 py-4"><div><p className="text-sm font-bold">{document.title || document.filename || 'Untitled document'}</p><p className="mt-1 text-xs text-on-surface-variant">{document.status || 'active'} · {document.knowledge_scope || 'general'}</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">Ready</span></div>) : <p className="p-8 text-center text-sm text-on-surface-variant">No documents have been uploaded for this store yet.</p>}</div>
    </section>
    <section className="grid gap-6 lg:grid-cols-2"><div className="rounded-2xl border border-outline-variant/40 bg-white p-6 shadow-sm"><div className="mb-4 flex items-center gap-2"><Search className="h-5 w-5 text-primary" /><h3 className="font-bold">Search your knowledge</h3></div><form onSubmit={search} className="flex gap-2"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="e.g. What is our return policy?" className="min-w-0 flex-1 rounded-xl border border-outline-variant px-3 py-2.5 text-sm" /><button disabled={busy === 'search'} className="rounded-xl bg-primary px-4 text-sm font-bold text-white disabled:opacity-50">{busy === 'search' ? 'Searching…' : 'Search'}</button></form><div className="mt-5 space-y-3">{results.map((result) => <article key={result.chunk_id} className="rounded-xl bg-surface-container-low p-3"><p className="text-xs font-bold text-primary">{result.document_title}</p><p className="mt-1 text-sm text-on-surface">{result.content}</p><p className="mt-2 text-xs text-on-surface-variant">Match: {Math.round((result.score || 0) * 100)}%</p></article>)}</div></div><div className="rounded-2xl border border-outline-variant/40 bg-white p-6 shadow-sm"><div className="mb-4 flex items-center gap-2"><Bot className="h-5 w-5 text-primary" /><h3 className="font-bold">Business summary</h3></div>{summary ? <><h4 className="font-semibold">{summary.title}</h4><p className="mt-3 whitespace-pre-line text-sm leading-6 text-on-surface-variant">{summary.summary}</p></> : <p className="text-sm leading-6 text-on-surface-variant">Generate a summary after adding documents. It gives the AI a concise, current view of your store.</p>}</div></section>
    {documents.length > 0 && <section className="rounded-2xl border border-outline-variant/40 bg-white p-6 shadow-sm"><h3 className="font-bold">Manage documents</h3><p className="mt-1 text-sm text-on-surface-variant">Edit a document title and description, or permanently delete it.</p><div className="mt-4 space-y-2">{documents.map((document) => { const documentId = document.id || document.document_id; return <div key={documentId} className="flex items-center justify-between gap-3 rounded-xl bg-surface-container-low px-4 py-3"><p className="min-w-0 truncate text-sm font-semibold">{document.title || document.filename || 'Untitled document'}</p><div className="flex shrink-0 gap-2"><button type="button" disabled={Boolean(busy)} onClick={() => openUpdate(document)} className="inline-flex items-center gap-1 rounded-lg border border-primary px-3 py-1.5 text-xs font-bold text-primary disabled:opacity-50"><Pencil className="h-3.5 w-3.5" />Update</button><button type="button" disabled={Boolean(busy)} onClick={() => setDeletingDocument(document)} className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" />Delete</button></div></div>; })}</div></section>}
    {editingDocument && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><form onSubmit={updateDocument} className="knowledge-document-modal"><div className="flex items-start justify-between"><div><h3 className="text-lg font-bold">Update document</h3><p className="mt-1 text-sm text-slate-500">Edit the document details.</p></div><button type="button" onClick={() => setEditingDocument(null)} className="rounded p-1 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button></div><label className="mt-5 block text-sm font-medium text-slate-700">Title<input required value={editForm.title} onChange={(event) => setEditForm((current) => ({ ...current, title: event.target.value }))} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5" /></label><label className="mt-4 block text-sm font-medium text-slate-700">Description<textarea value={editForm.description} onChange={(event) => setEditForm((current) => ({ ...current, description: event.target.value }))} rows="4" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5" /></label><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setEditingDocument(null)} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button><button disabled={busy.startsWith('update-')} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy.startsWith('update-') ? 'Saving…' : 'Save changes'}</button></div></form></div>}
    {deletingDocument && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"><div role="dialog" aria-modal="true" className="knowledge-document-modal knowledge-document-modal--delete"><h3 className="text-lg font-bold">Delete document?</h3><p className="mt-2 text-sm leading-6 text-slate-600">This permanently deletes <b>{deletingDocument.title || deletingDocument.filename || 'this document'}</b>, its uploaded file, and all linked chunks.</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setDeletingDocument(null)} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100">Cancel</button><button type="button" disabled={busy.startsWith('delete-')} onClick={deleteDocument} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{busy.startsWith('delete-') ? 'Deleting…' : 'Delete permanently'}</button></div></div></div>}
  </div>;
}
