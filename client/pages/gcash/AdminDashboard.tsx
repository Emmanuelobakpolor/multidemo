import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LogOut, Users, Wallet, Plus, Search, Eye, 
  DollarSign, Edit, Trash2, CreditCard, Shield,
  BarChart3, Filter, Download, ChevronRight,
  UserCheck, TrendingUp, Activity, Settings, MessageSquare, MessageCircle
} from "lucide-react";
import UserDetailsModal from "@/components/UserDetailsModal";
import SendWaveChatModal from "@/components/SendWaveChatModal";

const SendWaveAdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFundModal, setShowFundModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [fundAmount, setFundAmount] = useState("");
  const [fundReason, setFundReason] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUserForModal, setSelectedUserForModal] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "transactions">("overview");
  const [timeFilter, setTimeFilter] = useState<"today" | "week" | "month" | "all">("week");
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedUserForChat, setSelectedUserForChat] = useState<any>(null);
  const [usersWithChatStatus, setUsersWithChatStatus] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("sendwave_admin_logged_in");
    if (!adminLoggedIn) {
      navigate("/gcash/admin/login");
    }
    fetchUsers();
    fetchTransactions();
  }, [navigate]);

  useEffect(() => {
    if (users.length > 0) {
      users.forEach(user => {
        checkChatStatus(user.email);
      });
    }
  }, [users]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/gcash/admin/users");
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

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/gcash/admin/transactions");
      const data = await response.json();
      if (data.success) {
        setTransactions(data.data);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  const checkChatStatus = async (userEmail: string) => {
    try {
      const response = await fetch(`/api/gcash/chat/status/${userEmail}`);
      const data = await response.json();
      if (data.success) {
        setUsersWithChatStatus(prev => ({ ...prev, [userEmail]: data.data?.chat_enabled || false }));
      }
    } catch (err) {
      console.error("Error checking chat status:", err);
    }
  };

  const toggleChatForUser = async (userId: string, userEmail: string) => {
    try {
      const response = await fetch(`/api/gcash/admin/user/${userId}/toggle-chat`, {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        setUsersWithChatStatus(prev => ({ ...prev, [userEmail]: data.data?.chat_enabled || false }));
        alert(`Chat ${data.data?.chat_enabled ? "enabled" : "disabled"} for user`);
      } else {
        alert(data.error || "Failed to toggle chat");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sendwave_admin_logged_in");
    navigate("/sendwave");
  };

  const handleFundUser = async () => {
    if (!selectedUser || !fundAmount || parseFloat(fundAmount) <= 0) return;

    try {
      const response = await fetch("/api/gcash/admin/adjust-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          amount: parseFloat(fundAmount),
          reason: fundReason,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state immediately for better UX
        setUsers(users.map((user) =>
          user.id === selectedUser.id
            ? { ...user, balance: user.balance + parseFloat(fundAmount) }
            : user
        ));
        setShowFundModal(false);
        setSelectedUser(null);
        setFundAmount("");
        setFundReason("");
        alert("Balance adjusted successfully");
      } else {
        alert(data.error || "Failed to adjust balance");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  const handleAdjustUserBalance = async (userId: string, amount: number, reason: string) => {
    try {
      const response = await fetch("/api/gcash/admin/adjust-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          amount,
          reason,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state immediately for better UX
        setUsers(users.map((user) =>
          user.id === userId
            ? { ...user, balance: user.balance + amount }
            : user
        ));
        alert("Balance adjusted successfully");
      } else {
        alert(data.error || "Failed to adjust balance");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  const filteredUsers = searchTerm.trim() 
    ? users.filter((user) => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Calculate statistics
  const totalBalance = users.reduce((sum, user) => sum + user.balance, 0);
  const avgBalance = users.length > 0 ? totalBalance / users.length : 0;
  const activeUsers = users.filter(user => user.lastLogin && 
    Date.now() - new Date(user.lastLogin).getTime() < 7 * 24 * 60 * 60 * 1000).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-purple-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">G</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold">Gcash Admin</h1>
                  <p className="text-purple-100 text-sm">Administration Dashboard</p>
                </div>
              </div>
              
              {/* Navigation Tabs */}
              <nav className="ml-8 hidden md:flex items-center space-x-1">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-4 py-2 rounded-lg transition-colors ${activeTab === "overview" ? "bg-white/20" : "hover:bg-white/10"}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("users")}
                  className={`px-4 py-2 rounded-lg transition-colors ${activeTab === "users" ? "bg-white/20" : "hover:bg-white/10"}`}
                >
                  Users
                </button>
                <button
                  onClick={() => setActiveTab("transactions")}
                  className={`px-4 py-2 rounded-lg transition-colors ${activeTab === "transactions" ? "bg-white/20" : "hover:bg-white/10"}`}
                >
                  Transactions
                </button>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">Admin</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Time Filter Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTimeFilter("today")}
                className={`px-3 py-1 text-sm rounded-full ${timeFilter === "today" ? "bg-purple-100 text-purple-600" : "text-gray-600 hover:bg-gray-100"}`}
              >
                Today
              </button>
              <button
                onClick={() => setTimeFilter("week")}
                className={`px-3 py-1 text-sm rounded-full ${timeFilter === "week" ? "bg-purple-100 text-purple-600" : "text-gray-600 hover:bg-gray-100"}`}
              >
                This Week
              </button>
              <button
                onClick={() => setTimeFilter("month")}
                className={`px-3 py-1 text-sm rounded-full ${timeFilter === "month" ? "bg-purple-100 text-purple-600" : "text-gray-600 hover:bg-gray-100"}`}
              >
                This Month
              </button>
              <button
                onClick={() => setTimeFilter("all")}
                className={`px-3 py-1 text-sm rounded-full ${timeFilter === "all" ? "bg-purple-100 text-purple-600" : "text-gray-600 hover:bg-gray-100"}`}
              >
                All Time
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <UserCheck className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600">{activeUsers} active</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Balance</p>
                  <p className="text-2xl font-bold text-gray-900">${totalBalance.toFixed(2)}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600">+15.2% from last week</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Average Balance</p>
                  <p className="text-2xl font-bold text-gray-900">${avgBalance.toFixed(2)}</p>
                  <div className="text-xs text-gray-500 mt-2">Per user</div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Activity className="w-4 h-4 text-purple-500" />
                    <span className="text-xs text-gray-600">24h volume</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-orange-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                  <Plus className="w-4 h-4 inline mr-2" />
                  Add User
                </button>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">User Management</h3>
                <p className="text-sm text-gray-600">{filteredUsers.length} users found</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded hover:bg-gray-100">
                  All
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded hover:bg-gray-100">
                  Active
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded hover:bg-gray-100">
                  Inactive
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chat
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-purple-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                            <div className="text-xs text-gray-500">ID: {user.id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-green-600">${user.balance.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleChatForUser(user.id, user.email)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              usersWithChatStatus[user.email]
                                ? "bg-green-500"
                                : "bg-gray-200"
                            }`}
                            title={usersWithChatStatus[user.email] ? "Click to disable chat" : "Click to enable chat"}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                usersWithChatStatus[user.email] ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUserForChat(user);
                              setShowChatModal(true);
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${
                              usersWithChatStatus[user.email]
                                ? "text-purple-500 hover:text-purple-700 hover:bg-purple-100"
                                : "text-gray-300 hover:text-gray-500 hover:bg-gray-100 opacity-50 cursor-not-allowed"
                            }`}
                            title={usersWithChatStatus[user.email] ? "Open chat" : "Chat disabled"}
                            disabled={!usersWithChatStatus[user.email]}
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedUserForModal(user);
                              setShowUserModal(true);
                            }}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowFundModal(true);
                            }}
                            className="p-1.5 text-purple-400 hover:text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                            title="Adjust Balance"
                          >
                            <DollarSign className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleAdjustUserBalance(user.id, 100, "Promotion credit")}
                            className="p-1.5 text-green-400 hover:text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            title="Add $100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* User Details Modal */}
      {showUserModal && selectedUserForModal && (
        <UserDetailsModal
          user={{
            ...selectedUserForModal,
            status: selectedUserForModal.status || "active",
            createdAt: selectedUserForModal.createdAt || new Date().toISOString(),
            updatedAt: selectedUserForModal.updatedAt || new Date().toISOString(),
          }}
          isOpen={showUserModal}
          onClose={() => setShowUserModal(false)}
          onUpdate={async (userId: string, data: any) => {
            console.log("Updating user:", userId, data);
            try {
              const response = await fetch(`/api/gcash/admin/user/${userId}/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
              });

              const result = await response.json();

              if (result.success) {
                // Update local state immediately for better UX
                setUsers(users.map((user) =>
                  user.id === userId ? { ...user, ...data } : user
                ));
                alert("User updated successfully");
              } else {
                alert(result.error || "Failed to update user");
              }
            } catch (error) {
              console.error("Error updating user:", error);
              alert("Network error. Please try again.");
            }
          }}
          onDelete={async (userId: string) => {
            if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
              return;
            }

            try {
              const response = await fetch(`/api/gcash/admin/user/${userId}/delete`, {
                method: "DELETE",
              });

              const result = await response.json();

              if (result.success) {
                setUsers(users.filter((user) => user.id !== userId));
                alert("User deleted successfully");
              } else {
                alert(result.error || "Failed to delete user");
              }
            } catch (error) {
              console.error("Error deleting user:", error);
              alert("Network error. Please try again.");
            }
          }}
        />
      )}

      {/* Fund Wallet Modal */}
      {showFundModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full">
            <div className="px-6 py-4 border-b">
              <h3 className="font-semibold text-gray-900">Adjust Balance - {selectedUser.fullName}</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Balance: ${selectedUser.balance.toFixed(2)}
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adjustment Amount
                </label>
                <input
                  type="number"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason (Optional)
                </label>
                <textarea
                  value={fundReason}
                  onChange={(e) => setFundReason(e.target.value)}
                  placeholder="Enter reason for adjustment..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowFundModal(false);
                  setSelectedUser(null);
                  setFundAmount("");
                  setFundReason("");
                }}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFundUser}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Adjust Balance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChatModal && selectedUserForChat && (
        <SendWaveChatModal
          isOpen={showChatModal}
          onClose={() => {
            setShowChatModal(false);
            setSelectedUserForChat(null);
          }}
          user={selectedUserForChat}
        />
      )}
    </div>
  );
};

export default SendWaveAdminDashboard;
