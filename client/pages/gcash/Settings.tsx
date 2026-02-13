"use client";

import { useState, useEffect } from "react";
import {
  User,
  Shield,
  Bell,
  Smartphone,
  ChevronRight,
  Save,
  ArrowLeft,
  Mail,
  Lock,
  Key,
  CreditCard,
  DollarSign,
} from "lucide-react";

export default function GCashSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [notifications, setNotifications] = useState({
    transactions: true,
    promos: true,
    security: true,
    bills: false,
    updates: true,
  });
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    balance: 0,
    createdAt: "",
    updatedAt: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = localStorage.getItem("gcash_user");
      if (userData) {
        const user = JSON.parse(userData);
        try {
          const response = await fetch(`/api/gcash/get_user_by_email/${user.email}`);
          const data = await response.json();
          if (data.success) {
            setProfileData({
              fullName: data.data.fullName,
              email: data.data.email,
              mobileNumber: data.data.mobileNumber,
              balance: data.data.balance,
              createdAt: data.data.createdAt,
              updatedAt: data.data.updatedAt,
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          // Fallback to localStorage data if API fails
          setProfileData({
            fullName: user.fullName,
            email: user.email,
            mobileNumber: user.mobileNumber,
            balance: user.balance,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          });
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, []);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "mobile", label: "Mobile Number", icon: Smartphone },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "payment", label: "Payment Methods", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="/gcash"
              className="text-gray-600 hover:text-[#007DFE] transition-colors"
            >
              <ArrowLeft size={24} />
            </a>
            <h1 className="text-xl font-semibold">Settings</h1>
          </div>
          <a href="/gcash" className="flex items-center gap-2">
            <img
              src="/images/gcash-logo.png"
              alt="GCash Logo"
              className="h-10 w-auto"
            />
          </a>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 h-fit shadow-sm">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? "bg-[#007DFE]/10 text-[#007DFE]"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                    <ChevronRight
                      size={16}
                      className="ml-auto"
                      style={{
                        opacity: activeTab === tab.id ? 1 : 0.3,
                      }}
                    />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                {loading ? (
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-2 border-[#007DFE] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-2xl font-semibold mb-6">
                      Profile Information
                    </h2>

                    <div className="space-y-6">
                      {/* Profile Picture */}
                      <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-[#007DFE]/10 flex items-center justify-center">
                          <User size={48} className="text-[#007DFE]" />
                        </div>
                      </div>

                      {/* User Details */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">
                            Full Name
                          </label>
                          <div className="relative">
                            <User
                              size={20}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                              type="text"
                              value={profileData.fullName}
                              readOnly
                              className="w-full bg-gray-100 border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 cursor-not-allowed"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-600 mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail
                              size={20}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                              type="email"
                              value={profileData.email}
                              readOnly
                              className="w-full bg-gray-100 border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 cursor-not-allowed"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-600 mb-2">
                            Mobile Number
                          </label>
                          <div className="relative">
                            <Smartphone
                              size={20}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                              type="tel"
                              value={profileData.mobileNumber}
                              readOnly
                              className="w-full bg-gray-100 border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 cursor-not-allowed"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-600 mb-2">
                            Balance
                          </label>
                          <div className="relative">
                            <DollarSign
                              size={20}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                              type="text"
                              value={`₱${profileData.balance.toFixed(2)}`}
                              readOnly
                              className="w-full bg-gray-100 border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 cursor-not-allowed"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-600 mb-2">
                            Account Created
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={new Date(profileData.createdAt).toLocaleDateString()}
                              readOnly
                              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 cursor-not-allowed"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-gray-600 mb-2">
                            Last Updated
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={new Date(profileData.updatedAt).toLocaleDateString()}
                              readOnly
                              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 cursor-not-allowed"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Number Tab */}
            {activeTab === "mobile" && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold mb-6">
                    Mobile Number Settings
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Registered Mobile Number
                      </label>
                      <div className="relative">
                        <Smartphone
                          size={20}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="tel"
                          value={profileData.mobileNumber}
                          readOnly
                          className="w-full bg-gray-100 border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        This is your GCash registered mobile number
                      </p>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex gap-3">
                        <Smartphone
                          size={20}
                          className="text-[#007DFE] flex-shrink-0 mt-0.5"
                        />
                        <div>
                          <div className="font-medium text-gray-900 mb-1">
                            Verified Mobile Number
                          </div>
                          <p className="text-sm text-gray-600">
                            Your mobile number is verified and linked to your
                            GCash account. This is used for all transactions and
                            security verification.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg">
                      <div>
                        <div className="font-medium">Change Mobile Number</div>
                        <div className="text-sm text-gray-600">
                          Update your registered mobile number
                        </div>
                      </div>
                      <button className="text-[#007DFE] font-medium hover:text-[#0066D6] transition-colors">
                        Change
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg">
                      <div>
                        <div className="font-medium">
                          SMS Authentication
                        </div>
                        <div className="text-sm text-gray-600">
                          Receive OTP via SMS for verification
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007DFE]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold mb-6">
                    Security Settings
                  </h2>

                  <div className="space-y-6">
                    {/* MPIN */}
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#007DFE]/10 rounded-full flex items-center justify-center">
                          <Key size={20} className="text-[#007DFE]" />
                        </div>
                        <div>
                          <div className="font-medium">MPIN</div>
                          <div className="text-sm text-gray-600">
                            Change your 6-digit MPIN
                          </div>
                        </div>
                      </div>
                      <button className="bg-[#007DFE] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0066D6] transition-all">
                        Change
                      </button>
                    </div>

                    {/* Biometric Login */}
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#007DFE]/10 rounded-full flex items-center justify-center">
                          <Smartphone size={20} className="text-[#007DFE]" />
                        </div>
                        <div>
                          <div className="font-medium">Biometric Login</div>
                          <div className="text-sm text-gray-600">
                            Use fingerprint or face recognition
                          </div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007DFE]"></div>
                      </label>
                    </div>

                    {/* Change Password */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Change Password</h3>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <Lock
                            size={20}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                          <input
                            type="password"
                            placeholder="Enter current password"
                            className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:border-[#007DFE] transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <Lock
                            size={20}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                          <input
                            type="password"
                            placeholder="Enter new password"
                            className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:border-[#007DFE] transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <Lock
                            size={20}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                          <input
                            type="password"
                            placeholder="Confirm new password"
                            className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:border-[#007DFE] transition-colors"
                          />
                        </div>
                      </div>
                      <button className="bg-[#007DFE] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0066D6] transition-all">
                        Update Password
                      </button>
                    </div>

                    {/* Security Activity */}
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#007DFE]/10 rounded-full flex items-center justify-center">
                          <Shield size={20} className="text-[#007DFE]" />
                        </div>
                        <div>
                          <div className="font-medium">Security Activity</div>
                          <div className="text-sm text-gray-600">
                            View recent security events
                          </div>
                        </div>
                      </div>
                      <button className="text-[#007DFE] font-medium hover:text-[#0066D6] transition-colors">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold mb-6">
                    Notification Preferences
                  </h2>

                  <div className="space-y-4">
                    {/* Transactions */}
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg">
                      <div>
                        <div className="font-medium">
                          Transaction Notifications
                        </div>
                        <div className="text-sm text-gray-600">
                          Get notified for every transaction
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.transactions}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              transactions: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007DFE]"></div>
                      </label>
                    </div>

                    {/* Promos */}
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg">
                      <div>
                        <div className="font-medium">Promos & Offers</div>
                        <div className="text-sm text-gray-600">
                          Receive promotional offers and deals
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.promos}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              promos: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007DFE]"></div>
                      </label>
                    </div>

                    {/* Security Alerts */}
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg">
                      <div>
                        <div className="font-medium">Security Alerts</div>
                        <div className="text-sm text-gray-600">
                          Important security updates
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.security}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              security: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007DFE]"></div>
                      </label>
                    </div>

                    {/* Bills Reminder */}
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg">
                      <div>
                        <div className="font-medium">Bills Reminder</div>
                        <div className="text-sm text-gray-600">
                          Reminders for bill payments
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.bills}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              bills: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007DFE]"></div>
                      </label>
                    </div>

                    {/* App Updates */}
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg">
                      <div>
                        <div className="font-medium">App Updates</div>
                        <div className="text-sm text-gray-600">
                          New features and app updates
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.updates}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              updates: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007DFE]"></div>
                      </label>
                    </div>

                    <button className="bg-[#007DFE] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0066D6] transition-all flex items-center gap-2 mt-6">
                      <Save size={20} />
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Methods Tab */}
            {activeTab === "payment" && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Payment Methods</h2>
                    <button className="bg-[#007DFE] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#0066D6] transition-all">
                      Add New
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Bank Card */}
                    <div className="p-4 bg-white border border-gray-300 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                            <CreditCard size={24} className="text-white" />
                          </div>
                          <div>
                            <div className="font-medium">BDO ****1234</div>
                            <div className="text-sm text-gray-600">
                              Expires 12/25
                            </div>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          Default
                        </span>
                      </div>
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                        <button className="text-[#007DFE] text-sm font-medium hover:text-[#0066D6] transition-colors">
                          Edit
                        </button>
                        <button className="text-red-500 text-sm font-medium hover:text-red-600 transition-colors">
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Info Box */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex gap-3">
                        <Shield
                          size={20}
                          className="text-[#007DFE] flex-shrink-0 mt-0.5"
                        />
                        <div>
                          <div className="font-medium text-gray-900 mb-1">
                            Your payment methods are secure
                          </div>
                          <p className="text-sm text-gray-600">
                            All payment information is encrypted and stored
                            securely. GCash never shares your payment details
                            with merchants.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
