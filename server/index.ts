import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleCreateUser,
  handleLogin,
  handleGetUserByEmail,
  handleSendMoney,
  handleGetTransactions,
  handleFundWallet,
  handleGetAllUsers,
  handleGetUserById,
  handleRequestMoney,
  handleSendMessage,
  handleMarkMessagesRead,
  handleGetChatHistory,
  handleGetUnreadMessagesCount,
  handleGetChatStatus,
  handleToggleChat,
} from "./routes/paypal";
import {
  handleCreateUser as handleCreateBinanceUser,
  handleLogin as handleLoginBinanceUser,
  handleGetUserByEmail as handleGetBinanceUserByEmail,
  handleSendCrypto,
  handleGetTransactions as handleGetBinanceTransactions,
  handleGetCryptoWallets,
  handleDepositCrypto,
  handleWithdrawCrypto,
  handleGetAllUsers as handleGetAllBinanceUsers,
  handleFundWallet as handleFundBinanceWallet,
  handleUpdateDepositAddress,
  handleDeleteUser,
  handleSendMessage as handleSendBinanceMessage,
  handleMarkMessagesRead as handleMarkBinanceMessagesRead,
  handleGetChatHistory as handleGetBinanceChatHistory,
  handleGetUnreadMessagesCount as handleGetBinanceUnreadMessagesCount,
  handleGetChatStatus as handleGetBinanceChatStatus,
  handleToggleChat as handleToggleBinanceChat,
} from "./routes/binance";
import {
  handleCreateUser as handleCreateGCashUser,
  handleLogin as handleLoginGCashUser,
  handleGetUserByEmail as handleGetGCashUserByEmail,
  handleGetUserByMobile as handleGetGCashUserByMobile,
  handleSearchUsersByMobile as handleSearchGCashUsersByMobile,
  handleSendMoney as handleGCashSendMoney,
  handleGetTransactions as handleGetGCashTransactions,
  handleGetTransactionsByMobile as handleGetGCashTransactionsByMobile,
  handleFundWallet as handleFundGCashWallet,
  handleGetAllUsers as handleGetAllGCashUsers,
  handleGetAllTransactions as handleGetAllGCashTransactions,
  handleAdjustUserBalance as handleAdjustGCashUserBalance,
  handleUpdateUser as handleUpdateGCashUser,
  handleGetUserById as handleGetGCashUserById,
  handleSendMessage as handleSendGCashMessage,
  handleMarkMessagesRead as handleMarkGCashMessagesRead,
  handleGetChatHistory as handleGetGCashChatHistory,
  handleGetUnreadMessages as handleGetGCashUnreadMessages,
  handleGetChatStatus as handleGetGCashChatStatus,
  handleToggleChat as handleToggleGCashChat,
} from "./routes/gcash";
import {
  handleCreateUser as handleCreateCashAppUser,
  handleLogin as handleLoginCashAppUser,
  handleGetUserByEmail as handleGetCashAppUserByEmail,
  handleSearchUsers,
  handleSendMoney as handleCashAppSendMoney,
  handleGetTransactions as handleGetCashAppTransactions,
  handleGetChatStatus as handleGetCashAppChatStatus,
  handleGetUnreadCount as handleGetCashAppUnreadCount,
  handleGetChatHistory as handleGetCashAppChatHistory,
  handleSendMessage as handleSendCashAppMessage,
  handleMarkMessagesAsRead as handleMarkCashAppMessagesAsRead,
  handleGetAllUsers as handleGetAllCashAppUsers,
  handleFundWallet as handleFundCashAppWallet,
  handleEditUser as handleEditCashAppUser,
  handleGetAllTransactions as handleGetAllCashAppTransactions,
  handleToggleChat as handleToggleCashAppChat,
} from "./routes/cashapp";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

    // PayPal API routes
    app.post("/api/paypal/register", handleCreateUser);
    app.post("/api/paypal/login", handleLogin);
    app.get("/api/paypal/user/:email", handleGetUserByEmail);
    app.get("/api/paypal/user/:email/transactions", handleGetTransactions);
    app.post("/api/paypal/user/:senderEmail/send", handleSendMoney);
    app.post("/api/paypal/user/:requesterEmail/request", handleRequestMoney);
    app.post("/api/paypal/admin/fund", handleFundWallet);
    app.get("/api/paypal/admin/users", handleGetAllUsers);
    app.get("/api/paypal/admin/user/:id", handleGetUserById);
     
     // PayPal Chat API routes
     app.post("/api/paypal/chat/send/", handleSendMessage);
     app.post("/api/paypal/chat/mark-read/:email/", handleMarkMessagesRead);
     app.get("/api/paypal/chat/history/:email/", handleGetChatHistory);
     app.get("/api/paypal/chat/unread/:email/", handleGetUnreadMessagesCount);
     app.get("/api/paypal/chat/status/:email/", handleGetChatStatus);
     app.post("/api/paypal/chat/toggle/:userId/", handleToggleChat);

  // Binance API routes
  app.post("/api/binance/register", handleCreateBinanceUser);
  app.post("/api/binance/login", handleLoginBinanceUser);
  app.get("/api/binance/user/:email", handleGetBinanceUserByEmail);
  app.get("/api/binance/user/:email/transactions", handleGetBinanceTransactions);
  app.get("/api/binance/user/:email/wallets", handleGetCryptoWallets);
  app.post("/api/binance/user/:senderEmail/send", handleSendCrypto);
  app.post("/api/binance/user/:email/deposit", handleDepositCrypto);
  app.post("/api/binance/user/:email/withdraw", handleWithdrawCrypto);
  app.get("/api/binance/admin/users", handleGetAllBinanceUsers);
  app.post("/api/binance/admin/fund", handleFundBinanceWallet);
    app.post("/api/binance/admin/user/update-deposit-address", handleUpdateDepositAddress);
    app.delete("/api/binance/admin/user/:id/delete", handleDeleteUser);
  
     // Binance Chat API routes
     app.post("/api/binance/chat/send/", handleSendBinanceMessage);
     app.post("/api/binance/chat/mark-read/:email/", handleMarkBinanceMessagesRead);
     app.get("/api/binance/chat/history/:email/", handleGetBinanceChatHistory);
     app.get("/api/binance/chat/unread/:email/", handleGetBinanceUnreadMessagesCount);
     app.get("/api/binance/chat/status/:email/", handleGetBinanceChatStatus);
      app.post("/api/binance/admin/user/:userId/toggle-chat/", handleToggleBinanceChat);

  // GCash API routes
  app.post("/api/gcash/register", handleCreateGCashUser);
  app.post("/api/gcash/login", handleLoginGCashUser);
  app.get("/api/gcash/user/:email", handleGetGCashUserByEmail);
  app.get("/api/gcash/user/mobile/:mobile", handleGetGCashUserByMobile);
  app.get("/api/gcash/user/search", handleSearchGCashUsersByMobile);
  app.get("/api/gcash/user/mobile/:userMobile/transactions", handleGetGCashTransactionsByMobile);
  app.get("/api/gcash/user/:email/transactions", handleGetGCashTransactions);
  app.post("/api/gcash/user/mobile/:senderMobile/send", handleGCashSendMoney);
  app.post("/api/gcash/admin/fund", handleFundGCashWallet);
  app.get("/api/gcash/admin/users", handleGetAllGCashUsers);
  app.get("/api/gcash/admin/transactions", handleGetAllGCashTransactions);
  app.post("/api/gcash/admin/adjust-balance", handleAdjustGCashUserBalance);
  app.put("/api/gcash/admin/user/:id", handleUpdateGCashUser);
  app.get("/api/gcash/admin/user/:id", handleGetGCashUserById);

     // GCash Chat API routes
     app.post("/api/gcash/chat/send/", handleSendGCashMessage);
     app.post("/api/gcash/chat/mark-read/:email/", handleMarkGCashMessagesRead);
     app.get("/api/gcash/chat/history/:email/", handleGetGCashChatHistory);
     app.get("/api/gcash/chat/unread/:email/", handleGetGCashUnreadMessages);
     app.get("/api/gcash/chat/status/:email/", handleGetGCashChatStatus);
     app.post("/api/gcash/admin/user/:userId/toggle-chat/", handleToggleGCashChat);

    // CashApp API routes
    app.post("/api/cashapp/register", handleCreateCashAppUser);
    app.post("/api/cashapp/login", handleLoginCashAppUser);
    app.get("/api/cashapp/user/:email", handleGetCashAppUserByEmail);
    app.get("/api/cashapp/user/:email/transactions", handleGetCashAppTransactions);
    app.get("/api/cashapp/search", handleSearchUsers);
    app.post("/api/cashapp/user/:senderEmail/send", handleCashAppSendMoney);
    app.get("/api/cashapp/admin/users", handleGetAllCashAppUsers);
    app.get("/api/cashapp/admin/transactions", handleGetAllCashAppTransactions);
    app.post("/api/cashapp/admin/fund", handleFundCashAppWallet);
    app.put("/api/cashapp/admin/edit-user", handleEditCashAppUser);

      // CashApp Chat API routes
      app.post("/api/cashapp/chat/send/", handleSendCashAppMessage);
      app.post("/api/cashapp/chat/mark-read/:email/", handleMarkCashAppMessagesAsRead);
      app.get("/api/cashapp/chat/history/:email/", handleGetCashAppChatHistory);
      app.get("/api/cashapp/chat/unread/:email/", handleGetCashAppUnreadCount);
      app.get("/api/cashapp/chat/status/:email/", handleGetCashAppChatStatus);
      app.post("/api/cashapp/admin/user/:userId/toggle-chat/", handleToggleCashAppChat);

  return app;
}
