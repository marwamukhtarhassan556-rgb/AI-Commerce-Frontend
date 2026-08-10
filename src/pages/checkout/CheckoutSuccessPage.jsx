import { ArrowRight, CheckCircle2, Download, ShieldCheck } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

export default function CheckoutSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'Your selected plan';
  const invoice = searchParams.get('invoice') || 'Available from your payment provider';
  const renewal = searchParams.get('renewal') || 'Shown in your billing portal';
  const invoiceUrl = searchParams.get('invoice_url');
  const storeExists = Boolean(localStorage.getItem('currentStoreId') || localStorage.getItem('storeId'));
  const destination = storeExists ? '/merchant/dashboard' : '/onboarding?step=4';

  useEffect(() => {
    const timer = window.setTimeout(() => navigate(destination, { replace: true }), 2500);
    return () => window.clearTimeout(timer);
  }, [destination, navigate]);

  return <CheckoutShell><div className="checkout-status-card text-center"><div className="checkout-success-icon"><CheckCircle2 /></div><h1>Subscription Successful!</h1><p className="checkout-status-copy">{storeExists ? 'Your payment has been processed successfully. Taking you to your dashboard…' : 'Your payment has been processed successfully. Create your store to finish setup.'}</p><div className="checkout-details text-left"><Detail label="Selected plan" value={plan} strong /><Detail label="Invoice number" value={invoice} /><Detail label="Renewal date" value={renewal} /></div><Link to={destination} className="checkout-primary-action">{storeExists ? 'Go to Dashboard now' : 'Create My Store'} <ArrowRight className="h-5 w-5" /></Link>{invoiceUrl && <a href={invoiceUrl} target="_blank" rel="noreferrer" className="checkout-secondary-action"><Download className="h-4 w-4" />Download invoice</a>}</div></CheckoutShell>;
}

function Detail({ label, value, strong }) { return <div className="flex items-start justify-between gap-6 py-3"><span>{label}</span><b className={strong ? '' : 'font-medium'}>{value}</b></div>; }
function CheckoutShell({ children }) { return <div className="checkout-page"><header className="checkout-header"><Link to="/" className="checkout-brand">AICommerce Pay</Link><span className="inline-flex items-center gap-2 text-sm text-slate-600"><ShieldCheck className="h-4 w-4 text-blue-600" />Secure checkout</span></header><main className="checkout-main">{children}</main><footer className="checkout-footer">AICommerce · Secure subscription checkout</footer></div>; }
