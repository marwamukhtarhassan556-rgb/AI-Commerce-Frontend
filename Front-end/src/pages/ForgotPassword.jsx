import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { forgotPasswordUser } from '../api/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await forgotPasswordUser(email);
      setSuccess(true);
    } catch (err) {
      console.error('Forgot Password Error:', err);
      setError(
        err.response?.data?.message ||
        'Failed to send reset link. Please check if the email is registered.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white font-sans antialiased">
      {/* LEFT PANE - Dark Hero */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#0F0C31] via-[#1A1454] to-[#0A0724] relative overflow-hidden text-white select-none">
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: '28px 28px'
          }}
        />
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shadow-lg backdrop-blur-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">CommerceMind AI</span>
        </div>

        <div className="relative z-10 max-w-lg my-auto py-12">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] text-white">
            Reset password with maximum security.
          </h1>
          <p className="text-sm text-indigo-200/70 mt-4 leading-relaxed">
            We will send a secure password reset link to your registered email address.
          </p>
        </div>

        <div className="relative z-10 text-xs text-indigo-200/60 font-medium">
          Protected by 256-bit SSL encryption.
        </div>
      </div>

      {/* RIGHT PANE - Form Section */}
      <div className="flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-white overflow-y-auto">
        <div className="max-w-md w-full mx-auto my-auto py-6">
          <Link
            to="/signin"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-indigo-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Sign In
          </Link>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Forgot Password?
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              No worries! Enter your email address below and we'll send you instructions to reset your password.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          {success ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-lg font-bold text-emerald-900">Check your email</h3>
              <p className="text-sm text-emerald-700">
                We've sent a password reset link to <strong className="font-semibold">{email}</strong>.
              </p>
              <Link
                to="/signin"
                className="inline-block px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md mt-2"
              >
                Return to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="name@company.com"
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-[#3B38D8] hover:bg-[#302CB5] active:bg-[#2824A0] text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200 flex items-center justify-center gap-2 text-base disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>
            </form>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-400 font-medium pt-6 border-t border-gray-100 max-w-md w-full mx-auto">
          <span>© 2024 CommerceMind AI</span>
          <Link to="/signin" className="text-indigo-600 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
