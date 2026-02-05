"use client";

import { useState } from "react";
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
import BTCIcon from "cryptocurrency-icons/svg/color/btc.svg";
import ETHIcon from "cryptocurrency-icons/svg/color/eth.svg";
import BNBIcon from "cryptocurrency-icons/svg/color/bnb.svg";
import SOLIcon from "cryptocurrency-icons/svg/color/sol.svg";

export default function CryptoPortLanding() {
  const [email, setEmail] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-[#0B0E11] text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-[#0B0E11] border-b border-[#2B3139]">
        <div className="max-w-[1440px] mx-auto px-6 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-12">
            <a href="/cryptoport" className="flex items-center gap-2">
              <img 
                src="/images/download.png" 
                alt="CryptoPort Logo" 
                className="h-20 w-auto"
              />
              <span className="text-white text-xl font-semibold">
                {/* Optional text next to logo */}
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <a
                href="#"
                className="text-[#EAECEF] hover:text-[#F0B90B] text-sm font-medium transition-colors"
              >
                Buy Crypto
              </a>
              <a
                href="#markets"
                className="text-[#EAECEF] hover:text-[#F0B90B] text-sm font-medium transition-colors"
              >
                Markets
              </a>
              <a
                href="#"
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
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-[#1E2329] border-t border-[#2B3139]">
            <nav className="flex flex-col p-6 space-y-4">
              <a
                href="#"
                className="text-[#EAECEF] hover:text-[#F0B90B] text-sm font-medium"
              >
                Buy Crypto
              </a>
              <a
                href="#markets"
                className="text-[#EAECEF] hover:text-[#F0B90B] text-sm font-medium"
              >
                Markets
              </a>
              <a
                href="#"
                className="text-[#EAECEF] hover:text-[#F0B90B] text-sm font-medium"
              >
                Trade
              </a>
              <a
                href="#features"
                className="text-[#EAECEF] hover:text-[#F0B90B] text-sm font-medium"
              >
                Features
              </a>
              <div className="pt-4 space-y-3">
                <a
                  href="/binance/login"
                  className="block text-center text-[#EAECEF] border border-[#2B3139] px-4 py-2 rounded hover:border-[#F0B90B] transition-colors"
                >
                  Log In
                </a>
                <a
                  href="/binance/register"
                  className="block text-center bg-[#F0B90B] text-[#0B0E11] px-4 py-2 rounded font-semibold"
                >
                  Register
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="max-w-[1440px] mx-auto px-6 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-[44px] md:text-[56px] lg:text-[64px] font-semibold leading-[1.1] mb-6">
              Buy, trade, and hold
              <br />
              <span className="text-[#F0B90B]">350+ cryptocurrencies</span>
            </h1>

            <p className="text-[#B7BDC6] text-lg mb-8 max-w-[520px]">
              Join the world's leading cryptocurrency exchange. Trade with
              confidence using industry-leading security and deep liquidity.
            </p>

            {/* Email signup form */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-[#1E2329] border border-[#2B3139] rounded px-4 py-3.5 text-white placeholder-[#707A8A] focus:outline-none focus:border-[#F0B90B] transition-colors"
              />
              <button className="bg-[#F0B90B] text-[#0B0E11] px-8 py-3.5 rounded font-semibold hover:bg-[#F8D12F] transition-all flex items-center justify-center gap-2">
                Get Started <ArrowRight size={18} />
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 text-sm text-[#848E9C]">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-[#F0B90B]" />
                <span>Secure & Regulated</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe2 size={16} className="text-[#F0B90B]" />
                <span>180+ Countries</span>
              </div>
            </div>
          </div>

          {/* Right - Floating Price Cards */}
          <div className="hidden lg:block relative">
            <div className="space-y-4">
              {cryptoList.map((crypto, i) => (
                <div
                  key={i}
                  className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-5 hover:border-[#F0B90B]/60 transition-all duration-300 hover:shadow-lg hover:shadow-[#F0B90B]/10"
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-[#1E2329] py-12 border-y border-[#2B3139]">
        <div className="max-w-[1440px] mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center lg:text-left">
              <div className="text-[#F0B90B] text-[36px] font-semibold mb-1">
                120M+
              </div>
              <div className="text-[#848E9C] text-sm">Registered Users</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-[#F0B90B] text-[36px] font-semibold mb-1">
                $76B
              </div>
              <div className="text-[#848E9C] text-sm">24h Trading Volume</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-[#F0B90B] text-[36px] font-semibold mb-1">
                350+
              </div>
              <div className="text-[#848E9C] text-sm">
                Cryptocurrencies Listed
              </div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-[#F0B90B] text-[36px] font-semibold mb-1">
                180+
              </div>
              <div className="text-[#848E9C] text-sm">Countries Supported</div>
            </div>
          </div>
        </div>
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
  );
}
