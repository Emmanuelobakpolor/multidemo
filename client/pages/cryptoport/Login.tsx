import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Key, ArrowRight } from "lucide-react";

const BinanceStyleLogin = () => {
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
      const response = await fetch("http://localhost:8000/api/cryptoport/login", {
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
        localStorage.setItem("cryptoport_user", JSON.stringify(data.data));
        navigate("/cryptoport/dashboard");
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
    <div className="min-h-screen bg-[#0B0E11] flex flex-col items-center justify-center px-4">
      {/* Main centered card */}
      <div className="w-full max-w-[420px] bg-[#161A1E] rounded-2xl border border-[#2A2F36] overflow-hidden">
        {/* Custom header with your image */}
        <div className="bg-[#0B0E11] py-8 px-6 flex justify-center border-b border-[#2A2F36]">
          <img
            src="/images/download.png"
            alt="Header Logo"
            className="max-h-[80px] w-auto object-contain"
            // Optional: add fallback if image fails to load
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/200x80?text=Your+Logo";
            }}
          />
        </div>

        {/* Form content */}
        <div className="p-8">
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            Log In
          </h1>
          <p className="text-[#848E9C] text-center mb-8">
            Log in to your account
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email / Phone */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email or phone number
              </label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="Enter email or phone number"
                className="w-full px-4 py-4 bg-[#0B0E11] border border-[#2A2F36] rounded-lg text-white placeholder-[#848E9C] focus:outline-none focus:border-[#F0B90B] focus:ring-1 focus:ring-[#F0B90B] transition"
                required
              />
            </div>

            {/* Password with toggle */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-4 bg-[#0B0E11] border border-[#2A2F36] rounded-lg text-white placeholder-[#848E9C] focus:outline-none focus:border-[#F0B90B] focus:ring-1 focus:ring-[#F0B90B] transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#848E9C] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <a href="#" className="text-sm text-[#F0B90B] hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>

            {/* Log In button */}
            <button
              type="submit"
              className="w-full py-4 bg-[#F0B90B] text-black font-bold text-lg rounded-lg hover:bg-[#E8A010] transition flex items-center justify-center gap-2"
            >
              Log In
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* OR separator */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-[#2A2F36]"></div>
            <span className="px-4 text-[#848E9C] text-sm">or</span>
            <div className="flex-1 h-px bg-[#2A2F36]"></div>
          </div>

          {/* Alternative logins */}
          <div className="space-y-3">
            <button className="w-full py-3 bg-[#2A2F36] text-white rounded-lg hover:bg-[#3A414A] transition flex items-center justify-center gap-3">
              <Key className="w-5 h-5" />
              Continue with Passkey
            </button>

            <button className="w-full py-3 bg-[#2A2F36] text-white rounded-lg hover:bg-[#3A414A] transition flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.51h5.84c-.25 1.31-.98 2.42-2.07 3.16v2.63h3.35c1.96-1.81 3.09-4.47 3.09-7.25z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-1.01 7.28-2.73l-3.35-2.63c-1.01.68-2.29 1.08-3.93 1.08-3.02 0-5.58-2.04-6.49-4.78H.96v2.67C2.71 20.98 6.97 23 12 23z"/>
                <path fill="#FBBC05" d="M5.51 14.22c-.23-.68-.36-1.41-.36-2.22s.13-1.54.36-2.22V7.11H.96C.35 8.58 0 10.25 0 12s.35 3.42.96 4.89l4.55-2.67z"/>
                <path fill="#EA4335" d="M12 4.98c1.64 0 3.11.56 4.27 1.66l3.19-3.19C17.46 1.01 14.97 0 12 0 6.97 0 2.71 2.02.96 5.11l4.55 2.67C6.42 6.02 8.98 4.98 12 4.98z"/>
              </svg>
              Continue with Google
            </button>

            <button className="w-full py-3 bg-[#2A2F36] text-white rounded-lg hover:bg-[#3A414A] transition flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#fff">
                <path d="M17.05 20.28c-.98.94-2.07.88-3.08-.02-.99-.88-1.86-2.03-2.71-3.36-.84-1.33-1.57-2.94-1.57-4.48 0-1.77.68-3.39 1.82-4.14.96-.65 2.2-.6 3.06.15.43.38.78.88 1.04 1.45.26-.17.53-.3.81-.38.87-.24 1.79-.07 2.48.57.69.64 1.07 1.55 1.07 2.55 0 1.2-.49 2.32-1.36 3.16-.88.85-2.01.8-2.99-.08zm-3.97-14.1c.47-1.12 1.42-1.94 2.59-2.18.0-.02.01-.04.01-.06 0-1.38-1.12-2.5-2.5-2.5-.02 0-.04.01-.06.01-.24 1.17-1.06 2.12-2.18 2.59-.04.02-.08.03-.12.05-.03.01-.06.02-.09.03-.02.01-.04.02-.06.03-.01.01-.02.02-.03.03-.01.01-.02.02-.03.03-.01.01-.02.02-.03.03-.01.01-.02.02-.03.03-.01.01-.02.02-.03.03-.01.01-.02.02-.03.03z"/>
              </svg>
              Continue with Apple
            </button>
          </div>
        </div>
      </div>

      <p className="text-[#848E9C] text-sm mt-8">
        © 2017 – 2026 YourApp.com. All rights reserved.
      </p>
    </div>
  );
};

export default BinanceStyleLogin;