import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Send, User } from "lucide-react";

const QuickCashSend = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const userData = localStorage.getItem("quickcash_user");
    if (!userData) {
      navigate("/quickcash/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8000/api/quickcash/search?query=${encodeURIComponent(
          searchQuery.trim()
        )}`
      );
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.data);
      } else {
        setError(data.error || "Search failed");
        setSearchResults([]);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleSendMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !amount) {
      alert("Please select a recipient and enter an amount");
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (parsedAmount > user.balance) {
      alert("Insufficient balance");
      return;
    }

    setSending(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8000/api/quickcash/user/${user.email}/send`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recipientEmail: selectedUser.email,
            amount: parsedAmount,
            message: message,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Update user balance in localStorage
        const updatedUser = {
          ...user,
          balance: user.balance - parsedAmount,
        };
        localStorage.setItem("quickcash_user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        // Reset form
        setSelectedUser(null);
        setAmount("");
        setMessage("");

        alert("Money sent successfully!");
        navigate("/quickcash/dashboard");
      } else {
        setError(data.error || "Failed to send money");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleBack = () => {
    if (selectedUser) {
      setSelectedUser(null);
    } else {
      navigate("/quickcash/dashboard");
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0D0D0D]">
      {/* Header */}
      <header className="bg-[#1A1A1A] border-b border-[#333333] sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center h-16">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-[#333333] rounded-full transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 text-[#FFFFFF]" />
            </button>
            <h1 className="text-xl font-semibold text-[#FFFFFF]">
              {selectedUser ? `Send to ${selectedUser.fullName}` : "Send Money"}
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {!selectedUser ? (
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[#FFFFFF] mb-4">
              Find a QuickCash user
            </h2>
            <p className="text-sm text-[#888888] mb-6">
              Search by username ($cashtag), email, or phone number
            </p>

            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search $cashtags, names, or phone numbers"
                  className="w-full pl-10 pr-4 py-3 bg-[#0D0D0D] border border-[#333333] rounded-lg text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA] transition"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || !searchQuery.trim()}
                className="w-full mt-4 py-3 bg-[#00D4AA] text-black font-medium rounded-lg hover:bg-[#00C49A] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  "Search"
                )}
              </button>
            </form>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm mb-6">
                {error}
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-[#888888] mb-2">
                  Search Results ({searchResults.length})
                </h3>
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => handleSelectUser(result)}
                    className="flex items-center gap-3 p-3 bg-[#0D0D0D] border border-[#333333] rounded-lg hover:bg-[#333333] transition-colors cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#00D4AA] flex items-center justify-center text-black text-sm font-semibold">
                      {result.email[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#FFFFFF]">
                        {result.fullName}
                      </p>
                      {result.username && (
                        <p className="text-xs text-[#00D4AA]">
                          ${result.username}
                        </p>
                      )}
                      <p className="text-xs text-[#888888]">{result.email}</p>
                    </div>
                    <Send className="w-4 h-4 text-[#888888]" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#1A1A1A] border border-[#333333] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#00D4AA] flex items-center justify-center text-black text-lg font-semibold">
                {selectedUser.email[0].toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-semibold text-[#FFFFFF]">
                  {selectedUser.fullName}
                </p>
                {selectedUser.username && (
                  <p className="text-sm text-[#00D4AA]">${selectedUser.username}</p>
                )}
              </div>
            </div>

            <form onSubmit={handleSendMoney}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#888888] mb-2">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00D4AA] text-lg font-semibold">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    min="0.01"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-4 bg-[#0D0D0D] border border-[#333333] rounded-lg text-[#FFFFFF] text-2xl font-semibold placeholder-[#666666] focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA] transition"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[#888888] mb-2">
                  Note (optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a note..."
                  rows={3}
                  className="w-full px-4 py-3 bg-[#0D0D0D] border border-[#333333] rounded-lg text-[#FFFFFF] placeholder-[#666666] focus:outline-none focus:border-[#00D4AA] focus:ring-1 focus:ring-[#00D4AA] transition"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm mb-6">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full py-4 bg-[#00D4AA] text-black font-bold text-lg rounded-lg hover:bg-[#00C49A] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : (
                  `Send $${parseFloat(amount).toFixed(2)}`
                )}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuickCashSend;
