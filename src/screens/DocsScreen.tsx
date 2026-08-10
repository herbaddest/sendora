"use client";

import React from "react";
import { HeaderBar } from "@/components/HeaderBar";
import { BookOpen, Code, Database, ShieldAlert, Cpu, Terminal, ArrowRight, Layers, CheckCircle2 } from "lucide-react";

export const DocsScreen: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-white pb-20">
      <HeaderBar title="Architecture & Guide" />

      <div className="p-4 space-y-5 overflow-y-auto flex-1 text-xs text-slate-300">
        {/* Prototype Header */}
        <div className="p-4 rounded-3xl bg-indigo-950/60 border border-indigo-500/30 text-white space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-extrabold">SENDORA Prototype Specifications</h2>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            SENDORA is a fullstack mobile remittance application prototype designed for international money transfers from the United States to Kenya (USD → KES).
          </p>
        </div>

        {/* Section 1: Tech Stack */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2.5">
          <h3 className="font-extrabold text-white text-xs flex items-center gap-1.5 uppercase tracking-wider">
            <Code className="w-4 h-4 text-indigo-400" />
            Tech Stack Overview
          </h3>
          <ul className="space-y-1.5 text-slate-300 list-disc list-inside text-[11px]">
            <li><strong className="text-white">Framework:</strong> Next.js 16 (App Router, React 19)</li>
            <li><strong className="text-white">Database:</strong> PostgreSQL + Drizzle ORM</li>
            <li><strong className="text-white">Styling:</strong> Tailwind CSS v4 + Lucide Icons</li>
            <li><strong className="text-white">State Management:</strong> React Context + Persistent Local Sync</li>
            <li><strong className="text-white">Corridor:</strong> US ($ USD) → Kenya (KES)</li>
          </ul>
        </div>

        {/* Section 2: Installation Instructions */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2.5">
          <h3 className="font-extrabold text-white text-xs flex items-center gap-1.5 uppercase tracking-wider">
            <Terminal className="w-4 h-4 text-indigo-400" />
            Installation & Run Commands
          </h3>
          <div className="bg-slate-950 p-3 rounded-xl font-mono text-[10px] text-emerald-400 space-y-1">
            <p># 1. Install dependencies</p>
            <p className="text-slate-200">npm install</p>
            <p># 2. Push PostgreSQL database schema</p>
            <p className="text-slate-200">npx drizzle-kit push</p>
            <p># 3. Start development server</p>
            <p className="text-slate-200">npm run dev</p>
            <p># 4. Production build & start</p>
            <p className="text-slate-200">npm run build && npm run start</p>
          </div>
        </div>

        {/* Section 3: Architecture & Mock Services */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2.5">
          <h3 className="font-extrabold text-white text-xs flex items-center gap-1.5 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-indigo-400" />
            Services & Integration Architecture
          </h3>
          <div className="space-y-2 text-[11px]">
            <p><strong className="text-white">`authService`:</strong> Simulated user registration, login session, KYC level validation.</p>
            <p><strong className="text-white">`transferService`:</strong> Atomic creation of transfers with transaction IDs (`SD-2026-XXXXXX`) and live status progression steps.</p>
            <p><strong className="text-white">`recipientService`:</strong> Management of M-Pesa, Airtel Money, and Bank accounts.</p>
            <p><strong className="text-white">`exchangeRateService`:</strong> Dynamic conversion rates with fee calculations.</p>
          </div>
        </div>

        {/* Section 4: Future Integrations */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2.5">
          <h3 className="font-extrabold text-white text-xs flex items-center gap-1.5 uppercase tracking-wider">
            <Cpu className="w-4 h-4 text-indigo-400" />
            Future Integration Points
          </h3>
          <ul className="space-y-1.5 text-slate-300 text-[11px]">
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-white">Safaricom M-Pesa Daraja API:</strong> B2C payouts endpoint for instant mobile money disbursements.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-white">Plaid / Stripe Financial Connections:</strong> ACH bank debit collection in the US.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-white">Sumsub / Veriff KYC:</strong> Automated passport/ID verification & AML screening.</span>
            </li>
          </ul>
        </div>

        {/* Restriction Disclaimer */}
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">Prototype Restriction:</strong> No real payment processors or banking APIs are connected. All transfers and balances are mock/simulated.
          </div>
        </div>
      </div>
    </div>
  );
};
