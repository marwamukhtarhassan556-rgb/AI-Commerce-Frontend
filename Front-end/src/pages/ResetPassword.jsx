import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Sparkles, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../api/axiosConfig';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/auth/reset-password', {
        email,
        token,
        newPassword: formData.password,
        confirmNewPassword: formData.confirmPassword,
      });

      if (response.data.succeeded) {
        setSuccess(true);
      } else {
        setError(response.data.message || 'Failed to reset password.');
      }
    } catch (err) {
      console.error('Reset Password Error:', err);
      const data = err.response?.data;
      const message =
        data?.message ||
        data?.title ||
        (data?.errors ? data.errors.join('. ') : null) ||
        'Failed to reset password. The link may be expired.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Invalid Link</h2>
          <p className="text-gray-500 mb-4">The password reset link is invalid or expired.</p>
          <Link to="/forgot-password" className="text-indigo-600 font-semibold hover:underline">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white font-sans antialiased">
      {/* LEFT PANE */}
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
            Create a new secure password.
          </h1>
        </div>

        <div className="relative z-10 text-xs text-indigo-200/60 font-medium">
          Protected by 256-bit SSL encryption.
        </div>
      </div>

      {/* RIGHT PANE */}
      <div className="flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-white overflow-y-auto">
        <div className="max-w-md w-full mx-auto my-auto py-6">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Reset Password
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Enter your new password below.
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
              <h3 className="text-lg font-bold text-emerald-900">Password Reset!</h3>
              <p className="text-sm text-emerald-700">
                Your password has been updated successfully.
              </p>
              <Link
                to="/signin"
                className="inline-block px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-md mt-2"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Confirm New Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
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
                    <span>Resetting...</span>
                  </>
                ) : (
                  <span>Reset Password</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;