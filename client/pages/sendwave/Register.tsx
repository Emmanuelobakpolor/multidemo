import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, ArrowLeft, Check, Shield, Zap } from "lucide-react";

const GCashRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    setLoading(true);
    const normalizedEmail = formData.email.toLowerCase().trim();

    try {
      const response = await fetch("/api/sendwave/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          password: formData.password,
          fullName: formData.fullName,
          mobileNumber: formData.mobileNumber,
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
        alert(data.error || "Registration failed");
      }
    } catch (error) {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
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
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#007DFE] to-[#0056b3] p-12 flex-col justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Join 94M+ Filipinos
            </h1>
            <p className="text-blue-100 text-lg">
              Experience the #1 Finance Super App in the Philippines
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Easy Registration</h3>
                <p className="text-blue-100">Sign up in just a few minutes with your email</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Bank-Level Security</h3>
                <p className="text-blue-100">Your money and data are protected 24/7</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Instant Transactions</h3>
                <p className="text-blue-100">Send money, pay bills, and more in seconds</p>
              </div>
            </div>
          </div>

          {/* App Preview */}
          <div className="relative">
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <img
              src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop"
              alt="Mobile banking"
              className="rounded-2xl shadow-2xl relative z-10 opacity-80"
            />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-gray-50">
          <div className="w-full max-w-md">
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      currentStep >= step
                        ? "bg-[#007DFE] text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep > step ? <Check className="w-5 h-5" /> : step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-16 h-1 mx-2 rounded transition-all ${
                        currentStep > step ? "bg-[#007DFE]" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step Labels */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {currentStep === 1 && "Personal Information"}
                {currentStep === 2 && "Contact Details"}
                {currentStep === 3 && "Create your password"}
              </h2>
              <p className="text-gray-500 mt-2">
                {currentStep === 1 && "Tell us a bit about yourself"}
                {currentStep === 2 && "Add your contact information"}
                {currentStep === 3 && "Secure your account"}
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <form onSubmit={handleSubmit}>
                {/* Step 1: Personal Info */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Juan Dela Cruz"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007DFE] focus:border-transparent"
                        required
                      />
                    </div>

                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!formData.fullName}
                      className="w-full py-4 bg-[#007DFE] text-white rounded-xl font-bold text-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                      Continue
                    </button>
                  </div>
                )}

                {/* Step 2: Mobile Number */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        value={formData.mobileNumber}
                        onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                        placeholder="0912 345 6789"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007DFE] focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 py-4 border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!formData.mobileNumber}
                        className="flex-1 py-4 bg-[#007DFE] text-white rounded-xl font-bold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Contact & Password */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="juan@email.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007DFE] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Create Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Enter a strong password"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007DFE] focus:border-transparent pr-12"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="Confirm your password"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#007DFE] focus:border-transparent"
                        required
                      />
                    </div>


                    {/* Password Requirements */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Password must have:</p>
                      <div className="space-y-1">
                        {[
                          { text: "At least 8 characters", met: formData.password.length >= 8 },
                          { text: "One uppercase letter", met: /[A-Z]/.test(formData.password) },
                          { text: "One number", met: /[0-9]/.test(formData.password) },
                        ].map((req, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${req.met ? "bg-green-500" : "bg-gray-300"}`}>
                              {req.met && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className={`text-sm ${req.met ? "text-green-600" : "text-gray-500"}`}>{req.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="flex items-start gap-3 pt-2">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-[#007DFE] focus:ring-[#007DFE] cursor-pointer"
                        required
                      />
                      <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
                        I agree to the <a href="#" className="text-[#007DFE] font-medium hover:underline">Terms of Service</a> and <a href="#" className="text-[#007DFE] font-medium hover:underline">Privacy Policy</a>
                      </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 py-4 border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={!termsAccepted || formData.password !== formData.confirmPassword || loading}
                        className="flex-1 py-4 bg-[#007DFE] text-white rounded-xl font-bold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Creating account...
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Sign In Link */}
            <p className="text-center text-gray-600 mt-6">
              Already have an account?{" "}
              <Link to="/sendwave/login" className="text-[#007DFE] font-semibold hover:underline">
                Log in
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
                    Use any credentials to register. You'll receive a starter balance of ₱50,000
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

export default GCashRegister;
