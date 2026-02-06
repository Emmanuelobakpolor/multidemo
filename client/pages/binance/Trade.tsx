import { useState, useEffect } from "react";
import { Search, Star, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import PageTransition from "@/components/binance/PageTransition";
import AnimatedNumber from "@/components/binance/AnimatedNumber";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface TradingPair {
  symbol: string;
  baseSymbol: string;
  quoteSymbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
}

interface OrderBookItem {
  price: number;
  amount: number;
  total: number;
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

const BinanceTrade = () => {
  const [selectedPair, setSelectedPair] = useState("BTC/USDT");
  const [searchQuery, setSearchQuery] = useState("");
  const [tradingPairs, setTradingPairs] = useState<TradingPair[]>([]);
  const [orderBook, setOrderBook] = useState<{ bids: OrderBookItem[]; asks: OrderBookItem[] }>({ bids: [], asks: [] });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [orderType, setOrderType] = useState("limit");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const prefersReducedMotion = useReducedMotion();

  const pairs = [
    "BTC/USDT", "ETH/USDT", "BNB/USDT", "SOL/USDT", "ADA/USDT",
    "DOT/USDT", "LINK/USDT", "UNI/USDT", "XRP/USDT", "DOGE/USDT",
    "MATIC/USDT", "AVAX/USDT", "SHIB/USDT", "ATOM/USDT", "LTC/USDT"
  ];

  useEffect(() => {
    const initialPairs: TradingPair[] = pairs.map((pair) => {
      const [base, quote] = pair.split("/");
      return {
        symbol: pair,
        baseSymbol: base,
        quoteSymbol: quote,
        price: parseFloat((Math.random() * 45000 + 100).toFixed(2)),
        change24h: parseFloat((Math.random() * 10 - 5).toFixed(2)),
        volume24h: parseFloat((Math.random() * 100000000).toFixed(0)),
        high24h: parseFloat((Math.random() * 5000 + 45000).toFixed(2)),
        low24h: parseFloat((Math.random() * 5000 + 40000).toFixed(2)),
      };
    });

    setTradingPairs(initialPairs);
  }, []);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("binance_trade_favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    const generateOrderBook = () => {
      const basePrice = tradingPairs.find(p => p.symbol === selectedPair)?.price || 45000;
      const bids: OrderBookItem[] = [];
      const asks: OrderBookItem[] = [];

      for (let i = 1; i <= 20; i++) {
        const bidPrice = basePrice - (i * 0.5);
        const askPrice = basePrice + (i * 0.5);
        const bidAmount = parseFloat((Math.random() * 5).toFixed(4));
        const askAmount = parseFloat((Math.random() * 5).toFixed(4));

        bids.push({
          price: bidPrice,
          amount: bidAmount,
          total: bidPrice * bidAmount,
        });

        asks.push({
          price: askPrice,
          amount: askAmount,
          total: askPrice * askAmount,
        });
      }

      setOrderBook({ bids, asks });
    };

    generateOrderBook();
  }, [selectedPair, tradingPairs]);

  const toggleFavorite = (pair: string) => {
    const newFavorites = favorites.includes(pair)
      ? favorites.filter((p) => p !== pair)
      : [...favorites, pair];
    setFavorites(newFavorites);
    localStorage.setItem("binance_trade_favorites", JSON.stringify(newFavorites));
  };

  const filteredPairs = tradingPairs.filter(
    (pair) =>
      pair.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pair.baseSymbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const selectedPairData = tradingPairs.find(p => p.symbol === selectedPair);

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
                  <a href="/binance/trade" className="text-[#F0B90B] hover:text-[#F8D12F] transition-colors font-medium">Trade</a>
                  <a href="#" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors">Earn</a>
                  <a href="/binance/settings" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors">Settings</a>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          <div className="grid grid-cols-12 gap-4">
            {/* Left Sidebar - Trading Pairs */}
            <div className="col-span-3 bg-[#181A20] rounded-lg border border-[#2B3139] overflow-hidden">
              {/* Search */}
              <div className="p-3 border-b border-[#2B3139]">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#848E9C]" />
                  <input
                    type="text"
                    placeholder="Search pairs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-[#0B0E11] border border-[#2B3139] rounded text-sm text-[#EAECEF] placeholder-[#848E9C] focus:outline-none focus:border-[#F0B90B] transition-colors"
                  />
                </div>
              </div>

              {/* Favorites */}
              <div className="p-3 border-b border-[#2B3139]">
                <h3 className="text-xs font-semibold text-[#848E9C] mb-2 uppercase">Favorites</h3>
                <div className="space-y-1">
                  {favorites.length > 0 ? (
                    favorites.map((pair) => (
                      <div
                        key={pair}
                        onClick={() => setSelectedPair(pair)}
                        className={`flex items-center justify-between p-2 rounded text-sm cursor-pointer transition-colors ${
                          selectedPair === pair
                            ? 'bg-[#F0B90B] text-black'
                            : 'text-[#EAECEF] hover:bg-[#2B3139]'
                        }`}
                      >
                        <span>{pair}</span>
                        <Star
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(pair);
                          }}
                          className="w-3 h-3 fill-current"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#848E9C] text-center py-4">No favorites</p>
                  )}
                </div>
              </div>

              {/* All Pairs */}
              <div className="p-3">
                <h3 className="text-xs font-semibold text-[#848E9C] mb-2 uppercase">All Pairs</h3>
                <div className="space-y-1 max-h-[600px] overflow-y-auto">
                  {filteredPairs.map((pair) => (
                    <div
                      key={pair.symbol}
                      onClick={() => setSelectedPair(pair.symbol)}
                      className={`flex items-center justify-between p-2 rounded text-sm cursor-pointer transition-colors ${
                        selectedPair === pair.symbol
                          ? 'bg-[#F0B90B] text-black'
                          : 'text-[#EAECEF] hover:bg-[#2B3139]'
                      }`}
                    >
                      <span>{pair.symbol}</span>
                      <Star
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(pair.symbol);
                        }}
                        className={`w-3 h-3 ${
                          favorites.includes(pair.symbol) ? 'text-[#F0B90B] fill-[#F0B90B]' : 'text-[#848E9C]'
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center - Chart and Order Book */}
            <div className="col-span-6">
              {/* Trading Pair Header */}
              <div className="bg-[#181A20] rounded-lg p-4 border border-[#2B3139] mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-[#EAECEF]">{selectedPair}</h2>
                    <p className="text-sm text-[#848E9C]">
                      24h Change: <span className={selectedPairData?.change24h >= 0 ? 'text-[#0ECB81]' : 'text-[#F6465D]'}>
                        {selectedPairData?.change24h >= 0 ? '+' : ''}{selectedPairData?.change24h.toFixed(2)}%
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-[#EAECEF]">
                      <AnimatedNumber
                        value={selectedPairData?.price || 0}
                        format={(val) => `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                      />
                    </p>
                    <p className="text-sm text-[#848E9C]">
                      High: ${selectedPairData?.high24h.toFixed(2)} | Low: ${selectedPairData?.low24h.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="bg-[#181A20] rounded-lg border border-[#2B3139] h-[400px] mb-4 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 bg-[#F0B90B]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-6 h-6 text-[#F0B90B]" />
                  </div>
                  <p className="text-[#848E9C]">Trading Chart</p>
                  <p className="text-xs text-[#848E9C] mt-1">Real-time price data and technical analysis</p>
                </div>
              </div>

              {/* Order Book */}
              <div className="bg-[#181A20] rounded-lg border border-[#2B3139] overflow-hidden">
                <div className="grid grid-cols-3 gap-1 px-4 py-2 bg-[#0B0E11] border-b border-[#2B3139] text-xs text-[#848E9C] font-medium">
                  <div className="text-right">Price (USDT)</div>
                  <div className="text-right">Amount (BTC)</div>
                  <div className="text-right">Total</div>
                </div>

                {/* Asks */}
                <div className="space-y-0.5">
                  {orderBook.asks.map((ask, index) => (
                    <div
                      key={`ask-${index}`}
                      className="grid grid-cols-3 gap-1 px-4 py-1 text-xs text-[#F6465D]"
                    >
                      <div className="text-right">{ask.price.toFixed(2)}</div>
                      <div className="text-right">{ask.amount.toFixed(4)}</div>
                      <div className="text-right">{ask.total.toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                {/* Last Price */}
                <div className="grid grid-cols-3 gap-1 px-4 py-2 text-xs text-[#EAECEF] bg-[#0B0E11] font-medium">
                  <div className="text-right">Last Price</div>
                  <div className="text-right">{selectedPairData?.price.toFixed(2)}</div>
                  <div className="text-right"></div>
                </div>

                {/* Bids */}
                <div className="space-y-0.5">
                  {orderBook.bids.map((bid, index) => (
                    <div
                      key={`bid-${index}`}
                      className="grid grid-cols-3 gap-1 px-4 py-1 text-xs text-[#0ECB81]"
                    >
                      <div className="text-right">{bid.price.toFixed(2)}</div>
                      <div className="text-right">{bid.amount.toFixed(4)}</div>
                      <div className="text-right">{bid.total.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar - Trading Panel */}
            <div className="col-span-3">
              {/* Order Type Tabs */}
              <div className="bg-[#181A20] rounded-lg border border-[#2B3139] overflow-hidden">
                <div className="flex border-b border-[#2B3139]">
                  <button
                    onClick={() => setOrderType("limit")}
                    className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                      orderType === "limit"
                        ? 'text-[#F0B90B] bg-[#2B3139]'
                        : 'text-[#848E9C] hover:text-[#EAECEF]'
                    }`}
                  >
                    Limit
                  </button>
                  <button
                    onClick={() => setOrderType("market")}
                    className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                      orderType === "market"
                        ? 'text-[#F0B90B] bg-[#2B3139]'
                        : 'text-[#848E9C] hover:text-[#EAECEF]'
                    }`}
                  >
                    Market
                  </button>
                </div>

                {/* Order Form */}
                <div className="p-4">
                  {/* Buy Order */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <ArrowDownLeft className="w-4 h-4 text-[#0ECB81]" />
                      <h3 className="text-sm font-semibold text-[#0ECB81]">Buy {selectedPair.split("/")[0]}</h3>
                    </div>

                    <div className="space-y-3">
                      {orderType === "limit" && (
                        <div>
                          <label className="text-xs text-[#848E9C] block mb-1">Price (USDT)</label>
                          <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0.00"
                            className="w-full px-3 py-2 bg-[#0B0E11] border border-[#2B3139] rounded text-sm text-[#EAECEF] focus:outline-none focus:border-[#F0B90B] transition-colors"
                          />
                        </div>
                      )}

                      <div>
                        <label className="text-xs text-[#848E9C] block mb-1">Amount ({selectedPair.split("/")[0]})</label>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full px-3 py-2 bg-[#0B0E11] border border-[#2B3139] rounded text-sm text-[#EAECEF] focus:outline-none focus:border-[#F0B90B] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-[#848E9C] block mb-1">Total (USDT)</label>
                        <div className="w-full px-3 py-2 bg-[#0B0E11] border border-[#2B3139] rounded text-sm text-[#EAECEF]">
                          {orderType === "limit" && price && amount
                            ? (parseFloat(price) * parseFloat(amount)).toFixed(2)
                            : "0.00"}
                        </div>
                      </div>

                      <button
                        className="w-full py-3 bg-[#0ECB81] hover:bg-[#19d388] text-black font-semibold rounded transition-colors"
                      >
                        Buy {selectedPair.split("/")[0]}
                      </button>
                    </div>
                  </div>

                  {/* Sell Order */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <ArrowUpRight className="w-4 h-4 text-[#F6465D]" />
                      <h3 className="text-sm font-semibold text-[#F6465D]">Sell {selectedPair.split("/")[0]}</h3>
                    </div>

                    <div className="space-y-3">
                      {orderType === "limit" && (
                        <div>
                          <label className="text-xs text-[#848E9C] block mb-1">Price (USDT)</label>
                          <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0.00"
                            className="w-full px-3 py-2 bg-[#0B0E11] border border-[#2B3139] rounded text-sm text-[#EAECEF] focus:outline-none focus:border-[#F0B90B] transition-colors"
                          />
                        </div>
                      )}

                      <div>
                        <label className="text-xs text-[#848E9C] block mb-1">Amount ({selectedPair.split("/")[0]})</label>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full px-3 py-2 bg-[#0B0E11] border border-[#2B3139] rounded text-sm text-[#EAECEF] focus:outline-none focus:border-[#F0B90B] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-[#848E9C] block mb-1">Total (USDT)</label>
                        <div className="w-full px-3 py-2 bg-[#0B0E11] border border-[#2B3139] rounded text-sm text-[#EAECEF]">
                          {orderType === "limit" && price && amount
                            ? (parseFloat(price) * parseFloat(amount)).toFixed(2)
                            : "0.00"}
                        </div>
                      </div>

                      <button
                        className="w-full py-3 bg-[#F6465D] hover:bg-[#ff5763] text-white font-semibold rounded transition-colors"
                      >
                        Sell {selectedPair.split("/")[0]}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Trades */}
              <div className="mt-4 bg-[#181A20] rounded-lg border border-[#2B3139] overflow-hidden">
                <div className="p-3 border-b border-[#2B3139]">
                  <h3 className="text-xs font-semibold text-[#848E9C] uppercase">Recent Trades</h3>
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`flex justify-between items-center px-3 py-2 text-xs ${
                        i % 2 === 0 ? 'text-[#0ECB81]' : 'text-[#F6465D]'
                      }`}
                    >
                      <span>{(selectedPairData?.price || 45000).toFixed(2)}</span>
                      <span>{(Math.random() * 0.1).toFixed(4)}</span>
                      <span>{new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default BinanceTrade;
