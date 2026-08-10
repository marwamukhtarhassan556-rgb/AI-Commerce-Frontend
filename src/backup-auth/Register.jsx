import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, Eye, EyeOff, Loader2, MessageSquare, Camera, ShoppingBag, Shield, CheckCircle } from 'lucide-react';
import { registerUser, isAuthenticated, getRedirectPathByRole, decodeToken } from '../api/authService';

const Register = () => {
  const navigate = useNavigate();
  
  // لو مسجل دخول → redirect للـ Dashboard
  useEffect(() => {
    if (isAuthenticated()) {
      const token = localStorage.getItem('token');
      const details = decodeToken(token);
      const role = details?.role || localStorage.getItem('userRole');
      navigate(getRedirectPathByRole(role), { replace: true });
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (error) setError('');
  };

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required.';
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required.';
    }
    if (!formData.email) {
      errors.email = 'Business email is required.';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address.';
    }
    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long.';
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
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
      const response = await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      // Backend بيرجع: { succeeded, message, errors }
      if (response.succeeded === true) {
        navigate('/signin', { 
          state: { message: response.message || 'Account created successfully! Please verify your email before signing in.' } 
        });
      } else {
        const errorMessages = response.errors?.length > 0 
          ? response.errors.join('. ') 
          : (response.message || 'Registration failed. Please try again.');
        setError(errorMessages);
      }
    } catch (err) {
      console.error('Registration Error:', err);
      
      const status = err.response?.status;
      const data = err.response?.data;
      
      let serverMessage = 'Registration failed. Email may already exist or password is too weak.';
      
      if (status === 400 && data?.errors) {
        serverMessage = Array.isArray(data.errors) 
          ? data.errors.join('. ') 
          : data.errors;
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
      <div className="hidden lg:flex lg:w-1/2 min-w-0 flex-col justify-between p-8 xl:p-12 bg-linear-to-br from-[#0F0C31] via-[#1A1454] to-[#0A0724] relative overflow-hidden text-white select-none shrink-0 min-h-screen">
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
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-6 shadow-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Enterprise Ready</span>
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight text-white">
            No-code integration. Set up in 3 minutes.
          </h1>
          <p className="text-sm text-indigo-200/70 mt-3 leading-relaxed max-w-md">
            Connect your existing commerce ecosystem directly to our AI brain without a single line of code.
          </p>

          <div className="mt-8 p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl relative overflow-hidden w-full">
            <div className="grid grid-cols-3 items-center gap-3 text-center">
              <div className="space-y-3">
                <div className="w-11 h-11 mx-auto rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex flex-col items-center justify-center text-indigo-300 shadow-md">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-[9px] font-semibold mt-0.5">WhatsApp</span>
                </div>
                <div className="w-11 h-11 mx-auto rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex flex-col items-center justify-center text-indigo-300 shadow-md">
                  <Camera className="w-4 h-4" />
                  <span className="text-[9px] font-semibold mt-0.5">Instagram</span>
                </div>
              </div>

              <div className="relative flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 border-2 border-indigo-300/40 flex items-center justify-center text-white shadow-xl shadow-purple-500/30">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <span className="text-[10px] font-bold text-indigo-200 mt-2">AI Core</span>
              </div>

              <div className="space-y-3">
                <div className="w-11 h-11 mx-auto rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex flex-col items-center justify-center text-indigo-300 shadow-md">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="text-[9px] font-semibold mt-0.5">Web Store</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-xs text-indigo-200/60 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> Free 14-day trial
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> Cancel anytime
          </span>
        </div>
      </div>

      {/* RIGHT PANE */}
      <div className="flex-1 w-full lg:w-1/2 min-w-0 flex flex-col justify-between p-6 sm:p-10 xl:p-16 bg-white min-h-screen overflow-y-auto">
        <div className="max-w-md w-full mx-auto my-auto py-4">
          <div className="grid grid-cols-3 gap-2 mb-8">
            <div className="h-1.5 bg-[#3B38D8] rounded-full" />
            <div className="h-1.5 bg-gray-200 rounded-full" />
            <div className="h-1.5 bg-gray-200 rounded-full" />
          </div>

          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Create your account
            </h2>
            <p className="text-sm text-gray-500 mt-1.5">
              Start your 14-day free trial. No credit card required.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  First Name
                </label>
                <div className="relative flex items-center w-full">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${
                      fieldErrors.firstName ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'
                    } rounded-xl text-gray-900 text-sm placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-sm`}
                  />
                </div>
                {fieldErrors.firstName && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Last Name
                </label>
                <div className="relative flex items-center w-full">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border ${
                      fieldErrors.lastName ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'
                    } rounded-xl text-gray-900 text-sm placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-sm`}
                  />
                </div>
                {fieldErrors.lastName && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Business Email
              </label>
              <div className="relative flex items-center w-full">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@company.com"
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
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
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
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative flex items-center w-full">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-10 py-3 bg-gray-50 border ${
                    fieldErrors.confirmPassword ? 'border-red-500 ring-1 ring-red-500' : 'border-gray-200'
                  } rounded-xl text-gray-900 text-sm placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-sm`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none z-10 p-1"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-xs text-red-600 mt-1 font-medium">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-[#3B38D8] hover:bg-[#302CB5] active:bg-[#2824A0] text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200 flex items-center justify-center gap-2 text-base disabled:opacity-75 disabled:cursor-not-allowed mt-4 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Continue to Store Details</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500 font-medium">
            Already have an account?{' '}
            <Link to="/signin" className="text-indigo-600 font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 font-medium pt-4 border-t border-gray-100 max-w-md w-full mx-auto">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-gray-400" /> 256-bit encryption
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-gray-400" /> GDPR Compliant
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;