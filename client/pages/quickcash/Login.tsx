import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

const QuickCashLogin = () => {
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/quickcash/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailOrPhone,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("quickcash_user", JSON.stringify(data.data));
        navigate("/quickcash/dashboard");
      } else {
        setError(data.error || "Login failed");
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
            <h1 className="text-4xl font-bold text-[#00D4AA] mb-2">Cash App</h1>
            <p className="text-[#888888]">Log in to your account</p>
          </div>
        </div>

        {/* Form content */}
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email / Phone */}
            <div>
              <label className="block text-sm font-medium text-[#FFFFFF] mb-2">
                Email or phone number
              </label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="Enter email or phone number"
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
                  Log In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[#888888] text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/quickcash/register" className="text-[#00D4AA] hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <p className="text-[#888888] text-sm mt-8">
        © 2013 – 2026 Cash App. All rights reserved.
      </p>
    </div>
  );
};

export default QuickCashLogin;
