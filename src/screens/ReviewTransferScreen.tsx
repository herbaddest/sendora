"use client";

import React, { useState } from "react";
import { HeaderBar } from "@/components/HeaderBar";
import { ShieldCheck, ArrowRight, Lock, CheckCircle2, Zap, Info } from "lucide-react";
import { useApp } from "@/context/AppContext";

export const ReviewTransferScreen: React.FC = () => {
  const { sendFlowDraft, navigateTo, confirmAndSendTransfer } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendAmount = sendFlowDraft.sendAmount || 100;
  const fee = sendFlowDraft.fee || 1.99;
  const totalAmount = Number((sendAmount + fee).toFixed(2));
  const rate = sendFlowDraft.exchangeRate || 129.50;
  const recipientGets = Number((sendAmount * rate).toFixed(2));

  const handleConfirm = async () => {
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
          disabled={isSubmitting}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Lock className="w-4 h-4 text-indigo-200" />
          <span>Confirm & Send ${totalAmount.toFixed(2)} USD</span>
        </button>
      </div>
    </div>
  );
};
