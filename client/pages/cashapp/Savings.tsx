import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PiggyBank, ArrowUpRight, ArrowDownLeft, Settings, Bell, Search, User } from "lucide-react";

const CashAppSavings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [savings, setSavings] = useState(1250.50);
  const [monthlyInterest, setMonthlyInterest] = useState(2.10);
  const [annualPercentageYield, setAnnualPercentageYield] = useState(2.5);

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
          <h1 className="text-2xl font-bold text-[#FFFFFF] mb-2">Savings</h1>
          <p className="text-[#888888]">Grow your money with automatic savings and high yields</p>
        </div>

        {/* Savings Summary */}
        <div className="bg-gradient-to-r from-[#00D4AA] to-[#00C49A] rounded-lg p-8 mb-8 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">${savings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
              <p className="text-white/90">Savings Balance</p>
            </div>
            <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <PiggyBank className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-white/80 text-sm mb-1">APY</p>
              <p className="text-xl font-semibold">{annualPercentageYield}%</p>
            </div>
            <div>
              <p className="text-white/80 text-sm mb-1">Est. Monthly Interest</p>
              <p className="text-xl font-semibold">${monthlyInterest.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors">
              Add to Savings
            </button>
            <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-medium hover:bg-white/30 transition-colors">
              Withdraw
            </button>
          </div>
        </div>

        {/* Savings Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6 hover:border-[#00D4AA] transition-colors">
            <div className="w-12 h-12 bg-[#00D4AA]/20 rounded-full flex items-center justify-center mb-4">
              <PiggyBank className="w-6 h-6 text-[#00D4AA]" />
            </div>
            <h3 className="text-lg font-semibold text-[#FFFFFF] mb-2">Automatic Savings</h3>
            <p className="text-[#888888] text-sm">Round up purchases and save automatically</p>
          </div>

          <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6 hover:border-[#00D4AA] transition-colors">
            <div className="w-12 h-12 bg-[#00D4AA]/20 rounded-full flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#FFFFFF] mb-2">High Yield</h3>
            <p className="text-[#888888] text-sm">Earn {annualPercentageYield}% APY on your savings</p>
          </div>

          <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6 hover:border-[#00D4AA] transition-colors">
            <div className="w-12 h-12 bg-[#00D4AA]/20 rounded-full flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[#FFFFFF] mb-2">Instant Access</h3>
            <p className="text-[#888888] text-sm">Withdraw anytime with no fees or penalties</p>
          </div>
        </div>

        {/* Savings Activity */}
        <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-[#FFFFFF] mb-4">Recent Activity</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#0D0D0D] rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <ArrowDownLeft className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#FFFFFF]">Round Up Savings</p>
                  <p className="text-xs text-[#888888]">From October purchases</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-500">+$12.50</p>
                <p className="text-xs text-[#888888]">Oct 31, 2024</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0D0D0D] rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                  <ArrowDownLeft className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#FFFFFF]">Interest Payment</p>
                  <p className="text-xs text-[#888888]">Monthly interest</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-500">+$2.10</p>
                <p className="text-xs text-[#888888]">Oct 15, 2024</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0D0D0D] rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#00D4AA]/20 rounded-full flex items-center justify-center">
                  <ArrowDownLeft className="w-5 h-5 text-[#00D4AA]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#FFFFFF]">Manual Deposit</p>
                  <p className="text-xs text-[#888888]">From Cash App balance</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[#00D4AA]">+$50.00</p>
                <p className="text-xs text-[#888888]">Oct 10, 2024</p>
              </div>
            </div>
          </div>

          <button className="w-full mt-4 py-3 bg-[#0D0D0D] border border-[#333333] rounded-lg text-[#888888] text-sm font-medium hover:border-[#00D4AA] hover:text-[#00D4AA] transition-colors">
            View All Transactions
          </button>
        </div>

        {/* Savings Goals */}
        <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#FFFFFF] mb-4">Savings Goals</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-[#0D0D0D] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-[#FFFFFF]">Emergency Fund</h4>
                <p className="text-sm font-medium text-[#00D4AA]">$500 / $1,000</p>
              </div>
              <div className="w-full bg-[#333333] rounded-full h-2 mb-2">
                <div className="bg-[#00D4AA] h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
              <p className="text-xs text-[#888888]">50% complete</p>
            </div>

            <div className="p-4 bg-[#0D0D0D] rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-[#FFFFFF]">Vacation Fund</h4>
                <p className="text-sm font-medium text-[#00D4AA]">$250 / $2,000</p>
              </div>
              <div className="w-full bg-[#333333] rounded-full h-2 mb-2">
                <div className="bg-[#00D4AA] h-2 rounded-full" style={{ width: '12.5%' }}></div>
              </div>
              <p className="text-xs text-[#888888]">12.5% complete</p>
            </div>

            <button className="w-full mt-4 py-3 bg-[#0D0D0D] border border-[#333333] rounded-lg text-[#888888] text-sm font-medium hover:border-[#00D4AA] hover:text-[#00D4AA] transition-colors">
              Create New Goal
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CashAppSavings;
