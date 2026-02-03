import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownLeft, User, Search, Bell, MessageSquare } from "lucide-react";
import { Transaction } from "@shared/api";
import QuickCashChatWidget from "../../components/QuickCashChatWidget";

interface Activity {
  id: string;
  type: "sent" | "received" | "admin_adjusted";
  email: string;
  amount: number;
  date: string;
  status: "completed" | "pending";
}

const QuickCashDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatEnabled, setChatEnabled] = useState(false);
  const [chatIsOpen, setChatIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`/api/quickcash/chat/unread/${user.email}`);
      const data = await response.json();
      
      if (data.success) {
        setUnreadCount(data.unread_count);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("quickcash_user");
    if (!userData) {
      navigate("/quickcash/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const fetchChatStatus = async () => {
    try {
      const response = await fetch(`/api/quickcash/chat/status/${user.email}`);
      const data = await response.json();
      
      if (data.success) {
        setChatEnabled(data.chat_enabled);
      }
    } catch (error) {
      console.error("Error fetching chat status:", error);
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;

      try {
        const response = await fetch(`/api/quickcash/user/${user.email}/transactions`);
        const data = await response.json();

        if (data.success) {
          const mappedActivities: Activity[] = data.data.map((transaction: Transaction) => {
            return {
              id: transaction.id,
              type: transaction.transaction_type,
              email: transaction.recipient === "admin" ? "Anonymous" : (transaction.recipient || "Unknown"),
              amount: transaction.amount,
              date: formatDate(transaction.date),
              status: transaction.status,
            };
          });

          setActivities(mappedActivities);
        }
      } catch (err) {
        console.error("Error fetching transactions:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTransactions();
      fetchChatStatus();
      fetchUnreadCount();
    }
  }, [user]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("quickcash_user");
    navigate("/quickcash");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Header - Cash App style */}
      <header className="bg-[#1A1A1A] border-b border-[#333333] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/quickcash">
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
        {/* Balance Section */}
        <div className="mb-8">
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-[#888888] mb-1">Cash App balance</p>
                <h1 className="text-4xl font-semibold text-[#FFFFFF]">${user.balance?.toFixed(2) || "0.00"}</h1>
              </div>
              <div className="flex gap-3">
                <Link 
                  to="/quickcash/send"
                  className="px-6 py-2.5 bg-[#00D4AA] text-black rounded-full font-medium hover:bg-[#00C49A] transition-colors text-sm"
                >
                  Send
                </Link>
                <Link 
                  to="/quickcash/receive"
                  className="px-6 py-2.5 border border-[#333333] text-[#FFFFFF] rounded-full font-medium hover:bg-[#333333] transition-colors text-sm"
                >
                  Receive
                </Link>
              </div>
            </div>
            
            {/* Quick actions */}
            <div className="pt-4 border-t border-[#333333]">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="flex items-center gap-2 text-sm text-[#00D4AA] hover:text-[#00C49A] font-medium">
                  <ArrowUpRight className="w-4 h-4" />
                  Cash Out
                </button>
                <button className="flex items-center gap-2 text-sm text-[#00D4AA] hover:text-[#00C49A] font-medium">
                  <ArrowDownLeft className="w-4 h-4" />
                  Add Cash
                </button>
                <button className="flex items-center gap-2 text-sm text-[#00D4AA] hover:text-[#00C49A] font-medium">
                  See all transactions
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-[#333333] flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#FFFFFF]">Recent activity</h2>
            <button className="text-sm text-[#00D4AA] hover:text-[#00C49A] font-medium">
              See all
            </button>
          </div>

          <div className="divide-y divide-[#333333]">
            {loading ? (
              <div className="px-6 py-12 text-center">
                <p className="text-[#888888]">Loading transactions...</p>
              </div>
            ) : activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="px-6 py-4 hover:bg-[#333333]/30 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === "received" || activity.type === "admin_adjusted"
                          ? "bg-green-100" 
                          : "bg-gray-100"
                      }`}>
                        {activity.type === "received" || activity.type === "admin_adjusted" ? (
                          <ArrowDownLeft className={`w-5 h-5 ${
                            activity.type === "admin_adjusted" ? "text-blue-600" : "text-green-600"
                          }`} />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-gray-600" />
                        )}
                      </div>

                      {/* Details */}
                      <div>
                        <p className="text-sm font-medium text-[#FFFFFF]">
                          {activity.type === "sent" 
                            ? `Payment to ${activity.email}` 
                            : activity.type === "received" 
                            ? `Payment from ${activity.email}`
                            : activity.type === "admin_adjusted"
                            ? "Admin Adjustment"
                            : `Request from ${activity.email}`}
                        </p>
                        <p className="text-xs text-[#888888]">{activity.date}</p>
                        {activity.status === "pending" && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${
                        activity.type === "received" || activity.type === "admin_adjusted"
                          ? "text-green-600" 
                          : "text-[#FFFFFF]"
                      }`}>
                        {activity.type === "sent" ? "-" : "+"}${activity.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <p className="text-[#888888] mb-4">No recent transactions</p>
                <Link 
                  to="/quickcash/send"
                  className="inline-block px-6 py-2.5 bg-[#00D4AA] text-black rounded-full font-medium hover:bg-[#00C49A] transition-colors text-sm"
                >
                  Send Money
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Chat Widget */}
      {chatEnabled && (
        <>
          {!chatIsOpen ? (
            <div className="fixed bottom-4 right-4">
              <button
                onClick={() => setChatIsOpen(true)}
                className="bg-[#00D4AA] text-black p-4 rounded-full shadow-lg hover:bg-[#00C49A] transition-colors relative"
              >
                <MessageSquare size={24} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          ) : (
            <QuickCashChatWidget
              user={user}
              isOpen={chatIsOpen}
              onClose={() => setChatIsOpen(false)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default QuickCashDashboard;
