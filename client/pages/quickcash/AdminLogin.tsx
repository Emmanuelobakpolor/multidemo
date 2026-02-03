import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Shield } from "lucide-react";

const QuickCashAdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // For demo purposes, we'll use a simple hardcoded admin login
      if (email === "admin@quickcash.com" && password === "admin123") {
        localStorage.setItem("quickcash_admin", JSON.stringify({
          email: "admin@quickcash.com",
          fullName: "QuickCash Admin"
        }));
        navigate("/quickcash/admin/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center px-4">
      {/* Main centered card */}
      <div className="w-full max-w-[420px] bg-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden">
        {/* Header */}
        <div className="bg-[#0D0D0D] py-8 px-6 flex justify-center border-b border-[#333333]">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#00D4AA] rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-2xl font-bold text-[#FFFFFF] mb-2">QuickCash Admin</h1>
            <p className="text-[#888888]">Administrator Login</p>
          </div>
        </div>

        {/* Form content */}
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#FFFFFF] mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@quickcash.com"
                className="w-full px-4 py-4 bg-[#0D0D0D] border border-[#333333] rounded-lg text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA] transition"
                required
              />
            </div>

            {/* Password with toggle */}
            <div>
              <label className="block text-sm font-medium text-[#FFFFFF] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-4 bg-[#0D0D0D] border border-[#333333] rounded-lg text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA] transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#FFFFFF]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <a href="#" className="text-sm text-[#00D4AA] hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}

            {/* Log In button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#00D4AA] text-black font-bold text-lg rounded-lg hover:bg-[#00C49A] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Login
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[#888888] text-sm mt-8">
            Demo Credentials: admin@quickcash.com / admin123
          </p>
        </div>
      </div>

      <p className="text-[#888888] text-sm mt-8">
        © 2013 – 2026 QuickCash Admin Panel. All rights reserved.
      </p>
    </div>
  );
};

export default QuickCashAdminLogin;
