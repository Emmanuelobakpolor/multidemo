import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// GCash Pages
import GCashLanding from "./pages/gcash/Landing";
import GCashLogin from "./pages/gcash/Login";
import GCashRegister from "./pages/gcash/Register";
import GCashDashboard from "./pages/gcash/Dashboard";
import GCashSend from "./pages/gcash/Send";
import GCashReceive from "./pages/gcash/Receive";
import GCashAdminLogin from "./pages/gcash/AdminLogin";
import GCashAdminDashboard from "./pages/gcash/AdminDashboard";
import GCashSettings from "./pages/gcash/Settings";

// Binance Pages
import BinanceLanding from "./pages/binance/Landing";
import BinanceLogin from "./pages/binance/Login";
import BinanceRegister from "./pages/binance/Register";
import BinanceDashboard from "./pages/binance/Dashboard";
import BinanceSend from "./pages/binance/Send";
import BinanceReceive from "./pages/binance/Receive";
import BinanceAdminLogin from "./pages/binance/AdminLogin";
import BinanceAdminDashboard from "./pages/binance/AdminDashboard";
import BinanceSettings from "./pages/binance/Settings";
import BinanceMarkets from "./pages/binance/Markets";
import BinanceTrade from "./pages/binance/Trade";
import BinanceHelp from "./pages/binance/Help";
import BinanceEarn from "./pages/binance/Earn";
import BinanceSecurity from "./pages/binance/Security";
import BinanceSupport from "./pages/binance/Support";

// PayPal Pages
import PayPalanding from "./pages/paypal/Landing";
import PayPalLogin from "./pages/paypal/Login";
import PayPalRegister from "./pages/paypal/Register";
import PayPalDashboard from "./pages/paypal/Dashboard";
import PayPalSend from "./pages/paypal/Send";
import PayPalRequest from "./pages/paypal/Request";
import PayPalAdminDashboard from "./pages/paypal/AdminDashboard";
import PayPalAdminLogin from "./pages/paypal/AdminLogin";
import PayPalSettings from "./pages/paypal/Settings";
import PayPalWallet from "./pages/paypal/Wallet";
import PayPalHelp from "./pages/paypal/Help";

// CashApp Pages
import CashAppLanding from "./pages/cashapp/Landing";
import CashAppLogin from "./pages/cashapp/Login";
import CashAppRegister from "./pages/cashapp/Register";
import CashAppDashboard from "./pages/cashapp/Dashboard";
import CashAppSend from "./pages/cashapp/Send";
import CashAppReceive from "./pages/cashapp/Receive";
import CashAppAdminLogin from "./pages/cashapp/AdminLogin";
import CashAppAdminDashboard from "./pages/cashapp/AdminDashboard";
import CashAppSettings from "./pages/cashapp/Settings";
import CashAppCard from "./pages/cashapp/Card";
import CashAppSavings from "./pages/cashapp/Savings";

// Admin Pages
import AdminLanding from "./pages/admin/Landing";
import AdminLogin from "./pages/admin/Login";
import AdminRegister from "./pages/admin/Register";

const queryClient = new QueryClient();

// Animated Routes Component
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />

          {/* GCash Routes */}
          <Route path="/gcash" element={<GCashLanding />} />
          <Route path="/gcash/login" element={<GCashLogin />} />
          <Route path="/gcash/register" element={<GCashRegister />} />
          <Route path="/gcash/dashboard" element={<GCashDashboard />} />
          <Route path="/gcash/send" element={<GCashSend />} />
          <Route path="/gcash/receive" element={<GCashReceive />} />
          <Route path="/gcash/settings" element={<GCashSettings />} />
          <Route path="/gcash/admin/login" element={<GCashAdminLogin />} />
          <Route path="/gcash/admin/dashboard" element={<GCashAdminDashboard />} />

          {/* Binance Routes */}
          <Route path="/binance" element={<BinanceLanding />} />
          <Route path="/binance/login" element={<BinanceLogin />} />
          <Route path="/binance/register" element={<BinanceRegister />} />
          <Route path="/binance/dashboard" element={<BinanceDashboard />} />
          <Route path="/binance/send" element={<BinanceSend />} />
          <Route path="/binance/receive" element={<BinanceReceive />} />
          <Route path="/binance/settings" element={<BinanceSettings />} />
          <Route path="/binance/markets" element={<BinanceMarkets />} />
          <Route path="/binance/trade" element={<BinanceTrade />} />
          <Route path="/binance/help" element={<BinanceHelp />} />
          <Route path="/binance/earn" element={<BinanceEarn />} />
          <Route path="/binance/security" element={<BinanceSecurity />} />
          <Route path="/binance/support" element={<BinanceSupport />} />
          <Route path="/binance/admin/login" element={<BinanceAdminLogin />} />
          <Route path="/binance/admin/dashboard" element={<BinanceAdminDashboard />} />

          {/* PayPal Routes */}
          <Route path="/paypal" element={<PayPalanding />} />
          <Route path="/paypal/login" element={<PayPalLogin />} />
          <Route path="/paypal/register" element={<PayPalRegister />} />
          <Route path="/paypal/dashboard" element={<PayPalDashboard />} />
          <Route path="/paypal/send" element={<PayPalSend />} />
          <Route path="/paypal/request" element={<PayPalRequest />} />
          <Route path="/paypal/settings" element={<PayPalSettings />} />
          <Route path="/paypal/wallet" element={<PayPalWallet />} />
          <Route path="/paypal/help" element={<PayPalHelp />} />
          <Route path="/paypal/admin/login" element={<PayPalAdminLogin />} />
          <Route path="/paypal/admin/dashboard" element={<PayPalAdminDashboard />} />

          {/* CashApp Routes */}
          <Route path="/cashapp" element={<CashAppLanding />} />
          <Route path="/cashapp/login" element={<CashAppLogin />} />
          <Route path="/cashapp/register" element={<CashAppRegister />} />
          <Route path="/cashapp/dashboard" element={<CashAppDashboard />} />
          <Route path="/cashapp/send" element={<CashAppSend />} />
          <Route path="/cashapp/receive" element={<CashAppReceive />} />
          <Route path="/cashapp/settings" element={<CashAppSettings />} />
          <Route path="/cashapp/card" element={<CashAppCard />} />
          <Route path="/cashapp/savings" element={<CashAppSavings />} />
          <Route path="/cashapp/admin/login" element={<CashAppAdminLogin />} />
          <Route path="/cashapp/admin/dashboard" element={<CashAppAdminDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLanding />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    );
  }

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
