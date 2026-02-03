import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Send, QrCode, LogOut, Menu, X, Bell, Wallet, History, CreditCard, Smartphone, MessageSquare } from "lucide-react";
import SendWaveChatWidget from "@/components/SendWaveChatWidget";

interface Transaction {
  id: string;
  type: "sent" | "received" | "admin";
  person: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "adjusted";
  message?: string;
}

const SendWaveDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chatEnabled, setChatEnabled] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("sendwave_user");
    if (!userData) {
      navigate("/sendwave/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchTransactions();
      checkChatStatus();
    }
  }, [user]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`/api/sendwave/user/mobile/${user.mobileNumber}/transactions`);
      const data = await response.json();
      if (data.success) {
        const formattedTransactions: Transaction[] = data.data.map((tx: any) => ({
          id: tx.id,
          type: tx.transaction_type,
          person: tx.recipient,
          amount: tx.amount,
          date: new Date(tx.date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' }),
          status: tx.status,
          message: tx.reason,
        }));
        setTransactions(formattedTransactions);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const checkChatStatus = async () => {
    try {
      const response = await fetch(`/api/sendwave/chat/status/${user.email}`);
      const data = await response.json();
      if (data.success) {
        setChatEnabled(data.data?.chat_enabled || false);
      }
    } catch (error) {
      console.error("Error checking chat status:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sendwave_user");
    navigate("/sendwave");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F4F7FA]">
      {/* Header */}
      <header className="bg-[#007DFE] text-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-md mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#007DFE] font-black text-xs italic">G</span>
            </div>
            <span className="font-bold text-xl tracking-tight">GCash</span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setChatOpen(!chatOpen)} className="relative">
              <MessageSquare className="w-6 h-6" />
              {chatEnabled && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
              )}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto pb-20">
        {/* Welcome Section */}
        <div className="bg-[#007DFE] px-4 pt-2 pb-12 rounded-b-[3rem] text-white">
          <p className="text-sm opacity-90">Welcome back,</p>
          <h1 className="text-xl font-bold">{user.fullName || user.username}</h1>
        </div>

        {/* Balance Card - Overlapping */}
        <div className="px-4 -mt-8">
          <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-100">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-500 text-sm font-medium">Available Balance</span>
              <span className="text-[#007DFE] text-xs font-bold flex items-center gap-1">
                DETAILS <History className="w-3 h-3" />
              </span>
            </div>
            <h2 className="text-3xl font-black text-slate-800">
              ₱ {user.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
          </div>
        </div>

        {/* Main Actions Grid */}
        <div className="grid grid-cols-4 gap-4 px-4 mt-8">
          <Link to="/sendwave/send" className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#007DFE]">
              <Send className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-bold text-slate-700">Send</span>
          </Link>

          <Link to="/sendwave/receive" className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#007DFE]">
              <QrCode className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-bold text-slate-700">Receive</span>
          </Link>

          <div className="flex flex-col items-center gap-2 opacity-50">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#007DFE]">
              <Smartphone className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-bold text-slate-700">Load</span>
          </div>

          <div className="flex flex-col items-center gap-2 opacity-50">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#007DFE]">
              <CreditCard className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-bold text-slate-700">Cards</span>
          </div>
        </div>

        {/* Recent Transactions Section */}
        <div className="mt-10 px-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800">Recent Transactions</h3>
            <button className="text-[#007DFE] text-xs font-bold">VIEW ALL</button>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            {transactions.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === "sent" ? "bg-orange-50 text-orange-500" : "bg-blue-50 text-[#007DFE]"
                      }`}>
                        {tx.type === "sent" ? <Send className="w-5 h-5" /> : <Wallet className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-800">{tx.person}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider">{tx.date}</p>
                      </div>
                    </div>
                    <p className={`font-black text-sm ${tx.type === "sent" ? "text-slate-700" : "text-[#007DFE]"}`}>
                      {tx.type === "sent" ? "-" : "+"} ₱{tx.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-slate-400 text-sm">
                No transactions found.
              </div>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <div className="px-4 mt-8">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-4 text-red-500 font-bold text-sm bg-red-50 rounded-xl"
          >
            <LogOut className="w-4 h-4" /> Logout from GCash
          </button>
        </div>
      </main>

      {/* Chat Widget */}
      {chatEnabled && user && (
        <SendWaveChatWidget
          user={user}
          isOpen={chatOpen}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
};

export default SendWaveDashboard;
