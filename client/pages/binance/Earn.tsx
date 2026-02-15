import { useState, useEffect } from "react";
import { Search, Filter, Clock, TrendingUp, ArrowRight, Star } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import PageTransition from "@/components/binance/PageTransition";
import AnimatedNumber from "@/components/binance/AnimatedNumber";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface StakingProduct {
  id: string;
  name: string;
  symbol: string;
  apy: number;
  minAmount: number;
  duration: number;
  type: "flexible" | "locked";
  risk: "low" | "medium" | "high";
  icon: string;
  totalStaked: number;
  available: boolean;
}

interface SavingsProduct {
  id: string;
  name: string;
  symbol: string;
  apy: number;
  minAmount: number;
  duration: number;
  type: "fixed" | "flexible";
  risk: "low" | "medium" | "high";
  icon: string;
  totalInvested: number;
  available: boolean;
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

const BinanceEarn = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("staking");
  const [stakingProducts, setStakingProducts] = useState<StakingProduct[]>([]);
  const [savingsProducts, setSavingsProducts] = useState<SavingsProduct[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<StakingProduct | SavingsProduct | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState("");
  const prefersReducedMotion = useReducedMotion();

  const cryptoIcons = {
    BTC: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    ETH: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    BNB: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    SOL: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    ADA: "https://assets.coingecko.com/coins/images/1027/large/cardano.png",
    DOT: "https://assets.coingecko.com/coins/images/12842/large/polkadot.png",
    LINK: "https://assets.coingecko.com/coins/images/877/large/chainlink-new.png",
    UNI: "https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png",
  };

  useEffect(() => {
    const initialStakingProducts: StakingProduct[] = [
      {
        id: "stake-1",
        name: "Bitcoin",
        symbol: "BTC",
        apy: 4.5,
        minAmount: 0.001,
        duration: 30,
        type: "locked",
        risk: "low",
        icon: cryptoIcons.BTC,
        totalStaked: 12500,
        available: true,
      },
      {
        id: "stake-2",
        name: "Ethereum",
        symbol: "ETH",
        apy: 3.8,
        minAmount: 0.01,
        duration: 0,
        type: "flexible",
        risk: "low",
        icon: cryptoIcons.ETH,
        totalStaked: 85000,
        available: true,
      },
      {
        id: "stake-3",
        name: "BNB",
        symbol: "BNB",
        apy: 5.2,
        minAmount: 1,
        duration: 90,
        type: "locked",
        risk: "medium",
        icon: cryptoIcons.BNB,
        totalStaked: 150000,
        available: true,
      },
      {
        id: "stake-4",
        name: "Solana",
        symbol: "SOL",
        apy: 6.8,
        minAmount: 0.5,
        duration: 60,
        type: "locked",
        risk: "high",
        icon: cryptoIcons.SOL,
        totalStaked: 250000,
        available: true,
      },
    ];

    const initialSavingsProducts: SavingsProduct[] = [
      {
        id: "savings-1",
        name: "Tether",
        symbol: "USDT",
        apy: 2.5,
        minAmount: 10,
        duration: 0,
        type: "flexible",
        risk: "low",
        icon: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
        totalInvested: 5000000,
        available: true,
      },
      {
        id: "savings-2",
        name: "USD Coin",
        symbol: "USDC",
        apy: 2.8,
        minAmount: 10,
        duration: 0,
        type: "flexible",
        risk: "low",
        icon: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
        totalInvested: 2500000,
        available: true,
      },
      {
        id: "savings-3",
        name: "Binance USD",
        symbol: "BUSD",
        apy: 3.2,
        minAmount: 10,
        duration: 0,
        type: "flexible",
        risk: "low",
        icon: "https://assets.coingecko.com/coins/images/9576/large/BUSD.png",
        totalInvested: 1800000,
        available: true,
      },
    ];

    setStakingProducts(initialStakingProducts);
    setSavingsProducts(initialSavingsProducts);
  }, []);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("binance_earn_favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const toggleFavorite = (productId: string) => {
    const newFavorites = favorites.includes(productId)
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId];
    setFavorites(newFavorites);
    localStorage.setItem("binance_earn_favorites", JSON.stringify(newFavorites));
  };

