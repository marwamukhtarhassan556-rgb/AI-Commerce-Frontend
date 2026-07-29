import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Mail, Lock, Eye, EyeOff, TrendingUp, DollarSign, Loader2 } from 'lucide-react';
import { loginUser, isAuthenticated, getRedirectPathByRole, decodeToken } from '../api/authService';

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (isAuthenticated()) {
      const token = localStorage.getItem('token');
      const details = decodeToken(token);
      const role = details?.role || localStorage.getItem('userRole');
      navigate(getRedirectPathByRole(role), { replace: true });
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const successMessage = location.state?.message || '';

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (error) setError('');
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const result = await loginUser(formData.email, formData.password);
      const redirectTo = location.state?.from?.pathname || result.redirectPath || '/merchant/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      console.error('Sign In Error:', err);
      
      const status = err.response?.status;
      const data = err.response?.data;
      
      let serverMessage = 'Invalid credentials. Please check your email and password.';
      
      if (status === 401) {
        serverMessage = data?.message || data?.title || 'Invalid email or password.';
      } else if (status === 403) {
        serverMessage = data?.message || 'Please verify your email before login.';
      } else if (data?.message) {
        serverMessage = data.message;
      } else if (data?.title) {
        serverMessage = data.title;
      } else if (typeof data === 'string') {
        serverMessage = data;
      }
      
      setError(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white font-sans antialiased overflow-x-hidden">
      {/* LEFT PANE */}
      <div className="hidden lg:flex lg:w-1/2 min-w-0 flex-col justify-between p-8 xl:p-12 bg-gradient-to-br from-[#0F0C31] via-[#1A1454] to-[#0A0724] relative overflow-hidden text-white select-none shrink-0 min-h-screen">
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: '28px 28px'
          }}
        />
        
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shadow-lg backdrop-blur-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">CommerceMind AI</span>
        </div>

        <div className="relative z-10 max-w-md my-auto py-8">
          <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Welcome back to the Future of Social Commerce.
          </h1>

          <div className="mt-8 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl flex items-center justify-between gap-4 w-full transition-all duration-300">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="block text-[10px] font-bold tracking-wider uppercase text-emerald-400/90 truncate">
                  NEW CONVERSION
                </span>
                <span className="text-xs sm:text-sm font-bold text-white tracking-wide truncate block">
                  Sale! +$149.00 from WhatsApp
                </span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-8">
            <span className="w-8 h-1.5 bg-white rounded-full transition-all" />
            <span className="w-2 h-1.5 bg-white/30 rounded-full" />
            <span className="w-2 h-1.5 bg-white/30 rounded-full" />
          </div>
        </div>

        <div className="relative z-10 text-xs text-indigo-200/60 font-medium">
          Automated sales and customer support powered by AI agents.
        </div>
      </div>

      {/* RIGHT PANE */}
      <div className="flex-1 w-full lg:w-1/2 min-w-0 flex flex-col justify-between p-6 sm:p-10 xl:p-16 bg-white min-h-screen overflow-y-auto">
        <div className="max-w-md w-full mx-auto my-auto py-6">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-gray-900">CommerceMind AI</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Sign in to your account
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Enter your credentials to manage your AI commerce channels.
            </p>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative flex items-center w-full">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${
                    fieldErrors.email ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'
                  } rounded-xl text-gray-900 text-sm placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-sm`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative flex items-center w-full">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-3 bg-gray-50 border ${
                    fieldErrors.password ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'
                  } rounded-xl text-gray-900 text-sm placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-sm`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none z-10 p-1"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-600">Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#3B38D8] hover:bg-[#302CB5] active:bg-[#2824A0] text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200 flex items-center justify-center gap-2 text-base disabled:opacity-75 disabled:cursor-not-allowed mt-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <span role="img" aria-label="rocket">🚀</span>
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wider font-semibold">
              <span className="bg-white px-4 text-gray-400">OR CONTINUE WITH</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-3 px-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-700 shadow-sm transition-all cursor-pointer truncate"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.1-6.68-4.93H1.21v3.15C3.21 21.36 7.32 24 12 24z" />
                <path fill="#FBBC05" d="M5.32 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.21C.44 8.11 0 9.99 0 12s.44 3.89 1.21 5.42l4.11-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.32 0 3.21 2.64 1.21 6.58l4.11 3.15c.94-2.83 3.57-4.98 6.68-4.98z" />
              </svg>
              <span className="truncate">Google</span>
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-2 py-3 px-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-700 shadow-sm transition-all cursor-pointer truncate"
            >
              <svg className="w-4 h-4 text-[#00A1E0] shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.8 8.4C18.1 7.1 16.7 6.2 15.2 6.2C14.7 6.2 14.2 6.3 13.8 6.5C12.9 4.7 11 3.5 8.8 3.5C5.8 3.5 3.3 5.7 2.8 8.6C1.1 9.4 0 11.2 0 13.2C0 16 2.2 18.2 5 18.2H18.5C21.5 18.2 24 15.7 24 12.7C24 9.9 21.8 7.6 18.8 8.4Z" />
              </svg>
              <span className="truncate">Salesforce</span>
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-gray-500 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-600 font-bold hover:underline">
              Sign Up
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400 font-medium pt-6 border-t border-gray-100 max-w-md w-full mx-auto">
          <span>© 2024 CommerceMind AI</span>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-gray-600 transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-gray-600 transition-colors">Terms</a>
            <a href="#help" className="hover:text-gray-600 transition-colors">Help</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;