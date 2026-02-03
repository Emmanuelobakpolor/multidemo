import { RequestHandler } from "express";
import { User, Transaction, SendMoneyRequest, SendWaveSendMoneyRequest, FundWalletRequest, CreateUserRequest, LoginRequest, ApiResponse, SendMessageRequest, ChatMessage } from "@shared/api";

// Django API base URL
const DJANGO_API_BASE = "https://multi-bakend.onrender.com/api";

// Create user (register)
export const handleCreateUser: RequestHandler = async (req, res) => {
  const { email, password, fullName, mobileNumber }: CreateUserRequest = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    // Call SendWave-specific register endpoint which properly handles password hashing and platform association
    const userResponse = await fetch(`${DJANGO_API_BASE}/sendwave/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: normalizedEmail,
        password,
        fullName,
        mobileNumber,
      }),
    });

    const data = await userResponse.json();

    if (!userResponse.ok) {
      const response: ApiResponse = {
        success: false,
        error: data.error || "Failed to create user",
      };
      return res.status(userResponse.status).json(response);
    }

    // Return user data in the format expected by the client
    const userData: User & { mobileNumber?: string } = {
      id: data.data.id.toString(),
      email: data.data.email,
      fullName: data.data.fullName,
      mobileNumber: data.data.mobileNumber,
      balance: data.data.balance,
      createdAt: data.data.createdAt,
      updatedAt: data.data.updatedAt,
    };

    const response: ApiResponse<User & { mobileNumber?: string }> = {
      success: true,
      data: userData,
      message: data.message || "User created successfully",
    };

    res.json(response);
  } catch (error: any) {
    console.error("Error creating user:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

// Login user
export const handleLogin: RequestHandler = async (req, res) => {
  const { email, password }: LoginRequest = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    // Call SendWave-specific login endpoint which properly verifies passwords
    const loginResponse = await fetch(`${DJANGO_API_BASE}/sendwave/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: normalizedEmail,
        password,
      }),
    });

    const data = await loginResponse.json();

    if (!loginResponse.ok) {
      const response: ApiResponse = {
        success: false,
        error: data.error || "Login failed",
      };
      return res.status(loginResponse.status).json(response);
    }

    const userData: User & { mobileNumber?: string } = {
      id: data.data.id.toString(),
      email: data.data.email,
      fullName: data.data.fullName,
      mobileNumber: data.data.mobileNumber,
      balance: data.data.balance,
      createdAt: data.data.createdAt,
      updatedAt: data.data.updatedAt,
    };

    const response: ApiResponse<User & { mobileNumber?: string }> = {
      success: true,
      data: userData,
      message: data.message || "Login successful",
    };

    res.json(response);
  } catch (error: any) {
    console.error("Error logging in:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

// Get user by email
export const handleGetUserByEmail: RequestHandler = async (req, res) => {
  const { email } = req.params;

  try {
    const usersResponse = await fetch(`${DJANGO_API_BASE}/users/?email=${email}`);
    const users = await usersResponse.json();

    if (users.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "User not found",
      };
      return res.status(404).json(response);
    }

    const user = users[0];

    // Get user account
    const accountsResponse = await fetch(
      `${DJANGO_API_BASE}/accounts/?user=${user.id}&platform__name=SendWave`
    );
    const accounts = await accountsResponse.json();

    const userData: User = {
      id: user.id.toString(),
      email: user.email,
      fullName: `${user.first_name} ${user.last_name}`,
      balance: accounts.length > 0 ? parseFloat(accounts[0].balance) : 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const response: ApiResponse<User> = {
      success: true,
      data: userData,
    };

    res.json(response);
  } catch (error: any) {
    console.error("Error getting user by email:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

// Get user by mobile number
export const handleGetUserByMobile: RequestHandler = async (req, res) => {
  const { mobile } = req.params;

  try {
    const response = await fetch(`${DJANGO_API_BASE}/sendwave/user/mobile/${mobile}`);
    const data = await response.json();

    if (!response.ok) {
      const apiResponse: ApiResponse = {
        success: false,
        error: data.error || "User not found",
      };
      return res.status(response.status).json(apiResponse);
    }

    const userData: User & { mobileNumber?: string } = {
      id: data.data.id.toString(),
      email: data.data.email,
      fullName: data.data.fullName,
      mobileNumber: data.data.mobileNumber,
      balance: data.data.balance,
      createdAt: data.data.createdAt,
      updatedAt: data.data.updatedAt,
    };

    const apiResponse: ApiResponse<User & { mobileNumber?: string }> = {
      success: true,
      data: userData,
    };

    res.json(apiResponse);
  } catch (error: any) {
    console.error("Error getting user by mobile:", error);
    const apiResponse: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(apiResponse);
  }
};

// Search users by mobile number
export const handleSearchUsersByMobile: RequestHandler = async (req, res) => {
  const query = req.query.q as string;

  if (!query) {
    return res.json({ success: true, data: [] });
  }

  try {
    const searchResponse = await fetch(`${DJANGO_API_BASE}/sendwave/user/search?q=${encodeURIComponent(query)}`);
    const data = await searchResponse.json();

    if (!searchResponse.ok) {
      const response: ApiResponse = {
        success: false,
        error: data.error || "Search failed",
      };
      return res.status(searchResponse.status).json(response);
    }

    res.json(data);
  } catch (error: any) {
    console.error("Error searching users:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

// Send money
export const handleSendMoney: RequestHandler = async (req, res) => {
  const { recipientMobile, amount, message }: SendWaveSendMoneyRequest = req.body;
  const { senderMobile } = req.params;

  try {
    // Find sender by mobile number
    const senderResponse = await fetch(
      `${DJANGO_API_BASE}/sendwave/user/mobile/${senderMobile}`
    );
    const senders = await senderResponse.json();

    if (senders.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "Sender not found",
      };
      return res.status(404).json(response);
    }
    const sender = senders[0];

    // Find recipient by mobile number
    const recipientResponse = await fetch(
      `${DJANGO_API_BASE}/sendwave/user/mobile/${recipientMobile}`
    );
    const recipientData = await recipientResponse.json();

    if (!recipientResponse.ok || !recipientData.success) {
      const response: ApiResponse = {
        success: false,
        error: "Recipient not found",
      };
      return res.status(404).json(response);
    }
    const recipient = recipientData.data;

    if (sender.id === recipient.id) {
      const response: ApiResponse = {
        success: false,
        error: "Cannot send money to yourself",
      };
      return res.status(400).json(response);
    }

    // Get sender account - use trailing slash
    const senderAccountsResponse = await fetch(
      `${DJANGO_API_BASE}/accounts/?user=${sender.id}&platform__name=SendWave`
    );
    const senderAccounts = await senderAccountsResponse.json();

    if (senderAccounts.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "Sender account not found",
      };
      return res.status(404).json(response);
    }
    const senderAccount = senderAccounts[0];

    if (parseFloat(senderAccount.balance) < amount) {
      const response: ApiResponse = {
        success: false,
        error: "Insufficient balance",
      };
      return res.status(400).json(response);
    }

    // Get recipient account
    const recipientAccountsResponse = await fetch(
      `${DJANGO_API_BASE}/accounts/?user=${recipient.id}&platform__name=SendWave`
    );
    const recipientAccounts = await recipientAccountsResponse.json();

    if (recipientAccounts.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "Recipient account not found",
      };
      return res.status(404).json(response);
    }
    const recipientAccount = recipientAccounts[0];

    // Update balances
    const newSenderBalance = parseFloat(senderAccount.balance) - amount;
    await fetch(`${DJANGO_API_BASE}/accounts/${senderAccount.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...senderAccount,
        balance: newSenderBalance,
      }),
    });

    const newRecipientBalance = parseFloat(recipientAccount.balance) + amount;
    await fetch(`${DJANGO_API_BASE}/accounts/${recipientAccount.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...recipientAccount,
        balance: newRecipientBalance,
      }),
    });

    // Create transactions
    const transactionResponse = await fetch(`${DJANGO_API_BASE}/transactions/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account: senderAccount.id,
        sender_account: senderAccount.id,
        amount: amount,
        transaction_type: "sent",
        status: "completed",
        reason: message,
        recipient: recipientMobile,
      }),
    });

    const createdTransaction = await transactionResponse.json();

    // Create received transaction
    await fetch(`${DJANGO_API_BASE}/transactions/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account: recipientAccount.id,
        sender_account: senderAccount.id,
        amount: amount,
        transaction_type: "received",
        status: "completed",
        reason: message,
        recipient: senderMobile,
      }),
    });

    const transactionData: Transaction = {
      id: createdTransaction.id.toString(),
      senderId: sender.id.toString(),
      recipient: recipientMobile,
      amount: amount,
      reason: message,
      transaction_type: "sent",
      status: "completed",
      date: new Date().toISOString(),
    };

    const response: ApiResponse<Transaction> = {
      success: true,
      data: transactionData,
      message: "Money sent successfully",
    };

    res.json(response);
  } catch (error: any) {
    console.error("Error sending money:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

// Get transactions by mobile number
export const handleGetTransactionsByMobile: RequestHandler = async (req, res) => {
  const { userMobile } = req.params;

  try {
    // Find user by mobile
    const userResponse = await fetch(`${DJANGO_API_BASE}/sendwave/user/mobile/${userMobile}`);
    const userData = await userResponse.json();

    if (!userResponse.ok || !userData.success) {
      const response: ApiResponse = {
        success: false,
        error: "User not found",
      };
      return res.status(404).json(response);
    }

    const user = userData.data;

    // Get user account
    const accountsResponse = await fetch(
      `${DJANGO_API_BASE}/accounts/?user=${user.id}&platform__name=SendWave`
    );
    const accounts = await accountsResponse.json();

    if (accounts.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "User account not found",
      };
      return res.status(404).json(response);
    }

    // Filter to get only SendWave accounts for the specific user
    const sendwaveAccounts = accounts.filter((account: any) => 
      account.platform_name === "SendWave" && account.user === parseInt(user.id)
    );

    if (sendwaveAccounts.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "SendWave account not found for user",
      };
      return res.status(404).json(response);
    }

    const userAccount = sendwaveAccounts[0];

    // Get transactions
    const transactionsResponse = await fetch(
      `${DJANGO_API_BASE}/transactions/?account=${userAccount.id}`
    );
    const transactions = await transactionsResponse.json();

    const transactionsData: Transaction[] = transactions.map((transaction: any) => ({
      id: transaction.id.toString(),
      senderId: transaction.transaction_type === "sent" ? user.id.toString() : (transaction.sender_id?.toString() || ""),
      recipient: transaction.recipient,
      amount: parseFloat(transaction.amount),
      reason: transaction.reason,
      transaction_type: transaction.transaction_type,
      status: transaction.status,
      date: new Date(transaction.date).toISOString(),
    }));

    const response: ApiResponse<Transaction[]> = {
      success: true,
      data: transactionsData,
    };

    res.json(response);
  } catch (error: any) {
    console.error("Error getting transactions:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

// Get transactions
export const handleGetTransactions: RequestHandler = async (req, res) => {
  const { userEmail } = req.params;

  try {
    // Find user
    const usersResponse = await fetch(`${DJANGO_API_BASE}/users/?email=${userEmail}`);
    const users = await usersResponse.json();

    if (users.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "User not found",
      };
      return res.status(404).json(response);
    }

    const user = users[0];

    // Get user account
    const accountsResponse = await fetch(
      `${DJANGO_API_BASE}/accounts/?user=${user.id}&platform__name=SendWave`
    );
    const accounts = await accountsResponse.json();

    if (accounts.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "User account not found",
      };
      return res.status(404).json(response);
    }

    // Filter to get only SendWave accounts for the specific user
    const sendwaveAccounts = accounts.filter((account: any) => 
      account.platform_name === "SendWave" && account.user === user.id
    );

    if (sendwaveAccounts.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "SendWave account not found for user",
      };
      return res.status(404).json(response);
    }

    const userAccount = sendwaveAccounts[0];

    // Get transactions
    const transactionsResponse = await fetch(
      `${DJANGO_API_BASE}/transactions/?account=${userAccount.id}`
    );
    const transactions = await transactionsResponse.json();

    const transactionsData: Transaction[] = transactions.map((transaction: any) => ({
      id: transaction.id.toString(),
      senderId: transaction.transaction_type === "sent" ? user.id.toString() : (transaction.sender_id?.toString() || ""),
      recipient: transaction.recipient,
      amount: parseFloat(transaction.amount),
      reason: transaction.reason,
      transaction_type: transaction.transaction_type,
      status: transaction.status,
      date: new Date(transaction.date).toISOString(),
    }));

    const response: ApiResponse<Transaction[]> = {
      success: true,
      data: transactionsData,
    };

    res.json(response);
  } catch (error: any) {
    console.error("Error getting transactions:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

// Fund wallet
export const handleFundWallet: RequestHandler = async (req, res) => {
  const { userId, amount, reason }: FundWalletRequest = req.body;

  try {
    // Get user account
    const accountsResponse = await fetch(
      `${DJANGO_API_BASE}/accounts/?user=${userId}&platform__name=SendWave`
    );
    const accounts = await accountsResponse.json();

    if (accounts.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "User account not found",
      };
      return res.status(404).json(response);
    }

    const userAccount = accounts[0];

    // Update balance
    const newBalance = parseFloat(userAccount.balance) + amount;
    await fetch(`${DJANGO_API_BASE}/accounts/${userAccount.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...userAccount,
        balance: newBalance,
      }),
    });

    // Create transaction
    const transactionResponse = await fetch(`${DJANGO_API_BASE}/transactions/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account: userAccount.id,
        amount: amount,
        transaction_type: "deposit",
        status: "completed",
        reason: reason || "Wallet funding",
        recipient: "Self",
      }),
    });

    const createdTransaction = await transactionResponse.json();

    const transactionData: Transaction = {
      id: createdTransaction.id.toString(),
      senderId: userId,
      recipient: "Self",
      amount: amount,
      reason: reason || "Wallet funding",
      transaction_type: "deposit",
      status: "completed",
      date: new Date().toISOString(),
    };

    const response: ApiResponse<Transaction> = {
      success: true,
      data: transactionData,
      message: "Wallet funded successfully",
    };

    res.json(response);
  } catch (error: any) {
    console.error("Error funding wallet:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

// Admin dashboard: Get all users
export const handleGetAllUsers: RequestHandler = async (req, res) => {
  try {
    // Call SendWave-specific admin endpoint to get all SendWave users
    const usersResponse = await fetch(`${DJANGO_API_BASE}/sendwave/admin/users`);
    const data = await usersResponse.json();

    if (!usersResponse.ok) {
      const response: ApiResponse = {
        success: false,
        error: data.error || "Failed to get users",
      };
      return res.status(usersResponse.status).json(response);
    }

    res.json(data);
  } catch (error: any) {
    console.error("Error getting all users:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

// Admin dashboard: Get all transactions
export const handleGetAllTransactions: RequestHandler = async (req, res) => {
  try {
    // Call SendWave-specific admin endpoint to get all transactions
    const transactionsResponse = await fetch(`${DJANGO_API_BASE}/sendwave/admin/transactions`);
    const data = await transactionsResponse.json();

    if (!transactionsResponse.ok) {
      const response: ApiResponse = {
        success: false,
        error: data.error || "Failed to get transactions",
      };
      return res.status(transactionsResponse.status).json(response);
    }

    res.json(data);
  } catch (error: any) {
    console.error("Error getting all transactions:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

// Admin dashboard: Update user details
export const handleGetUserById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const userResponse = await fetch(`${DJANGO_API_BASE}/sendwave/admin/user/${id}`);
    const data = await userResponse.json();

    if (!userResponse.ok) {
      const response: ApiResponse = {
        success: false,
        error: data.error || "Failed to get user",
      };
      return res.status(userResponse.status).json(response);
    }

    res.json(data);
  } catch (error: any) {
    console.error("Error getting user by ID:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

export const handleUpdateUser: RequestHandler = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updateResponse = await fetch(`${DJANGO_API_BASE}/sendwave/admin/user/${id}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    const data = await updateResponse.json();

    if (!updateResponse.ok) {
      const response: ApiResponse = {
        success: false,
        error: data.error || "Failed to update user",
      };
      return res.status(updateResponse.status).json(response);
    }

    res.json(data);
  } catch (error: any) {
    console.error("Error updating user:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

// Admin dashboard: Adjust user balance
export const handleAdjustUserBalance: RequestHandler = async (req, res) => {
  const { userId, amount, reason } = req.body;

  try {
    const adjustResponse = await fetch(`${DJANGO_API_BASE}/sendwave/admin/adjust-balance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        amount,
        reason,
      }),
    });

    const data = await adjustResponse.json();

    if (!adjustResponse.ok) {
      const response: ApiResponse = {
        success: false,
        error: data.error || "Failed to adjust balance",
      };
      return res.status(adjustResponse.status).json(response);
    }

    res.json(data);
  } catch (error: any) {
    console.error("Error adjusting user balance:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

// ==================== CHAT FEATURE ROUTES ====================

// Send chat message
export const handleSendMessage: RequestHandler = async (req, res) => {
  const { sender_email, receiver_email, message }: SendMessageRequest = req.body;

  try {
    const response = await fetch(`${DJANGO_API_BASE}/sendwave/chat/send/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender_email,
        receiver_email,
        message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const apiResponse: ApiResponse = {
        success: false,
        error: data.error || "Failed to send message",
      };
      return res.status(response.status).json(apiResponse);
    }

    const apiResponse: ApiResponse<ChatMessage> = {
      success: true,
      data: data.data,
      message: "Message sent successfully",
    };

    res.json(apiResponse);
  } catch (error: any) {
    console.error("Error sending message:", error);
    const apiResponse: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(apiResponse);
  }
};

// Mark messages as read
export const handleMarkMessagesRead: RequestHandler = async (req, res) => {
  const { email } = req.params;

  try {
    const response = await fetch(`${DJANGO_API_BASE}/sendwave/chat/mark-read/${email}/`, {
      method: "POST",
    });

    const data = await response.json();

    if (!response.ok) {
      const apiResponse: ApiResponse = {
        success: false,
        error: data.error || "Failed to mark messages as read",
      };
      return res.status(response.status).json(apiResponse);
    }

    const apiResponse: ApiResponse = {
      success: true,
      message: "Messages marked as read",
    };

    res.json(apiResponse);
  } catch (error: any) {
    console.error("Error marking messages as read:", error);
    const apiResponse: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(apiResponse);
  }
};

// Get chat history
export const handleGetChatHistory: RequestHandler = async (req, res) => {
  const { email } = req.params;

  try {
    const response = await fetch(`${DJANGO_API_BASE}/sendwave/chat/history/${email}/`);
    const data = await response.json();

    if (!response.ok) {
      const apiResponse: ApiResponse = {
        success: false,
        error: data.error || "Failed to get chat history",
      };
      return res.status(response.status).json(apiResponse);
    }

    const apiResponse: ApiResponse<ChatMessage[]> = {
      success: true,
      data: data.data,
    };

    res.json(apiResponse);
  } catch (error: any) {
    console.error("Error getting chat history:", error);
    const apiResponse: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(apiResponse);
  }
};

// Get unread message count
export const handleGetUnreadMessages: RequestHandler = async (req, res) => {
  const { email } = req.params;

  try {
    const response = await fetch(`${DJANGO_API_BASE}/sendwave/chat/unread/${email}/`);
    const data = await response.json();

    if (!response.ok) {
      const apiResponse: ApiResponse = {
        success: false,
        error: data.error || "Failed to get unread messages",
      };
      return res.status(response.status).json(apiResponse);
    }

    const apiResponse: ApiResponse<{ unread_count: number }> = {
      success: true,
      data: { unread_count: data.unread_count },
    };

    res.json(apiResponse);
  } catch (error: any) {
    console.error("Error getting unread messages:", error);
    const apiResponse: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(apiResponse);
  }
};

// Get chat status
export const handleGetChatStatus: RequestHandler = async (req, res) => {
  const { email } = req.params;

  try {
    const response = await fetch(`${DJANGO_API_BASE}/sendwave/chat/status/${email}/`);
    const data = await response.json();

    if (!response.ok) {
      const apiResponse: ApiResponse = {
        success: false,
        error: data.error || "Failed to get chat status",
      };
      return res.status(response.status).json(apiResponse);
    }

    const apiResponse: ApiResponse<{ chat_enabled: boolean }> = {
      success: true,
      data: { chat_enabled: data.chat_enabled },
    };

    res.json(apiResponse);
  } catch (error: any) {
    console.error("Error getting chat status:", error);
    const apiResponse: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(apiResponse);
  }
};

// Toggle chat feature (admin)
export const handleToggleChat: RequestHandler = async (req, res) => {
  const { userId } = req.params;

  try {
    const response = await fetch(`${DJANGO_API_BASE}/sendwave/admin/user/${userId}/toggle-chat`, {
      method: "POST",
    });

    const data = await response.json();

    if (!response.ok) {
      const apiResponse: ApiResponse = {
        success: false,
        error: data.error || "Failed to toggle chat",
      };
      return res.status(response.status).json(apiResponse);
    }

    const apiResponse: ApiResponse<{ chat_enabled: boolean }> = {
      success: true,
      data: { chat_enabled: data.chat_enabled },
      message: data.message,
    };

    res.json(apiResponse);
  } catch (error: any) {
    console.error("Error toggling chat:", error);
    const apiResponse: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(apiResponse);
  }
};

