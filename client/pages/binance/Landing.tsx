"use client";

import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  TrendingUp,
  Shield,
  Globe2,
  Smartphone,
  ArrowRight,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence, useInView, Variants, easeInOut } from "framer-motion";
import BTCIcon from "cryptocurrency-icons/svg/color/btc.svg";
import ETHIcon from "cryptocurrency-icons/svg/color/eth.svg";
import BNBIcon from "cryptocurrency-icons/svg/color/bnb.svg";
import SOLIcon from "cryptocurrency-icons/svg/color/sol.svg";
import PageTransition from "@/components/binance/PageTransition";
import AnimatedNumber from "@/components/binance/AnimatedNumber";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Animation variants
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
  floating: (i: number) => ({
    opacity: 1,
    y: [0, -10, 0],
    transition: {
      opacity: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut",
      },
      y: {
        delay: i * 0.1 + 0.5,
        duration: 3,
        repeat: Infinity,
        ease: easeInOut,
      },
    },
  }),
};

const floatAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: easeInOut,
  },
};

export default function CryptoPortLanding() {
  const [email, setEmail] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();
  const heroRef = useRef(null);
  const statsRef = useRef(null);

  // Parallax effect for hero section
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Stats section in view detection
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });

  const isActive = (path: string) => {
    return location.pathname === path ||
           (location.pathname === '/binance' && path === '/binance/dashboard');
  };

  const cryptoList = [
    {
      symbol: "BTC",
      name: "Bitcoin",
      price: "$97,234.56",
      change: "+3.24%",
      positive: true,
      icon: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      price: "$3,456.78",
      change: "+2.18%",
      positive: true,
      icon: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    },
    {
      symbol: "BNB",
      name: "BNB",
      price: "$672.45",
      change: "-0.82%",
      positive: false,
      icon: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    },
    {
      symbol: "SOL",
      name: "Solana",
      price: "$234.67",
      change: "+5.43%",
      positive: true,
      icon: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B0E11] text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#0B0E11] border-b border-[#2B3139]">
        <div className="max-w-[1440px] mx-auto px-6 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-12">
            <a href="/binance" className="flex items-center gap-2">
              <img
                src="/images/download.png"
                alt="Binance Logo"
                className="h-20 w-auto"
              />
              <span className="text-white text-xl font-semibold">
                {/* Optional text next to logo */}
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <a
                href="/binance/dashboard"
                className={`text-sm font-medium transition-colors ${
                  isActive('/binance/dashboard')
                    ? 'text-[#F0B90B] border-b-2 border-[#F0B90B] pb-1'
                    : 'text-[#EAECEF] hover:text-[#F0B90B]'
                }`}
                aria-current={isActive('/binance/dashboard') ? 'page' : undefined}
              >
                Dashboard
              </a>
              <a
                href="/binance/markets"
                className="text-[#EAECEF] hover:text-[#F0B90B] text-sm font-medium transition-colors"
              >
                Markets
              </a>
              <a
                href="/binance/trade"
                className="text-[#EAECEF] hover:text-[#F0B90B] text-sm font-medium transition-colors"
              >
                Trade
              </a>
              <a
                href="#features"
                className="text-[#EAECEF] hover:text-[#F0B90B] text-sm font-medium transition-colors"
              >
                Features
              </a>
              <a
                href="/binance/help"
                className="text-[#EAECEF] hover:text-[#F0B90B] text-sm font-medium transition-colors"
              >
                Help
              </a>
              <a
                href="/binance/settings"
                className={`text-sm font-medium transition-colors ${
                  isActive('/binance/settings')
                    ? 'text-[#F0B90B] border-b-2 border-[#F0B90B] pb-1'
                    : 'text-[#EAECEF] hover:text-[#F0B90B]'
                }`}
                aria-current={isActive('/binance/settings') ? 'page' : undefined}
              >
                Settings
              </a>
            </nav>
          </div>

          {/* Right side */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="/binance/login"
              className="text-[#EAECEF] hover:text-[#F0B90B] text-sm font-medium px-4 py-2 transition-colors"
            >
              Log In
            </a>
            <a
              href="/binance/register"
              className="bg-[#F0B90B] text-[#0B0E11] px-6 py-2.5 rounded font-semibold text-sm hover:bg-[#F8D12F] transition-all"
            >
              Register
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-white p-2"
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden bg-[#1E2329] border-t border-[#2B3139] overflow-hidden"
            >
              <nav className="flex flex-col p-6 space-y-4">
              <a
                href="/binance/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-medium ${
                  isActive('/binance/dashboard')
                    ? 'text-[#F0B90B] font-semibold'
                    : 'text-[#EAECEF] hover:text-[#F0B90B]'
                }`}
                aria-current={isActive('/binance/dashboard') ? 'page' : undefined}
              >
                Dashboard
              </a>
              <a
                href="/binance/markets"
                onClick={() => setIsMenuOpen(false)}
                className="text-[#EAECEF] hover:text-[#F0B90B] text-sm font-medium"
              >
                Markets
              </a>
              <a
                href="/binance/trade"
                onClick={() => setIsMenuOpen(false)}
                className="text-[#EAECEF] hover:text-[#F0B90B] text-sm font-medium"
              >
                Trade
              </a>
              <a
                href="#features"
                onClick={() => setIsMenuOpen(false)}
                className="text-[#EAECEF] hover:text-[#F0B90B] text-sm font-medium"
              >
                Features
              </a>
              <a
                href="/binance/help"
                onClick={() => setIsMenuOpen(false)}
                className="text-[#EAECEF] hover:text-[#F0B90B] text-sm font-medium"
              >
                Help
              </a>
              <a
                href="/binance/settings"
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-medium ${
                  isActive('/binance/settings')
                    ? 'text-[#F0B90B] font-semibold'
                    : 'text-[#EAECEF] hover:text-[#F0B90B]'
                }`}
                aria-current={isActive('/binance/settings') ? 'page' : undefined}
              >
                Settings
              </a>
              <div className="pt-4 space-y-3">
                <a
                  href="/binance/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center text-[#EAECEF] border border-[#2B3139] px-4 py-2 rounded hover:border-[#F0B90B] transition-colors"
                >
                  Log In
                </a>
                <a
                  href="/binance/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-center bg-[#F0B90B] text-[#0B0E11] px-4 py-2 rounded font-semibold"
                >
                  Register
                </a>
              </div>
            </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <section className="max-w-[1440px] mx-auto px-6 pt-16 pb-24 lg:pt-24 lg:pb-32" ref={heroRef}>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            style={prefersReducedMotion ? {} : { y: heroY, opacity: heroOpacity }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[44px] md:text-[56px] lg:text-[64px] font-semibold leading-[1.1] mb-6"
            >
              Buy, trade, and hold
              <br />
              <span className="text-[#F0B90B]">350+ cryptocurrencies</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-[#B7BDC6] text-lg mb-8 max-w-[520px]"
            >
              Join the world's leading cryptocurrency exchange. Trade with
              confidence using industry-leading security and deep liquidity.
            </motion.p>

            {/* Email signup form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 mb-8"
            >
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-[#1E2329] border border-[#2B3139] rounded px-4 py-3.5 text-white placeholder-[#707A8A] focus:outline-none focus:border-[#F0B90B] transition-colors"
              />
              <motion.button
                whileHover={prefersReducedMotion ? {} : { scale: 1.05, boxShadow: "0 10px 30px rgba(240,185,11,0.3)" }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="bg-[#F0B90B] text-[#0B0E11] px-8 py-3.5 rounded font-semibold hover:bg-[#F8D12F] transition-all flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight size={18} />
              </motion.button>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-wrap gap-6 text-sm text-[#848E9C]"
            >
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-[#F0B90B]" />
                <span>Secure & Regulated</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe2 size={16} className="text-[#F0B90B]" />
                <span>180+ Countries</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Floating Price Cards */}
          <div className="hidden lg:block relative">
            <div className="space-y-4">
              {cryptoList.map((crypto, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  animate={prefersReducedMotion ? "visible" : "floating"}
                  variants={cardVariants}
                  whileHover={prefersReducedMotion ? {} : {
                    scale: 1.03,
                    borderColor: "rgba(240, 185, 11, 0.6)",
                    boxShadow: "0 20px 40px rgba(240, 185, 11, 0.2)"
                  }}
                  className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-5 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#2B3139]/60 flex items-center justify-center p-1.5">
                        <img
                          src={crypto.icon}
                          alt={`${crypto.symbol} icon`}
                          className="w-8 h-8"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{crypto.symbol}</div>
                        <div className="text-xs text-[#848E9C]">
                          {crypto.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-lg">{crypto.price}</div>
                      <div
                        className={`text-sm font-medium ${
                          crypto.positive ? "text-[#0ECB81]" : "text-[#F6465D]"
                        }`}
                      >
                        {crypto.change}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-[#1E2329] py-12 border-y border-[#2B3139]" ref={statsRef}>
        <motion.div
          className="max-w-[1440px] mx-auto px-6"
          initial={{ opacity: 0, y: 50 }}
          animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="text-[#F0B90B] text-[36px] font-semibold mb-1">
                {statsInView && <AnimatedNumber value={120} format={(val) => `${Math.round(val)}M+`} />}
                {!statsInView && "120M+"}
              </div>
              <div className="text-[#848E9C] text-sm">Registered Users</div>
            </motion.div>
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="text-[#F0B90B] text-[36px] font-semibold mb-1">
                {statsInView && <AnimatedNumber value={76} format={(val) => `$${Math.round(val)}B`} />}
                {!statsInView && "$76B"}
              </div>
              <div className="text-[#848E9C] text-sm">24h Trading Volume</div>
            </motion.div>
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="text-[#F0B90B] text-[36px] font-semibold mb-1">
                {statsInView && <AnimatedNumber value={350} format={(val) => `${Math.round(val)}+`} />}
                {!statsInView && "350+"}
              </div>
              <div className="text-[#848E9C] text-sm">
                Cryptocurrencies Listed
              </div>
            </motion.div>
            <motion.div
              className="text-center lg:text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="text-[#F0B90B] text-[36px] font-semibold mb-1">
                {statsInView && <AnimatedNumber value={180} format={(val) => `${Math.round(val)}+`} />}
                {!statsInView && "180+"}
                </div>
              <div className="text-[#848E9C] text-sm">Countries Supported</div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="py-24 bg-[#0B0E11]">
        <div className="max-w-[1440px] mx-auto px-6">
          <h2 className="text-[40px] font-semibold text-center mb-16">
            Your trusted crypto platform
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Trade Feature */}
            <div className="bg-[#1E2329] border border-[#2B3139] rounded-2xl p-8 hover:border-[#F0B90B]/30 transition-all group">
              <div className="w-14 h-14 bg-[#F0B90B]/10 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp size={28} className="text-[#F0B90B]" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Trade</h3>
              <p className="text-[#B7BDC6] mb-6 leading-relaxed">
                Advanced trading tools, real-time charts, and multiple order
                types. Trade with leverage up to 125x on futures.
              </p>
              <a
                href="#"
                className="text-[#F0B90B] font-medium flex items-center gap-2 group-hover:gap-3 transition-all"
              >
                Start Trading <ArrowRight size={18} />
              </a>
            </div>

            {/* Earn Feature */}
            <div className="bg-[#1E2329] border border-[#2B3139] rounded-2xl p-8 hover:border-[#F0B90B]/30 transition-all group">
              <div className="w-14 h-14 bg-[#F0B90B]/10 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp size={28} className="text-[#F0B90B]" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Earn</h3>
              <p className="text-[#B7BDC6] mb-6 leading-relaxed">
                Grow your crypto holdings with staking, savings, and liquidity
                farming. Earn up to 8% APY.
              </p>
              <a
                href="#"
                className="text-[#F0B90B] font-medium flex items-center gap-2 group-hover:gap-3 transition-all"
              >
                Start Earning <ArrowRight size={18} />
              </a>
            </div>

            {/* Security Feature */}
            <div className="bg-[#1E2329] border border-[#2B3139] rounded-2xl p-8 hover:border-[#F0B90B]/30 transition-all group">
              <div className="w-14 h-14 bg-[#F0B90B]/10 rounded-xl flex items-center justify-center mb-6">
                <Shield size={28} className="text-[#F0B90B]" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">
                Enterprise-Grade Security
              </h3>
              <p className="text-[#B7BDC6] mb-6 leading-relaxed">
                Your assets are protected by industry-leading security measures,
                cold storage, and SAFU fund.
              </p>
              <a
                href="#"
                className="text-[#F0B90B] font-medium flex items-center gap-2 group-hover:gap-3 transition-all"
              >
                Learn More <ArrowRight size={18} />
              </a>
            </div>

            {/* Global Platform */}
            <div className="bg-[#1E2329] border border-[#2B3139] rounded-2xl p-8 hover:border-[#F0B90B]/30 transition-all group">
              <div className="w-14 h-14 bg-[#F0B90B]/10 rounded-xl flex items-center justify-center mb-6">
                <Globe2 size={28} className="text-[#F0B90B]" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Global Access</h3>
              <p className="text-[#B7BDC6] mb-6 leading-relaxed">
                Trade from anywhere with support for 50+ fiat currencies and
                local payment methods worldwide.
              </p>
              <a
                href="#"
                className="text-[#F0B90B] font-medium flex items-center gap-2 group-hover:gap-3 transition-all"
              >
                Explore Countries <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE APP SECTION */}
      <section className="py-24 bg-[#1E2329]">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-[40px] font-semibold mb-6">
                Trade on the go
              </h2>
              <p className="text-[#B7BDC6] text-lg mb-8 leading-relaxed">
                Download the CryptoPort mobile app and trade anytime, anywhere.
                Available on iOS and Android with full trading capabilities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-[#F0B90B] text-[#0B0E11] px-6 py-3 rounded-lg font-semibold hover:bg-[#F8D12F] transition-all flex items-center justify-center gap-2">
                  <Smartphone size={20} />
                  Download App
                </button>
                <button className="border border-[#2B3139] text-white px-6 py-3 rounded-lg font-semibold hover:border-[#F0B90B] transition-all">
                  Learn More
                </button>
              </div>
            </div>

            {/* Phone mockup */}
            <div className="hidden lg:flex justify-center">
              <img 
                src="/images/trade-image.png" 
                alt="Trade on the go with CryptoPort app" 
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0B0E11] border-t border-[#2B3139] py-16">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* About */}
            <div>
              <h4 className="font-semibold mb-4">About Us</h4>
              <ul className="space-y-2 text-sm text-[#848E9C]">
                <li>
                  <a href="#" className="hover:text-[#F0B90B] transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#F0B90B] transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#F0B90B] transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Products */}
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-[#848E9C]">
                <li>
                  <a href="#" className="hover:text-[#F0B90B] transition-colors">
                    Exchange
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#F0B90B] transition-colors">
                    Wallet
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#F0B90B] transition-colors">
                    NFT
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-[#848E9C]">
                <li>
                  <a href="#" className="hover:text-[#F0B90B] transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#F0B90B] transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#F0B90B] transition-colors">
                    API Docs
                  </a>
                </li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-[#848E9C]">
                <li>
                  <a href="#" className="hover:text-[#F0B90B] transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#F0B90B] transition-colors">
                    Telegram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#F0B90B] transition-colors">
                    Discord
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-[#2B3139] text-center text-sm text-[#848E9C]">
            <p>
              © 2024 CryptoPort. All rights reserved. | Simulation project for
              learning purposes.
            </p>
          </div>
        </div>
      </footer>
      </div>
    </PageTransition>
  );
}
