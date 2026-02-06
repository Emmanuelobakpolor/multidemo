import { useState } from "react";
import { Search, ChevronRight, ChevronDown, BookOpen, HelpCircle, FileText, Phone, Mail, ArrowRight, MessageSquare, Shield, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface FAQItem {
  question: string;
  answer: string;
}

interface Category {
  title: string;
  icon: any;
  description: string;
}

const PayPalHelp = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const categories: Category[] = [
    {
      title: "Getting Started",
      icon: BookOpen,
      description: "Learn how to create an account, link your bank, and start using PayPal",
    },
    {
      title: "Sending Money",
      icon: ArrowRight,
      description: "How to send money to friends, family, or businesses",
    },
    {
      title: "Security",
      icon: Shield,
      description: "Learn about account security, buyer protection, and fraud prevention",
    },
    {
      title: "Payment Methods",
      icon: CreditCard,
      description: "Adding cards, bank accounts, and managing payment sources",
    },
    {
      title: "Fees & Limits",
      icon: FileText,
      description: "Information about transaction fees, limits, and currency conversion",
    },
    {
      title: "Contact Us",
      icon: MessageSquare,
      description: "Get in touch with our support team for personalized help",
    },
  ];

  const faqs: FAQItem[] = [
    {
      question: "How do I create a PayPal account?",
      answer: "To create a PayPal account, click 'Sign Up' on our homepage, enter your email address and create a password. You'll need to verify your email and add a payment method to fully activate your account.",
    },
    {
      question: "How do I send money with PayPal?",
      answer: "Log in to your PayPal account, click 'Send', enter the recipient's email address or phone number, enter the amount, and click 'Send Now'. The money will be transferred instantly.",
    },
    {
      question: "Is PayPal safe to use?",
      answer: "Yes, PayPal uses industry-leading security measures including encryption, fraud monitoring, and Buyer Protection. We never share your full financial information with sellers.",
    },
    {
      question: "How do I link a bank account or card?",
      answer: "Go to your Wallet, click 'Link a card' or 'Link a bank', and follow the instructions to add your payment method. We may make small deposits to verify your bank account.",
    },
    {
      question: "What are PayPal's fees?",
      answer: "It's free to open an account and buy things using PayPal. Fees apply when receiving payments for goods/services or when converting currency. Check our Fees page for full details.",
    },
    {
      question: "How long do transfers take?",
      answer: "Instant transfers are available for a small fee. Standard bank transfers typically take 1-3 business days. Sending money to another PayPal account is instant.",
    },
    {
      question: "What is PayPal Buyer Protection?",
      answer: "PayPal Buyer Protection covers eligible purchases if your item doesn't arrive or doesn't match the seller's description. You may be eligible for a full refund.",
    },
    {
      question: "How do I request a refund?",
      answer: "Go to your Activity, find the transaction, click on it, and select 'Report a problem'. Follow the steps to open a dispute or request a refund from the seller.",
    },
  ];

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-[#CBD2D9] sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-[60px]">
            {/* PayPal Logo */}
            <Link to="/paypal" className="flex items-center">
              <svg width="101" height="32" viewBox="0 0 101 32" fill="none">
                <text
                  x="0"
                  y="24"
                  fill="#003087"
                  fontSize="26"
                  fontWeight="bold"
                  fontFamily="Verdana, sans-serif"
                >
                  Pay<tspan fill="#009cde">Pal</tspan>
                </text>
              </svg>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link to="/paypal/dashboard" className="text-[#2c2e2f] hover:text-[#0070ba] font-medium">
                Dashboard
              </Link>
              <Link to="/paypal/wallet" className="text-[#2c2e2f] hover:text-[#0070ba]">
                Wallet
              </Link>
              <Link to="/paypal/send" className="text-[#2c2e2f] hover:text-[#0070ba]">
                Send
              </Link>
              <Link to="/paypal/help" className="text-[#0070ba] font-medium">
                Help
              </Link>
              <Link to="/paypal/settings" className="text-[#2c2e2f] hover:text-[#0070ba]">
                Settings
              </Link>
            </nav>

            {/* Log In Button */}
            <Link
              to="/paypal/login"
              className="px-6 py-2 border border-[#0070ba] text-[#0070ba] rounded-full text-sm font-medium hover:bg-[#F5F7FA] transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-[#003087] text-white py-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-light mb-4">Help Center</h1>
          <p className="text-[#E1E7F5] mb-8">Find answers to your questions and get support</p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#687173]" />
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-[#CBD2D9] rounded-full text-[#2c2e2f] placeholder-[#687173] focus:outline-none focus:border-[#0070ba] transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12">
        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-light text-[#2c2e2f] mb-6">Browse by Topic</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-white rounded-lg border border-[#CBD2D9] p-6 cursor-pointer hover:border-[#0070ba] hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 bg-[#0070ba]/10 rounded-full flex items-center justify-center mb-4">
                    <IconComponent className="w-6 h-6 text-[#0070ba]" />
                  </div>
                  <h3 className="text-lg font-medium text-[#2c2e2f] mb-2">{category.title}</h3>
                  <p className="text-[#687173] text-sm">{category.description}</p>
                  <div className="mt-4 flex items-center text-[#0070ba] text-sm font-medium">
                    <span>Learn more</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-light text-[#2c2e2f] mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            <AnimatePresence>
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg border border-[#CBD2D9] overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-[#F5F7FA] transition-colors"
                  >
                    <span className="text-[#2c2e2f] font-medium">{faq.question}</span>
                    {expandedFAQ === index ? (
                      <ChevronDown className="w-5 h-5 text-[#0070ba]" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-[#687173]" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedFAQ === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="px-5 pb-5 text-[#687173]"
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
        <div className="bg-[#F5F7FA] rounded-lg p-8 text-center">
          <h2 className="text-2xl font-light text-[#2c2e2f] mb-4">Need more help?</h2>
          <p className="text-[#687173] mb-6">If you couldn't find the answer to your question, our support team is here to help.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#0070ba] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#005ea6] transition-colors flex items-center justify-center gap-2">
              Contact Support <ArrowRight size={18} />
            </button>
            <button className="bg-white text-[#2c2e2f] px-8 py-3 rounded-full font-semibold border border-[#CBD2D9] hover:border-[#0070ba] transition-colors">
              Live Chat
            </button>
          </div>
        </div>

        {/* Support Channels */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-[#CBD2D9] p-6 text-center">
            <div className="w-12 h-12 bg-[#0070ba]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-[#0070ba]" />
            </div>
            <h3 className="text-lg font-medium text-[#2c2e2f] mb-2">Live Chat</h3>
            <p className="text-[#687173] text-sm">Get instant help from our support team</p>
          </div>

          <div className="bg-white rounded-lg border border-[#CBD2D9] p-6 text-center">
            <div className="w-12 h-12 bg-[#003087]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-[#003087]" />
            </div>
            <h3 className="text-lg font-medium text-[#2c2e2f] mb-2">Email Support</h3>
            <p className="text-[#687173] text-sm">support@paypal.com</p>
          </div>

          <div className="bg-white rounded-lg border border-[#CBD2D9] p-6 text-center">
            <div className="w-12 h-12 bg-[#009cde]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-[#009cde]" />
            </div>
            <h3 className="text-lg font-medium text-[#2c2e2f] mb-2">Phone Support</h3>
            <p className="text-[#687173] text-sm">1-888-221-1161</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#F5F7FA] border-t border-[#CBD2D9] py-8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs text-[#687173]">
            © 1999–2025 PayPal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PayPalHelp;
