"use client";

import React, { useState } from "react";
import { HeaderBar } from "@/components/HeaderBar";
import { ShieldCheck, ArrowRight, Lock, CheckCircle2, Zap, Info, Wallet, AlertTriangle, Plus } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { calculateTransferFee } from "@/lib/feeCalculator";

export const ReviewTransferScreen: React.FC = () => {
  const { sendFlowDraft, navigateTo, confirmAndSendTransfer, walletBalance } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendAmount = sendFlowDraft.sendAmount || 100;
  const fee = sendFlowDraft.fee || calculateTransferFee(sendFlowDraft.sendAmount || 100);
  const totalAmount = Number((sendAmount + fee).toFixed(2));
  const rate = sendFlowDraft.exchangeRate || 129.50;
  const recipientGets = Number((sendAmount * rate).toFixed(2));

  const hasEnoughBalance = walletBalance >= totalAmount;
  const shortfall = Number((totalAmount - walletBalance).toFixed(2));

  const handleConfirm = async () => {
    if (!hasEnoughBalance) return;
    setIsSubmitting(true);
    navigateTo("processing");
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-white pb-20">
      <HeaderBar title="Review transfer" showBack onBack={() => navigateTo("send_money")} />

      <div className="p-4 space-y-5 overflow-y-auto flex-1">
        {/* Main Review Summary Card */}
        <div className="p-5 rounded-3xl bg-slate-800/90 border border-slate-700/80 shadow-xl space-y-4">
          <div className="text-center pb-4 border-b border-slate-700">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Recipient Receives
            </span>
            <div className="text-3xl font-black text-emerald-400 tracking-tight mt-1">
              {recipientGets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} KES
            </div>
            <span className="text-xs text-indigo-300 font-semibold mt-1 inline-block">
              To {sendFlowDraft.recipientName} ({sendFlowDraft.provider})
            </span>
          </div>

          {/* Breakdown Rows */}
          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">You send</span>
              <span className="font-bold text-white font-mono">${sendAmount.toFixed(2)} USD</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Transfer fee</span>
              <span className="font-bold text-emerald-400 font-mono">${fee.toFixed(2)} USD</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Exchange rate</span>
              <span className="font-bold text-white font-mono">1 USD = {rate.toFixed(2)} KES</span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-700">
              <span className="text-slate-200 font-bold">Total charge</span>
              <span className="font-extrabold text-indigo-300 text-sm font-mono">${totalAmount.toFixed(2)} USD</span>
            </div>
          </div>
        </div>

        {/* Wallet Balance Card */}
        <div className={`p-3.5 rounded-2xl flex items-center justify-between ${
          hasEnoughBalance
            ? "bg-emerald-500/10 border border-emerald-500/20"
            : "bg-rose-500/10 border border-rose-500/30"
        }`}>
          <div className="flex items-center gap-2.5">
            <Wallet className={`w-5 h-5 ${hasEnoughBalance ? "text-emerald-400" : "text-rose-400"}`} />
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Wallet Balance
              </span>
              <span className={`text-sm font-black ${hasEnoughBalance ? "text-emerald-400" : "text-rose-400"}`}>
                ${walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
              </span>
            </div>
          </div>
          {hasEnoughBalance ? (
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-full">
              ✓ Sufficient
            </span>
          ) : (
            <button
              onClick={() => navigateTo("top_up")}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Top Up</span>
            </button>
          )}
        </div>

        {/* Insufficient Balance Warning */}
        {!hasEnoughBalance && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-bold text-rose-300">Insufficient balance.</span>
              <span className="text-rose-200/80"> You need ${shortfall.toFixed(2)} more to complete this transfer. </span>
              <button
                onClick={() => navigateTo("top_up")}
                className="text-emerald-400 font-bold underline underline-offset-2 hover:text-emerald-300"
              >
                Top up now
              </button>
            </div>
          </div>
        )}

        {/* Recipient & Method Card */}
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2.5 text-xs">
          <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Delivery Details</h4>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Recipient Name</span>
            <span className="font-bold text-white">{sendFlowDraft.recipientName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Delivery Method</span>
            <span className="font-bold text-emerald-400">{sendFlowDraft.provider} Mobile Wallet</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Account / Phone</span>
            <span className="font-mono text-white">{sendFlowDraft.phone}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Delivery Time</span>
            <span className="font-bold text-emerald-400">Instantly (~2 minutes)</span>
          </div>
        </div>

        {/* Security Reassurance Indicator */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">Your transfer details are protected with 256-bit encryption.</span>
        </div>

        {/* Primary CTA Button */}
        <button
          onClick={handleConfirm}
          disabled={isSubmitting || !hasEnoughBalance}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
        >
          <Lock className="w-4 h-4 text-indigo-200" />
          <span>{hasEnoughBalance ? `Confirm & Send $${totalAmount.toFixed(2)} USD` : "Insufficient Balance"}</span>
        </button>
      </div>
    </div>
  );
};
