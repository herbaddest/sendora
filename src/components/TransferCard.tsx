"use client";

import React from "react";
import { Transfer } from "@/types";
import { StatusBadge } from "@/components/StatusBadge";
import { ArrowUpRight, ChevronRight, Smartphone } from "lucide-react";
import { useApp } from "@/context/AppContext";

interface TransferCardProps {
  transfer: Transfer;
  onSelect?: () => void;
}

export const TransferCard: React.FC<TransferCardProps> = ({ transfer, onSelect }) => {
  const { setSelectedTransferId, navigateTo } = useApp();

  const handleCardClick = () => {
    setSelectedTransferId(transfer.id);
    if (onSelect) {
      onSelect();
    } else {
      navigateTo("tracking");
    }
  };

  const formattedAmount = Number(transfer.recipientAmount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedSender = Number(transfer.senderAmount).toFixed(2);

  const formattedDate = new Date(transfer.createdAt).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      onClick={handleCardClick}
      className="p-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all cursor-pointer flex items-center justify-between group active:scale-[0.99] shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-slate-700/60 border border-slate-600/50 flex items-center justify-center text-indigo-400 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-all">
          <ArrowUpRight className="w-5 h-5" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
              {transfer.recipientName}
            </h4>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {transfer.provider} • {transfer.accountNumber} • {formattedDate}
          </p>
        </div>
      </div>

      <div className="text-right">
        <div className="text-sm font-extrabold text-white tracking-tight">
          {formattedAmount} {transfer.recipientCurrency}
        </div>
        <div className="text-[11px] text-slate-400 font-medium flex items-center justify-end gap-1.5 mt-0.5">
          <span>${formattedSender} USD</span>
          <StatusBadge status={transfer.status} size="sm" />
        </div>
      </div>
    </div>
  );
};
