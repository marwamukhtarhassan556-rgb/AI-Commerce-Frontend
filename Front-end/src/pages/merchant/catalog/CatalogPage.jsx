import { useEffect, useState } from 'react';
import { categoriesApi, storesApi } from '../../../api/integrationApi';
import ProductsTable from './ProductsTable';

export default function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [storeId, setStoreId] = useState(() => localStorage.getItem('currentStoreId') || localStorage.getItem('storeId'));
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState({ stockValue: 0, lowStock: 0 });

  useEffect(() => {
    if (storeId) return;
    storesApi.list().then(({ data }) => {
      const stores = Array.isArray(data)
        ? data
        : data?.items || data?.data?.items || data?.data || data?.result?.items || data?.result || [];
      const store = stores[0];
      if (!store?.id) throw new Error('No store');
      localStorage.setItem('currentStoreId', store.id);
      setStoreId(store.id);
    }).catch(() => setError('We could not determine the current store.'));
  }, [storeId]);

  useEffect(() => {
    if (!storeId) return;
    categoriesApi.list(storeId)
      .then(({ data }) => setCategories(Array.isArray(data) ? data : data?.items || []))
      .catch(() => setError('Categories could not be loaded.'));
  }, [storeId]);

  const categoryFilters = [{ id: 'all', name: 'All Products', count: null }, ...categories.map((item) => ({ id: item.id, name: item.name, count: item.productCount ?? 0 }))];

  return <div className="p-6 bg-surface min-h-screen text-on-surface">
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8"><h2 className="text-2xl font-bold">Product Catalog</h2></div>
    {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-error">{error}</p>}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white border border-outline-variant/40 rounded-xl p-6 shadow-sm"><h3 className="text-lg font-bold mb-4">Categories</h3><div className="flex flex-wrap gap-2">{categoryFilters.map((category) => <button key={category.id} onClick={() => setActiveCategory(category.id)} className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${activeCategory === category.id ? 'bg-primary-fixed text-on-primary-fixed' : 'hover:bg-surface-container-low text-on-surface-variant'}`}><span>{category.name}</span>{category.count !== null && <span className={`px-2 py-0.5 rounded text-[10px] ${activeCategory === category.id ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant'}`}>{category.count}</span>}</button>)}</div></div>
      <div className="bg-white border border-outline-variant/40 rounded-xl p-6 flex items-center justify-between shadow-sm"><div><p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-widest mb-1">Current page stock value</p><p className="text-3xl font-extrabold text-primary">${summary.stockValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p></div><div className="pl-6 border-l border-outline-variant/30"><p className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-widest mb-1">Low stock items</p><p className="text-2xl font-bold text-error">{summary.lowStock} Products</p></div></div>
    </div>
    <div className="bg-white border border-outline-variant/40 rounded-xl overflow-hidden shadow-sm"><ProductsTable storeId={storeId} categories={categories} activeCategory={activeCategory} onSummaryChange={setSummary} /></div>
  </div>;
}
