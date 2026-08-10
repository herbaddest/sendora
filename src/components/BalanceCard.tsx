"use client";

import React, { useState } from "react";
import { Eye, EyeOff, ArrowUpRight, ArrowDownLeft, Plus, Wallet, Send, Clock } from "lucide-react";
import { useApp } from "@/context/AppContext";

export const BalanceCard: React.FC = () => {
  const { user, transfers, walletBalance, initiateSendFlow, navigateTo } = useApp();
  const [showBalance, setShowBalance] = useState(true);

  // Total successfully delivered
  const totalDelivered = transfers
    .filter((t) => t.status === "delivered")
    .reduce((sum, t) => sum + t.senderAmount, 0);

  // Count of transfers
  const totalTransferCount = transfers.filter((t) => t.status === "delivered").length;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-5 text-white shadow-2xl">
      {/* Background decorative elements */}
      <div className="absolute -top-20 -right-20 w-56 h-56 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-indigo-400/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute top-6 right-6 w-20 h-20 bg-purple-400/10 rounded-full blur-xl pointer-events-none"></div>

      {/* Top row: Label + eye toggle */}
      <div className="relative z-10 flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
            <Wallet className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-xs font-semibold text-indigo-100/80 uppercase tracking-wider">
              Sendora Balance
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowBalance(!showBalance)}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm active:scale-95 transition-all"
          aria-label={showBalance ? "Hide balance" : "Show balance"}
        >
          {showBalance ? (
            <EyeOff className="w-4 h-4 text-indigo-100" />
          ) : (
            <Eye className="w-4 h-4 text-indigo-100" />
          )}
        </button>
      </div>

      {/* Main Balance Display */}
      <div className="relative z-10 mt-3 mb-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg text-indigo-200 font-semibold">$</span>
          {showBalance ? (
            <span
              key={walletBalance}
              className="text-4xl font-black tracking-tight animate-balanceReveal"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {walletBalance.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          ) : (
            <span className="text-4xl font-black tracking-tight flex items-center gap-1">
              <span className="inline-block w-7 h-2.5 bg-white/30 rounded-full animate-shimmer"></span>
              <span className="inline-block w-7 h-2.5 bg-white/30 rounded-full animate-shimmer"></span>
              <span className="inline-block w-7 h-2.5 bg-white/30 rounded-full animate-shimmer"></span>
              <span className="inline-block w-5 h-2.5 bg-white/30 rounded-full animate-shimmer"></span>
            </span>
          )}
        </div>
        <span className="text-xs text-indigo-200/70 font-medium mt-0.5 block">
          Available balance (USD)
        </span>
      </div>

      {/* Total Sent Summary Pill */}
      {totalDelivered > 0 && (
        <div className="relative z-10 mb-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/25 backdrop-blur-sm">
          <Send className="w-3 h-3 text-emerald-400" />
          <span className="text-[11px] font-semibold text-emerald-200">
            {showBalance
              ? `$${totalDelivered.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} sent · ${totalTransferCount} transfer${totalTransferCount !== 1 ? "s" : ""}`
              : "••••• sent"}
          </span>
        </div>
      )}

      {/* Quick Action Buttons */}
      <div className="relative z-10 grid grid-cols-3 gap-2.5">
        <button
          onClick={() => initiateSendFlow()}
          className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-sm active:scale-95 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
            <ArrowUpRight className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-[11px] font-bold text-indigo-100">Send</span>
        </button>

        <button
          onClick={() => navigateTo("transfers")}
          className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-sm active:scale-95 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition-colors">
            <ArrowDownLeft className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="text-[11px] font-bold text-indigo-100">History</span>
        </button>

        <button
          onClick={() => navigateTo("top_up")}
          className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-sm active:scale-95 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-500/25 flex items-center justify-center group-hover:bg-emerald-500/35 transition-colors">
            <Plus className="w-4.5 h-4.5 text-emerald-300" />
          </div>
          <span className="text-[11px] font-bold text-emerald-200">Top Up</span>
        </button>
      </div>
    </div>
  );
};
