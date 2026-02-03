import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Copy, Download, Share2, ChevronDown, Info, AlertCircle } from "lucide-react";
import { useCryptoQRCode } from "@/hooks/useCryptoQRCode";

const BinanceReceive = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [selectedCrypto, setSelectedCrypto] = useState("BTC");
  const [selectedNetwork, setSelectedNetwork] = useState("BTC");
  const [copied, setCopied] = useState("");
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
      const response = await fetch(`/api/cryptoport/user/${email}/wallets`);
      const data = await response.json();
      
      if (data.success) {
        setCryptos(data.data);
      }
    } catch (error) {
      console.error("Error fetching crypto wallets:", error);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(""), 2000);
  };

  const currentCrypto = cryptos.find((c) => c.cryptoSymbol === selectedCrypto);
  const qrCodeUrl = useCryptoQRCode(user, cryptos, selectedCrypto);

  if (!user) return null;

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
              <h1 className="text-lg font-semibold text-[#EAECEF]">Deposit Crypto</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1000px] mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Column - Instructions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info Card */}
            <div className="bg-[#181A20] rounded-lg border border-[#2B3139] p-6">
              <div className="flex items-start gap-3 mb-4">
                <Info className="w-5 h-5 text-[#F0B90B] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-[#EAECEF] font-semibold mb-2">Deposit Information</h3>
                  <p className="text-[#848E9C] text-sm leading-relaxed">
                    Send only {selectedCrypto} to this deposit address. Sending any other asset may result in permanent loss.
                  </p>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="bg-[#181A20] rounded-lg border border-[#2B3139] p-6">
              <h3 className="text-[#EAECEF] font-semibold mb-4">How to Deposit</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#F0B90B] flex items-center justify-center flex-shrink-0">
                    <span className="text-black text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-[#EAECEF] text-sm font-medium">Select coin and network</p>
                    <p className="text-[#848E9C] text-xs mt-1">Choose the cryptocurrency and network you want to deposit</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#F0B90B] flex items-center justify-center flex-shrink-0">
                    <span className="text-black text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-[#EAECEF] text-sm font-medium">Copy address or scan QR</p>
                    <p className="text-[#848E9C] text-xs mt-1">Use the deposit address or QR code provided</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#F0B90B] flex items-center justify-center flex-shrink-0">
                    <span className="text-black text-xs font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-[#EAECEF] text-sm font-medium">Wait for confirmation</p>
                    <p className="text-[#848E9C] text-xs mt-1">Your funds will be available after network confirmation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Network Requirements */}
            <div className="bg-[#181A20] rounded-lg border border-[#2B3139] p-6">
              <h3 className="text-[#EAECEF] font-semibold mb-4">Network Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#848E9C]">Min. Deposit</span>
                  <span className="text-[#EAECEF]">0.0001 {selectedCrypto}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#848E9C]">Network</span>
                  <span className="text-[#EAECEF]">{selectedNetwork}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#848E9C]">Confirmations</span>
                  <span className="text-[#EAECEF]">{selectedCrypto === 'BTC' ? '2' : '12'} blocks</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Deposit Form */}
          <div className="lg:col-span-3">
            <div className="bg-[#181A20] rounded-lg border border-[#2B3139]">
              {/* Header */}
              <div className="px-6 py-4 border-b border-[#2B3139]">
                <h2 className="text-[#EAECEF] font-semibold">Deposit {selectedCrypto}</h2>
              </div>

              <div className="p-6 space-y-6">
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
                          setSelectedCrypto(crypto.cryptoSymbol);
                          setSelectedNetwork(networks[crypto.cryptoSymbol]?.[0] || crypto.cryptoSymbol);
                        }}
                        className={`px-4 py-3 rounded-lg border transition-all ${
                          selectedCrypto === crypto.cryptoSymbol
                            ? "border-[#F0B90B] bg-[#F0B90B]/10 text-[#F0B90B]"
                            : "border-[#2B3139] text-[#EAECEF] hover:border-[#3d4450]"
                        }`}
                      >
                        <p className="font-semibold">{crypto.cryptoSymbol}</p>
                        <p className="text-xs opacity-70">{crypto.cryptoName}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {currentCrypto && (
                  <>
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
                          <span className="text-[#EAECEF]">{selectedNetwork}</span>
                          <ChevronDown className="w-5 h-5 text-[#848E9C]" />
                        </button>
                        {showNetworkDropdown && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-[#2B3139] rounded-lg border border-[#3d4450] overflow-hidden z-10">
                            {networks[selectedCrypto]?.map((network) => (
                              <button
                                key={network}
                                onClick={() => {
                                  setSelectedNetwork(network);
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

                    {/* Warning */}
                    <div className="bg-[#F6465D]/10 border border-[#F6465D]/30 rounded-lg p-4">
                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-[#F6465D] flex-shrink-0" />
                        <div>
                          <p className="text-[#F6465D] text-sm font-medium mb-1">Important</p>
                          <p className="text-[#F6465D]/80 text-xs">
                            Send only {selectedCrypto} to this address via {selectedNetwork}. Other assets or networks may be lost permanently.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div>
                      <label className="block text-[#EAECEF] text-sm font-medium mb-3">
                        Deposit QR Code
                      </label>
                      <div className="bg-[#0B0E11] rounded-lg p-6 flex flex-col items-center">
                        <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center mb-4">
                          {qrCodeUrl ? (
                            <img 
                              src={qrCodeUrl} 
                              alt={`${currentCrypto.cryptoSymbol} QR Code`} 
                              className="max-w-full max-h-full"
                            />
                          ) : (
                            <div className="text-center">
                              <div className="text-4xl mb-2 text-[#2B3139]">₿</div>
                              <p className="text-xs text-[#848E9C]">Generating...</p>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            if (!qrCodeUrl) return;
                            const link = document.createElement("a");
                            link.href = qrCodeUrl;
                            link.download = `${selectedCrypto}-deposit-qr.png`;
                            link.click();
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-[#2B3139] hover:bg-[#3d4450] rounded text-[#EAECEF] text-sm transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Save QR Code
                        </button>
                      </div>
                    </div>

                    {/* Deposit Address */}
                    <div>
                      <label className="block text-[#EAECEF] text-sm font-medium mb-3">
                        Deposit Address
                      </label>
                      <div className="relative">
                        <div className="bg-[#2B3139] rounded-lg p-4 pr-12">
                          <code className="text-[#EAECEF] text-sm font-mono break-all">
                            {currentCrypto.depositAddress}
                          </code>
                        </div>
                        <button
                          onClick={() => copyToClipboard(currentCrypto.depositAddress, "address")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[#3d4450] hover:bg-[#4a5361] rounded transition-colors group"
                          title="Copy address"
                        >
                          <Copy className="w-4 h-4 text-[#848E9C] group-hover:text-[#F0B90B]" />
                        </button>
                      </div>
                      {copied === "address" && (
                        <p className="text-[#0ECB81] text-xs mt-2 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-[#0ECB81] rounded-full"></span>
                          Address copied to clipboard
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={async () => {
                          if (!currentCrypto) return;
                          const shareData = {
                            title: `My ${currentCrypto.cryptoSymbol} Deposit Address`,
                            text: `Send ${currentCrypto.cryptoSymbol} to:`,
                            url: currentCrypto.depositAddress,
                          };
                          if (navigator.share) {
                            try {
                              await navigator.share(shareData);
                            } catch (err) {
                              console.error("Share cancelled", err);
                            }
                          } else {
                            copyToClipboard(currentCrypto.depositAddress, "address");
                          }
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#2B3139] hover:bg-[#3d4450] rounded-lg text-[#EAECEF] font-medium transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                      <button
                        onClick={() => copyToClipboard(currentCrypto.depositAddress, "address")}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#F0B90B] hover:bg-[#F8D12F] rounded-lg text-black font-medium transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Address
                      </button>
                    </div>

                    {/* Additional Info */}
                    <div className="bg-[#0ECB81]/10 border border-[#0ECB81]/30 rounded-lg p-4">
                      <p className="text-[#0ECB81] text-xs">
                        <span className="font-semibold">Expected Arrival:</span> {selectedCrypto === 'BTC' ? '2-6' : '12-24'} network confirmations ({selectedCrypto === 'BTC' ? '~20-60' : '~3-5'} minutes)
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Recent Deposits */}
            <div className="bg-[#181A20] rounded-lg border border-[#2B3139] mt-6">
              <div className="px-6 py-4 border-b border-[#2B3139]">
                <h3 className="text-[#EAECEF] font-semibold">Recent Deposits</h3>
              </div>
              <div className="p-6">
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-[#2B3139] flex items-center justify-center mx-auto mb-3">
                    <ArrowLeft className="w-8 h-8 text-[#848E9C] opacity-30 rotate-[135deg]" />
                  </div>
                  <p className="text-[#848E9C] text-sm">No recent deposits</p>
                  <p className="text-[#848E9C] text-xs mt-1">Your deposit history will appear here</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinanceReceive;
