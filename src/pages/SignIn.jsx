import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import api from '../api/axiosConfig';

const SignIn = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.succeeded || response.data.token || response.data.accessToken) {
        // حفظ الـ token إذا وجد
        const accessToken = response.data.token || response.data.accessToken;
        if (accessToken) {
          localStorage.setItem('token', accessToken);
        }
        if (response.data.refreshToken) localStorage.setItem('refreshToken', response.data.refreshToken);
        if (response.data.aiToken || response.data.aiAccessToken) {
          localStorage.setItem('aiToken', response.data.aiToken || response.data.aiAccessToken);
        }
        const sessionUser = response.data.user || response.data.profile || {};
        const userId = response.data.userId || response.data.user_id || sessionUser.id || sessionUser.userId || sessionUser.user_id;
        const organizationId = response.data.organizationId || response.data.organization_id || response.data.orgId || response.data.org_id || sessionUser.organizationId || sessionUser.organization_id || sessionUser.orgId || sessionUser.org_id;
        if (userId) localStorage.setItem('userId', String(userId));
        else localStorage.removeItem('userId');
        if (organizationId) localStorage.setItem('organizationId', String(organizationId));
        else localStorage.removeItem('organizationId');
        localStorage.removeItem('orgId');
        const storeId = response.data.storeId || response.data.store_id;
        if (storeId) {
          localStorage.setItem('storeId', String(storeId));
          localStorage.setItem('currentStoreId', String(storeId));
        } else {
          localStorage.removeItem('storeId');
          localStorage.removeItem('currentStoreId');
        }
        const user = response.data.user || response.data.profile || {};
        localStorage.setItem('merchantProfile', JSON.stringify({
          firstName: response.data.firstName || response.data.first_name || user.firstName || user.first_name || '',
          lastName: response.data.lastName || response.data.last_name || user.lastName || user.last_name || '',
          name: response.data.name || user.name || [response.data.firstName || response.data.first_name || user.firstName || user.first_name || '', response.data.lastName || response.data.last_name || user.lastName || user.last_name || ''].filter(Boolean).join(' ') || '',
          email: response.data.email || user.email || formData.email,
        }));
        // التوجيه للوحة التحكم بعد النجاح
        // Replace the sign-in history entry so browser Back cannot expose a stale
        // dashboard route while the seller is completing onboarding.
        navigate(storeId ? '/merchant/dashboard' : '/onboarding?step=3', { replace: true });
      } else {
        setError(response.data.message || 'Failed to sign in.');
      }
    } catch (err) {
      console.error('Sign In Error:', err);
      const data = err.response?.data;
      const validationErrors = Array.isArray(data?.errors)
        ? data.errors.join(' ')
        : Object.values(data?.errors || {}).flat().join(' ');
      const message =
        validationErrors ||
        data?.message ||
        data?.detail ||
        data?.title ||
        'Invalid email or password. Please try again.';
      if (/(verify|verification|confirm).*(email)|(email).*(verify|verification|confirm)/i.test(message)) {
        navigate(`/verify-email?email=${encodeURIComponent(formData.email.trim())}`);
      } else setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // توجيه المستخدم لمسار Google OAuth الخاص بالباك إند
    window.location.href = `${api.defaults.baseURL}/api/auth/google`;
  };

  return (
    <div className="signin-themed auth-themed min-h-screen bg-[#020617] text-slate-100 flex flex-col justify-between items-center relative overflow-hidden font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-88 bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-75 h-75 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* MAIN CONTAINER */}
      <main className="w-full max-w-[440px] px-6 py-12 my-auto relative z-10 flex flex-col items-center animate-fade-in">
        
        {/* BRAND HEADER */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-white shadow-lg backdrop-blur-md">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">AICommerce</h1>
          </div>
          <p className="text-sm text-slate-400">Intelligent commerce for modern businesses.</p>
        </div>

        {/* LOGIN CARD */}
        <div className="auth-panel w-full bg-[#0a0e1a]/80 backdrop-blur-2xl border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <header className="mb-6">
              <h2 className="text-xl font-bold text-white mb-1">Sign In</h2>
              <p className="text-sm text-slate-400">Access your merchant dashboard</p>
            </header>

            {error && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* EMAIL FIELD */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#020617] border border-slate-700/80 rounded-xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* PASSWORD FIELD */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-[11px] font-semibold text-blue-500 hover:text-blue-400 hover:underline transition-all"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 bg-[#020617] border border-slate-700/80 rounded-xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* REMEMBER ME */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-slate-700 bg-[#020617] text-blue-600 focus:ring-blue-600 focus:ring-offset-0 cursor-pointer"
                />
                <label
                  htmlFor="remember"
                  className="text-xs text-slate-400 cursor-pointer select-none"
                >
                  Stay signed in for 30 days
                </label>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-semibold rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-150 flex items-center justify-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* GOOGLE SIGN IN */}
            <div className="mt-6 pt-6 border-t border-slate-800/80">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full bg-[#020617] border border-slate-700/80 hover:bg-slate-900/60 text-slate-300 py-2.5 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2.5 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          </div>

          {/* CARD FOOTER */}
          <div className="auth-panel-footer bg-black/30 px-6 py-4 text-center border-t border-slate-800/80">
            <p className="text-xs text-slate-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-blue-500 font-bold hover:text-blue-400 hover:underline transition-all"
              >
                Sign up for a new account
              </Link>
            </p>
          </div>
        </div>

        {/* FOOTER LINKS */}
        <footer className="mt-8 flex flex-wrap justify-center gap-6">
          <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            Terms of Service
          </a>
          <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            Contact Support
          </a>
        </footer>
      </main>
    </div>
  );
};

export default SignIn;
