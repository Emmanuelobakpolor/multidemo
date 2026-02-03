import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Send, AlertCircle, ChevronDown, Info, CheckCircle2, Clock } from "lucide-react";

const BinanceSend = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: Form, 2: Confirmation, 3: Success
  const [formData, setFormData] = useState({
    cryptocurrency: "BTC",
    network: "Bitcoin (BTC)",
    walletAddress: "",
    amount: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cryptos, setCryptos] = useState<any[]>([]);
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false);

  const networks = {
    BTC: ["Bitcoin (BTC)"],
    ETH: ["Ethereum (ERC20)", "BSC (BEP20)", "Polygon"],
    BNB: ["BSC (BEP20)", "BNB Beacon Chain (BEP2)"],
    SOL: ["Solana"],
    ADA: ["Cardano"],
    DOT: ["Polkadot"],
    LINK: ["Ethereum (ERC20)", "BSC (BEP20)"],
    UNI: ["Ethereum (ERC20)", "BSC (BEP20)"]
  };

  const networkFees = {
    "Bitcoin (BTC)": 0.0001,
    "Ethereum (ERC20)": 0.003,
    "BSC (BEP20)": 0.0005,
    "Polygon": 0.1,
    "Solana": 0.000005,
    "Cardano": 0.17,
    "Polkadot": 0.01,
  };

  useEffect(() => {
    const userData = localStorage.getItem("cryptoport_user");
    if (!userData) {
      navigate("/cryptoport/login");
    } else {
      setUser(JSON.parse(userData));
      fetchCryptoWallets(JSON.parse(userData).email);
    }
  }, [navigate]);

  const fetchCryptoWallets = async (email: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/cryptoport/user/${email}/wallets`);
      const data = await response.json();
      
      if (data.success) {
        setCryptos(data.data);
      }
    } catch (error) {
      console.error("Error fetching crypto wallets:", error);
    }
  };

  const handleContinue = () => {
    setError("");

    if (!formData.walletAddress.trim()) {
      setError("Please enter a valid withdrawal address");
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    const selectedCrypto = cryptos.find((c) => c.cryptoSymbol === formData.cryptocurrency);
    const fee = networkFees[formData.network] || 0.0001;
    const total = parseFloat(formData.amount) + fee;

    if (!selectedCrypto || total > selectedCrypto.balance) {
      setError("Insufficient balance for withdrawal + network fee");
      return;
    }

    setCurrentStep(2);
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/api/cryptoport/user/${user.email}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientEmail: formData.walletAddress,
          cryptoSymbol: formData.cryptocurrency,
          amount: parseFloat(formData.amount),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCurrentStep(3);
      } else {
        setError(data.error || "Withdrawal failed");
        setLoading(false);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  if (!user) return null;

  const selectedCrypto = cryptos.find((c) => c.cryptoSymbol === formData.cryptocurrency);
  const networkFee = networkFees[formData.network] || 0.0001;
  const totalAmount = formData.amount ? parseFloat(formData.amount) + networkFee : 0;

  // Success Screen
  if (currentStep === 3) {
    return (
      <div className="min-h-screen bg-[#0B0E11]" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
        <header className="bg-[#181A20] border-b border-[#2B3139]">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-lg font-semibold text-[#EAECEF]">Withdrawal Submitted</h1>
            </div>
          </div>
        </header>

        <div className="flex items-center justify-center py-16 px-4">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-[#0ECB81]/10 border-2 border-[#0ECB81] flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-[#0ECB81]" />
              </div>
              <h1 className="text-3xl font-bold text-[#EAECEF] mb-3">Withdrawal Submitted</h1>
              <p className="text-[#848E9C]">Your withdrawal request has been submitted successfully</p>
            </div>

            <div className="bg-[#181A20] rounded-lg border border-[#2B3139] p-6 mb-6">
              <div className="space-y-4">
                <div className="flex justify-between pb-3 border-b border-[#2B3139]">
                  <span className="text-[#848E9C] text-sm">Coin</span>
                  <span className="text-[#EAECEF] font-medium">{formData.cryptocurrency}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-[#2B3139]">
                  <span className="text-[#848E9C] text-sm">Network</span>
                  <span className="text-[#EAECEF] font-medium">{formData.network}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-[#2B3139]">
                  <span className="text-[#848E9C] text-sm">Amount</span>
                  <span className="text-[#EAECEF] font-medium">{formData.amount} {formData.cryptocurrency}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-[#2B3139]">
                  <span className="text-[#848E9C] text-sm">Address</span>
                  <span className="text-[#EAECEF] font-medium font-mono text-xs">{formData.walletAddress.slice(0, 12)}...{formData.walletAddress.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#848E9C] text-sm">Status</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#F0B90B] animate-pulse"></div>
                    <span className="text-[#F0B90B] font-medium">Processing</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0ECB81]/10 border border-[#0ECB81]/30 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-[#0ECB81] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#0ECB81] text-sm font-medium mb-1">Processing Time</p>
                  <p className="text-[#0ECB81]/80 text-xs">
                    Your withdrawal will be processed within 5-30 minutes. You'll receive an email notification once completed.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/cryptoport/dashboard")}
              className="w-full px-6 py-3 bg-[#F0B90B] hover:bg-[#F8D12F] rounded-lg text-black font-medium transition-colors"
            >
              Back to Wallet
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Confirmation Screen
  if (currentStep === 2) {
    return (
      <div className="min-h-screen bg-[#0B0E11]" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
        <header className="bg-[#181A20] border-b border-[#2B3139]">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-2 text-[#EAECEF] hover:text-[#F0B90B] transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-sm font-medium">Back</span>
                </button>
                <div className="h-6 w-px bg-[#2B3139]" />
                <h1 className="text-lg font-semibold text-[#EAECEF]">Confirm Withdrawal</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-[#181A20] rounded-lg border border-[#2B3139] p-6 mb-6">
            <h2 className="text-[#EAECEF] font-semibold mb-4">Withdrawal Details</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between pb-3 border-b border-[#2B3139]">
                <span className="text-[#848E9C] text-sm">Coin</span>
                <span className="text-[#EAECEF] font-medium">{formData.cryptocurrency}</span>
              </div>
              
              <div className="flex justify-between pb-3 border-b border-[#2B3139]">
                <span className="text-[#848E9C] text-sm">Network</span>
                <span className="text-[#EAECEF] font-medium">{formData.network}</span>
              </div>
              
              <div className="flex justify-between pb-3 border-b border-[#2B3139]">
                <span className="text-[#848E9C] text-sm">Withdrawal Address</span>
                <span className="text-[#EAECEF] font-medium font-mono text-xs break-all text-right max-w-[60%]">{formData.walletAddress}</span>
              </div>
              
              <div className="flex justify-between pb-3 border-b border-[#2B3139]">
                <span className="text-[#848E9C] text-sm">Amount</span>
                <span className="text-[#EAECEF] font-medium">{formData.amount} {formData.cryptocurrency}</span>
              </div>
              
              <div className="flex justify-between pb-3 border-b border-[#2B3139]">
                <span className="text-[#848E9C] text-sm">Network Fee</span>
                <span className="text-[#EAECEF] font-medium">{networkFee} {formData.cryptocurrency}</span>
              </div>
              
              <div className="flex justify-between pt-2">
                <span className="text-[#EAECEF] font-semibold">You'll Receive</span>
                <span className="text-[#EAECEF] font-bold text-lg">{formData.amount} {formData.cryptocurrency}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-[#F6465D]/10 border border-[#F6465D]/30 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-[#F6465D] flex-shrink-0" />
                <p className="text-[#F6465D] text-sm">{error}</p>
              </div>
            </div>
          )}

          <div className="bg-[#F0B90B]/10 border border-[#F0B90B]/30 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-[#F0B90B] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[#F0B90B] text-sm font-medium mb-1">Important Notice</p>
                <p className="text-[#F0B90B]/80 text-xs">
                  Please verify the withdrawal address carefully. Cryptocurrency transactions cannot be reversed once confirmed.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setCurrentStep(1)}
              className="flex-1 px-6 py-3 bg-[#2B3139] hover:bg-[#3d4450] rounded-lg text-[#EAECEF] font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-[#F0B90B] hover:bg-[#F8D12F] rounded-lg text-black font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Confirm Withdrawal"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Form Screen (Step 1)
  return (
    <div className="min-h-screen bg-[#0B0E11]" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      {/* Header */}
      <header className="bg-[#181A20] border-b border-[#2B3139]">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/cryptoport/dashboard")}
                className="flex items-center gap-2 text-[#EAECEF] hover:text-[#F0B90B] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">Back to Wallet</span>
              </button>
              <div className="h-6 w-px bg-[#2B3139] hidden sm:block" />
              <h1 className="text-lg font-semibold text-[#EAECEF]">Withdraw Crypto</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1000px] mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Column - Instructions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Warning Card */}
            <div className="bg-[#F6465D]/10 border border-[#F6465D]/30 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#F6465D] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-[#F6465D] font-semibold mb-2">Security Notice</h3>
                  <ul className="text-[#F6465D]/80 text-sm space-y-2">
                    <li>• Double-check the withdrawal address</li>
                    <li>• Ensure you select the correct network</li>
                    <li>• Transactions cannot be reversed</li>
                    <li>• Minimum withdrawal amounts apply</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-[#181A20] rounded-lg border border-[#2B3139] p-6">
              <h3 className="text-[#EAECEF] font-semibold mb-4">Withdrawal Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#848E9C]">Min. Withdrawal</span>
                  <span className="text-[#EAECEF]">0.001 {formData.cryptocurrency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#848E9C]">Processing Time</span>
                  <span className="text-[#EAECEF]">5-30 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#848E9C]">Network Fee</span>
                  <span className="text-[#EAECEF]">{networkFee} {formData.cryptocurrency}</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-[#181A20] rounded-lg border border-[#2B3139] p-6">
              <h3 className="text-[#EAECEF] font-semibold mb-4">Tips</h3>
              <ul className="text-[#848E9C] text-sm space-y-2">
                <li className="flex gap-2">
                  <span className="text-[#F0B90B]">•</span>
                  <span>Use address whitelist for added security</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#F0B90B]">•</span>
                  <span>Test with small amounts first</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-[#F0B90B]">•</span>
                  <span>Keep transaction records for reference</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-3">
            <div className="bg-[#181A20] rounded-lg border border-[#2B3139]">
              <div className="px-6 py-4 border-b border-[#2B3139]">
                <h2 className="text-[#EAECEF] font-semibold">Withdrawal Details</h2>
              </div>

              <div className="p-6 space-y-6">
                {error && (
                  <div className="bg-[#F6465D]/10 border border-[#F6465D]/30 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-[#F6465D] flex-shrink-0" />
                      <p className="text-[#F6465D] text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {/* Coin Selector */}
                <div>
                  <label className="block text-[#EAECEF] text-sm font-medium mb-3">
                    Select Coin
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {cryptos.map((crypto) => (
                      <button
                        key={crypto.cryptoSymbol}
                        onClick={() => {
                          setFormData({ 
                            ...formData, 
                            cryptocurrency: crypto.cryptoSymbol,
                            network: networks[crypto.cryptoSymbol]?.[0] || crypto.cryptoSymbol
                          });
                        }}
                        className={`px-4 py-3 rounded-lg border transition-all ${
                          formData.cryptocurrency === crypto.cryptoSymbol
                            ? "border-[#F0B90B] bg-[#F0B90B]/10 text-[#F0B90B]"
                            : "border-[#2B3139] text-[#EAECEF] hover:border-[#3d4450]"
                        }`}
                      >
                        <p className="font-semibold">{crypto.cryptoSymbol}</p>
                        <p className="text-xs opacity-70">{crypto.balance}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Available Balance */}
                {selectedCrypto && (
                  <div className="bg-[#0B0E11] rounded-lg p-4 border border-[#2B3139]">
                    <p className="text-[#848E9C] text-sm mb-1">Available Balance</p>
                    <p className="text-[#EAECEF] text-2xl font-semibold">
                      {selectedCrypto.balance} {selectedCrypto.cryptoSymbol}
                    </p>
                  </div>
                )}

                {/* Network Selector */}
                <div>
                  <label className="block text-[#EAECEF] text-sm font-medium mb-3">
                    Select Network
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
                      className="w-full px-4 py-3 bg-[#2B3139] hover:bg-[#3d4450] rounded-lg text-left flex items-center justify-between transition-colors"
                    >
                      <span className="text-[#EAECEF]">{formData.network}</span>
                      <ChevronDown className="w-5 h-5 text-[#848E9C]" />
                    </button>
                    {showNetworkDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-[#2B3139] rounded-lg border border-[#3d4450] overflow-hidden z-10">
                        {networks[formData.cryptocurrency]?.map((network) => (
                          <button
                            key={network}
                            onClick={() => {
                              setFormData({ ...formData, network });
                              setShowNetworkDropdown(false);
                            }}
                            className="w-full px-4 py-3 text-left text-[#EAECEF] hover:bg-[#3d4450] transition-colors"
                          >
                            {network}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Withdrawal Address */}
                <div>
                  <label className="block text-[#EAECEF] text-sm font-medium mb-3">
                    Withdrawal Address
                  </label>
                  <input
                    type="text"
                    value={formData.walletAddress}
                    onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                    placeholder="Enter withdrawal address"
                    className="w-full px-4 py-3 bg-[#2B3139] rounded-lg text-[#EAECEF] placeholder-[#848E9C] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#F0B90B]"
                  />
                  <p className="text-[#848E9C] text-xs mt-2">
                    Make sure the address is correct. Funds sent to wrong address cannot be recovered.
                  </p>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-[#EAECEF] text-sm font-medium mb-3">
                    Withdrawal Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      placeholder="0.00"
                      step="0.00000001"
                      min="0"
                      className="w-full px-4 py-3 bg-[#2B3139] rounded-lg text-[#EAECEF] placeholder-[#848E9C] focus:outline-none focus:ring-2 focus:ring-[#F0B90B] pr-20"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <span className="text-[#848E9C] text-sm font-semibold">{formData.cryptocurrency}</span>
                      {selectedCrypto && (
                        <button
                          onClick={() => setFormData({ ...formData, amount: (selectedCrypto.balance - networkFee).toString() })}
                          className="text-[#F0B90B] text-xs font-semibold hover:text-[#F8D12F]"
                        >
                          MAX
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Summary */}
                {formData.amount && parseFloat(formData.amount) > 0 && (
                  <div className="bg-[#0B0E11] rounded-lg p-4 border border-[#2B3139] space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#848E9C]">Withdrawal Amount</span>
                      <span className="text-[#EAECEF] font-medium">{formData.amount} {formData.cryptocurrency}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#848E9C]">Network Fee</span>
                      <span className="text-[#EAECEF] font-medium">{networkFee} {formData.cryptocurrency}</span>
                    </div>
                    <div className="border-t border-[#2B3139] pt-3 flex justify-between">
                      <span className="text-[#EAECEF] font-semibold">You'll Receive</span>
                      <span className="text-[#EAECEF] font-bold text-lg">{formData.amount} {formData.cryptocurrency}</span>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleContinue}
                  className="w-full px-6 py-3 bg-[#F0B90B] hover:bg-[#F8D12F] rounded-lg text-black font-medium transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinanceSend;