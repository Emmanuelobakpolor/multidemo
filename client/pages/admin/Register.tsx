import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft, Shield, Check } from "lucide-react";

const AdminRegister = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminCode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isRegistered, setIsRegistered] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

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

    if (formData.adminCode !== "ADMIN2024") {
      newErrors.adminCode = "Invalid admin registration code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Demo registration - in production, this would create admin account
    localStorage.setItem("admin_user", JSON.stringify({
      username: formData.username,
      email: formData.email,
      role: "admin",
      isAuthenticated: true,
    }));

    setIsRegistered(true);
    setTimeout(() => {
      navigate("/admin");
    }, 2000);
  };

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Registration Successful!</h1>
          <p className="text-slate-400 mb-8">Redirecting to admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 flex flex-col items-center justify-center px-4">
      {/* Header */}
      <header className="w-full border-b border-slate-700 bg-slate-900/80 backdrop-blur-md fixed top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </header>

      <div className="w-full max-w-md mt-16">
        {/* Admin logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Registration</h1>
          <p className="text-slate-400">Create a new administrator account</p>
        </div>

        {/* Main card */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Choose a username"
                className={`w-full px-4 py-3 rounded-lg bg-slate-700 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  errors.username ? 'border-red-500' : 'border-slate-600 focus:border-blue-500'
                }`}
                required
              />
              {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 rounded-lg bg-slate-700 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  errors.email ? 'border-red-500' : 'border-slate-600 focus:border-blue-500'
                }`}
                required
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Create a password"
                  className={`w-full px-4 py-3 rounded-lg bg-slate-700 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    errors.password ? 'border-red-500' : 'border-slate-600 focus:border-blue-500'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm your password"
                  className={`w-full px-4 py-3 rounded-lg bg-slate-700 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                    errors.confirmPassword ? 'border-red-500' : 'border-slate-600 focus:border-blue-500'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">
                Admin Registration Code
              </label>
              <input
                type="password"
                value={formData.adminCode}
                onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
                placeholder="Enter admin code"
                className={`w-full px-4 py-3 rounded-lg bg-slate-700 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  errors.adminCode ? 'border-red-500' : 'border-slate-600 focus:border-blue-500'
                }`}
                required
              />
              {errors.adminCode && <p className="text-red-400 text-sm mt-1">{errors.adminCode}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
            >
              Create Admin Account
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-600 text-center">
            <p className="text-slate-400">
              Already have an admin account?{" "}
              <Link to="/admin/login" className="text-blue-400 font-medium hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Demo note */}
        <div className="mt-6 p-4 bg-slate-700/50 border border-slate-600 rounded-lg text-center">
          <p className="text-sm text-slate-300">
            <span className="font-semibold">Demo Mode:</span> Use code "ADMIN2024" to register
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
