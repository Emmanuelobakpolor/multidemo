import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Send, AlertCircle, CheckCircle2, User } from "lucide-react";

const GCashSend = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    recipientMobile: "",
    amount: "",
    message: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("sendwave_user");
    if (!userData) {
      navigate("/sendwave/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.recipientMobile.trim()) {
      setError("Please enter a recipient mobile number");
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (parseFloat(formData.amount) > (user?.balance || 0)) {
      setError("Insufficient GCash balance");
      return;
    }

    try {
        const response = await fetch(`/api/sendwave/user/mobile/${user.mobileNumber}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientMobile: formData.recipientMobile,
          amount: parseFloat(formData.amount),
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const newBalance = (user.balance || 0) - parseFloat(formData.amount);
        const updatedUser = { ...user, balance: newBalance };
        localStorage.setItem("sendwave_user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setShowSuccess(true);
        setTimeout(() => navigate("/sendwave/dashboard"), 3000);
      } else {
        setError(data.error || "Transaction failed");
      }
    } catch (error) {
      setError("Connection error. Try again.");
    }
  };

  if (!user) return null;

  // Success Screen - GCash Style
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-2xl font-black text-slate-800 mb-2">Success!</h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Your payment of <span className="font-bold text-slate-800">₱{parseFloat(formData.amount).toFixed(2)}</span> to <br/>
          <span className="font-bold text-[#007DFE]">{formData.recipientMobile}</span> has been sent.
        </p>
        <div className="w-full max-w-xs p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400 font-mono">
          Ref No. {Math.random().toString(36).toUpperCase().substring(2, 12)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FA]">
      {/* Header */}
      <header className="bg-[#007DFE] text-white sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center gap-4">
          <button onClick={() => navigate("/sendwave/dashboard")} className="p-1">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-bold text-lg">Express Send</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Balance Display */}
        <div className="flex justify-between items-center mb-6 px-2">
          <span className="text-slate-500 text-sm font-bold">Your Balance</span>
          <span className="text-[#007DFE] font-black">₱{user.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 items-center">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Recipient Input */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Send To</label>
            <div className="relative">
              <User className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input
                type="tel"
                value={formData.recipientMobile}
                onChange={(e) => setFormData({ ...formData, recipientMobile: e.target.value })}
                placeholder="Enter Mobile Number"
                className="w-full pl-8 py-2 text-lg font-bold text-slate-800 border-b-2 border-slate-100 focus:border-[#007DFE] focus:outline-none transition-colors placeholder:text-slate-300 placeholder:font-normal"
                required
              />
            </div>
          </div>

          {/* Amount Input */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Amount</label>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-800">₱</span>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                step="0.01"
                className="w-full text-4xl font-black text-[#007DFE] focus:outline-none placeholder:text-blue-100"
                required
              />
            </div>
          </div>

          {/* Message Input */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Message (Optional)</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="What is this for?"
              rows={2}
              className="w-full py-2 text-sm text-slate-700 focus:outline-none resize-none placeholder:text-slate-300"
            />
          </div>

          {/* Fee Notice */}
          <div className="px-2 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Transaction Fee</span>
            <span>₱ 0.00</span>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
          <button
            type="submit"
            className="w-full py-4 bg-[#007DFE] text-white rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-600 active:scale-[0.98] transition-all"
          >
            SEND ₱{formData.amount ? parseFloat(formData.amount).toFixed(2) : "0.00"} TO {formData.recipientMobile || "MOBILE"}
          </button>
          </div>
        </form>

        <p className="mt-8 text-center text-[11px] text-slate-400 px-8 leading-relaxed">
          Please ensure the recipient's details are correct. Transactions made via <span className="font-bold">Express Send</span> are final and cannot be reversed.
        </p>
      </main>
    </div>
  );
};

export default GCashSend;
