import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle2, Loader2 } from 'lucide-react';
import api from '../../api/axiosConfig';
import { getUserErrorMessage } from '../../utils/errorMessage';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response.data.succeeded || response.status === 200 || response.status === 201) {
        localStorage.setItem('merchantProfile', JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
        }));
        navigate(`/verify-email?email=${encodeURIComponent(formData.email.trim())}`);
      } else {
        setError(getUserErrorMessage({ response: { data: response.data } }, 'We could not create your account. Please try again.', 'registration'));
      }
    } catch (err) {
      console.error('Registration Error:', err);
      setError(getUserErrorMessage(err, 'We could not create your account. Please check your details and try again.', 'registration'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-themed auth-themed min-h-screen bg-[#020617] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-150 h-100 bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-100 h-100 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* TOP NAVIGATION */}
      <nav className="auth-register-nav bg-transparent border-b border-slate-800/50 h-16 flex items-center justify-between px-6 sm:px-12 max-w-7xl mx-auto w-full z-10">
        <Link to="/" className="text-xl font-bold text-white tracking-tight">
          AICommerce
        </Link>
        <a href="#support" className="text-sm font-medium text-slate-400 hover:text-blue-500 transition-colors">
          Support
        </a>
      </nav>

      {/* MAIN REGISTRATION CONTENT */}
      <main className="grow flex items-center justify-center py-12 px-6 z-10">
        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl w-full items-center">
          
          {/* LEFT SIDE: VALUE PROPOSITION */}
          <div className="register-aside hidden lg:flex flex-col gap-6 pr-6">
            <span className="text-blue-500 font-bold text-xs uppercase tracking-widest">
              Global Merchant Network
            </span>
            <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tight">
              Empower your business with AI-driven commerce.
            </h1>
            <p className="text-base text-slate-300 leading-relaxed">
              Join over 10,000 merchants who use AICommerce to automate billing, optimize inventory, and scale their digital storefronts globally.
            </p>

            <div className="mt-2 space-y-4">
              <div className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-sm font-medium">Unified dashboard for all sales channels</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-sm font-medium">Real-time inventory sync & analytics</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="text-sm font-medium">Enterprise-grade security & compliance</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: REGISTRATION CARD */}
          <div className="w-full">
            <div className="auth-panel bg-[#0a0e1a]/80 backdrop-blur-2xl p-8 rounded-2xl border border-slate-800/80 shadow-2xl">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white">Create your merchant account</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Start your 14-day free trial. No credit card required.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider" htmlFor="firstName">First Name</label>
                    <div className="relative flex items-center"><User className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" /><input id="firstName" name="firstName" type="text" required value={formData.firstName} onChange={handleChange} placeholder="John" className="w-full pl-10 pr-4 py-3 bg-[#020617] border border-slate-800 rounded-xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all shadow-inner" /></div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider" htmlFor="lastName">Last Name</label>
                    <div className="relative flex items-center"><User className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" /><input id="lastName" name="lastName" type="text" required value={formData.lastName} onChange={handleChange} placeholder="Doe" className="w-full pl-10 pr-4 py-3 bg-[#020617] border border-slate-800 rounded-xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all shadow-inner" /></div>
                  </div>
                </div>

                {/* WORK EMAIL */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider" htmlFor="email">
                    Work Email
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      className="w-full pl-10 pr-4 py-3 bg-[#020617] border border-slate-800 rounded-xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all shadow-inner"
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider" htmlFor="password">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      minLength={8}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="At least 8 characters"
                      className="w-full pl-10 pr-4 py-3 bg-[#020617] border border-slate-800 rounded-xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider" htmlFor="confirmPassword">Confirm Password</label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
                    <input id="confirmPassword" name="confirmPassword" type="password" minLength={8} required value={formData.confirmPassword} onChange={handleChange} placeholder="Repeat your password" className="w-full pl-10 pr-4 py-3 bg-[#020617] border border-slate-800 rounded-xl text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all shadow-inner" />
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>
              </form>

              {/* DIVIDER */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-[#0a0e1a] px-3 text-slate-500 font-semibold tracking-wider">
                    Already have an account?
                  </span>
                </div>
              </div>

              {/* FOOTER LINK */}
              <div className="text-center">
                <Link
                  to="/signin"
                  className="text-sm font-semibold text-blue-500 hover:underline"
                >
                  Sign in instead
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#0a0e1a]/80 backdrop-blur-md border-t border-slate-800/80 w-full z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-6 sm:px-12 py-8 max-w-7xl mx-auto">
          <div className="col-span-2 md:col-span-1">
            <div className="text-lg font-bold text-white mb-2">AICommerce</div>
            <p className="text-xs text-slate-400">
              The modern operating system for digital commerce.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Product</span>
            <a href="#features" className="text-xs text-slate-400 hover:text-blue-500 transition-colors">
              Features
            </a>
            <a href="#solutions" className="text-xs text-slate-400 hover:text-blue-500 transition-colors">
              Solutions
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Company</span>
            <a href="#about" className="text-xs text-slate-400 hover:text-blue-500 transition-colors">
              About
            </a>
            <a href="#privacy" className="text-xs text-slate-400 hover:text-blue-500 transition-colors">
              Privacy
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Support</span>
            <a href="#help" className="text-xs text-slate-400 hover:text-blue-500 transition-colors">
              Help Center
            </a>
            <a href="#contact" className="text-xs text-slate-400 hover:text-blue-500 transition-colors">
              Contact
            </a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-4 border-t border-slate-800/50 text-center md:text-left">
          <span className="text-xs text-slate-500">
            © 2026 AICommerce. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Register;
