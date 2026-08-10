"use client";

import React from "react";
import { Check, Clock, AlertCircle, ArrowRight, Play, RefreshCw, Send, CheckCircle2 } from "lucide-react";
import { Transfer } from "@/types";
import { useApp } from "@/context/AppContext";

interface TimelineTrackerProps {
  transfer: Transfer;
}

export const TimelineTracker: React.FC<TimelineTrackerProps> = ({ transfer }) => {
  const { updateTransferStep } = useApp();

  const steps = [
    {
      step: 1,
      title: "Transfer Created",
      desc: "Transfer details submitted and exchange rate locked",
      time: new Date(transfer.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
    {
      step: 2,
      title: "Payment Received",
      desc: "Payment verified from your linked account",
      time: "Instant",
    },
    {
      step: 3,
      title: "Sending to Recipient",
      desc: `Connecting to ${transfer.provider} gateway in Kenya`,
      time: transfer.currentStep >= 3 ? "In Progress" : "Pending",
    },
    {
      step: 4,
      title: "Delivered to Recipient",
      desc: `Funds deposited into ${transfer.recipientName}'s ${transfer.provider} wallet`,
      time: transfer.currentStep === 4 ? "Completed" : "Estimated ~2 mins",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Visual Timeline Steps */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-700">
        {steps.map((s) => {
          const isDone = transfer.currentStep > s.step || (transfer.currentStep === 4 && s.step === 4);
          const isCurrent = transfer.currentStep === s.step && transfer.currentStep < 4;
          const isPending = transfer.currentStep < s.step;

          return (
            <div key={s.step} className="relative flex items-start gap-3.5 group">
              {/* Bullet Node */}
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold z-10 transition-all ${
                  isDone
                    ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/50"
                    : isCurrent
                    ? "bg-indigo-600 text-white ring-4 ring-indigo-500/20 animate-pulse"
                    : "bg-slate-800 text-slate-500 border border-slate-700"
                }`}
              >
                {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : s.step}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4
                    className={`text-xs font-bold ${
                      isDone
                        ? "text-emerald-400"
                        : isCurrent
                        ? "text-white"
                        : "text-slate-500"
                    }`}
                  >
                    {s.title}
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">{s.time}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Simulation Panel for Prototype Testing */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-white space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
            <Play className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />
            <span>Prototype Status Simulator</span>
          </div>
          <span className="text-[10px] text-indigo-300/80 font-mono">
            Step {transfer.currentStep}/4
          </span>
        </div>

        <p className="text-[11px] text-slate-300 leading-relaxed">
          Test real-time status updates as money flows to Kenya:
        </p>

        <div className="flex gap-2 pt-1">
          {transfer.currentStep < 4 ? (
            <button
              onClick={() => updateTransferStep(transfer.id, transfer.currentStep + 1)}
              className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              <span>Simulate Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Transfer Fully Delivered</span>
            </div>
          )}

          <button
            onClick={() => updateTransferStep(transfer.id, 1, "processing")}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center gap-1"
            title="Restart Simulation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
