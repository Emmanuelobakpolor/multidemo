import { RequestHandler } from "express";
import { 
  User, 
  Transaction, 
  SendMoneyRequest, 
  FundWalletRequest, 
  CreateUserRequest, 
  LoginRequest, 
  CreateAdminRequest,
  ApiResponse,
  ChatMessage,
  SendMessageRequest,
  ChatStatusResponse,
  ToggleChatResponse
} from "@shared/api";

// Django API base URL
const DJANGO_API_BASE = "https://multi-bakend.onrender.com/api";

// Create admin user (register)
export const handleCreateAdmin: RequestHandler = async (req, res) => {
  const { email, password, fullName, adminCode }: CreateAdminRequest = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const userResponse = await fetch(`${DJANGO_API_BASE}/quickcash/register-admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: normalizedEmail,
        password,
        fullName,
        adminCode,
      }),
    });

    const data = await userResponse.json();

    if (!userResponse.ok) {
      const response: ApiResponse = {
        success: false,
        error: data.error || "Failed to create admin user",
      };
      return res.status(userResponse.status).json(response);
    }

    // Return admin user data in the format expected by the client
    const userData: any = {
      id: data.data.id.toString(),
      email: data.data.email,
      fullName: data.data.fullName,
      balance: data.data.balance,
      isStaff: data.data.is_staff,
      isSuperuser: data.data.is_superuser,
      createdAt: data.data.createdAt,
      updatedAt: data.data.updatedAt,
    };

    const response: ApiResponse<any> = {
      success: true,
      data: userData,
      message: "Admin user created successfully",
    };

    res.json(response);
  } catch (error: any) {
    console.error("Error creating admin user:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

// Create user (register)
export const handleCreateUser: RequestHandler = async (req, res) => {
  const { email, password, fullName, mobileNumber }: CreateUserRequest = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    // Call QuickCash-specific register endpoint which properly handles password hashing and platform association
    const userResponse = await fetch(`${DJANGO_API_BASE}/quickcash/register`, {
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
    // Find user in Django
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

    // Get user account for QuickCash platform
    const accountsResponse = await fetch(
      `${DJANGO_API_BASE}/accounts/?user=${user.id}&platform=5`
    );
    const accounts = await accountsResponse.json();

    if (accounts.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "QuickCash account not found",
      };
      return res.status(404).json(response);
    }

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

    // Get user account for QuickCash platform
    const accountsResponse = await fetch(
      `${DJANGO_API_BASE}/accounts/?user=${user.id}&platform=5`
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

// Search for QuickCash users (by email, username, or mobile number)
export const handleSearchUsers: RequestHandler = async (req, res) => {
  const { query } = req.query;

  try {
    // Search for users on QuickCash platform (Platform ID 5)
    const usersResponse = await fetch(
      `${DJANGO_API_BASE}/quickcash/search?query=${query}`
    );
    const data = await usersResponse.json();

    if (data.success) {
      const response: ApiResponse<any[]> = {
        success: true,
        data: data.data,
      };
      res.json(response);
    } else {
      const response: ApiResponse = {
        success: false,
        error: data.error || "Search failed",
      };
      res.status(400).json(response);
    }
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
  const { recipientEmail, amount, message }: SendMoneyRequest = req.body;
  const { senderEmail } = req.params;

  try {
    // Find sender
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

    if (sender.id === recipient.id) {
      const response: ApiResponse = {
        success: false,
        error: "Cannot send money to yourself",
      };
      return res.status(400).json(response);
    }

    // Get sender account (QuickCash platform)
    const senderAccountsResponse = await fetch(
      `${DJANGO_API_BASE}/accounts/?user=${sender.id}&platform=5`
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

    // Get recipient account (QuickCash platform)
    const recipientAccountsResponse = await fetch(
      `${DJANGO_API_BASE}/accounts/?user=${recipient.id}&platform=5`
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
      `${DJANGO_API_BASE}/accounts/?user=${user.id}&platform=5`
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

// Chat functionality

// Get chat status (enabled/disabled)
export const handleGetChatStatus: RequestHandler = async (req, res) => {
  const { email } = req.params;

  try {
    const response = await fetch(`${DJANGO_API_BASE}/quickcash/chat/status/${email}/`);
    const data = await response.json();
    
    res.json(data);
  } catch (error: any) {
    console.error("Error getting chat status:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

// Get unread messages count
export const handleGetUnreadCount: RequestHandler = async (req, res) => {
  const { email } = req.params;

  try {
    const response = await fetch(`${DJANGO_API_BASE}/quickcash/chat/unread/${email}/`);
    const data = await response.json();
    
    res.json(data);
  } catch (error: any) {
    console.error("Error getting unread count:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

// Get chat history
export const handleGetChatHistory: RequestHandler = async (req, res) => {
  const { email } = req.params;

  try {
    const response = await fetch(`${DJANGO_API_BASE}/quickcash/chat/history/${email}/`);
    const data = await response.json();
    
    res.json(data);
  } catch (error: any) {
    console.error("Error getting chat history:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

// Send message
export const handleSendMessage: RequestHandler = async (req, res) => {
  const request: SendMessageRequest = req.body;

  try {
    const response = await fetch(`${DJANGO_API_BASE}/quickcash/chat/send/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error("Error sending message:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

// Mark messages as read
export const handleMarkMessagesAsRead: RequestHandler = async (req, res) => {
  const { email } = req.params;

  try {
    const response = await fetch(`${DJANGO_API_BASE}/quickcash/chat/mark-read/${email}/`, {
      method: "POST",
    });
    const data = await response.json();
    
    res.json(data);
  } catch (error: any) {
    console.error("Error marking messages as read:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

// Toggle chat enabled/disabled for a user (admin)
export const handleToggleChat: RequestHandler = async (req, res) => {
  const { userId } = req.params;

  try {
    const response = await fetch(`${DJANGO_API_BASE}/quickcash/admin/user/${userId}/toggle-chat`, {
      method: "POST",
    });

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error("Error toggling chat:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

// Admin functionality

// Get all QuickCash users (admin)
export const handleGetAllUsers: RequestHandler = async (req, res) => {
  try {
    const response = await fetch(`${DJANGO_API_BASE}/quickcash/admin/users`);
    const data = await response.json();
    
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

// Fund user wallet (admin)
export const handleFundWallet: RequestHandler = async (req, res) => {
  const { userId, amount, reason }: FundWalletRequest = req.body;

  try {
    const response = await fetch(`${DJANGO_API_BASE}/quickcash/admin/fund-wallet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, amount, reason }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error("Error funding wallet:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

// Edit user account (admin)
export const handleEditUser: RequestHandler = async (req, res) => {
  const { userId, fullName, email, mobileNumber } = req.body;

  try {
    const response = await fetch(`${DJANGO_API_BASE}/quickcash/admin/edit-user`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, fullName, email, mobileNumber }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    console.error("Error editing user:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

// Get all transactions (admin)
export const handleGetAllTransactions: RequestHandler = async (req, res) => {
  try {
    const response = await fetch(`${DJANGO_API_BASE}/quickcash/admin/transactions`);
    const data = await response.json();
    
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
