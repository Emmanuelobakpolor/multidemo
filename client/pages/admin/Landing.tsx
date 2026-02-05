import { Link, useNavigate } from "react-router-dom";
import { Shield, Users, TrendingUp, Zap, Edit2, ToggleLeft, Trash2, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  username: string;
  platform: "GCash" | "Binance" | "PayPal" | "CashApp";
  balance: number;
  status: "active" | "frozen";
  crypto_wallets?: CryptoWallet[];
}

interface CryptoWallet {
  id: string;
  crypto_currency_symbol: string;
  balance: number;
  deposit_address: string;
}

interface Transaction {
  id: string;
  user: string;
  platform: string;
  amount: number;
  type: "sent" | "received" | "admin-adjusted";
  status: "completed" | "pending" | "rejected";
  date: string;
}

const AdminLanding = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [balanceAdjustment, setBalanceAdjustment] = useState("");
  const [adjustmentReason, setAdjustmentReason] = useState("");
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [selectedCryptoUser, setSelectedCryptoUser] = useState<User | null>(null);
  const [cryptoAdjustment, setCryptoAdjustment] = useState("");
  const [selectedCryptoWallet, setSelectedCryptoWallet] = useState<CryptoWallet | null>(null);
  const [newDepositAddress, setNewDepositAddress] = useState("");
  const [adminUser, setAdminUser] = useState<any>(null);

  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "John Doe", username: "johndoe", platform: "GCash", balance: 5432.50, status: "active" },
    { id: "2", name: "Jane Smith", username: "janesmith", platform: "Binance", balance: 2850.00, status: "active" },
    { id: "3", name: "Mike Johnson", username: "mikej", platform: "PayPal", balance: 3850.75, status: "active" },
    { id: "4", name: "Sarah Davis", username: "sarahd", platform: "CashApp", balance: 2350.42, status: "frozen" },
    { id: "5", name: "Alex Torres", username: "alext", platform: "GCash", balance: 1200.00, status: "active" },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "1", user: "johndoe", platform: "GCash", amount: 250, type: "sent", status: "completed", date: "Today" },
    { id: "2", user: "janesmith", platform: "Binance", amount: 0.15, type: "sent", status: "pending", date: "Today" },
    { id: "3", user: "mikej", platform: "PayPal", amount: 500, type: "received", status: "completed", date: "Yesterday" },
    { id: "4", user: "sarahd", platform: "CashApp", amount: 100, type: "admin-adjusted", status: "completed", date: "Dec 15" },
    { id: "5", user: "alext", platform: "GCash", amount: 75.5, type: "received", status: "completed", date: "Dec 10" },
  ]);

  useEffect(() => {
    const adminData = localStorage.getItem("admin_user");
    if (!adminData) {
      navigate("/admin/login");
    } else {
      setAdminUser(JSON.parse(adminData));
    }
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, [navigate]);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    setIsDark(!isDark);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_user");
    navigate("/admin/login");
  };

  const totalBalance = users.reduce((sum, u) => sum + u.balance, 0);
  const activeUsers = users.filter((u) => u.status === "active").length;
  const totalTransactions = transactions.length;

  const handleAdjustBalance = () => {
    if (!selectedUser || !balanceAdjustment) return;
    const adjustment = parseFloat(balanceAdjustment);
    setUsers(
      users.map((u) =>
        u.id === selectedUser.id ? { ...u, balance: u.balance + adjustment } : u
      )
    );
    setSelectedUser(null);
    setBalanceAdjustment("");
    setAdjustmentReason("");
    setShowAdjustModal(false);
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(
      users.map((u) =>
        u.id === userId ? { ...u, status: u.status === "active" ? "frozen" : "active" } : u
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Shield className="w-6 h-6 text-blue-400" />
              <span className="font-bold text-lg">Admin Portal</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-slate-400 text-sm">Welcome, {adminUser.username}</span>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                {isDark ? "☀️" : "🌙"}
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Total Users", value: users.length, icon: <Users className="w-6 h-6" /> },
              { label: "Active Users", value: activeUsers, icon: <Zap className="w-6 h-6" /> },
              { label: "Total Balance", value: `$${totalBalance.toFixed(2)}`, icon: <TrendingUp className="w-6 h-6" /> },
              { label: "Transactions", value: totalTransactions, icon: <TrendingUp className="w-6 h-6" /> },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-blue-500 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className="text-blue-400">{stat.icon}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-slate-700">
            {[
              { id: "overview", label: "Overview" },
              { id: "users", label: "User Management" },
              { id: "transactions", label: "Transactions" },
              { id: "platforms", label: "Platforms" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "text-blue-400 border-b-2 border-blue-400"
                    : "text-slate-400 hover:text-slate-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">Platform Breakdown</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {["GCash", "Binance", "PayPal", "CashApp"].map((platform) => {
                    const platformUsers = users.filter((u) => u.platform === platform);
                    const platformBalance = platformUsers.reduce((sum, u) => sum + u.balance, 0);
                    return (
                      <div key={platform} className="bg-slate-700 rounded-lg p-4">
                        <p className="font-bold text-lg mb-2">{platform}</p>
                        <p className="text-slate-400 text-sm mb-1">Users: {platformUsers.length}</p>
                        <p className="text-slate-400 text-sm">Balance: ${platformBalance.toFixed(2)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                      <div>
                        <p className="font-semibold">{tx.user}</p>
                        <p className="text-xs text-slate-400">{tx.platform} • {tx.date}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${tx.type === "sent" ? "text-red-400" : "text-green-400"}`}>
                          {tx.type === "sent" ? "-" : "+"}${tx.amount}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          tx.status === "completed"
                            ? "bg-green-900/30 text-green-400"
                            : tx.status === "pending"
                              ? "bg-yellow-900/30 text-yellow-400"
                              : "bg-red-900/30 text-red-400"
                        }`}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* User Management Tab */}
          {activeTab === "users" && (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700 bg-slate-700">
                      <th className="px-6 py-4 text-left font-semibold">Name</th>
                      <th className="px-6 py-4 text-left font-semibold">Username</th>
                      <th className="px-6 py-4 text-left font-semibold">Platform</th>
                      <th className="px-6 py-4 text-left font-semibold">Balance</th>
                      <th className="px-6 py-4 text-left font-semibold">Status</th>
                      <th className="px-6 py-4 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700 transition-colors">
                        <td className="px-6 py-4">{user.name}</td>
                        <td className="px-6 py-4 text-slate-400">@{user.username}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-full">
                            {user.platform}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold">${user.balance.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 text-xs rounded-full ${
                              user.status === "active"
                                ? "bg-green-900/30 text-green-300"
                                : "bg-red-900/30 text-red-300"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowAdjustModal(true);
                              }}
                              className="p-2 bg-blue-900/30 text-blue-400 rounded hover:bg-blue-900/50 transition-colors"
                              title="Adjust Balance"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleUserStatus(user.id)}
                              className="p-2 bg-yellow-900/30 text-yellow-400 rounded hover:bg-yellow-900/50 transition-colors"
                              title="Toggle Status"
                            >
                              <ToggleLeft className="w-4 h-4" />
                            </button>
                            {user.platform === "Binance" && (
                              <button
                                onClick={() => {
                                  setSelectedCryptoUser(user);
                                  setShowCryptoModal(true);
                                }}
                                className="p-2 bg-purple-900/30 text-purple-400 rounded hover:bg-purple-900/50 transition-colors"
                                title="View Crypto Wallets"
                              >
                                <TrendingUp className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === "transactions" && (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700 bg-slate-700">
                      <th className="px-6 py-4 text-left font-semibold">User</th>
                      <th className="px-6 py-4 text-left font-semibold">Platform</th>
                      <th className="px-6 py-4 text-left font-semibold">Type</th>
                      <th className="px-6 py-4 text-left font-semibold">Amount</th>
                      <th className="px-6 py-4 text-left font-semibold">Status</th>
                      <th className="px-6 py-4 text-left font-semibold">Date</th>
                      <th className="px-6 py-4 text-left font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-slate-700 hover:bg-slate-700 transition-colors">
                        <td className="px-6 py-4 font-semibold">{tx.user}</td>
                        <td className="px-6 py-4 text-slate-400">{tx.platform}</td>
                        <td className="px-6 py-4">
                          <span className={`text-sm font-semibold ${
                            tx.type === "sent"
                              ? "text-red-400"
                              : tx.type === "received"
                                ? "text-green-400"
                                : "text-blue-400"
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold">${tx.amount}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 text-xs rounded-full ${
                              tx.status === "completed"
                                ? "bg-green-900/30 text-green-300"
                                : tx.status === "pending"
                                  ? "bg-yellow-900/30 text-yellow-300"
                                  : "bg-red-900/30 text-red-300"
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400">{tx.date}</td>
                        <td className="px-6 py-4">
                          <button className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-semibold">
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Platforms Tab */}
          {activeTab === "platforms" && (
            <div className="grid md:grid-cols-2 gap-6">
                  {["GCash", "Binance", "PayPal", "CashApp"].map((platform) => {
                const platformUsers = users.filter((u) => u.platform === platform);
                const platformBalance = platformUsers.reduce((sum, u) => sum + u.balance, 0);
                const platformTxs = transactions.filter((t) => t.platform === platform).length;
                return (
                  <div key={platform} className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                    <h3 className="text-xl font-bold mb-4">{platform}</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Active Users</p>
                        <p className="text-2xl font-bold">{platformUsers.length}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Total Balance</p>
                        <p className="text-2xl font-bold">${platformBalance.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm mb-1">Transactions</p>
                        <p className="text-2xl font-bold">{platformTxs}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Balance Adjustment Modal */}
      {showAdjustModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Adjust Balance</h2>
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm mb-2">User: {selectedUser.name}</p>
                <p className="text-slate-400 text-sm mb-2">Current Balance: ${selectedUser.balance.toFixed(2)}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Adjustment Amount</label>
                <input
                  type="number"
                  value={balanceAdjustment}
                  onChange={(e) => setBalanceAdjustment(e.target.value)}
                  placeholder="Enter amount (can be negative)"
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Reason</label>
                <input
                  type="text"
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  placeholder="e.g., Promotion credit, System correction"
                  className="w-full px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAdjustModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdjustBalance}
                  className="flex-1 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Adjust
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Crypto Wallet Management Modal */}
      {showCryptoModal && selectedCryptoUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Crypto Wallets - {selectedCryptoUser.name}</h2>
            <div className="space-y-4">
              {selectedCryptoUser.crypto_wallets?.map((wallet) => (
                <div key={wallet.id} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{wallet.crypto_currency_symbol}</h3>
                      <p className="text-slate-400 text-sm">Balance: {wallet.balance}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedCryptoWallet(wallet);
                          setCryptoAdjustment("");
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                      >
                        Adjust Balance
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Deposit Address</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={wallet.deposit_address}
                        readOnly
                        className="flex-1 px-3 py-2 rounded bg-slate-600 border border-slate-500 text-white text-sm"
                      />
                      <button
                        onClick={() => {
                          setSelectedCryptoWallet(wallet);
                          setNewDepositAddress(wallet.deposit_address);
                        }}
                        className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  {selectedCryptoWallet?.id === wallet.id && (
                    <div className="border-t border-slate-600 pt-4 mt-4">
                      {cryptoAdjustment !== "" && (
                        <div className="mb-4">
                          <label className="block text-sm font-semibold mb-2">Adjust Crypto Balance</label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={cryptoAdjustment}
                              onChange={(e) => setCryptoAdjustment(e.target.value)}
                              placeholder="Enter amount"
                              className="flex-1 px-3 py-2 rounded bg-slate-600 border border-slate-500 text-white"
                            />
                            <button
                              onClick={() => {
                                // Handle crypto balance adjustment
                                setCryptoAdjustment("");
                                setSelectedCryptoWallet(null);
                              }}
                              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                              Adjust
                            </button>
                          </div>
                        </div>
                      )}

                      {newDepositAddress !== "" && selectedCryptoWallet.deposit_address !== newDepositAddress && (
                        <div className="mb-4">
                          <label className="block text-sm font-semibold mb-2">New Deposit Address</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newDepositAddress}
                              onChange={(e) => setNewDepositAddress(e.target.value)}
                              placeholder="Enter new address"
                              className="flex-1 px-3 py-2 rounded bg-slate-600 border border-slate-500 text-white"
                            />
                            <button
                              onClick={() => {
                                // Handle address change
                                setNewDepositAddress("");
                                setSelectedCryptoWallet(null);
                              }}
                              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                              Update Address
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-6 border-t border-slate-600 mt-6">
              <button
                onClick={() => {
                  setShowCryptoModal(false);
                  setSelectedCryptoUser(null);
                  setSelectedCryptoWallet(null);
                  setCryptoAdjustment("");
                  setNewDepositAddress("");
                }}
                className="flex-1 px-4 py-2 border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLanding;
