import { RequestHandler } from "express";
import { 
  User, 
  Transaction, 
  SendMoneyRequest, 
  FundWalletRequest, 
  CreateUserRequest, 
  LoginRequest, 
  ApiResponse,
  SendMessageRequest,
  ChatMessage
} from "@shared/api";

// Django API base URL
const DJANGO_API_BASE = "https://multi-bakend.onrender.com/api";

// Create user (register)
export const handleCreateUser: RequestHandler = async (req, res) => {
  const { email, password, fullName }: CreateUserRequest = req.body;

  try {
    // First, check if user exists in Django
    const existingUserResponse = await fetch(`${DJANGO_API_BASE}/users/?email=${email}`);
    const existingUsers = await existingUserResponse.json();
    
    if (existingUsers.length > 0) {
      const response: ApiResponse = {
        success: false,
        error: "User with this email already exists",
      };
      return res.status(400).json(response);
    }

    // Create user in Django
    const userResponse = await fetch(`${DJANGO_API_BASE}/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: email,
        email,
        password,
        first_name: fullName.split(" ")[0],
        last_name: fullName.split(" ").slice(1).join(" "),
      }),
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.json();
      const response: ApiResponse = {
        success: false,
        error: errorData?.detail || "Failed to create user",
      };
      return res.status(userResponse.status).json(response);
    }

    const createdUser = await userResponse.json();

    // Get or create CryptoPort platform
    const platformResponse = await fetch(`${DJANGO_API_BASE}/platforms/?name=CryptoPort`);
    let platformData = await platformResponse.json();
    let platformId: number;

    if (platformData.length === 0) {
      // Create CryptoPort platform if it doesn't exist
      const createPlatformResponse = await fetch(`${DJANGO_API_BASE}/platforms/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: "CryptoPort" }),
      });
      const newPlatform = await createPlatformResponse.json();
      platformId = newPlatform.id;
    } else {
      platformId = platformData[0].id;
    }

    // Create user account with default fiat balance
    const accountResponse = await fetch(`${DJANGO_API_BASE}/accounts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: createdUser.id,
        platform: platformId,
        balance: 1000.00,
        status: "active",
      }),
    });

    if (!accountResponse.ok) {
      const errorData = await accountResponse.json();
      const response: ApiResponse = {
        success: false,
        error: errorData?.detail || "Failed to create user account",
      };
      return res.status(accountResponse.status).json(response);
    }

    const createdAccount = await accountResponse.json();

    // Create crypto currencies if they don't exist
    const supportedCryptos = [
      { symbol: "BTC", name: "Bitcoin" },
      { symbol: "ETH", name: "Ethereum" },
      { symbol: "BNB", name: "Binance Coin" },
      { symbol: "SOL", name: "Solana" },
      { symbol: "ADA", name: "Cardano" },
      { symbol: "DOT", name: "Polkadot" },
      { symbol: "LINK", name: "Chainlink" },
      { symbol: "UNI", name: "Uniswap" },
    ];

    for (const crypto of supportedCryptos) {
      const existingCryptoResponse = await fetch(`${DJANGO_API_BASE}/crypto-currencies/?symbol=${crypto.symbol}`);
      const existingCryptos = await existingCryptoResponse.json();

      if (existingCryptos.length === 0) {
        await fetch(`${DJANGO_API_BASE}/crypto-currencies/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(crypto),
        });
      }
    }

     // Create crypto wallets for each cryptocurrency
     const cryptoCurrenciesResponse = await fetch(`${DJANGO_API_BASE}/crypto-currencies/`);
     const cryptoCurrencies = await cryptoCurrenciesResponse.json();

     for (const crypto of cryptoCurrencies) {
       // Generate realistic-looking crypto addresses
       let address: string;
       
       if (crypto.symbol === 'BTC') {
         // Bitcoin address format: 1 or 3 followed by base58 characters
         address = '1' + Array.from({length: 33}, () => '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'[Math.floor(Math.random() * 58)]).join('');
       } else if (crypto.symbol === 'ETH' || crypto.symbol === 'BNB' || crypto.symbol === 'LINK' || crypto.symbol === 'UNI') {
         // Ethereum/BSC address format: 0x followed by 40 hex characters
         address = '0x' + Array.from({length: 40}, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
       } else if (crypto.symbol === 'SOL') {
         // Solana address format: base58 32-44 characters
         address = Array.from({length: 32}, () => '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'[Math.floor(Math.random() * 58)]).join('');
       } else if (crypto.symbol === 'ADA') {
         // Cardano address format: bech32 with addr prefix
         address = 'addr1' + Array.from({length: 58}, () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]).join('');
       } else if (crypto.symbol === 'DOT') {
         // Polkadot address format: base58 48 characters
         address = Array.from({length: 48}, () => '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'[Math.floor(Math.random() * 58)]).join('');
       } else {
         // Default format for other cryptos
         address = `${crypto.symbol.toLowerCase()}-${createdUser.id}-${createdAccount.id}-${crypto.id}`;
       }
       
       await fetch(`${DJANGO_API_BASE}/crypto-wallets/`, {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({
           account: createdAccount.id,
           crypto_currency: crypto.id,
           balance: 0,
           deposit_address: address,
         }),
       });
     }

    // Return user data in the format expected by the client
    const userData: any = {
      id: createdUser.id.toString(),
      email: createdUser.email,
      fullName: `${createdUser.first_name} ${createdUser.last_name}`,
      fiatBalance: 1000.00,
      cryptoBalances: supportedCryptos.reduce((acc, crypto) => {
        acc[crypto.symbol] = 0;
        return acc;
      }, {} as any),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const response: ApiResponse<any> = {
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

    // Get user account
    const accountsResponse = await fetch(
      `${DJANGO_API_BASE}/accounts/?user=${user.id}&platform__name=CryptoPort`
    );
    const accounts = await accountsResponse.json();

    if (accounts.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "CryptoPort account not found",
      };
      return res.status(404).json(response);
    }

    // Get crypto wallets
    const cryptoWalletsResponse = await fetch(
      `${DJANGO_API_BASE}/crypto-wallets/?account=${accounts[0].id}`
    );
    const cryptoWallets = await cryptoWalletsResponse.json();

    const cryptoBalances = cryptoWallets.reduce((acc: any, wallet: any) => {
      acc[wallet.crypto_currency.symbol] = parseFloat(wallet.balance);
      return acc;
    }, {});

    // Return user data in the format expected by the client
    const userData: any = {
      id: user.id.toString(),
      email: user.email,
      fullName: `${user.first_name} ${user.last_name}`,
      fiatBalance: parseFloat(accounts[0].balance),
      cryptoBalances,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const response: ApiResponse<any> = {
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
      `${DJANGO_API_BASE}/accounts/?user=${user.id}&platform__name=CryptoPort`
    );
    const accounts = await accountsResponse.json();

    if (accounts.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "CryptoPort account not found",
      };
      return res.status(404).json(response);
    }

    // Get crypto wallets
    const cryptoWalletsResponse = await fetch(
      `${DJANGO_API_BASE}/crypto-wallets/?account=${accounts[0].id}`
    );
    const cryptoWallets = await cryptoWalletsResponse.json();

    const cryptoBalances = cryptoWallets.reduce((acc: any, wallet: any) => {
      acc[wallet.crypto_currency.symbol] = parseFloat(wallet.balance);
      return acc;
    }, {});

    const userData: any = {
      id: user.id.toString(),
      email: user.email,
      fullName: `${user.first_name} ${user.last_name}`,
      fiatBalance: parseFloat(accounts[0].balance),
      cryptoBalances,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const response: ApiResponse<any> = {
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

// Send crypto
export const handleSendCrypto: RequestHandler = async (req, res) => {
  const { recipientEmail, cryptoSymbol, amount } = req.body;
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
        error: "Cannot send crypto to yourself",
      };
      return res.status(400).json(response);
    }

    // Get sender account
    const senderAccountsResponse = await fetch(
      `${DJANGO_API_BASE}/accounts/?user=${sender.id}&platform__name=CryptoPort`
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

    // Get recipient account
    const recipientAccountsResponse = await fetch(
      `${DJANGO_API_BASE}/accounts/?user=${recipient.id}&platform__name=CryptoPort`
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

    // Get sender wallet
    const senderWalletsResponse = await fetch(
      `${DJANGO_API_BASE}/crypto-wallets/?account=${senderAccount.id}&crypto_currency__symbol=${cryptoSymbol}`
    );
    const senderWallets = await senderWalletsResponse.json();

    if (senderWallets.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "Sender wallet not found",
      };
      return res.status(404).json(response);
    }
    const senderWallet = senderWallets[0];

    if (parseFloat(senderWallet.balance) < amount) {
      const response: ApiResponse = {
        success: false,
        error: "Insufficient balance",
      };
      return res.status(400).json(response);
    }

    // Get recipient wallet
    const recipientWalletsResponse = await fetch(
      `${DJANGO_API_BASE}/crypto-wallets/?account=${recipientAccount.id}&crypto_currency__symbol=${cryptoSymbol}`
    );
    const recipientWallets = await recipientWalletsResponse.json();

    if (recipientWallets.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "Recipient wallet not found",
      };
      return res.status(404).json(response);
    }
    const recipientWallet = recipientWallets[0];

    // Update balances
    const newSenderBalance = parseFloat(senderWallet.balance) - amount;
    await fetch(`${DJANGO_API_BASE}/crypto-wallets/${senderWallet.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...senderWallet,
        balance: newSenderBalance,
      }),
    });

    const newRecipientBalance = parseFloat(recipientWallet.balance) + amount;
    await fetch(`${DJANGO_API_BASE}/crypto-wallets/${recipientWallet.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...recipientWallet,
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
        crypto_wallet: senderWallet.id,
        amount: amount,
        transaction_type: "crypto_sent",
        status: "completed",
        reason: `Sent ${cryptoSymbol} to ${recipientEmail}`,
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
        crypto_wallet: recipientWallet.id,
        amount: amount,
        transaction_type: "crypto_received",
        status: "completed",
        reason: `Received ${cryptoSymbol} from ${senderEmail}`,
        recipient: senderEmail,
      }),
    });

    const transactionData: any = {
      id: createdTransaction.id.toString(),
      senderId: sender.id.toString(),
      recipient: recipientEmail,
      amount: amount,
      reason: `Sent ${cryptoSymbol} to ${recipientEmail}`,
      transaction_type: "crypto_sent",
      status: "completed",
      date: new Date().toISOString(),
    };

    const response: ApiResponse<any> = {
      success: true,
      data: transactionData,
      message: `${amount} ${cryptoSymbol} sent successfully`,
    };

    res.json(response);
  } catch (error: any) {
    console.error("Error sending crypto:", error);
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
    // Find user
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
      `${DJANGO_API_BASE}/accounts/?user=${user.id}&platform__name=CryptoPort`
    );
    const accounts = await accountsResponse.json();

    if (accounts.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "CryptoPort account not found",
      };
      return res.status(404).json(response);
    }
    const account = accounts[0];

    // Get transactions
    const transactionsResponse = await fetch(
      `${DJANGO_API_BASE}/transactions/?account=${account.id}`
    );
    const transactions = await transactionsResponse.json();

    // Transform data
    const transactionData = transactions.map((t: any) => ({
      id: t.id.toString(),
      cryptoSymbol: t.crypto_wallet?.crypto_currency?.symbol || "FIAT",
      amount: parseFloat(t.amount),
      transaction_type: t.transaction_type,
      status: t.status,
      reason: t.reason,
      recipient: t.recipient,
      date: t.date,
    }));

    const response: ApiResponse<any[]> = {
      success: true,
      data: transactionData,
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

// Get user crypto wallets
export const handleGetCryptoWallets: RequestHandler = async (req, res) => {
  const { email } = req.params;

  try {
    // Find user
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
      `${DJANGO_API_BASE}/accounts/?user=${user.id}&platform__name=CryptoPort`
    );
    const accounts = await accountsResponse.json();

    if (accounts.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "CryptoPort account not found",
      };
      return res.status(404).json(response);
    }
    const account = accounts[0];

    // Get crypto wallets
    const cryptoWalletsResponse = await fetch(
      `${DJANGO_API_BASE}/crypto-wallets/?account=${account.id}`
    );
    const cryptoWallets = await cryptoWalletsResponse.json();

    const walletData = cryptoWallets.map((wallet: any) => ({
      id: wallet.id.toString(),
      cryptoSymbol: wallet.crypto_currency.symbol,
      cryptoName: wallet.crypto_currency.name,
      balance: parseFloat(wallet.balance),
      depositAddress: wallet.deposit_address,
    }));

    const response: ApiResponse<any[]> = {
      success: true,
      data: walletData,
    };

    res.json(response);
  } catch (error: any) {
    console.error("Error getting crypto wallets:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

// Deposit crypto
export const handleDepositCrypto: RequestHandler = async (req, res) => {
  const { cryptoSymbol, amount } = req.body;
  const { email } = req.params;

  try {
    // Find user
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
      `${DJANGO_API_BASE}/accounts/?user=${user.id}&platform__name=CryptoPort`
    );
    const accounts = await accountsResponse.json();

    if (accounts.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "CryptoPort account not found",
      };
      return res.status(404).json(response);
    }
    const account = accounts[0];

    // Get crypto wallet
    const cryptoWalletsResponse = await fetch(
      `${DJANGO_API_BASE}/crypto-wallets/?account=${account.id}&crypto_currency__symbol=${cryptoSymbol}`
    );
    const cryptoWallets = await cryptoWalletsResponse.json();

    if (cryptoWallets.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "Crypto wallet not found",
      };
      return res.status(404).json(response);
    }
    const cryptoWallet = cryptoWallets[0];

    // Update balance
    const newBalance = parseFloat(cryptoWallet.balance) + amount;
    await fetch(`${DJANGO_API_BASE}/crypto-wallets/${cryptoWallet.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...cryptoWallet,
        balance: newBalance,
      }),
    });

    // Create transaction
    await fetch(`${DJANGO_API_BASE}/transactions/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account: account.id,
        crypto_wallet: cryptoWallet.id,
        amount: amount,
        transaction_type: "crypto_deposit",
        status: "completed",
        reason: `Deposited ${amount} ${cryptoSymbol}`,
        recipient: "external_wallet",
      }),
    });

    const response: ApiResponse = {
      success: true,
      message: `${amount} ${cryptoSymbol} deposited successfully`,
    };

    res.json(response);
  } catch (error: any) {
    console.error("Error depositing crypto:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

// Withdraw crypto
export const handleWithdrawCrypto: RequestHandler = async (req, res) => {
  const { cryptoSymbol, amount, withdrawalAddress } = req.body;
  const { email } = req.params;

  try {
    // Find user
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
      `${DJANGO_API_BASE}/accounts/?user=${user.id}&platform__name=CryptoPort`
    );
    const accounts = await accountsResponse.json();

    if (accounts.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "CryptoPort account not found",
      };
      return res.status(404).json(response);
    }
    const account = accounts[0];

    // Get crypto wallet
    const cryptoWalletsResponse = await fetch(
      `${DJANGO_API_BASE}/crypto-wallets/?account=${account.id}&crypto_currency__symbol=${cryptoSymbol}`
    );
    const cryptoWallets = await cryptoWalletsResponse.json();

    if (cryptoWallets.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "Crypto wallet not found",
      };
      return res.status(404).json(response);
    }
    const cryptoWallet = cryptoWallets[0];

    // Check balance including network fee
    const networkFee = 0.001;
    const totalDeduction = amount + networkFee;

    if (parseFloat(cryptoWallet.balance) < totalDeduction) {
      const response: ApiResponse = {
        success: false,
        error: "Insufficient balance including network fee",
      };
      return res.status(400).json(response);
    }

    // Update balance
    const newBalance = parseFloat(cryptoWallet.balance) - totalDeduction;
    await fetch(`${DJANGO_API_BASE}/crypto-wallets/${cryptoWallet.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...cryptoWallet,
        balance: newBalance,
      }),
    });

    // Create transaction
    await fetch(`${DJANGO_API_BASE}/transactions/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account: account.id,
        crypto_wallet: cryptoWallet.id,
        amount: amount,
        transaction_type: "crypto_withdrawal",
        status: "completed",
        reason: `Withdrew ${amount} ${cryptoSymbol} to ${withdrawalAddress}`,
        recipient: withdrawalAddress,
      }),
    });

    const response: ApiResponse = {
      success: true,
      message: `${amount} ${cryptoSymbol} withdrawn successfully`,
    };

    res.json(response);
  } catch (error: any) {
    console.error("Error withdrawing crypto:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

// Admin functions

// Get all CryptoPort users
export const handleGetAllUsers: RequestHandler = async (req, res) => {
  try {
    const usersResponse = await fetch(`${DJANGO_API_BASE}/cryptoport/admin/users`);
    const usersData = await usersResponse.json();

    if (!usersResponse.ok) {
      const response: ApiResponse = {
        success: false,
        error: usersData.error || "Failed to fetch CryptoPort users",
      };
      return res.status(usersResponse.status).json(response);
    }

    res.json(usersData);
  } catch (error: any) {
    console.error("Error getting all users:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

// Fund user wallet
export const handleFundWallet: RequestHandler = async (req, res) => {
  const { userId, cryptoSymbol, amount, reason } = req.body;

  try {
    // Find user
    const userResponse = await fetch(`${DJANGO_API_BASE}/users/${userId}/`);
    if (!userResponse.ok) {
      const response: ApiResponse = {
        success: false,
        error: "User not found",
      };
      return res.status(404).json(response);
    }
    const user = await userResponse.json();

    // Get user account
    const accountsResponse = await fetch(
      `${DJANGO_API_BASE}/accounts/?user=${userId}&platform__name=CryptoPort`
    );
    const accounts = await accountsResponse.json();

    if (accounts.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "CryptoPort account not found",
      };
      return res.status(404).json(response);
    }
    const account = accounts[0];

    // Get crypto wallet
    const cryptoWalletsResponse = await fetch(
      `${DJANGO_API_BASE}/crypto-wallets/?account=${account.id}&crypto_currency__symbol=${cryptoSymbol}`
    );
    const cryptoWallets = await cryptoWalletsResponse.json();

    if (cryptoWallets.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "Crypto wallet not found",
      };
      return res.status(404).json(response);
    }
    const cryptoWallet = cryptoWallets[0];

    // Update balance
    const newBalance = parseFloat(cryptoWallet.balance) + amount;
    await fetch(`${DJANGO_API_BASE}/crypto-wallets/${cryptoWallet.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...cryptoWallet,
        balance: newBalance,
      }),
    });

    // Create transaction
    await fetch(`${DJANGO_API_BASE}/transactions/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account: account.id,
        crypto_wallet: cryptoWallet.id,
        amount: amount,
        transaction_type: "admin_adjusted",
        status: "completed",
        reason: reason || `Admin adjusted ${cryptoSymbol} balance`,
        recipient: "admin",
      }),
    });

    const response: ApiResponse = {
      success: true,
      message: `${amount} ${cryptoSymbol} added to wallet successfully`,
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

// Delete user
export const handleDeleteUser: RequestHandler = async (req, res) => {
  const { id } = req.params;

  try {
    // Find user
    const userResponse = await fetch(`${DJANGO_API_BASE}/users/${id}/`);
    if (!userResponse.ok) {
      const response: ApiResponse = {
        success: false,
        error: "User not found",
      };
      return res.status(404).json(response);
    }

    // Get user account
    const accountsResponse = await fetch(
      `${DJANGO_API_BASE}/accounts/?user=${id}&platform__name=CryptoPort`
    );
    const accounts = await accountsResponse.json();

    if (accounts.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "CryptoPort account not found",
      };
      return res.status(404).json(response);
    }
    const account = accounts[0];

    // Delete crypto wallets
    const cryptoWalletsResponse = await fetch(
      `${DJANGO_API_BASE}/crypto-wallets/?account=${account.id}`
    );
    const cryptoWallets = await cryptoWalletsResponse.json();
    
    for (const wallet of cryptoWallets) {
      await fetch(`${DJANGO_API_BASE}/crypto-wallets/${wallet.id}/`, {
        method: "DELETE",
      });
    }

    // Delete user account
    await fetch(`${DJANGO_API_BASE}/accounts/${account.id}/`, {
      method: "DELETE",
    });

    // Delete user
    await fetch(`${DJANGO_API_BASE}/users/${id}/`, {
      method: "DELETE",
    });

    const response: ApiResponse = {
      success: true,
      message: "User deleted successfully",
    };

    res.json(response);
  } catch (error: any) {
    console.error("Error deleting user:", error);
    const response: ApiResponse = {
      success: false,
      error: error.message || "Failed to connect to Django API",
    };
    res.status(500).json(response);
  }
};

// Update user deposit address
export const handleUpdateDepositAddress: RequestHandler = async (req, res) => {
  const { userId, cryptoSymbol, depositAddress } = req.body;

  try {
    // Find user
    const userResponse = await fetch(`${DJANGO_API_BASE}/users/${userId}/`);
    if (!userResponse.ok) {
      const response: ApiResponse = {
        success: false,
        error: "User not found",
      };
      return res.status(404).json(response);
    }

    // Get user account
    const accountsResponse = await fetch(
      `${DJANGO_API_BASE}/accounts/?user=${userId}&platform__name=CryptoPort`
    );
    const accounts = await accountsResponse.json();

    if (accounts.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "CryptoPort account not found",
      };
      return res.status(404).json(response);
    }
    const account = accounts[0];

    // Get crypto wallet
    const cryptoWalletsResponse = await fetch(
      `${DJANGO_API_BASE}/crypto-wallets/?account=${account.id}&crypto_currency__symbol=${cryptoSymbol}`
    );
    const cryptoWallets = await cryptoWalletsResponse.json();

    if (cryptoWallets.length === 0) {
      const response: ApiResponse = {
        success: false,
        error: "Crypto wallet not found",
      };
      return res.status(404).json(response);
    }
    const cryptoWallet = cryptoWallets[0];

    // Update deposit address
    await fetch(`${DJANGO_API_BASE}/crypto-wallets/${cryptoWallet.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...cryptoWallet,
        deposit_address: depositAddress,
      }),
    });

    const response: ApiResponse = {
      success: true,
      message: `${cryptoSymbol} deposit address updated successfully`,
    };

    res.json(response);
  } catch (error: any) {
    console.error("Error updating deposit address:", error);
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
    const response = await fetch(`${DJANGO_API_BASE}/cryptoport/chat/send/`, {
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
    const response = await fetch(`${DJANGO_API_BASE}/cryptoport/chat/mark-read/${email}/`, {
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
    const response = await fetch(`${DJANGO_API_BASE}/cryptoport/chat/history/${email}/`);
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
    const response = await fetch(`${DJANGO_API_BASE}/cryptoport/chat/unread/${email}/`);
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
    const response = await fetch(`${DJANGO_API_BASE}/cryptoport/chat/status/${email}/`);
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

// Toggle chat
export const handleToggleChat: RequestHandler = async (req, res) => {
  const { userId } = req.params;

  try {
    const response = await fetch(`${DJANGO_API_BASE}/cryptoport/admin/user/${userId}/toggle-chat`, {
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
