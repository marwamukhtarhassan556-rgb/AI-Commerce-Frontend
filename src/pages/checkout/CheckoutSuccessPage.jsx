import { ArrowRight, CheckCircle2, Download, ShieldCheck } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { storesApi } from '../../api/integrationApi';

export default function CheckoutSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'Your selected plan';
  const invoice = searchParams.get('invoice') || 'Available from your payment provider';
  const renewal = searchParams.get('renewal') || 'Shown in your billing portal';
  const invoiceUrl = searchParams.get('invoice_url');
  const [storeExists, setStoreExists] = useState(() => Boolean(localStorage.getItem('currentStoreId') || localStorage.getItem('storeId')));
  const [checkingStore, setCheckingStore] = useState(() => !Boolean(localStorage.getItem('currentStoreId') || localStorage.getItem('storeId')));
  const destination = storeExists ? '/merchant/dashboard' : '/onboarding?step=4';

  useEffect(() => {
    let active = true;
    const confirmExistingStore = async () => {
      if (storeExists) return;
      try {
        const { data } = await storesApi.list();
        const stores = Array.isArray(data) ? data : (data?.items || data?.stores || []);
        const existingStore = stores[0];
        const storeId = existingStore?.id || existingStore?.storeId || existingStore?.store_id;
        if (active && storeId) {
          localStorage.setItem('storeId', String(storeId));
          localStorage.setItem('currentStoreId', String(storeId));
          setStoreExists(true);
        }
      } catch {
        // Onboarding is the safe fallback when the store cannot be confirmed.
      } finally {
        if (active) setCheckingStore(false);
      }
    };
    void confirmExistingStore();
    return () => { active = false; };
  }, [storeExists]);

  useEffect(() => {
    if (checkingStore) return undefined;
    const timer = window.setTimeout(() => navigate(destination, { replace: true }), 2500);
    return () => window.clearTimeout(timer);
  }, [checkingStore, destination, navigate]);

  return <CheckoutShell><div className="checkout-status-card text-center"><div className="checkout-success-icon"><CheckCircle2 /></div><h1>Subscription Successful!</h1><p className="checkout-status-copy">{checkingStore ? 'Confirming your store setup…' : storeExists ? 'Your payment has been processed successfully. Taking you to your dashboard…' : 'Your payment has been processed successfully. Create your store to finish setup.'}</p><div className="checkout-details text-left"><Detail label="Selected plan" value={plan} strong /><Detail label="Invoice number" value={invoice} /><Detail label="Renewal date" value={renewal} /></div>{!checkingStore && <Link to={destination} className="checkout-primary-action">{storeExists ? 'Go to Dashboard now' : 'Create My Store'} <ArrowRight className="h-5 w-5" /></Link>}{invoiceUrl && <a href={invoiceUrl} target="_blank" rel="noreferrer" className="checkout-secondary-action"><Download className="h-4 w-4" />Download invoice</a>}</div></CheckoutShell>;
}

function Detail({ label, value, strong }) { return <div className="flex items-start justify-between gap-6 py-3"><span>{label}</span><b className={strong ? '' : 'font-medium'}>{value}</b></div>; }
function CheckoutShell({ children }) { return <div className="checkout-page"><header className="checkout-header"><Link to="/" className="checkout-brand">Navi Pay</Link><span className="inline-flex items-center gap-2 text-sm text-slate-600"><ShieldCheck className="h-4 w-4 text-blue-600" />Secure checkout</span></header><main className="checkout-main">{children}</main><footer className="checkout-footer">Navi · Secure subscription checkout</footer></div>; }
