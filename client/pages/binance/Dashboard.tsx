import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Send, ArrowDownLeft, ArrowUpRight, LogOut, Menu, X, TrendingUp, Copy, ChevronDown, Search, Bell, User, Wallet, Clock, Eye, EyeOff, MessageSquare } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import CryptoPortChatWidget from "@/components/CryptoPortChatWidget";
import PageTransition from "@/components/binance/PageTransition";
import AnimatedNumber from "@/components/binance/AnimatedNumber";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Crypto {
  symbol: string;
  name: string;
  amount: number;
  price: number;
  change24h: number;
  icon: string;
}

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const BinanceDashboard = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [hideBalance, setHideBalance] = useState(false);
  const [chatEnabled, setChatEnabled] = useState(false);
  const [chatIsOpen, setChatIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const cryptoPrices = {
    BTC: 45230,
    ETH: 2580.5,
    BNB: 315.8,
    SOL: 105.2,
    ADA: 0.45,
    DOT: 7.2,
    LINK: 15.8,
    UNI: 6.4
  };

  const cryptoIcons = {
    BTC: "₿",
    ETH: "Ξ",
    BNB: "BNB",
    SOL: "◎",
    ADA: "₳",
    DOT: "●",
    LINK: "🔗",
    UNI: "🦄"
  };

  const fetchUnreadCount = async (email: string) => {
    try {
      const response = await fetch(`https://multi-bakend.onrender.com/api/binance/chat/unread/${email}`);
      const data = await response.json();
      
      if (data.success) {
        setUnreadCount(data.unread_count);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const fetchChatStatus = async (email: string) => {
    try {
      const response = await fetch(`https://multi-bakend.onrender.com/api/binance/chat/status/${email}`);
      const data = await response.json();
      
      if (data.success) {
        setChatEnabled(data.chat_enabled);
      }
    } catch (error) {
      console.error("Error fetching chat status:", error);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem("binance_user");
    if (!userData) {
      navigate("/binance/login");
    } else {
      setUser(JSON.parse(userData));
      fetchUserData(JSON.parse(userData).email);
    }
  }, [navigate]);

  const fetchUserData = async (email: string) => {
    try {
      const userResponse = await fetch(`/api/binance/user/${email}`);
      const userData = await userResponse.json();
      
      if (userData.success) {
        setUser(userData.data);
        
        const walletsResponse = await fetch(`/api/binance/user/${email}/wallets`);
        const walletsData = await walletsResponse.json();
        
        if (walletsData.success) {
          const cryptoData = walletsData.data.map((wallet: any) => ({
            symbol: wallet.cryptoSymbol,
            name: wallet.cryptoName,
            amount: wallet.balance,
            price: cryptoPrices[wallet.cryptoSymbol] || 0,
            change24h: parseFloat((Math.random() * 10 - 5).toFixed(2)),
            icon: cryptoIcons[wallet.cryptoSymbol] || "₿"
          })).filter((crypto: Crypto) => crypto.amount > 0);
          
          setCryptos(cryptoData);
        }
      }

      const transactionsResponse = await fetch(`/api/binance/user/${email}/transactions`);
      const transactionsData = await transactionsResponse.json();
      
      if (transactionsData.success) {
        setTransactions(transactionsData.data);
      }

      // Fetch chat status and unread count
      fetchChatStatus(email);
      fetchUnreadCount(email);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("binance_user");
    navigate("/cryptoport");
  };

  const totalBalance = cryptos.reduce((sum, c) => sum + c.amount * c.price, 0);
  const total24hChange = cryptos.reduce((sum, c) => sum + (c.amount * c.price * c.change24h / 100), 0);
  const total24hChangePercent = totalBalance > 0 ? (total24hChange / totalBalance * 100) : 0;

  if (!user) return null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B0E11]" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      {/* Top Navigation Bar */}
      <nav className="bg-[#181A20] border-b border-[#2B3139]">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left Section */}
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2">
                <img src="/images/download.png" alt="Logo" className="w-20 h-auto" />
              </Link>
              
                <div className="hidden lg:flex items-center gap-6 text-sm">
                <Link to="/binance/dashboard" className="text-[#F0B90B] hover:text-[#F8D12F] transition-colors font-medium">Dashboard</Link>
                <Link to="/binance/markets" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors">Markets</Link>
                <Link to="/binance/trade" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors">Trade</Link>
                <Link to="/binance/earn" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors">Earn</Link>
                <Link to="/binance/security" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors">Security</Link>
                <Link to="/binance/support" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors">Support</Link>
                <Link to="/binance/settings" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors">Settings</Link>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-[#2B3139] rounded transition-colors hidden md:block">
                <Search className="w-5 h-5 text-[#848E9C]" />
              </button>
              <button className="p-2 hover:bg-[#2B3139] rounded transition-colors hidden md:block">
                <Bell className="w-5 h-5 text-[#848E9C]" />
              </button>
              <button className="flex items-center gap-2 px-3 py-2 hover:bg-[#2B3139] rounded transition-colors">
                <User className="w-5 h-5 text-[#848E9C]" />
                <span className="text-[#EAECEF] text-sm hidden md:block">{user.username}</span>
              </button>
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 lg:hidden hover:bg-[#2B3139] rounded transition-colors">
                <Menu className="w-5 h-5 text-[#848E9C]" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-[#181A20] border-b border-[#2B3139] overflow-hidden"
          >
               <motion.div
                className="px-4 py-3 space-y-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <Link to="/binance/dashboard" className="block px-3 py-2 text-[#F0B90B] hover:bg-[#2B3139] rounded font-medium">Dashboard</Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link to="/binance/markets" className="block px-3 py-2 text-[#EAECEF] hover:bg-[#2B3139] rounded">Markets</Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link to="/binance/trade" className="block px-3 py-2 text-[#EAECEF] hover:bg-[#2B3139] rounded">Trade</Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link to="/binance/earn" className="block px-3 py-2 text-[#EAECEF] hover:bg-[#2B3139] rounded">Earn</Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link to="/binance/security" className="block px-3 py-2 text-[#EAECEF] hover:bg-[#2B3139] rounded">Security</Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link to="/binance/support" className="block px-3 py-2 text-[#EAECEF] hover:bg-[#2B3139] rounded">Support</Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link to="/binance/settings" className="block px-3 py-2 text-[#EAECEF] hover:bg-[#2B3139] rounded">Settings</Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-[#F6465D] hover:bg-[#2B3139] rounded">Logout</button>
                </motion.div>
              </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        {/* Wallet Overview Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Wallet className="w-6 h-6 text-[#F0B90B]" />
              <div>
                <h1 className="text-2xl font-semibold text-[#EAECEF]">Wallet Overview</h1>
                <p className="text-sm text-[#848E9C]">Hi {user.username}</p>
              </div>
            </div>
            <button 
              onClick={() => setHideBalance(!hideBalance)}
              className="flex items-center gap-2 px-3 py-1.5 bg-[#2B3139] hover:bg-[#3d4450] rounded text-sm text-[#EAECEF] transition-colors"
            >
              {hideBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {hideBalance ? 'Show' : 'Hide'} Balance
            </button>
          </div>

          {/* Balance Card */}
          <div className="bg-[#181A20] rounded-lg p-6 border border-[#2B3139]">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-[#848E9C] text-sm mb-2">Estimated Balance</p>
                <div className="flex items-baseline gap-3 mb-1">
                  <h2 className="text-4xl font-semibold text-[#EAECEF]">
                    {hideBalance ? '****' : (
                      <>
                        $<AnimatedNumber
                          value={totalBalance}
                          format={(val) => val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        />
                      </>
                    )}
                  </h2>
                  <span className={`text-sm font-medium ${total24hChangePercent >= 0 ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
                    {total24hChangePercent >= 0 ? '+' : ''}{total24hChangePercent.toFixed(2)}%
                  </span>
                </div>
                <p className="text-[#848E9C] text-sm">
                  ≈ {hideBalance ? '****' : `${totalBalance.toFixed(8)}`} BTC
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link to="/binance/receive" className="flex-1">
                  <motion.div
                    whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#2B3139] hover:bg-[#3d4450] rounded text-[#EAECEF] font-medium transition-colors"
                  >
                    <ArrowDownLeft className="w-4 h-4" />
                    Deposit
                  </motion.div>
                </Link>
                <Link to="/binance/send" className="flex-1">
                  <motion.div
                    whileHover={prefersReducedMotion ? {} : { scale: 1.02, boxShadow: "0 10px 30px rgba(240,185,11,0.3)" }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-[#F0B90B] hover:bg-[#F8D12F] rounded text-black font-medium transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    Withdraw
                  </motion.div>
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-[#2B3139]">
              <Link to="/binance/send">
                <motion.button
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -2 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="flex flex-col items-center gap-2 p-3 bg-[#0B0E11] hover:bg-[#2B3139] rounded transition-colors w-full"
                >
                  <Send className="w-5 h-5 text-[#F0B90B]" />
                  <span className="text-xs text-[#EAECEF]">Transfer</span>
                </motion.button>
              </Link>
              <Link to="/binance/trade">
                <motion.button
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -2 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="flex flex-col items-center gap-2 p-3 bg-[#0B0E11] hover:bg-[#2B3139] rounded transition-colors w-full"
                >
                  <TrendingUp className="w-5 h-5 text-[#F0B90B]" />
                  <span className="text-xs text-[#EAECEF]">Trade</span>
                </motion.button>
              </Link>
              <Link to="/binance/earn">
                <motion.button
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -2 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="flex flex-col items-center gap-2 p-3 bg-[#0B0E11] hover:bg-[#2B3139] rounded transition-colors w-full"
                >
                  <Wallet className="w-5 h-5 text-[#F0B90B]" />
                  <span className="text-xs text-[#EAECEF]">Earn</span>
                </motion.button>
              </Link>
              <Link to="/binance/security">
                <motion.button
                  whileHover={prefersReducedMotion ? {} : { scale: 1.05, y: -2 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="flex flex-col items-center gap-2 p-3 bg-[#0B0E11] hover:bg-[#2B3139] rounded transition-colors w-full"
                >
                  <Clock className="w-5 h-5 text-[#F0B90B]" />
                  <span className="text-xs text-[#EAECEF]">Security</span>
                </motion.button>
              </Link>
            </div>
          </div>
        </div>

        {/* Assets Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#EAECEF]">Assets</h2>
            <button className="text-sm text-[#F0B90B] hover:text-[#F8D12F] transition-colors">View All</button>
          </div>

          <div className="bg-[#181A20] rounded-lg border border-[#2B3139] overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#0B0E11] border-b border-[#2B3139] text-xs text-[#848E9C] font-medium">
              <div className="col-span-4">Coin</div>
              <div className="col-span-2 text-right hidden md:block">Total</div>
              <div className="col-span-2 text-right hidden md:block">Available</div>
              <div className="col-span-2 text-right">In Order</div>
              <div className="col-span-2 text-right">BTC Value</div>
            </div>

            {/* Table Body */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {cryptos.map((crypto) => {
                const btcValue = (crypto.amount * crypto.price) / cryptoPrices.BTC;
                return (
                  <motion.div
                    key={crypto.symbol}
                    variants={itemVariants}
                    whileHover={prefersReducedMotion ? {} : { scale: 1.01, backgroundColor: "rgba(43, 49, 57, 0.5)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#2B3139] cursor-pointer"
                  >
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F0B90B]/10 flex items-center justify-center text-[#F0B90B] font-semibold">
                      {crypto.icon}
                    </div>
                    <div>
                      <p className="text-[#EAECEF] font-medium">{crypto.symbol}</p>
                      <p className="text-[#848E9C] text-xs">{crypto.name}</p>
                    </div>
                  </div>
                  <div className="col-span-2 text-right hidden md:flex flex-col justify-center">
                    <p className="text-[#EAECEF] text-sm">{hideBalance ? '****' : crypto.amount.toFixed(4)}</p>
                    <p className="text-[#848E9C] text-xs">${hideBalance ? '****' : (crypto.amount * crypto.price).toFixed(2)}</p>
                  </div>
                  <div className="col-span-2 text-right hidden md:flex flex-col justify-center">
                    <p className="text-[#EAECEF] text-sm">{hideBalance ? '****' : crypto.amount.toFixed(4)}</p>
                  </div>
                  <div className="col-span-2 text-right flex flex-col justify-center">
                    <p className="text-[#EAECEF] text-sm">0.00</p>
                  </div>
                  <div className="col-span-2 text-right flex flex-col justify-center">
                    <p className="text-[#EAECEF] text-sm">{hideBalance ? '****' : btcValue.toFixed(8)}</p>
                  </div>
                </motion.div>
                );
              })}
            </motion.div>

            {cryptos.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-[#848E9C]">No assets found</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#EAECEF]">Recent Transactions</h2>
            <button className="text-sm text-[#F0B90B] hover:text-[#F8D12F] transition-colors">View All</button>
          </div>

          <div className="bg-[#181A20] rounded-lg border border-[#2B3139] overflow-hidden">
            {transactions.length > 0 ? (
              <div className="divide-y divide-[#2B3139]">
                {transactions.map((tx) => (
                  <div key={tx.id} className="px-6 py-4 hover:bg-[#2B3139]/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === "sent" ? "bg-[#F6465D]/10" : "bg-[#0ECB81]/10"
                        }`}>
                          {tx.type === "sent" ? (
                            <ArrowUpRight className="w-5 h-5 text-[#F6465D]" />
                          ) : (
                            <ArrowDownLeft className="w-5 h-5 text-[#0ECB81]" />
                          )}
                        </div>
                        <div>
                          <p className="text-[#EAECEF] font-medium">
                            {tx.type === "sent" ? "Withdraw" : "Deposit"}
                          </p>
                          <p className="text-[#848E9C] text-sm">{tx.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${tx.type === "sent" ? "text-[#F6465D]" : "text-[#0ECB81]"}`}>
                          {tx.type === "sent" ? "-" : "+"}
                          {tx.amount} {tx.crypto}
                        </p>
                        <p className="text-[#848E9C] text-sm">Completed</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-6 py-12 text-center">
                <Clock className="w-12 h-12 text-[#848E9C] mx-auto mb-3 opacity-30" />
                <p className="text-[#848E9C]">No recent transactions</p>
                <p className="text-[#848E9C] text-sm mt-1">Your transaction history will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      {chatEnabled && (
        <>
          {!chatIsOpen ? (
            <div className="fixed bottom-4 right-4">
              <button
                onClick={() => setChatIsOpen(true)}
                className="bg-yellow-500 text-black p-4 rounded-full shadow-lg hover:bg-yellow-600 transition-colors relative"
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
            <CryptoPortChatWidget
              user={user}
              isOpen={chatIsOpen}
              onClose={() => setChatIsOpen(false)}
            />
          )}
        </>
      )}
      </div>
    </PageTransition>
  );
};

export default BinanceDashboard;
