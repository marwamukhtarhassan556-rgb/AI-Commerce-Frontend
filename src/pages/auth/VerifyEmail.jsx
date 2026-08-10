import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Mail, ShieldCheck } from 'lucide-react';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const email = params.get('email');
  const verified = ['success', 'verified'].includes((params.get('status') || '').toLowerCase());

  return <div className="auth-page min-h-screen bg-[#020617] px-6 py-12 text-slate-100">
    <main className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-md items-center justify-center">
      <section className="w-full rounded-2xl border border-slate-800 bg-[#0a0e1a]/90 p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${verified ? 'bg-emerald-500/15 text-emerald-400' : 'bg-blue-500/15 text-blue-400'}`}>
          {verified ? <CheckCircle2 className="h-8 w-8" /> : <Mail className="h-7 w-7" />}
        </div>
        {verified ? <>
          <h1 className="mt-6 text-2xl font-bold text-white">Email verified</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">Your email has been confirmed successfully. You can now sign in to your merchant account.</p>
          <Link to="/signin" className="mt-7 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500">Continue to sign in</Link>
        </> : <>
          <h1 className="mt-6 text-2xl font-bold text-white">Check your email</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">We sent a verification link{email ? <> to <strong className="font-semibold text-slate-200">{email}</strong></> : ''}. Open it to activate your account, then return here to sign in.</p>
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-left text-xs leading-5 text-slate-400"><ShieldCheck className="h-5 w-5 shrink-0 text-blue-400" />The verification link may take a minute to arrive. Check your spam folder too.</div>
          <Link to="/signin" className="mt-7 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-blue-500 hover:text-white">Back to sign in</Link>
        </>}
      </section>
    </main>
  </div>;
}
