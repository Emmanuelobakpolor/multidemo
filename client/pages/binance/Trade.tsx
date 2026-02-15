import { useState, useEffect } from "react";
import { Search, Star, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, RefreshCw, Activity, Clock, Wallet } from "lucide-react";
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

interface Order {
  id: string;
  symbol: string;
  type: "buy" | "sell";
  price: number;
  amount: number;
  total: number;
  status: "pending" | "completed" | "cancelled";
  date: string;
}

interface WalletBalance {
  symbol: string;
  name: string;
  amount: number;
  price: number;
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

const BinanceTrade = () => {
  const [selectedPair, setSelectedPair] = useState("BTC/USDT");
  const [searchQuery, setSearchQuery] = useState("");
  const [tradingPairs, setTradingPairs] = useState<TradingPair[]>([]);
  const [orderBook, setOrderBook] = useState<{ bids: OrderBookItem[]; asks: OrderBookItem[] }>({ bids: [], asks: [] });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [orderType, setOrderType] = useState("limit");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [walletBalances, setWalletBalances] = useState<WalletBalance[]>([]);
  const [showWallet, setShowWallet] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [timeframe, setTimeframe] = useState("1H");
  const prefersReducedMotion = useReducedMotion();

  const pairs = [
    "BTC/USDT", "ETH/USDT", "BNB/USDT", "SOL/USDT", "ADA/USDT",
    "DOT/USDT", "LINK/USDT", "UNI/USDT", "XRP/USDT", "DOGE/USDT",
    "MATIC/USDT", "AVAX/USDT", "SHIB/USDT", "ATOM/USDT", "LTC/USDT"
  ];

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
    LTC: 78.5
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
    LTC: "Litecoin"
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
    LTC: "https://assets.coingecko.com/coins/images/2/large/litecoin.png"
  };

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

    // Initialize wallet balances
    const initialBalances: WalletBalance[] = Object.keys(cryptoPrices).map((symbol) => ({
      symbol,
      name: cryptoNames[symbol],
      amount: parseFloat((Math.random() * 10).toFixed(4)),
      price: cryptoPrices[symbol],
      icon: cryptoIcons[symbol]
    }));
    
    setWalletBalances(initialBalances);
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

