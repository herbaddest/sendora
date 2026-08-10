"use client";

import React from "react";
import { HeaderBar } from "@/components/HeaderBar";
import { TimelineTracker } from "@/components/TimelineTracker";
import { StatusBadge } from "@/components/StatusBadge";
import { ArrowLeft, Share2, Copy, ShieldCheck, Smartphone, Check } from "lucide-react";
import { useApp } from "@/context/AppContext";

export const TrackingScreen: React.FC = () => {
  const { transfers, selectedTransferId, navigateTo } = useApp();
  const [copied, setCopied] = React.useState(false);

  const transfer = transfers.find((t) => t.id === selectedTransferId) || transfers[0];

  const handleCopyId = () => {
    if (transfer?.id) {
      navigator.clipboard.writeText(transfer.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!transfer) {
    return (
      <div className="flex-1 flex flex-col bg-slate-900 text-white p-6 text-center justify-center">
        <p className="text-sm font-bold text-slate-400">No transfer selected.</p>
        <button onClick={() => navigateTo("home")} className="mt-4 py-2 px-4 bg-indigo-600 rounded-xl text-xs font-bold">
          Go to Home
        </button>
      </div>
    );
  }

  const receiveAmount = Number(transfer.recipientAmount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-white pb-20">
      <HeaderBar title="Track transfer" showBack onBack={() => navigateTo("home")} />

      <div className="p-4 space-y-5 overflow-y-auto flex-1">
        {/* Top Summary Banner */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-900/90 via-indigo-950 to-slate-900 border border-indigo-500/20 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">Transfer ID:</span>
              <button
                onClick={handleCopyId}
                className="font-mono text-xs font-bold text-indigo-300 bg-slate-800/80 px-2 py-0.5 rounded-md hover:text-white flex items-center gap-1"
              >
                <span>{transfer.id}</span>
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <StatusBadge status={transfer.status} />
          </div>

          <div className="pt-2 border-t border-indigo-500/20">
            <div className="text-xs text-slate-400 font-medium">Recipient Receives</div>
            <div className="text-3xl font-black text-white tracking-tight mt-0.5">
              {receiveAmount} {transfer.recipientCurrency}
            </div>
            <div className="text-xs text-emerald-400 font-semibold mt-1">
              To {transfer.recipientName} ({transfer.provider})
            </div>
          </div>
        </div>

        {/* Live Step Timeline */}
        <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700/80 space-y-3 shadow-md">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Transfer Progress Timeline
          </h3>
          <TimelineTracker transfer={transfer} />
        </div>

        {/* Transfer Breakdown Metadata */}
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-2.5 text-xs">
          <h4 className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">Transfer Summary</h4>
          <div className="flex justify-between">
            <span className="text-slate-400">You Sent</span>
            <span className="font-bold font-mono text-white">${Number(transfer.senderAmount).toFixed(2)} USD</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Transfer Fee</span>
            <span className="font-bold font-mono text-emerald-400">${Number(transfer.fee).toFixed(2)} USD</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Exchange Rate</span>
            <span className="font-bold font-mono text-white">1 USD = {Number(transfer.exchangeRate).toFixed(2)} KES</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Delivery Provider</span>
            <span className="font-bold text-white">{transfer.provider} ({transfer.accountNumber})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Date Initiated</span>
            <span className="font-mono text-slate-300">
              {new Date(transfer.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
