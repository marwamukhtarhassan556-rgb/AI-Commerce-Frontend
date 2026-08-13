import { useEffect, useState } from 'react';
import {
  fetchAiHealth,
  fetchAiModels,
  fetchAiProviders,
  fetchProviderHealth,
} from '../../api/aiService';

const FALLBACK_PROVIDERS = ['gemini', 'openrouter', 'claude'];

const providerMeta = {
  gemini: { label: 'Google Gemini', icon: 'auto_awesome', color: '#4285F4' },
  openrouter: { label: 'OpenRouter', icon: 'hub', color: '#2563EB' },
  claude: { label: 'Anthropic Claude', icon: 'psychology', color: '#D97706' },
  openai: { label: 'OpenAI', icon: 'smart_toy', color: '#0D1B2A' },
  azure: { label: 'Azure AI', icon: 'cloud', color: '#38BDF8' },
  mistral: { label: 'Mistral', icon: 'air', color: '#7C3AED' },
  deepseek: { label: 'DeepSeek', icon: 'travel_explore', color: '#0EA5E9' },
  ollama: { label: 'Ollama', icon: 'dns', color: '#475569' },
};

function normalizeModels(data) {
  return Array.isArray(data) ? data : data?.models || [];
}

function normalizeProviders(data) {
  const rows = Array.isArray(data) ? data : data?.providers || [];
  return rows.map((provider) => provider.provider || provider.name).filter(Boolean);
}

function CapabilityBadge({ value }) {
  const enabled = value === true || value === 'true' || value === 'yes' || value === 1;
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{
        background: enabled ? 'rgba(34,197,94,0.12)' : 'rgba(100,116,139,0.12)',
        color: enabled ? '#16A34A' : '#64748B',
      }}
    >
      {enabled ? 'Yes' : 'No'}
    </span>
  );
}

function StatusDot({ status }) {
  const normalized = String(status || '').toLowerCase();
  const color =
    normalized === 'healthy' || normalized === 'ok' || status === true
      ? '#22C55E'
      : normalized === 'degraded'
        ? '#F59E0B'
        : '#F87171';
  return <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />;
}

export default function SuperAdminModelsHealth() {
  const [overall, setOverall] = useState(null);
  const [models, setModels] = useState([]);
  const [providers, setProviders] = useState(FALLBACK_PROVIDERS);
  const [providerHealths, setProviderHealths] = useState({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    let providerNames = providers;

    try {
      const [healthData, providersData, modelsData] = await Promise.all([
        fetchAiHealth(),
        fetchAiProviders(),
        fetchAiModels(),
      ]);
      providerNames = normalizeProviders(providersData);
      setOverall(healthData);
      setProviders(providerNames.length ? providerNames : FALLBACK_PROVIDERS);
      setModels(normalizeModels(modelsData));
    } catch (err) {
      setOverall({ status: 'error', details: err.message || 'AI service unavailable' });
      providerNames = FALLBACK_PROVIDERS;
      setProviders(FALLBACK_PROVIDERS);
      setModels([]);
    }

    const healths = {};
    await Promise.all(
      (providerNames.length ? providerNames : FALLBACK_PROVIDERS).map(async (provider) => {
        try {
          healths[provider] = await fetchProviderHealth(provider);
        } catch {
          healths[provider] = { status: 'offline', details: 'Unreachable' };
        }
      })
    );
    setProviderHealths(healths);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0D1B2A]">AI Models & Provider Health</h2>
          <p className="mt-1 text-sm text-[#64748B]">Provider liveness, latency, and model capability coverage from the AI service.</p>
        </div>
        <button type="button" onClick={load} className="navi-admin-button px-4">
          <span className="material-symbols-outlined text-lg">refresh</span>
          Check all
        </button>
      </div>

      {overall && (
        <section className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm flex items-center gap-4">
          <StatusDot status={overall.status} />
          <div>
            <p className="font-semibold text-[#0D1B2A]">Default AI Provider</p>
            <p className="text-sm text-[#64748B]">
              {overall.status || 'unknown'}
              {overall.provider ? ` - ${overall.provider}` : ''}
              {overall.latency_ms !== undefined ? ` - ${overall.latency_ms}ms` : ''}
            </p>
          </div>
        </section>
      )}

      <section className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
        {providers.map((provider) => {
          const health = providerHealths[provider];
          const meta = providerMeta[provider] || { label: provider, icon: 'memory', color: '#64748B' };

          return (
            <article key={provider} className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined" style={{ color: meta.color }}>{meta.icon}</span>
                  <span className="font-semibold text-[#0D1B2A]">{meta.label}</span>
                </div>
                {health ? <StatusDot status={health.status} /> : <span className="text-xs text-[#64748B]">Loading</span>}
              </div>
              <div className="space-y-1 text-sm text-[#64748B]">
                <p>Status: <span className="font-semibold text-[#0D1B2A]">{health?.status || 'checking'}</span></p>
                {health?.latency_ms !== undefined && <p>Latency: <span className="font-semibold text-[#0D1B2A]">{health.latency_ms}ms</span></p>}
                {health?.details && <p className="truncate">{health.details}</p>}
              </div>
            </article>
          );
        })}
      </section>

      <section className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="border-b border-[#E2E8F0] px-6 py-4">
          <h3 className="font-semibold text-[#0D1B2A]">Models Capability Matrix</h3>
        </div>
        {loading ? (
          <div className="p-8 text-center text-[#64748B]">Loading models...</div>
        ) : models.length === 0 ? (
          <div className="p-8 text-center text-[#64748B]">No model registry data available.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F8FAFC] text-xs uppercase text-[#64748B]">
                <tr>
                  {['Model', 'Provider', 'Chat', 'Vision', 'JSON', 'Tools', 'Streaming', 'Embedding'].map((heading) => (
                    <th key={heading} className="px-4 py-3 font-semibold">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {models.map((model, index) => {
                  const caps = model.capabilities || {};
                  return (
                    <tr key={model.name || model.model_id || model.id || index} className="group hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors">
                      <td className="px-4 py-3 font-semibold text-[#0D1B2A] dark:text-white group-hover:text-slate-900 dark:group-hover:text-white">{model.name || model.model_id || model.id || '-'}</td>
                      <td className="px-4 py-3 text-[#64748B] dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200">{model.provider || '-'}</td>
                      <td className="px-4 py-3"><CapabilityBadge value={caps.chat ?? model.chat} /></td>
                      <td className="px-4 py-3"><CapabilityBadge value={caps.vision ?? model.supports_vision ?? model.vision} /></td>
                      <td className="px-4 py-3"><CapabilityBadge value={caps.json_mode ?? model.supports_json_mode ?? model.json_mode} /></td>
                      <td className="px-4 py-3"><CapabilityBadge value={caps.tool_calling ?? model.supports_tool_calling ?? model.tool_calling} /></td>
                      <td className="px-4 py-3"><CapabilityBadge value={caps.streaming ?? model.supports_streaming ?? model.streaming} /></td>
                      <td className="px-4 py-3"><CapabilityBadge value={caps.embedding ?? model.supports_embeddings ?? model.embedding} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
