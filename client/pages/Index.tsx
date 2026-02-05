import { Link } from "react-router-dom";
import { ArrowRight, Zap, TrendingUp, Shield, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";

const Index = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const apps = [
    {
      id: "gcash",
      name: "GCash",
      tagline: "Fast Peer-to-Peer Payments",
      description:
        "Send and receive money instantly with just a username. Simple, secure, and social.",
      icon: "📱",
      color: "from-purple-600 to-purple-400",
      href: "/gcash",
      features: ["Instant transfers", "QR-based payments", "Activity timeline"],
    },
    {
      id: "binance",
      name: "Binance",
      tagline: "Your Digital Asset Wallet",
      description:
        "Manage your crypto portfolio with real-time data and seamless transactions.",
      icon: "🪙",
      color: "from-amber-600 to-amber-400",
      href: "/binance",
      features: ["Multi-asset support", "Real-time tracking", "Secure transfers"],
    },
    {
      id: "paypal",
      name: "PayPal",
      tagline: "Professional Money Management",
      description:
        "Send money anywhere, request payments easily. Built for business and personal use.",
      icon: "💳",
      color: "from-red-600 to-red-400",
      href: "/paypal",
      features: ["Email transfers", "Payment requests", "Activity history"],
    },
    {
      id: "cashapp",
      name: "CashApp",
      tagline: "Instant Wallet & Payments",
      description:
        "Lightning-fast payments with a unique cashtag. Speed meets simplicity.",
      icon: "⚡",
      color: "from-teal-600 to-teal-400",
      href: "/cashapp",
      features: ["Cashtag username", "Instant send/receive", "Quick transactions"],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                FN
              </div>
              <span className="font-bold text-slate-900 dark:text-white">
                FinTech Hub
              </span>
            </div>
            <button
              onClick={() => {
                document.documentElement.classList.toggle("dark");
                setIsDark(!isDark);
              }}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center mb-20">
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
            The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400">
              Digital Banking
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
            Explore four unique fintech platforms designed for different financial needs. Learn how modern banking
            platforms work with our interactive simulation.
          </p>
          <Link
            to="/gcash"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all font-semibold"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Platform Grid */}
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6 mb-20">
          {apps.map((app) => (
            <Link
              key={app.id}
              to={app.href}
              className="group bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all hover:shadow-lg"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="text-5xl mb-4">{app.icon}</div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {app.name}
                  </h3>
                  <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-3">
                    {app.tagline}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${app.color} flex items-center justify-center text-white opacity-10 group-hover:opacity-20 transition-opacity`} />
              </div>

              <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                {app.description}
              </p>

              <div className="space-y-2 mb-6">
                {app.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold group-hover:translate-x-1 transition-transform">
                Explore <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>

        {/* Admin Section */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 sm:p-12 border border-slate-700 text-white">
            <div className="flex items-center gap-4 mb-4">
              <Shield className="w-8 h-8" />
              <h3 className="text-2xl font-bold">Admin Dashboard</h3>
            </div>
            <p className="text-slate-300 mb-6 max-w-2xl">
              Centralized control panel for managing users, transactions, and balances across all platforms. Monitor
              platform health, approve/reject transactions, and maintain system integrity.
            </p>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-colors font-semibold"
            >
              Access Admin <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-slate-900 dark:text-white mb-16">
            Why Choose Our Platforms?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Lightning Fast",
                description: "Transactions happen instantly with our optimized payment networks.",
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Real-time Analytics",
                description: "Track your money flow with detailed transaction history and insights.",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Bank-Grade Security",
                description: "Your digital assets are protected with industry-leading security standards.",
              },
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/30 flex items-center justify-center mx-auto mb-4 text-purple-600 dark:text-purple-400">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <p>© 2024 FinTech Hub - Educational Banking Simulation</p>
            <p>Use dummy data only - This is a simulation for learning purposes</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
