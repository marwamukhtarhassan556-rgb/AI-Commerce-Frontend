import { useState, useEffect } from 'react';
import {
  fetchPrompts,
  fetchPromptByKey,
  createPrompt,
  updatePrompt,
  deletePrompt,
  restorePromptDefault,
  seedPrompts,
} from '../../api/aiService';

const PROMPT_TYPES = ['system', 'user', 'template'];

function TagBadge({ tag }) {
  return (
    <span className="admin-tag px-2.5 py-0.5 rounded-full text-xs font-medium">
      {tag}
    </span>
  );
}

function PromptEditor({ prompt, onSave, onCancel }) {
  const [form, setForm] = useState({
    key: '',
    name: '',
    content: '',
    type: 'system',
    tags: '',
    variables: '',
    description: '',
    is_active: true,
    ...prompt,
    tags: Array.isArray(prompt?.tags) ? prompt.tags.join(', ') : (prompt?.tags || ''),
    variables: Array.isArray(prompt?.variables) ? prompt.variables.join(', ') : (prompt?.variables || ''),
  });
  const [saving, setSaving] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        key: form.key,
        type: form.type,
        content: form.content,
        description: form.description,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        variables: form.variables ? form.variables.split(',').map((v) => v.trim()).filter(Boolean) : [],
        is_active: Boolean(form.is_active),
      };
      await onSave(payload);
    } catch (e) {
      alert('Save failed: ' + (e.response?.data?.detail || e.message));
    }
    setSaving(false);
  };

  return (
    <div className="admin-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="admin-modal-panel w-full max-w-[680px] bg-white border border-slate-200 rounded-2xl p-7 flex flex-col gap-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between w-full border-b border-[#F1F5F9] pb-3">
          <h3 className="text-lg font-bold text-[#0F172A] m-0">
            {prompt?.key ? `Edit Prompt: ${prompt.key}` : 'Create New Prompt'}
          </h3>
          <button
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-lg border border-[#E2E8F0] bg-[#F1F5F9] text-[#64748B] w-9 h-9 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-1">Key *</label>
            <input
              value={form.key}
              onChange={set('key')}
              disabled={!!prompt?.key}
              placeholder="e.g. system.greeting"
              className="admin-input w-full rounded-xl px-4 py-3 text-sm text-slate-950 dark:text-white outline-none"
              style={{ opacity: prompt?.key ? 0.6 : 1 }}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-1">Name</label>
            <input
              value={form.name}
              onChange={set('name')}
              placeholder="Human-readable name"
              className="admin-input w-full rounded-xl px-4 py-3 text-sm text-slate-950 dark:text-white outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-1">Type</label>
            <select
              value={form.type}
              onChange={set('type')}
              className="admin-input w-full rounded-xl px-4 py-3 text-sm text-slate-950 dark:text-white outline-none cursor-pointer"
            >
              {PROMPT_TYPES.map((t) => <option key={t} value={t} className="text-slate-900 dark:text-slate-100">{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-1">Tags (comma-separated)</label>
            <input
              value={form.tags}
              onChange={set('tags')}
              placeholder="store, welcome, rag"
              className="admin-input w-full rounded-xl px-4 py-3 text-sm text-slate-950 dark:text-white outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-1">Description</label>
          <input
            value={form.description}
            onChange={set('description')}
            placeholder="What does this prompt do?"
            className="admin-input w-full rounded-xl px-4 py-3 text-sm text-slate-950 dark:text-white outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-1">Variables (comma-separated)</label>
          <input
            value={form.variables}
            onChange={set('variables')}
            placeholder="store_name, ticket_id"
            className="admin-input w-full rounded-xl px-4 py-3 text-sm text-slate-950 dark:text-white outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-1">
            Prompt Content *
            <span className="block text-sm font-normal text-slate-500 dark:text-slate-300 mt-1">
              Variables: {'{store_name}'}, {'{user_name}'}, {'{product_list}'}
            </span>
          </label>
          <textarea
            value={form.content}
            onChange={set('content')}
            rows={6}
            placeholder="You are Navi, an AI shopping assistant for {store_name}..."
            className="admin-input w-full rounded-2xl px-4 py-3 text-sm font-mono leading-6 text-slate-950 dark:text-white outline-none resize-vertical"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-[#F1F5F9]">
          <button
            onClick={onCancel}
            className="admin-button-secondary rounded-xl px-5 py-3 text-sm font-semibold cursor-pointer"
            style={{ boxShadow: '0 1px 2px rgba(254, 254, 255, 0.14)' }}

          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !form.key || !form.content}
            className="admin-cta-btn rounded-xl px-5 py-3 text-sm font-semibold disabled:opacity-50 cursor-pointer"
            style={{ boxShadow: '0 4px 12px rgba(254, 254, 255, 0.25)' }}
          >
            {saving ? 'Saving…' : (prompt?.key ? 'Update Prompt' : 'Create Prompt')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SuperAdminPrompts() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [editing, setEditing] = useState(null); 
  const [seeding, setSeeding] = useState(false);
  const [restoring, setRestoring] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.query = search;
      if (filterType) params.type = filterType;
      const data = await fetchPrompts(params);
      setPrompts(Array.isArray(data) ? data : data?.items || data?.prompts || []);
    } catch {
      setPrompts([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [search, filterType]);

  const handleSave = async (form) => {
    if (editing?.key) {
      await updatePrompt(editing.key, form);
    } else {
      const { is_active, ...createPayload } = form;
      await createPrompt(createPayload);
    }
    setEditing(null);
    load();
  };

  const handleDelete = async (key) => {
    if (!window.confirm(`Delete prompt "${key}"?`)) return;
    try {
      await deletePrompt(key);
      load();
    } catch (e) {
      alert('Delete failed: ' + (e.response?.data?.detail || e.message));
    }
  };

  const handleRestore = async (key) => {
    setRestoring(key);
    try {
      await restorePromptDefault(key);
      load();
    } catch (e) {
      alert('Restore failed: ' + (e.response?.data?.detail || e.message));
    }
    setRestoring(null);
  };

  const handleSeed = async () => {
    if (!window.confirm('Seed all default prompts? This may overwrite existing ones.')) return;
    setSeeding(true);
    try {
      await seedPrompts();
      load();
    } catch (e) {
      alert('Seed failed: ' + (e.response?.data?.detail || e.message));
    }
    setSeeding(false);
  };

  return (
    <div className="p-10 max-w-[1300px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <h2 className="text-slate-950 dark:text-white text-[1.75rem] font-bold m-0 tracking-tight">Prompt Manager</h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">Create, edit, restore and version system prompts for the AI engine</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSeed} disabled={seeding}
            style={{ padding: '0.6rem 1.1rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#475569', transition: 'all 0.2s' }}>
            {seeding ? 'Seeding…' : '🌱 Seed Defaults'}
          </button>
          <button onClick={() => setEditing({})}
            style={{ padding: '0.6rem 1.25rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', background: '#2563EB', border: 'none', color: 'white', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)' }}>
            + New Prompt
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search prompts by key, name, or content…"
          className="admin-input flex-1 rounded-[12px] px-4 py-3 text-sm outline-none shadow-sm"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="admin-input rounded-[12px] px-4 py-3 text-sm text-slate-950 dark:text-white outline-none cursor-pointer shadow-sm"
        >
          <option value="" className="text-slate-900 dark:text-slate-100">All Types</option>
          {PROMPT_TYPES.map((t) => <option key={t} value={t} className="text-slate-900 dark:text-slate-100">{t}</option>)}
        </select>
      </div>

      {/* Prompts Grid */}
      {loading ? (
        <div className="text-center py-20 text-[#64748B] text-base">Loading prompts…</div>
      ) : prompts.length === 0 ? (
        <div className="text-center py-20 rounded-2xl admin-card admin-border">
          <p className="text-base mb-2">No prompts found.</p>
          <p className="text-sm text-[#94A3B8]">Click "Seed Defaults" to create the initial system prompts.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-3 xl:grid-cols-2">
          {prompts.map((p) => (
            <div
              key={p.key}
              className="p-6 rounded-2xl flex flex-col gap-3.5 transition-all duration-200 admin-card admin-border shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-slate-950 dark:text-white font-semibold m-0 text-sm">{p.name || p.key}</p>
                  <p className="text-slate-600 dark:text-slate-300 text-xs m-0 font-mono">{p.key}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 text-slate-900 dark:text-white" style={{ background: 'rgba(37, 99, 235, 0.08)', border: '1px solid rgba(37, 99, 235, 0.15)' }}>
                  {p.type || 'system'}
                </span>
              </div>

              {p.description && (
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-6 m-0">{p.description}</p>
              )}

              <div className="rounded-xl p-3.5 admin-surface admin-border overflow-hidden relative" style={{ maxHeight: '90px' }}>
                <p className="text-slate-700 dark:text-slate-300 text-xs font-mono leading-6 m-0">
                  {p.content?.slice(0, 200)}{p.content?.length > 200 ? '…' : ''}
                </p>
              </div>

              {Array.isArray(p.tags) && p.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {p.tags.map((t) => <TagBadge key={t} tag={t} />)}
                </div>
              )}

              <div className="flex gap-2.5 mt-auto pt-3 border-t border-slate-100">
                <button
                  onClick={() => setEditing(p)}
                  className="flex-1 rounded-xl border border-[#2563EB]/25 bg-[#eff6ff] px-3 py-2 text-sm font-semibold text-[#2563EB] cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleRestore(p.key)}
                  disabled={restoring === p.key}
                  className="flex-1 rounded-xl border border-[#f59e0b]/25 bg-[#fffbeb] px-3 py-2 text-sm font-semibold text-[#d97706] disabled:opacity-50 cursor-pointer"
                >
                  {restoring === p.key ? '…' : 'Restore'}
                </button>
                <button
                  onClick={() => handleDelete(p.key)}
                  className="flex-1 rounded-xl border border-[#ef4444]/25 bg-[#fef2f2] px-3 py-2 text-sm font-semibold text-[#dc2626] cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {editing !== null && (
        <PromptEditor
          prompt={editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}