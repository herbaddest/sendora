"use client";

import React from "react";
import { HeaderBar } from "@/components/HeaderBar";
import { BalanceCard } from "@/components/BalanceCard";
import { ExchangeRateCard } from "@/components/ExchangeRateCard";
import { RecipientCard } from "@/components/RecipientCard";
import { TransferCard } from "@/components/TransferCard";
import { Plus, ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { useApp } from "@/context/AppContext";

export const HomeScreen: React.FC = () => {
  const { recipients, transfers, navigateTo, initiateSendFlow } = useApp();

  const quickRecipients = recipients.slice(0, 3);
  const recentTransfers = transfers.slice(0, 4);

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-white pb-20">
      <HeaderBar />

      <div className="p-4 space-y-6 overflow-y-auto flex-1">
        {/* Safaricom-style Balance Card */}
        <BalanceCard />

        {/* Exchange Rate Card */}
        <ExchangeRateCard />

        {/* Quick Send Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-indigo-400" />
              Quick send
            </h2>
            <button
              onClick={() => navigateTo("recipients")}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-0.5"
            >
              <span>See all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
            {/* Add Recipient Quick Button */}
            <button
              onClick={() => navigateTo("choose_recipient")}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-dashed border-indigo-500/40 text-indigo-300 transition-all active:scale-95 w-24 h-[92px] shrink-0 text-center group"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-600/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="text-[11px] font-bold mt-1">Add Recipient</span>
            </button>

            {quickRecipients.map((rec) => (
              <RecipientCard key={rec.id} recipient={rec} variant="compact" />
            ))}
          </div>
        </div>

        {/* Recent Transfers Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold tracking-tight text-white">Recent transfers</h2>
            <button
              onClick={() => navigateTo("transfers")}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-0.5"
            >
              <span>View history</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentTransfers.map((transfer) => (
              <TransferCard key={transfer.id} transfer={transfer} />
            ))}
          </div>
        </div>

        {/* Corridor Trust Reassurance Card */}
        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Direct M-Pesa & Bank Delivery</h4>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              Transfers to Kenya arrive in seconds with instant SMS confirmation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
