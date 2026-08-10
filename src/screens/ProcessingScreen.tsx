"use client";

import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, Clock, ShieldCheck, ArrowRight, Sparkles, RefreshCw, Send } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Transfer } from "@/types";

export const ProcessingScreen: React.FC = () => {
  const { confirmAndSendTransfer, navigateTo, setSelectedTransferId } = useApp();
  const [stage, setStep] = useState<"verifying" | "securing" | "completed">("verifying");
  const [createdTransfer, setCreatedTransfer] = useState<Transfer | null>(null);

  useEffect(() => {
    let mounted = true;

    const runProcess = async () => {
      // Step 1: Verifying
      await new Promise((r) => setTimeout(r, 1200));
      if (!mounted) return;
      setStep("securing");

      // Step 2: Securing rate & executing
      await new Promise((r) => setTimeout(r, 1400));
      if (!mounted) return;

      const t = await confirmAndSendTransfer();
      setCreatedTransfer(t);
      setSelectedTransferId(t.id);
      setStep("completed");

      // Fire confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.log("Confetti trigger", e);
      }
    };

    runProcess();

    return () => {
      mounted = false;
    };
  }, []);

  if (stage !== "completed") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-900 text-white text-center space-y-6 min-h-[720px]">
        {/* Animated Processing Spinner Ring */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-purple-500 border-b-transparent border-l-transparent animate-spin"></div>
          <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 font-bold shadow-lg">
            <Send className="w-8 h-8 animate-pulse" />
          </div>
        </div>

        <div className="space-y-2 max-w-xs">
          <h2 className="text-xl font-extrabold tracking-tight text-white">
            {stage === "verifying" ? "Securing Transfer Connection..." : "Connecting to M-Pesa Gateway..."}
          </h2>
          <p className="text-xs text-slate-400">
            {stage === "verifying"
              ? "Verifying payment details and locking current rate"
              : "Transmitting encrypted payload to Safaricom Kenya"}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-xs font-mono text-indigo-300">
          Encrypted Session ID: SD-SEC-2026
        </div>
      </div>
    );
  }

  const receiveAmount = createdTransfer
    ? Number(createdTransfer.recipientAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "12,691.95";

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white text-center min-h-[720px] animate-fadeIn">
      <div className="pt-6 space-y-4 my-auto">
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight text-white">
            Your transfer is on its way 🎉
          </h2>
          <p className="text-xs text-slate-300 font-medium">
            Funds will be deposited into {createdTransfer?.recipientName}'s account shortly.
          </p>
        </div>

        {/* Transfer Confirmation Voucher */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 text-left space-y-3.5 shadow-2xl max-w-xs mx-auto">
          <div className="text-center pb-3 border-b border-slate-800">
            <div className="text-2xl font-black text-emerald-400">
              {receiveAmount} {createdTransfer?.recipientCurrency || "KES"}
            </div>
            <span className="text-[11px] text-slate-400 font-mono mt-0.5 inline-block">
              Transfer ID: {createdTransfer?.id || "SD-2026-892104"}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Recipient</span>
              <span className="font-bold text-white">{createdTransfer?.recipientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Provider</span>
              <span className="font-bold text-emerald-400">{createdTransfer?.provider || "M-Pesa"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status</span>
              <span className="font-bold text-indigo-400 flex items-center gap-1">
                <Clock className="w-3 h-3 animate-spin" />
                Processing
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="space-y-2.5 pt-4 border-t border-slate-800">
        <button
          onClick={() => navigateTo("tracking")}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span>Track Transfer Progress</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => navigateTo("home")}
          className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};
