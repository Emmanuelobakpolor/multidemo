import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";

const QuickCashRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!termsAccepted) {
      alert("You must agree to the Terms of Service");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/cashapp/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          mobileNumber: formData.mobileNumber,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("cashapp_user", JSON.stringify(data.data));
        navigate("/cashapp/dashboard");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center px-4">
      {/* Main card */}
      <div className="w-full max-w-[420px] bg-[#1A1A1A] rounded-2xl border border-[#333333] overflow-hidden">
        {/* Header */}
        <div className="bg-[#0D0D0D] py-8 px-6 flex justify-center border-b border-[#333333]">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#00D4AA] mb-2">Cash App</h1>
            <p className="text-[#888888]">Sign up to get started</p>
          </div>
        </div>

        {/* Form content */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#FFFFFF] mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="John Doe"
                className="w-full px-4 py-4 bg-[#0D0D0D] border border-[#333333] rounded-lg text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA] transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FFFFFF] mb-2">
                Username ($Cashtag)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00D4AA]">$</span>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="john_doe"
                  className="w-full pl-8 pr-4 py-4 bg-[#0D0D0D] border border-[#333333] rounded-lg text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA] transition"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FFFFFF] mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
                className="w-full px-4 py-4 bg-[#0D0D0D] border border-[#333333] rounded-lg text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA] transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FFFFFF] mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-4 bg-[#0D0D0D] border border-[#333333] rounded-lg text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA] transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FFFFFF] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create a strong password"
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
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FFFFFF] mb-2">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
                className="w-full px-4 py-4 bg-[#0D0D0D] border border-[#333333] rounded-lg text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA] transition"
                required
              />
            </div>

            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-[#333333] bg-[#0D0D0D] text-[#00D4AA] focus:ring-[#00D4AA] cursor-pointer"
                required
              />
              <label htmlFor="terms" className="text-sm text-[#888888] cursor-pointer">
                I agree to the{" "}
                <span className="text-[#00D4AA] hover:underline">Terms of Service</span> and{" "}
                <span className="text-[#00D4AA] hover:underline">Privacy Policy</span>
              </label>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!termsAccepted || loading}
              className="w-full py-4 bg-[#00D4AA] text-black font-bold text-lg rounded-lg hover:bg-[#00C49A] transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[#888888] text-sm mt-6">
            Already have an account?{" "}
            <Link to="/cashapp/login" className="text-[#00D4AA] hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>

      <p className="text-[#888888] text-sm mt-8">
        © 2013 – 2026 Cash App. All rights reserved.
      </p>

      {/* Demo note */}
      <div className="mt-6 p-4 bg-[#333333]/50 border border-[#00D4AA]/30 rounded-lg max-w-[420px] text-center">
        <div className="flex items-start justify-center gap-2">
          <Check className="w-5 h-5 text-[#00D4AA] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[#00D4AA]">
            <span className="font-semibold">Demo Mode:</span> Accounts start with zero balance – perfect for testing
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuickCashRegister;
