import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, Shield, AlertCircle, Check } from "lucide-react";

const GCashAdminRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    adminCode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isRegistered, setIsRegistered] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.adminCode !== "GCashADMIN2024") {
      newErrors.adminCode = "Invalid admin registration code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch("/api/gcash/register-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: "GCash Admin",
          adminCode: formData.adminCode,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsRegistered(true);
        setTimeout(() => {
          navigate("/gcash/admin/dashboard");
        }, 2000);
      } else {
        setErrors({ general: data.error || "Registration failed" });
      }
    } catch (error) {
      setErrors({ general: "Network error. Please try again." });
    }
  };

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-[#F4F7FA] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">Registration Successful!</h1>
          <p className="text-slate-500 mb-8">Redirecting to GCash admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FA] flex flex-col">
      {/* GCash Header */}
      <header className="bg-[#007DFE] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-bold text-lg">Admin Registration</h1>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* GCash Logo Circle */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-[#007DFE] rounded-full flex items-center justify-center text-white font-black text-4xl italic mx-auto mb-4 shadow-lg shadow-blue-200 border-4 border-white">
              G
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">GCash <span className="text-[#007DFE]">Admin</span></h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Create Admin Account</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-slate-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#007DFE]" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="admin@gcash.com"
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 text-slate-800 font-bold transition-all outline-none ${
                      errors.email 
                        ? 'border-red-500 focus:border-red-500 focus:bg-white' 
                        : 'border-transparent focus:border-[#007DFE] focus:bg-white'
                    }`}
                    required
                  />
                </div>
                {errors.email && (
                  <div className="flex gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 items-center mt-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Secure Password
                </label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#007DFE]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-50 border-2 text-slate-800 font-bold transition-all outline-none ${
                      errors.password 
                        ? 'border-red-500 focus:border-red-500 focus:bg-white' 
                        : 'border-transparent focus:border-[#007DFE] focus:bg-white'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#007DFE]"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 items-center mt-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#007DFE]" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className={`w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-50 border-2 text-slate-800 font-bold transition-all outline-none ${
                      errors.confirmPassword 
                        ? 'border-red-500 focus:border-red-500 focus:bg-white' 
                        : 'border-transparent focus:border-[#007DFE] focus:bg-white'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#007DFE]"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="flex gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 items-center mt-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Admin Code
                </label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#007DFE]" />
                  <input
                    type="password"
                    value={formData.adminCode}
                    onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
                    placeholder="Enter admin code"
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 text-slate-800 font-bold transition-all outline-none ${
                      errors.adminCode 
                        ? 'border-red-500 focus:border-red-500 focus:bg-white' 
                        : 'border-transparent focus:border-[#007DFE] focus:bg-white'
                    }`}
                    required
                  />
                </div>
                {errors.adminCode && (
                  <div className="flex gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 items-center mt-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.adminCode}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#007DFE] text-white rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-600 active:scale-[0.98] transition-all mt-4"
              >
                CREATE ADMIN ACCOUNT
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-slate-500 font-medium">
                Already have an admin account?{" "}
                <Link to="/gcash/admin/login" className="text-[#007DFE] font-black hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          {/* Demo note */}
          <div className="mt-6 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm text-center">
            <p className="text-[11px] font-bold text-slate-400 uppercase mb-2">Demo Registration</p>
            <p className="text-sm font-bold text-slate-700">Use code: GCashADMIN2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GCashAdminRegister;