  const handlePlaceOrder = (type: "buy" | "sell") => {
    if (!price || !amount) return;

    const newOrder: Order = {
      id: Date.now().toString(),
      symbol: selectedPair,
      type,
      price: parseFloat(price),
      amount: parseFloat(amount),
      total: parseFloat(price) * parseFloat(amount),
      status: "pending",
      date: new Date().toISOString()
    };

    setOrders([newOrder, ...orders]);

    // Simulate order completion after 2 seconds
    setTimeout(() => {
      setOrders(prev => prev.map(order => 
        order.id === newOrder.id ? { ...order, status: "completed" } : order
      ));
    }, 2000);

    setPrice("");
    setAmount("");
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: "cancelled" } : order
    ));
  };

  const getAvailableBalance = (symbol: string) => {
    const balance = walletBalances.find(b => b.symbol === symbol);
    return balance?.amount || 0;
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
                  <a href="/binance/trade" className="text-[#F0B90B] hover:text-[#F8D12F] transition-colors font-medium">Trade</a>
                  <a href="/binance/earn" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors">Earn</a>
                  <a href="/binance/security" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors">Security</a>
                  <a href="/binance/support" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors">Support</a>
                  <a href="/binance/settings" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors">Settings</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowWallet(!showWallet)}
                  className="flex items-center gap-2 px-3 py-2 bg-[#2B3139] hover:bg-[#3d4450] rounded text-sm text-[#EAECEF] transition-colors"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Wallet</span>
                </button>
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

              {/* Chart Controls */}
              <div className="bg-[#181A20] rounded-lg p-4 border border-[#2B3139] mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2">
                    {["1M", "5M", "15M", "1H", "4H", "1D"].map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setTimeframe(tf)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          timeframe === tf
                            ? 'bg-[#F0B90B] text-black'
                            : 'bg-[#0B0E11] text-[#848E9C] hover:text-[#EAECEF]'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1 hover:bg-[#2B3139] rounded transition-colors">
                      <Activity className="w-4 h-4 text-[#848E9C]" />
                    </button>
                    <button className="p-1 hover:bg-[#2B3139] rounded transition-colors">
                      <RefreshCw className="w-4 h-4 text-[#848E9C]" />
                    </button>
                  </div>
                </div>

                {/* Chart Placeholder */}
                <div className="bg-[#0B0E11] rounded-lg h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[#F0B90B]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-6 h-6 text-[#F0B90B]" />
                    </div>
                    <p className="text-[#848E9C]">Trading Chart</p>
                    <p className="text-xs text-[#848E9C] mt-1">Real-time price data and technical analysis</p>
                  </div>
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
              <div className="bg-[#181A20] rounded-lg border border-[#2B3139] overflow-hidden mb-4">
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
                  <button
                    onClick={() => setOrderType("stop-limit")}
                    className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                      orderType === "stop-limit"
                        ? 'text-[#F0B90B] bg-[#2B3139]'
                        : 'text-[#848E9C] hover:text-[#EAECEF]'
                    }`}
                  >
                    Stop-Limit
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
                        <div className="flex gap-1 mt-1">
                          {[25, 50, 75, 100].map((percent) => (
                            <button
                              key={percent}
                              onClick={() => {
                                const available = getAvailableBalance(selectedPair.split("/")[1]);
                                const maxAmount = available / (selectedPairData?.price || 1);
                                setAmount((maxAmount * percent / 100).toFixed(4));
                              }}
                              className="px-2 py-0.5 bg-[#2B3139] hover:bg-[#3d4450] text-[#848E9C] text-xs rounded transition-colors"
                            >
                              {percent}%
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-[#848E9C] block mb-1">Total (USDT)</label>
                        <div className="w-full px-3 py-2 bg-[#0B0E11] border border-[#2B3139] rounded text-sm text-[#EAECEF]">
                          {orderType === "limit" && price && amount
                            ? (parseFloat(price) * parseFloat(amount)).toFixed(2)
                            : "0.00"}
                        </div>
                        <div className="text-xs text-[#848E9C] mt-1">
                          Available: {getAvailableBalance(selectedPair.split("/")[1]).toFixed(2)} {selectedPair.split("/")[1]}
                        </div>
                      </div>

                      <button
                        onClick={() => handlePlaceOrder("buy")}
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
                        <div className="flex gap-1 mt-1">
                          {[25, 50, 75, 100].map((percent) => (
                            <button
                              key={percent}
                              onClick={() => {
                                const available = getAvailableBalance(selectedPair.split("/")[0]);
                                setAmount((available * percent / 100).toFixed(4));
                              }}
                              className="px-2 py-0.5 bg-[#2B3139] hover:bg-[#3d4450] text-[#848E9C] text-xs rounded transition-colors"
                            >
                              {percent}%
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-[#848E9C] block mb-1">Total (USDT)</label>
                        <div className="w-full px-3 py-2 bg-[#0B0E11] border border-[#2B3139] rounded text-sm text-[#EAECEF]">
                          {orderType === "limit" && price && amount
                            ? (parseFloat(price) * parseFloat(amount)).toFixed(2)
                            : "0.00"}
                        </div>
                        <div className="text-xs text-[#848E9C] mt-1">
                          Available: {getAvailableBalance(selectedPair.split("/")[0]).toFixed(4)} {selectedPair.split("/")[0]}
                        </div>
                      </div>

                      <button
                        onClick={() => handlePlaceOrder("sell")}
                        className="w-full py-3 bg-[#F6465D] hover:bg-[#ff5763] text-white font-semibold rounded transition-colors"
                      >
                        Sell {selectedPair.split("/")[0]}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order History */}
              <div className="bg-[#181A20] rounded-lg border border-[#2B3139] overflow-hidden mb-4">
                <div className="flex items-center justify-between p-3 border-b border-[#2B3139]">
                  <h3 className="text-xs font-semibold text-[#848E9C] uppercase">Open Orders</h3>
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="text-xs text-[#F0B90B] hover:text-[#F8D12F] transition-colors"
                  >
                    {showHistory ? "Hide" : "View History"}
                  </button>
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                  {orders.filter(order => order.status === "pending").length > 0 ? (
                    orders.filter(order => order.status === "pending").map((order) => (
                      <div
                        key={order.id}
                        className="flex justify-between items-center px-3 py-2 text-xs border-b border-[#2B3139]"
                      >
                        <div>
                          <p className={`font-medium ${order.type === "buy" ? 'text-[#0ECB81]' : 'text-[#F6465D]'}`}>
                            {order.type === "buy" ? "Buy" : "Sell"} {order.symbol}
                          </p>
                          <p className="text-[#848E9C] text-xs">
                            {order.amount} @ {order.price}
                          </p>
                        </div>
                        <button
                          onClick={() => cancelOrder(order.id)}
                          className="text-[#F6465D] hover:text-red-400 text-xs transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-xs text-[#848E9C] text-center">
                      No pending orders
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Trades */}
              <div className="bg-[#181A20] rounded-lg border border-[#2B3139] overflow-hidden">
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

        {/* Wallet Modal */}
        <AnimatePresence>
          {showWallet && (
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
                    <h3 className="text-lg font-semibold text-[#EAECEF]">Wallet</h3>
                    <button
                      onClick={() => setShowWallet(false)}
                      className="p-1 hover:bg-[#2B3139] rounded transition-colors"
                    >
                      X
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {walletBalances.map((balance) => (
                      <div
                        key={balance.symbol}
                        className="flex items-center justify-between p-3 bg-[#0B0E11] rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#2B3139]/60 flex items-center justify-center p-1">
                            <img src={balance.icon} alt={balance.symbol} className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-[#EAECEF] font-medium">{balance.symbol}</p>
                            <p className="text-[#848E9C] text-sm">{balance.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[#EAECEF] font-medium">{balance.amount.toFixed(4)}</p>
                          <p className="text-[#848E9C] text-xs">
                            ${(balance.amount * balance.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
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

export default BinanceTrade;
