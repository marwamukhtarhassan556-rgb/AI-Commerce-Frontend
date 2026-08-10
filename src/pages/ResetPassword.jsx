import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Eye, EyeOff, KeyRound, Loader2 } from 'lucide-react';
import api from '../api/axiosConfig';
import { getUserErrorMessage } from '../utils/errorMessage';
import './auth.css';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const email = params.get('email') || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    if (!token || !email) return setError('This reset link is incomplete. Please request a new one.');
    if (newPassword.length < 8) return setError('Your new password must contain at least 8 characters.');
    if (newPassword !== confirmPassword) return setError('The passwords do not match.');
    setLoading(true); setError('');
    try {
      const response = await api.post('/api/auth/reset-password', {
        token,
        email,
        newPassword,
        confirmNewPassword: confirmPassword,
      });
      if (response.status === 200 || response.data?.succeeded) {
        setSuccess(true);
        window.setTimeout(() => navigate('/signin'), 1800);
      } else setError(getUserErrorMessage({ response: { data: response.data } }, 'We could not reset your password. Please request a new link.', 'password-reset'));
    } catch (err) {
      setError(getUserErrorMessage(err, 'We could not reset your password. Please request a new link.', 'password-reset'));
    } finally { setLoading(false); }
  }

  return <div className="auth-page">
    <main className="auth-content">
      <div className="auth-topbar"><Link className="auth-brand" to="/"><b>AI</b>Commerce</Link></div>
      <section className="auth-card">
        {success ? <div className="auth-success"><div className="auth-icon"><CheckCircle size={27} /></div><h2>Password updated</h2><p className="auth-subtitle">Your password has been changed. Redirecting you to sign in…</p></div> : <>
          <div className="auth-icon"><KeyRound size={23} /></div><h1>Create a new password</h1>
          <p className="auth-subtitle">Choose a strong password with at least 8 characters.</p>
          {error && <div className="auth-alert" role="alert">{error}</div>}
          <form className="auth-form" onSubmit={handleSubmit}>
            <PasswordField id="newPassword" label="New password" value={newPassword} onChange={setNewPassword} show={showPassword} setShow={setShowPassword} />
            <PasswordField id="confirmPassword" label="Confirm new password" value={confirmPassword} onChange={setConfirmPassword} show={showPassword} setShow={setShowPassword} />
            <button className="auth-button" disabled={loading} type="submit">{loading ? <><Loader2 size={18} className="animate-spin" /> Updating…</> : 'Reset password'}</button>
          </form>
        </>}
        <footer className="auth-footer"><Link className="auth-link" to="/signin"><ArrowLeft size={16} /> Back to sign in</Link></footer>
      </section>
    </main>
  </div>;
}

function PasswordField({ id, label, value, onChange, show, setShow }) {
  return <div className="auth-field"><label htmlFor={id}>{label}</label><div className="auth-input-wrap">
    <KeyRound size={18} /><input className="auth-input" id={id} type={show ? 'text' : 'password'} value={value} onChange={(event) => onChange(event.target.value)} required autoComplete={id === 'newPassword' ? 'new-password' : 'new-password'} />
    <button type="button" className="password-visibility" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow(!show)}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
  </div></div>;
}
