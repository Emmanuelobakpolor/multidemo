import { useState, useEffect } from "react";
import { Search, MessageSquare, Phone, Mail, FileText, ExternalLink, ChevronRight, Clock, Star, Plus } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import PageTransition from "@/components/binance/PageTransition";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  views: number;
}

interface TicketItem {
  id: string;
  subject: string;
  category: string;
  status: "open" | "closed" | "pending";
  priority: "low" | "medium" | "high";
  date: string;
  lastUpdated: string;
}

interface Article {
  id: string;
  title: string;
  category: string;
  description: string;
  readTime: string;
  views: number;
  author: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const BinanceSupport = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedTab, setSelectedTab] = useState("faqs");
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<FAQItem | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const initialFAQs: FAQItem[] = [
      {
        id: "1",
        category: "account",
        question: "How do I reset my password?",
        answer: "To reset your password, go to the login page and click 'Forgot Password'. We'll send you a reset link to your registered email address. Make sure to check your spam folder if you don't see the email within 5 minutes.",
        views: 12500,
      },
      {
        id: "2",
        category: "security",
        question: "How do I enable two-factor authentication?",
        answer: "You can enable two-factor authentication (2FA) from your Security settings page. We support Google Authenticator and SMS verification. We recommend using Google Authenticator for higher security.",
        views: 8900,
      },
      {
        id: "3",
        category: "deposit",
        question: "How long does it take to receive my deposit?",
        answer: "Deposit times vary by cryptocurrency and network congestion. Bitcoin deposits typically take 1-3 confirmations (approximately 10-30 minutes), while Ethereum deposits usually take 12-18 confirmations (approximately 5-10 minutes).",
        views: 6700,
      },
      {
        id: "4",
        category: "withdrawal",
        question: "What are the withdrawal fees?",
        answer: "Withdrawal fees vary by cryptocurrency. Bitcoin withdrawals cost 0.0005 BTC, Ethereum withdrawals cost 0.01 ETH, and stablecoin withdrawals cost $0.10. Fees are subject to change based on network conditions.",
        views: 9200,
      },
      {
        id: "5",
        category: "trading",
        question: "How do I place a trade on Binance?",
        answer: "To place a trade, go to the Trade page, select your desired trading pair, and choose your order type (Market, Limit, or Stop-Limit). Enter the amount you want to trade and click Buy or Sell.",
        views: 15300,
      },
    ];

    const initialTickets: TicketItem[] = [
      {
        id: "1",
        subject: "Deposit not showing in my account",
        category: "deposit",
        status: "open",
        priority: "high",
        date: "2024-02-14",
        lastUpdated: "2024-02-14 10:30 AM",
      },
      {
        id: "2",
        subject: "Password reset not working",
        category: "account",
        status: "pending",
        priority: "medium",
        date: "2024-02-13",
        lastUpdated: "2024-02-13 08:45 PM",
      },
      {
        id: "3",
        subject: "Withdrawal failed",
        category: "withdrawal",
        status: "closed",
        priority: "high",
        date: "2024-02-12",
        lastUpdated: "2024-02-12 03:20 PM",
      },
    ];

    const initialArticles: Article[] = [
      {
        id: "1",
        title: "Getting Started with Binance",
        category: "beginner",
        description: "A comprehensive guide to getting started with Binance, including account creation, security setup, and basic trading.",
        readTime: "10 min read",
        views: 25000,
        author: "Binance Team",
      },
      {
        id: "2",
        title: "Security Best Practices",
        category: "security",
        description: "Learn how to keep your Binance account secure with our comprehensive security guide.",
        readTime: "8 min read",
        views: 18000,
        author: "Security Team",
      },
      {
        id: "3",
        title: "Advanced Trading Strategies",
        category: "trading",
        description: "Master advanced trading strategies with our comprehensive guide to technical analysis and risk management.",
        readTime: "15 min read",
        views: 12000,
        author: "Trading Team",
      },
    ];

    setFaqs(initialFAQs);
    setTickets(initialTickets);
    setArticles(initialArticles);
  }, []);

  const filteredFAQs = faqs.filter(
    (faq) =>
      (selectedCategory === "all" || faq.category === selectedCategory) &&
      (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredArticles = articles.filter(
    (article) =>
      (selectedCategory === "all" || article.category === selectedCategory) &&
      (article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "account", label: "Account" },
    { value: "security", label: "Security" },
    { value: "deposit", label: "Deposit" },
    { value: "withdrawal", label: "Withdrawal" },
    { value: "trading", label: "Trading" },
    { value: "earn", label: "Earn" },
  ];

  const handleNewTicket = () => {
    alert("New ticket feature coming soon!");
    setShowNewTicketModal(false);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B0E11]" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
        {/* Top Navigation Bar */}
        <nav className="bg-[#181A20] border-b border-[#2B3139]">
          <div className="max-w-[1400px] mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-8">
                <a href="/binance" className="flex items-center gap-2">
                  <img src="/images/download.png" alt="Binance Logo" className="w-20 h-auto" />
                </a>
                
                <div className="hidden lg:flex items-center gap-6 text-sm">
                  <a href="/binance/dashboard" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors font-medium">Dashboard</a>
                  <a href="/binance/markets" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors">Markets</a>
                  <a href="/binance/trade" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors">Trade</a>
                  <a href="/binance/earn" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors">Earn</a>
                  <a href="/binance/settings" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors">Settings</a>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-8 h-8 text-[#F0B90B]" />
              <div>
                <h1 className="text-2xl font-semibold text-[#EAECEF]">Customer Support</h1>
                <p className="text-sm text-[#848E9C]">Get help with your account</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#848E9C]" />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#181A20] border border-[#2B3139] rounded-lg text-[#EAECEF] placeholder-[#848E9C] focus:outline-none focus:border-[#F0B90B] transition-colors"
              />
            </div>

            {/* Support Methods */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#181A20] rounded-lg border border-[#2B3139] p-6">
                <div className="w-12 h-12 bg-[#0ECB81]/20 text-[#0ECB81] rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-[#EAECEF] mb-2">Live Chat</h3>
                <p className="text-[#848E9C] text-sm mb-4">Chat with our support team 24/7</p>
                <button className="w-full py-2 bg-[#F0B90B] text-black hover:bg-[#F8D12F] rounded-lg text-sm font-medium transition-colors">
                  Start Chat
                </button>
              </div>

              <div className="bg-[#181A20] rounded-lg border border-[#2B3139] p-6">
                <div className="w-12 h-12 bg-[#F0B90B]/20 text-[#F0B90B] rounded-full flex items-center justify-center mb-4">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-[#EAECEF] mb-2">Phone Support</h3>
                <p className="text-[#848E9C] text-sm mb-4">Available 9AM - 6PM GMT</p>
                <button className="w-full py-2 bg-[#2B3139] text-[#EAECEF] hover:bg-[#3d4450] rounded-lg text-sm font-medium transition-colors">
                  Call Support
                </button>
              </div>

              <div className="bg-[#181A20] rounded-lg border border-[#2B3139] p-6">
                <div className="w-12 h-12 bg-[#F6465D]/20 text-[#F6465D] rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-[#EAECEF] mb-2">Email Support</h3>
                <p className="text-[#848E9C] text-sm mb-4">Response within 24 hours</p>
                <button className="w-full py-2 bg-[#2B3139] text-[#EAECEF] hover:bg-[#3d4450] rounded-lg text-sm font-medium transition-colors">
                  Send Email
                </button>
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setSelectedTab("faqs")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTab === "faqs"
                  ? "bg-[#F0B90B] text-black"
                  : "bg-[#181A20] text-[#848E9C] hover:bg-[#2B3139] hover:text-[#EAECEF]"
              }`}
            >
              FAQs
            </button>
            <button
              onClick={() => setSelectedTab("articles")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTab === "articles"
                  ? "bg-[#F0B90B] text-black"
                  : "bg-[#181A20] text-[#848E9C] hover:bg-[#2B3139] hover:text-[#EAECEF]"
              }`}
            >
              Help Center
            </button>
            <button
              onClick={() => setSelectedTab("tickets")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedTab === "tickets"
                  ? "bg-[#F0B90B] text-black"
                  : "bg-[#181A20] text-[#848E9C] hover:bg-[#2B3139] hover:text-[#EAECEF]"
              }`}
            >
              Support Tickets
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedCategory === category.value
                    ? "bg-[#F0B90B] text-black"
                    : "bg-[#181A20] text-[#848E9C] hover:bg-[#2B3139] hover:text-[#EAECEF]"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* FAQ Content */}
          {selectedTab === "faqs" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {filteredFAQs.map((faq) => (
                <motion.div
                  key={faq.id}
                  variants={itemVariants}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
                  className="bg-[#181A20] rounded-lg border border-[#2B3139] p-6"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <FileText className="w-5 h-5 text-[#848E9C] mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-[#EAECEF]">{faq.question}</h3>
                        <div className="flex items-center gap-2 text-[#848E9C] text-xs">
                          <Clock className="w-3 h-3" />
                          <span>{faq.views.toLocaleString()} views</span>
                        </div>
                      </div>
                      <p className="text-[#848E9C] text-sm mb-3">{faq.answer}</p>
                      <div className="flex items-center gap-4">
                        <button className="text-[#F0B90B] hover:text-[#F8D12F] text-xs font-medium transition-colors">
                          Helpful?
                        </button>
                        <button className="text-[#848E9C] hover:text-[#EAECEF] text-xs font-medium transition-colors">
                          Report
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Articles Content */}
          {selectedTab === "articles" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filteredArticles.map((article) => (
                <motion.div
                  key={article.id}
                  variants={itemVariants}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
                  className="bg-[#181A20] rounded-lg border border-[#2B3139] p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 bg-[#F0B90B]/20 text-[#F0B90B] rounded text-xs font-medium">
                      {article.category}
                    </span>
                    <span className="text-[#848E9C] text-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.readTime}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#EAECEF] mb-2">{article.title}</h3>
                  <p className="text-[#848E9C] text-sm mb-4">{article.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[#848E9C] text-xs flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {article.author}
                      </span>
                      <span className="text-[#848E9C] text-xs">
                        {article.views.toLocaleString()} views
                      </span>
                    </div>
                    <button className="text-[#F0B90B] hover:text-[#F8D12F] transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Tickets Content */}
          {selectedTab === "tickets" && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowNewTicketModal(true)}
                  className="px-4 py-2 bg-[#F0B90B] text-black hover:bg-[#F8D12F] rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Ticket
                </button>
              </div>

              {tickets.map((ticket) => (
                <motion.div
                  key={ticket.id}
                  variants={itemVariants}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.01 }}
                  className="bg-[#181A20] rounded-lg border border-[#2B3139] p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-[#EAECEF]">{ticket.subject}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          ticket.status === "open" ? "bg-[#F0B90B]/20 text-[#F0B90B]" :
                          ticket.status === "closed" ? "bg-[#F6465D]/20 text-[#F6465D]" :
                          "bg-[#0ECB81]/20 text-[#0ECB81]"
                        }`}>
                          {ticket.status}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          ticket.priority === "high" ? "bg-[#F6465D]/20 text-[#F6465D]" :
                          ticket.priority === "medium" ? "bg-[#F0B90B]/20 text-[#F0B90B]" :
                          "bg-[#0ECB81]/20 text-[#0ECB81]"
                        }`}>
                          {ticket.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[#848E9C] text-sm">
                        <span>{ticket.category}</span>
                        <span>•</span>
                        <span>Created: {ticket.date}</span>
                        <span>•</span>
                        <span>Updated: {ticket.lastUpdated}</span>
                      </div>
                    </div>
                    <button className="text-[#F0B90B] hover:text-[#F8D12F] transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* New Ticket Modal */}
        <AnimatePresence>
          {showNewTicketModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-[#181A20] rounded-lg border border-[#2B3139] w-full max-w-2xl"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-[#EAECEF] mb-4">Create New Ticket</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-[#848E9C] text-sm block mb-2">
                        Category
                      </label>
                      <select className="w-full px-3 py-2 bg-[#0B0E11] border border-[#2B3139] rounded text-sm text-[#EAECEF] focus:outline-none focus:border-[#F0B90B] transition-colors">
                        <option value="account">Account</option>
                        <option value="security">Security</option>
                        <option value="deposit">Deposit</option>
                        <option value="withdrawal">Withdrawal</option>
                        <option value="trading">Trading</option>
                        <option value="earn">Earn</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[#848E9C] text-sm block mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        placeholder="Enter ticket subject"
                        className="w-full px-3 py-2 bg-[#0B0E11] border border-[#2B3139] rounded text-sm text-[#EAECEF] focus:outline-none focus:border-[#F0B90B] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-[#848E9C] text-sm block mb-2">
                        Description
                      </label>
                      <textarea
                        placeholder="Describe your issue..."
                        rows={6}
                        className="w-full px-3 py-2 bg-[#0B0E11] border border-[#2B3139] rounded text-sm text-[#EAECEF] focus:outline-none focus:border-[#F0B90B] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-[#848E9C] text-sm block mb-2">
                        Attachments (Optional)
                      </label>
                      <div className="border-2 border-dashed border-[#2B3139] rounded-lg p-8 text-center">
                        <Plus className="w-8 h-8 text-[#848E9C] mx-auto mb-2" />
                        <p className="text-[#848E9C] text-sm">Click to upload or drag and drop</p>
                        <p className="text-[#848E9C] text-xs mt-1">Max file size: 10MB</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleNewTicket}
                        className="flex-1 py-2 bg-[#F0B90B] hover:bg-[#F8D12F] text-black rounded-lg font-medium transition-colors"
                      >
                        Submit Ticket
                      </button>
                      <button
                        onClick={() => setShowNewTicketModal(false)}
                        className="flex-1 py-2 bg-[#2B3139] hover:bg-[#3d4450] text-[#EAECEF] rounded-lg font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default BinanceSupport;
