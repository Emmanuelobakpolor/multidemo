import { useState, useEffect } from "react";
import { Shield, Smartphone, Lock, Key, History, AlertCircle, CheckCircle, Settings, LogOut } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import PageTransition from "@/components/binance/PageTransition";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface LoginHistoryItem {
  id: string;
  date: string;
  time: string;
  location: string;
  device: string;
  ip: string;
  status: "active" | "inactive";
}

interface WhitelistAddress {
  id: string;
  crypto: string;
  address: string;
  label: string;
  addedDate: string;
  status: "active" | "pending";
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const BinanceSecurity = () => {
  const [user, setUser] = useState<any>(null);
  const [loginHistory, setLoginHistory] = useState<LoginHistoryItem[]>([]);
  const [whitelistAddresses, setWhitelistAddresses] = useState<WhitelistAddress[]>([]);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showWhitelistModal, setShowWhitelistModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<WhitelistAddress | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const userData = localStorage.getItem("binance_user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const initialLoginHistory: LoginHistoryItem[] = [
      {
        id: "1",
        date: "2024-02-14",
        time: "10:30 AM",
        location: "Lagos, Nigeria",
        device: "Chrome on Windows",
        ip: "192.168.1.1",
        status: "active",
      },
      {
        id: "2",
        date: "2024-02-13",
        time: "08:45 PM",
        location: "Abuja, Nigeria",
        device: "Safari on iPhone",
        ip: "10.0.0.5",
        status: "active",
      },
      {
        id: "3",
        date: "2024-02-12",
        time: "03:20 PM",
        location: "Lagos, Nigeria",
        device: "Firefox on Windows",
        ip: "192.168.1.1",
        status: "inactive",
      },
    ];

    const initialWhitelistAddresses: WhitelistAddress[] = [
      {
        id: "1",
        crypto: "BTC",
        address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
        label: "My Bitcoin Wallet",
        addedDate: "2024-02-10",
        status: "active",
      },
      {
        id: "2",
        crypto: "ETH",
        address: "0x742d35Cc6634C0532925a3b885B6b99a1Dd32086",
        label: "My Ethereum Wallet",
        addedDate: "2024-02-11",
        status: "active",
      },
    ];

    setLoginHistory(initialLoginHistory);
    setWhitelistAddresses(initialWhitelistAddresses);
  }, []);

  const handleToggle2FA = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
  };

  const handleAddWhitelistAddress = () => {
    alert("Whitelist address feature coming soon!");
    setShowWhitelistModal(false);
  };

  const handleRemoveWhitelistAddress = (addressId: string) => {
    setWhitelistAddresses(whitelistAddresses.filter(address => address.id !== addressId));
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B0E11]" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
        {/* Top Navigation Bar */}
        <nav className="bg-[#181A20] border-b border-[#2B3139]">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-8">
                <a href="/binance" className="flex items-center gap-2">
                  <img src="/images/download.png" alt="Binance Logo" className="w-20 h-auto" />
                </a>
                
                <div className="hidden lg:flex items-center gap-6 text-sm">
                  <a href="/binance/dashboard" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors font-medium">Dashboard</a>
                  <a href="/binance/markets" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors">Markets</a>
                  <a href="/binance/trade" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors">Trade</a>
                  <a href="/binance/earn" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors">Earn</a>
                  <a href="/binance/settings" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors">Settings</a>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-[#F0B90B]" />
              <div>
                <h1 className="text-2xl font-semibold text-[#EAECEF]">Security</h1>
                <p className="text-sm text-[#848E9C]">Protect your account</p>
              </div>
            </div>

            {/* Security Status */}
            <div className="bg-[#181A20] rounded-lg border border-[#2B3139] p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#EAECEF]">Security Status</h2>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  twoFactorEnabled ? "bg-[#0ECB81]/20 text-[#0ECB81]" : "bg-[#F6465D]/20 text-[#F6465D]"
                }`}>
                  {twoFactorEnabled ? "High" : "Medium"}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    twoFactorEnabled ? "bg-[#0ECB81]/20 text-[#0ECB81]" : "bg-[#F6465D]/20 text-[#F6465D]"
                  }`}>
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[#EAECEF] font-medium">Two-Factor Authentication</p>
                    <p className="text-[#848E9C] text-sm">
                      {twoFactorEnabled ? "Enabled" : "Not enabled"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0ECB81]/20 text-[#0ECB81] flex items-center justify-center">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[#EAECEF] font-medium">Email Verification</p>
                    <p className="text-[#848E9C] text-sm">Verified</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Two-Factor Authentication */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-[#181A20] rounded-lg border border-[#2B3139] p-6"
              >
                <h2 className="text-lg font-semibold text-[#EAECEF] mb-4">Two-Factor Authentication (2FA)</h2>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-6 h-6 text-[#848E9C]" />
                    <div>
                      <p className="text-[#EAECEF] font-medium">Google Authenticator</p>
                      <p className="text-[#848E9C] text-sm">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShow2FAModal(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      twoFactorEnabled
                        ? "bg-[#0ECB81]/20 text-[#0ECB81]"
                        : "bg-[#F0B90B] text-black hover:bg-[#F8D12F]"
                    }`}
                  >
                    {twoFactorEnabled ? "Disable" : "Enable"}
                  </button>
                </div>
              </motion.div>

              {/* Whitelist Addresses */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-[#181A20] rounded-lg border border-[#2B3139] p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#EAECEF]">Whitelist Addresses</h2>
                  <button
                    onClick={() => setShowWhitelistModal(true)}
                    className="px-4 py-2 bg-[#F0B90B] text-black hover:bg-[#F8D12F] rounded-lg text-sm font-medium transition-colors"
                  >
                    Add Address
                  </button>
                </div>
                <div className="space-y-3">
                  {whitelistAddresses.map((address) => (
                    <motion.div
                      key={address.id}
                      variants={itemVariants}
                      whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
                      className="flex items-center justify-between p-4 bg-[#0B0E11] rounded-lg"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[#F0B90B] font-medium">{address.crypto}</span>
                          <span className="text-[#848E9C] text-xs">{address.label}</span>
                        </div>
                        <p className="text-[#EAECEF] text-sm font-mono">{address.address}</p>
                        <p className="text-[#848E9C] text-xs mt-1">
                          Added: {address.addedDate}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveWhitelistAddress(address.id)}
                        className="px-3 py-1 bg-[#F6465D]/20 text-[#F6465D] hover:bg-[#F6465D]/30 rounded-lg text-sm font-medium transition-colors"
                      >
                        Remove
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Login History */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="bg-[#181A20] rounded-lg border border-[#2B3139] p-6"
              >
                <h2 className="text-lg font-semibold text-[#EAECEF] mb-4">Login History</h2>
                <div className="space-y-3">
                  {loginHistory.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
                      className="flex items-center justify-between p-4 bg-[#0B0E11] rounded-lg"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[#EAECEF] font-medium">{item.location}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            item.status === "active" 
                              ? "bg-[#0ECB81]/20 text-[#0ECB81]" 
                              : "bg-[#F6465D]/20 text-[#F6465D]"
                          }`}>
                            {item.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="text-[#848E9C] text-sm">{item.device} - {item.ip}</p>
                        <p className="text-[#848E9C] text-xs mt-1">
                          {item.date} at {item.time}
                        </p>
                      </div>
                      {item.status === "active" && (
                        <div className="text-right">
                          <button className="text-[#848E9C] hover:text-[#F0B90B] transition-colors text-xs">
                            Log Out
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Quick Actions */}
            <div className="space-y-6">
              {/* Security Tips */}
              <div className="bg-[#181A20] rounded-lg border border-[#2B3139] p-6">
                <h3 className="text-lg font-semibold text-[#EAECEF] mb-4">Security Tips</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#F0B90B] mt-0.5" />
                    <div>
                      <p className="text-[#EAECEF] font-medium text-sm">Enable 2FA</p>
                      <p className="text-[#848E9C] text-xs">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#F0B90B] mt-0.5" />
                    <div>
                      <p className="text-[#EAECEF] font-medium text-sm">Use Strong Password</p>
                      <p className="text-[#848E9C] text-xs">Use a unique password with at least 8 characters</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-[#F0B90B] mt-0.5" />
                    <div>
                      <p className="text-[#EAECEF] font-medium text-sm">Whitelist Addresses</p>
                      <p className="text-[#848E9C] text-xs">Only allow withdrawals to trusted addresses</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-[#181A20] rounded-lg border border-[#2B3139] p-6">
                <h3 className="text-lg font-semibold text-[#EAECEF] mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#0ECB81] mt-0.5" />
                    <div>
                      <p className="text-[#EAECEF] font-medium text-sm">Login Success</p>
                      <p className="text-[#848E9C] text-xs">Lagos, Nigeria • Today at 10:30 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#0ECB81] mt-0.5" />
                    <div>
                      <p className="text-[#EAECEF] font-medium text-sm">Password Changed</p>
                      <p className="text-[#848E9C] text-xs">Lagos, Nigeria • Yesterday at 08:45 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2FA Modal */}
        <AnimatePresence>
          {show2FAModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-[#181A20] rounded-lg border border-[#2B3139] w-full max-w-md"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-[#EAECEF] mb-4">
                    {twoFactorEnabled ? "Disable" : "Enable"} Two-Factor Authentication
                  </h3>
                  
                  {twoFactorEnabled ? (
                    <div className="mb-4">
                      <p className="text-[#848E9C] text-sm mb-4">
                        Are you sure you want to disable 2FA? This will reduce your account security.
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            handleToggle2FA();
                            setShow2FAModal(false);
                          }}
                          className="flex-1 py-2 bg-[#F6465D] hover:bg-[#ff5763] text-white rounded-lg font-medium transition-colors"
                        >
                          Disable 2FA
                        </button>
                        <button
                          onClick={() => setShow2FAModal(false)}
                          className="flex-1 py-2 bg-[#2B3139] hover:bg-[#3d4450] text-[#EAECEF] rounded-lg font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <p className="text-[#848E9C] text-sm mb-4">
                        To enable 2FA, please scan the QR code with your Google Authenticator app.
                      </p>
                      <div className="bg-white rounded-lg p-4 mb-4 flex justify-center">
                        <div className="w-48 h-48 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-600 text-sm">QR Code Here</span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="text-[#848E9C] text-sm block mb-2">
                          Enter Verification Code
                        </label>
                        <input
                          type="text"
                          placeholder="000000"
                          className="w-full px-3 py-2 bg-[#0B0E11] border border-[#2B3139] rounded text-sm text-[#EAECEF] focus:outline-none focus:border-[#F0B90B] transition-colors"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            handleToggle2FA();
                            setShow2FAModal(false);
                          }}
                          className="flex-1 py-2 bg-[#F0B90B] hover:bg-[#F8D12F] text-black rounded-lg font-medium transition-colors"
                        >
                          Enable 2FA
                        </button>
                        <button
                          onClick={() => setShow2FAModal(false)}
                          className="flex-1 py-2 bg-[#2B3139] hover:bg-[#3d4450] text-[#EAECEF] rounded-lg font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Whitelist Address Modal */}
        <AnimatePresence>
          {showWhitelistModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-[#181A20] rounded-lg border border-[#2B3139] w-full max-w-md"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-[#EAECEF] mb-4">Add Whitelist Address</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-[#848E9C] text-sm block mb-2">
                        Cryptocurrency
                      </label>
                      <select className="w-full px-3 py-2 bg-[#0B0E11] border border-[#2B3139] rounded text-sm text-[#EAECEF] focus:outline-none focus:border-[#F0B90B] transition-colors">
                        <option value="BTC">Bitcoin (BTC)</option>
                        <option value="ETH">Ethereum (ETH)</option>
                        <option value="BNB">BNB</option>
                        <option value="SOL">Solana (SOL)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[#848E9C] text-sm block mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        placeholder="Enter cryptocurrency address"
                        className="w-full px-3 py-2 bg-[#0B0E11] border border-[#2B3139] rounded text-sm text-[#EAECEF] focus:outline-none focus:border-[#F0B90B] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-[#848E9C] text-sm block mb-2">
                        Label
                      </label>
                      <input
                        type="text"
                        placeholder="Enter address label"
                        className="w-full px-3 py-2 bg-[#0B0E11] border border-[#2B3139] rounded text-sm text-[#EAECEF] focus:outline-none focus:border-[#F0B90B] transition-colors"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleAddWhitelistAddress}
                        className="flex-1 py-2 bg-[#F0B90B] hover:bg-[#F8D12F] text-black rounded-lg font-medium transition-colors"
                      >
                        Add Address
                      </button>
                      <button
                        onClick={() => setShowWhitelistModal(false)}
                        className="flex-1 py-2 bg-[#2B3139] hover:bg-[#3d4450] text-[#EAECEF] rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default BinanceSecurity;
