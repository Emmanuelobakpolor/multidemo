import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, Plus, ArrowUpRight, ArrowDownLeft, Settings, Bell, Search, User, ChevronDown } from "lucide-react";

const PayPalWallet = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("paypal_user");
    if (!userData) {
      navigate("/paypal/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("paypal_user");
    navigate("/paypal");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header - PayPal style */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
             {/* Logo */}
            <Link to="/paypal">
              <svg width="101" height="32" viewBox="0 0 101 32" fill="none">
                <text
                  x="0"
                  y="24"
                  fill="#003087"
                  fontSize="26"
                  fontWeight="bold"
                  fontFamily="Verdana, sans-serif"
                >
                  Pay<tspan fill="#009cde">Pal</tspan>
                </text>
              </svg>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/paypal/dashboard" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link to="/paypal/send" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Send
              </Link>
              <Link to="/paypal/request" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Request
              </Link>
              <Link to="/paypal/wallet" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                Wallet
              </Link>
            </nav>

            {/* Right side icons */}
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              
              {/* User menu */}
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
                    {user.email[0].toUpperCase()}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">{user.fullName || user.email.split("@")[0]}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link to="/paypal/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Account Settings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Wallet</h1>
          <p className="text-gray-600">Manage your cards, bank accounts, and balance</p>
        </div>

        {/* Balance Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">PayPal balance</p>
              <h2 className="text-3xl font-semibold text-gray-900">${user.balance?.toFixed(2) || "0.00"}</h2>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors text-sm">
                Transfer Money
              </button>
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Debit & Credit Cards</h3>
            <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
              <Plus className="w-4 h-4" />
              Link a Card
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Visa •••• 4242</p>
                  <p className="text-xs text-gray-500">Expires 12/2026</p>
                </div>
              </div>
              <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bank Accounts Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Bank Accounts</h3>
            <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
              <Plus className="w-4 h-4" />
              Link a Bank
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2l8 4v6c0 5.55-3.84 10.74-9 12-5.16-1.26-9-6.45-9-12V6l8-4z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Bank of America</p>
                  <p className="text-xs text-gray-500">•••• 8888</p>
                </div>
              </div>
              <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              See all transactions
            </button>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-900">
                <div>Date</div>
                <div>Description</div>
                <div className="text-right">Amount</div>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-gray-500">Today</div>
                  <div className="text-gray-900">Coffee Shop Inc.</div>
                  <div className="text-right text-gray-900">-$4.50</div>
                </div>
              </div>
              <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-gray-500">Yesterday</div>
                  <div className="text-gray-900">Amazon.com</div>
                  <div className="text-right text-gray-900">-$29.99</div>
                </div>
              </div>
              <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-gray-500">Dec 15</div>
                  <div className="text-gray-900">Payment from John Doe</div>
                  <div className="text-right text-green-600">+$50.00</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Payment Methods</h3>
              <p className="text-sm text-gray-600 mb-3">Your payment methods are securely stored and encrypted. You can use them for quick and easy checkout.</p>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Manage Payment Methods →
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PayPalWallet;
