"use client";

import React from "react";
import { Recipient } from "@/types";
import { Phone, ArrowUpRight, Smartphone, Building2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface RecipientCardProps {
  recipient: Recipient;
  onSelect?: () => void;
  variant?: "horizontal" | "vertical" | "compact";
}

export const RecipientCard: React.FC<RecipientCardProps> = ({
  recipient,
  onSelect,
  variant = "horizontal",
}) => {
  const { initiateSendFlow } = useApp();

  const handleSend = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect();
    } else {
      initiateSendFlow(recipient);
    }
  };

  const isMpesa = recipient.provider.toLowerCase().includes("mpesa") || recipient.provider.toLowerCase().includes("m-pesa");
  const isAirtel = recipient.provider.toLowerCase().includes("airtel");

  const badgeColor = isMpesa
    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
    : isAirtel
    ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
    : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";

  if (variant === "compact") {
    return (
      <button
        onClick={handleSend}
        className="flex flex-col items-center p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all active:scale-95 group w-24 shrink-0 text-center"
      >
        <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-base shadow-md group-hover:scale-105 transition-transform">
          {recipient.fullName.charAt(0)}
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[9px] font-bold text-indigo-300">
            {isMpesa ? "M" : isAirtel ? "A" : "B"}
          </span>
        </div>
        <span className="text-xs font-bold text-white mt-2 truncate w-full">
          {recipient.fullName.split(" ")[0]}
        </span>
        <span className="text-[10px] text-slate-400 font-medium truncate w-full mt-0.5">
          {recipient.provider}
        </span>
      </button>
    );
  }

  return (
    <div
      onClick={handleSend}
      className="p-4 rounded-2xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 transition-all cursor-pointer flex items-center justify-between group shadow-sm active:scale-[0.99]"
    >
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-base shadow-md group-hover:scale-105 transition-transform">
          {recipient.fullName.charAt(0)}
        </div>

        <div>
          <h3 className="text-sm font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
            {recipient.fullName}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}
            >
              {recipient.provider}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {recipient.accountNumber.length > 10
                ? `•••• ${recipient.accountNumber.slice(-3)}`
                : recipient.accountNumber}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleSend}
        className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all group-hover:scale-110"
        title="Send Money"
      >
        <ArrowUpRight className="w-4 h-4" />
      </button>
    </div>
  );
};
