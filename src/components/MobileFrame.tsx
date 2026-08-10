"use client";

import React from "react";

export const MobileFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <main className="flex-1 flex items-center justify-center p-0 md:p-6 overflow-hidden">
        <div className="w-full max-w-lg min-h-screen md:min-h-[90vh] bg-slate-900 border-0 md:border md:border-slate-800 md:rounded-3xl overflow-hidden shadow-2xl flex flex-col relative">
          {children}
        </div>
      </main>
    </div>
  );
};
