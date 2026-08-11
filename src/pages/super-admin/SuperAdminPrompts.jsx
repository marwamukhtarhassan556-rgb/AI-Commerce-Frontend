import { useState, useEffect, useRef } from 'react';
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
    <span
      className="px-2 py-0.5 rounded-full text-xs"
      style={{ background: 'rgba(56,189,248,0.1)', color: '#38BDF8', border: '1px solid rgba(56,189,248,0.15)' }}
    >
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

  const labelStyle = { color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' };
  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(71,85,105,0.4)', borderRadius: '8px', padding: '0.45rem 0.75rem', color: '#E2E8F0', fontSize: '0.875rem', outline: 'none' };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        className="w-full max-w-2xl rounded-2xl p-6 flex flex-col gap-4"
        style={{ background: '#0F172A', border: '1px solid rgba(37,99,235,0.25)', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="flex items-center justify-between">
          <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>
            {prompt?.key ? `Edit: ${prompt.key}` : 'New Prompt'}
          </h3>
          <button onClick={onCancel} style={{ color: '#64748B', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Key *</label>
            <input value={form.key} onChange={set('key')} disabled={!!prompt?.key} placeholder="e.g. system.greeting" style={{ ...inputStyle, opacity: prompt?.key ? 0.5 : 1 }} />
          </div>
          <div>
            <label style={labelStyle}>Name</label>
            <input value={form.name} onChange={set('name')} placeholder="Human-readable name" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Type</label>
            <select value={form.type} onChange={set('type')} style={{ ...inputStyle, cursor: 'pointer' }}>
              {PROMPT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Tags (comma-separated)</label>
            <input value={form.tags} onChange={set('tags')} placeholder="store, welcome, rag" style={inputStyle} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Description</label>
          <input value={form.description} onChange={set('description')} placeholder="What does this prompt do?" style={inputStyle} />
        </div>

        <div>
          <label style={labelStyle}>Variables (comma-separated)</label>
          <input value={form.variables} onChange={set('variables')} placeholder="store_name, ticket_id" style={inputStyle} />
        </div>

        <div>
          <label style={{ ...labelStyle, marginBottom: '6px' }}>
            Prompt Content *
            <span style={{ color: '#475569', fontWeight: 400, marginLeft: '8px', textTransform: 'none', letterSpacing: 0 }}>
              Variables: {'{store_name}'}, {'{user_name}'}, {'{product_list}'}
            </span>
          </label>
          <textarea
            value={form.content}
            onChange={set('content')}
            rows={10}
            placeholder="You are Navi, an AI shopping assistant for {store_name}..."
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', lineHeight: 1.6 }}
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', color: '#94A3B8', fontWeight: 600, fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving || !form.key || !form.content} style={{
            padding: '0.5rem 1.25rem', borderRadius: '8px',
            background: saving || !form.key || !form.content ? 'rgba(37,99,235,0.2)' : '#2563EB',
            color: 'white', fontWeight: 600, fontSize: '0.85rem', border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
          }}>
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
  const [editing, setEditing] = useState(null); // null | {} (new) | {key,...} (existing)
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
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Prompt Manager</h2>
          <p style={{ color: '#64748B', fontSize: '0.875rem', marginTop: '4px' }}>Create, edit, restore and version system prompts for the AI engine</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleSeed} disabled={seeding}
            style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)', color: '#A78BFA' }}>
            {seeding ? 'Seeding…' : '🌱 Seed Defaults'}
          </button>
          <button onClick={() => setEditing({})}
            style={{ padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', background: '#2563EB', border: 'none', color: 'white' }}>
            + New Prompt
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search prompts…"
          style={{
            flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(71,85,105,0.4)',
            borderRadius: '10px', padding: '0.5rem 1rem', color: '#E2E8F0', fontSize: '0.875rem', outline: 'none',
          }}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(71,85,105,0.4)',
            borderRadius: '10px', padding: '0.5rem 1rem', color: '#E2E8F0', fontSize: '0.875rem', outline: 'none',
          }}
        >
          <option value="">All Types</option>
          {PROMPT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Prompts Grid */}
      {loading ? (
        <div className="text-center py-12" style={{ color: '#64748B' }}>Loading prompts…</div>
      ) : prompts.length === 0 ? (
        <div className="text-center py-12" style={{ color: '#64748B' }}>
          <p>No prompts found. Click "Seed Defaults" to create the system prompts.</p>
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
          {prompts.map((p) => (
            <div
              key={p.key}
              className="p-5 rounded-2xl flex flex-col gap-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p style={{ color: 'white', fontWeight: 600, margin: 0, fontSize: '0.9rem' }}>{p.name || p.key}</p>
                  <p style={{ color: '#475569', fontSize: '0.72rem', margin: '2px 0 0', fontFamily: 'monospace' }}>{p.key}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0" style={{ background: 'rgba(56,189,248,0.08)', color: '#38BDF8' }}>
                  {p.type || 'system'}
                </span>
              </div>

              {p.description && (
                <p style={{ color: '#64748B', fontSize: '0.8rem', margin: 0 }}>{p.description}</p>
              )}

              <div
                className="rounded-lg p-3"
                style={{ background: 'rgba(0,0,0,0.2)', maxHeight: '80px', overflow: 'hidden', position: 'relative' }}
              >
                <p style={{ color: '#94A3B8', fontSize: '0.75rem', fontFamily: 'monospace', margin: 0, lineHeight: 1.5 }}>
                  {p.content?.slice(0, 200)}{p.content?.length > 200 ? '…' : ''}
                </p>
              </div>

              {Array.isArray(p.tags) && p.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {p.tags.map((t) => <TagBadge key={t} tag={t} />)}
                </div>
              )}

              <div className="flex gap-2 mt-auto">
                <button onClick={() => setEditing(p)}
                  style={{ flex: 1, padding: '0.4rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(37,99,235,0.2)', color: '#60A5FA' }}>
                  Edit
                </button>
                <button onClick={() => handleRestore(p.key)} disabled={restoring === p.key}
                  style={{ flex: 1, padding: '0.4rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#F59E0B' }}>
                  {restoring === p.key ? '…' : 'Restore'}
                </button>
                <button onClick={() => handleDelete(p.key)}
                  style={{ flex: 1, padding: '0.4rem', borderRadius: '8px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.18)', color: '#F87171' }}>
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
