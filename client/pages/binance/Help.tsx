import { useState } from "react";
import { Search, ChevronRight, ChevronDown, BookOpen, HelpCircle, FileText, Phone, Mail, ArrowRight, MessageSquare } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import PageTransition from "@/components/binance/PageTransition";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface FAQItem {
  question: string;
  answer: string;
}

interface Category {
  title: string;
  icon: any;
  description: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const BinanceHelp = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const categories: Category[] = [
    {
      title: "Getting Started",
      icon: BookOpen,
      description: "Learn how to create an account, verify your identity, and start trading",
    },
    {
      title: "Trading",
      icon: HelpCircle,
      description: "Understand trading basics, order types, and market analysis",
    },
    {
      title: "Security",
      icon: FileText,
      description: "Learn about account security, two-factor authentication, and fraud prevention",
    },
    {
      title: "Deposits & Withdrawals",
      icon: Phone,
      description: "Guide to depositing and withdrawing funds from your Binance account",
    },
    {
      title: "Fees & Limits",
      icon: Mail,
      description: "Information about trading fees, deposit/withdrawal fees, and limits",
    },
    {
      title: "API & Developers",
      icon: MessageSquare,
      description: "Documentation for Binance API and developer resources",
    },
  ];

  const faqs: FAQItem[] = [
    {
      question: "How do I create a Binance account?",
      answer: "To create a Binance account, go to the sign-up page and fill out the registration form with your email address and password. You will need to verify your email and complete the identity verification process to fully activate your account.",
    },
    {
      question: "How long does it take to verify my identity?",
      answer: "Identity verification usually takes between 30 minutes to 24 hours. The process may take longer during peak times or if additional information is required.",
    },
    {
      question: "What cryptocurrencies can I trade on Binance?",
      answer: "Binance supports over 350 cryptocurrencies for trading, including Bitcoin (BTC), Ethereum (ETH), Binance Coin (BNB), and many other popular digital assets.",
    },
    {
      question: "How do I deposit funds into my Binance account?",
      answer: "To deposit funds, log in to your Binance account, navigate to the 'Wallet' section, and select 'Deposit'. Choose the cryptocurrency you want to deposit and follow the instructions to complete the transaction.",
    },
    {
      question: "What are the deposit and withdrawal fees?",
      answer: "Deposit fees are usually free, but withdrawal fees vary depending on the cryptocurrency. You can check the current fee structure on the Fees page.",
    },
    {
      question: "How secure is Binance?",
      answer: "Binance implements industry-leading security measures, including cold storage of funds, two-factor authentication, and regular security audits. We also offer insurance to protect user assets.",
    },
    {
      question: "What is the minimum deposit amount?",
      answer: "The minimum deposit amount varies by cryptocurrency. For most major cryptocurrencies, the minimum deposit is around $10 or equivalent.",
    },
    {
      question: "How do I enable two-factor authentication?",
      answer: "To enable 2FA, go to the 'Security' section in your account settings and follow the instructions to set up either Google Authenticator or SMS authentication.",
    },
  ];

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  <a href="#" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors">Earn</a>
                  <a href="/binance/help" className="text-[#F0B90B] hover:text-[#F8D12F] transition-colors font-medium">Help</a>
                  <a href="/binance/settings" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors">Settings</a>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-[1400px] mx-auto px-4 py-6">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-[#181A20] to-[#0B0E11] rounded-lg border border-[#2B3139] p-8 mb-6 text-center">
            <h1 className="text-3xl font-semibold text-[#EAECEF] mb-4">Help Center</h1>
            <p className="text-[#B7BDC6] mb-6">Find answers to your questions and get support</p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#848E9C]" />
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#0B0E11] border border-[#2B3139] rounded-lg text-[#EAECEF] placeholder-[#848E9C] focus:outline-none focus:border-[#F0B90B] transition-colors"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-[#EAECEF] mb-4">Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={prefersReducedMotion ? {} : { scale: 1.02, y: -2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    onClick={() => setSelectedCategory(category.title)}
                    className="bg-[#181A20] rounded-lg border border-[#2B3139] p-6 cursor-pointer hover:border-[#F0B90B]/30 transition-all"
                  >
                    <div className="w-12 h-12 bg-[#F0B90B]/10 rounded-xl flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-[#F0B90B]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#EAECEF] mb-2">{category.title}</h3>
                    <p className="text-[#B7BDC6] text-sm">{category.description}</p>
                    <div className="mt-4 flex items-center text-[#F0B90B] text-sm font-medium">
                      <span>Learn more</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-[#EAECEF] mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              <AnimatePresence>
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-[#181A20] rounded-lg border border-[#2B3139] overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                      className="w-full flex items-center justify-between p-6 text-left"
                    >
                      <span className="text-[#EAECEF] font-medium">{faq.question}</span>
                      {expandedFAQ === index ? (
                        <ChevronDown className="w-5 h-5 text-[#F0B90B]" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-[#848E9C]" />
                      )}
                    </button>
                    <AnimatePresence>
                      {expandedFAQ === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="px-6 pb-6 text-[#B7BDC6]"
                        >
                          {faq.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-[#181A20] rounded-lg border border-[#2B3139] p-8 text-center">
            <h2 className="text-2xl font-semibold text-[#EAECEF] mb-4">Need more help?</h2>
            <p className="text-[#B7BDC6] mb-6">If you couldn't find the answer to your question, our support team is here to help.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={prefersReducedMotion ? {} : { scale: 1.05, boxShadow: "0 10px 30px rgba(240,185,11,0.3)" }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="bg-[#F0B90B] text-[#0B0E11] px-8 py-3 rounded font-semibold hover:bg-[#F8D12F] transition-all flex items-center justify-center gap-2"
              >
                Contact Support <ArrowRight size={18} />
              </motion.button>
              
              <motion.button
                whileHover={prefersReducedMotion ? {} : { scale: 1.05, boxShadow: "0 10px 30px rgba(240,185,11,0.15)" }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="bg-[#0B0E11] text-[#EAECEF] px-8 py-3 rounded font-semibold border border-[#2B3139] hover:border-[#F0B90B] transition-all"
              >
                Live Chat
              </motion.button>
            </div>
          </div>

          {/* Support Channels */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#181A20] rounded-lg border border-[#2B3139] p-6 text-center">
              <div className="w-12 h-12 bg-[#0ECB81]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-[#0ECB81]" />
              </div>
              <h3 className="text-lg font-semibold text-[#EAECEF] mb-2">Live Chat</h3>
              <p className="text-[#B7BDC6] text-sm">Get instant help from our support team</p>
            </div>

            <div className="bg-[#181A20] rounded-lg border border-[#2B3139] p-6 text-center">
              <div className="w-12 h-12 bg-[#F0B90B]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-[#F0B90B]" />
              </div>
              <h3 className="text-lg font-semibold text-[#EAECEF] mb-2">Email Support</h3>
              <p className="text-[#B7BDC6] text-sm">support@binance.com</p>
            </div>

            <div className="bg-[#181A20] rounded-lg border border-[#2B3139] p-6 text-center">
              <div className="w-12 h-12 bg-[#F6465D]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-[#F6465D]" />
              </div>
              <h3 className="text-lg font-semibold text-[#EAECEF] mb-2">Phone Support</h3>
              <p className="text-[#B7BDC6] text-sm">+1 (855) 847-3865</p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default BinanceHelp;
