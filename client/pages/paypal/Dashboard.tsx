import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownLeft, Settings, User, ChevronDown, Search, Bell, HelpCircle, MessageSquare } from "lucide-react";
import { Transaction } from "@shared/api";
import ChatWidget from "@/components/ChatWidget";

interface Activity {
  id: string;
  type: "sent" | "received" | "requested" | "request_received" | "admin_adjusted";
  email: string;
  amount: number;
  date: string;
  status: "completed" | "pending";
}

const PayFlowDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [chatEnabled, setChatEnabled] = useState(false);
  const [chatIsOpen, setChatIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`/api/paypal/chat/unread/${user.email}`);
      const data = await response.json();
      
      if (data.success) {
        setUnreadCount(data.unread_count);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("paypal_user");
    if (!userData) {
      navigate("/paypal/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const fetchChatStatus = async () => {
    try {
      const response = await fetch(`/api/paypal/chat/status/${user.email}`);
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
        const response = await fetch(`/api/paypal/user/${user.email}/transactions`);
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
    localStorage.removeItem("paypal_user");
    navigate("/payflow");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header - PayPal style */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/payflow">
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
              <Link to="/paypal/dashboard" className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">
                Home
              </Link>
              <Link to="/paypal/send" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Send
              </Link>
              <Link to="/paypal/request" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Request
              </Link>
              <Link to="/paypal/wallet" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
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
        {/* Balance Section */}
        <div className="mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">PayPal balance</p>
                <h1 className="text-4xl font-semibold text-gray-900">${user.balance?.toFixed(2) || "0.00"}</h1>
              </div>
              <div className="flex gap-3">
                <Link 
                  to="/paypal/send"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors text-sm"
                >
                  Send
                </Link>
                <Link 
                  to="/paypal/request"
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                  Request
                </Link>
              </div>
            </div>
            
            {/* Quick actions */}
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                  <ArrowUpRight className="w-4 h-4" />
                  Transfer to Bank
                </button>
                <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                  <ArrowDownLeft className="w-4 h-4" />
                  Add Money
                </button>
                <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                  See all transactions
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent activity</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              See all
            </button>
          </div>

          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500">Loading transactions...</p>
              </div>
            ) : activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === "received" || activity.type === "admin_adjusted"
                          ? "bg-green-100" 
                          : activity.type === "requested" || activity.type === "request_received"
                          ? "bg-yellow-100"
                          : "bg-gray-100"
                      }`}>
                        {activity.type === "received" || activity.type === "admin_adjusted" ? (
                          <ArrowDownLeft className={`w-5 h-5 ${
                            activity.type === "admin_adjusted" ? "text-blue-600" : "text-green-600"
                          }`} />
                        ) : activity.type === "sent" ? (
                          <ArrowUpRight className="w-5 h-5 text-gray-600" />
                        ) : activity.type === "requested" ? (
                          <ArrowUpRight className="w-5 h-5 text-yellow-600" />
                        ) : activity.type === "request_received" ? (
                          <ArrowDownLeft className="w-5 h-5 text-yellow-600" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-gray-600" />
                        )}
                      </div>

                      {/* Details */}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {activity.type === "sent" 
                            ? `Payment to ${activity.email}` 
                            : activity.type === "received" 
                            ? `Payment from ${activity.email}`
                            : activity.type === "admin_adjusted"
                            ? "Admin Adjustment"
                            : activity.type === "requested"
                            ? `Request to ${activity.email}`
                            : activity.type === "request_received"
                            ? `Request from ${activity.email}`
                            : `Request from ${activity.email}`}
                        </p>
                        <p className="text-xs text-gray-500">{activity.date}</p>
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
                          : activity.type === "requested" || activity.type === "request_received"
                          ? "text-yellow-600"
                          : "text-gray-900"
                      }`}>
                        {activity.type === "sent" ? "-" : activity.type === "requested" ? "-" : "+"}${activity.amount.toFixed(2)} USD
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500 mb-4">No recent transactions</p>
                <Link 
                  to="/paypal/send"
                  className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors text-sm"
                >
                  Send Money
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Help section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Need help?</h3>
              <p className="text-sm text-gray-600 mb-3">Visit our Help Center to find answers to common questions.</p>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Go to Help Center →
              </a>
            </div>
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
                className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors relative"
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
            <ChatWidget
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

export default PayFlowDashboard;
