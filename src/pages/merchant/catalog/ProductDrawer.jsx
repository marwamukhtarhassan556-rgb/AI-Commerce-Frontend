import { useEffect, useState } from 'react';
import { X, Save, Upload, Trash2, Tag, Layers, DollarSign, Percent } from 'lucide-react';
import { productsApi } from '../../../api/integrationApi';
import { getUserErrorMessage } from '../../../utils/errorMessage';

export default function ProductDrawer({ isOpen, onClose, product, storeId, onDiscountUpdated }) {
  const [maxAllowedDiscount, setMaxAllowedDiscount] = useState('0');
  const [discountError, setDiscountError] = useState('');
  const [savingDiscount, setSavingDiscount] = useState(false);

  useEffect(() => {
    setMaxAllowedDiscount(product?.maxAllowedDiscount ?? product?.max_allowed_discount ?? 0);
    setDiscountError('');
  }, [product]);

  if (!isOpen) return null;

  const saveMaxDiscount = async () => {
    const discount = Number(maxAllowedDiscount);
    if (!Number.isFinite(discount) || discount < 0 || discount > 100) {
      setDiscountError('Enter a discount percentage from 0 to 100.');
      return;
    }

    setSavingDiscount(true);
    setDiscountError('');
    try {
      const { data } = await productsApi.updateMaxDiscount(product.id, storeId, discount);
      setMaxAllowedDiscount(data?.maxAllowedDiscount ?? discount);
      onDiscountUpdated?.(product.id, data?.maxAllowedDiscount ?? discount);
    } catch (error) {
      setDiscountError(getUserErrorMessage(error, 'We could not update the allowed discount. Please try again.'));
    } finally {
      setSavingDiscount(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[92vh] overflow-hidden rounded-2xl bg-white border border-outline-variant/40 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low">
            <div>
              <h3 className="text-lg font-bold text-on-surface">
                {product ? 'Product details' : 'Product details'}
              </h3>
              <p className="text-xs text-on-surface-variant">
                {product ? `SKU: ${product.sku || product.id || 'Not available'}` : 'Product information'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Product Image Upload */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                Product Image
              </label>
              <div className="border-2 border-dashed border-outline-variant hover:border-primary rounded-xl p-4 text-center bg-surface transition-colors cursor-pointer group">
                {product?.img ? (
                  <div className="relative w-24 h-24 mx-auto mb-2">
                    <img
                      src={product.img}
                      alt="Product"
                      className="w-full h-full object-cover rounded-lg border border-outline-variant/40"
                    />
                    <div className="absolute inset-0 bg-black/30 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Upload className="w-5 h-5 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="py-4">
                    <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-xs text-on-surface font-semibold">Click to upload image</p>
                    <p className="text-[10px] text-on-surface-variant">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                Product Title
              </label>
              <input
                type="text"
                defaultValue={product?.name || ''}
                placeholder="e.g. Luminous Desktop Lamp"
                className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>

            {/* Category & Price Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                  Category
                </label>
                <div className="relative">
                  <select
                    defaultValue={product?.category || 'Home Decor'}
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg px-3 py-2 text-xs text-on-surface appearance-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  >
                    <option value="Home Decor">Home Decor</option>
                    <option value="Apparel">Apparel</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                  </select>
                  <Tag className="w-3.5 h-3.5 text-on-surface-variant absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                  Price ($)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    defaultValue={product?.price?.replace('$', '') || ''}
                    placeholder="124.00"
                    className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg pl-7 pr-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                  <DollarSign className="w-3.5 h-3.5 text-on-surface-variant absolute left-2 top-2.5" />
                </div>
              </div>
            </div>

            {/* Stock Quantity */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                Stock Quantity
              </label>
              <div className="relative">
                <input
                  type="number"
                  defaultValue={product?.stock ? parseInt(product.stock) : 0}
                  placeholder="48"
                  className="w-full bg-surface-container-low border border-outline-variant/50 rounded-lg pl-8 pr-3 py-2 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
                <Layers className="w-3.5 h-3.5 text-on-surface-variant absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <label htmlFor="max-allowed-discount" className="block text-xs font-semibold text-on-surface uppercase tracking-wider">
                    Maximum allowed discount
                  </label>
                  <p className="mt-1 text-[11px] leading-4 text-on-surface-variant">
                    The AI will not offer a higher discount for this product.
                  </p>
                </div>
                <Percent className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    id="max-allowed-discount"
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    value={maxAllowedDiscount}
                    onChange={(event) => setMaxAllowedDiscount(event.target.value)}
                    className="w-full bg-white border border-outline-variant/50 rounded-lg pl-3 pr-8 py-2 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                    aria-describedby="max-discount-help"
                  />
                  <span className="absolute right-3 top-2 text-xs text-on-surface-variant">%</span>
                </div>
                <button
                  type="button"
                  onClick={saveMaxDiscount}
                  disabled={savingDiscount || !storeId}
                  className="shrink-0 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-on-primary-fixed-variant disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingDiscount ? 'Saving…' : 'Save limit'}
                </button>
              </div>
              {discountError && <p id="max-discount-help" className="mt-2 text-xs text-error">{discountError}</p>}
            </div>

            {/* Status Select */}
            <div>
              <label className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">
                Status
              </label>
              <div className="flex gap-3">
                {['Active', 'Draft', 'Archived'].map((statusOption) => (
                  <label
                    key={statusOption}
                    className="flex-1 flex items-center justify-center p-2 rounded-lg border border-outline-variant/50 text-xs font-semibold cursor-pointer transition-all hover:bg-surface-container-low has-checked:bg-primary-fixed has-checked:text-on-primary-fixed has-checked:border-primary"
                  >
                    <input
                      type="radio"
                      name="status"
                      value={statusOption}
                      defaultChecked={product?.status === statusOption || statusOption === 'Active'}
                      className="sr-only"
                    />
                    {statusOption}
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-outline-variant/30 bg-surface flex items-center justify-between">
            {product && (
              <button
                type="button"
                className="p-2 text-error hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Product"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center space-x-2 ml-auto">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-outline-variant text-on-surface-variant hover:bg-surface-container-low rounded-lg text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onClose}
                className="flex items-center space-x-1.5 px-4 py-2 bg-primary text-white hover:bg-on-primary-fixed-variant rounded-lg text-xs font-semibold shadow-sm transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>

        </div>
    </div>
  );
}
