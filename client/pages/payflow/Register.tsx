import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, Check } from "lucide-react";

const PayFlowRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"initial" | "details">("initial"); // Multi-step like real PayPal
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "initial") {
      if (formData.email && formData.password) {
        setStep("details");
      }
      return;
    }

    // Final submit
    if (!termsAccepted) {
      alert("You must agree to the terms");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/payflow/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("payflow_user", JSON.stringify(data.data));
        navigate("/payflow/dashboard");
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
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center px-4">
      {/* Fixed top bar with minimal back (PayPal style) */}
      <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm fixed top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate("/payflow")}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </header>

      <div className="w-full max-w-md mt-16">
        {/* PayPal wordmark logo */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-[#0070BA] tracking-tight">
            paypal
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-3 text-xl">
            {step === "initial" ? "Create your PayPal account" : "Tell us a bit about you"}
          </p>
        </div>

        {/* Main clean card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <form onSubmit={handleNext} className="space-y-6">
            {error && (
              <div className="flex gap-3 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            {step === "initial" ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0070BA] focus:border-[#0070BA] transition"
                    required
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    You'll use this to log in and receive notifications
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Create password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Must be at least 8 characters"
                      className="w-full px-4 py-3.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0070BA] focus:border-[#0070BA] transition"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Use 8 or more characters with a mix of letters, numbers & symbols
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center mb-6">
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    {formData.email}
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep("initial")}
                    className="text-[#0070BA] text-sm hover:underline mt-1"
                  >
                    Change email
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-3.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0070BA] focus:border-[#0070BA] transition"
                    required
                    autoFocus
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-[#0070BA] focus:ring-[#0070BA] cursor-pointer"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                    I agree to the{" "}
                    <span className="text-[#0070BA] hover:underline">User Agreement</span>,{" "}
                    <span className="text-[#0070BA] hover:underline">Privacy Policy</span>, and{" "}
                    <span className="text-[#0070BA] hover:underline">Cookie Policy</span>.
                  </label>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading || (step === "details" && !termsAccepted)}
              className="w-full py-3.5 bg-[#0070BA] text-white font-semibold rounded-lg hover:bg-[#005ea6] transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : (step === "initial" ? "Next" : "Agree and Create Account")}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link to="/payflow/login" className="text-[#0070BA] font-medium hover:underline">
                Log In
              </Link>
            </p>
          </div>
        </div>

        {/* Demo indicator */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
          <div className="flex items-start justify-center gap-2">
            <Check className="w-5 h-5 text-[#0070BA] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <span className="font-semibold">Demo Mode:</span> New accounts start with $500 balance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayFlowRegister;