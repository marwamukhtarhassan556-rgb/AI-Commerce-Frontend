import { useState } from 'react';
import { HelpCircle, Globe, Info, ArrowLeft } from 'lucide-react';
import { storesApi } from '../../../api/integrationApi';

export default function StoreDetailsStep({ onNext, onBack }) {
  const [formData, setFormData] = useState({
    storeName: '',
    description: '',
    platform: '',
    shopDomain: '',
    currency: 'USD',
    language: 'en',
    timezone: 'UTC-8'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await storesApi.create({
        name: formData.storeName,
        description: formData.description,
        platform: formData.platform,
        shopDomain: formData.shopDomain,
        currency: formData.currency,
        language: formData.language,
        timezone: formData.timezone,
      });
      const storeId = data?.storeId || data?.store_id || data?.id;
      if (!storeId) throw new Error('The store was created without a store ID.');
      localStorage.setItem('storeId', String(storeId));
      localStorage.setItem('currentStoreId', String(storeId));
      if (onNext) onNext({ ...formData, storeId });
    } catch (requestError) {
      setError(requestError.response?.data?.message || requestError.message || 'Could not create the store. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between font-sans text-slate-800">
      
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <h1 className="text-blue-700 font-bold text-lg">Merchant Onboarding</h1>
        <button className="text-slate-500 hover:bg-slate-100 p-2 rounded-full transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
      </header>

      {/* Main Form Area */}
      <main className="grow flex flex-col items-center justify-start py-8 px-4">
        <div className="w-full max-w-150 flex flex-col gap-6">
          
          {/* Step Context */}
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs uppercase font-semibold text-blue-600 tracking-wider block mb-1">
                STEP 4 OF 5
              </span>
              <h2 className="text-2xl font-bold text-slate-900">Tell us about your store</h2>
            </div>
            <span className="text-sm text-slate-500 font-medium">Store Setup: 1 of 2</span>
          </div>

          {/* Form Card */}
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm flex flex-col gap-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              {/* Store Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="storeName" className="text-sm font-medium text-slate-700">
                  Store Name
                </label>
                <input
                  type="text"
                  id="storeName"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  placeholder="Enter your business name"
                  className="w-full border border-slate-200 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="description" className="text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Briefly describe what you sell..."
                  className="w-full border border-slate-200 px-3.5 py-2.5 rounded-lg text-sm resize-none focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Platform & Domain */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="platform" className="text-sm font-medium text-slate-700">
                    Platform
                  </label>
                  <select
                    id="platform"
                    name="platform"
                    value={formData.platform}
                    onChange={handleChange}
                    className="w-full border border-slate-200 px-3.5 py-2.5 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="" disabled>Select Platform</option>
                    <option value="shopify">Shopify</option>
                    <option value="woocommerce">WooCommerce</option>
                    <option value="magento">Magento</option>
                    <option value="custom">Custom Build</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="shopDomain" className="text-sm font-medium text-slate-700">
                    Shop Domain
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="shopDomain"
                      name="shopDomain"
                      value={formData.shopDomain}
                      onChange={handleChange}
                      placeholder="mystore.com"
                      className="w-full border border-slate-200 px-3.5 py-2.5 pr-10 rounded-lg text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                    <Globe className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              {/* Currency & Language */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="currency" className="text-sm font-medium text-slate-700">
                    Currency
                  </label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full border border-slate-200 px-3.5 py-2.5 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="language" className="text-sm font-medium text-slate-700">
                    Language
                  </label>
                  <select
                    id="language"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full border border-slate-200 px-3.5 py-2.5 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>

              {/* Timezone */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="timezone" className="text-sm font-medium text-slate-700">
                  Timezone
                </label>
                <select
                  id="timezone"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleChange}
                  className="w-full border border-slate-200 px-3.5 py-2.5 rounded-lg text-sm bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="UTC-8">(UTC-08:00) Pacific Time</option>
                  <option value="UTC-5">(UTC-05:00) Eastern Time</option>
                  <option value="UTC+0">(UTC+00:00) Greenwich Mean Time</option>
                  <option value="UTC+1">(UTC+01:00) Central European Time</option>
                </select>
              </div>

            </form>

            {/* Info Box */}
            {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
            <div className="flex gap-3 bg-blue-50/60 p-3.5 rounded-lg items-start border border-blue-100">
              <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-600 leading-relaxed">
                These settings define how your products and analytics are displayed. You can update these later in the dashboard.
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between mt-2">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white h-11 px-8 rounded-lg font-medium text-sm transition-all shadow-sm"
            >
              {submitting ? 'Creating Store…' : 'Next Step'}
            </button>
          </div>

        </div>
      </main>

    </div>
  );
}
