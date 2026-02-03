import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LogOut, Users, Wallet, Plus, Search, Eye, 
  DollarSign, Edit, Trash2, BarChart3, Shield, 
  CreditCard, Activity, Filter, Download, 
  ChevronDown, ChevronUp, UserCheck, AlertCircle, MessageSquare, ToggleLeft, ToggleRight
} from "lucide-react";
import UserDetailsModal from "@/components/UserDetailsModal";
import CryptoPortChatModal from "@/components/CryptoPortChatModal";

const CryptoPortAdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFundModal, setShowFundModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [fundAmount, setFundAmount] = useState("");
  const [fundCryptoSymbol, setFundCryptoSymbol] = useState("BTC");
  const [fundReason, setFundReason] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUserForModal, setSelectedUserForModal] = useState<any>(null);
  const [showUpdateAddressModal, setShowUpdateAddressModal] = useState(false);
  const [updateCryptoSymbol, setUpdateCryptoSymbol] = useState("BTC");
  const [newDepositAddress, setNewDepositAddress] = useState("");
  const [selectedTab, setSelectedTab] = useState<"users" | "analytics" | "transactions">("users");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'createdAt', direction: 'desc' });
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedUserForChat, setSelectedUserForChat] = useState<any>(null);
  const [unreadCounts, setUnreadCounts] = useState<{ [email: string]: number }>({});

  const supportedCryptos = [
    { symbol: "BTC", name: "Bitcoin", color: "text-yellow-500" },
    { symbol: "ETH", name: "Ethereum", color: "text-purple-500" },
    { symbol: "BNB", name: "Binance Coin", color: "text-yellow-400" },
    { symbol: "SOL", name: "Solana", color: "text-pink-500" },
    { symbol: "ADA", name: "Cardano", color: "text-blue-500" },
    { symbol: "DOT", name: "Polkadot", color: "text-pink-400" },
    { symbol: "LINK", name: "Chainlink", color: "text-blue-400" },
    { symbol: "UNI", name: "Uniswap", color: "text-red-400" }
  ];

  // Mock transaction data
  const [transactions] = useState([
    { id: 1, user: "John Doe", type: "Deposit", amount: "0.5 BTC", status: "Completed", date: "2024-01-15" },
    { id: 2, user: "Jane Smith", type: "Withdrawal", amount: "10 ETH", status: "Pending", date: "2024-01-15" },
    { id: 3, user: "Bob Wilson", type: "Trade", amount: "5,000 USDT", status: "Completed", date: "2024-01-14" },
    { id: 4, user: "Alice Johnson", type: "Deposit", amount: "1.2 BTC", status: "Completed", date: "2024-01-14" },
  ]);

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("cryptoport_admin_logged_in");
    if (!adminLoggedIn) {
      navigate("/cryptoport/admin/login");
    }
    fetchUsers();
  }, [navigate]);

  useEffect(() => {
    if (users.length > 0) {
      fetchUnreadCounts();
    }
  }, [users]);

  const fetchUnreadCounts = async () => {
    const counts: { [email: string]: number } = {};
    
    for (const user of users) {
      try {
        // For admin, we need to count unread messages from each specific user
        // Let's fetch chat history with each user and count unread
        const historyResponse = await fetch(`https://multi-bakend.onrender.com/api/cryptoport/chat/history/${user.email}`);
        const historyData = await historyResponse.json();
        
        if (historyData.success) {
          const unread = historyData.data.filter((msg: any) => 
            msg.sender_email === user.email && !msg.is_read
          ).length;
          
          counts[user.email] = unread;
        }
      } catch (error) {
        console.error(`Error fetching unread count for ${user.email}:`, error);
        counts[user.email] = 0;
      }
    }
    
    setUnreadCounts(counts);
  };

  const markMessagesAsRead = async (userEmail: string) => {
    try {
      await fetch(`https://multi-bakend.onrender.com/api/cryptoport/chat/mark-read/admin@cryptoport.com/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_email: userEmail }),
      });
      // Update unread count for this user specifically
      setUnreadCounts(prev => ({
        ...prev,
        [userEmail]: 0
      }));
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const handleToggleChat = async (userId: string) => {
    try {
      const response = await fetch(`/api/cryptoport/admin/user/${userId}/toggle-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (result.success) {
        setUsers(users.map((user) =>
          user.id === userId
            ? { ...user, chat_enabled: result.data.chat_enabled }
            : user
        ));
      } else {
        console.error("Failed to toggle chat:", result.error);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/cryptoport/admin/users");
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredUsers = searchTerm.trim() 
    ? users.filter((user) => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortConfig.key === 'fiatBalance' || sortConfig.key === 'cryptoBalances.BTC') {
      const aValue = sortConfig.key === 'fiatBalance' ? a.fiatBalance : (a.cryptoBalances?.BTC || 0);
      const bValue = sortConfig.key === 'fiatBalance' ? b.fiatBalance : (b.cryptoBalances?.BTC || 0);
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  const handleLogout = () => {
    localStorage.removeItem("cryptoport_admin_logged_in");
    navigate("/cryptoport");
  };

  const handleFundUser = async () => {
    if (!selectedUser || !fundAmount || parseFloat(fundAmount) <= 0) return;
    try {
      const response = await fetch("/api/cryptoport/admin/fund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          cryptoSymbol: fundCryptoSymbol,
          amount: parseFloat(fundAmount),
          reason: fundReason,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setUsers(users.map((user) =>
          user.id === selectedUser.id
            ? { 
                ...user, 
                cryptoBalances: { 
                  ...user.cryptoBalances, 
                  [fundCryptoSymbol]: (user.cryptoBalances[fundCryptoSymbol] || 0) + parseFloat(fundAmount) 
                } 
              }
            : user
        ));
        setShowFundModal(false);
        setSelectedUser(null);
        setFundAmount("");
        setFundCryptoSymbol("BTC");
        setFundReason("");
      } else {
        alert(data.error || "Failed to fund wallet");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  const handleUpdateDepositAddress = async () => {
    if (!selectedUser || !newDepositAddress.trim()) return;
    try {
      const response = await fetch("/api/cryptoport/admin/user/update-deposit-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          cryptoSymbol: updateCryptoSymbol,
          depositAddress: newDepositAddress,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setShowUpdateAddressModal(false);
        setSelectedUser(null);
        setUpdateCryptoSymbol("BTC");
        setNewDepositAddress("");
        alert("Deposit address updated successfully");
      } else {
        alert(data.error || "Failed to update deposit address");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  const handleUpdateUser = async (userId: string, data: any) => {
    try {
      console.log("Updating user:", userId, data);
      alert("User updated successfully");
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  const handleChatOpen = (user: any) => {
    setSelectedUserForChat(user);
    setShowChatModal(true);
    markMessagesAsRead(user.email);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }
    try {
      console.log("Deleting user:", userId);
      const response = await fetch(`/api/cryptoport/admin/user/${userId}/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(users.filter((user) => user.id !== userId));
        alert("User deleted successfully");
      } else {
        alert(data.error || "Failed to delete user");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-yellow-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalCryptoBalance = users.reduce((sum, user) => sum + (user.cryptoBalances?.BTC || 0), 0).toFixed(8);
  const totalFiatBalance = users.reduce((sum, user) => sum + (user.fiatBalance || 0), 0).toFixed(2);
  const activeUsers = users.filter(user => user.lastLogin && Date.now() - new Date(user.lastLogin).getTime() < 7 * 24 * 60 * 60 * 1000).length;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header - Binance Style */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-gray-900 font-bold text-lg">
                C
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CryptoPort</h1>
                <p className="text-xs text-gray-400">Admin Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-400">Total Assets</p>
                  <p className="text-sm font-semibold text-white">${(parseFloat(totalFiatBalance) + parseFloat(totalCryptoBalance) * 45000).toLocaleString()}</p>
                </div>
                <div className="w-px h-6 bg-gray-700"></div>
                <button className="flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition-colors">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Security</span>
                </button>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setSelectedTab("users")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === "users"
                  ? "border-yellow-500 text-yellow-500"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              <Users className="w-4 h-4 inline-block mr-2" />
              Users
            </button>
            <button
              onClick={() => setSelectedTab("analytics")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === "analytics"
                  ? "border-yellow-500 text-yellow-500"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              <BarChart3 className="w-4 h-4 inline-block mr-2" />
              Analytics
            </button>
            <button
              onClick={() => setSelectedTab("transactions")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === "transactions"
                  ? "border-yellow-500 text-yellow-500"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              <Activity className="w-4 h-4 inline-block mr-2" />
              Transactions
            </button>
          </div>
        </div>
      </nav>

      <main className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Users</p>
                  <p className="text-2xl font-bold text-white">{users.length}</p>
                  <p className="text-xs text-green-500 mt-2">
                    <UserCheck className="w-3 h-3 inline mr-1" />
                    {activeUsers} active
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-900/30 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">BTC Holdings</p>
                  <p className="text-2xl font-bold text-white">{totalCryptoBalance} BTC</p>
                  <p className="text-xs text-gray-400 mt-2">≈ ${(parseFloat(totalCryptoBalance) * 45000).toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-900/30 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Fiat Balance</p>
                  <p className="text-2xl font-bold text-white">${totalFiatBalance}</p>
                  <p className="text-xs text-green-500 mt-2">+2.4% from last week</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-900/30 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Transactions</p>
                  <p className="text-2xl font-bold text-white">{transactions.length}</p>
                  <p className="text-xs text-gray-400 mt-2">24h volume</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-900/30 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search users by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                />
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
                <button className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Users Table */}
          {selectedTab === "users" && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="font-semibold text-white text-lg">User Management</h3>
                <p className="text-sm text-gray-400">Manage all user accounts and balances</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-900">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('fiatBalance')}
                      >
                        <div className="flex items-center gap-1">
                          Fiat Balance
                          {sortConfig.key === 'fiatBalance' && (
                            sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('cryptoBalances.BTC')}
                      >
                        <div className="flex items-center gap-1">
                          BTC Balance
                          {sortConfig.key === 'cryptoBalances.BTC' && (
                            sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </th>
                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                         Status
                       </th>
                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                         Chat
                       </th>
                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                         Actions
                       </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {sortedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-750 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300 font-semibold text-sm">
                              {user.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">{user.fullName}</div>
                              <div className="text-xs text-gray-400">ID: {user.id.slice(0, 8)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-green-400">${user.fiatBalance.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-yellow-400">
                            {user.cryptoBalances?.BTC?.toFixed(8) || "0.00000000"} BTC
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.status === 'active' 
                              ? 'bg-green-900/30 text-green-400' 
                              : 'bg-gray-700 text-gray-400'
                          }`}>
                            {user.status || 'active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleChat(user.id)}
                            className={`flex items-center gap-2 px-3 py-1 text-xs rounded-full transition-colors ${
                              user.chat_enabled 
                                ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50' 
                                : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                            }`}
                          >
                            {user.chat_enabled ? (
                              <>
                                <ToggleRight className="w-4 h-4" />
                                Enabled
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="w-4 h-4" />
                                Disabled
                              </>
                            )}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleChatOpen(user)}
                              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 hover:text-blue-300 transition-colors relative"
                              title="Chat"
                            >
                              <MessageSquare className="w-4 h-4" />
                              {unreadCounts[user.email] > 0 && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center">
                                  {unreadCounts[user.email]}
                                </span>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowFundModal(true);
                              }}
                              className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg text-yellow-400 hover:text-yellow-300 transition-colors"
                              title="Fund User"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUserForModal(user);
                                setShowUserModal(true);
                              }}
                              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 hover:text-blue-300 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowUpdateAddressModal(true);
                              }}
                              className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg text-green-400 hover:text-green-300 transition-colors"
                              title="Update Address"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Chat Modal */}
          <CryptoPortChatModal
            isOpen={showChatModal}
            onClose={() => setShowChatModal(false)}
            user={selectedUserForChat}
            onMarkAsRead={() => {
              if (selectedUserForChat) {
                markMessagesAsRead(selectedUserForChat.email);
              }
            }}
          />

          {/* Transactions Tab */}
          {selectedTab === "transactions" && (
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="font-semibold text-white text-lg">Recent Transactions</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-750">
                        <td className="px-6 py-4 text-sm text-gray-300">#{tx.id}</td>
                        <td className="px-6 py-4 text-sm text-white">{tx.user}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            tx.type === 'Deposit' ? 'bg-blue-900/30 text-blue-400' :
                            tx.type === 'Withdrawal' ? 'bg-yellow-900/30 text-yellow-400' :
                            'bg-green-900/30 text-green-400'
                          }`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-white">{tx.amount}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            tx.status === 'Completed' ? 'bg-green-900/30 text-green-400' : 'bg-yellow-900/30 text-yellow-400'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">{tx.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {showFundModal && selectedUser && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
            <div className="px-6 py-5 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">Fund User Wallet</h3>
              <p className="text-sm text-gray-400 mt-1">
                Adding funds to {selectedUser.fullName}'s account
              </p>
            </div>

            <div className="px-6 py-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cryptocurrency
                  </label>
                  <select
                    value={fundCryptoSymbol}
                    onChange={(e) => setFundCryptoSymbol(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                  >
                    {supportedCryptos.map((crypto) => (
                      <option key={crypto.symbol} value={crypto.symbol}>
                        <span className={crypto.color}>{crypto.symbol}</span> - {crypto.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.00000001"
                    min="0"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Reason (Optional)
                  </label>
                  <textarea
                    value={fundReason}
                    onChange={(e) => setFundReason(e.target.value)}
                    placeholder="Enter reason for funding"
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-5 border-t border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowFundModal(false);
                  setSelectedUser(null);
                  setFundAmount("");
                  setFundCryptoSymbol("BTC");
                  setFundReason("");
                }}
                className="px-5 py-2.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleFundUser}
                disabled={!fundAmount || parseFloat(fundAmount) <= 0}
                className="px-5 py-2.5 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Funding
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Deposit Address Modal */}
      {showUpdateAddressModal && selectedUser && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
            <div className="px-6 py-5 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">Update Deposit Address</h3>
              <p className="text-sm text-gray-400 mt-1">
                For user: {selectedUser.fullName}
              </p>
            </div>

            <div className="px-6 py-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cryptocurrency
                  </label>
                  <select
                    value={updateCryptoSymbol}
                    onChange={(e) => setUpdateCryptoSymbol(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white"
                  >
                    {supportedCryptos.map((crypto) => (
                      <option key={crypto.symbol} value={crypto.symbol}>
                        {crypto.symbol} - {crypto.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Deposit Address
                  </label>
                  <input
                    type="text"
                    value={newDepositAddress}
                    onChange={(e) => setNewDepositAddress(e.target.value)}
                    placeholder="Enter new deposit address"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Make sure the address is valid for {updateCryptoSymbol} network
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-5 border-t border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowUpdateAddressModal(false);
                  setSelectedUser(null);
                  setUpdateCryptoSymbol("BTC");
                  setNewDepositAddress("");
                }}
                className="px-5 py-2.5 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateDepositAddress}
                disabled={!newDepositAddress.trim()}
                className="px-5 py-2.5 bg-yellow-500 text-gray-900 font-semibold rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Address
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUserForModal}
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setSelectedUserForModal(null);
        }}
        onUpdate={handleUpdateUser}
        onDelete={handleDeleteUser}
      />
    </div>
  );
};

export default CryptoPortAdminDashboard;
