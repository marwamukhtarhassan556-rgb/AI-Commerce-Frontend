import { useState } from "react"; // شيلنا React وسيبنا useState بس
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // تأكد من الـ URL بتاع الباك إند
     // التعديل الصح بناءً على الـ Controllers عندك
const response = await axios.post("http://localhost:5261/api/auth/login", {
  email: formData.email,
  password: formData.password,
} );

      localStorage.setItem("token", response.data.token);
      navigate("/merchant/dashboard");
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Badge text="Welcome Back" variant="primary" />
          <h1 className="text-4xl font-bold text-white tracking-tight">Sign In</h1>
          <p className="text-gray-400">Enter your credentials to access your dashboard</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/50 transition-all"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <Link to="/forgot-password" size="sm" className="text-[#007AFF] hover:text-[#007AFF]/80 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-[#161618] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/50 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full py-4 text-lg font-semibold" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-white font-medium hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
