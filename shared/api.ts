/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

export interface User {
  id: string;
  email: string;
  fullName: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface BinanceUser {
  id: string;
  email: string;
  fullName: string;
  fiatBalance: number;
  cryptoBalances: { [key: string]: number };
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  senderId: string;
  recipient: string;
  amount: number;
  reason?: string;
  transaction_type: "sent" | "received" | "admin_adjusted" | "deposit" | "withdrawal" | "requested" | "request_received" | "crypto_sent" | "crypto_received" | "crypto_deposit" | "crypto_withdrawal";
  status: "completed" | "pending" | "failed";
  date: string;
  cryptoSymbol?: string;
}

export interface SendMoneyRequest {
  recipientEmail: string;
  amount: number;
  message?: string;
}

export interface GCashSendMoneyRequest {
  recipientMobile: string;
  amount: number;
  message?: string;
}

export interface SendCryptoRequest {
  recipientEmail: string;
  cryptoSymbol: string;
  amount: number;
}

export interface FundWalletRequest {
  userId: string;
  amount: number;
  reason?: string;
}

export interface FundCryptoWalletRequest {
  userId: string;
  cryptoSymbol: string;
  amount: number;
  reason?: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  fullName: string;
  mobileNumber: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateAdminRequest {
  email: string;
  password: string;
  fullName: string;
  adminCode: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface CryptoWallet {
  id: string;
  cryptoSymbol: string;
  cryptoName: string;
  balance: number;
  depositAddress: string;
}

export interface UpdateDepositAddressRequest {
  userId: string;
  cryptoSymbol: string;
  depositAddress: string;
}

// Chat-related interfaces
export interface ChatMessage {
  id: string;
  sender: string;
  receiver: string;
  message: string;
  timestamp: string;
  is_read: boolean;
  sender_name?: string;
  sender_email?: string;
  receiver_name?: string;
  receiver_email?: string;
}

export interface SendMessageRequest {
  sender_email: string;
  receiver_email: string;
  message: string;
}

export interface ChatStatusResponse {
  success: boolean;
  chat_enabled: boolean;
}

export interface ToggleChatResponse {
  success: boolean;
  message: string;
  chat_enabled: boolean;
}

export interface DemoResponse {
  message: string;
}
