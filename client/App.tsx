import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// SendWave Pages
import SendWaveLanding from "./pages/sendwave/Landing";
import SendWaveLogin from "./pages/sendwave/Login";
import SendWaveRegister from "./pages/sendwave/Register";
import SendWaveDashboard from "./pages/sendwave/Dashboard";
import SendWaveSend from "./pages/sendwave/Send";
import SendWaveReceive from "./pages/sendwave/Receive";
import SendWaveAdminLogin from "./pages/sendwave/AdminLogin";
import SendWaveAdminDashboard from "./pages/sendwave/AdminDashboard";

// CryptoPort Pages
import CryptoPortLanding from "./pages/cryptoport/Landing";
import CryptoPortLogin from "./pages/cryptoport/Login";
import CryptoPortRegister from "./pages/cryptoport/Register";
import CryptoPortDashboard from "./pages/cryptoport/Dashboard";
import CryptoPortSend from "./pages/cryptoport/Send";
import CryptoPortReceive from "./pages/cryptoport/Receive";
import CryptoPortAdminLogin from "./pages/cryptoport/AdminLogin";
import CryptoPortAdminDashboard from "./pages/cryptoport/AdminDashboard";

// PayFlow Pages
import PayFlowLanding from "./pages/payflow/Landing";
import PayFlowLogin from "./pages/payflow/Login";
import PayFlowRegister from "./pages/payflow/Register";
import PayFlowDashboard from "./pages/payflow/Dashboard";
import PayFlowSend from "./pages/payflow/Send";
import PayFlowRequest from "./pages/payflow/Request";
import PayFlowAdminDashboard from "./pages/payflow/AdminDashboard";
import PayFlowAdminLogin from "./pages/payflow/AdminLogin";

// QuickCash Pages
import QuickCashLanding from "./pages/quickcash/Landing";
import QuickCashLogin from "./pages/quickcash/Login";
import QuickCashRegister from "./pages/quickcash/Register";
import QuickCashDashboard from "./pages/quickcash/Dashboard";
import QuickCashSend from "./pages/quickcash/Send";
import QuickCashReceive from "./pages/quickcash/Receive";
import QuickCashAdminLogin from "./pages/quickcash/AdminLogin";
import QuickCashAdminDashboard from "./pages/quickcash/AdminDashboard";

// Admin Pages
import AdminLanding from "./pages/admin/Landing";
import AdminLogin from "./pages/admin/Login";
import AdminRegister from "./pages/admin/Register";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          {/* SendWave Routes */}
          <Route path="/sendwave" element={<SendWaveLanding />} />
          <Route path="/sendwave/login" element={<SendWaveLogin />} />
          <Route path="/sendwave/register" element={<SendWaveRegister />} />
          <Route path="/sendwave/dashboard" element={<SendWaveDashboard />} />
          <Route path="/sendwave/send" element={<SendWaveSend />} />
          <Route path="/sendwave/receive" element={<SendWaveReceive />} />
          <Route path="/sendwave/admin/login" element={<SendWaveAdminLogin />} />
          <Route path="/sendwave/admin/dashboard" element={<SendWaveAdminDashboard />} />

          {/* CryptoPort Routes */}
          <Route path="/cryptoport" element={<CryptoPortLanding />} />
          <Route path="/cryptoport/login" element={<CryptoPortLogin />} />
          <Route path="/cryptoport/register" element={<CryptoPortRegister />} />
          <Route path="/cryptoport/dashboard" element={<CryptoPortDashboard />} />
          <Route path="/cryptoport/send" element={<CryptoPortSend />} />
          <Route path="/cryptoport/receive" element={<CryptoPortReceive />} />
          <Route path="/cryptoport/admin/login" element={<CryptoPortAdminLogin />} />
          <Route path="/cryptoport/admin/dashboard" element={<CryptoPortAdminDashboard />} />

          {/* PayFlow Routes */}
          <Route path="/payflow" element={<PayFlowLanding />} />
          <Route path="/payflow/login" element={<PayFlowLogin />} />
          <Route path="/payflow/register" element={<PayFlowRegister />} />
          <Route path="/payflow/dashboard" element={<PayFlowDashboard />} />
          <Route path="/payflow/send" element={<PayFlowSend />} />
          <Route path="/payflow/request" element={<PayFlowRequest />} />
          <Route path="/payflow/admin/login" element={<PayFlowAdminLogin />} />
          <Route path="/payflow/admin/dashboard" element={<PayFlowAdminDashboard />} />

          {/* QuickCash Routes */}
          <Route path="/quickcash" element={<QuickCashLanding />} />
          <Route path="/quickcash/login" element={<QuickCashLogin />} />
          <Route path="/quickcash/register" element={<QuickCashRegister />} />
          <Route path="/quickcash/dashboard" element={<QuickCashDashboard />} />
           <Route path="/quickcash/send" element={<QuickCashSend />} />
           <Route path="/quickcash/receive" element={<QuickCashReceive />} />
           <Route path="/quickcash/admin/login" element={<QuickCashAdminLogin />} />
          <Route path="/quickcash/admin/dashboard" element={<QuickCashAdminDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLanding />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
