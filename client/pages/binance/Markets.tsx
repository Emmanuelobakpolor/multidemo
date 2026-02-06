import { useState, useEffect } from "react";
import { Search, ChevronDown, TrendingUp, TrendingDown, Star, Filter } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import PageTransition from "@/components/binance/PageTransition";
import AnimatedNumber from "@/components/binance/AnimatedNumber";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  icon: string;
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

const BinanceMarkets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("marketCap");
  const [sortOrder, setSortOrder] = useState("desc");
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const prefersReducedMotion = useReducedMotion();

  const cryptoPrices = {
    BTC: 45230,
    ETH: 2580.5,
    BNB: 315.8,
    SOL: 105.2,
    ADA: 0.45,
    DOT: 7.2,
    LINK: 15.8,
    UNI: 6.4,
    XRP: 0.65,
    DOGE: 0.18,
    MATIC: 0.85,
    AVAX: 32.5,
    SHIB: 0.000028,
    ATOM: 12.3,
    LTC: 78.5,
  };

  const cryptoIcons = {
    BTC: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    ETH: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    BNB: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    SOL: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    ADA: "https://assets.coingecko.com/coins/images/1027/large/cardano.png",
    DOT: "https://assets.coingecko.com/coins/images/12842/large/polkadot.png",
    LINK: "https://assets.coingecko.com/coins/images/877/large/chainlink-new.png",
    UNI: "https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png",
    XRP: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    DOGE: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    MATIC: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png",
    AVAX: "https://assets.coingecko.com/coins/images/12559/large/coin-round-red.png",
    SHIB: "https://assets.coingecko.com/coins/images/11939/large/shiba-inu.png",
    ATOM: "https://assets.coingecko.com/coins/images/1480/large/cosmos_hub.png",
    LTC: "https://assets.coingecko.com/coins/images/2/large/litecoin.png",
  };

  const cryptoNames = {
    BTC: "Bitcoin",
    ETH: "Ethereum",
    BNB: "BNB",
    SOL: "Solana",
    ADA: "Cardano",
    DOT: "Polkadot",
    LINK: "Chainlink",
    UNI: "Uniswap",
    XRP: "XRP",
    DOGE: "Dogecoin",
    MATIC: "Polygon",
    AVAX: "Avalanche",
    SHIB: "Shiba Inu",
    ATOM: "Cosmos",
    LTC: "Litecoin",
  };

  useEffect(() => {
    const initialMarkets: MarketData[] = Object.keys(cryptoPrices).map((symbol) => ({
      symbol,
      name: cryptoNames[symbol],
      price: cryptoPrices[symbol],
      change24h: parseFloat((Math.random() * 10 - 5).toFixed(2)),
      volume24h: parseFloat((Math.random() * 1000000000).toFixed(0)),
      marketCap: parseFloat((Math.random() * 100000000000).toFixed(0)),
      icon: cryptoIcons[symbol],
    }));

    setMarkets(initialMarkets);
  }, []);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("binance_favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const toggleFavorite = (symbol: string) => {
    const newFavorites = favorites.includes(symbol)
      ? favorites.filter((s) => s !== symbol)
      : [...favorites, symbol];
    setFavorites(newFavorites);
    localStorage.setItem("binance_favorites", JSON.stringify(newFavorites));
  };

  const filteredMarkets = markets.filter(
    (market) =>
      market.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedMarkets = [...filteredMarkets].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case "price":
        aValue = a.price;
        bValue = b.price;
        break;
      case "change24h":
        aValue = a.change24h;
        bValue = b.change24h;
        break;
      case "volume24h":
        aValue = a.volume24h;
        bValue = b.volume24h;
        break;
      case "marketCap":
      default:
        aValue = a.marketCap;
        bValue = b.marketCap;
        break;
    }

    return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
  });

  const formatNumber = (num: number): string => {
    if (num >= 1e12) {
      return (num / 1e12).toFixed(2) + "T";
    }
    if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + "B";
    }
    if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + "M";
    }
    if (num >= 1e3) {
      return (num / 1e3).toFixed(2) + "K";
    }
    return num.toFixed(2);
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
                  <a href="/binance/markets" className="text-[#F0B90B] hover:text-[#F8D12F] transition-colors font-medium">Markets</a>
                  <a href="/binance/trade" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors">Trade</a>
                  <a href="#" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors">Earn</a>
                  <a href="/binance/settings" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors">Settings</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-[#2B3139] rounded transition-colors hidden md:block">
                  <Search className="w-5 h-5 text-[#848E9C]" />
                </button>
                <button className="p-2 hover:bg-[#2B3139] rounded transition-colors hidden md:block">
                  <Filter className="w-5 h-5 text-[#848E9C]" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold text-[#EAECEF]">Markets</h1>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#848E9C]">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#181A20] border border-[#2B3139] rounded px-3 py-1.5 text-sm text-[#EAECEF] focus:outline-none focus:border-[#F0B90B] transition-colors"
                >
                  <option value="marketCap">Market Cap</option>
                  <option value="price">Price</option>
                  <option value="change24h">24h Change</option>
                  <option value="volume24h">24h Volume</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="p-1.5 hover:bg-[#2B3139] rounded transition-colors"
                >
                  {sortOrder === "asc" ? <TrendingUp className="w-4 h-4 text-[#848E9C]" /> : <TrendingDown className="w-4 h-4 text-[#848E9C]" />}
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#848E9C]" />
              <input
                type="text"
                placeholder="Search coins..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#181A20] border border-[#2B3139] rounded-lg text-[#EAECEF] placeholder-[#848E9C] focus:outline-none focus:border-[#F0B90B] transition-colors"
              />
            </div>
          </div>

          {/* Market Table */}
          <div className="bg-[#181A20] rounded-lg border border-[#2B3139] overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-[#0B0E11] border-b border-[#2B3139] text-xs text-[#848E9C] font-medium">
              <div className="col-span-1"></div>
              <div className="col-span-4">Coin</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-2 text-right">24h Change</div>
              <div className="col-span-2 text-right hidden md:block">24h Volume</div>
              <div className="col-span-1 text-right hidden md:block">Market Cap</div>
            </div>

            {/* Table Body */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence>
                {sortedMarkets.map((market) => (
                  <motion.div
                    key={market.symbol}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    whileHover={prefersReducedMotion ? {} : { backgroundColor: "rgba(43, 49, 57, 0.5)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#2B3139] cursor-pointer"
                  >
                    <div className="col-span-1 flex items-center justify-center">
                      <button
                        onClick={() => toggleFavorite(market.symbol)}
                        className="p-1 hover:bg-[#2B3139] rounded transition-colors"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            favorites.includes(market.symbol)
                              ? "text-[#F0B90B] fill-[#F0B90B]"
                              : "text-[#848E9C]"
                          }`}
                        />
                      </button>
                    </div>
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#2B3139]/60 flex items-center justify-center p-1">
                        <img
                          src={market.icon}
                          alt={market.symbol}
                          className="w-6 h-6"
                        />
                      </div>
                      <div>
                        <p className="text-[#EAECEF] font-medium">{market.symbol}</p>
                        <p className="text-[#848E9C] text-xs">{market.name}</p>
                      </div>
                    </div>
                    <div className="col-span-2 text-right flex flex-col justify-center">
                      <p className="text-[#EAECEF] text-sm">
                        <AnimatedNumber
                          value={market.price}
                          format={(val) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                        />
                      </p>
                    </div>
                    <div className="col-span-2 text-right flex flex-col justify-center">
                      <p className={`text-sm font-medium ${market.change24h >= 0 ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
                        {market.change24h >= 0 ? '+' : ''}{market.change24h.toFixed(2)}%
                      </p>
                    </div>
                    <div className="col-span-2 text-right hidden md:flex flex-col justify-center">
                      <p className="text-[#EAECEF] text-sm">${formatNumber(market.volume24h)}</p>
                    </div>
                    <div className="col-span-1 text-right hidden md:flex flex-col justify-center">
                      <p className="text-[#EAECEF] text-sm">${formatNumber(market.marketCap)}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {sortedMarkets.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-[#848E9C]">No results found</p>
              </div>
            )}
          </div>

          {/* Market Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-[#181A20] rounded-lg p-4 border border-[#2B3139]">
              <p className="text-[#848E9C] text-sm mb-2">Total Market Cap</p>
              <p className="text-[#EAECEF] text-xl font-semibold">$1.85T</p>
              <p className="text-[#0ECB81] text-sm mt-1">+2.34%</p>
            </div>
            <div className="bg-[#181A20] rounded-lg p-4 border border-[#2B3139]">
              <p className="text-[#848E9C] text-sm mb-2">24h Volume</p>
              <p className="text-[#EAECEF] text-xl font-semibold">$68.5B</p>
              <p className="text-[#0ECB81] text-sm mt-1">+1.89%</p>
            </div>
            <div className="bg-[#181A20] rounded-lg p-4 border border-[#2B3139]">
              <p className="text-[#848E9C] text-sm mb-2">BTC Dominance</p>
              <p className="text-[#EAECEF] text-xl font-semibold">42.5%</p>
              <p className="text-[#F6465D] text-sm mt-1">-0.12%</p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default BinanceMarkets;
