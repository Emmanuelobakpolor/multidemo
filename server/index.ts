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
} from "./routes/payflow";
import {
  handleCreateUser as handleCreateCryptoPortUser,
  handleLogin as handleLoginCryptoPortUser,
  handleGetUserByEmail as handleGetCryptoPortUserByEmail,
  handleSendCrypto,
  handleGetTransactions as handleGetCryptoPortTransactions,
  handleGetCryptoWallets,
  handleDepositCrypto,
  handleWithdrawCrypto,
  handleGetAllUsers as handleGetAllCryptoPortUsers,
  handleFundWallet as handleFundCryptoPortWallet,
  handleUpdateDepositAddress,
  handleDeleteUser,
  handleSendMessage as handleSendCryptoPortMessage,
  handleMarkMessagesRead as handleMarkCryptoPortMessagesRead,
  handleGetChatHistory as handleGetCryptoPortChatHistory,
  handleGetUnreadMessagesCount as handleGetCryptoPortUnreadMessagesCount,
  handleGetChatStatus as handleGetCryptoPortChatStatus,
  handleToggleChat as handleToggleCryptoPortChat,
} from "./routes/cryptoport";
import {
  handleCreateUser as handleCreateSendWaveUser,
  handleLogin as handleLoginSendWaveUser,
  handleGetUserByEmail as handleGetSendWaveUserByEmail,
  handleGetUserByMobile as handleGetSendWaveUserByMobile,
  handleSearchUsersByMobile as handleSearchSendWaveUsersByMobile,
  handleSendMoney as handleSendWaveMoney,
  handleGetTransactions as handleGetSendWaveTransactions,
  handleGetTransactionsByMobile as handleGetSendWaveTransactionsByMobile,
  handleFundWallet as handleFundSendWaveWallet,
  handleGetAllUsers as handleGetAllSendWaveUsers,
  handleGetAllTransactions as handleGetAllSendWaveTransactions,
  handleAdjustUserBalance as handleAdjustSendWaveUserBalance,
  handleUpdateUser as handleUpdateSendWaveUser,
  handleGetUserById as handleGetSendWaveUserById,
  handleSendMessage as handleSendWaveMessage,
  handleMarkMessagesRead as handleMarkWaveMessagesRead,
  handleGetChatHistory as handleGetWaveChatHistory,
  handleGetUnreadMessages as handleGetWaveUnreadMessages,
  handleGetChatStatus as handleGetWaveChatStatus,
  handleToggleChat as handleToggleWaveChat,
} from "./routes/sendwave";
import {
  handleCreateUser as handleCreateQuickCashUser,
  handleLogin as handleLoginQuickCashUser,
  handleGetUserByEmail as handleGetQuickCashUserByEmail,
  handleSearchUsers,
  handleSendMoney as handleQuickCashSendMoney,
  handleGetTransactions as handleGetQuickCashTransactions,
  handleGetChatStatus as handleGetQuickCashChatStatus,
  handleGetUnreadCount as handleGetQuickCashUnreadCount,
  handleGetChatHistory as handleGetQuickCashChatHistory,
  handleSendMessage as handleQuickCashSendMessage,
  handleMarkMessagesAsRead as handleQuickCashMarkMessagesAsRead,
  handleGetAllUsers as handleGetAllQuickCashUsers,
  handleFundWallet as handleQuickCashFundWallet,
  handleEditUser as handleQuickCashEditUser,
  handleGetAllTransactions as handleGetAllQuickCashTransactions,
  handleToggleChat as handleQuickCashToggleChat,
} from "./routes/quickcash";

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

   // PayFlow API routes
   app.post("/api/payflow/register", handleCreateUser);
   app.post("/api/payflow/login", handleLogin);
   app.get("/api/payflow/user/:email", handleGetUserByEmail);
   app.get("/api/payflow/user/:email/transactions", handleGetTransactions);
   app.post("/api/payflow/user/:senderEmail/send", handleSendMoney);
   app.post("/api/payflow/user/:requesterEmail/request", handleRequestMoney);
   app.post("/api/payflow/admin/fund", handleFundWallet);
   app.get("/api/payflow/admin/users", handleGetAllUsers);
   app.get("/api/payflow/admin/user/:id", handleGetUserById);
    
   // PayFlow Chat API routes
   app.post("/api/payflow/chat/send", handleSendMessage);
   app.post("/api/payflow/chat/mark-read/:email", handleMarkMessagesRead);
   app.get("/api/payflow/chat/history/:email", handleGetChatHistory);
   app.get("/api/payflow/chat/unread/:email", handleGetUnreadMessagesCount);
   app.get("/api/payflow/chat/status/:email", handleGetChatStatus);
   app.post("/api/payflow/chat/toggle/:userId", handleToggleChat);

  // CryptoPort API routes
  app.post("/api/cryptoport/register", handleCreateCryptoPortUser);
  app.post("/api/cryptoport/login", handleLoginCryptoPortUser);
  app.get("/api/cryptoport/user/:email", handleGetCryptoPortUserByEmail);
  app.get("/api/cryptoport/user/:email/transactions", handleGetCryptoPortTransactions);
  app.get("/api/cryptoport/user/:email/wallets", handleGetCryptoWallets);
  app.post("/api/cryptoport/user/:senderEmail/send", handleSendCrypto);
  app.post("/api/cryptoport/user/:email/deposit", handleDepositCrypto);
  app.post("/api/cryptoport/user/:email/withdraw", handleWithdrawCrypto);
  app.get("/api/cryptoport/admin/users", handleGetAllCryptoPortUsers);
  app.post("/api/cryptoport/admin/fund", handleFundCryptoPortWallet);
   app.post("/api/cryptoport/admin/user/update-deposit-address", handleUpdateDepositAddress);
   app.delete("/api/cryptoport/admin/user/:id/delete", handleDeleteUser);
  
   // CryptoPort Chat API routes
   app.post("/api/cryptoport/chat/send", handleSendCryptoPortMessage);
   app.post("/api/cryptoport/chat/mark-read/:email", handleMarkCryptoPortMessagesRead);
   app.get("/api/cryptoport/chat/history/:email", handleGetCryptoPortChatHistory);
   app.get("/api/cryptoport/chat/unread/:email", handleGetCryptoPortUnreadMessagesCount);
   app.get("/api/cryptoport/chat/status/:email", handleGetCryptoPortChatStatus);
    app.post("/api/cryptoport/admin/user/:userId/toggle-chat", handleToggleCryptoPortChat);

  // SendWave API routes
  app.post("/api/sendwave/register", handleCreateSendWaveUser);
  app.post("/api/sendwave/login", handleLoginSendWaveUser);
  app.get("/api/sendwave/user/:email", handleGetSendWaveUserByEmail);
  app.get("/api/sendwave/user/mobile/:mobile", handleGetSendWaveUserByMobile);
  app.get("/api/sendwave/user/search", handleSearchSendWaveUsersByMobile);
  app.get("/api/sendwave/user/mobile/:userMobile/transactions", handleGetSendWaveTransactionsByMobile);
  app.get("/api/sendwave/user/:email/transactions", handleGetSendWaveTransactions);
  app.post("/api/sendwave/user/mobile/:senderMobile/send", handleSendWaveMoney);
  app.post("/api/sendwave/admin/fund", handleFundSendWaveWallet);
  app.get("/api/sendwave/admin/users", handleGetAllSendWaveUsers);
  app.get("/api/sendwave/admin/transactions", handleGetAllSendWaveTransactions);
  app.post("/api/sendwave/admin/adjust-balance", handleAdjustSendWaveUserBalance);
  app.put("/api/sendwave/admin/user/:id", handleUpdateSendWaveUser);
  app.get("/api/sendwave/admin/user/:id", handleGetSendWaveUserById);

   // SendWave Chat API routes
   app.post("/api/sendwave/chat/send", handleSendWaveMessage);
   app.post("/api/sendwave/chat/mark-read/:email", handleMarkWaveMessagesRead);
   app.get("/api/sendwave/chat/history/:email", handleGetWaveChatHistory);
   app.get("/api/sendwave/chat/unread/:email", handleGetWaveUnreadMessages);
   app.get("/api/sendwave/chat/status/:email", handleGetWaveChatStatus);
   app.post("/api/sendwave/admin/user/:userId/toggle-chat", handleToggleWaveChat);

   // QuickCash API routes
   app.post("/api/quickcash/register", handleCreateQuickCashUser);
   app.post("/api/quickcash/login", handleLoginQuickCashUser);
   app.get("/api/quickcash/user/:email", handleGetQuickCashUserByEmail);
   app.get("/api/quickcash/user/:email/transactions", handleGetQuickCashTransactions);
   app.get("/api/quickcash/search", handleSearchUsers);
   app.post("/api/quickcash/user/:senderEmail/send", handleQuickCashSendMoney);
   app.get("/api/quickcash/admin/users", handleGetAllQuickCashUsers);
   app.get("/api/quickcash/admin/transactions", handleGetAllQuickCashTransactions);
   app.post("/api/quickcash/admin/fund", handleQuickCashFundWallet);
   app.put("/api/quickcash/admin/edit-user", handleQuickCashEditUser);

    // QuickCash Chat API routes
    app.post("/api/quickcash/chat/send", handleQuickCashSendMessage);
    app.post("/api/quickcash/chat/mark-read/:email", handleQuickCashMarkMessagesAsRead);
    app.get("/api/quickcash/chat/history/:email", handleGetQuickCashChatHistory);
    app.get("/api/quickcash/chat/unread/:email", handleGetQuickCashUnreadCount);
    app.get("/api/quickcash/chat/status/:email", handleGetQuickCashChatStatus);
    app.post("/api/quickcash/admin/user/:userId/toggle-chat", handleQuickCashToggleChat);

  return app;
}
