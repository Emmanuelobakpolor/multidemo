import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, Plus, ArrowUpRight, ArrowDownLeft, Settings, Bell, Search, User } from "lucide-react";

const CashAppCard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem("cashapp_user");
    if (!userData) {
      navigate("/cashapp/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("cashapp_user");
    navigate("/cashapp");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Header - Cash App style */}
      <header className="bg-[#1A1A1A] border-b border-[#333333] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
             {/* Logo */}
            <Link to="/cashapp">
              <h1 className="text-2xl font-bold text-[#00D4AA]">Cash App</h1>
            </Link>

            {/* Search bar */}
            <div className="flex-1 max-w-md mx-8 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
              <input
                type="text"
                placeholder="Search $cashtags, names, or phone numbers"
                className="w-full pl-10 pr-4 py-2 bg-[#0D0D0D] border border-[#333333] rounded-lg text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA] transition"
              />
            </div>

            {/* Right side icons */}
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-[#333333] rounded-full transition-colors">
                <Bell className="w-5 h-5 text-[#888888]" />
              </button>
              
              {/* User profile */}
              <div className="relative">
                <button 
                  className="flex items-center gap-2 p-2 hover:bg-[#333333] rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#00D084] flex items-center justify-center text-black text-sm font-semibold">
                    {user.email[0].toUpperCase()}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#FFFFFF] mb-2">Cash Card</h1>
          <p className="text-[#888888]">The customizable debit card that lets you earn instant discounts</p>
        </div>

        {/* Card Preview */}
        <div className="bg-gradient-to-r from-[#00D4AA] to-[#00C49A] rounded-lg p-8 mb-8 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">Cash Card</h2>
              <p className="text-white/90">Customize your card and earn instant discounts</p>
            </div>
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <CreditCard className="w-10 h-10 text-white" />
            </div>
          </div>
          <button className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors">
            Order Now
          </button>
        </div>

        {/* Card Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6 hover:border-[#00D4AA] transition-colors">
            <div className="w-12 h-12 bg-[#00D4AA]/20 rounded-full flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#FFFFFF] mb-2">Custom Design</h3>
            <p className="text-[#888888] text-sm">Choose your card color and add a signature or drawing</p>
          </div>

          <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6 hover:border-[#00D4AA] transition-colors">
            <div className="w-12 h-12 bg-[#00D4AA]/20 rounded-full flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#FFFFFF] mb-2">Instant Discounts</h3>
            <p className="text-[#888888] text-sm">Get discounts at select merchants when you use your Cash Card</p>
          </div>

          <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6 hover:border-[#00D4AA] transition-colors">
            <div className="w-12 h-12 bg-[#00D4AA]/20 rounded-full flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#FFFFFF] mb-2">ATM Access</h3>
            <p className="text-[#888888] text-sm">Withdraw cash from ATMs worldwide with low fees</p>
          </div>
        </div>

        {/* Card Management */}
        <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-[#FFFFFF] mb-4">Card Management</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#0D0D0D] rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#00D4AA]/20 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-[#00D4AA]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#FFFFFF]">Cash Card</p>
                  <p className="text-xs text-[#888888]">•••• 1234</p>
                </div>
              </div>
              <button className="text-sm text-[#00D4AA] hover:text-[#00C49A] transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="flex items-center justify-between p-4 bg-[#0D0D0D] rounded-lg hover:bg-[#333333] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#00D4AA]/20 rounded-full flex items-center justify-center">
                    <Plus className="w-5 h-5 text-[#00D4AA]" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-[#FFFFFF]">Add Money</p>
                    <p className="text-xs text-[#888888]">Add funds to your Cash Card</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#888888]" />
              </button>

              <button className="flex items-center justify-between p-4 bg-[#0D0D0D] rounded-lg hover:bg-[#333333] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#00D4AA]/20 rounded-full flex items-center justify-center">
                    <ArrowDownLeft className="w-5 h-5 text-[#00D4AA]" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-[#FFFFFF]">Cash Out</p>
                    <p className="text-xs text-[#888888]">Transfer money to your bank</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#888888]" />
              </button>
            </div>
          </div>
        </div>

        {/* Discounts */}
        <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#FFFFFF] mb-4">Current Discounts</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
              <h4 className="text-sm font-medium mb-1">Starbucks</h4>
              <p className="text-lg font-bold mb-2">$5 off $10+</p>
              <p className="text-xs text-white/80">Valid until Dec 31, 2024</p>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
              <h4 className="text-sm font-medium mb-1">Uber Eats</h4>
              <p className="text-lg font-bold mb-2">10% off all orders</p>
              <p className="text-xs text-white/80">Valid until Jan 15, 2025</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CashAppCard;
