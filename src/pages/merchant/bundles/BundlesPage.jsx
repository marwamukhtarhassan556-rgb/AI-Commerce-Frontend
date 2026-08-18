import { Gift, Sparkles } from 'lucide-react';
import BundlesTab from '../catalog/BundlesTab';

export default function BundlesPage() {
  const storeId = localStorage.getItem('currentStoreId') || localStorage.getItem('storeId');

  return <main className="min-h-screen bg-surface p-6 text-on-surface">
    <div className="mb-7"><span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary"><Sparkles className="h-4 w-4" />AI Commerce</span><h1 className="mt-2 flex items-center gap-3 text-2xl font-bold"><span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-fixed text-primary"><Gift className="h-5 w-5" /></span>Bundle management</h1><p className="mt-2 text-sm text-on-surface-variant">Track copied promo bundles, manage top bundles, and create AI-powered bundle suggestions.</p></div>
    {!storeId ? <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Select a store before managing bundles.</p> : <section className="overflow-hidden rounded-2xl border border-outline-variant/40 bg-white shadow-sm"><BundlesTab storeId={storeId} /></section>}
  </main>;
}
