"use client";

import React, { useState } from "react";
import { HeaderBar } from "@/components/HeaderBar";
import {
  CreditCard,
  Lock,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Wallet,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

export const TopUpScreen: React.FC = () => {
  const { navigateTo, topUpWallet, walletBalance } = useApp();

  const [amount, setAmount] = useState<string>("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const quickAmounts = [25, 50, 100, 200, 500, 1000];
  const parsedAmount = parseFloat(amount) || 0;

  // Format card number with spaces every 4 digits
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  // Format expiry as MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;

    // If user is deleting, just allow it
    if (val.length < expiry.length) {
      // If they deleted the slash, also remove the digit before it
      if (expiry.includes("/") && !val.includes("/")) {
        val = val.slice(0, 1);
      }
      setExpiry(val);
      return;
    }

    // Strip non-digits for processing
    const digits = val.replace(/\D/g, "").slice(0, 4);

    if (digits.length <= 2) {
      setExpiry(digits);
    } else {
      setExpiry(`${digits.slice(0, 2)}/${digits.slice(2)}`);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCvv(raw);
  };

  // Validation based on actual digit counts
  const cardDigits = cardNumber.replace(/\s/g, "").length;
  const expiryDigits = expiry.replace(/\D/g, "").length;

  const isFormValid =
    parsedAmount >= 5 &&
    cardDigits >= 15 &&
    cardName.trim().length >= 2 &&
    expiryDigits === 4 &&
    cvv.length >= 3;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsProcessing(true);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    topUpWallet(parsedAmount);
    setIsProcessing(false);
    setIsSuccess(true);

    // Navigate back after a moment
    setTimeout(() => {
      navigateTo("home");
    }, 2500);
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="flex-1 flex flex-col bg-slate-900 text-white pb-20">
        <HeaderBar title="Add Money" showBack onBack={() => navigateTo("home")} />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mb-5 animate-fadeIn">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-xl font-black text-white mb-1 animate-fadeIn">
            Wallet Funded!
          </h2>
          <p className="text-sm text-slate-400 mb-3 animate-fadeIn">
            ${parsedAmount.toFixed(2)} USD has been added to your account
          </p>
          <div className="px-5 py-3 rounded-2xl bg-slate-800/80 border border-slate-700 animate-fadeIn">
            <span className="text-xs text-slate-400 block">New Balance</span>
            <span className="text-2xl font-black text-emerald-400">
              ${(walletBalance).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-4 animate-fadeIn">
            Redirecting to home...
          </p>
        </div>
      </div>
    );
  }

  // Processing state
  if (isProcessing) {
    return (
      <div className="flex-1 flex flex-col bg-slate-900 text-white pb-20">
        <HeaderBar title="Add Money" showBack onBack={() => navigateTo("home")} />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin mb-5"></div>
          <h2 className="text-lg font-bold text-white mb-1">
            Processing Payment...
          </h2>
          <p className="text-sm text-slate-400">
            Verifying your card and adding funds
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-white pb-20">
      <HeaderBar title="Add Money" showBack onBack={() => navigateTo("home")} />

      <div className="p-4 space-y-5 overflow-y-auto flex-1">
        {/* Current Balance Info */}
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Current Balance
            </span>
            <span className="text-lg font-black text-white">
              ${walletBalance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 block">
            Amount to Add (USD)
          </label>
          <div className="p-4 rounded-2xl bg-slate-800 border border-indigo-500/30 focus-within:border-indigo-500 transition-all shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-2xl text-slate-400 font-bold">$</span>
              <input
                type="number"
                min="5"
                max="10000"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent text-white font-extrabold text-2xl focus:outline-none"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Quick Amount Chips */}
          <div className="flex flex-wrap gap-2">
            {quickAmounts.map((qa) => (
              <button
                key={qa}
                onClick={() => setAmount(qa.toString())}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                  parsedAmount === qa
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                    : "bg-slate-800 text-slate-300 border border-slate-700 hover:border-indigo-500/50"
                }`}
              >
                ${qa.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* Card Details Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-indigo-400" />
            <label className="text-xs font-bold text-slate-300">
              Card Details
            </label>
          </div>

          {/* Card Number */}
          <div>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={handleCardNumberChange}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-3 text-sm text-white font-mono tracking-wider focus:outline-none focus:border-indigo-500 transition-colors"
              inputMode="numeric"
            />
          </div>

          {/* Cardholder Name */}
          <div>
            <input
              type="text"
              placeholder="Cardholder Name"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Expiry + CVV Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={handleExpiryChange}
                maxLength={5}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-3 text-sm text-white font-mono focus:outline-none focus:border-indigo-500 transition-colors"
                inputMode="numeric"
              />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="CVV"
                value={cvv}
                onChange={handleCvvChange}
                maxLength={4}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-3 text-sm text-white font-mono tracking-widest focus:outline-none focus:border-indigo-500 transition-colors"
                inputMode="numeric"
              />
              <Lock className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Security Badge */}
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">
            256-bit SSL encryption · PCI DSS compliant
          </span>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
        >
          <CreditCard className="w-4 h-4 text-indigo-200" />
          <span>
            {parsedAmount > 0
              ? `Add $${parsedAmount.toFixed(2)} to Wallet`
              : "Enter Amount to Continue"}
          </span>
        </button>

        {/* Fine Print */}
        <p className="text-[10px] text-slate-500 text-center leading-relaxed">
          By proceeding, you authorize Sendora to charge your card for the
          specified amount. Funds are available instantly for sending.
        </p>
      </div>
    </div>
  );
};
