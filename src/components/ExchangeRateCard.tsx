"use client";

import React from "react";
import { ArrowUpRight, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import { useApp } from "@/context/AppContext";

export const ExchangeRateCard: React.FC = () => {
  const { getRateFor, initiateSendFlow } = useApp();
  const rate = getRateFor("KES");

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-500/20 p-5 text-white shadow-xl group">
      {/* Decorative Glow */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/30 transition-all pointer-events-none"></div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            USD → KES
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Updated just now
          </span>
        </div>

        <div className="text-[10px] text-indigo-200/80 bg-slate-800/60 px-2 py-0.5 rounded-md font-mono">
          Fees from $0.99
        </div>
      </div>

      {/* Main Rate Value */}
      <div className="my-3">
        <div className="text-xs text-indigo-200 font-medium">Guaranteed Exchange Rate</div>
        <div className="text-3xl font-extrabold tracking-tight mt-0.5 flex items-baseline gap-2">
          <span>1 USD = {rate.toFixed(2)} KES</span>
        </div>
      </div>

      {/* Primary CTA */}
      <div className="pt-2">
        <button
          onClick={() => initiateSendFlow()}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
        >
          <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
          <span>Send Money Now</span>
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>

        <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-indigo-200/80 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Fast, secure and transparent • Zero hidden markup</span>
        </div>
      </div>
    </div>
  );
};
