import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, ArrowRight, Shield, Check } from "lucide-react";

const CashAppAdminRegister = () => {
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

    if (formData.adminCode !== "CashAppADMIN2024") {
      newErrors.adminCode = "Invalid admin registration code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch("/api/cashapp/register-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: "QuickCash Admin",
          adminCode: formData.adminCode,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsRegistered(true);
        setTimeout(() => {
          navigate("/cashapp/admin/dashboard");
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
      <div className="min-h-screen bg-[#0D0D0D] flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-[420px] text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#FFFFFF] mb-2">Registration Successful!</h1>
          <p className="text-[#888888] mb-8">Redirecting to QuickCash admin dashboard...</p>
        </div>
      </div>
    );
  }

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
            <p className="text-[#888888]">Create Admin Account</p>
          </div>
        </div>

        {/* Form content */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#FFFFFF] mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="admin@quickcash.com"
                className={`w-full px-4 py-4 bg-[#0D0D0D] border text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:ring-1 transition ${
                  errors.email 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-[#333333] focus:border-[#00D4AA] focus:ring-[#00D4AA]'
                }`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-2">{errors.email}</p>
              )}
            </div>

            {/* Password with toggle */}
            <div>
              <label className="block text-sm font-medium text-[#FFFFFF] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-4 bg-[#0D0D0D] border text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:ring-1 transition ${
                    errors.password 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-[#333333] focus:border-[#00D4AA] focus:ring-[#00D4AA]'
                  }`}
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
              {errors.password && (
                <p className="text-red-500 text-sm mt-2">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password with toggle */}
            <div>
              <label className="block text-sm font-medium text-[#FFFFFF] mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm your password"
                  className={`w-full px-4 py-4 bg-[#0D0D0D] border text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:ring-1 transition ${
                    errors.confirmPassword 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-[#333333] focus:border-[#00D4AA] focus:ring-[#00D4AA]'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#FFFFFF]"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-2">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Admin Code */}
            <div>
              <label className="block text-sm font-medium text-[#FFFFFF] mb-2">
                Admin Registration Code
              </label>
              <input
                type="password"
                value={formData.adminCode}
                onChange={(e) => setFormData({ ...formData, adminCode: e.target.value })}
                placeholder="Enter admin code"
                className={`w-full px-4 py-4 bg-[#0D0D0D] border text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:ring-1 transition ${
                  errors.adminCode 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-[#333333] focus:border-[#00D4AA] focus:ring-[#00D4AA]'
                }`}
                required
              />
              {errors.adminCode && (
                <p className="text-red-500 text-sm mt-2">{errors.adminCode}</p>
              )}
            </div>

            {Object.keys(errors).length > 0 && (
              <div className="p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
                Please fix the errors above
              </div>
            )}

            {/* Register button */}
            <button
              type="submit"
              className="w-full py-4 bg-[#00D4AA] text-black font-bold text-lg rounded-lg hover:bg-[#00C49A] transition flex items-center justify-center gap-2"
            >
              Create Account
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#888888] text-sm">
              Already have an admin account?{" "}
              <Link to="/cashapp/admin/login" className="text-[#00D4AA] hover:underline">
                Sign In
              </Link>
            </p>
          </div>

          {/* Demo note */}
          <div className="mt-6 p-4 bg-[#0D0D0D] border border-[#333333] rounded-lg text-center">
            <p className="text-sm text-[#888888]">
              <span className="font-semibold text-[#00D4AA]">Demo Mode:</span> Use code "CashAppADMIN2024" to register
            </p>
          </div>
        </div>
      </div>

      <p className="text-[#888888] text-sm mt-8">
        © 2013 – 2026 QuickCash Admin Panel. All rights reserved.
      </p>
    </div>
  );
};

export default CashAppAdminRegister;
