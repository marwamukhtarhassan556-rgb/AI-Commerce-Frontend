import { useEffect, useState } from 'react';
import { Bot, FileJson2, KeyRound, Loader2, RefreshCw, Save, Trash2, Upload } from 'lucide-react';
import YAML from 'yaml';
import { integrationApi } from '../../../api/integrationApi';
import { getUserErrorMessage } from '../../../utils/errorMessage';

const getErrorMessage = (error) => getUserErrorMessage(error, 'Schema analysis could not be completed.');

export default function IntegrationPage() {
  const [platformName, setPlatformName] = useState('Custom API');
  const [fileName, setFileName] = useState('');
  const [rawSpec, setRawSpec] = useState(null);
  const [report, setReport] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [storeId] = useState(() => localStorage.getItem('currentStoreId') || localStorage.getItem('storeId') || '');
  const [connections, setConnections] = useState([]);
  const [connectionsLoading, setConnectionsLoading] = useState(Boolean(storeId));
  const [connectionAction, setConnectionAction] = useState('');
  const [selectedConnectionId, setSelectedConnectionId] = useState('');
  const [credentialsText, setCredentialsText] = useState('{}');
  const [mappingsText, setMappingsText] = useState('[]');

  const selectedConnection = connections.find((connection) => (connection.id || connection.connection_id) === selectedConnectionId);

  const loadConnections = async () => {
    if (!storeId) return;
    setConnectionsLoading(true);
    try {
      const { data } = await integrationApi.listConnections(storeId);
      setConnections(Array.isArray(data) ? data : data?.items || data?.connections || []);
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally { setConnectionsLoading(false); }
  };

  useEffect(() => { void loadConnections(); }, [storeId]);

  useEffect(() => {
    if (!selectedConnection) return;
    setCredentialsText(JSON.stringify(selectedConnection.credentials || {}, null, 2));
    setMappingsText(JSON.stringify(selectedConnection.entity_mappings || [], null, 2));
  }, [selectedConnection]);

  const updateConnection = (updated) => {
    const id = updated.id || updated.connection_id;
    setConnections((current) => current.map((connection) => (connection.id || connection.connection_id) === id ? { ...connection, ...updated } : connection));
  };

  const selectFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setMessage('');
    setReport(null);
    try {
      const contents = await file.text();
      let parsedSpec = null;
      try {
        parsedSpec = JSON.parse(contents);
      } catch {
        parsedSpec = YAML.parse(contents);
      }
      if (!parsedSpec || typeof parsedSpec !== 'object') {
        throw new Error('Invalid file content');
      }
      setRawSpec(parsedSpec);
      setFileName(file.name);
    } catch {
      setRawSpec(null);
      setFileName('');
      setMessage('Please upload a valid OpenAPI JSON or YAML (.yaml / .yml) file.');
    } finally {
      event.target.value = '';
    }
  };

  const analyzeSchema = async () => {
    if (!rawSpec) return;
    setLoading(true);
    setMessage('');
    try {
      const { data } = await integrationApi.agentParseSchema(platformName || 'Custom API', rawSpec);
      setReport(data);
    } catch (error) {
      setMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const syncConnection = async (connectionId) => {
    setConnectionAction(`sync-${connectionId}`); setMessage('');
    try {
      const { data } = await integrationApi.syncConnection(connectionId);
      updateConnection({ id: connectionId, last_sync_at: data?.completed_at || new Date().toISOString(), last_sync_status: data?.status || 'completed' });
      setMessage('Connection sync completed successfully.');
    } catch (error) { setMessage(getUserErrorMessage(error, 'We could not sync this connection. Please try again.')); }
    finally { setConnectionAction(''); }
  };

  const saveCredentials = async () => {
    if (!selectedConnection) return;
    let credentials;
    try { credentials = JSON.parse(credentialsText); } catch { setMessage('Credentials must be valid JSON.'); return; }
    const id = selectedConnection.id || selectedConnection.connection_id;
    setConnectionAction('credentials'); setMessage('');
    try {
      const { data } = await integrationApi.updateCredentials(id, { authConfig: selectedConnection.auth_config || {}, credentials });
      updateConnection(data || { id, credentials });
      setMessage('Connection credentials saved. The next sync will use them.');
    } catch (error) { setMessage(getUserErrorMessage(error, 'We could not save the connection credentials. Please try again.')); }
    finally { setConnectionAction(''); }
  };

  const saveMappings = async () => {
    if (!selectedConnection) return;
    let entityMappings;
    try { entityMappings = JSON.parse(mappingsText); } catch { setMessage('Mappings must be valid JSON.'); return; }
    if (!Array.isArray(entityMappings)) { setMessage('Mappings must be a JSON list.'); return; }
    const id = selectedConnection.id || selectedConnection.connection_id;
    setConnectionAction('mappings'); setMessage('');
    try {
      const { data } = await integrationApi.updateMappings(id, entityMappings);
      updateConnection(data || { id, entity_mappings: entityMappings });
      setMessage('Entity mappings saved. Sync the connection to apply them.');
    } catch (error) { setMessage(getUserErrorMessage(error, 'We could not save the mappings. Please try again.')); }
    finally { setConnectionAction(''); }
  };

  const removeConnection = async (connectionId) => {
    if (!window.confirm('Remove this integration? You can reconnect it later from the setup flow.')) return;
    setConnectionAction(`delete-${connectionId}`); setMessage('');
    try {
      await integrationApi.deleteConnection(connectionId);
      setConnections((current) => current.filter((connection) => (connection.id || connection.connection_id) !== connectionId));
      setSelectedConnectionId('');
      setMessage('Integration removed.');
    } catch (error) { setMessage(getUserErrorMessage(error, 'We could not remove this integration. Please try again.')); }
    finally { setConnectionAction(''); }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 lg:p-10">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight">Store Integration</h2>
        <p className="mt-1 text-sm text-on-surface-variant">Upload an OpenAPI schema and let AI identify endpoints, entities, and setup notes.</p>
      </div>

      {message && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">{message}</p>}

      <section className="overflow-hidden rounded-2xl border border-outline-variant/40 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-outline-variant/30 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="text-lg font-bold">Your connections</h3><p className="mt-1 text-sm text-on-surface-variant">Sync your data or update the connection details when your store API changes.</p></div><button type="button" onClick={loadConnections} disabled={connectionsLoading} className="inline-flex items-center justify-center gap-2 rounded-lg border border-outline-variant px-3 py-2 text-xs font-bold hover:bg-surface-container-low disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${connectionsLoading ? 'animate-spin' : ''}`} />Refresh</button></div>
        {connectionsLoading ? <div className="flex justify-center p-10"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div> : connections.length === 0 ? <div className="p-8 text-center text-sm text-on-surface-variant">No connection is ready yet. Complete the integration setup first, then return here to manage it.</div> : <div className="divide-y divide-outline-variant/20">{connections.map((connection) => { const id = connection.id || connection.connection_id; const selected = id === selectedConnectionId; const status = String(connection.status || connection.last_sync_status || 'pending').toLowerCase(); return <div key={id} className={`p-5 transition-colors ${selected ? 'bg-primary/5' : ''}`}><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2"><h4 className="font-bold">{connection.name || connection.platform_name || 'Store connection'}</h4><span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${status === 'active' || status === 'completed' ? 'bg-emerald-100 text-emerald-700' : status.includes('error') || status.includes('failed') ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'}`}>{status}</span></div><p className="mt-1 text-xs text-on-surface-variant">{connection.platform_name || 'Custom API'} · Last sync: {connection.last_sync_at ? new Date(connection.last_sync_at).toLocaleString() : 'Not available yet'} · {connection.entity_mappings?.length || 0} mapped entities</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => setSelectedConnectionId(selected ? '' : id)} className="rounded-lg border border-outline-variant px-3 py-2 text-xs font-bold hover:bg-surface-container-low">{selected ? 'Close settings' : 'Manage'}</button><button type="button" onClick={() => syncConnection(id)} disabled={Boolean(connectionAction)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-on-primary-fixed-variant disabled:opacity-50">{connectionAction === `sync-${id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}{connectionAction === `sync-${id}` ? 'Syncing…' : 'Sync now'}</button><button type="button" onClick={() => removeConnection(id)} disabled={Boolean(connectionAction)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50">{connectionAction === `delete-${id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}Remove</button></div></div></div>; })}</div>}
      </section>

      {selectedConnection && <section className="rounded-2xl border border-outline-variant/40 bg-white p-6 shadow-sm"><div className="mb-5 flex items-start gap-3"><KeyRound className="mt-0.5 h-5 w-5 text-primary" /><div><h3 className="font-bold">Advanced connection settings</h3><p className="mt-1 text-xs leading-5 text-on-surface-variant">Only use values supplied by your e-commerce developer. These settings do not change your Navi account login.</p></div></div><div className="grid gap-6 lg:grid-cols-2"><div><label className="text-sm font-bold">Credentials JSON</label><p className="mt-1 text-xs text-on-surface-variant">Example: {`{ "api_key": "..." }`}</p><textarea value={credentialsText} onChange={(event) => setCredentialsText(event.target.value)} rows="11" spellCheck="false" className="mt-3 w-full rounded-xl border border-outline-variant bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/30" /><button type="button" onClick={saveCredentials} disabled={Boolean(connectionAction)} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50">{connectionAction === 'credentials' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{connectionAction === 'credentials' ? 'Saving…' : 'Save credentials'}</button></div><div><label className="text-sm font-bold">Entity mappings JSON</label><p className="mt-1 text-xs text-on-surface-variant">This controls where Navi reads products, orders, and customers in your API.</p><textarea value={mappingsText} onChange={(event) => setMappingsText(event.target.value)} rows="11" spellCheck="false" className="mt-3 w-full rounded-xl border border-outline-variant bg-slate-950 p-3 font-mono text-xs leading-5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/30" /><button type="button" onClick={saveMappings} disabled={Boolean(connectionAction)} className="mt-3 inline-flex items-center gap-2 rounded-lg border border-primary px-4 py-2.5 text-xs font-bold text-primary hover:bg-primary/5 disabled:opacity-50">{connectionAction === 'mappings' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{connectionAction === 'mappings' ? 'Saving…' : 'Save mappings'}</button></div></div></section>}

      <section className="rounded-2xl border border-outline-variant/40 bg-white p-6 shadow-sm">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <label className="block text-sm font-semibold">Platform name<input value={platformName} onChange={(event) => setPlatformName(event.target.value)} placeholder="e.g. Shopify or Custom API" className="mt-2 w-full rounded-xl border border-outline-variant px-3 py-2.5 text-sm" /></label>
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-primary px-4 py-2.5 text-sm font-bold text-primary hover:bg-blue-50"><Upload className="h-4 w-4" />Upload OpenAPI (JSON / YAML)<input type="file" accept=".json,.yaml,.yml,application/json,application/yaml,text/yaml" className="hidden" onChange={selectFile} /></label>
        </div>

        <div className="mt-5 rounded-xl bg-surface-container-low p-4">
          <div className="flex items-center gap-3"><FileJson2 className="h-5 w-5 text-primary" /><div><p className="text-sm font-bold">{fileName || 'No schema selected'}</p><p className="text-xs text-on-surface-variant">{rawSpec ? 'Ready for AI analysis.' : 'Export your OpenAPI specification as a JSON or YAML file, then upload it here.'}</p></div></div>
        </div>

        <button type="button" disabled={!rawSpec || loading} onClick={analyzeSchema} className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}{loading ? 'Analyzing schema…' : 'Analyze with AI'}</button>
      </section>

      {report && <section className="rounded-2xl border border-outline-variant/40 bg-white p-6 shadow-sm"><div className="mb-4 flex items-center gap-2"><Bot className="h-5 w-5 text-primary" /><h3 className="font-bold">AI integration notes</h3></div><pre className="max-h-[560px] overflow-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">{JSON.stringify(report, null, 2)}</pre></section>}
    </div>
  );
}
