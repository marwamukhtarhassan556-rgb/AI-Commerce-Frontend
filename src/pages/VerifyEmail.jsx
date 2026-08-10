import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Mail, ShieldCheck } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import './auth.css';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const email = params.get('email');
  const verified = ['success', 'verified'].includes((params.get('status') || '').toLowerCase());

  return <div className="auth-page">
    <main className="auth-content">
      <div className="auth-topbar"><Link className="auth-brand" to="/"><BrandLogo light /></Link></div>
      <section className="auth-card text-center">
        <div className={`auth-icon mx-auto ${verified ? 'text-emerald-500' : ''}`}>{verified ? <CheckCircle2 size={28} /> : <Mail size={26} />}</div>
        {verified ? <>
          <h1>Email verified</h1>
          <p className="auth-subtitle">Your email has been confirmed successfully. You can now sign in to your Navi merchant account.</p>
          <Link to={`/signin${email ? `?email=${encodeURIComponent(email)}` : ''}`} className="auth-button mt-6 w-full">Continue to sign in</Link>
        </> : <>
          <h1>Check your email</h1>
          <p className="auth-subtitle">We sent a verification link{email ? <> to <strong className="break-all text-slate-200">{email}</strong></> : ''}. Open it to activate your account.</p>
          <div className="flex items-start gap-2 rounded-xl border border-slate-700 bg-slate-900/60 p-3 text-left text-xs leading-5 text-slate-400"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />The link may take a minute to arrive. Please check your spam folder too.</div>
          <Link to="/signin" className="auth-link mt-7">Back to sign in</Link>
        </>}
      </section>
    </main>
  </div>;
}
