"use client";

import React, { useState } from "react";
import { HeaderBar } from "@/components/HeaderBar";
import { ArrowRight, UserCheck, Smartphone, DollarSign, Calculator, Info, ShieldCheck, Zap, ChevronRight, Wallet, AlertTriangle, Plus } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { calculateTransferFee } from "@/lib/feeCalculator";

export const SendMoneyScreen: React.FC = () => {
  const { sendFlowDraft, updateSendDraft, navigateTo, getRateFor, recipients, walletBalance } = useApp();

  const currentRate = getRateFor(sendFlowDraft.recipientCurrency);
  const sendAmount = sendFlowDraft.sendAmount || 100;
  const fee = calculateTransferFee(sendAmount);
  const receiveAmount = Number((sendAmount * currentRate).toFixed(2));
  const totalCharged = Number((sendAmount + fee).toFixed(2));

  const hasEnoughBalance = walletBalance >= totalCharged;
  const shortfall = Number((totalCharged - walletBalance).toFixed(2));

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    updateSendDraft({ sendAmount: isNaN(val) ? 0 : val });
  };

  const selectedRecipient = recipients.find((r) => r.id === sendFlowDraft.recipientId) || recipients[0];

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-white pb-20">
      <HeaderBar title="Send money" showBack onBack={() => navigateTo("home")} />

      <div className="p-4 space-y-5 overflow-y-auto flex-1">
        {/* Wallet Balance Strip */}
        <div className={`p-3.5 rounded-2xl flex items-center justify-between ${
          hasEnoughBalance
            ? "bg-slate-800/60 border border-slate-700/60"
            : "bg-rose-500/10 border border-rose-500/30"
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              hasEnoughBalance ? "bg-indigo-500/20" : "bg-rose-500/20"
            }`}>
              <Wallet className={`w-4.5 h-4.5 ${hasEnoughBalance ? "text-indigo-400" : "text-rose-400"}`} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Wallet Balance
              </span>
              <span className={`text-base font-black ${hasEnoughBalance ? "text-white" : "text-rose-400"}`}>
                ${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigateTo("top_up")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Top Up</span>
          </button>
        </div>

        {/* Recipient Selection Card */}
        <div
          onClick={() => navigateTo("choose_recipient")}
          className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-base shadow-md">
              {selectedRecipient?.fullName.charAt(0) || "M"}
            </div>
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                Recipient
              </span>
              <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                {selectedRecipient?.fullName || "Mary Wanjiku"}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {selectedRecipient?.provider || "M-Pesa"} • {selectedRecipient?.accountNumber || "+254 712 345 234"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-indigo-400 font-semibold">
            <span>Change</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>

        {/* Enter Amount Inputs */}
        <div className="space-y-3">
          {/* Send USD Input */}
          <div className="p-4 rounded-2xl bg-slate-800 border border-indigo-500/30 focus-within:border-indigo-500 transition-all shadow-md">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1">
              <span>You send</span>
              <span className="text-indigo-300">USD (United States Dollar)</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-baseline font-black text-2xl text-white">
                <span className="text-slate-400 mr-1">$</span>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={sendAmount || ""}
                  onChange={handleAmountChange}
                  className="w-full bg-transparent text-white font-extrabold text-2xl focus:outline-none"
                  placeholder="100"
                />
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-700/80 border border-slate-600 text-xs font-bold text-white shrink-0">
                <span>🇺🇸 USD</span>
              </div>
            </div>
          </div>

          {/* Recipient Gets KES Display */}
          <div className="p-4 rounded-2xl bg-slate-800/90 border border-emerald-500/30 shadow-md">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-1">
              <span>Recipient gets</span>
              <span className="text-emerald-400">KES (Kenyan Shilling)</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="font-extrabold text-2xl text-emerald-400 tracking-tight">
                {receiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-300 shrink-0">
                <span>🇰🇪 KES</span>
              </div>
            </div>
          </div>
        </div>

        {/* Transparent Fee & Breakdown Details */}
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-2.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Exchange rate</span>
            <span className="font-bold text-white font-mono">1 USD = {currentRate.toFixed(2)} KES</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium">Transfer fee</span>
            <span className="font-bold text-emerald-400">${fee.toFixed(2)} USD</span>
          </div>

          <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-700">
            <span className="text-slate-300 font-bold">Total charge</span>
            <span className="font-extrabold text-indigo-300 text-sm font-mono">${totalCharged.toFixed(2)} USD</span>
          </div>
        </div>

        {/* Insufficient Balance Warning */}
        {sendAmount > 0 && !hasEnoughBalance && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-bold text-rose-300">Insufficient balance.</span>
              <span className="text-rose-200/80"> You need ${shortfall.toFixed(2)} more. </span>
              <button
                onClick={() => navigateTo("top_up")}
                className="text-emerald-400 font-bold underline underline-offset-2 hover:text-emerald-300"
              >
                Top up your wallet
              </button>
            </div>
          </div>
        )}

        {/* Calculation Explanation */}
        <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-200 text-xs flex items-start gap-2.5">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-white">Calculation:</span> ${sendAmount} USD × {currentRate.toFixed(2)} = {receiveAmount.toLocaleString()} KES. Exchange rate is locked for 15 minutes.
          </div>
        </div>

        {/* Primary CTA */}
        <button
          onClick={() => {
            updateSendDraft({
              sendAmount,
              fee: calculateTransferFee(sendAmount),
              exchangeRate: currentRate,
            });
            navigateTo("review_transfer");
          }}
          disabled={sendAmount <= 0 || !hasEnoughBalance}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
        >
          <span>Continue to Review</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
