import { RequestHandler } from "express";
import { User, Transaction, SendMoneyRequest, FundWalletRequest, CreateUserRequest, LoginRequest, ApiResponse, ChatMessage, SendMessageRequest, ChatStatusResponse, ToggleChatResponse } from "@shared/api";

// Django API base URL
const DJANGO_API_BASE = "http://localhost:8000/api";

// Create user (register)
export const handleCreateUser: RequestHandler = async (req, res) => {
  const { email, password, fullName }: CreateUserRequest = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    // Call PayFlow-specific register endpoint which properly handles password hashing and platform association
    const userResponse = await fetch(`${DJANGO_API_BASE}/payflow/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: normalizedEmail,
        password,
        fullName,
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
    const userData: User = {
      id: data.data.id.toString(),
      email: data.data.email,
      fullName: data.data.fullName,
      balance: data.data.balance,
      createdAt: data.data.createdAt,
      updatedAt: data.data.updatedAt,
    };

    const response: ApiResponse<User> = {
      success: true,
      data: userData,
      message: "User created successfully",
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

  try {
    // Find user in Django - use trailing slash
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

    // Get user account - use trailing slash
    const accountsResponse = await fetch(
      `${DJANGO_API_BASE}/accounts/?user=${user.id}`
    );
    const accounts = await accountsResponse.json();

    // Return user data in the format expected by the client
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
      message: "Login successful",
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
      `${DJANGO_API_BASE}/accounts/?user=${user.id}`
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

// Send money
export const handleSendMoney: RequestHandler = async (req, res) => {
  const { recipientEmail, amount, message }: SendMoneyRequest = req.body;
  const { senderEmail } = req.params;

  try {
    // Find sender - use trailing slash
    const senderResponse = await fetch(
      `${DJANGO_API_BASE}/users/?email=${senderEmail}`
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

    // Find recipient - use trailing slash
    const recipientResponse = await fetch(
      `${DJANGO_API_BASE}/users/?email=${recipientEmail}`
    );
    const recipients = await recipientResponse.json();

    if (recipients.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "Recipient not found",
      };
      return res.status(404).json(response);
    }
    const recipient = recipients[0];

    if (sender.id === recipient.id) {
      const response: ApiResponse = {
        success: false,
        error: "Cannot send money to yourself",
      };
      return res.status(400).json(response);
    }

    // Get sender account - use trailing slash
    const senderAccountsResponse = await fetch(
      `${DJANGO_API_BASE}/accounts/?user=${sender.id}`
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
      `${DJANGO_API_BASE}/accounts/?user=${recipient.id}`
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
        amount: amount,
        transaction_type: "sent",
        status: "completed",
        reason: message,
        recipient: recipientEmail,
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
        amount: amount,
        transaction_type: "received",
        status: "completed",
        reason: message,
        recipient: senderEmail,
      }),
    });

    const transactionData: Transaction = {
      id: createdTransaction.id.toString(),
      senderId: sender.id.toString(),
      recipient: recipientEmail,
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

// Request money
export const handleRequestMoney: RequestHandler = async (req, res) => {
  const { recipientEmail, amount, message }: SendMoneyRequest = req.body;
  const { requesterEmail } = req.params;

  try {
    // Find requester
    const requesterResponse = await fetch(
      `${DJANGO_API_BASE}/users/?email=${requesterEmail}`
    );
    const requesters = await requesterResponse.json();

    if (requesters.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "Requester not found",
      };
      return res.status(404).json(response);
    }
    const requester = requesters[0];

    // Find recipient
    const recipientResponse = await fetch(
      `${DJANGO_API_BASE}/users/?email=${recipientEmail}`
    );
    const recipients = await recipientResponse.json();

    if (recipients.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "Recipient not found",
      };
      return res.status(404).json(response);
    }
    const recipient = recipients[0];

    if (requester.id === recipient.id) {
      const response: ApiResponse = {
        success: false,
        error: "Cannot request money from yourself",
      };
      return res.status(400).json(response);
    }

    // Get requester account
    const requesterAccountsResponse = await fetch(
      `${DJANGO_API_BASE}/accounts/?user=${requester.id}`
    );
    const requesterAccounts = await requesterAccountsResponse.json();

    if (requesterAccounts.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "Requester account not found",
      };
      return res.status(404).json(response);
    }
    const requesterAccount = requesterAccounts[0];

    // Get recipient account
    const recipientAccountsResponse = await fetch(
      `${DJANGO_API_BASE}/accounts/?user=${recipient.id}`
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

    // Create request transaction for both users
    await fetch(`${DJANGO_API_BASE}/transactions/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account: requesterAccount.id,
        amount: amount,
        transaction_type: "requested",
        status: "pending",
        reason: message,
        recipient: recipientEmail,
      }),
    });

    await fetch(`${DJANGO_API_BASE}/transactions/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account: recipientAccount.id,
        amount: amount,
        transaction_type: "request_received",
        status: "pending",
        reason: message,
        recipient: requesterEmail,
      }),
    });

    const response: ApiResponse = {
      success: true,
      message: "Money request sent successfully",
    };

    res.json(response);
  } catch (error: any) {
    console.error("Error requesting money:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

// Get user transactions
export const handleGetTransactions: RequestHandler = async (req, res) => {
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

    const accountsResponse = await fetch(
      `${DJANGO_API_BASE}/accounts/?user=${user.id}`
    );
    const accounts = await accountsResponse.json();

    if (accounts.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "User account not found",
      };
      return res.status(404).json(response);
    }

    const transactionsResponse = await fetch(
      `${DJANGO_API_BASE}/transactions/?account=${accounts[0].id}`
    );
    const transactionsData = await transactionsResponse.json();

    // Convert Django transactions to client format
    const transactions: Transaction[] = transactionsData.map((t: any) => ({
      id: t.id.toString(),
      senderId: t.account.toString(),
      recipient: t.recipient,
      amount: parseFloat(t.amount),
      reason: t.reason,
      transaction_type: t.transaction_type,
      status: t.status,
      date: t.date,
    }));

    const response: ApiResponse<Transaction[]> = {
      success: true,
      data: transactions,
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

// Fund user wallet (admin)
export const handleFundWallet: RequestHandler = async (req, res) => {
  const { userId, amount, reason }: FundWalletRequest = req.body;

  try {
    const accountsResponse = await fetch(
      `${DJANGO_API_BASE}/accounts/?user=${userId}`
    );
    const accounts = await accountsResponse.json();

    if (accounts.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "User account not found",
      };
      return res.status(404).json(response);
    }
    const account = accounts[0];

    const newBalance = parseFloat(account.balance) + amount;
    await fetch(`${DJANGO_API_BASE}/accounts/${account.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...account,
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
        account: account.id,
        amount: amount,
        transaction_type: "admin_adjusted",
        status: "completed",
        reason: reason,
        recipient: "admin",
      }),
    });

    const createdTransaction = await transactionResponse.json();

    const transactionData: Transaction = {
      id: createdTransaction.id.toString(),
      senderId: "admin",
      recipient: userId,
      amount: amount,
      reason: reason,
      transaction_type: "admin_adjusted",
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

// Get all users (admin)
export const handleGetAllUsers: RequestHandler = async (req, res) => {
  try {
    const usersResponse = await fetch(`${DJANGO_API_BASE}/users/`);
    const usersData = await usersResponse.json();

    const users: User[] = [];

    for (const user of usersData) {
      const accountsResponse = await fetch(
        `${DJANGO_API_BASE}/accounts/?user=${user.id}`
      );
      const accounts = await accountsResponse.json();

      users.push({
        id: user.id.toString(),
        email: user.email,
        fullName: `${user.first_name} ${user.last_name}`,
        balance: accounts.length > 0 ? parseFloat(accounts[0].balance) : 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    const response: ApiResponse<User[]> = {
      success: true,
      data: users,
    };
    res.json(response);
  } catch (error: any) {
    console.error("Error getting all users:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

// Get user by ID (admin)
export const handleGetUserById: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const userResponse = await fetch(`${DJANGO_API_BASE}/users/${id}/`);
    
    if (!userResponse.ok) {
      const response: ApiResponse = {
        success: false,
        error: "User not found",
      };
      return res.status(404).json(response);
    }

    const userData = await userResponse.json();

    const accountsResponse = await fetch(
      `${DJANGO_API_BASE}/accounts/?user=${id}`
    );
    const accounts = await accountsResponse.json();

    const user: User = {
      id: userData.id.toString(),
      email: userData.email,
      fullName: `${userData.first_name} ${userData.last_name}`,
      balance: accounts.length > 0 ? parseFloat(accounts[0].balance) : 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const response: ApiResponse<User> = {
      success: true,
      data: user,
    };
    res.json(response);
  } catch (error: any) {
    console.error("Error getting user by ID:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

// Send chat message
export const handleSendMessage: RequestHandler = async (req, res) => {
  const { sender_email, receiver_email, message }: SendMessageRequest = req.body;

  try {
    const response = await fetch(`${DJANGO_API_BASE}/payflow/chat/send/`, {
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
      message: data.message,
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
    const response = await fetch(`${DJANGO_API_BASE}/payflow/chat/mark-read/${email}/`, {
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
      message: data.message,
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
    const response = await fetch(`${DJANGO_API_BASE}/payflow/chat/history/${email}/`);
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

// Get unread messages count
export const handleGetUnreadMessagesCount: RequestHandler = async (req, res) => {
  const { email } = req.params;

  try {
    const response = await fetch(`${DJANGO_API_BASE}/payflow/chat/unread/${email}/`);
    const data = await response.json();

    if (!response.ok) {
      const apiResponse: ApiResponse = {
        success: false,
        error: data.error || "Failed to get unread messages count",
      };
      return res.status(response.status).json(apiResponse);
    }

    const apiResponse: ApiResponse<{ unread_count: number }> = {
      success: true,
      data: { unread_count: data.unread_count },
    };

    res.json(apiResponse);
  } catch (error: any) {
    console.error("Error getting unread messages count:", error);
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
    const response = await fetch(`${DJANGO_API_BASE}/payflow/chat/status/${email}/`);
    const data = await response.json();

    if (!response.ok) {
      const apiResponse: ApiResponse = {
        success: false,
        error: data.error || "Failed to get chat status",
      };
      return res.status(response.status).json(apiResponse);
    }

    const apiResponse: ApiResponse<ChatStatusResponse> = {
      success: true,
      data: data,
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
    const response = await fetch(`${DJANGO_API_BASE}/payflow/admin/user/${userId}/toggle-chat`, {
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

    const apiResponse: ApiResponse<ToggleChatResponse> = {
      success: true,
      data: data,
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

