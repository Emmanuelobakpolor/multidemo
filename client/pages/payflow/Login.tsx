import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

const PayFlowLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"email" | "password">("email"); // Simulate multi-step
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "email") {
      if (formData.emailOrPhone) setStep("password");
      return;
    }

    // Final submit (API call)
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/payflow/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.emailOrPhone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("payflow_user", JSON.stringify(data.data));
        navigate("/payflow/dashboard");
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
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-slate-950 dark:to-blue-950 flex flex-col items-center justify-center px-4">
      {/* Optional back header - PayPal usually has minimal top bar */}
      <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm fixed top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </header>

      <div className="w-full max-w-md mt-16">
        {/* PayPal logo - modern wordmark style */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#0070BA] tracking-tight">
            paypal
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            {step === "email" ? "Log in to your account" : "Enter your password"}
          </p>
        </div>

        {/* Main card - clean white with subtle shadow */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          <form onSubmit={handleNext} className="space-y-6">
            {error && (
              <div className="flex gap-3 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            {step === "email" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email or mobile number
                </label>
                <input
                  type="text"
                  value={formData.emailOrPhone}
                  onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
                  placeholder="Email or mobile number"
                  className="w-full px-4 py-3.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0070BA] focus:border-[#0070BA] transition"
                  required
                  autoFocus
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  You can log in with your email or phone number
                </p>
              </div>
            ) : (
              <>
                <div className="text-center mb-4">
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    {formData.emailOrPhone}
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep("email")}
                    className="text-[#0070BA] text-sm hover:underline mt-1"
                  >
                    Change
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0070BA] focus:border-[#0070BA] transition"
                      required
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Link to="#" className="text-sm text-[#0070BA] hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#0070BA] text-white font-semibold rounded-lg hover:bg-[#005ea6] transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {step === "email" ? "Processing..." : "Logging in..."}
                </>
              ) : (
                step === "email" ? "Next" : "Log In"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Need an account?{" "}
              <Link to="/payflow/register" className="text-[#0070BA] font-medium hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* Demo note - styled subtly */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <span className="font-semibold">Demo Mode:</span> Enter any email + password to continue
          </p>
        </div>
      </div>
    </div>
  );
};

export default PayFlowLogin;
