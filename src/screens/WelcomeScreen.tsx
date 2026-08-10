"use client";

import React from "react";
import { SendoraLogo } from "@/components/SendoraLogo";
import { ArrowRight, ShieldCheck, Zap, Globe, Sparkles, Lock } from "lucide-react";
import { useApp } from "@/context/AppContext";

export const WelcomeScreen: React.FC = () => {
  const { navigateTo, login } = useApp();

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white min-h-[780px] relative overflow-hidden">
      {/* Subtle Abstract Background Glows */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-12 -left-12 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Logo */}
      <div className="pt-4 flex items-center justify-between z-10">
        <SendoraLogo size="lg" variant="full" />
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          US → KENYA 🇰🇪
        </span>
      </div>

      {/* Main Vector Illustration Graphic */}
      <div className="my-auto py-6 flex flex-col items-center justify-center relative z-10">
        <div className="relative w-64 h-64 flex items-center justify-center">
          {/* Outer Pulsing Orbit */}
          <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-[spin_20s_linear_infinite]"></div>
          <div className="absolute inset-4 rounded-full border border-dashed border-indigo-400/20 animate-[spin_15s_linear_infinite_reverse]"></div>

          {/* Central Money Flow Node Graphic */}
          <div className="relative w-36 h-36 rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-0.5 shadow-2xl shadow-indigo-500/40 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
            <div className="w-full h-full bg-slate-900 rounded-[22px] p-4 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-indigo-300 font-mono">USD 🇺🇸</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div className="my-auto">
                <div className="text-2xl font-black text-white">$100.00</div>
                <div className="text-[10px] text-emerald-400 font-bold mt-0.5">
                  → 12,691.95 KES 🇰🇪
                </div>
              </div>
              <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                <span>1 USD = 129.50 KES</span>
                <span className="text-emerald-400 font-bold">M-Pesa Instant</span>
              </div>
            </div>
          </div>

          {/* Floating Feature Badges */}
          <div className="absolute top-4 -right-2 px-3 py-1.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-white text-[11px] font-bold shadow-lg flex items-center gap-1.5 animate-bounce">
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>Instant M-Pesa</span>
          </div>

          <div className="absolute bottom-6 -left-2 px-3 py-1.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-white text-[11px] font-bold shadow-lg flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>$1.99 Flat Fee</span>
          </div>
        </div>

        {/* Copy Text */}
        <div className="text-center mt-6 space-y-2 max-w-xs">
          <h2 className="text-2xl font-black tracking-tight leading-tight text-white">
            Send money home, simply, safely, instantly.
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Fast, transparent transfers to mobile money and bank accounts across Africa.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4 border-t border-slate-800/80 z-10">
        <button
          onClick={() => navigateTo("register")}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => login("john.doe@sendora.app")}
          className="w-full py-3.5 px-6 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700 active:scale-[0.98] transition-all"
        >
          Log In (Demo Account)
        </button>

        <p className="text-[10px] text-center text-slate-500 font-medium">
          Protected by bank-grade security • Prototype Demo Mode
        </p>
      </div>
    </div>
  );
};
