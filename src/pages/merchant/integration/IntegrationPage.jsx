import { useState } from 'react';
import { Bot, FileJson2, Loader2, Upload } from 'lucide-react';
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

  const selectFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setMessage('');
    setReport(null);
    try {
      const contents = await file.text();
      const parsedSpec = JSON.parse(contents);
      setRawSpec(parsedSpec);
      setFileName(file.name);
    } catch {
      setRawSpec(null);
      setFileName('');
      setMessage('Please upload a valid OpenAPI JSON file. YAML support can be added when its parser is available.');
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

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 lg:p-10">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight">Store Integration</h2>
        <p className="mt-1 text-sm text-on-surface-variant">Upload an OpenAPI schema and let AI identify endpoints, entities, and setup notes.</p>
      </div>

      {message && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">{message}</p>}

      <section className="rounded-2xl border border-outline-variant/40 bg-white p-6 shadow-sm">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <label className="block text-sm font-semibold">Platform name<input value={platformName} onChange={(event) => setPlatformName(event.target.value)} placeholder="e.g. Shopify or Custom API" className="mt-2 w-full rounded-xl border border-outline-variant px-3 py-2.5 text-sm" /></label>
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-primary px-4 py-2.5 text-sm font-bold text-primary hover:bg-blue-50"><Upload className="h-4 w-4" />Upload OpenAPI JSON<input type="file" accept="application/json,.json" className="hidden" onChange={selectFile} /></label>
        </div>

        <div className="mt-5 rounded-xl bg-surface-container-low p-4">
          <div className="flex items-center gap-3"><FileJson2 className="h-5 w-5 text-primary" /><div><p className="text-sm font-bold">{fileName || 'No schema selected'}</p><p className="text-xs text-on-surface-variant">{rawSpec ? 'Ready for AI analysis.' : 'Export your OpenAPI specification as a JSON file, then upload it here.'}</p></div></div>
        </div>

        <button type="button" disabled={!rawSpec || loading} onClick={analyzeSchema} className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />}{loading ? 'Analyzing schema…' : 'Analyze with AI'}</button>
      </section>

      {report && <section className="rounded-2xl border border-outline-variant/40 bg-white p-6 shadow-sm"><div className="mb-4 flex items-center gap-2"><Bot className="h-5 w-5 text-primary" /><h3 className="font-bold">AI integration notes</h3></div><pre className="max-h-[560px] overflow-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-100">{JSON.stringify(report, null, 2)}</pre></section>}
    </div>
  );
}