  const filteredStakingProducts = stakingProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSavingsProducts = savingsProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStake = () => {
    if (!selectedProduct) return;
    
    alert(`Staked ${stakeAmount} ${selectedProduct.symbol} successfully!`);
    setShowModal(false);
    setStakeAmount("");
    setSelectedProduct(null);
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
                  <a href="/binance/earn" className="text-[#F0B90B] hover:text-[#F8D12F] transition-colors font-medium">Earn</a>
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
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold text-[#EAECEF]">Earn</h1>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-[#2B3139] rounded transition-colors hidden md:block">
                  <Filter className="w-5 h-5 text-[#848E9C]" />
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#848E9C]" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#181A20] border border-[#2B3139] rounded-lg text-[#EAECEF] placeholder-[#848E9C] focus:outline-none focus:border-[#F0B90B] transition-colors"
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setSelectedTab("staking")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTab === "staking"
                    ? "bg-[#F0B90B] text-black"
                    : "bg-[#181A20] text-[#848E9C] hover:bg-[#2B3139] hover:text-[#EAECEF]"
                }`}
              >
                Staking
              </button>
              <button
                onClick={() => setSelectedTab("savings")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTab === "savings"
                    ? "bg-[#F0B90B] text-black"
                    : "bg-[#181A20] text-[#848E9C] hover:bg-[#2B3139] hover:text-[#EAECEF]"
                }`}
              >
                Savings
              </button>
              <button
                onClick={() => setSelectedTab("launchpad")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTab === "launchpad"
                    ? "bg-[#F0B90B] text-black"
                    : "bg-[#181A20] text-[#848E9C] hover:bg-[#2B3139] hover:text-[#EAECEF]"
                }`}
              >
                Launchpad
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {selectedTab === "staking" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredStakingProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  whileHover={prefersReducedMotion ? {} : { y: -5, scale: 1.02 }}
                  className="bg-[#181A20] rounded-lg border border-[#2B3139] p-4"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#2B3139]/60 flex items-center justify-center p-1">
                        <img src={product.icon} alt={product.symbol} className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-[#EAECEF] font-medium">{product.name}</p>
                        <p className="text-[#848E9C] text-sm">{product.symbol}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="p-1 hover:bg-[#2B3139] rounded transition-colors"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          favorites.includes(product.id)
                            ? "text-[#F0B90B] fill-[#F0B90B]"
                            : "text-[#848E9C]"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-[#0ECB81]">
                        <AnimatedNumber value={product.apy} format={(val) => `${val.toFixed(1)}%`} />
                      </span>
                      <span className="text-[#848E9C] text-sm">APY</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[#848E9C]">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{product.type === "flexible" ? "Flexible" : `${product.duration} Days`}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>Min: {product.minAmount} {product.symbol}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-[#848E9C]">
                      <span className="block">Total Staked</span>
                      <span className="text-[#EAECEF]">{product.totalStaked.toLocaleString()} {product.symbol}</span>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      product.available ? "bg-[#0ECB81]/20 text-[#0ECB81]" : "bg-[#F6465D]/20 text-[#F6465D]"
                    }`}>
                      {product.available ? "Available" : "Sold Out"}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowModal(true);
                    }}
                    disabled={!product.available}
                    className="w-full py-2 bg-[#F0B90B] hover:bg-[#F8D12F] disabled:bg-[#2B3139] disabled:text-[#848E9C] text-black font-medium rounded transition-colors"
                  >
                    Stake Now
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}

          {selectedTab === "savings" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredSavingsProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={itemVariants}
                  whileHover={prefersReducedMotion ? {} : { y: -5, scale: 1.02 }}
                  className="bg-[#181A20] rounded-lg border border-[#2B3139] p-4"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#2B3139]/60 flex items-center justify-center p-1">
                        <img src={product.icon} alt={product.symbol} className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-[#EAECEF] font-medium">{product.name}</p>
                        <p className="text-[#848E9C] text-sm">{product.symbol}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className="p-1 hover:bg-[#2B3139] rounded transition-colors"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          favorites.includes(product.id)
                            ? "text-[#F0B90B] fill-[#F0B90B]"
                            : "text-[#848E9C]"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-[#0ECB81]">
                        <AnimatedNumber value={product.apy} format={(val) => `${val.toFixed(1)}%`} />
                      </span>
                      <span className="text-[#848E9C] text-sm">APY</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[#848E9C]">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{product.type === "flexible" ? "Flexible" : `${product.duration} Days`}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>Min: {product.minAmount} {product.symbol}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-[#848E9C]">
                      <span className="block">Total Invested</span>
                      <span className="text-[#EAECEF]">{product.totalInvested.toLocaleString()} {product.symbol}</span>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      product.available ? "bg-[#0ECB81]/20 text-[#0ECB81]" : "bg-[#F6465D]/20 text-[#F6465D]"
                    }`}>
                      {product.available ? "Available" : "Sold Out"}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowModal(true);
                    }}
                    disabled={!product.available}
                    className="w-full py-2 bg-[#F0B90B] hover:bg-[#F8D12F] disabled:bg-[#2B3139] disabled:text-[#848E9C] text-black font-medium rounded transition-colors"
                  >
                    Invest Now
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}

          {selectedTab === "launchpad" && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#F0B90B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-[#F0B90B]" />
              </div>
              <h2 className="text-xl font-semibold text-[#EAECEF] mb-2">Launchpad Coming Soon</h2>
              <p className="text-[#848E9C]">New token launches will be available here</p>
            </div>
          )}
        </div>

        {/* Staking Modal */}
        <AnimatePresence>
          {showModal && selectedProduct && (
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
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-[#EAECEF]">
                      {selectedProduct.type === "flexible" || selectedProduct.type === "fixed" ? "Invest" : "Stake"} {selectedProduct.symbol}
                    </h3>
                    <button
                      onClick={() => setShowModal(false)}
                      className="p-1 hover:bg-[#2B3139] rounded transition-colors"
                    >
                      <ArrowRight className="w-5 h-5 text-[#848E9C] rotate-45" />
                    </button>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#2B3139]/60 flex items-center justify-center p-1">
                        <img src={selectedProduct.icon} alt={selectedProduct.symbol} className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[#EAECEF] font-medium">{selectedProduct.name}</p>
                        <p className="text-[#848E9C] text-sm">{selectedProduct.symbol}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-[#0B0E11] rounded p-3">
                        <p className="text-[#848E9C] text-xs mb-1">APY</p>
                        <p className="text-[#0ECB81] font-semibold">{selectedProduct.apy}%</p>
                      </div>
                      <div className="bg-[#0B0E11] rounded p-3">
                        <p className="text-[#848E9C] text-xs mb-1">Type</p>
                        <p className="text-[#EAECEF] font-semibold">{selectedProduct.type}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="text-[#848E9C] text-sm block mb-2">
                        Amount ({selectedProduct.symbol})
                      </label>
                      <input
                        type="number"
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                        placeholder="0.00"
                        min={selectedProduct.minAmount}
                        step="0.001"
                        className="w-full px-3 py-2 bg-[#0B0E11] border border-[#2B3139] rounded text-sm text-[#EAECEF] focus:outline-none focus:border-[#F0B90B] transition-colors"
                      />
                    </div>

                    <div className="bg-[#0B0E11] rounded p-3 mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[#848E9C] text-sm">Est. Earnings (1 Year)</span>
                        <span className="text-[#0ECB81] text-sm">
                          {stakeAmount ? (parseFloat(stakeAmount) * (selectedProduct.apy / 100)).toFixed(4) : "0.00"} {selectedProduct.symbol}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleStake}
                    disabled={!stakeAmount || parseFloat(stakeAmount) < selectedProduct.minAmount}
                    className="w-full py-3 bg-[#F0B90B] hover:bg-[#F8D12F] disabled:bg-[#2B3139] disabled:text-[#848E9C] text-black font-semibold rounded transition-colors"
                  >
                    {selectedProduct.type === "flexible" || selectedProduct.type === "fixed" ? "Invest" : "Stake"} Now
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default BinanceEarn;
