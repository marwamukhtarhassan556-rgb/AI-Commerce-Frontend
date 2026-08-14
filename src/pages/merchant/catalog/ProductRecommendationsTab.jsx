import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { recommendationsApi } from '../../../api/integrationApi';
import { getUserErrorMessage } from '../../../utils/errorMessage';

export default function ProductRecommendationsTab({ storeId }) {
  const [message, setMessage] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const findProducts = async (event) => {
    event.preventDefault();
    if (!message.trim() || !storeId) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const { data } = await recommendationsApi.getProductRecommendations({ message, storeId, customerId: customerId || undefined });
      setResult(data);
    } catch (requestError) { setError(getUserErrorMessage(requestError, 'We could not find product recommendations. Please try again.')); }
    finally { setLoading(false); }
  };

  return <div className="p-6"><section className="mx-auto max-w-4xl rounded-2xl border border-outline-variant/40 bg-surface-container-low p-5"><div className="flex items-center gap-2"><span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Sparkles className="h-5 w-5" /></span><div><h3 className="font-bold">AI Product Recommendations</h3><p className="text-xs text-on-surface-variant">Match the right products to a customer need using your connected store catalog.</p></div></div><form onSubmit={findProducts} className="mt-5 grid gap-3 md:grid-cols-[1fr_12rem_auto]"><input required value={message} onChange={(event) => setMessage(event.target.value)} placeholder="e.g. Recommend a lightweight laptop for a design student" className="rounded-xl border border-outline-variant bg-white px-3 py-2.5 text-sm" /><input value={customerId} onChange={(event) => setCustomerId(event.target.value)} placeholder="Customer ID (optional)" className="rounded-xl border border-outline-variant bg-white px-3 py-2.5 text-sm" /><button disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}{loading ? 'Matching…' : 'Find products'}</button></form>{error && <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}</section>{result && <section className="mx-auto mt-6 max-w-5xl"><div className="mb-4 flex items-center justify-between"><div><h3 className="font-bold">Recommended for this request</h3><p className="mt-1 text-xs text-on-surface-variant">{result.total_count || result.products?.length || 0} product matches</p></div></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{(result.products || []).map((product) => <article key={product.product_id} className="overflow-hidden rounded-2xl border border-outline-variant/40 bg-white shadow-sm"><div className="h-36 bg-surface-container-low">{product.image_url && <img src={product.image_url} alt={product.title} className="h-full w-full object-cover" />}</div><div className="p-4"><h4 className="line-clamp-1 font-bold">{product.title}</h4><p className="mt-1 text-lg font-extrabold text-primary">{product.currency || ''} {product.price}</p>{product.match_reasons?.[0] && <p className="mt-2 line-clamp-2 text-xs leading-5 text-on-surface-variant">{product.match_reasons[0]}</p>}{product.product_url && <a href={product.product_url} target="_blank" rel="noreferrer" className="mt-4 inline-block text-xs font-bold text-primary hover:underline">View product</a>}</div></article>)}</div>{result.rationale && <p className="mx-auto mt-5 max-w-5xl rounded-xl bg-primary/5 px-4 py-3 text-sm text-on-surface-variant">{result.rationale}</p>}</section>}</div>;
}
