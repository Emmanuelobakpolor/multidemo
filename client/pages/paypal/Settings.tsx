"use client";

import { useState } from "react";
import {
  User,
  Shield,
  Bell,
  CreditCard,
  ChevronRight,
  Save,
  ArrowLeft,
  Mail,
  Lock,
  Key,
  Smartphone,
  Wallet,
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function PayPalSettings() {
  const [activeTab, setActiveTab] = useState("account");
  const [notifications, setNotifications] = useState({
    payments: true,
    requests: true,
    security: true,
    marketing: false,
    invoices: true,
  });
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
  });

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "payment", label: "Payment Methods", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "preferences", label: "Preferences", icon: Wallet },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/paypal"
              className="text-gray-600 hover:text-[#0070ba] transition-colors"
            >
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-xl font-semibold">Settings</h1>
          </div>
          <Link to="/paypal" className="flex items-center gap-2">
            <svg width="100" height="32" viewBox="0 0 100 32" fill="none">
              <text
                x="0"
                y="24"
                fontFamily="Verdana"
                fontSize="20"
                fontWeight="bold"
                fill="#003087"
              >
                Pay
              </text>
              <text
                x="35"
                y="24"
                fontFamily="Verdana"
                fontSize="20"
                fontWeight="bold"
                fill="#009cde"
              >
                Pal
              </text>
            </svg>
          </Link>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 h-fit shadow-sm">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? "bg-[#0070ba]/10 text-[#0070ba]"
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
            {/* Account Tab */}
            {activeTab === "account" && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold mb-6">
                    Account Information
                  </h2>

                  <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-full bg-[#0070ba]/10 flex items-center justify-center">
                        <User size={48} className="text-[#0070ba]" />
                      </div>
                      <button className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                        Change Photo
                      </button>
                    </div>

                    {/* Form Fields */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              firstName: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-[#0070ba] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              lastName: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-[#0070ba] transition-colors"
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
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              email: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:border-[#0070ba] transition-colors"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        This is your primary PayPal email
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Smartphone
                          size={20}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              phone: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:border-[#0070ba] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Country
                      </label>
                      <div className="relative">
                        <Globe
                          size={20}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <select
                          value={profileData.country}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              country: e.target.value,
                            })
                          }
                          className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:border-[#0070ba] transition-colors appearance-none"
                        >
                          <option>United States</option>
                          <option>United Kingdom</option>
                          <option>Canada</option>
                          <option>Australia</option>
                          <option>Germany</option>
                          <option>France</option>
                        </select>
                      </div>
                    </div>

                    <button className="bg-[#0070ba] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#005a94] transition-all flex items-center gap-2">
                      <Save size={20} />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold mb-6">
                    Security Settings
                  </h2>

                  <div className="space-y-6">
                    {/* Two-Factor Authentication */}
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0070ba]/10 rounded-full flex items-center justify-center">
                          <Key size={20} className="text-[#0070ba]" />
                        </div>
                        <div>
                          <div className="font-medium">
                            Two-Factor Authentication
                          </div>
                          <div className="text-sm text-gray-600">
                            Add an extra layer of security
                          </div>
                        </div>
                      </div>
                      <button className="bg-[#0070ba] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#005a94] transition-all">
                        Enable
                      </button>
                    </div>

                    {/* Security Key */}
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0070ba]/10 rounded-full flex items-center justify-center">
                          <Smartphone size={20} className="text-[#0070ba]" />
                        </div>
                        <div>
                          <div className="font-medium">Security Key</div>
                          <div className="text-sm text-gray-600">
                            Use a physical security key
                          </div>
                        </div>
                      </div>
                      <button className="text-[#0070ba] font-medium hover:text-[#005a94] transition-colors">
                        Add
                      </button>
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
                            className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:border-[#0070ba] transition-colors"
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
                            className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:border-[#0070ba] transition-colors"
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
                            className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:border-[#0070ba] transition-colors"
                          />
                        </div>
                      </div>
                      <button className="bg-[#0070ba] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#005a94] transition-all">
                        Update Password
                      </button>
                    </div>

                    {/* Login Activity */}
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0070ba]/10 rounded-full flex items-center justify-center">
                          <Shield size={20} className="text-[#0070ba]" />
                        </div>
                        <div>
                          <div className="font-medium">Login Activity</div>
                          <div className="text-sm text-gray-600">
                            View recent login activity
                          </div>
                        </div>
                      </div>
                      <button className="text-[#0070ba] font-medium hover:text-[#005a94] transition-colors">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Methods Tab */}
            {activeTab === "payment" && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Payment Methods</h2>
                    <button className="bg-[#0070ba] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#005a94] transition-all">
                      Link a Card or Bank
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Linked Card */}
                    <div className="p-4 bg-white border border-gray-300 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                            <CreditCard size={24} className="text-white" />
                          </div>
                          <div>
                            <div className="font-medium">Visa ****4242</div>
                            <div className="text-sm text-gray-600">
                              Expires 12/25
                            </div>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          Preferred
                        </span>
                      </div>
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                        <button className="text-[#0070ba] text-sm font-medium hover:text-[#005a94] transition-colors">
                          Edit
                        </button>
                        <button className="text-red-500 text-sm font-medium hover:text-red-600 transition-colors">
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Linked Bank */}
                    <div className="p-4 bg-white border border-gray-300 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center">
                            <Wallet size={24} className="text-white" />
                          </div>
                          <div>
                            <div className="font-medium">Chase Bank ****7890</div>
                            <div className="text-sm text-gray-600">
                              Checking Account
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                        <button className="text-[#0070ba] text-sm font-medium hover:text-[#005a94] transition-colors">
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
                          className="text-[#0070ba] flex-shrink-0 mt-0.5"
                        />
                        <div>
                          <div className="font-medium text-gray-900 mb-1">
                            Your payment information is secure
                          </div>
                          <p className="text-sm text-gray-600">
                            PayPal uses industry-leading security and fraud
                            prevention tools to keep your information safe.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold mb-6">
                    Notification Preferences
                  </h2>

                  <div className="space-y-4">
                    {/* Payments */}
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg">
                      <div>
                        <div className="font-medium">Payment Notifications</div>
                        <div className="text-sm text-gray-600">
                          When you send or receive money
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.payments}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              payments: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0070ba]"></div>
                      </label>
                    </div>

                    {/* Money Requests */}
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg">
                      <div>
                        <div className="font-medium">Money Requests</div>
                        <div className="text-sm text-gray-600">
                          When someone requests money from you
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.requests}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              requests: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0070ba]"></div>
                      </label>
                    </div>

                    {/* Security Alerts */}
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg">
                      <div>
                        <div className="font-medium">Security Alerts</div>
                        <div className="text-sm text-gray-600">
                          Important account security updates
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
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0070ba]"></div>
                      </label>
                    </div>

                    {/* Marketing */}
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg">
                      <div>
                        <div className="font-medium">Marketing & Offers</div>
                        <div className="text-sm text-gray-600">
                          Special offers and promotions
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.marketing}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              marketing: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0070ba]"></div>
                      </label>
                    </div>

                    {/* Invoices */}
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg">
                      <div>
                        <div className="font-medium">Invoice Notifications</div>
                        <div className="text-sm text-gray-600">
                          Updates about your invoices
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.invoices}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              invoices: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0070ba]"></div>
                      </label>
                    </div>

                    <button className="bg-[#0070ba] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#005a94] transition-all flex items-center gap-2 mt-6">
                      <Save size={20} />
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <h2 className="text-2xl font-semibold mb-6">
                    Account Preferences
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg">
                      <div>
                        <div className="font-medium">Language</div>
                        <div className="text-sm text-gray-600">
                          Choose your preferred language
                        </div>
                      </div>
                      <select className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-[#0070ba]">
                        <option>English</option>
                        <option>Español</option>
                        <option>Français</option>
                        <option>Deutsch</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg">
                      <div>
                        <div className="font-medium">Currency</div>
                        <div className="text-sm text-gray-600">
                          Primary currency for transactions
                        </div>
                      </div>
                      <select className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-[#0070ba]">
                        <option>USD - US Dollar</option>
                        <option>EUR - Euro</option>
                        <option>GBP - British Pound</option>
                        <option>CAD - Canadian Dollar</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white border border-gray-300 rounded-lg">
                      <div>
                        <div className="font-medium">Time Zone</div>
                        <div className="text-sm text-gray-600">
                          Your local time zone
                        </div>
                      </div>
                      <select className="bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-[#0070ba]">
                        <option>PST - Pacific Time</option>
                        <option>EST - Eastern Time</option>
                        <option>GMT - Greenwich Time</option>
                        <option>JST - Japan Time</option>
                      </select>
                    </div>

                    <button className="bg-[#0070ba] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#005a94] transition-all flex items-center gap-2 mt-6">
                      <Save size={20} />
                      Save Preferences
                    </button>
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
