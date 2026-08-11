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
    <span
      className="px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: 'rgba(37, 99, 235, 0.08)', color: '#2563EB', border: '1px solid rgba(37, 99, 235, 0.15)' }}
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

  const labelStyle = { color: '#475569', fontSize: '0.75rem', fontWeight: 600, display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' };
  const inputStyle = { width: '100%', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '10px', padding: '0.6rem 0.85rem', color: '#0F172A', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
        boxSizing: 'border-box',
      }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '20px',
          padding: '1.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.15rem',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxSizing: 'border-box',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          margin: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.75rem' }}>
          <h3 style={{ color: '#0F172A', fontWeight: 700, fontSize: '1.15rem', margin: 0, letterSpacing: '-0.01em' }}>
            {prompt?.key ? `Edit Prompt: ${prompt.key}` : 'Create New Prompt'}
          </h3>
          <button onClick={onCancel} style={{ color: '#64748B', background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Key *</label>
            <input value={form.key} onChange={set('key')} disabled={!!prompt?.key} placeholder="e.g. system.greeting" style={{ ...inputStyle, opacity: prompt?.key ? 0.6 : 1 }} />
          </div>
          <div>
            <label style={labelStyle}>Name</label>
            <input value={form.name} onChange={set('name')} placeholder="Human-readable name" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Type</label>
            <select value={form.type} onChange={set('type')} style={{ ...inputStyle, cursor: 'pointer' }}>
              {PROMPT_TYPES.map((t) => <option key={t} value={t} style={{ background: '#FFFFFF', color: '#0F172A' }}>{t}</option>)}
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
            <span style={{ color: '#64748B', fontWeight: 400, marginLeft: '8px', textTransform: 'none', letterSpacing: 0 }}>
              Variables: {'{store_name}'}, {'{user_name}'}, {'{product_list}'}
            </span>
          </label>
          <textarea
            value={form.content}
            onChange={set('content')}
            rows={6}
            placeholder="You are Navi, an AI shopping assistant for {store_name}..."
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', lineHeight: 1.6 }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
          <button onClick={onCancel} style={{ padding: '0.55rem 1.25rem', borderRadius: '10px', background: '#F1F5F9', color: '#475569', fontWeight: 600, fontSize: '0.85rem', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving || !form.key || !form.content} style={{
            padding: '0.55rem 1.4rem', borderRadius: '10px',
            background: saving || !form.key || !form.content ? '#93C5FD' : '#2563EB',
            color: 'white', fontWeight: 600, fontSize: '0.85rem', border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
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
    <div style={{ padding: '2.5rem 2rem', maxWidth: '1300px', margin: '0 auto', background: '#F8FAFC', minHeight: '100vh', color: '#0F172A' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
        <div>
          <h2 style={{ color: '#0F172A', fontSize: '1.75rem', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>Prompt Manager</h2>
          <p style={{ color: '#64748B', fontSize: '0.9rem', marginTop: '6px' }}>Create, edit, restore and version system prompts for the AI engine</p>
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
          style={{
            flex: 1, background: '#FFFFFF', border: '1px solid #CBD5E1',
            borderRadius: '12px', padding: '0.75rem 1rem', color: '#0F172A', fontSize: '0.9rem', outline: 'none',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            background: '#FFFFFF', border: '1px solid #CBD5E1',
            borderRadius: '12px', padding: '0.75rem 1rem', color: '#0F172A', fontSize: '0.9rem', outline: 'none', cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
        >
          <option value="" style={{ background: '#FFFFFF', color: '#0F172A' }}>All Types</option>
          {PROMPT_TYPES.map((t) => <option key={t} value={t} style={{ background: '#FFFFFF', color: '#0F172A' }}>{t}</option>)}
        </select>
      </div>

      {/* Prompts Grid */}
      {loading ? (
        <div className="text-center py-20" style={{ color: '#64748B', fontSize: '1rem' }}>Loading prompts…</div>
      ) : prompts.length === 0 ? (
        <div className="text-center py-20 rounded-2xl" style={{ background: '#FFFFFF', border: '1px dashed #CBD5E1', color: '#64748B' }}>
          <p style={{ fontSize: '1rem', marginBottom: '8px' }}>No prompts found.</p>
          <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Click "Seed Defaults" to create the initial system prompts.</p>
        </div>
      ) : (
        <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))' }}>
          {prompts.map((p) => (
            <div
              key={p.key}
              className="p-6 rounded-2xl flex flex-col gap-3.5 transition-all duration-200"
              style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p style={{ color: '#0F172A', fontWeight: 600, margin: 0, fontSize: '0.95rem' }}>{p.name || p.key}</p>
                  <p style={{ color: '#64748B', fontSize: '0.75rem', margin: '3px 0 0', fontFamily: 'monospace' }}>{p.key}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0" style={{ background: 'rgba(37, 99, 235, 0.08)', color: '#2563EB', border: '1px solid rgba(37, 99, 235, 0.15)' }}>
                  {p.type || 'system'}
                </span>
              </div>

              {p.description && (
                <p style={{ color: '#64748B', fontSize: '0.85rem', margin: 0, lineHeight: 1.4 }}>{p.description}</p>
              )}

              <div
                className="rounded-xl p-3.5"
                style={{ background: '#F8FAFC', maxHeight: '90px', overflow: 'hidden', position: 'relative', border: '1px solid #E2E8F0' }}
              >
                <p style={{ color: '#334155', fontSize: '0.78rem', fontFamily: 'monospace', margin: 0, lineHeight: 1.6 }}>
                  {p.content?.slice(0, 200)}{p.content?.length > 200 ? '…' : ''}
                </p>
              </div>

              {Array.isArray(p.tags) && p.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {p.tags.map((t) => <TagBadge key={t} tag={t} />)}
                </div>
              )}

              <div className="flex gap-2.5 mt-auto pt-3 border-t border-slate-100">
                <button onClick={() => setEditing(p)}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', background: 'rgba(37, 99, 235, 0.08)', border: '1px solid rgba(37, 99, 235, 0.2)', color: '#2563EB' }}>
                  Edit
                </button>
                <button onClick={() => handleRestore(p.key)} disabled={restoring === p.key}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', background: 'rgba(217, 119, 6, 0.08)', border: '1px solid rgba(217, 119, 6, 0.2)', color: '#D97706' }}>
                  {restoring === p.key ? '…' : 'Restore'}
                </button>
                <button onClick={() => handleDelete(p.key)}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', background: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.2)', color: '#DC2626' }}>
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