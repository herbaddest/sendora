"use client";

import React, { useState } from "react";
import { HeaderBar } from "@/components/HeaderBar";
import { User, ShieldCheck, Bell, HelpCircle, FileText, Lock, LogOut, ChevronRight, Sparkles, Check, Database } from "lucide-react";
import { useApp } from "@/context/AppContext";

export const ProfileScreen: React.FC = () => {
  const { user, logout, resetAllDemoData, navigateTo } = useApp();
  const [showToast, setShowToast] = useState<string | null>(null);

  const triggerNotice = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2500);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-white pb-20">
      <HeaderBar title="Profile & Settings" />

      <div className="p-4 space-y-5 overflow-y-auto flex-1">
        {/* User Card */}
        <div className="p-5 rounded-3xl bg-slate-800/90 border border-slate-700/80 shadow-xl flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-2xl shadow-md border-2 border-indigo-400/40">
            {user?.fullName?.charAt(0) || "J"}
          </div>
          <div className="flex-1">
            <h2 className="text-base font-extrabold text-white tracking-tight">{user?.fullName || "John Doe"}</h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">{user?.phone || "+1 (555) 234-5678"}</p>
            <p className="text-xs text-indigo-300 font-mono">{user?.email || "john.doe@sendora.app"}</p>
          </div>
        </div>

        {showToast && (
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-400" />
            {showToast}
          </div>
        )}

        {/* Section 1: Account & Security */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account & Security</h3>
          <div className="rounded-2xl bg-slate-800/60 border border-slate-700/60 divide-y divide-slate-700/60 overflow-hidden">
            <button
              onClick={() => triggerNotice("KYC Verification: Verified Level 2")}
              className="w-full p-3.5 flex items-center justify-between text-xs hover:bg-slate-800 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold text-white">Identity Verification (KYC)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                  Verified
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            </button>

            <button
              onClick={() => triggerNotice("Security Settings: 2FA Enabled")}
              className="w-full p-3.5 flex items-center justify-between text-xs hover:bg-slate-800 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-white">Two-Factor Passcode & Biometrics</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => triggerNotice("Notifications updated")}
              className="w-full p-3.5 flex items-center justify-between text-xs hover:bg-slate-800 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-white">Push & SMS Transfer Notifications</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Section 2: Support & Legal */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Support & Legal</h3>
          <div className="rounded-2xl bg-slate-800/60 border border-slate-700/60 divide-y divide-slate-700/60 overflow-hidden">
            <button
              onClick={() => navigateTo("docs")}
              className="w-full p-3.5 flex items-center justify-between text-xs hover:bg-slate-800 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-white">Developer Guide & Architecture</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => triggerNotice("SENDORA Terms of Service v2026.1")}
              className="w-full p-3.5 flex items-center justify-between text-xs hover:bg-slate-800 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-white">Terms of Service</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>

            <button
              onClick={() => triggerNotice("SENDORA Privacy Policy - Encrypted")}
              className="w-full p-3.5 flex items-center justify-between text-xs hover:bg-slate-800 text-left transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-white">Privacy Policy</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Section 3: Reset Demo State & Logout */}
        <div className="space-y-2 pt-2">
          <button
            onClick={async () => {
              if (confirm("Reset demo data to factory state?")) {
                await resetAllDemoData();
                triggerNotice("Demo database reset!");
              }
            }}
            className="w-full py-3 px-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-indigo-300 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <Database className="w-4 h-4 text-indigo-400" />
            <span>Reset Demo Sandbox State</span>
          </button>

          <button
            onClick={logout}
            className="w-full py-3.5 px-4 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-extrabold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
