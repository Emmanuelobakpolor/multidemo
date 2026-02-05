import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";

const PayFlowRequest = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    requesterEmail: "",
    amount: "",
    message: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("paypal_user");
    if (!userData) {
      navigate("/paypal/login");
    } else {
      setUser(JSON.parse(userData));
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.requesterEmail.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    try {
      const response = await fetch(`/api/paypal/user/${user.email}/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientEmail: formData.requesterEmail,
          amount: parseFloat(formData.amount),
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Failed to send request");
        return;
      }

      setShowSuccess(true);
      setTimeout(() => {
        navigate("/paypal/dashboard");
      }, 2000);
    } catch (err) {
      setError("Failed to connect to server");
      console.error("Error requesting money:", err);
    }
  };

  if (!user) return null;

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Request sent</h1>
          <p className="text-gray-600 mb-1">
            You requested ${parseFloat(formData.amount).toFixed(2)} USD
          </p>
          <p className="text-gray-600 mb-4">
            from {formData.requesterEmail}
          </p>
          <p className="text-sm text-gray-500">Redirecting to your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate("/paypal/dashboard")}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Request money</h1>
          <p className="text-gray-600">Request money from friends and family</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Request from */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Request from
              </label>
              <input
                type="email"
                value={formData.requesterEmail}
                onChange={(e) => setFormData({ ...formData, requesterEmail: e.target.value })}
                placeholder="Name, email, or mobile number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 text-lg font-medium">
                  $
                </span>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg text-gray-900 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 text-sm">
                  USD
                </span>
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Note (optional)
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="What's this request for?"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
              />
            </div>

            {/* Info notice */}
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-700">
                The recipient will receive a notification about your request and can choose to pay it.
              </p>
            </div>

            {/* Continue button */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors text-sm"
            >
              Request
            </button>
          </form>
        </div>

        {/* Info section */}
        <div className="text-center text-sm text-gray-500">
          <p>By continuing, you agree to PayPal's terms and fees.</p>
        </div>
      </main>
    </div>
  );
};

export default PayFlowRequest;
