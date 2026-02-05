import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Search, User, DollarSign, Activity, Users, MessageSquare, Edit2, Plus, ToggleLeft, ToggleRight } from "lucide-react";
import QuickCashChatModal from "@/components/QuickCashChatModal";

interface User {
  id: string;
  email: string;
  fullName: string;
  balance: number;
  mobileNumber?: string;
  chat_enabled?: boolean;
}

interface Transaction {
  id: string;
  amount: number;
  transaction_type: string;
  status: string;
  date: string;
  recipient?: string;
}

const QuickCashAdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [fundAmount, setFundAmount] = useState("");
  const [editUser, setEditUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [funding, setFunding] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string>("");
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedUserForChat, setSelectedUserForChat] = useState<User | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<{ [email: string]: number }>({});

  useEffect(() => {
    const adminData = localStorage.getItem("quickcash_admin");
    if (!adminData) {
      navigate("/cashapp/admin/login");
    } else {
      setAdmin(JSON.parse(adminData));
    }
  }, [navigate]);

  const fetchUnreadCounts = async () => {
    const counts: { [email: string]: number } = {};
    
    for (const user of users) {
      try {
        // For admin, we need to count unread messages from each specific user
        // Let's fetch chat history with each user and count unread
        const historyResponse = await fetch(`/api/cashapp/chat/history/${user.email}/`);
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
      await fetch(`/api/cashapp/chat/mark-read/${userEmail}/`, {
        method: "POST",
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const usersResponse = await fetch("/api/cashapp/admin/users");
      const transactionsResponse = await fetch("/api/cashapp/admin/transactions");

      const usersData = await usersResponse.json();
      const transactionsData = await transactionsResponse.json();

      if (usersData.success) {
        // Fetch chat status for each user
        const usersWithChatStatus = await Promise.all(
          usersData.data.map(async (user: User) => {
            try {
              const chatStatusResponse = await fetch(`/api/cashapp/chat/status/${user.email}`);
              const chatStatusData = await chatStatusResponse.json();
              return {
                ...user,
                chat_enabled: chatStatusData.success ? chatStatusData.chat_enabled : false
              };
            } catch (error) {
              console.error(`Error fetching chat status for user ${user.email}:`, error);
              return {
                ...user,
                chat_enabled: false
              };
            }
          })
        );

        setUsers(usersWithChatStatus);
      }
      if (transactionsData.success) {
        setTransactions(transactionsData.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin) {
      fetchData();
    }
  }, [admin]);

  useEffect(() => {
    if (users.length > 0) {
      fetchUnreadCounts();
    }
  }, [users]);

  const handleLogout = () => {
    localStorage.removeItem("quickcash_admin");
    navigate("/cashapp/admin/login");
  };

  const filteredUsers = searchQuery.trim() 
    ? users.filter((user) => 
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleFundWallet = async () => {
    if (!selectedUser || !fundAmount) {
      alert("Please select a user and enter an amount");
      return;
    }

    const parsedAmount = parseFloat(fundAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setFunding(true);
    setError("");

    try {
      const response = await fetch("/api/cashapp/admin/fund", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          amount: parsedAmount,
          reason: "Admin funding",
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Wallet funded successfully!");
        setFundAmount("");
        setSelectedUser(null);
        fetchData();
      } else {
        setError(data.error || "Failed to fund wallet");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setFunding(false);
    }
  };

  const handleEditUser = async () => {
    if (!editUser) return;

    setEditing(true);
    setError("");

    try {
      const response = await fetch("/api/cashapp/admin/edit-user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editUser),
      });

      const data = await response.json();

      if (data.success) {
        alert("User updated successfully!");
        setEditUser(null);
        fetchData();
      } else {
        setError(data.error || "Failed to update user");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setEditing(false);
    }
  };

  const handleToggleChat = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/cashapp/admin/user/${userId}/toggle-chat/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        // Update the user's chat status in the local state
        setUsers(users.map(user => 
          user.id === userId ? { ...user, chat_enabled: data.chat_enabled } : user
        ));
      }
    } catch (error) {
      console.error("Error toggling chat:", error);
    }
  };

  const handleChatOpen = (user: User) => {
    setSelectedUserForChat(user);
    setShowChatModal(true);
    markMessagesAsRead(user.email);
  };

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Header */}
      <header className="bg-[#1A1A1A] border-b border-[#333333] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-[#00D4AA]">QuickCash Admin</h1>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-[#FFFFFF]">{admin.fullName}</p>
                <p className="text-xs text-[#888888]">{admin.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-[#333333] rounded-full transition-colors"
              >
                <LogOut className="w-5 h-5 text-[#888888]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#888888] mb-1">Total Users</p>
                <h2 className="text-3xl font-bold text-[#00D4AA]">{users.length}</h2>
              </div>
              <Users className="w-8 h-8 text-[#00D4AA]" />
            </div>
          </div>

          <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#888888] mb-1">Total Transactions</p>
                <h2 className="text-3xl font-bold text-[#00D4AA]">{transactions.length}</h2>
              </div>
              <Activity className="w-8 h-8 text-[#00D4AA]" />
            </div>
          </div>

          <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#888888] mb-1">Total Balance</p>
                <h2 className="text-3xl font-bold text-[#00D4AA]">
                  ${users.reduce((sum, user) => sum + user.balance, 0).toFixed(2)}
                </h2>
              </div>
              <DollarSign className="w-8 h-8 text-[#00D4AA]" />
            </div>
          </div>
        </div>

        {/* Users Section */}
        <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-[#333333]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#FFFFFF]">Users</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users by email..."
                  className="w-full pl-10 pr-4 py-2 bg-[#0D0D0D] border border-[#333333] rounded-lg text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA] transition"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center">
              <p className="text-[#888888]">Loading users...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="divide-y divide-[#333333]">
              {filteredUsers.map((user) => (
                <div key={user.id} className="px-6 py-4 hover:bg-[#333333]/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#00D4AA] flex items-center justify-center text-black text-sm font-semibold">
                        {user.email[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#FFFFFF]">{user.fullName}</p>
                        <p className="text-xs text-[#888888]">{user.email}</p>
                        {user.mobileNumber && (
                          <p className="text-xs text-[#888888]">{user.mobileNumber}</p>
                        )}
                      </div>
                    </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#00D4AA]">
                          ${user.balance.toFixed(2)}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="px-3 py-1 bg-[#00D4AA] text-black text-xs rounded hover:bg-[#00C49A] transition"
                          >
                            <Plus className="w-4 h-4 inline mr-1" />
                            Fund
                          </button>
                          <button
                            onClick={() => setEditUser(user)}
                            className="px-3 py-1 border border-[#00D4AA] text-[#00D4AA] text-xs rounded hover:bg-[#00D4AA] hover:text-black transition"
                          >
                            <Edit2 className="w-4 h-4 inline mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleChat(user.id, user.chat_enabled || false)}
                            className={`px-3 py-1 text-xs rounded transition ${
                              user.chat_enabled 
                                ? "bg-green-600 text-white hover:bg-green-700" 
                                : "bg-red-600 text-white hover:bg-red-700"
                            }`}
                          >
                            {user.chat_enabled ? (
                              <>
                                <ToggleRight className="w-4 h-4 inline mr-1" />
                                Chat On
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="w-4 h-4 inline mr-1" />
                                Chat Off
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleChatOpen(user)}
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition relative"
                          >
                            <MessageSquare className="w-4 h-4 inline mr-1" />
                            Chat
                            {unreadCounts[user.email] > 0 && (
                              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                {unreadCounts[user.email]}
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-[#888888]">No users found</p>
            </div>
          )}
        </div>

        {/* Transactions Section */}
        <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-[#333333]">
            <h2 className="text-lg font-semibold text-[#FFFFFF]">Recent Transactions</h2>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center">
              <p className="text-[#888888]">Loading transactions...</p>
            </div>
          ) : transactions.length > 0 ? (
            <div className="divide-y divide-[#333333]">
              {transactions.slice(0, 10).map((transaction) => (
                <div key={transaction.id} className="px-6 py-4 hover:bg-[#333333]/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#00D4AA] flex items-center justify-center text-black text-sm font-semibold">
                        {transaction.transaction_type.startsWith("sent") ? "➤" : "➤"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#FFFFFF]">
                          {transaction.transaction_type}
                        </p>
                        <p className="text-xs text-[#888888]">
                          {new Date(transaction.date).toLocaleString()}
                        </p>
                        {transaction.recipient && (
                          <p className="text-xs text-[#888888]">To: {transaction.recipient}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${
                        transaction.transaction_type.startsWith("received") || transaction.transaction_type === "admin_adjusted"
                          ? "text-green-600"
                          : "text-[#FFFFFF]"
                      }`}>
                        {transaction.transaction_type.startsWith("sent") ? "-" : "+"}${transaction.amount.toFixed(2)}
                      </p>
                      <p className={`text-xs ${
                        transaction.status === "completed" ? "text-green-600" : "text-yellow-600"
                      }`}>
                        {transaction.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-[#888888]">No transactions found</p>
            </div>
          )}
        </div>
      </main>

      {/* Fund Wallet Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg w-full max-w-md">
            <div className="px-6 py-4 border-b border-[#333333]">
              <h3 className="text-lg font-semibold text-[#FFFFFF]">Fund Wallet</h3>
            </div>
            <div className="p-6">
              <p className="text-sm text-[#888888] mb-4">
                Funding wallet for: <span className="text-[#00D4AA]">{selectedUser.fullName}</span>
              </p>
              <p className="text-sm text-[#888888] mb-6">
                Current balance: <span className="text-[#00D4AA]">${selectedUser.balance.toFixed(2)}</span>
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#888888] mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#333333] rounded-lg text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA] transition"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm mb-4">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 py-3 bg-[#333333] text-[#FFFFFF] rounded-lg hover:bg-[#444444] transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFundWallet}
                  disabled={funding}
                  className="flex-1 py-3 bg-[#00D4AA] text-black rounded-lg hover:bg-[#00C49A] transition disabled:opacity-50"
                >
                  {funding ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : (
                    "Fund"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg w-full max-w-md">
            <div className="px-6 py-4 border-b border-[#333333]">
              <h3 className="text-lg font-semibold text-[#FFFFFF]">Edit User</h3>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#888888] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editUser.fullName}
                  onChange={(e) => setEditUser({ ...editUser, fullName: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#333333] rounded-lg text-[#FFFFFF] focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA] transition"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#888888] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editUser.email}
                  onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#333333] rounded-lg text-[#FFFFFF] focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA] transition"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[#888888] mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editUser.mobileNumber || ""}
                  onChange={(e) => setEditUser({ ...editUser, mobileNumber: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#333333] rounded-lg text-[#FFFFFF] focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA] transition"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm mb-4">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setEditUser(null)}
                  className="flex-1 py-3 bg-[#333333] text-[#FFFFFF] rounded-lg hover:bg-[#444444] transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditUser}
                  disabled={editing}
                  className="flex-1 py-3 bg-[#00D4AA] text-black rounded-lg hover:bg-[#00C49A] transition disabled:opacity-50"
                >
                  {editing ? (
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChatModal && selectedUserForChat && (
        <QuickCashChatModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          user={selectedUserForChat}
          onMarkAsRead={() => markMessagesAsRead(selectedUserForChat.email)}
        />
      )}
    </div>
  );
};

export default QuickCashAdminDashboard;
