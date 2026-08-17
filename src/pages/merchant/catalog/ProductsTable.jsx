import { useEffect, useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { productsApi } from '../../../api/integrationApi';
import ProductDrawer from './ProductDrawer';

/* Loading remote data requires state updates from effects. */
/* eslint-disable react-hooks/set-state-in-effect */

const PAGE_SIZE = 100;

export default function ProductsTable({ storeId, categories, activeCategory, onSummaryChange }) {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!storeId) return;
    let mounted = true;
    setLoading(true); setError('');
    productsApi.list({ storeId, pageIndex: 1, pageSize: PAGE_SIZE, status }).then(({ data }) => {
      if (!mounted) return;
      setProducts(data?.items || []);
    }).catch(() => mounted && setError('Products could not be loaded. Please try again.')).finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [storeId, status]);

  const categoryNames = useMemo(() => new Map(categories.map((item) => [item.id, item.name])), [categories]);
  const visibleProducts = useMemo(() => activeCategory === 'all' ? products : products.filter((product) => product.categoryId === activeCategory), [products, activeCategory]);
  useEffect(() => {
    const stockValue = visibleProducts.reduce((total, item) => total + Number(item.price || 0) * Math.max(0, Number(item.stock || 0)), 0);
    const lowStock = visibleProducts.filter((item) => Number(item.stock) >= 0 && Number(item.stock) <= 10).length;
    onSummaryChange?.({ stockValue, lowStock });
  }, [visibleProducts, onSummaryChange]);

  const openProduct = (product) => setSelectedProduct({ ...product, name: product.title, category: categoryNames.get(product.categoryId) || 'Uncategorized', stock: `${Math.max(0, Number(product.stock || 0))} units`, price: `$${Number(product.price || 0).toFixed(2)}`, img: product.mainImageUrl });
  const handleDiscountUpdated = (productId, maxAllowedDiscount) => {
    setProducts((items) => items.map((item) => item.id === productId ? { ...item, maxAllowedDiscount } : item));
    setSelectedProduct((item) => item?.id === productId ? { ...item, maxAllowedDiscount } : item);
  };

  return <div>
    <div className="p-4 border-b border-outline-variant/30 flex items-center bg-white"><label className="text-xs font-medium text-on-surface-variant mr-2" htmlFor="product-status">Status:</label><div className="relative"><select id="product-status" value={status} onChange={(event) => setStatus(event.target.value)} className="appearance-none px-3 py-1.5 pr-8 bg-surface-container-low border border-outline-variant/50 rounded-lg text-xs font-semibold"><option value="">All statuses</option><option value="active">Active</option><option value="draft">Draft</option><option value="archived">Archived</option></select><ChevronDown className="pointer-events-none absolute right-2 top-1.5 w-4 h-4 text-on-surface-variant" /></div></div>
    {error && <p className="m-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-error">{error}</p>}
    <div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead className="bg-surface-container-low border-b border-outline-variant/30"><tr>{['Product', 'Category', 'Price', 'Stock', 'Status'].map((heading) => <th key={heading} className="px-6 py-4 text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">{heading}</th>)}</tr></thead><tbody className="divide-y divide-outline-variant/20">
      {loading && <tr><td colSpan="5" className="px-6 py-8 text-center text-sm text-on-surface-variant">Loading products...</td></tr>}
      {!loading && visibleProducts.length === 0 && <tr><td colSpan="5" className="px-6 py-8 text-center text-sm text-on-surface-variant">No products found.</td></tr>}
      {!loading && visibleProducts.map((product) => { const stock = Number(product.stock || 0); return <tr key={product.id} onClick={() => openProduct(product)} className="hover:bg-surface transition-colors cursor-pointer"><td className="px-6 py-4"><div className="flex items-center"><div className="w-12 h-12 rounded-lg bg-surface-container-low shrink-0 mr-4 p-1 border border-outline-variant/30">{product.mainImageUrl && <img src={product.mainImageUrl} alt={product.title} className="w-full h-full object-cover rounded-md" />}</div><div><p className="font-semibold text-sm text-on-surface mb-0.5">{product.title}</p><p className="text-xs text-on-surface-variant">ID: {product.id}</p></div></div></td><td className="px-6 py-4 text-xs text-on-surface-variant">{categoryNames.get(product.categoryId) || 'Uncategorized'}</td><td className="px-6 py-4 text-xs font-bold text-on-surface">${Number(product.price || 0).toFixed(2)}</td><td className={`px-6 py-4 text-xs ${stock < 0 ? 'font-semibold text-error' : 'text-on-surface'}`}>{stock < 0 ? 'Out of stock' : `${stock} units`}</td><td className="px-6 py-4"><span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[11px] font-semibold">{product.status || 'Unknown'}</span></td></tr>; })}
    </tbody></table></div>
    <div className="px-6 py-4 border-t border-outline-variant/30 bg-white"><p className="text-xs text-on-surface-variant">Showing all {visibleProducts.length} matching products</p></div>
    <ProductDrawer key={selectedProduct?.id || 'closed'} isOpen={Boolean(selectedProduct)} onClose={() => setSelectedProduct(null)} product={selectedProduct} storeId={storeId} onDiscountUpdated={handleDiscountUpdated} />
  </div>;
}
