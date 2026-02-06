"use client";

import { useState } from "react";
import { Menu, X, Shield, DollarSign, Globe, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function PayFlowLanding() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-[#CBD2D9] sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-[60px]">
            {/* Menu Button - Left */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-[#CBD2D9] rounded-full text-[#2c2e2f] text-sm font-medium hover:bg-[#F5F7FA] transition-colors"
            >
              {menuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
              <span>Menu</span>
            </button>

             {/* PayPal Logo - Center */}
            <Link
              to="/paypal"
              className="absolute left-1/2 transform -translate-x-1/2"
            >
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

            {/* Log In Button - Right */}
            <Link
              to="/paypal/login"
              className="px-6 py-2 border border-[#0070ba] text-[#0070ba] rounded-full text-sm font-medium hover:bg-[#F5F7FA] transition-colors"
            >
              Log In
            </Link>
          </div>

          {/* Mobile Menu Dropdown */}
          {menuOpen && (
            <div className="border-t border-[#CBD2D9] py-4">
              <nav className="flex flex-col gap-3">
            <Link
              to="/paypal/dashboard"
              className="text-[#2c2e2f] hover:text-[#0070ba] text-sm font-medium px-4 py-2"
            >
              Dashboard
            </Link>
            <Link
              to="/paypal/wallet"
              className="text-[#2c2e2f] hover:text-[#0070ba] text-sm font-medium px-4 py-2"
            >
              Wallet
            </Link>
            <Link
              to="/paypal/send"
              className="text-[#2c2e2f] hover:text-[#0070ba] text-sm font-medium px-4 py-2"
            >
              Send & Request
            </Link>
            <Link
              to="/paypal/settings"
              className="text-[#2c2e2f] hover:text-[#0070ba] text-sm font-medium px-4 py-2"
            >
              Settings
            </Link>
            <Link
              to="/paypal/help"
              className="text-[#2c2e2f] hover:text-[#0070ba] text-sm font-medium px-4 py-2"
            >
              Help
            </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[500px] sm:h-[600px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/images/homepage-hero-1x.jpg" 
            alt="Business professionals using online payment system" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-/80 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center px-4 max-w-[600px]">
            <h1 className="text-white text-[36px] sm:text-[48px] font-light mb-8 drop-shadow-lg">
              The simpler, safer way to pay online.
            </h1>
            <Link
              to="/paypal/register"
              className="inline-block bg-[#0070ba] hover:bg-[#005ea6] text-white px-12 py-4 rounded-full text-base font-semibold transition-colors shadow-lg"
            >
              Sign Up for Free
            </Link>
            <p className="text-white text-sm mt-6 drop-shadow">
              Own a business?{" "}
              <a href="#business" className="underline hover:no-underline">
                Open a Business account.
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* PayPal is for Everyone Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-[#2c2e2f] text-[32px] sm:text-[40px] font-light mb-16">
            PayPal is for everyone who pays online.
          </h2>

          <div className="max-w-[400px] mx-auto">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 text-[#0070ba]">
                <svg viewBox="0 0 64 64" fill="currentColor">
                  <path d="M32 4c15.464 0 28 12.536 28 28S47.464 60 32 60 4 47.464 4 32 16.536 4 32 4zm0 4C18.745 8 8 18.745 8 32s10.745 24 24 24 24-10.745 24-24S45.255 8 32 8zm0 8c8.837 0 16 7.163 16 16s-7.163 16-16 16-16-7.163-16-16 7.163-16 16-16z" />
                </svg>
              </div>
              <h3 className="text-[#2c2e2f] text-xl font-medium mb-3">
                Individuals
              </h3>
              <p className="text-[#687173] text-sm mb-6">
                Find out why we have more than 200M active accounts worldwide.
              </p>
              <a
                href="#individuals"
                className="inline-block px-8 py-3 border border-[#0070ba] text-[#0070ba] rounded-full text-sm font-semibold hover:bg-[#F5F7FA] transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-[#F5F7FA]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <h2 className="text-[#2c2e2f] text-[32px] sm:text-[40px] font-light mb-4 text-center">
            PayPal connects buyers and sellers.
          </h2>
          <p className="text-[#687173] text-center mb-12">For buyers</p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Step 1 */}
            <div className="bg-white rounded-lg border border-[#CBD2D9] p-6 text-center">
              <div className="w-12 h-12 bg-[#0070ba] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <div className="mb-4 h-32 flex items-center justify-center">
                <div className="text-[#0070ba] text-6xl">📧</div>
              </div>
              <p className="text-[#2c2e2f] text-sm font-medium">
                Sign up with just an email address and password.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-lg border border-[#CBD2D9] p-6 text-center">
              <div className="w-12 h-12 bg-[#0070ba] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <div className="mb-4 h-32 flex items-center justify-center">
                <div className="text-[#0070ba] text-6xl">💳</div>
              </div>
              <p className="text-[#2c2e2f] text-sm font-medium">
                Securely add your cards.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-lg border border-[#CBD2D9] p-6 text-center">
              <div className="w-12 h-12 bg-[#0070ba] text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <div className="mb-4 h-32 flex items-center justify-center">
                <div className="text-[#0070ba] text-6xl">🛍️</div>
              </div>
              <p className="text-[#2c2e2f] text-sm font-medium">
                Use the PayPal button with just an email address and password.
              </p>
            </div>
          </div>

          <div className="text-center">
            <a
              href="#learn"
              className="inline-block px-8 py-3 border border-[#0070ba] text-[#0070ba] rounded-full text-sm font-semibold hover:bg-white transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Join 200M Section - Dark Blue */}
      <section className="py-20 bg-[#003087] text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <h2 className="text-[32px] sm:text-[40px] font-light mb-16 text-center">
            Join 200M active PayPal accounts worldwide.
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Safer and Protected */}
            <div>
              <h3 className="text-2xl font-medium mb-4">Safer and protected</h3>
              <p className="text-[#E1E7F5] text-sm leading-relaxed mb-6">
                Shop with peace of mind. We don't share your full financial
                information with sellers. And PayPal Buyer Protection covers
                your eligible purchases if they don't show up or match their
                description.
              </p>
              <a
                href="#security"
                className="text-white text-sm font-medium underline hover:no-underline"
              >
                More about security
              </a>
            </div>

            {/* Mostly Free */}
            <div>
              <h3 className="text-2xl font-medium mb-4">
                Mostly free, always upfront
              </h3>
              <p className="text-[#E1E7F5] text-sm leading-relaxed mb-6">
                It's free to open a PayPal account and buy something using
                PayPal unless it involves a currency conversion.
              </p>
              <a
                href="#fees"
                className="text-white text-sm font-medium underline hover:no-underline"
              >
                More about fees
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-[600px] mx-auto px-4 text-center">
          <h2 className="text-[#2c2e2f] text-[32px] font-light mb-8">
            Sign up and get started.
          </h2>
            <Link
              to="/paypal/register"
              className="inline-block bg-[#0070ba] hover:bg-[#005ea6] text-white px-12 py-4 rounded-full text-base font-semibold transition-colors"
            >
              Get Started
            </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#F5F7FA] border-t border-[#CBD2D9] py-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          {/* PayPal Icon */}
          <div className="mb-8">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <text
                x="5"
                y="28"
                fill="#003087"
                fontSize="24"
                fontWeight="bold"
                fontFamily="Verdana, sans-serif"
              >
                P
              </text>
            </svg>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div>
              <a
                href="#"
                className="block text-[#2c2e2f] text-sm font-medium hover:text-[#0070ba] mb-2"
              >
                Help
              </a>
              <a
                href="#"
                className="block text-[#2c2e2f] text-sm font-medium hover:text-[#0070ba] mb-2"
              >
                Contact
              </a>
              <a
                href="#"
                className="block text-[#2c2e2f] text-sm font-medium hover:text-[#0070ba] mb-2"
              >
                Fees
              </a>
            </div>
            <div>
              <a
                href="#"
                className="block text-[#2c2e2f] text-sm font-medium hover:text-[#0070ba] mb-2"
              >
                Security
              </a>
              <a
                href="#"
                className="block text-[#2c2e2f] text-sm font-medium hover:text-[#0070ba] mb-2"
              >
                Features
              </a>
              <a
                href="#"
                className="block text-[#2c2e2f] text-sm font-medium hover:text-[#0070ba] mb-2"
              >
                Shop
              </a>
            </div>
            <div>
              <a
                href="#"
                className="block text-[#2c2e2f] text-sm font-medium hover:text-[#0070ba] mb-2"
              >
                About
              </a>
              <a
                href="#"
                className="block text-[#2c2e2f] text-sm font-medium hover:text-[#0070ba] mb-2"
              >
                Newsroom
              </a>
              <a
                href="#"
                className="block text-[#2c2e2f] text-sm font-medium hover:text-[#0070ba] mb-2"
              >
                Jobs
              </a>
            </div>
            <div>
              <a
                href="#"
                className="block text-[#2c2e2f] text-sm font-medium hover:text-[#0070ba] mb-2"
              >
                Developers
              </a>
            </div>
          </div>

          {/* Legal Links */}
          <div className="border-t border-[#CBD2D9] pt-6">
            <div className="flex flex-wrap gap-4 text-xs text-[#687173] mb-4">
              <span>© 1999–2025 All rights reserved.</span>
              <a href="#" className="hover:underline">
                Accessibility
              </a>
              <a href="#" className="hover:underline">
                Cookies
              </a>
              <a href="#" className="hover:underline">
                Privacy
              </a>
              <a href="#" className="hover:underline">
                Legal
              </a>
            </div>
            <p className="text-xs text-[#687173]">
              PayPal Pte. Ltd. is licensed by the Monetary Authority of
              Singapore as a Major Payment Institution under the Payment
              Services Act 2019.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}



