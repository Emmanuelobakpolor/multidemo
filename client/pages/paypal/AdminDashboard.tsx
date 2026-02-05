import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LogOut, Users, Wallet, Plus, Search, Eye, 
  DollarSign, Edit, Trash2, CreditCard, Shield,
  BarChart3, Filter, Download, ChevronRight,
  UserCheck, TrendingUp, Activity, Settings, MessageSquare, ToggleLeft, ToggleRight
} from "lucide-react";
import UserDetailsModal from "@/components/UserDetailsModal";
import ChatModal from "@/components/ChatModal";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
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
  const [unreadCounts, setUnreadCounts] = useState<{ [email: string]: number }>({});

  const fetchUnreadCounts = async () => {
    const counts: { [email: string]: number } = {};
    
    for (const user of users) {
      try {
        // For admin, we need to count unread messages from each specific user
        // Let's fetch chat history with each user and count unread
        const historyResponse = await fetch(`/api/paypal/chat/history/${user.email}`);
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
      await fetch(`/api/paypal/chat/mark-read/admin@payflow.com/`, {
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

  useEffect(() => {
    const adminLoggedIn = localStorage.getItem("payflow_admin_logged_in");
    if (!adminLoggedIn) {
      navigate("/paypal/admin/login");
    }
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/paypal/admin/users");
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

  useEffect(() => {
    if (users.length > 0) {
      fetchUnreadCounts();
    }
  }, [users]);

  const handleLogout = () => {
    localStorage.removeItem("payflow_admin_logged_in");
    navigate("/payflow");
  };

  const handleFundUser = async () => {
    if (!selectedUser || !fundAmount || parseFloat(fundAmount) <= 0) return;

    try {
      const response = await fetch("/api/paypal/admin/fund", {
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
        setUsers(users.map((user) =>
          user.id === selectedUser.id
            ? { ...user, balance: user.balance + parseFloat(fundAmount) }
            : user
        ));
        setShowFundModal(false);
        setSelectedUser(null);
        setFundAmount("");
        setFundReason("");
      } else {
        alert(data.error || "Failed to fund wallet");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  const handleUpdateUser = async (userId: string, data: any) => {
    try {
      const response = await fetch(`/api/paypal/admin/user/${userId}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setUsers(users.map((user) =>
          user.id === userId ? { ...user, ...data } : user
        ));
        alert("User updated successfully");
      } else {
        alert(result.error || "Failed to update user");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  const handleToggleChat = async (userId: string) => {
    try {
      const response = await fetch(`/api/paypal/admin/user/${userId}/toggle-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      if (result.success) {
        setUsers(users.map((user) =>
          user.id === userId
            ? { ...user, chat_enabled: result.chat_enabled }
            : user
        ));
      } else {
        console.error("Failed to toggle chat:", result.error);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/paypal/admin/user/${userId}/delete`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        setUsers(users.filter((user) => user.id !== userId));
        alert("User deleted successfully");
      } else {
        alert(result.error || "Failed to delete user");
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const handleChatOpen = (user: any) => {
    setSelectedUserForChat(user);
    setShowChatModal(true);
    markMessagesAsRead(user.email);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* PayPal-style Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">P</span>
                  </div>
                </div>
                <div>
                  <h1 className="text-xl font-bold">PayFlow Admin</h1>
                  <p className="text-blue-100 text-sm">Administration Dashboard</p>
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
                className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
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
                className={`px-3 py-1 text-sm rounded-full ${timeFilter === "today" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
              >
                Today
              </button>
              <button
                onClick={() => setTimeFilter("week")}
                className={`px-3 py-1 text-sm rounded-full ${timeFilter === "week" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
              >
                This Week
              </button>
              <button
                onClick={() => setTimeFilter("month")}
                className={`px-3 py-1 text-sm rounded-full ${timeFilter === "month" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
              >
                This Month
              </button>
              <button
                onClick={() => setTimeFilter("all")}
                className={`px-3 py-1 text-sm rounded-full ${timeFilter === "all" ? "bg-blue-100 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`}
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
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-500" />
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
                    <span className="text-xs text-green-600">+12.5% from last week</span>
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
                <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">1,248</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Activity className="w-4 h-4 text-blue-500" />
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
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
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
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : user.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.status || 'active'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </div>
                      </td>
                       <td className="px-6 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowFundModal(true);
                            }}
                            className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs"
                            title="Fund User"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Fund
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUserForModal(user);
                              setShowUserModal(true);
                            }}
                            className="inline-flex items-center px-2 py-1 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-xs"
                            title="View Details"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUserForModal(user);
                              setShowUserModal(true);
                            }}
                            className="inline-flex items-center px-2 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-xs"
                            title="Edit User"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleChatOpen(user)}
                            className="inline-flex items-center px-2 py-1 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-xs relative"
                            title="Chat"
                          >
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Chat
                            {unreadCounts[user.email] > 0 && (
                              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                {unreadCounts[user.email]}
                              </span>
                            )}
                          </button>
                          <button
                            onClick={() => handleToggleChat(user.id)}
                            className={`inline-flex items-center px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors text-xs ${
                              user.chat_enabled 
                                ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}
                            title={user.chat_enabled ? "Disable Chat" : "Enable Chat"}
                          >
                            {user.chat_enabled ? (
                              <ToggleRight className="w-3 h-3 mr-1" />
                            ) : (
                              <ToggleLeft className="w-3 h-3 mr-1" />
                            )}
                            {user.chat_enabled ? "Enabled" : "Disabled"}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="inline-flex items-center px-2 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs"
                            title="Delete User"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                <p className="text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
              </div>
            )}

            <div className="px-6 py-4 border-t flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {filteredUsers.length} of {users.length} users
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 rounded hover:bg-gray-100">
                  Previous
                </button>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">1</button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 rounded hover:bg-gray-100">
                  2
                </button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 rounded hover:bg-gray-100">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Fund Wallet Modal - PayPal Style */}
      {showFundModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
              <h3 className="text-xl font-bold">Add Funds to Wallet</h3>
              <p className="text-blue-100 mt-1">
                Adding funds to {selectedUser.fullName}'s account
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={fundAmount}
                      onChange={(e) => setFundAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-medium"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-gray-500">Quick add:</span>
                    <button
                      onClick={() => setFundAmount("10")}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                    >
                      $10
                    </button>
                    <button
                      onClick={() => setFundAmount("50")}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                    >
                      $50
                    </button>
                    <button
                      onClick={() => setFundAmount("100")}
                      className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                    >
                      $100
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason (Optional)
                  </label>
                  <textarea
                    value={fundReason}
                    onChange={(e) => setFundReason(e.target.value)}
                    placeholder="Describe why you're adding these funds..."
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Current Balance:</span>
                    <span className="font-semibold text-gray-900">${selectedUser.balance.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600">New Balance:</span>
                    <span className="font-bold text-green-600">
                      ${(selectedUser.balance + (parseFloat(fundAmount) || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
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
                className="px-5 py-2.5 text-gray-600 hover:text-gray-900 transition-colors rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleFundUser}
                disabled={!fundAmount || parseFloat(fundAmount) <= 0}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-sm"
              >
                Confirm Transfer
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

      {/* Chat Modal */}
      <ChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        user={selectedUserForChat}
      />
    </div>
  );
};

export default AdminDashboard;
