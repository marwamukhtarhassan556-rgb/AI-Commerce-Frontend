import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, LockKeyhole, Mail } from 'lucide-react';
import api from '../api/axiosConfig';
import { getUserErrorMessage } from '../utils/errorMessage';
import BrandLogo from '../components/BrandLogo';
import './auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/api/auth/forgot-password', { email });
      if (response.status === 200 || response.data?.succeeded) setIsSent(true);
      else setError(getUserErrorMessage({ response: { data: response.data } }, 'We could not send the reset link. Please try again.'));
    } catch (err) {
      setError(getUserErrorMessage(err, 'We could not send the reset link. Please try again.', 'password-reset'));
    } finally { setLoading(false); }
  }

  return <div className="auth-page auth-business-page">
    <main className="auth-content">
      <div className="auth-topbar"><Link className="auth-brand" to="/"><BrandLogo light /></Link></div>
      <section className="auth-card">
        {!isSent ? <>
          <div className="auth-icon"><LockKeyhole size={23} /></div>
          <h1>Forgot password?</h1>
          <p className="auth-subtitle">Enter the email address for your account and we’ll send you a secure reset link.</p>
          {error && <div className="auth-alert" role="alert">{error}</div>}
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field"><label htmlFor="email">Email address</label><div className="auth-input-wrap"><Mail size={18} /><input className="auth-input" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" required autoComplete="email" /></div></div>
            <button className="auth-button" disabled={loading} type="submit">{loading ? <><Loader2 size={18} className="animate-spin" /> Sending link…</> : <>Send reset link <ArrowRight size={18} /></>}</button>
          </form>
        </> : <div className="auth-success">
          <div className="auth-icon"><CheckCircle size={27} /></div><h2>Check your inbox</h2>
          <p className="auth-subtitle">We sent password-reset instructions to <strong>{email}</strong>. The link may take a minute to arrive.</p>
          <button type="button" className="auth-link" onClick={() => setIsSent(false)}>Use a different email</button>
        </div>}
        <footer className="auth-footer"><Link className="auth-link" to="/signin"><ArrowLeft size={16} /> Back to sign in</Link></footer>
      </section>
    </main>
  </div>;
}
