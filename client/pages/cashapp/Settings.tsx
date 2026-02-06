"use client";

import { useState } from "react";
import {
  User,
  Shield,
  Bell,
  CreditCard,
  ChevronRight,
  Eye,
  EyeOff,
  Save,
  ArrowLeft,
  Smartphone,
  Mail,
  Lock,
  DollarSign,
  Key,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function CashAppSettings() {
  const [activeTab, setActiveTab] = useState("account");
  const [notifications, setNotifications] = useState({
    payments: true,
    requests: true,
    deposits: true,
    security: true,
    promotions: false,
  });
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cashtag: "",
  });
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    showCashtag: true,
    allowRequests: true,
  });

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "card", label: "Cash Card", icon: CreditCard },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black border-b border-[#2B2B2B]">
        <div className="max-w-[1200px] mx-auto px-6 h-[72px] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/cashapp"
              className="text-white hover:text-[#00D632] transition-colors"
            >
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-xl font-semibold">Settings</h1>
          </div>
          <Link to="/cashapp" className="flex items-center gap-2">
            <img
              src="/images/cashapp_logo.png"
              alt="Cash App Logo"
              className="h-10 w-auto"
            />
          </Link>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-4 h-fit">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? "bg-[#00D632]/10 text-[#00D632]"
                        : "text-[#EAECEF] hover:bg-[#2B2B2B]"
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
                <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-6">
                  <h2 className="text-2xl font-semibold mb-6">
                    Account Information
                  </h2>

                  <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-full bg-[#00D632]/10 flex items-center justify-center">
                        <User size={48} className="text-[#00D632]" />
                      </div>
                      <button className="bg-[#2B2B2B] text-white px-4 py-2 rounded-lg hover:bg-[#3B3B3B] transition-colors">
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
                          className="w-full bg-black border border-[#2B2B2B] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00D632] transition-colors"
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
                          className="w-full bg-black border border-[#2B2B2B] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00D632] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-[#848E9C] mb-2">
                        $Cashtag
                      </label>
                      <div className="relative">
                        <DollarSign
                          size={20}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#848E9C]"
                        />
                        <input
                          type="text"
                          value={profileData.cashtag}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              cashtag: e.target.value,
                            })
                          }
                          className="w-full bg-black border border-[#2B2B2B] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#00D632] transition-colors"
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
                          className="w-full bg-black border border-[#2B2B2B] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#00D632] transition-colors"
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
                          className="w-full bg-black border border-[#2B2B2B] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#00D632] transition-colors"
                        />
                      </div>
                    </div>

                    <button className="bg-[#00D632] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00E639] transition-all flex items-center gap-2">
                      <Save size={20} />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Cash Card Tab */}
            {activeTab === "card" && (
              <div className="space-y-6">
                <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-6">
                  <h2 className="text-2xl font-semibold mb-6">Cash Card</h2>

                  {/* Card Preview */}
                  <div className="mb-8">
                    <div className="relative w-full max-w-[400px] aspect-[1.586/1] bg-gradient-to-br from-[#00D632] to-[#00A826] rounded-2xl p-6 shadow-2xl">
                      <div className="flex justify-between items-start mb-8">
                        <div className="text-black font-bold text-xl">
                          Cash App
                        </div>
                      </div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="text-black text-2xl font-semibold mb-2">
                          {profileData.cashtag}
                        </div>
                        <div className="text-black/70 text-sm">
                          {profileData.firstName} {profileData.lastName}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-black border border-[#2B2B2B] rounded-lg">
                      <div>
                        <div className="font-medium">Card Status</div>
                        <div className="text-sm text-[#848E9C]">Active</div>
                      </div>
                      <span className="px-3 py-1 bg-[#00D632]/10 text-[#00D632] text-sm rounded-full">
                        Active
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-black border border-[#2B2B2B] rounded-lg">
                      <div>
                        <div className="font-medium">Card Design</div>
                        <div className="text-sm text-[#848E9C]">
                          Customize your card appearance
                        </div>
                      </div>
                      <button className="text-[#00D632] font-medium hover:text-[#00E639] transition-colors">
                        Change
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-black border border-[#2B2B2B] rounded-lg">
                      <div>
                        <div className="font-medium">Lock Card</div>
                        <div className="text-sm text-[#848E9C]">
                          Temporarily disable your card
                        </div>
                      </div>
                      <button className="bg-[#2B2B2B] text-white px-4 py-2 rounded-lg hover:bg-[#3B3B3B] transition-colors">
                        Lock
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-black border border-[#2B2B2B] rounded-lg">
                      <div>
                        <div className="font-medium">Report Lost or Stolen</div>
                        <div className="text-sm text-[#848E9C]">
                          Deactivate and order a replacement
                        </div>
                      </div>
                      <button className="text-red-500 font-medium hover:text-red-600 transition-colors">
                        Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-6">
                  <h2 className="text-2xl font-semibold mb-6">
                    Security Settings
                  </h2>

                  <div className="space-y-6">
                    {/* PIN */}
                    <div className="flex items-center justify-between p-4 bg-black border border-[#2B2B2B] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#00D632]/10 rounded-full flex items-center justify-center">
                          <Key size={20} className="text-[#00D632]" />
                        </div>
                        <div>
                          <div className="font-medium">PIN</div>
                          <div className="text-sm text-[#848E9C]">
                            Set a 4-digit PIN for transactions
                          </div>
                        </div>
                      </div>
                      <button className="bg-[#00D632] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#00E639] transition-all">
                        Change
                      </button>
                    </div>

                    {/* Touch ID */}
                    <div className="flex items-center justify-between p-4 bg-black border border-[#2B2B2B] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#00D632]/10 rounded-full flex items-center justify-center">
                          <Smartphone size={20} className="text-[#00D632]" />
                        </div>
                        <div>
                          <div className="font-medium">Touch ID / Face ID</div>
                          <div className="text-sm text-[#848E9C]">
                            Use biometrics to unlock
                          </div>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-[#2B2B2B] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D632]"></div>
                      </label>
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
                            className="w-full bg-black border border-[#2B2B2B] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#00D632] transition-colors"
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
                            className="w-full bg-black border border-[#2B2B2B] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#00D632] transition-colors"
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
                            className="w-full bg-black border border-[#2B2B2B] rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#00D632] transition-colors"
                          />
                        </div>
                      </div>
                      <button className="bg-[#00D632] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00E639] transition-all">
                        Update Password
                      </button>
                    </div>

                    {/* Security Activity */}
                    <div className="flex items-center justify-between p-4 bg-black border border-[#2B2B2B] rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#00D632]/10 rounded-full flex items-center justify-center">
                          <Shield size={20} className="text-[#00D632]" />
                        </div>
                        <div>
                          <div className="font-medium">Security Activity</div>
                          <div className="text-sm text-[#848E9C]">
                            View recent security events
                          </div>
                        </div>
                      </div>
                      <button className="text-[#00D632] font-medium hover:text-[#00E639] transition-colors">
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
                <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-6">
                  <h2 className="text-2xl font-semibold mb-6">
                    Notification Preferences
                  </h2>

                  <div className="space-y-4">
                    {/* Payments */}
                    <div className="flex items-center justify-between p-4 bg-black border border-[#2B2B2B] rounded-lg">
                      <div>
                        <div className="font-medium">Payment Notifications</div>
                        <div className="text-sm text-[#848E9C]">
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
                        <div className="w-11 h-6 bg-[#2B2B2B] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D632]"></div>
                      </label>
                    </div>

                    {/* Requests */}
                    <div className="flex items-center justify-between p-4 bg-black border border-[#2B2B2B] rounded-lg">
                      <div>
                        <div className="font-medium">Payment Requests</div>
                        <div className="text-sm text-[#848E9C]">
                          When someone requests money
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
                        <div className="w-11 h-6 bg-[#2B2B2B] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D632]"></div>
                      </label>
                    </div>

                    {/* Deposits */}
                    <div className="flex items-center justify-between p-4 bg-black border border-[#2B2B2B] rounded-lg">
                      <div>
                        <div className="font-medium">Direct Deposits</div>
                        <div className="text-sm text-[#848E9C]">
                          When you receive a direct deposit
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
                        <div className="w-11 h-6 bg-[#2B2B2B] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D632]"></div>
                      </label>
                    </div>

                    {/* Security Alerts */}
                    <div className="flex items-center justify-between p-4 bg-black border border-[#2B2B2B] rounded-lg">
                      <div>
                        <div className="font-medium">Security Alerts</div>
                        <div className="text-sm text-[#848E9C]">
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
                        <div className="w-11 h-6 bg-[#2B2B2B] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D632]"></div>
                      </label>
                    </div>

                    {/* Promotions */}
                    <div className="flex items-center justify-between p-4 bg-black border border-[#2B2B2B] rounded-lg">
                      <div>
                        <div className="font-medium">Promotions & Offers</div>
                        <div className="text-sm text-[#848E9C]">
                          Special offers and promotions
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.promotions}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              promotions: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#2B2B2B] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D632]"></div>
                      </label>
                    </div>

                    <button className="bg-[#00D632] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00E639] transition-all flex items-center gap-2 mt-6">
                      <Save size={20} />
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-6">
                  <h2 className="text-2xl font-semibold mb-6">Privacy Settings</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-black border border-[#2B2B2B] rounded-lg">
                      <div>
                        <div className="font-medium">Public Profile</div>
                        <div className="text-sm text-[#848E9C]">
                          Allow others to find you
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacySettings.publicProfile}
                          onChange={(e) =>
                            setPrivacySettings({
                              ...privacySettings,
                              publicProfile: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#2B2B2B] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D632]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-black border border-[#2B2B2B] rounded-lg">
                      <div>
                        <div className="font-medium">Show $Cashtag</div>
                        <div className="text-sm text-[#848E9C]">
                          Display your $Cashtag publicly
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacySettings.showCashtag}
                          onChange={(e) =>
                            setPrivacySettings({
                              ...privacySettings,
                              showCashtag: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#2B2B2B] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D632]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-black border border-[#2B2B2B] rounded-lg">
                      <div>
                        <div className="font-medium">Allow Payment Requests</div>
                        <div className="text-sm text-[#848E9C]">
                          Let others request money from you
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacySettings.allowRequests}
                          onChange={(e) =>
                            setPrivacySettings({
                              ...privacySettings,
                              allowRequests: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-[#2B2B2B] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00D632]"></div>
                      </label>
                    </div>

                    <div className="p-4 bg-[#00D632]/10 border border-[#00D632]/30 rounded-lg mt-6">
                      <div className="flex gap-3">
                        <Shield
                          size={20}
                          className="text-[#00D632] flex-shrink-0 mt-0.5"
                        />
                        <div>
                          <div className="font-medium text-white mb-1">
                            Your Privacy Matters
                          </div>
                          <p className="text-sm text-[#B7BDC6]">
                            Cash App will never ask for your PIN, password, or
                            security code. We encrypt all your data and
                            transactions to keep your information safe.
                          </p>
                        </div>
                      </div>
                    </div>

                    <button className="bg-[#00D632] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#00E639] transition-all flex items-center gap-2 mt-6">
                      <Save size={20} />
                      Save Settings
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
