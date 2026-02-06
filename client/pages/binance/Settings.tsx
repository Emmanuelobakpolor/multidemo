"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  User,
  Shield,
  Bell,
  Key,
  ChevronRight,
  Eye,
  EyeOff,
  Save,
  ArrowLeft,
  Smartphone,
  Mail,
  Lock,
  Globe,
  CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/binance/PageTransition";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function BinanceSettings() {
  const prefersReducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState("profile");
  const [showApiKey, setShowApiKey] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    trades: true,
    deposits: false,
    withdrawals: true,
    news: false,
  });
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "api", label: "API Keys", icon: Key },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B0E11] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#181A20] border-b border-[#2B3139]">
        <div className="max-w-[1440px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/binance" className="flex items-center gap-2">
              <img
                src="/images/download.png"
                alt="Binance Logo"
                className="h-20 w-auto"
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-6 text-sm">
              <Link to="/binance/dashboard" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors">Dashboard</Link>
              <a href="#" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors">Markets</a>
              <a href="#" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors">Trade</a>
              <a href="#" className="text-[#EAECEF] hover:text-[#F0B90B] transition-colors">Earn</a>
              <Link to="/binance/settings" className="text-[#F0B90B] hover:text-[#F8D12F] transition-colors font-medium">Settings</Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/binance/login"
              className="text-[#EAECEF] hover:text-[#F0B90B] text-sm font-medium px-4 py-2 transition-colors hidden lg:block"
            >
              Log In
            </Link>
            <Link
              to="/binance/register"
              className="bg-[#F0B90B] text-[#0B0E11] px-6 py-2.5 rounded font-semibold text-sm hover:bg-[#F8D12F] transition-all hidden lg:block"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-4 h-fit">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={prefersReducedMotion ? {} : { scale: 1.02, x: 4 }}
                    whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? "text-[#F0B90B]"
                        : "text-[#EAECEF] hover:bg-[#2B3139]"
                    }`}
                  >
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 bg-[#F0B90B]/10 rounded-lg"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon size={20} className="relative z-10" />
                    <span className="font-medium relative z-10">{tab.label}</span>
                    <ChevronRight
                      size={16}
                      className="ml-auto relative z-10"
                      style={{
                        opacity: activeTab === tab.id ? 1 : 0.3,
                      }}
                    />
                  </motion.button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-6">
                  <h2 className="text-2xl font-semibold mb-6">
                    Profile Information
                  </h2>

                  <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-full bg-[#F0B90B]/10 flex items-center justify-center">
                        <User size={48} className="text-[#F0B90B]" />
                      </div>
                      <button className="bg-[#2B3139] text-white px-4 py-2 rounded-lg hover:bg-[#3B4149] transition-colors">
                        Change Photo
                      </button>
                    </div>

                    {/* Form Fields */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-[#848E9C] mb-2">
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
                          className="w-full bg-[#0B0E11] border border-[#2B3139] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F0B90B] transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-[#848E9C] mb-2">
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
                          className="w-full bg-[#0B0E11] border border-[#2B3139] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F0B90B] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-[#848E9C] mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail
                          size={20}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#848E9C]"
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
                          className="w-full bg-[#0B0E11] border border-[#2B3139] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#F0B90B] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-[#848E9C] mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Smartphone
                          size={20}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#848E9C]"
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
                          className="w-full bg-[#0B0E11] border border-[#2B3139] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#F0B90B] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-[#848E9C] mb-2">
                        Country
                      </label>
                      <div className="relative">
                        <Globe
                          size={20}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#848E9C]"
                        />
                        <select
                          value={profileData.country}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              country: e.target.value,
                            })
                          }
                          className="w-full bg-[#0B0E11] border border-[#2B3139] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#F0B90B] transition-colors appearance-none"
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

                    <button className="bg-[#F0B90B] text-[#0B0E11] px-6 py-3 rounded-lg font-semibold hover:bg-[#F8D12F] transition-all flex items-center gap-2">
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
                <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-6">
                  <h2 className="text-2xl font-semibold mb-6">
                    Security Settings
                  </h2>

                  <div className="space-y-6">
                    {/* Two-Factor Authentication */}
                    <div className="flex items-center justify-between p-4 bg-[#0B0E11] border border-[#2B3139] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#F0B90B]/10 rounded-full flex items-center justify-center">
                          <Smartphone size={20} className="text-[#F0B90B]" />
                        </div>
                        <div>
                          <div className="font-medium">
                            Two-Factor Authentication
                          </div>
                          <div className="text-sm text-[#848E9C]">
                            Add an extra layer of security
                          </div>
                        </div>
                      </div>
                      <button className="bg-[#F0B90B] text-[#0B0E11] px-4 py-2 rounded-lg font-medium hover:bg-[#F8D12F] transition-all">
                        Enable
                      </button>
                    </div>

                    {/* Change Password */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Change Password</h3>
                      <div>
                        <label className="block text-sm text-[#848E9C] mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <Lock
                            size={20}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#848E9C]"
                          />
                          <input
                            type="password"
                            placeholder="Enter current password"
                            className="w-full bg-[#0B0E11] border border-[#2B3139] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#F0B90B] transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-[#848E9C] mb-2">
                          New Password
                        </label>
                        <div className="relative">
                          <Lock
                            size={20}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#848E9C]"
                          />
                          <input
                            type="password"
                            placeholder="Enter new password"
                            className="w-full bg-[#0B0E11] border border-[#2B3139] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#F0B90B] transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-[#848E9C] mb-2">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <Lock
                            size={20}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#848E9C]"
                          />
                          <input
                            type="password"
                            placeholder="Confirm new password"
                            className="w-full bg-[#0B0E11] border border-[#2B3139] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#F0B90B] transition-colors"
                          />
                        </div>
                      </div>
                      <button className="bg-[#F0B90B] text-[#0B0E11] px-6 py-3 rounded-lg font-semibold hover:bg-[#F8D12F] transition-all">
                        Update Password
                      </button>
                    </div>

                    {/* Security Questions */}
                    <div className="flex items-center justify-between p-4 bg-[#0B0E11] border border-[#2B3139] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#F0B90B]/10 rounded-full flex items-center justify-center">
                          <Shield size={20} className="text-[#F0B90B]" />
                        </div>
                        <div>
                          <div className="font-medium">Security Questions</div>
                          <div className="text-sm text-[#848E9C]">
                            Set up recovery questions
                          </div>
                        </div>
                      </div>
                      <button className="text-[#F0B90B] font-medium hover:text-[#F8D12F] transition-colors">
                        Configure
                      </button>
                    </div>

                    {/* Login History */}
                    <div className="flex items-center justify-between p-4 bg-[#0B0E11] border border-[#2B3139] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#F0B90B]/10 rounded-full flex items-center justify-center">
                          <Globe size={20} className="text-[#F0B90B]" />
                        </div>
                        <div>
                          <div className="font-medium">Login History</div>
                          <div className="text-sm text-[#848E9C]">
                            View recent login activity
                          </div>
                        </div>
                      </div>
                      <button className="text-[#F0B90B] font-medium hover:text-[#F8D12F] transition-colors">
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
                <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-6">
                  <h2 className="text-2xl font-semibold mb-6">
                    Notification Preferences
                  </h2>

                  <div className="space-y-4">
                    {/* Email Notifications */}
                    <div className="flex items-center justify-between p-4 bg-[#0B0E11] border border-[#2B3139] rounded-lg">
                      <div>
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-sm text-[#848E9C]">
                          Receive updates via email
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.email}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              email: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#2B3139] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F0B90B]"></div>
                      </label>
                    </div>

                    {/* SMS Notifications */}
                    <div className="flex items-center justify-between p-4 bg-[#0B0E11] border border-[#2B3139] rounded-lg">
                      <div>
                        <div className="font-medium">SMS Notifications</div>
                        <div className="text-sm text-[#848E9C]">
                          Receive alerts via SMS
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.sms}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              sms: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#2B3139] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F0B90B]"></div>
                      </label>
                    </div>

                    {/* Trade Notifications */}
                    <div className="flex items-center justify-between p-4 bg-[#0B0E11] border border-[#2B3139] rounded-lg">
                      <div>
                        <div className="font-medium">Trade Notifications</div>
                        <div className="text-sm text-[#848E9C]">
                          Get notified about your trades
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.trades}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              trades: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#2B3139] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F0B90B]"></div>
                      </label>
                    </div>

                    {/* Deposit Notifications */}
                    <div className="flex items-center justify-between p-4 bg-[#0B0E11] border border-[#2B3139] rounded-lg">
                      <div>
                        <div className="font-medium">Deposit Notifications</div>
                        <div className="text-sm text-[#848E9C]">
                          Alert me about deposits
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.deposits}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              deposits: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#2B3139] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F0B90B]"></div>
                      </label>
                    </div>

                    {/* Withdrawal Notifications */}
                    <div className="flex items-center justify-between p-4 bg-[#0B0E11] border border-[#2B3139] rounded-lg">
                      <div>
                        <div className="font-medium">
                          Withdrawal Notifications
                        </div>
                        <div className="text-sm text-[#848E9C]">
                          Alert me about withdrawals
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.withdrawals}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              withdrawals: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#2B3139] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F0B90B]"></div>
                      </label>
                    </div>

                    {/* News & Updates */}
                    <div className="flex items-center justify-between p-4 bg-[#0B0E11] border border-[#2B3139] rounded-lg">
                      <div>
                        <div className="font-medium">News & Updates</div>
                        <div className="text-sm text-[#848E9C]">
                          Market news and platform updates
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.news}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              news: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#2B3139] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F0B90B]"></div>
                      </label>
                    </div>

                    <button className="bg-[#F0B90B] text-[#0B0E11] px-6 py-3 rounded-lg font-semibold hover:bg-[#F8D12F] transition-all flex items-center gap-2 mt-6">
                      <Save size={20} />
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* API Keys Tab */}
            {activeTab === "api" && (
              <div className="space-y-6">
                <div className="bg-[#1E2329] border border-[#2B3139] rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">API Keys</h2>
                    <button className="bg-[#F0B90B] text-[#0B0E11] px-4 py-2 rounded-lg font-medium hover:bg-[#F8D12F] transition-all">
                      Create New Key
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* API Key Card */}
                    <div className="p-4 bg-[#0B0E11] border border-[#2B3139] rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="font-medium">Production API Key</div>
                          <div className="text-sm text-[#848E9C]">
                            Created: Jan 15, 2024
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-[#0ECB81]/10 text-[#0ECB81] text-xs rounded-full">
                            Active
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-[#848E9C] mb-2">
                            API Key
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type={showApiKey ? "text" : "password"}
                              value="ak_live_1234567890abcdef"
                              readOnly
                              className="flex-1 bg-[#1E2329] border border-[#2B3139] rounded-lg px-4 py-2 text-white"
                            />
                            <button
                              onClick={() => setShowApiKey(!showApiKey)}
                              className="p-2 hover:bg-[#2B3139] rounded-lg transition-colors"
                            >
                              {showApiKey ? (
                                <EyeOff size={20} />
                              ) : (
                                <Eye size={20} />
                              )}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm text-[#848E9C] mb-2">
                            Permissions
                          </label>
                          <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 bg-[#2B3139] text-white text-sm rounded-full">
                              Read
                            </span>
                            <span className="px-3 py-1 bg-[#2B3139] text-white text-sm rounded-full">
                              Trade
                            </span>
                            <span className="px-3 py-1 bg-[#2B3139] text-white text-sm rounded-full">
                              Withdraw
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#2B3139]">
                        <button className="text-[#F0B90B] text-sm font-medium hover:text-[#F8D12F] transition-colors">
                          Edit Permissions
                        </button>
                        <button className="text-[#F6465D] text-sm font-medium hover:text-[#FF6B84] transition-colors">
                          Revoke
                        </button>
                      </div>
                    </div>

                    {/* Info Box */}
                    <div className="p-4 bg-[#F0B90B]/10 border border-[#F0B90B]/30 rounded-lg">
                      <div className="flex gap-3">
                        <Shield
                          size={20}
                          className="text-[#F0B90B] flex-shrink-0 mt-0.5"
                        />
                        <div>
                          <div className="font-medium text-white mb-1">
                            Security Best Practices
                          </div>
                          <ul className="text-sm text-[#B7BDC6] space-y-1">
                            <li>• Never share your API keys with anyone</li>
                            <li>
                              • Use IP whitelisting to restrict key access
                            </li>
                            <li>
                              • Regularly rotate your keys for better security
                            </li>
                            <li>• Disable keys when not in use</li>
                          </ul>
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
    </PageTransition>
  );
}
