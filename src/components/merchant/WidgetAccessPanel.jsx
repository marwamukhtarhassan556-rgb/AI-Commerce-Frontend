import { useEffect, useMemo, useState } from 'react';
import { Check, Copy, Download, KeyRound, Loader2, Plus, Power, RefreshCw } from 'lucide-react';
import { storesApi, widgetInstallationsApi } from '../../api/integrationApi';
import { getUserErrorMessage } from '../../utils/errorMessage';

/* This effect loads remote widget state into component state. */
/* eslint-disable react-hooks/set-state-in-effect */

const scopes = ['rag:chat', 'recommendations:read'];
const WIDGET_SCRIPT_SRC = 'https://aicommerce-ai-service-production.up.railway.app/widget/v1/widget.js';
const toOrigin = (domain) => { try { return new URL(/^https?:\/\//i.test(domain) ? domain : `https://${domain}`).origin; } catch { return ''; } };

const frameworkInstructions = {
  react: { name: 'React', file: 'public/widget.js', target: 'index.html — just before </body>', src: '/widget.js' },
  angular: { name: 'Angular', file: 'src/assets/widget.js', target: 'src/index.html — just before </body>', src: 'assets/widget.js' },
  vue: { name: 'Vue', file: 'public/widget.js', target: 'index.html — just before </body>', src: '/widget.js' },
  vanilla: { name: 'Vanilla JavaScript', file: 'widget.js beside your index.html', target: 'index.html — just before </body>', src: './widget.js' },
};

export default function WidgetAccessPanel({ framework = 'vanilla' }) {
  const storeId = localStorage.getItem('currentStoreId') || localStorage.getItem('storeId');
  const [origin, setOrigin] = useState('');
  const [items, setItems] = useState([]);
  const [activeWidgetKey, setActiveWidgetKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [disabling, setDisabling] = useState('');
  const [copied, setCopied] = useState('');
  const [error, setError] = useState('');
  const setup = frameworkInstructions[framework] || frameworkInstructions.vanilla;

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [widgets, store] = await Promise.all([
        widgetInstallationsApi.list().catch(() => ({ data: [] })),
        storeId ? storesApi.getById(storeId).catch(() => ({ data: {} })) : Promise.resolve({ data: {} }),
      ]);

      const list = Array.isArray(widgets.data) ? widgets.data : widgets.data?.items || [];
      setItems(list);

      const resolvedOrigin = toOrigin(store.data?.shopDomain) || (typeof window !== 'undefined' ? window.location.origin : '');
      setOrigin(resolvedOrigin);

      // Find an existing active key
      const activeItem = list.find((item) => String(item.status || '').toLowerCase() !== 'disabled');
      let currentKey = activeItem?.widget_key || activeItem?.widget_id || activeItem?.id || '';

      // If no key exists at all for this store, automatically attempt to create one
      if (!currentKey && list.length === 0 && resolvedOrigin) {
        try {
          const { data } = await widgetInstallationsApi.create({ environment: 'live', allowedOrigins: [resolvedOrigin], scopes });
          currentKey = data?.widget_key || data?.widget_id || data?.id || '';
          if (currentKey) {
            setActiveWidgetKey(currentKey);
            const freshWidgets = await widgetInstallationsApi.list().catch(() => ({ data: [] }));
            setItems(Array.isArray(freshWidgets.data) ? freshWidgets.data : freshWidgets.data?.items || []);
          }
        } catch (createErr) {
          if (createErr.response?.status !== 409) {
            console.warn('Auto widget key creation skipped:', createErr);
          }
        }
      }

      if (currentKey) {
        setActiveWidgetKey(currentKey);
      }
    } catch (e) {
      setError(getUserErrorMessage(e, 'We could not load widget access.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [storeId]);

  const scriptCode = useMemo(() => {
    const activeItem = items.find((item) => String(item.status || '').toLowerCase() !== 'disabled');
    if (activeItem?.install_snippet || activeItem?.snippet) {
      return activeItem.install_snippet || activeItem.snippet;
    }
    const key = activeWidgetKey || activeItem?.widget_key || activeItem?.widget_id || activeItem?.id || '';
    if (!key) return '';
    return `<script\n  src="${WIDGET_SCRIPT_SRC}"\n  data-widget-key="${key}"\n></script>`;
  }, [activeWidgetKey, items]);

  const copy = async (value, type) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(type);
      window.setTimeout(() => setCopied(''), 1500);
    } catch {
      setError('Could not copy to clipboard.');
    }
  };

  const create = async () => {
    const currentOrigin = origin || (typeof window !== 'undefined' ? window.location.origin : '');
    if (!currentOrigin) {
      setError('Add a valid Website Domain in My Store first.');
      return;
    }
    setCreating(true);
    setError('');
    try {
      const { data } = await widgetInstallationsApi.create({ environment: 'live', allowedOrigins: [currentOrigin], scopes });
      const key = data?.widget_key || data?.widget_id || data?.id || '';
      if (key) setActiveWidgetKey(key);
      await load();
    } catch (e) {
      if (e.response?.status === 409) {
        setError('Widget installation limit reached for this store. You can use or disable an existing installation key below.');
      } else {
        setError(getUserErrorMessage(e, 'We could not create a widget key.'));
      }
    } finally {
      setCreating(false);
    }
  };

  const disable = async (id) => {
    setDisabling(id);
    try {
      await widgetInstallationsApi.disable(id);
      await load();
    } catch (e) {
      setError(getUserErrorMessage(e, 'We could not disable this key.'));
    } finally {
      setDisabling('');
    }
  };

  return <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="widget-install-guide">
      <div><p className="widget-install-step">1. Add the widget file</p><p>Download <b>widget.js</b>, then place it in <code>{setup.file}</code>.</p></div>
      <a className="widget-download-button" href="/widget.js" download="widget.js"><Download className="h-4 w-4" />Download widget.js</a>
    </div>
    <div className="widget-install-target"><b>2. Add the installation code</b><span>Paste it into <code>{setup.target}</code>.</span></div>

    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="flex items-center gap-2 font-bold text-slate-900"><KeyRound className="h-5 w-5 text-indigo-600" />Widget access</h2>
        <p className="mt-1 text-sm text-slate-500">Create and manage the secure key for your {setup.name} storefront.</p>
      </div>
      <button type="button" disabled={creating} onClick={create} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
        <Plus className="h-4 w-4" />{creating ? 'Creating…' : 'Create widget key'}
      </button>
    </div>

    <p className="mt-4 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">Allowed origin: <b>{origin || 'Add Website Domain in My Store'}</b> · Scopes: {scopes.join(', ')}</p>
    {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

    {loading ? (
      <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-indigo-600" /></div>
    ) : scriptCode ? (
      <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <p className="font-semibold text-emerald-900">3. Copy this installation script tag and paste it into {setup.target}</p>
        <CopyBox label="Widget key" value={activeWidgetKey} copied={copied === 'key'} onCopy={() => copy(activeWidgetKey, 'key')} />
        <CopyBox label="install_snippet" value={scriptCode} copied={copied === 'code'} onCopy={() => copy(scriptCode, 'code')} multiline />
      </div>
    ) : null}

    <div className="mt-5 flex items-center justify-between">
      <h3 className="text-sm font-bold text-slate-900">Your installations</h3>
      <button type="button" onClick={load} className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600"><RefreshCw className="h-3.5 w-3.5" />Refresh</button>
    </div>
    {loading ? <div className="flex justify-center p-5"><Loader2 className="h-5 w-5 animate-spin text-indigo-600" /></div> : items.length ? <div className="mt-3 space-y-2">{items.map((item) => { const enabled = String(item.status || '').toLowerCase() !== 'disabled'; const itemKey = item.widget_key || item.widget_id || item.id; return <div key={item.id || item.widget_id} className="flex flex-col gap-3 rounded-xl border border-slate-200 p-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-mono text-xs font-semibold text-slate-800">{itemKey}</p><p className="mt-1 text-xs text-slate-500">{(item.allowed_origins || []).join(', ')}</p></div><div className="flex items-center gap-3"><span className={`rounded-full px-2 py-1 text-xs font-bold ${enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{item.status || 'Active'}</span>{enabled && <button type="button" disabled={disabling === item.widget_id} onClick={() => disable(item.widget_id)} className="inline-flex items-center gap-1 text-xs font-semibold text-red-700"><Power className="h-3.5 w-3.5" />{disabling === item.widget_id ? 'Disabling…' : 'Disable'}</button>}</div></div>; })}</div> : <p className="mt-3 rounded-xl border border-dashed border-slate-200 p-5 text-center text-sm text-slate-500">No widget keys yet.</p>}
    <p className="mt-3 text-xs text-slate-500">Disabling a key blocks new widget sessions immediately. Create a new key whenever you need one.</p>
  </section>;
}

function CopyBox({ label, value, copied, onCopy, multiline = false }) { return <div className="mt-3"><div className="flex items-center justify-between"><p className="text-xs font-bold text-slate-700">{label}</p><button type="button" onClick={onCopy} className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700">{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copied ? 'Copied' : 'Copy'}</button></div><pre className={`mt-1 overflow-x-auto rounded-lg bg-white p-3 text-xs text-slate-700 ${multiline ? 'whitespace-pre-wrap' : ''}`}>{value}</pre></div>; }
