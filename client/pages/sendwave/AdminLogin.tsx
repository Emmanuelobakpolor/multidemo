import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, Lock, Shield, AlertCircle } from "lucide-react";

const GCashAdminLogin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Mock admin login
    if (formData.email === "admin@sendwave.com" && formData.password === "admin123") {
      localStorage.setItem("sendwave_admin_logged_in", "true");
      navigate("/sendwave/admin/dashboard");
    } else {
      setError("The email or password you entered is incorrect.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] flex flex-col">
      {/* GCash Header */}
      <header className="bg-[#007DFE] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center gap-4">
          <button
            onClick={() => navigate("/sendwave")}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-bold text-lg">Admin Portal</h1>
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
            <p className="text-slate-500 text-sm mt-1 font-medium">Secure Management Console</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-slate-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 items-center">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#007DFE]" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="admin@gcash.com"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#007DFE] focus:bg-white text-slate-800 font-bold transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Secure Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#007DFE]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#007DFE] focus:bg-white text-slate-800 font-bold transition-all outline-none"
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
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#007DFE] text-white rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-600 active:scale-[0.98] transition-all mt-4"
              >
                LOGIN AS ADMIN
              </button>
            </form>
          </div>

          {/* Help Links */}
          <div className="mt-8 text-center space-y-4">
             <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[11px] font-bold text-slate-400 uppercase">Demo Access</p>
                <p className="text-sm font-bold text-slate-700">admin@sendwave.com / admin123</p>
             </div>
             <p className="text-xs text-slate-400">
               Forgot Password? Contact <span className="text-[#007DFE] font-bold underline cursor-pointer">Support</span>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GCashAdminLogin;